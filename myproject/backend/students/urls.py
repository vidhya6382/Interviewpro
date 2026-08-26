from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    # --- your existing endpoints ---
    path('questions/', views.list_questions, name='list_questions'),
    path('questions/<slug:slug>/', views.get_question, name='get_question'),
    path('submit/', views.submit_code, name='submit_code'),

    # --- dashboard (requires login) ---
    path('my-progress/', views.my_progress, name='my-progress'),
    path('auth/me/', views.me, name='me'),

    # --- auth endpoints ---
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/verify-otp/', views.VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/resend-otp/', views.ResendOTPView.as_view(), name='resend-otp'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # --- forgot password (link-based) ---
    path('auth/password-reset/request/', views.PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('auth/password-reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]