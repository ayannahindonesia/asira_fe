#base image
FROM node

# set working directory
WORKDIR /opt/app-root/src
#RUN mkdir /usr/src/app
RUN chmod 777 /opt/app-root/src
#copy all files from current directory to docker
COPY . /opt/app-root/src



# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /opt/app-root/src/node_modules/.bin:$PATH

CMD npm install core-js
RUN chown -R 1001:0 /opt/app-root/src/ &&  chmod -R ug+rwx /opt/app-root/src/

USER 1001

# install and cache app dependencies
#RUN yarn

# start app
CMD npm start

EXPOSE 3001
