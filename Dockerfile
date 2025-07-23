FROM node:24.2.0-bookworm
WORKDIR /app
COPY . /app
CMD ["npm", "run", "prod"]
