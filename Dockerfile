FROM node

# set working directory
RUN mkdir /usr/src/app
#copy all files from current directory to docker
COPY . /usr/src/app

WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH


# install and cache app dependencies
#RUN yarn
RUN CI=true 
RUN npm install
RUN chmod -R 777 /usr/src/app/

# start app
CMD npm install -g npm-check-updates\
&& npm start

EXPOSE 3001
