from django.contrib import admin
from django.urls import path
from app_saude_digital import views

urlpatterns = [
    path('', views.home, name='home'),
    path('cadastro_cliente/', views.cadastro_cliente, name='cadastro_cliente'),
    path('cadastro_corretor/', views.cadastro_corretor, name='cadastro_corretor'),
    path('clientes/', views.ver_clientes, name='ver_clientes'),
    path('corretores/', views.ver_corretores, name='ver_corretores'),
    path('busca_corretor/', views.busca_corretor, name='busca_corretor'),
    path('busca_corretor_id/', views.busca_corretor_id, name='busca_corretor_id'),
    path('busca_endereco/', views.busca_endereco, name='busca_endereco'),
]

