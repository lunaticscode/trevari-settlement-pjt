from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from user import views

urlpatterns = [
    path('users/', views.JoinView.as_view()),
    path('users/login', views.LoginView.as_view()),
    path('users/check/email', views.CheckEmailView.as_view()),
    path('users/check/name', views.CheckNicknameView.as_view()),
    path('users/changepw', views.PasswordChange.as_view()),
    path('token/auth', views.TokenAuthView.as_view()),
    path('banking/accountAuth', views.BankingTokenView.as_view()),
    path('account', views.UserAccountInfo.as_view()),
    path('account/<username>', views.UserAccountInfo.as_view()),
]
