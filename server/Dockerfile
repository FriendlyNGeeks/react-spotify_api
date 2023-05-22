#Dockerfile
#node:14.15.1-alpine
FROM arm64v8/node:19.1.0-alpine
LABEL version="0.0.7"
LABEL description="React Spotify API server for Now Playing"
LABEL maintainer="friendlyneighborhoodgeeks@gmail.com"
# ENV DEBUG=*
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --production
# If you are building your code for production
# RUN npm ci --omit=dev
RUN apk add nano
ENV NODE_ENV=production
# Bundle app source
COPY . .
EXPOSE 7007
# CMD [ "npm", "start" ]
ENTRYPOINT node server.js
