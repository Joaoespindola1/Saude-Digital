from django.db import models

class Cliente(models.Model):
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, unique=True)
    endereco = models.CharField(max_length=255)
    telefone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=255)
    data_nascimento = models.DateField()

    def __str__(self):
        return self.nome

class Corretor(models.Model):
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, unique=True)
    endereco = models.CharField(max_length=255)
    telefone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=255)
    registro_susep = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.nome

class PlanoSaude(models.Model):
    nome_plano = models.CharField(max_length=255)
    tipo_plano = models.CharField(max_length=50, blank=True, null=True)
    cobertura = models.TextField(blank=True, null=True)
    valor_mensal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nome_plano

class ClienteCorretor(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    corretor = models.ForeignKey(Corretor, on_delete=models.CASCADE)
    plano = models.ForeignKey(PlanoSaude, on_delete=models.CASCADE)
    data_associacao = models.DateField()
    status_associacao = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        unique_together = (('cliente', 'corretor'),)

    def __str__(self):
        return f"{self.cliente.nome} - {self.corretor.nome}"
