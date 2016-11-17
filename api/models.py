from django.db import models

# Create your models here.
class Room(models.Model):
	owner = models.IntegerField()
	name = models.CharField(max_length=100)
	
class Furniture(models.Model):
	filename = models.CharField(max_length=100)
	name = models.CharField(max_length=100)