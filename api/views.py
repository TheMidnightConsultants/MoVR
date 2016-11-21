from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core import serializers
import json
from .models import Room, Furniture
from django.contrib.auth.models import User
from MoVR.settings import MODELS_DIR
from django.forms.models import model_to_dict

def __authTokenValid(user_id, auth_token):
	return auth_token[0] == 'a';

# Create your views here.
def index(request):
	return HttpResponse("Welcome to the API")
	
def getRooms(request):
	print("REQUEST BODY:")
	print(request.body)
	json_data = json.loads(request.body.decode('utf-8'))
	user_id = request.user
	print User.objects
	user = User.objects.filter(username = user_id)[0]
	auth_token = json_data['auth_token']
	if __authTokenValid(user_id, auth_token):
		rooms = Room.objects.filter(owner = user)
		response = {}
		for entry in rooms:
			response[entry.pk] = entry.name
		return JsonResponse({'status':'ok', 'data':response})
	return JsonResponse({'status':'failed', 'msg':'invalid token'})
	
def addRoom(request):
	print(request.user)
	json_data = json.loads(request.body.decode('utf-8'))
	user_id = request.user
	user = User.objects.filter(username = user_id)[0]
	auth_token = json_data['auth_token']
	room_name = json_data['room_name']
	if not __authTokenValid(user_id, auth_token):
		return JsonResponse({'status':'failed', 'msg':'invalid token'})
	if (len(room_name) > 100):
		room_name = room_name[:100]
	if Room.objects.filter(owner=user_id, name=room_name).exists():
		return JsonResponse({'status':'failed', 'msg':'room exists'})
	room = Room(
		owner = user,
		name = room_name,
		dimX = json_data['dims'][0],
		dimY = json_data['dims'][1],
		dimZ = json_data['dims'][2],
		wallColor = json_data['wallColor']
		)
	room.save()
	return JsonResponse({'status':'ok'})
	
def deleteRoom(request):
	json_data = json.loads(request.body.decode('utf-8'))
	user_id = request.user
	user = User.objects.filter(username = user_id)[0]
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

def loadRoom(request):
	json_data = json.loads(request.body.decode('utf-8'))
	room = Room.objects.filter(owner = request.user, pk = json_data['room_id'])[0]
	json_response = {}
	json_response['name'] = room.name
	json_response['dimensions'] = {'x':room.dimX, 'y':room.dimY, 'z':room.dimZ}
	json_response['wallColor'] = room.wallColor
	print(json_response)
	return JsonResponse(json_response)