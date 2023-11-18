FROM node:14

WORKDIR /whatsapp-in

COPY package*.json ./

RUN npm install

COPY . .

# Adicionando logs
RUN ls -al
RUN pwd
RUN npm ls

CMD ["node", "broker-routes/app-webhook.js"]
