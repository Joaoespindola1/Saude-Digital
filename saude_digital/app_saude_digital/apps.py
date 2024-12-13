from django.apps import AppConfig

class AppSaudeDigitalConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app_saude_digital'

    def ready(self):
        from .scripts.carga_inicial import criar_planos_iniciais
        criar_planos_iniciais()
