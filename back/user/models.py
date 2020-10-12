from django.db import models


class User(models.Model):
     name = models.CharField(max_length=50, unique=True)
     email = models.CharField(max_length=50, unique=True)
     password = models.CharField(max_length=255)
     account_list = models.TextField(null=True)
     regdate = models.CharField(max_length=16)

     def __str__(self):
         return self.name

# Create your models here.
