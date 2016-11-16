from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import IntegrityError

# Create your views here.

def loginPage(request):								# Render the login page
	return render(request, 'editor/login.html')

def register(request):								# Render registration page
	return render(request, 'editor/register.html')

def app(request):									# Render app/editor, pass along user information if logged in
	return render(request, 'editor/app.html', {'user': request.user})
	
def mobile(request):
	return render(request, 'editor/mobile.html')

def createUser(request):							# User registration
	try:
		user = User.objects.create_user(request.POST['username'], request.POST['email'], request.POST['password'])
	except IntegrityError:							# Duplicate username
		return render(request, 'editor/register.html', {'error': "Username is already taken.  Please choose another."})
	user.save()										# Log in user and go to app
	authedUser = authenticate(username=request.POST['username'], password=request.POST['password'])
	login(request, user)
	return HttpResponseRedirect('/app/')

def loginAttempt(request):							# Attempt to auth user
	username = request.POST['username']
	password = request.POST['password']
	user = authenticate(username=username, password=password)
	if user is not None:
		login(request, user)
		return HttpResponseRedirect('/app/')
	else:											# Kick back to login with error message
		return render(request, 'editor/login.html', {'error': 'Incorrect login.  Try again.'})
		return HttpResponseRedirect('/login/')

def logoutAttempt(request):
	logout(request)
	return HttpResponseRedirect('/login/')