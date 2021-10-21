FROM node:14.17.3-alpine
ENV NODE_ENV=development
WORKDIR /usr/src/app/api_test
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .