from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from post import views

urlpatterns = [
    path('posts/', views.PostView.as_view()),
    path('posts/<int:id>/', views.PostView.as_view()),
]

