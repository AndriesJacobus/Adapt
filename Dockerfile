FROM ubuntu:16.04

RUN apt-get update --fix-missing
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN apt-get install -y wget
RUN apt-get install -y apt-transport-https
RUN apt-get install -y mongodb
RUN apt-get remove -y mongodb
RUN apt-get -y autoremove

RUN wget -O - https://debian.neo4j.org/neotechnology.gpg.key | apt-key add -
RUN echo 'deb https://debian.neo4j.org/repo stable/' | tee /etc/apt/sources.list.d/neo4j.list
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
RUN echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list
RUN apt-get update

RUN apt-get install -y mongodb-org
RUN apt-get install -y python3-pip
RUN pip3 install --upgrade pip
RUN pip3 install pandas
RUN pip3 install numpy
RUN pip3 install seaborn
RUN pip3 install matplotlib
RUN pip3 install scikit-learn
RUN pip3 install scipy
RUN pip3 install mpld3
RUN pip3 install neo4jrestclient
RUN pip3 install pymongo
RUN apt-get install -y net-tools

WORKDIR /app

COPY package.json /app

RUN npm install
RUN mkdir -p /data/db

RUN apt-get update
RUN apt-get install -y default-jre default-jre-headless

RUN apt-get install -y --allow-unauthenticated neo4j=3.0.1
RUN apt-get install -y curl

RUN apt-get install -y graphviz
RUN pip3 install pydotplus
RUN apt-get install -y python3-tk

RUN echo "dbms.connector.http.address=0.0.0.0:7474" >> /etc/neo4j/neo4j.conf

COPY . /app

CMD service neo4j start; mongod --fork --logpath /var/log/mongod.log --logappend;sleep 10s; curl -H "Content-Type: application/json" -X POST -d '{"password":"12345678"}' -u neo4j:neo4j http://localhost:7474/user/neo4j/password;python3 -c 'from scripts.repository.front_end_funtions import user_reg; user_reg("bob", "builder", "a@b.com", "1")'; python3 scripts/trend_relevance/init_algorithm_nodes.py; nodejs server.js

EXPOSE 7687 7000 7474 7473