FROM node:22.6.0

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

ENV PORT=2169

RUN npm run build

CMD ["npm", "run", "serve"]