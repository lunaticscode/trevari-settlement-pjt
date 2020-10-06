from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from settleInfo import views

urlpatterns = [
    path('settle', views.SettleInfoView.as_view()),
    path('settle/<int:id>', views.SettleInfoView.as_view()),
    path('settleList', views.SettleListView.as_view()),
]
