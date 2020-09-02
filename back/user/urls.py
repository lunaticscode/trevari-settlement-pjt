from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from user import views

urlpatterns = [
    path('users/', views.UserView.as_view()),
]
