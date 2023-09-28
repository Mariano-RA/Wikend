FROM node:alpine  AS builderBack

WORKDIR /app
COPY . .
RUN npm install

RUN npm run build
RUN npm prune --production

# Creamos una nueva imagen para producción y copiamos los archivos necesarios
FROM node:alpine AS production
WORKDIR /app
COPY --from=builderBack /app/package.json /app

RUN npm install

COPY --from=builderBack /app/dist ./dist


EXPOSE 3000

CMD ["npm", "run", "prod"]