# Use a imagem Node.js oficial como base
FROM node:18.16.0

ENV DB_URL="mongodb://mongo:27017/ACHEI_O_BICHO"
ENV PORT=8080
ENV GLOBAL_PATH=apl-back-front/v1
ENV SECRET_KEY="I[W9X9QG>a0RkgmjiQ>X"
ENV INSTANCE_ID=instance58223
ENV TOKEN_API_MSG=3rvnc6k2oo4w8ygq
ENV TIMESTAMP_OTP=6000
ENV REGION_AWS=us-east-1
ENV AWS_ACCESS_KEY_ID=ASIA37I4JEJJ6C3RYLVI
ENV AWS_SECRET_ACCESS_KEY=PZuwDi66uygAGpUezOHeTHem6VB5bMaH0QnJV13L
ENV AWS_SESSION_TOKEN=FwoGZXIvYXdzEO7//////////wEaDIG2FbpGZ2zOcBgeLSK8ATPcINm2OG8ROuJuHo11ggk72ixIOHgRtFhy+HWvRrazxNgDcSMGwar0aLTTNTQSxpsjJWApcjuYompoOhI8O88ZDbE1djcBWHSU8LrA4ElDveHMc7OrHA29mp3xOWUC8LQ9yB8zUpurw8KVJPT2NVgmsjHir8OYvSKuMOU2nIQTFoU/4UoxWBzyLG2rvU2c/1QGcFmrLd5PAj95ufQXdwRqHtuL7TkaUplcMOMSkShM8OXqpQHOzgppLrPjKKym/6YGMi1IuJLF9iSXbSFDzF+Q9hYRymoJ+hjtcCyQhQJmnE9lYFwpR4vzZ+kbJzBo7y8=
ENV BUCKET_S3=pilha-nuvem-tcc-sptech-bucket
ENV BEARER_TOKEN_CLOUD_FUNCTION=eyJhbGciOiJSUzI1NiIsImtpZCI6IjZmNzI1NDEwMWY1NmU0MWNmMzVjOTkyNmRlODRhMmQ1NTJiNGM2ZjEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzMjU1NTk0MDU1OS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjMyNTU1OTQwNTU5LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE4MDUwNjQ3OTUzMjgxNDM1NDk3IiwiZW1haWwiOiJqb3NlLmJhbmR0ZWNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ6SXlZUkY0eC1nYXI1QmdBRUdDZzRnIiwiaWF0IjoxNjk1NjA4NDYwLCJleHAiOjE2OTU2MTIwNjB9.NdWG0ReS4yEWTOvlCpWYHQNwodLc1WBHY6Gts0Rlw-LaXbLKnBIooRyv1jCN3E6ewBvg2atYv48MlPASL748J2Fa7lJOu6k-hqbkIEyn1Ci5WKdhIs_PfOks-VRoICQuTMsnWSYy8KqpnWXOORLFtIW0JjhxGykBNN4a1k5Z18hC0n3qze2xsiEDFUaao8CIfs-MKdwRiTZ8lMI91iTxmAATdGg1WugqiE-elxckRqPJIJDzAEZJJHLtcGMKoyDeh9O_KxT6nTFbbpvgzc3IJ-MV8-7oVipgnE0dsoPvQ_CnBqV1xfTlXUdwZbXEU5klsK0ozIJvjmJabdPSsezq0g

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todo o código-fonte da aplicação para o contêiner
COPY . .

# Exponha a porta em que a aplicação estará ouvindo
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "start"]
