from django.http import JsonResponse
from django.shortcuts import render
from .models import Cliente, Corretor

def home(request):
    return render(request,'usuarios/home.html')


def ver_usuarios(request):
    if request.method == 'GET':
        # Obtem todos os objetos do modelo Cliente
        corretores = list(Cliente.objects.values())  # Converte para uma lista de dicionarios

        # Retorna a resposta JSON
        return JsonResponse({'corretores': corretores}, safe=False)
    else:
        # Retorna erro caso nao seja uma requisicao GET
        return JsonResponse({'error': 'Metodo nao permitido. Use GET.'}, status=405)


def ver_corretores(request):
    if request.method == 'GET':
        # Obtem todos os objetos do modelo Cliente
        corretores = list(Corretor.objects.values())  # Converte para uma lista de dicionarios

        # Retorna a resposta JSON
        return JsonResponse({'corretores': corretores}, safe=False)
    else:
        # Retorna erro caso nao seja uma requisicao GET
        return JsonResponse({'error': 'Metodo nao permitido. Use GET.'}, status=405)


def busca_corretor(request):
    if request.method == 'GET':
        # Obtem o nome da requisição
        nome = request.GET.get('nome', '')  

        # Busca com ilike os corretores que possuem aquele nome
        corretores = Corretor.objects.filter(nome__icontains=nome)

        corretores_list = list(corretores.values())  # Converte para uma lista de dicionarios

        # Retorna a resposta JSON
        return JsonResponse({'corretores': corretores_list}, safe=False)
    else:
        return JsonResponse({'error': 'Metodo nao permitido. Use GET.'}, status=405)
    

# def busca_plano(request):


