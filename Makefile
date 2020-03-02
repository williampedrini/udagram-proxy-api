IMAGE := williamcustodio/udagram_proxy_api

build:
	npm run build

image:
	docker build -t $(IMAGE) .

push-image:
	docker push $(IMAGE):latest
