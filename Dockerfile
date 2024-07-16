FROM node:lts-alpine

WORKDIR /app
COPY index.js /app/index.js

CMD ["node", "index.js"]
