FROM ubuntu:18.04
RUN apt update
RUN apt install -y nginx vim curl wget
COPY nginx-default.conf /etc/nginx/sites-available/default
COPY nginx.conf /etc/nginx/nginx.conf
RUN apt install python -y
RUN apt-get install build-essential -y

RUN mkdir -p /var/www/hopscotch/public_html

RUN mkdir -p /tempFiles

WORKDIR /tempFiles

ENV NODE_FILENAME node-v14.16.1-linux-x64.tar.gz
RUN wget https://nodejs.org/dist/v14.16.1/$NODE_FILENAME

RUN tar --strip-components 1 -xzvf node-v* -C /usr/local

RUN rm $NODE_FILENAME

WORKDIR /var/www/hopscotch/public_html

COPY html /var/www/hopscotch/public_html

RUN npm install --verbose

RUN npm install parcel-bundler@1.12.3 -g

RUN npm install jasmine -g

RUN parcel build index.html 

EXPOSE 80

CMD ["nginx"]

