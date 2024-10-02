from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, get_object_or_404
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
            password = data.get('password')

            if not (nome and cpf and endereco and email and data_nascimento):
                return JsonResponse({'error': 'Todos os campos obrigatorios devem ser preenchidos.'}, status=400)

            # Cria o novo cliente
            cliente = Cliente.objects.create(
                nome=nome,
                cpf=cpf,
                endereco=endereco,
                telefone=telefone,
                email=email,
                data_nascimento=data_nascimento,
                password=password
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
                    'data_nascimento': cliente.data_nascimento,
                    'password': cliente.password
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

            # ObtÃ©m os dados do corretor
            nome = data.get('nome')
            cpf = data.get('cpf')
            endereco = data.get('endereco')
            telefone = data.get('telefone')
            email = data.get('email')
            codigo_corretor = data.get('codigo_corretor')
            password = data.get('password')

            # Validacao dos dados
            if not all([nome, cpf, endereco, email, codigo_corretor, password]):
                return JsonResponse({'error': 'Todos os campos sao obrigatorios.'}, status=400)

            # Cria o objeto Corretor e salva no banco de dados
            corretor = Corretor(
                nome=nome,
                cpf=cpf,
                endereco=endereco,
                telefone=telefone,
                email=email,
                codigo_corretor=codigo_corretor,
                password=password
            )
            corretor.save()

            # Retorna a resposta JSON
            return JsonResponse({'success': 'Corretor cadastrado com sucesso!'}, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dados invalidos. Envie um JSON valido.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Metodo nÃ£o permitido. Use POST.'}, status=405)


def ver_clientes(request):
    if request.method == 'GET':
        # Obtem todos os objetos do modelo Cliente
        clientes = list(Cliente.objects.values())  # Converte para uma lista de dicionarios

        # Retorna a resposta JSON
        return JsonResponse({'clientes': clientes}, safe=False)
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
    

def busca_corretor_id(request):
    if request.method == 'GET':
        # Obtem o id da requisicao
        id = request.GET.get('id', '')
        # Busca o corretor pelo ID
        corretor = get_object_or_404(Corretor, id=id)

        # Converte o objeto do corretor para dicionário
        corretor_data = {
            'id': corretor.id,
            'nome': corretor.nome,
            'cpf': corretor.cpf,
            'endereco': corretor.endereco,
            'telefone': corretor.telefone,
            'email': corretor.email,
            'codigo_corretor': corretor.codigo_corretor
        }

        # Retorna a resposta JSON
        return JsonResponse({'corretor': corretor_data}, status=200)
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


@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            # Decodificando o JSON da requisição
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            tipo = data.get('tipo')

            # Verificando se os campos obrigatórios foram fornecidos
            if not email or not password or not tipo:
                return JsonResponse({'error': 'E-mail, senha e tipo sao obrigatorios.'}, status=400)

            # Login para Cliente (tipo = 1)
            if tipo == 1:
                user = Cliente.objects.filter(email=email, password=password).first()
                print('aq')
            # Login para Corretor (tipo = 2)
            elif tipo == 2:
                user = Corretor.objects.filter(email=email, password=password).first()
            else:
                return JsonResponse({'error': 'Tipo invalido.'}, status=400)

            if user:
                user_id = {
                'id': user.id
                }
                return JsonResponse({'id': user_id}, status=200)
            else:
                return JsonResponse({'error': 'E-mail ou senha invalidos.'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dados JSON invalidos.'}, status=400)
    else:
        return JsonResponse({'error': 'Metodo nao permitido.'}, status=405)