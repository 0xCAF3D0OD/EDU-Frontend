# Stage 1: Builder
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Nginx (serveur léger)
FROM nginx:alpine

# Copie les fichiers buildés dans Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie la config Nginx (voir ci-dessous)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]