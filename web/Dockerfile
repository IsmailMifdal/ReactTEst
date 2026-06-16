# Image du front React (Create React App - serveur de dev)
FROM node:20-alpine

WORKDIR /app

# Installer les dépendances en premier (cache de couches)
COPY package.json package-lock.json ./
RUN npm install

# Code de l'application
COPY . .

# CRA : ne pas tenter d'ouvrir un navigateur, watch fiable sur volume monté
ENV BROWSER=none
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000

CMD ["npm", "start"]
