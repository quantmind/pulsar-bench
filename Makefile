NS = quantmind
REPO = pulsar-bench

# set version if absent
VERSION ?= latest
DOCKER_IMAGE ?= ${NS}/${REPO}:${VERSION}

.PHONY: build push

build:
	docker build -t $(DOCKER_IMAGE) .

push:
	docker push $(DOCKER_IMAGE)
