# Use a imagem Node.js oficial como base
FROM node:18.16.0

ENV DB_URL="mongodb://mongo:27017/ACHEI_O_BICHO"
ENV MONGODB_PASSWORD=Admin@acbc
ENV MONGODB_USERNAME=adbc
ENV PORT=8080
ENV REDIS_HOST="redis"
ENV REDIS_PORT=6379
ENV REDIS_PASSWORD='O#lxYry!zEa><FKa'
ENV GLOBAL_PATH=apl-back-front/v1
ENV SECRET_KEY="I[W9X9QG>a0RkgmjiQ>X"
ENV INSTANCE_ID=instance69566
ENV TOKEN_API_MSG=1qwxsr4ofpb3nwuy
ENV TIMESTAMP_OTP=6000
ENV REGION_AWS=us-east-1
ENV AWS_ACCESS_KEY_ID=ASIA37I4JEJJYBQNIO2K
ENV AWS_SECRET_ACCESS_KEY=gWNPvbFcgeUk2JuiHc7mhImWVtUTu3qtxD7byArt
ENV AWS_SESSION_TOKEN=FwoGZXIvYXdzEEgaDAiNwvC1lQZC5ru6liK8AaliE6WVTrsUI1lq/2RsYXCLDbfb4oawA4/qSiRl8ewnfvCz+PkCRD9+EuqCHI1R5i+ud92p4/DXhxTdYvv00glcculQlevW+3oqTMCmLJrINUCVddkGvaO7KSPORyWiH0yBHV/8vwKmmzAwly9R9yQRld15DxvgelCx/HWhX8c5T/OrS/nu1bL19Eu/9E4VJh+jBHgEmEJq4uUFTyi8JMWkIQtiXO+5WZYZlQXnzoCkQFGGJ74SmeBqH/3NKLqyjasGMi3Yvr2rpFj9i4ZrNLr0CxAt7Z8oGPuA7/RhLFn4QY5XE1f30g2Sd0o+nMrCdLY=
ENV BUCKET_S3=pilha-nuvem-tcc-sptech-bucket
ENV BEARER_TOKEN_CLOUD_FUNCTION=eyJhbGciOiJSUzI1NiIsImtpZCI6IjBlNzJkYTFkZjUwMWNhNmY3NTZiZjEwM2ZkN2M3MjAyOTQ3NzI1MDYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE4MDUwNjQ3OTUzMjgxNDM1NDk3IiwiZW1haWwiOiJqb3NlLmJhbmR0ZWNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJiQU9maFg3RkNjRnVZczhGTnRIRTVRIiwibmJmIjoxNzAxMDA5NjI1LCJpYXQiOjE3MDEwMDk5MjUsImV4cCI6MTcwMTAxMzUyNSwianRpIjoiZDZmZGQ1Nzk4ODc3M2E3OThmMGYzNTM0ZmE3NGE4NjYxYmUxZDgyYyJ9.T9TiDj3Lmi5J6iPlJjZRAX6U4QBcnv5HJHy3EQEhvQsMzkiPp5833dZG_Hlx4Rs2-QTidrTYcng7EFZu6GwOLDxsHnCFdnitMELdaCM_77QmQbteezu0xGDuK_KPuyj96z5jrEFGZm4biT84-kRrMQWpHHhlCmDdspkSoB1oyxizg-Ezq0AeFDKxOJ-YJq1XtdkcuO5LcqtyLQ51S7XpPIpcUBmUDsB8BTXV4hxGob7KFeF0HxcC1dQrfKcAvOSnFi9KcjXMbtuSsqLdwEPde5f_QG-0LLpQpc4ztrTk8UwEwdVGMrUJwVKvzpMkgeckhwOOk0pGJRJtuQwqdBIz6g
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
