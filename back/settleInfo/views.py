import json
from .models import SettleInfo
from .serializers import SettleInfoSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class SettleInfoView(APIView):
    """
    POST /api/settle
    """
    def post(self, request):
        post_serializer = SettleInfoSerializer(data=request.data)
        if post_serializer.is_valid():
            settleinfo = post_serializer.save()
            if settleinfo:
                content = {'settleTitle': request.data['si_title'], 'savedIndex': settleinfo.id, 'result': 'success'}
                return Response(content, status=status.HTTP_201_CREATED)
            else:
                content = {'result': 'fail', 'message': '(!)Please confirm your request data'}
                return Response(content, status=status.HTTP_200_OK)

    """
    GET /api/settle/{id}
    """
    def get(self, *args, **kwargs):
        if kwargs.get('id') is None:
            content = {'result': 'fail', 'message': '(!)Need to settleInfo_id'}
            return Response(content, status=status.HTTP_200_OK)

        else:
            if SettleInfo.objects.filter(id=kwargs.get('id')):
                settleInfo = SettleInfo.objects.get(id=kwargs.get('id'))
                settleFormInfo = settleInfo.si_form_info
                settleTitle = settleInfo.si_title
                settleBankInfo = {'bank_code': settleInfo.si_bankcode, 'bank_num': settleInfo.si_account}
                content = {'result': 'success', 'settleInfo': settleFormInfo, 'settleBankInfo': settleBankInfo, 'settleTitle': settleTitle}
                return Response(content, status=status.HTTP_200_OK)
            else:
                content = {'result': 'fail', 'message': '(!)This settleInfo_id not exist'}
                return Response(content, status=status.HTTP_200_OK)


class SettleListView(APIView):
    """
    POST /api/settleList
    """
    def post(self, request):
        print(request.data)
        username = request.data['user_name']
        if SettleInfo.objects.filter(si_owner_name=username):
            settleInfo = SettleInfo.objects.all()
            settlelist = settleInfo.filter(si_owner_name=username)
            content = {'settleInfo_List': settlelist.values(), 'result': 'success'}
            return Response(content, status=status.HTTP_200_OK)

        else:
            content = {'result': 'fail', 'message': '(!)This user_email not exist in SettleInfo DB'}
            return Response(content, status=status.HTTP_200_OK)