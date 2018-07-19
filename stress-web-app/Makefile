VENDOR := linuxacademy
IMAGE := "${VENDOR}/stress-web-app"
VERSION := $(shell git rev-parse HEAD)
BUILD_DATE := $(shell date -R)
VCS_URL := $(shell basename `git rev-parse --show-toplevel`)
VCS_REF := $(shell git log -1 --pretty=%h)
NAME := $(shell basename `git rev-parse --show-toplevel`)
DOCKER ?= $(shell which docker)

build:
	docker build --rm -t ${IMAGE} --build-arg VERSION="${VERSION}" \
	--build-arg BUILD_DATE="${BUILD_DATE}" \
	--build-arg VCS_URL="${VCS_URL}" \
	--build-arg VCS_REF="${VCS_REF}" \
	--build-arg NAME="${NAME}" \
	--build-arg VENDOR="${VENDOR}" .

run:
	@$(DOCKER) run --rm -p 8080:8080 ${IMAGE}

clean:
	@$(DOCKER) images -q -f "dangling=true" | \
		xargs -I {} $(DOCKER) rmi {}
	@$(DOCKER) volume ls -q -f "dangling=true" | \
		xargs -I {} $(DOCKER) volume rm {}

inspect:
	@$(DOCKER) inspect --format='{{range $$k, $$v := .Config.Labels}}{{$$k}}={{$$v}}{{println}}{{end}}' ${IMAGE}

print:
	@echo VERSION=${VERSION}
	@echo BUILD_DATE=${BUILD_DATE}
	@echo VCS_URL=${VCS_URL}
	@echo VCS_REF=${VCS_REF}
	@echo NAME=${NAME}
	@echo VENDOR=${VENDOR}
	@echo IMAGE=${IMAGE}
