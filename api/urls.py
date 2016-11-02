from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^rooms/$', views.getRooms),
	url(r'^addroom/$', views.addRoom),
	url(r'^', views.index),
]