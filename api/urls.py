from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^rooms/(?P<user_id>[0-9]*)/(?P<auth_token>[a-zA-Z0-9]*)/$', views.getRooms),
	url(r'^addroom/(?P<user_id>[0-9]*)/(?P<auth_token>[a-zA-Z0-9]*)/(?P<room_name>[a-zA-Z0-9]*)/$', views.addRoom),
	#url(r'^rooms/', views.getRooms),
	#url(r'^', views.index),
]