FROM node:24-alpine
WORKDIR /app
RUN mkdir -p /app/.dev-mail && chown node:node /app/.dev-mail && chmod 700 /app/.dev-mail
COPY package*.json ./
RUN npm ci --omit=dev
COPY public ./public
COPY db ./db
COPY catalogue ./catalogue
COPY server.mjs model.mjs ./
COPY server ./server
USER node
EXPOSE 3000
CMD ["node","server.mjs"]
