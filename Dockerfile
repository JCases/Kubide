FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

COPY .env ./

RUN npm run build

EXPOSE 3000

RUN npx prisma generate

CMD ["npm", "run", "start:prod"]