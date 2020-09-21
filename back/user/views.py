from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import status
import jwt
import os, json
from pathlib import Path
from django.core.exceptions import ImproperlyConfigured
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent

secret_file = os.path.join(BASE_DIR, 'secrets.json')

with open(secret_file) as f:
    secrets = json.loads(f.read())

def get_secret(setting, secrets=secrets):
    try:
        return secrets[setting]
    except KeyError:
        error_msg = "Set the {} environment variable".format(setting)
        raise ImproperlyConfigured



class CheckEmailView(APIView):
    """
    POST /api/check/email
    """
    def post(self, request):
        if User.objects.filter(email=request.data['email']):
            content = {'sign': 'revoke', 'message': '(!) This Email is already exist'}
            return Response(content, status=status.HTTP_200_OK)

        else:
            content = {'sign': 'grant', 'message': 'grant'}
            return Response(content, status=status.HTTP_200_OK)


class CheckNicknameView(APIView):
    """
    POST /api/check/name
    """
    def post(self, request):
        if User.objects.filter(name=request.data['name']):
            content = {'sign': 'revoke', 'message': '(!) This Nickname is already exist'}
            return Response(content, status=status.HTTP_200_OK)

        else:
            content = {'sign': 'grant', 'message': 'grant'}
            return Response(content, status=status.HTTP_200_OK)


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
                user = post_serializer.save()
                content = {'userName': request.data['name'], 'message': 'success'}
                if user:
                    return Response(content, status=status.HTTP_201_CREATED)

            else:
                content = {'message': 'grant'}
                return Response(content, status=status.HTTP_200_OK)

SECRET_KEY = get_secret("SECRET_KEY")
JWT_ALGORITHM = get_secret("JWT_ALGORITHM")

class LoginView(APIView):
    """
    POST /api/users/login
    """
    def post(self, request):
        if User.objects.filter(email=request.data['email']):
            if User.objects.filter(password=request.data['password']):

                # --- JWT Token Generating section --- #
                UserName = User.objects.get(email=request.data['email']).name
                token = jwt.encode(request.data, SECRET_KEY, JWT_ALGORITHM)
                token_str = token.decode('utf-8')
                print(jwt.decode(token_str, SECRET_KEY, JWT_ALGORITHM))
                content = {"sign": "grant", "UserName": UserName, "message": "success to login", "token": token}
                return Response(content, status=status.HTTP_200_OK)

            else:
                content = {"sign": "revoke", "revoke_index": "password", "message": "(!) 비밀번호를 다시 확인해주세요."}
                return Response(content, status=status.HTTP_200_OK)
        else:
            content = {"sign": "revoke", "revoke_index": "email", "message": "(!) 존재하지 않는 이메일입니다."}
            return Response(content, status=status.HTTP_200_OK)

