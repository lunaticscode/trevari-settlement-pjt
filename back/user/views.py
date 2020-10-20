from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import status
import jwt
import requests
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
                #UserEmail = request.data['email']
                token = jwt.encode({"user_email": request.data['email']}, SECRET_KEY, JWT_ALGORITHM)
                #token_str = token.decode('utf-8')
                #print(jwt.decode(token_str, SECRET_KEY, JWT_ALGORITHM))
                content = {"sign": "grant", "UserName": UserName, "message": "success to login", "token": token}
                return Response(content, status=status.HTTP_200_OK)

            else:
                content = {"sign": "revoke", "revoke_index": "password", "message": "(!) 비밀번호를 다시 확인해주세요."}
                return Response(content, status=status.HTTP_200_OK)
        else:
            content = {"sign": "revoke", "revoke_index": "email", "message": "(!) 존재하지 않는 이메일입니다."}
            return Response(content, status=status.HTTP_200_OK)


# class PasswordChange(APIView):
#        """
#        PUT /api/users/changepassword
#        """
#        def put(self, request):
#             token = request.data['token']
#             userName = request.data['token']


class TokenAuthView(APIView):
       """
       POST /api/token/auth
       """
       def post(self, request):
           token = request.data['token']
           userName = request.data['userName']
           decodeToken = jwt.decode(token, SECRET_KEY, JWT_ALGORITHM)
           AuthUserName = User.objects.get(email=decodeToken['user_email']).name
           if userName == AuthUserName:
               content = {"auth_result": "grant", "user_email": decodeToken['user_email'], "message": "유저 인증 성공"}
               return Response(content, status=status.HTTP_200_OK)
           else:
               content = {"auth_result": "revoke", "message": "(!) 다시 로그인해주세요."}
               return Response(content, status=status.HTTP_200_OK)


imp_key = get_secret("IMP_KEY")
imp_secret = get_secret("IMP_SECRET")

class BankingTokenView(APIView):
       """
       POST /api/banking/accountAuth
       """
       def post(self, request):
           url = 'http://api.iamport.kr/users/getToken'
           dict_data = {'imp_key': imp_key,
                        'imp_secret': imp_secret}
           response = requests.post(url=url, data=dict_data,
                                    headers={'Content-Type': 'application/x-www-form-urlencoded'})
           access_token = response.json()['response']['access_token']

           params = {'bank_code': request.data['bank_code'], 'bank_num': request.data['bank_num']}
           url_2 = 'http://api.iamport.kr/vbanks/holder'
           response_2 = requests.get(url=url_2, params=params, headers={'Content-Type': 'application/x-www-form-urlencoded',
                                                                      'Authorization': 'Bearer '+access_token})

           result_auth = response_2.json()
           print('<================================')
           print(request.data)
           print(result_auth)
           print('================================>')
           if result_auth['response'] is None:
               return Response({'result': 'revoke', 'revokeType': 'account'}, status=status.HTTP_200_OK)
           else:
               return Response({'result': 'grant', 'realname': result_auth['response']['bank_holder']}, status=status.HTTP_200_OK)



class UserAccountInfo(APIView):
        """
        GET /api/account/
        """
        def get(self, *args, **kwargs):
            print(kwargs.get('username'))
            if kwargs.get('username') is None:
                content = {'result': 'fail', 'message': '(!)Need to username'}
                return Response(content, status=status.HTTP_200_OK)

            else:
                username = kwargs.get('username')
                if User.objects.filter(name=username):
                    user_account_list = User.objects.get(name=username).account_list
                    if user_account_list is None:
                        content = {'result': 'success', 'account_list': user_account_list, 'message': 'firstAccount'}
                        return Response(content, status=status.HTTP_200_OK)
                    else:
                        content = {'result': 'success', 'account_list': user_account_list}
                        return Response(content, status=status.HTTP_200_OK)

                else:
                    content = {'result': 'fail', 'message': '(!)Does not exist this username'}
                    return Response(content, status=status.HTTP_200_OK)

        """
        POST /api/account/
        """
        def post(self, request):
            username = request.data['username']
            account_info = request.data['account_info']
            if User.objects.filter(name=username):
                user_instance = User.objects.get(name=username)
                user_instance.account_list = account_info
                user_instance.save()
                content = {'result': 'success', 'message': 'Success to save Account_info', 'accountList': account_info}
                return Response(content, status=status.HTTP_200_OK)
            else:
                content = {'result': 'fail', 'message': '(!)Does not exist this username'}
                return Response(content, status=status.HTTP_200_OK)