FROM node:16
WORKDIR /usr/src/clean-node-api
COPY . .
RUN yarn
RUN yarn build
RUN yarn --production