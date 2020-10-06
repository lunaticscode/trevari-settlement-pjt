from .models import SettleInfo
from rest_framework import serializers

class SettleInfoSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'si_owner_name',
            'si_title',
            'si_form_cnt',
            'si_form_info',
            'si_regdate',
        )
        model = SettleInfo