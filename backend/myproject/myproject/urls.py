from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # Simple - user create
        User.objects.create_user(username=data['username'], email=data.get('email',''), password=data['password'])
        return JsonResponse({"message": "Registered, OTP: 123456"})
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def verify_otp(request):
    return JsonResponse({"message": "Verified", "access": "dummy_access_token", "refresh": "dummy_refresh"})

@csrf_exempt
def resend_otp(request): return JsonResponse({"message": "OTP resent: 123456"})
@csrf_exempt
def login_view(request): return JsonResponse({"access": "dummy_access_token", "refresh": "dummy_refresh"})
@csrf_exempt
def google_login(request): return JsonResponse({"access": "dummy_access_token", "refresh": "dummy_refresh"})
@csrf_exempt
def pw_req(request): return JsonResponse({"message": "Reset link sent"})
@csrf_exempt
def pw_confirm(request): return JsonResponse({"message": "Password reset success"})
def health(request): return JsonResponse({"status": "Backend running da!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', health),
    path('api/auth/register/', register),
    path('api/auth/verify-otp/', verify_otp),
    path('api/auth/resend-otp/', resend_otp),
    path('api/auth/login/', login_view),
    path('api/auth/google/', google_login),
    path('api/auth/password-reset/request/', pw_req),
    path('api/auth/password-reset/confirm/', pw_confirm),
]