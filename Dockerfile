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

USER 1001

# install and cache app dependencies
#RUN yarn

# start app
#CMD npm install\
#&& npm start
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
