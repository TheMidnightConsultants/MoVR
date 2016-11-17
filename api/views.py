from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core import serializers
import json
from .models import Room, Furniture
from MoVR.settings import MODELS_DIR

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
	
def deleteRoom(request):
	json_data = json.loads(request.body.decode('utf-8'))
	user_id = int(json_data['user_id']);
	auth_token = json_data['auth_token']
	room_id = json_data['room_id']
	if not __authTokenValid(user_id, auth_token):
		return JsonResponse({'status':'failed', 'msg':'invalid token'})
	rooms = Room.objects.filter(pk=room_id)
	roomslist = list(rooms)
	if (len(roomslist) != 1):
		return JsonResponse({'status':'failed', 'msg':'room does not exist'})
	if (roomslist[0].owner != user_id):
		return JsonResponse({'status':'failed', 'msg':'user does not own that room'})
	rooms.delete()
	return JsonResponse({'status':'ok'})
	
def listFurniture(request):
	furniture = Furniture.objects.filter()
	response = {}
	for entry in furniture:
		response[entry.pk] = entry.name
	return JsonResponse({'status':'ok', 'data':response})
	
def loadModel(request, model_id):
	model_entry = Furniture.objects.filter(pk=model_id)
	if (len(model_entry) != 1):
		return JsonResponse({'status':'failed', 'msg':'model does not exist'})
	file = open(MODELS_DIR + model_entry[0].filename)
	return HttpResponse(file, content_type='text/plain')