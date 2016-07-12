FROM ubuntu:xenial
MAINTAINER open-intent.io

RUN apt-get update && apt-get install -y nodejs npm
RUN apt-get install -y libboost-system1.58 \
                               libboost-regex1.58 \
                               libboost-log1.58

COPY node_modules/ /usr/src/node_modules/
COPY package.json /usr/src/
COPY messenger.js /usr/src/
COPY app.js /usr/src/

WORKDIR /usr/src

CMD ["nodejs", "app.js"]
