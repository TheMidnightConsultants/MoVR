from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from .models import Room

def authTokenValid(user_id, auth_token):
	return auth_token[0] == 'a';

# Create your views here.
def index(request):
	return HttpResponse("Welcome to the API")
	
def getRooms(request, user_id, auth_token):
	user_id = int(user_id)
	if authTokenValid(user_id, auth_token):
		rooms = Room.objects.filter(owner=user_id)
		response = {}
		for entry in rooms:
			response[entry.pk] = entry.name
		return JsonResponse({'status':'ok', 'data':response})
	return JsonResponse({'status':'failed', 'msg':'invalid token'})
	
def addRoom(request, user_id, auth_token, room_name):
	user_id = int(user_id)
	if not authTokenValid(user_id, auth_token):
		return JsonResponse({'status':'failed', 'msg':'invalid token'})
	if (len(room_name) > 100):
		room_name = room_name[:100]
	if Room.objects.filter(owner=user_id, name=room_name).exists():
		return JsonResponse({'status':'failed', 'msg':'room exists'})
	room = Room(owner=user_id, name=room_name)
	room.save()
	return HttpResponse("Added room successfully")