FROM node:latest
COPY . /submission
WORKDIR /submission
RUN npm install
RUN npm link