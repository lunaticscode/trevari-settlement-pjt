
from django.db import models


class SettleInfo(models.Model):
    si_owner_name = models.CharField(max_length=30)
    si_title = models.CharField(max_length=50)
    si_form_cnt = models.CharField(max_length=50)
    si_form_info = models.TextField()
    si_account = models.CharField(max_length=255)
    si_bankcode = models.CharField(max_length=10)
    si_regdate = models.CharField(max_length=16)

    def __str__(self):
        return self.si_owner_name