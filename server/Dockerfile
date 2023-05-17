#Dockerfile
FROM node:14.15.1-alpine
LABEL version="0.0.1"
LABEL description="React Spotify API server for Now Playing"
LABEL maintainer="friendlyneighborhoodgeeks@gmail.com"
# ENV DEBUG=*
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --production
ENV NODE_ENV=production
COPY . /usr/src/app
# RUN chmod +x docker-entrypoint.sh
EXPOSE 7007
# ENTRYPOINT ["/bin/sh -c npm start"]
CMD [ "npm", "start" ]
