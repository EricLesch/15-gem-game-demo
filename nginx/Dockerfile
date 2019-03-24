FROM ubuntu:18.04
RUN apt update
RUN apt install -y nginx vim curl wget
COPY nginx-default.conf /etc/nginx/sites-available/default
COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/www/hopscotch/public_html

RUN mkdir -p /tempFiles

WORKDIR /tempFiles

ENV NODE_FILENAME node-v10.15.1-linux-x64.tar.gz
RUN wget https://s3.amazonaws.com/hopscotch-demo-dependencies/$NODE_FILENAME
RUN echo "9d69d0da5bee997e10a480a0c8b9afcc7b93b887  $NODE_FILENAME" >> NODE_SHA_SUM
RUN sha1sum -c NODE_SHA_SUM

RUN tar --strip-components 1 -xzvf node-v* -C /usr/local

RUN rm $NODE_FILENAME

WORKDIR /var/www/hopscotch/public_html

COPY html /var/www/hopscotch/public_html

RUN npm install --verbose

RUN npm install parcel -g

RUN npm install jasmine -g

RUN parcel build index.html 

EXPOSE 80

CMD ["nginx"]

