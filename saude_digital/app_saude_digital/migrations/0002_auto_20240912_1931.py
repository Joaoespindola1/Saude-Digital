# Generated by Django 2.2.12 on 2024-09-12 19:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_saude_digital', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nome', models.TextField(max_length=255)),
            ],
        ),
        migrations.DeleteModel(
            name='Usuarios',
        ),
    ]