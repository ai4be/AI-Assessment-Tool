FROM node:16-alpine

# RUN apk add --no-cache --virtual build-deps \
#     gcc \
#     g++ \
#     make \
#     musl-dev openssl openssl-dev  \
#     python3 py3-pip \
#     mongo-c-driver-dev \
#     mongodb mongodb-tools \
#  && rm -rf /var/cache/apk/*
# RUN apk add --no-cache

ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install

# Remove packages by name
# RUN apk del build-deps

# Copying source files
COPY . .

CMD ["yarn", "dev"]

EXPOSE 3000
