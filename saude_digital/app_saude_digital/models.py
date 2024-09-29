from django.db import models

class Cliente(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.TextField(max_length=255)
    idade = models.IntegerField(null=True)

class Corretor(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.TextField(max_length=255)
    codigo = models.IntegerField(null=True)
