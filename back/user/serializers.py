from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'name',
            'email',
            'password',
            'account_list',
            'regdate',
        )
        model = User