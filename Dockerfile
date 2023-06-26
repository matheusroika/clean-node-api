FROM node:16
RUN yarn
RUN yarn build
RUN yarn --production