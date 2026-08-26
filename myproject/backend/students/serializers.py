from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import UserProfile, hash_email, hash_phone

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=30, min_length=3)
    email = serializers.EmailField()   # collected only for password-recovery, not shown at login
    password = serializers.CharField(write_only=True, min_length=8)
    full_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('That username is taken.')
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_email(self, value):
        if UserProfile.objects.filter(email_hash=hash_email(value)).exists():
            raise serializers.ValidationError('Registration could not be completed with these details.')
        return value

    def validate_phone(self, value):
        if value:
            if UserProfile.objects.filter(phone_hash=hash_phone(value)).exists():
                raise serializers.ValidationError('Registration could not be completed with these details.')
        return value


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class VerifyOTPSerializer(serializers.Serializer):
    username = serializers.CharField()
    code = serializers.CharField(min_length=6, max_length=6)


class PasswordResetRequestSerializer(serializers.Serializer):
    identifier = serializers.CharField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        validate_password(value)
        return value


class UserOutSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    full_name = serializers.CharField()
    is_verified = serializers.BooleanField()