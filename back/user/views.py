
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import status
import bcrypt

class UserView(APIView):
    """
    POST /post
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

    """
    GET /post
    GET /post/{id}
    """



