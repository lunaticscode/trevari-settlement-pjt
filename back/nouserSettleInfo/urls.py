from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from nouserSettleInfo import views

urlpatterns = [
    path('nousersettle', views.NouserSettleInfoView.as_view()),
    # path('account/<username>', views.UserAccountInfo.as_view()),
    path('nousersettle/<settlekey>', views.NouserSettleInfoView.as_view())
]
