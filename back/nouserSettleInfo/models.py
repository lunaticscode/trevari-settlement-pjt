from django.db import models

# Create your models here.
class NouserSettleInfo(models.Model):
    nsi_owner_key = models.CharField(max_length=100)
    nsi_regdate = models.CharField(max_length=50)
    nsi_title = models.CharField(max_length=50, null=True)
    nsi_form_info = models.TextField()
    nsi_account = models.CharField(max_length=255)
    nsi_bankcode = models.CharField(max_length=10)

    def __str__(self):
        return self.nsi_owner_key
