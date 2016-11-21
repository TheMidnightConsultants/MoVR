from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Room(models.Model):
	owner = models.ForeignKey(User)
	name = models.CharField(max_length=100)
	dimX = models.PositiveIntegerField()
	dimY = models.PositiveIntegerField()
	dimZ = models.PositiveIntegerField()
	
class Furniture(models.Model):
	filename = models.CharField(max_length=100)
	name = models.CharField(max_length=100)
