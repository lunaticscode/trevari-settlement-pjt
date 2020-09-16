from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from user import views

urlpatterns = [
    path('users/', views.JoinView.as_view()),
    path('users/login', views.LoginView.as_view()),
]
