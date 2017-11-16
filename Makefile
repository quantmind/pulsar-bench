NS = quantmind
REPO = pulsar-bench

# set version if absent
VERSION ?= latest
DOCKER_IMAGE ?= ${NS}/${REPO}:${VERSION}
BENCH_COMMAND = docker run --rm \
-v /var/run/docker.sock:/home/benchmarking/docker.sock \
-v $(PWD):/home/benchmarking/results \
-e DOCKER_HOST=unix:///home/benchmarking/docker.sock \
-e DOCKER_IMAGE=$(DOCKER_IMAGE) \
--net host \
--name bench-runner \
$(DOCKER_IMAGE) \
python bench.py

.PHONY: default build push bench

default: ;

build:
	docker build -t $(DOCKER_IMAGE) .

push:
	docker push $(DOCKER_IMAGE)

info:
	$(BENCH_COMMAND) --info

help:
	$(BENCH_COMMAND) -h

bench:
	$(BENCH_COMMAND)

aiohttp:
	$(BENCH_COMMAND) aiohttp

shell:
	docker run --rm -it -e "DOCKER_IMAGE=$(DOCKER_IMAGE)" $(DOCKER_IMAGE) bash
