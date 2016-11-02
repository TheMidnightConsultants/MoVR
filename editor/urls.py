from django.conf.urls import url

from . import views

app_name = 'editor'
urlpatterns = [
	url(r'^login/', views.login, name='login'),
	url(r'^register/', views.register, name='register'),
	url(r'^app/', views.app, name='app'),
	url(r'^mobile/', views.mobile, name='mobile'),
	url(r'^createUser/', views.createUser, name='createUser'),
]