FROM node:alpine
WORKDIR /frontend
COPY . .
RUN npm config set unsafe-perm true
RUN npm i --legacy-peer-deps
RUN npm run build
#
