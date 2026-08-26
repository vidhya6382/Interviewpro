import re
import ast
import traceback
import uuid

from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

from .models import (
    EmailOTP, PasswordResetToken, Question, Submission, UserProfile,
    encrypt_email, encrypt_phone, hash_email, hash_phone,
)
from .serializers import (
    LoginSerializer, PasswordResetConfirmSerializer, PasswordResetRequestSerializer,
    RegisterSerializer, UserOutSerializer, VerifyOTPSerializer,
)


@api_view(['GET'])
def get_question(request, slug):
    try:
        q = Question.objects.get(slug=slug)
        data = {
            "id": q.slug,
            "title": q.title,
            "difficulty": q.difficulty,
            "category": q.category,
            "topic": q.topic,
            "company_tags": q.company_tags,
            "description": q.description,
            "sample_input": q.sample_input,
            "sample_output": q.sample_output,
            "constraints": q.constraints,
            "hints": q.hints,
            "starter_code": q.starter_code,
            "language_id": q.language_id
        }
        return Response(data)
    except Question.DoesNotExist:
        return Response({"error": "Question not found"}, status=404)


@api_view(['POST'])
def submit_code(request):
    slug = request.data.get('question_id')
    code = request.data.get('code', '')
    try:
        q = Question.objects.get(slug=slug)
    except:
        return Response({"status": "Wrong", "reason": "Question not found"})

    testcases = q.testcases.all().order_by('order')
    if not testcases.exists():
        return Response({"status": "Wrong", "reason": "No testcases for this question"})

    local_env = {}
    try:
        exec(code, {}, local_env)
    except Exception as e:
        return Response({"status": "Wrong", "reason": f"Compile Error: {e}"})

    match = re.search(r'def\s+(\w+)\s*\(', code)
    if not match:
        return Response({"status": "Wrong", "reason": "No function found"})

    func = local_env.get(match.group(1))
    if not func:
        return Response({"status": "Wrong", "reason": "Function not callable"})

    current_user = request.user if request.user and request.user.is_authenticated else None

    for tc in testcases:
        inp = tc.input_data.strip()
        expected = tc.expected_output.strip()
        try:
            if '\n' in inp:
                args = [ast.literal_eval(x) for x in inp.split('\n') if x.strip()]
                result = func(*args)
            else:
                args = ast.literal_eval(f"({inp})" if ',' in inp else inp)
                result = func(*args) if isinstance(args, tuple) else func(args)

            exp_val = ast.literal_eval(expected)
            if result != exp_val:
                Submission.objects.create(user=current_user, question=q, code=code, status="Wrong", score=0)
                return Response({"status": "Wrong", "score": 0, "reason": f"Expected {exp_val} got {result}"})
        except Exception as e:
            Submission.objects.create(user=current_user, question=q, code=code, status="Wrong", score=0)
            return Response({"status": "Wrong", "reason": f"Runtime Error: {str(e)}"})

    Submission.objects.create(user=current_user, question=q, code=code, status="Correct", score=10)
    return Response({"status": "Correct", "score": 10, "message": "All test cases passed!"})


@api_view(['GET'])
def list_questions(request):
    qs = Question.objects.all().order_by('id')
    data = [
        {
            "id": q.id,
            "slug": q.slug,
            "title": q.title,
            "difficulty": q.difficulty,
            "category": q.category,
            "topic": q.topic,
            "company_tags": q.company_tags,
        }
        for q in qs
    ]
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_progress(request):
    questions = Question.objects.all().order_by('id')

    subs = Submission.objects.filter(user=request.user).order_by('-created_at')
    latest_by_question = {}
    for s in subs:
        if s.question_id not in latest_by_question:
            latest_by_question[s.question_id] = s

    results = []
    solved_count = 0
    for q in questions:
        sub = latest_by_question.get(q.id)
        is_solved = bool(sub and sub.status == 'Correct')
        if is_solved:
            solved_count += 1
        results.append({
            "id": q.id,
            "slug": q.slug,
            "title": q.title,
            "difficulty": q.difficulty,
            "category": q.category,
            "solved": is_solved,
            "last_status": sub.status if sub else None,
            "last_score": sub.score if sub else 0,
            "last_code": sub.code if sub else None,
            "last_submitted_at": sub.created_at if sub else None,
        })

    return Response({
        "total_questions": questions.count(),
        "solved_count": solved_count,
        "questions": results,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    try:
        profile = request.user.profile
        full_name = profile.full_name
    except UserProfile.DoesNotExist:
        full_name = ''
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "full_name": full_name,
    })


def _send_otp_email(plain_email, code):
    send_mail(
        subject='Your verification code',
        message=f'Your one-time code is {code}. It expires in {EmailOTP.VALID_MINUTES} minutes. Do not share this code with anyone.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[plain_email],
    )


def _tokens_for(user):
    refresh = RefreshToken.for_user(user)
    return {'access': str(refresh.access_token), 'refresh': str(refresh)}


def _get_profile_by_username(username):
    return UserProfile.objects.select_related('user').get(user__username=username)


def _find_profile_by_identifier(identifier: str):
    identifier = identifier.strip()
    if '@' in identifier:
        try:
            return UserProfile.objects.select_related('user').get(email_hash=hash_email(identifier))
        except UserProfile.DoesNotExist:
            return None
    try:
        return UserProfile.objects.select_related('user').get(phone_hash=hash_phone(identifier))
    except UserProfile.DoesNotExist:
        return None

class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'otp'

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        django_user = User.objects.create_user(
            username=data['username'],
            password=data['password'],
            is_active=False,
        )
        profile = UserProfile.objects.create(
            user=django_user,
            email_encrypted=encrypt_email(data['email']),
            email_hash=hash_email(data['email']),
            full_name=data.get('full_name', ''),
        )
        if data.get('phone'):
            profile.phone_encrypted = encrypt_phone(data['phone'])
            profile.phone_hash = hash_phone(data['phone'])
            profile.save(update_fields=['phone_encrypted', 'phone_hash'])

        otp, code = EmailOTP.generate(profile, purpose='register')
        _send_otp_email(data['email'], code)

        return Response(
            {'message': 'Account created. Check your email for a verification code.'},
            status=status.HTTP_201_CREATED,
        )


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'otp'

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        code = serializer.validated_data['code']

        try:
            profile = _get_profile_by_username(username)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Invalid or expired code.'}, status=status.HTTP_400_BAD_REQUEST)

        otp = profile.otps.filter(purpose='register', consumed=False).order_by('-created_at').first()
        if not otp or not otp.is_valid(code):
            return Response({'error': 'Invalid or expired code.'}, status=status.HTTP_400_BAD_REQUEST)

        otp.consumed = True
        otp.save(update_fields=['consumed'])
        profile.is_verified = True
        profile.save(update_fields=['is_verified'])
        profile.user.is_active = True
        profile.user.save(update_fields=['is_active'])

        tokens = _tokens_for(profile.user)
        return Response({
            'message': 'Email verified.',
            'tokens': tokens,
            'user': UserOutSerializer({
                'id': profile.user.id, 'username': profile.user.username,
                'full_name': profile.full_name, 'is_verified': True,
            }).data,
        })


class ResendOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'otp'

    def post(self, request):
        username = request.data.get('username', '')
        try:
            profile = _get_profile_by_username(username)
        except UserProfile.DoesNotExist:
            return Response({'message': 'If that account exists, a new code has been sent.'})

        if profile.is_verified:
            return Response({'message': 'If that account exists, a new code has been sent.'})

        otp, code = EmailOTP.generate(profile, purpose='register')
        _send_otp_email(profile.email, code)
        return Response({'message': 'If that account exists, a new code has been sent.'})


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'

    GENERIC_ERROR = 'Invalid username or password.'

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        try:
            profile = _get_profile_by_username(username)
        except UserProfile.DoesNotExist:
            return Response({'error': self.GENERIC_ERROR}, status=status.HTTP_401_UNAUTHORIZED)

        if not profile.user.check_password(password):
            return Response({'error': self.GENERIC_ERROR}, status=status.HTTP_401_UNAUTHORIZED)

        if not profile.user.is_active or not profile.is_verified:
            return Response({'error': 'Please verify your email before logging in.'}, status=status.HTTP_403_FORBIDDEN)

        tokens = _tokens_for(profile.user)
        return Response({
            'tokens': tokens,
            'user': UserOutSerializer({
                'id': profile.user.id, 'username': profile.user.username,
                'full_name': profile.full_name, 'is_verified': True,
            }).data,
        })


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'

    def post(self, request):
        credential = request.data.get('credential')
        if not credential:
            return Response({'error': 'Missing Google credential.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = google_id_token.verify_oauth2_token(
                credential, google_requests.Request(), settings.GOOGLE_CLIENT_ID
            )
        except ValueError:
            return Response({'error': 'Invalid Google token.'}, status=status.HTTP_400_BAD_REQUEST)

        email = idinfo.get('email')
        if not email or not idinfo.get('email_verified'):
            return Response({'error': 'Google account email is not verified.'}, status=status.HTTP_400_BAD_REQUEST)
        full_name = idinfo.get('name', '')

        try:
            profile = UserProfile.objects.select_related('user').get(email_hash=hash_email(email))
            django_user = profile.user
        except UserProfile.DoesNotExist:
            base_username = email.split('@')[0][:20]
            username = base_username
            suffix = 1
            while User.objects.filter(username=username).exists():
                suffix += 1
                username = f'{base_username}{suffix}'

            django_user = User.objects.create_user(username=username, is_active=True)
            django_user.set_unusable_password()
            django_user.save()

            profile = UserProfile.objects.create(
                user=django_user,
                email_encrypted=encrypt_email(email),
                email_hash=hash_email(email),
                full_name=full_name,
                is_verified=True,
            )

        if not django_user.is_active:
            django_user.is_active = True
            django_user.save(update_fields=['is_active'])
        if not profile.is_verified:
            profile.is_verified = True
            profile.save(update_fields=['is_verified'])

        tokens = _tokens_for(django_user)
        return Response({
            'tokens': tokens,
            'user': UserOutSerializer({
                'id': django_user.id, 'username': django_user.username,
                'full_name': profile.full_name, 'is_verified': True,
            }).data,
        })

GENERIC_RESET_MESSAGE = 'If an account matches those details, a reset link has been emailed to the address on file.'


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'otp'

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identifier = serializer.validated_data['identifier']

        profile = _find_profile_by_identifier(identifier)
        if profile is None:
            return Response({'message': GENERIC_RESET_MESSAGE})

        _, raw_token = PasswordResetToken.generate(profile)
        reset_link = f'{settings.FRONTEND_URL}/reset-password?token={raw_token}'
        send_mail(
            subject='Reset your password',
            message=(
                f'We received a request to reset your password.\n\n'
                f'Click this link within {PasswordResetToken.VALID_MINUTES} minutes to choose a new password:\n'
                f'{reset_link}\n\n'
                f'If you did not request this, you can safely ignore this email.'
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[profile.email],
        )
        return Response({'message': GENERIC_RESET_MESSAGE})


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'otp'

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        reset_token = PasswordResetToken.find_valid(token)
        if reset_token is None:
            return Response({'error': 'This reset link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        user = reset_token.profile.user
        user.set_password(new_password)
        user.save(update_fields=['password'])

        reset_token.consumed = True
        reset_token.save(update_fields=['consumed'])

        return Response({'message': 'Password updated. You can now log in.'})