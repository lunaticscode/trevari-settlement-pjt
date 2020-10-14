import json
from .models import NouserSettleInfo
from .serializers import NouserSettleInfoSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class NouserSettleInfoView(APIView):
    """
    POST /api/nousersettle
    """
    def post(self, request):
        post_serializer = NouserSettleInfoSerializer(data=request.data)
        print(request.data)
        if post_serializer.is_valid():
            nouserSettleInfo = post_serializer.save()
            if nouserSettleInfo:
                content = {'nouser_settle_key': request.data['nsi_owner_key'], 'result': 'success'}
                return Response(content, status=status.HTTP_200_OK)
            else:
                content = {'result': 'fail', 'message': '(!)Please, confirm your request data'}
                return Response(content, status=status.HTTP_200_OK)


    def get(self, *args, **kwargs):
         print(kwargs.get('settlekey'))
         if kwargs.get('settlekey') is None:
             content = {'result': 'fail', 'message': '(!)Need to key'}
             return Response(content, status=status.HTTP_200_OK)

         else:
             settlekey = kwargs.get('settlekey')
             if NouserSettleInfo.objects.filter(nsi_owner_key=settlekey):
                 tmp_obj = NouserSettleInfo.objects.get(nsi_owner_key=settlekey)
                 info = {'settle_title': tmp_obj.nsi_title,
                         'settle_date': tmp_obj.nsi_regdate,
                         'settle_info': tmp_obj.nsi_form_info,
                         'bank_info': {'bank_code': tmp_obj.nsi_bankcode,
                                       'bank_num': tmp_obj.nsi_account}
                         }
                 content = {'settleInfo': info, 'result': 'success'}
                 return Response(content, status=status.HTTP_200_OK)

             else:
                 content = {'result': 'fail', 'message': '(!)Does not exist this key'}
                 return Response(content, status=status.HTTP_200_OK)