FROM node:18-alpine

ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install

# Copying source files
COPY . .

CMD ["yarn", "dev"]

EXPOSE 3000
