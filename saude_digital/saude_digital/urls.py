from django.contrib import admin
from django.urls import path
from app_saude_digital import views

urlpatterns = [
    path('', views.home, name='home'),
    path('usuarios/', views.ver_usuarios, name='ver_usuarios'),
    path('corretores/', views.ver_corretores, name='ver_corretores'),
    path('busca_corretor/', views.busca_corretor, name='busca_corretor'),
]

