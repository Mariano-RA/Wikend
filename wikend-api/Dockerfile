FROM node:alpine  AS builderBack

WORKDIR /app
COPY . .
RUN npm ci

RUN npm run build

# Creamos una nueva imagen para producción y copiamos los archivos necesarios
FROM node:alpine AS production
WORKDIR /app
COPY --from=builderBack /app/package.json /app

RUN npm install
COPY --from=builderBack /app/dist ./dist
COPY --from=builderBack /app/client ./client
COPY --from=builderBack /app/database ./database

EXPOSE 3000

CMD ["npm", "run", "prod"]