# Generated by Django 5.1.1 on 2024-10-02 14:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app_saude_digital', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='corretor',
            old_name='registro_susep',
            new_name='registro_plano',
        ),
    ]
