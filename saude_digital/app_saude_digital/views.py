from django.http import JsonResponse
from django.shortcuts import render
from .models import Cliente, Corretor

def home(request):
    return render(request,'usuarios/home.html')


def usuarios(request):
    # Salvar os dados da tela para o banco.
    novo_usuario = Cliente()
    novo_usuario.nome = request.POST.get('nome')
    novo_usuario.idade = request.POST.get('idade')
    novo_usuario.save()

    # Exibir os usuarios.
    usuarios = {
        'usuarios': Cliente.objects.all()
    }
    
    # Retornar os dados para a pagina.
    return render(request, 'usuarios/usuarios.html', usuarios)

def ver_corretores(request):
    corretores = {
        'corretores': Cliente.objects.all()
    }

def busca_corretor(request):

    nome = request.GET.get('nome')
    corretores = {
        'corretores': Cliente.objects.filter(nome__icontains=nome)
    }

    return JsonResponse({'corretores': corretores})

def busca_corretor(request):

    plano = request.GET.get('plano')
    corretores = {
        'corretores': Cliente.objects.filter(plano__icontains=plano)
    }
    if request.is_ajax():
        return JsonResponse({'corretores': corretores})