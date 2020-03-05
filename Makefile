IMAGE := williamcustodio/udagram_proxy_api
AWS_CLI_URL := https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip
AWS_EKSCTL_URL := https://github.com/weaveworks/eksctl/releases/download/latest_release/eksctl_linux_amd64.tar.gz
KUBECTL_URL := https://amazon-eks.s3-us-west-2.amazonaws.com/1.14.6/2019-08-22/bin/linux/amd64/kubectl

aws-client:
	curl "$(AWS_CLI_URL)" -o "awscliv2.zip";
	unzip awscliv2.zip & > /dev/null;
	sudo ./aws/install & > /dev/null;

aws-credentials:
	mkdir ~/.aws
	echo "[default]\naws_access_key_id=${AWS_ACCESS_KEY_ID}\naws_secret_access_key=${AWS_SECRET_ACCESS_KEY}\nregion=${AWS_REGION}\n" >> ~/.aws/credentials

aws-eksctl:
	curl --silent --location "$(AWS_EKSCTL_URL)" | tar xz -C /tmp & > /dev/null;
	sudo mv /tmp/eksctl /usr/local/bin;
	eksctl version;

aws-eksctl-configuration:
	aws eks --region ${AWS_REGION} update-kubeconfig --name ${AWS_EKSCTL_CLUSTER_NAME}

build:
	npm run build

deployment:
	kubectl apply -f ./deployment/deployment.yaml;
	kubectl apply -f ./deployment/service.yaml;

image:
	docker build -t $(IMAGE) .

kubectl:
	curl -o kubectl "$(KUBECTL_URL)";
	chmod +x ./kubectl;
	sudo mv ./kubectl /usr/local/bin;
	kubectl version --short --client;

push-image:
	docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD};
	docker push $(IMAGE):${TRAVIS_BUILD_NUMBER}
