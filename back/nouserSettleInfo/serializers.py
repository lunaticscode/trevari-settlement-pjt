from .models import NouserSettleInfo
from rest_framework import serializers


class NouserSettleInfoSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'nsi_owner_key',
            'nsi_regdate',
            'nsi_title',
            'nsi_form_info',
            'nsi_account',
            'nsi_bankcode',
        )
        model = NouserSettleInfo