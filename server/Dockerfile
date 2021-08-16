FROM node:14.17.3-alpine
ENV NODE_ENV=development
WORKDIR /usr/src/app/server
COPY ["package.json", "package-lock.json*", "tsconfig.json", "tslint.json", "./"]
RUN npm install
COPY . .