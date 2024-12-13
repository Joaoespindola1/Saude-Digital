from ..models import Plano

def criar_planos_iniciais():
    planos_iniciais = [
        {'nome': 'Unimed'},
        {'nome': 'Bradesco Saúde'},
        {'nome': 'Amil'},
        {'nome': 'Notre Dame'},
        {'nome': 'HapVida'}
    ]

    for plano in planos_iniciais:
        Plano.objects.update_or_create(nome=plano['nome'], defaults=plano)

    print("Planos iniciais criados com sucesso!")
