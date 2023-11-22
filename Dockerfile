# Use a imagem Node.js oficial como base
FROM node:18.16.0

ENV DB_URL="mongodb://mongo:27017/ACHEI_O_BICHO"
ENV PORT=8080
ENV REDIS_HOST="redis"
ENV REDIS_PORT=6379
ENV REDIS_PASSWORD='O#lxYry!zEa><FKa'
ENV GLOBAL_PATH=apl-back-front/v1
ENV SECRET_KEY="I[W9X9QG>a0RkgmjiQ>X"
ENV INSTANCE_ID=instance58223
ENV TOKEN_API_MSG=3rvnc6k2oo4w8ygq
ENV TIMESTAMP_OTP=6000
ENV REGION_AWS=us-east-1
ENV AWS_ACCESS_KEY_ID=ASIA37I4JEJJVJBJWC4Y
ENV AWS_SECRET_ACCESS_KEY=HB+Z4CT54YB5v8VU8EkG3KUs9zqBnYdbQURc1ttv
ENV AWS_SESSION_TOKEN=FwoGZXIvYXdzENv//////////wEaDCPsGgz45lygPDEJDSK8AQV0q8Y8XA98rxhcickAoMEAjnJHHberfuhzfbcWoJMCEJTc986ngFhVvnbXWpKCw0IgkEmhPkQIohk3XRwbyHJP5ZrSfktdtCBcLDSsWePlLiMg7OLkAz95kFxmLQk91UOV3wA1XuHfCNiOHpl2/tlxu9eN0UCDu797CMbLH7arHPonZwzNiwU3Fo0AIeyNQmpoULG/1IF4JULvtcnGlhtzxISOwLb9tnJEKaThS7CTg2pIwMw4uGKaeYk2KODB9aoGMi0ASiaJ4AceVstOy8xYWYXZHlZ6wvAwLYZZEcfSY5BQQIo27CyJnW/r3Oco3gQ=
ENV BUCKET_S3=pilha-nuvem-tcc-sptech-bucket
ENV BEARER_TOKEN_CLOUD_FUNCTION=eyJhbGciOiJSUzI1NiIsImtpZCI6IjViMzcwNjk2MGUzZTYwMDI0YTI2NTVlNzhjZmE2M2Y4N2M5N2QzMDkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE4MDUwNjQ3OTUzMjgxNDM1NDk3IiwiZW1haWwiOiJqb3NlLmJhbmR0ZWNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiIzUUFUR216M1U3dmpSOFp5Q0VZX2NBIiwibmJmIjoxNzAwNjE4NTEyLCJpYXQiOjE3MDA2MTg4MTIsImV4cCI6MTcwMDYyMjQxMiwianRpIjoiNTQ5MWE3NzY2NjkxODAxM2ZlNTRjNTM1ZjczZjNlZTk1ZjU0ZTliNCJ9.sj1QDrTsegUyxnX-yIc5FCYzQwEkNEFEVW2PB_rHy6aXBlNkGcCc7OP9-JffpEdLMmkQgHDAB05uOU94eMgAQ67Ams2XZgqgkm4idyPn8UW1CiT24sYR-agSaB0VIX_4-T3h4rJY5WtmQmrm7tyLYDrLfTiK2xVoQa0O5nBwiaQruJPO5Q2V1E2VpxUOnmxaFO71dSbyQtpCUOjska2EMHOq8N_fjINvOELMCSnOxoSyYhIlW2iZc5leLa1yxtD5ANePcHtLKcfvH1zf7pWE90RdJkzbnw-dp5UeNhXpaEYbBQtwMMGu8cdU97ZnsNJh8iPpuNRn9UGZzjRd0nzQ6g
# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install --legacy-peer-deps

# Copie todo o código-fonte da aplicação para o contêiner
COPY . .

# Exponha a porta em que a aplicação estará ouvindo
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "start"]
