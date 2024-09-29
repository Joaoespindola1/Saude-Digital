from django.contrib import admin
from django.urls import path
from app_saude_digital import views

urlpatterns = [
    path('', views.home, name='home'),
    path('usuarios/', views.usuarios, name='listagem_usuarios'),
    path('inicio/', views.busca_corretor, name='busca_corretores'),
]

