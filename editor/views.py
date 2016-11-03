from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import IntegrityError

# Create your views here.

def loginPage(request):
	return render(request, 'editor/login.html')

def register(request):
	return render(request, 'editor/register.html')

def app(request):
	return render(request, 'editor/app.html', {'user': request.user})
	
def mobile(request):
	return render(request, 'editor/mobile.html')

def createUser(request):
	try:
		user = User.objects.create_user(request.POST['username'], request.POST['email'], request.POST['password'])
	except IntegrityError:
		return render(request, 'editor/register.html', {'error': "Username is already taken.  Please choose another."})
	user.save()
	authedUser = authenticate(username=request.POST['username'], password=request.POST['password'])
	login(request, user)
	return HttpResponseRedirect('/app/')

def loginAttempt(request):
	username = request.POST['username']
	password = request.POST['password']
	user = authenticate(username=username, password=password)
	if user is not None:
		login(request, user)
		return HttpResponseRedirect('/app/')
	else:
		return render(request, 'editor/login.html', {'error': 'Incorrect login.  Try again.'})
		return HttpResponseRedirect('/login/')

def logoutAttempt(request):
	logout(request)
	return HttpResponseRedirect('/login/')