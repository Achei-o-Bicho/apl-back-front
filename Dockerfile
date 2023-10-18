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
ENV AWS_ACCESS_KEY_ID=ASIA37I4JEJJWT6CPQ4C
ENV AWS_SECRET_ACCESS_KEY=NTYVmwn/qWjV9UIG2pAJL0fv/K/kLrIB37NFm5bW
ENV AWS_SESSION_TOKEN=FwoGZXIvYXdzEG8aDI5dJuanWv6KRtbWtSK8AZHnQBPyPpjcNV9seuyotcDTGpi3v6wPLhuFv4Djo9ow0iJNJhvVrH7HrWB5vDFsTX2UNhbcVQ8sf3cxEtG1m0Dq4oCGyTddTRAmZphFdiaPEtgRMcwyNlhrLr+3aFwpSzR4vO6M/T2okjs2qQHOAXra2GPCtl0EMhBwadmlPrhxv/xUlH5UOXSL4Xi3E5apUYgJfHVHpGeJJ59wUA85dqUZJRpLTxQzvrHpGBlsH79ZNE2V3F7lEP+nHeUdKLn5tKkGMi1IjZkg/kQ/gLD3CiSyW69cxj85g0rv0C8YQEVM1Xs4juN3qDVxxMmjr1WS3yY=
ENV BUCKET_S3=pilha-nuvem-tcc-sptech-bucket
ENV BEARER_TOKEN_CLOUD_FUNCTION=eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkMzM0NDk3NTA2YWNiNzRjZGVlZGFhNjYxODRkMTU1NDdmODM2OTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE4MDUwNjQ3OTUzMjgxNDM1NDk3IiwiZW1haWwiOiJqb3NlLmJhbmR0ZWNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ0SnFFWlRvOGxZTWVVNHNrdVJWUEpRIiwibmJmIjoxNjk3NTkxMTkzLCJpYXQiOjE2OTc1OTE0OTMsImV4cCI6MTY5NzU5NTA5MywianRpIjoiMWIzZDAzY2M3Yjk5ZDI0N2M5YWMwMjc4NTlhOGI3MTQ5YmUyNjFhYSJ9.IhAtaW7x2LmiJ1xRcZvfn9DLIQqzci_lc1wKEO8x_1IzyA24KSOsvzXJqrhyfrIlv-vhXDhOWSnhGotet0J5JczeEGuCcOgHw3Qr_EDpbO30BRG9K2wL5NWPhlvqXWvJC9_acH7wGD9AE8Kil4Bfo59K0MswCMSyA5JxUgjCt3MpsNlCUGEgiaOvWtuv2xzWjpXrpyZ7As7HQkyqPF48XcdJuw16oQHj7sgAxeZ378WOJEKCyrbDeQb5jyRHJdGBJSSry5sIeWUnIwENJtuVOdYtyRJE035fRqGQa-Uh3mZEckV3FxQntlFq2_4bkQupO2waG6GEv_UbQ6SYqifDCA

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
