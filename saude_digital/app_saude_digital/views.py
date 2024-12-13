from django.db.models import Avg
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from .models import Cliente, Corretor, FeedbackCliente, ClienteCorretor
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

            # Obtém os dados do corretor
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
        return JsonResponse({'error': 'Metodo não permitido. Use POST.'}, status=405)


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

        # Converte o objeto do corretor para dicion�rio
        corretor_data = {
            'id': corretor.id,
            #'foto_perfil': corretor.foto_perfil,
            'nome': corretor.nome,
            'cpf': corretor.cpf,
            'endereco': corretor.endereco,
            'telefone': corretor.telefone,
            'email': corretor.email,
            'codigo_corretor': corretor.codigo_corretor,
            'descricao': corretor.descricao,
            'clientes_vinculados': corretor.clientes_vinculados
        }

        # Retorna a resposta JSON
        return JsonResponse({'corretor': corretor_data}, status=200)
    else:
        return JsonResponse({'error': 'Metodo nao permitido. Use GET.'}, status=405)


@csrf_exempt
def buscar_corretores(request):
    if request.method == 'GET':
        try:
            endereco = request.GET.get('endereco', '')
            plano_nome = request.GET.get('plano_nome', '')

            corretores = Corretor.objects.all()

            if endereco:
                corretores = corretores.filter(endereco__icontains=endereco)

            if plano_nome:
                corretores = corretores.filter(corretorplano__plano__nome=plano_nome)

            corretores_list = list(corretores.values('id', 'nome', 'email', 'endereco'))

            return JsonResponse({'corretores': corretores_list}, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Metodo nao permitido. Use GET.'}, status=405)


@csrf_exempt
def atualiza_corretor(request):
    if request.method == 'POST':
        try:
            # Parseia os dados do corpo da requisi��o JSON
            data = json.loads(request.body)

            # Obt�m o ID do corretor a partir dos dados JSON
            id = data.get('id')
            if not id:
                return JsonResponse({'error': 'ID do corretor e obrigatorio.'}, status=400)

            # Obt�m o corretor pelo ID, retornando um 404 se n�o encontrado
            corretor = get_object_or_404(Corretor, id=id)

            # Atualiza os campos permitidos, mantendo os valores atuais se n�o forem enviados
            corretor.nome = data.get('nome', corretor.nome)
            corretor.cpf = data.get('cpf', corretor.cpf)
            corretor.endereco = data.get('endereco', corretor.endereco)
            corretor.telefone = data.get('telefone', corretor.telefone)
            corretor.email = data.get('email', corretor.email)
            corretor.codigo_corretor = data.get('codigo_corretor', corretor.codigo_corretor)
            corretor.password = data.get('password', corretor.password)
            corretor.descricao = data.get('descricao', corretor.descricao)

            # Salva as altera��es no banco de dados
            corretor.save()

            # Retorna o corretor atualizado como JSON
            return JsonResponse({
                'message': 'Corretor atualizado com sucesso!',
                'corretor': {
                    'id': corretor.id,
                    'nome': corretor.nome,
                    'cpf': corretor.cpf,
                    'endereco': corretor.endereco,
                    'telefone': corretor.telefone,
                    'email': corretor.email,
                    'codigo_corretor': corretor.codigo_corretor,
                    'descricao': corretor.descricao,
                }
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dados JSON invalidos.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Metodo nao permitido. Use POST.'}, status=405)


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
            # Decodificando o JSON da requisi��o
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            tipo = data.get('tipo')

            # Verificando se os campos obrigat�rios foram fornecidos
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
                return JsonResponse(user_id, status=200)
            else:
                return JsonResponse({'error': 'E-mail ou senha invalidos.'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dados JSON invalidos.'}, status=400)
    else:
        return JsonResponse({'error': 'Metodo nao permitido.'}, status=405)
    

@csrf_exempt
def cadastra_avaliacao(request):
    if request.method == 'POST':
        try:
            # Parseia os dados do corpo da requisição JSON
            data = json.loads(request.body)

            # Obtém o ID do cliente e do corretor e a avaliação
            cliente_id = data.get('cliente_id')
            corretor_id = data.get('corretor_id')
            avaliacao = data.get('avaliacao')
            comentario = data.get('comentario', '')

            # Valida se os campos obrigatórios estão presentes
            if not all([cliente_id, corretor_id, avaliacao]):
                return JsonResponse({'error': 'Cliente ID, Corretor ID e avaliação são obrigatórios.'}, status=400)

            # Verifica se o cliente e corretor existem
            try:
                cliente = Cliente.objects.get(id=cliente_id)
                corretor = Corretor.objects.get(id=corretor_id)
            except Cliente.DoesNotExist:
                return JsonResponse({'error': 'Cliente não encontrado.'}, status=404)
            except Corretor.DoesNotExist:
                return JsonResponse({'error': 'Corretor não encontrado.'}, status=404)

            # Tenta obter um feedback existente para o cliente e corretor
            feedback, created = FeedbackCliente.objects.update_or_create(
                cliente=cliente,
                corretor=corretor,
                defaults={'avaliacao': avaliacao, 'comentario': comentario, 'data_feedback': timezone.now()}  # Adicionando a data de feedback
            )

            # Prepara a mensagem de resposta
            if created:
                message = 'Avaliação criada com sucesso!'
            else:
                message = 'Avaliação atualizada com sucesso!'

            return JsonResponse({
                'message': message,
                'feedback': {
                    'id': feedback.id,
                    'cliente': feedback.cliente.nome,
                    'corretor': feedback.corretor.nome,
                    'avaliacao': feedback.avaliacao,
                    'comentario': feedback.comentario,
                    'data_feedback': feedback.data_feedback.strftime('%d/%m/%Y')  # Formatando a data
                }
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dados JSON inválidos.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Método não permitido. Use POST.'}, status=405)
    

@csrf_exempt
def ver_avaliacao_corretor(request):
    if request.method == 'POST':
        try:
            # Parseia o corpo da requisição para obter o ID do corretor
            data = json.loads(request.body)
            corretor_id = data.get('id')

            # Valida se o ID foi enviado
            if not corretor_id:
                return JsonResponse({'error': 'O campo "id" do corretor é obrigatório.'}, status=400)

            # Verifica se o corretor existe
            try:
                corretor = Corretor.objects.get(id=corretor_id)
            except Corretor.DoesNotExist:
                return JsonResponse({'error': 'Corretor não encontrado.'}, status=404)

            # Calcula a média das avaliações do corretor
            media = FeedbackCliente.objects.filter(corretor_id=corretor_id).aggregate(media_avaliacao=Avg('avaliacao'))

            # Arredonda a média para 1 casa decimal (ou retorna 0 se for None)
            media_avaliacao = round(media['media_avaliacao'] or 0, 1)

            # Obtém as avaliações completas, incluindo cliente, data e comentário
            avaliacoes = FeedbackCliente.objects.filter(corretor_id=corretor_id).values(
                'cliente__nome', 'comentario', 'data_feedback', 'avaliacao'
            )

            # Formata as avaliações para serem retornadas
            avaliacao_list = [
                {
                    'cliente': avaliacao['cliente__nome'],
                    'comentario': avaliacao['comentario'],
                    'data_feedback': avaliacao['data_feedback'].strftime('%d/%m/%Y'),
                    'avaliacao': avaliacao['avaliacao']
                }
                for avaliacao in avaliacoes
            ]

            return JsonResponse({
                'corretor_id': corretor_id,
                'media_avaliacao': media_avaliacao,
                'avaliacoes': avaliacao_list
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dados JSON inválidos.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Método não permitido. Use POST.'}, status=405)
    

@csrf_exempt
def associar_cliente_a_corretor(request):
    if request.method == 'POST':
        try:
            # Parseia os dados do corpo da requisi��o JSON
            data = json.loads(request.body)
            cliente_id = data.get('cliente_id')
            corretor_id = data.get('corretor_id')
            status_associacao = data.get('status_associacao', 'ativo')  # Default para "ativo"

            # Verifica se os IDs foram fornecidos
            if not cliente_id or not corretor_id:
                return JsonResponse({'error': 'Cliente ID e Corretor ID sao obrigatorios.'}, status=400)

            # Verifica se o cliente e o corretor existem
            cliente = get_object_or_404(Cliente, id=cliente_id)
            corretor = get_object_or_404(Corretor, id=corretor_id)

            # Cria ou atualiza a associa��o entre cliente e corretor
            associacao, created = ClienteCorretor.objects.update_or_create(
                cliente=cliente,
                corretor=corretor,
                defaults={
                    'data_associacao': timezone.now().date(),
                    'status_associacao': status_associacao
                }
            )

            # Prepara a resposta
            if created:
                message = 'Cliente associado ao corretor com sucesso!'
            else:
                message = 'Associacao atualizada com sucesso!'

            return JsonResponse({
                'message': message,
                'associacao': {
                    'cliente': cliente.nome,
                    'corretor': corretor.nome,
                    'data_associacao': associacao.data_associacao,
                    'status_associacao': associacao.status_associacao
                }
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dados JSON invalidos.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Metodo nao permitido. Use POST.'}, status=405)


@csrf_exempt
def associar_plano_a_corretor(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            corretor_id = data.get('corretor_id')
            plano_id = data.get('plano_id')

            if not corretor_id or not plano_id:
                return JsonResponse({'error': 'Corretor ID e Plano ID sao obrigatorios.'}, status=400)

            corretor = get_object_or_404(Corretor, id=corretor_id)
            plano = get_object_or_404(Plano, id=plano_id)

            ligacao, created = CorretorPlano.objects.update_or_create(
                corretor=corretor,
                plano=plano,
                defaults={
                    'data_inicio': now().date()
                }
            )

            message = 'Plano associado ao corretor com sucesso!' if created else 'Associacao atualizada com sucesso!'

            return JsonResponse({
                'message': message,
                'associacao': {
                    'corretor': corretor.nome,
                    'plano': plano.nome,
                    'data_inicio': ligacao.data_inicio
                }
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dados JSON invalidos.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Metodo nao permitido. Use POST.'}, status=405)
    