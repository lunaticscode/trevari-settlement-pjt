from django.shortcuts import render
from rest_framework import generics
from rest_framework.decorators import api_view

from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.decorators import action
# Create your views here.

from .models import Post
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import PostSerializer
from rest_framework import status

class PostView(APIView):
    """
    POST /post
    """
    def post(self, request):
        post_serializer = PostSerializer(data=request.data)
        if Post.objects.filter(title=request.data['title']):
            content = {'dupleKey': 'title', 'message': '(!) title is already exist'}
            return Response(content, status=status.HTTP_200_OK)

        if Post.objects.filter(content=request.data['content']):
            content = {'dupleKey': 'content', 'message': '(!) content is already exist'}
            return Response(content, status=status.HTTP_200_OK)

        else:
            if post_serializer.is_valid():
                post_serializer.save()
                return Response(post_serializer.data, status=status.HTTP_201_CREATED)
        # if post_serializer.is_valid():

        # else:
        #     return Response(post_serializer.error, status=status.HTTP_400_BAD_REQUEST)

    """
    GET /post
    GET /post/{id}
    """
    def get(self, request, **kwargs):
        if kwargs.get('id') is None:
            post_queryset = Post.objects.all()  # 모든 User의 정보를 불러온다.
            post_queryset_serializer = PostSerializer(post_queryset, many=True)
            return Response(post_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            post_id = kwargs.get('id')
            post_serializer = PostSerializer(Post.objects.get(id=post_id))  # id에 해당하는 User의 정보를 불러온다
            return Response(post_serializer.data, status=status.HTTP_200_OK)

    """
    PUT /post/{id}
    """
    def put(self, request):
        return Response("test ok", status=200)


    def delete(self, request, **kwargs):
        if kwargs.get('id') is None:
            return Response("invalid request", status=status.HTTP_400_BAD_REQUEST)
        else:
            post_id = kwargs.get('id')
            post_object = Post.objects.get(id=post_id)
            post_object.delete()
            content = {
                "delete_id": post_id,
                "message": "success to delete",
            }
            return Response(content, status=status.HTTP_200_OK)

# class PostView(viewsets.ModelViewSet):
#     queryset = Post.objects.all()
#     serializer_class = PostSerializer
#
#     def perform_create(self, serializer):
#         serializer.save()

# class ListPost(generics.ListCreateAPIView):
#     queryset = Post.objects.all()
#     serializer_class = PostSerializer
#
# class DetailPost(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Post.objects.all()
#     serializer_class = PostSerializer
#
# class UpdatePost(generics.UpdateAPIView):
#     queryset = Post.objects.all()
#     serializer_class = PostSerializer
#
# class DeletePost(generics.DestroyAPIView):
#     queryset = Post.objects.all()
#     serializer_class = PostSerializer


   # receive_content = post_serializer.data.content
   #          try:
   #              check_content = Post.objects.get(content=receive_content)
   #          except Exception as e:
   #              check_content = None
   #          check_result = {
   #              'result': 'success',
   #              'data': "not exist" if check_content is None else "already exist"
   #          }
   #          return Response(check_result)