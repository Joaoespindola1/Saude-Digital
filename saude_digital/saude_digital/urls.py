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
    path('atualiza_corretor/', views.atualiza_corretor, name='atualiza_corretor'),
    path('busca_endereco/', views.busca_endereco, name='busca_endereco'),
    path('login/', views.login, name='login'),
    path('cadastra_avaliacao/', views.cadastra_avaliacao, name='cadastra_avaliacao'),
    path('ver_avaliacao_corretor/', views.ver_avaliacao_corretor, name='ver_avaliacao_corretor'),
    path('associar_cliente_a_corretor/', views.associar_cliente_a_corretor, name='associar_cliente_a_corretor'),
    path('associar_plano_a_corretor/', views.associar_planos_a_corretor, name='associar_plano_a_corretor'),
    path('buscar_corretores/', views.associar_cliente_a_corretor, name='buscar_corretores'),
    path('listar_planos/', views.listar_planos, name='listar_planos'),
]

