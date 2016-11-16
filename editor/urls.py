from django.conf.urls import url

from . import views

app_name = 'editor'
urlpatterns = [
	url(r'^$', views.loginPage, name='root'),								# Main page
	url(r'^login/', views.loginPage, name='loginPage'),						# Login
	url(r'^register/', views.register, name='register'),					# Register
	url(r'^app/', views.app, name='app'),									# Editor
	url(r'^mobile/', views.mobile, name='mobile'),							# Mobile view
	url(r'^createUser/', views.createUser, name='createUser'),				# Registration code
	url(r'^loginAttempt/', views.loginAttempt, name='loginAttempt'),		# Login code
	url(r'^logoutAttempt', views.logoutAttempt, name='logoutAttempt'),		# Logout
]
