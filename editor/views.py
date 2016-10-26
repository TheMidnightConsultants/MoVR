from django.shortcuts import render

# Create your views here.

def login(request):
	return render(request, 'editor/login.html')

def app(request):
	return render(request, 'editor/app.html')