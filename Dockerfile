#base image
FROM node

# set working directory
RUN mkdir /usr/src/app
#copy all files from current directory to docker
COPY . /usr/src/app

WORKDIR /usr/src/app

## add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN chown -R 1001:1001 /usr/src/app/ &&  chmod -R ug+rwx /usr/src/app/
#RUN chown -R 1001:1001 /.config
#RUN chown -R 1001:1001 /usr/src/app/node_modules/
#RUN cd /usr/src/app/src/
#RUN ls -lrth
RUN chown -R 1001:0 /.npm

USER 1001

# install and cache app dependencies
#RUN yarn

# start app
CMD npm install -g npm-check-updates
RUN chown -R 1001:0 /.npm
CMD npm start


EXPOSE 3000
EXPOSE 35729
#FROM node

# set working directory
#RUN mkdir /usr/src/app
#copy all files from current directory to docker
#COPY . /usr/src/app

#WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
#ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
#RUN yarn

# start app
#CMD npm install\
#&& npm audit fix
#CMD npm start

#EXPOSE 3001
