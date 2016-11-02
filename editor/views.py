from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User

# Create your views here.

def login(request):
	return render(request, 'editor/login.html')

def register(request):
	return render(request, 'editor/register.html')

def app(request):
	return render(request, 'editor/app.html')
	
def mobile(request):
	return render(request, 'editor/mobile.html')

def createUser(request):
	user = User.objects.create_user(request.POST['username'], request.POST['email'], request.POST['password'])
	user.save()
	return HttpResponseRedirect('/login')