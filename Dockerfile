FROM python:3.6.3

WORKDIR /home/benchmarking

RUN DEBIAN_FRONTEND=noninteractive apt-get update \
    && apt-get install -y \
        locales

ENV DOCKER true

ENV LANG en_US.UTF-8

ADD . /home/benchmarking

RUN DEBIAN_FRONTEND=noninteractive apt-get update \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y \
            autoconf automake libtool build-essential libssl-dev \
            nodejs git curl \
    && git clone https://github.com/wg/wrk.git \
    && cd wrk \
    && make \
    && mv wrk /usr/local/bin \
    && cd .. \
    && rm -rf wrk \
    && pip install -U pip wheel setuptools \
    #  required because we build pulsar from the repo for now
    && pip install cython \
    && pip install -r requirements.txt \
    && npm install -g express \
    && chmod +x entrypoint


EXPOSE 7000

ENTRYPOINT ["./entrypoint"]
