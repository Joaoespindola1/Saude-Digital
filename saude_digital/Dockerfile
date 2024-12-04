# Dockerfile para o aplicativo Django

FROM python:3.9-slim

# Instala as dependências do sistema necessárias para o psycopg2
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia o arquivo de requisitos
COPY requirements.txt /app/

# Instala as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código do aplicativo para o contêiner
COPY . /app/

# Expõe a porta 8000
EXPOSE 8000

# Comando para iniciar o servidor Djang
CMD ["sh", "-c", "python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:8000"]

