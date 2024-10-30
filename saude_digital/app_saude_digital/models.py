from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class Cliente(models.Model):
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, unique=True)
    endereco = models.CharField(max_length=255)
    telefone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=255)
    data_nascimento = models.DateField()
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.nome

class Corretor(models.Model):
    foto_perfil = models.ImageField(upload_to='fotos_perfil/', blank=True, null=True)
    capa = models.ImageField(upload_to='capas/', blank=True, null=True)
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, unique=True)
    endereco = models.CharField(max_length=255)
    telefone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=255)
    codigo_corretor = models.CharField(max_length=20, unique=True)
    descricao = models.TextField(blank=True, null=True)
    clientes_vinculados = models.PositiveIntegerField(default=0)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.nome

class Postagem(models.Model):
    corretor = models.ForeignKey(Corretor, related_name='fotos_postadas', on_delete=models.CASCADE)
    imagem = models.ImageField(upload_to='fotos_corretor/')
    descricao = models.TextField(blank=True, null=True)
    data_postagem = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Foto de {self.corretor.nome} - {self.data_postagem}"

class ClienteCorretor(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    corretor = models.ForeignKey(Corretor, on_delete=models.CASCADE)
    data_associacao = models.DateField()
    status_associacao = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        unique_together = ('cliente', 'corretor')

    def __str__(self):
        return f"{self.cliente.nome} - {self.corretor.nome}"

class FeedbackCliente(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    corretor = models.ForeignKey(Corretor, on_delete=models.CASCADE)
    avaliacao = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ],
        help_text="Valores entre 1 e 5"
    )
    comentario = models.TextField(blank=True, null=True)
    data_feedback = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Feedback de {self.cliente.nome} para {self.corretor.nome}"
        
class PlanoDeSaude(models.Model):
    plano_especialidade = models.CharField(max_length=100)
    corretor = models.ForeignKey(Corretor, on_delete=models.CASCADE, related_name='planos')

    def __str__(self):
        return f"{self.plano_especialidade} - {self.corretor.nome}"
