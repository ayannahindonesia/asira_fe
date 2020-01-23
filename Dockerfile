#base image
FROM node

# set working directory
WORKDIR /opt/app-root/src
#RUN mkdir /usr/src/app
RUN chmod 775 /opt/app-root/src
#copy all files from current directory to docker
COPY . /opt/app-root/src



# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /opt/app-root/src/node_modules/.bin:$PATH

# install and cache app dependencies
#RUN yarn

# start app
CMD npm start

EXPOSE 3001
