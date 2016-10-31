from django.shortcuts import render

# Create your views here.

def login(request):
	return render(request, 'editor/login.html')

def register(request):
	return render(request, 'editor/register.html')

def app(request):
	return render(request, 'editor/app.html')
	
def mobile(request):
	return render(request, 'editor/mobile.html')