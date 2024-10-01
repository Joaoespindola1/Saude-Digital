# Generated by Django 2.2.12 on 2024-10-01 12:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('cpf', models.CharField(max_length=14, unique=True)),
                ('endereco', models.CharField(max_length=255)),
                ('telefone', models.CharField(blank=True, max_length=15, null=True)),
                ('email', models.EmailField(max_length=255)),
                ('data_nascimento', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Corretor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('cpf', models.CharField(max_length=14, unique=True)),
                ('endereco', models.CharField(max_length=255)),
                ('telefone', models.CharField(blank=True, max_length=15, null=True)),
                ('email', models.EmailField(max_length=255)),
                ('registro_susep', models.CharField(max_length=20, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='PlanoSaude',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome_plano', models.CharField(max_length=255)),
                ('tipo_plano', models.CharField(blank=True, max_length=50, null=True)),
                ('cobertura', models.TextField(blank=True, null=True)),
                ('valor_mensal', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='FeedbackCliente',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('avaliacao', models.IntegerField()),
                ('comentario', models.TextField(blank=True, null=True)),
                ('data_feedback', models.DateField()),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_saude_digital.Cliente')),
                ('corretor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_saude_digital.Corretor')),
            ],
        ),
        migrations.CreateModel(
            name='ClienteCorretor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_associacao', models.DateField()),
                ('status_associacao', models.CharField(blank=True, max_length=20, null=True)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_saude_digital.Cliente')),
                ('corretor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_saude_digital.Corretor')),
                ('plano', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_saude_digital.PlanoSaude')),
            ],
            options={
                'unique_together': {('cliente', 'corretor')},
            },
        ),
    ]
