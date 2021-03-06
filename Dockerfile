FROM node:7.6.0

MAINTAINER Oded Balazada

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# set port
EXPOSE 80

#run the app
CMD [ "npm", "start" ]