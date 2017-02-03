FROM ubuntu:16.04
MAINTAINER luca@quantmind.com

RUN DEBIAN_FRONTEND=noninteractive \
        apt-get update && apt-get install -y \
            language-pack-en

ENV LANG en_US.UTF-8

ADD . /home/benchmarking
WORKDIR /home/benchmarking

RUN DEBIAN_FRONTEND=noninteractive apt-get update \
    && apt-get install -y \
            autoconf automake libtool build-essential libssl-dev \
            python3 python3-pip git gosu curl npm \
    && curl -sL https://deb.nodesource.com/setup_7.x | bash - \
    && apt-get install -y nodejs \
    && git clone https://github.com/wg/wrk.git \
    && cd wrk \
    && make \
    && cd .. \
    && pip3 install -U pip \
    && pip3 install -r requirements.txt \
    && npm install -g express


EXPOSE 7000

# ENTRYPOINT ["./entrypoint"]
