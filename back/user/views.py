from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import status
import bcrypt

class JoinView(APIView):
    """
    POST /api/users
    """
    def post(self, request):
        post_serializer = UserSerializer(data=request.data)
        if User.objects.filter(email=request.data['email']):
            content = {'dupleKey': 'email', 'message': '(!) This email is already exist'}
            return Response(content, status=status.HTTP_200_OK)

        if User.objects.filter(name=request.data['name']):
            content = {'dupleKey': 'name', 'message': '(!) This name is already exist'}
            return Response(content, status=status.HTTP_200_OK)

        else:
            if post_serializer.is_valid():
                post_serializer.save()
                content = {'userName': request.data['name'], 'message': 'success'}
                return Response(content, status=status.HTTP_201_CREATED)



class LoginView(APIView):
    """
    POST /api/users/login
    """
    def post(self, request):
        if User.objects.filter(email=request.data['email']):
            if User.objects.filter(password=request.data['password']):
                content = {"sign": "grant", "message": "success to login"}
                return Response(content, status=status.HTTP_200_OK)

            else:
                content = {"sign": "revoke", "revoke_index": "password", "message": "(!) 비밀번호를 다시 확인해주세요."}
                return Response(content, status=status.HTTP_200_OK)
        else:
            content = {"sign": "revoke", "revoke_index": "email", "message": "(!) 존재하지 않는 이메일입니다."}
            return Response(content, status=status.HTTP_200_OK)

