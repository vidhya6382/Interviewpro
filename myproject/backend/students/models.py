import hashlib
import hmac
import random
import secrets
from datetime import timedelta

from cryptography.fernet import Fernet
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class Question(models.Model):
    DIFFICULTY = [('Easy', 'Easy'), ('Medium', 'Medium'), ('Hard', 'Hard')]
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY)
    category = models.CharField(max_length=50)
    topic = models.CharField(max_length=100)
    company_tags = models.JSONField(default=list)
    description = models.TextField()
    sample_input = models.TextField()
    sample_output = models.TextField()
    constraints = models.TextField()
    hints = models.TextField(blank=True)
    starter_code = models.TextField(default="def twoSum(nums, target):\n # write code")
    language_id = models.IntegerField(default=71)

    def __str__(self):
        return self.slug


class TestCase(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='testcases')
    input_data = models.TextField()
    expected_output = models.TextField()
    is_hidden = models.BooleanField(default=True)
    order = models.IntegerField(default=0)


class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='submissions')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    code = models.TextField()
    status = models.CharField(max_length=10)
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

def _fernet():
    return Fernet(settings.EMAIL_ENCRYPTION_KEY)


def encrypt_email(plain_email: str) -> str:
    return _fernet().encrypt(plain_email.lower().strip().encode()).decode()


def decrypt_email(token: str) -> str:
    return _fernet().decrypt(token.encode()).decode()


def hash_email(plain_email: str) -> str:
    key = settings.EMAIL_HASH_SECRET.encode()
    return hmac.new(key, plain_email.lower().strip().encode(), hashlib.sha256).hexdigest()


def encrypt_phone(plain_phone: str) -> str:
    return _fernet().encrypt(plain_phone.strip().encode()).decode()


def decrypt_phone(token: str) -> str:
    return _fernet().decrypt(token.encode()).decode()


def hash_phone(plain_phone: str) -> str:
    key = settings.EMAIL_HASH_SECRET.encode()
    return hmac.new(key, plain_phone.strip().encode(), hashlib.sha256).hexdigest()


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    email_encrypted = models.TextField()
    email_hash = models.CharField(max_length=64, unique=True, db_index=True)
    phone_encrypted = models.TextField(blank=True, null=True)
    phone_hash = models.CharField(max_length=64, blank=True, null=True, unique=True, db_index=True)
    full_name = models.CharField(max_length=150, blank=True)
    is_verified = models.BooleanField(default=False)

    @property
    def email(self):
        return decrypt_email(self.email_encrypted)

    @property
    def phone(self):
        return decrypt_phone(self.phone_encrypted) if self.phone_encrypted else None

    def __str__(self):
        return f'Profile#{self.pk}'



class EmailOTP(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='otps')
    code_hash = models.CharField(max_length=64)
    purpose = models.CharField(max_length=20, choices=[
        ('register', 'register'),
        ('login', 'login'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    consumed = models.BooleanField(default=False)

    MAX_ATTEMPTS = 5
    VALID_MINUTES = 10

    @staticmethod
    def _hash_code(code: str) -> str:
        return hashlib.sha256(code.encode()).hexdigest()

    @classmethod
    def generate(cls, profile, purpose):
        code = f'{random.randint(0, 999999):06d}'
        otp = cls.objects.create(
            profile=profile,
            code_hash=cls._hash_code(code),
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=cls.VALID_MINUTES),
        )
        return otp, code

    def is_valid(self, submitted_code: str) -> bool:
        if self.consumed or timezone.now() > self.expires_at:
            return False
        if self.attempts >= self.MAX_ATTEMPTS:
            return False
        self.attempts += 1
        self.save(update_fields=['attempts'])
        return hmac.compare_digest(self.code_hash, self._hash_code(submitted_code))


class PasswordResetToken(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='reset_tokens')
    token_hash = models.CharField(max_length=64, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    consumed = models.BooleanField(default=False)

    VALID_MINUTES = 30

    @staticmethod
    def _hash(token: str) -> str:
        return hashlib.sha256(token.encode()).hexdigest()

    @classmethod
    def generate(cls, profile):
        raw_token = secrets.token_urlsafe(32)
        cls.objects.filter(profile=profile, consumed=False).update(consumed=True)
        obj = cls.objects.create(
            profile=profile,
            token_hash=cls._hash(raw_token),
            expires_at=timezone.now() + timedelta(minutes=cls.VALID_MINUTES),
        )
        return obj, raw_token

    @classmethod
    def find_valid(cls, raw_token):
        try:
            obj = cls.objects.select_related('profile__user').get(token_hash=cls._hash(raw_token))
        except cls.DoesNotExist:
            return None
        if obj.consumed or timezone.now() > obj.expires_at:
            return None
        return obj