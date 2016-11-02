from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core import serializers
import json
from .models import Room

def __authTokenValid(user_id, auth_token):
	return auth_token[0] == 'a';

# Create your views here.
def index(request):
	return HttpResponse("Welcome to the API")
	
def getRooms(request):
	print(request.body)
	json_data = json.loads(request.body.decode('utf-8'))
	user_id = int(json_data['user_id'])
	auth_token = json_data['auth_token']
	if __authTokenValid(user_id, auth_token):
		rooms = Room.objects.filter(owner=user_id)
		response = {}
		for entry in rooms:
			response[entry.pk] = entry.name
		return JsonResponse({'status':'ok', 'data':response})
	return JsonResponse({'status':'failed', 'msg':'invalid token'})
	
def addRoom(request):
	json_data = json.loads(request.body.decode('utf-8'))
	user_id = int(json_data['user_id'])
	auth_token = json_data['auth_token']
	room_name = json_data['room_name']
	if not __authTokenValid(user_id, auth_token):
		return JsonResponse({'status':'failed', 'msg':'invalid token'})
	if (len(room_name) > 100):
		room_name = room_name[:100]
	if Room.objects.filter(owner=user_id, name=room_name).exists():
		return JsonResponse({'status':'failed', 'msg':'room exists'})
	room = Room(owner=user_id, name=room_name)
	room.save()
	return JsonResponse({'status':'ok'})