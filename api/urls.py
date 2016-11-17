from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^rooms/?$', views.getRooms),
	url(r'^addroom/?$', views.addRoom),
	url(r'^deleteroom/?$', views.deleteRoom),
	url(r'^listfurniture/?$', views.listFurniture),
	url(r'^loadmodel/(?P<model_id>[0-9]+)/?$', views.loadModel),
	url(r'^', views.index),
]