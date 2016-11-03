from django.conf.urls import url

from . import views

app_name = 'editor'
urlpatterns = [
	url(r'^login/', views.loginPage, name='loginPage'),
	url(r'^register/', views.register, name='register'),
	url(r'^app/', views.app, name='app'),
	url(r'^mobile/', views.mobile, name='mobile'),
	url(r'^createUser/', views.createUser, name='createUser'),
	url(r'^loginAttempt/', views.loginAttempt, name='loginAttempt'),
	url(r'^logoutAttempt', views.logoutAttempt, name='logoutAttempt'),
]