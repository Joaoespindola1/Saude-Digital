from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from .models import Cliente, Corretor
import json

def home(request):
    return render(request,'usuarios/home.html')

@csrf_exempt
def cadastro_cliente(request):
    if request.method == 'POST':
        try:
            # Parseia os dados do corpo da requisicao JSON
            data = json.loads(request.body)

            # Verifica se todos os campos obrigatorios estao presentes
            nome = data.get('nome')
            cpf = data.get('cpf')
            endereco = data.get('endereco')
            telefone = data.get('telefone', None)  # Telefone e opcional
            email = data.get('email')
            data_nascimento = data.get('data_nascimento')

            if not (nome and cpf and endereco and email and data_nascimento):
                return JsonResponse({'error': 'Todos os campos obrigatorios devem ser preenchidos.'}, status=400)

            # Cria o novo cliente
            cliente = Cliente.objects.create(
                nome=nome,
                cpf=cpf,
                endereco=endereco,
                telefone=telefone,
                email=email,
                data_nascimento=data_nascimento
            )

            # Retorna o cliente criado como JSON
            return JsonResponse({
                'message': 'Cliente cadastrado com sucesso!',
                'cliente': {
                    'id': cliente.id,
                    'nome': cliente.nome,
                    'cpf': cliente.cpf,
                    'endereco': cliente.endereco,
                    'telefone': cliente.telefone,
                    'email': cliente.email,
                    'data_nascimento': cliente.data_nascimento
                }
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dados invalidos. Envie um JSON valido.'}, status=400)

    else:
        return JsonResponse({'error': 'Metodo nao permitido. Use POST.'}, status=405)


@csrf_exempt
def cadastro_corretor(request):
    if request.method == 'POST':
        try:
            # Parseia os dados do corpo da requisicao JSON
            data = json.loads(request.body)

            # Obtém os dados do corretor
            nome = data.get('nome')
            cpf = data.get('cpf')
            endereco = data.get('endereco')
            telefone = data.get('telefone')
            email = data.get('email')
            registro_plano = data.get('registro_plano')

            # Validacao dos dados
            if not all([nome, cpf, endereco, email, registro_plano]):
                return JsonResponse({'error': 'Todos os campos sao obrigatorios.'}, status=400)

            # Cria o objeto Corretor e salva no banco de dados
            corretor = Corretor(
                nome=nome,
                cpf=cpf,
                endereco=endereco,
                telefone=telefone,
                email=email,
                registro_plano=registro_plano
            )
            corretor.save()

            # Retorna a resposta JSON
            return JsonResponse({'success': 'Corretor cadastrado com sucesso!'}, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dados invalidos. Envie um JSON valido.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Metodo não permitido. Use POST.'}, status=405)


def ver_clientes(request):
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
        # Obtem o nome da requisicao
        nome = request.GET.get('nome', '')  

        # Busca com ilike os corretores que possuem aquele nome
        corretores = Corretor.objects.filter(nome__icontains=nome)

        corretores_list = list(corretores.values())  # Converte para uma lista de dicionarios

        # Retorna a resposta JSON
        return JsonResponse({'corretores': corretores_list}, safe=False)
    else:
        return JsonResponse({'error': 'Metodo nao permitido. Use GET.'}, status=405)
    

def busca_endereco(request):
    if request.method == 'GET':
        # Obtem o nome da requisicao
        endereco = request.GET.get('endereco', '')  

        # Busca com ilike os corretores que possuem aquele nome
        corretores = Corretor.objects.filter(endereco__icontains=endereco)

        corretores_list = list(corretores.values())  # Converte para uma lista de dicionarios

        # Retorna a resposta JSON
        return JsonResponse({'corretores': corretores_list}, safe=False)
    else:
        return JsonResponse({'error': 'Metodo nao permitido. Use GET.'}, status=405)
