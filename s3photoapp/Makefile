clean:
	cd apps/photo-storage && npm run clean;
	cd apps/photo-filter && npm run clean;
	cd apps/web-client && npm run clean;

install:
	cd apps/photo-storage && npm install -q;
	cd apps/photo-filter && npm install -q;
	cd apps/web-client && npm install -q;

lint:
	cd apps/photo-storage && npm run lint .;
	cd apps/photo-filter && npm run lint .;
	cd apps/web-client && npm run lint .;

test:
	cd apps/photo-storage && npm test;
	cd apps/photo-filter && npm test;
	cd apps/web-client && npm test;

build:
	docker-compose build

tag: build
	docker tag s3photoapp-photo-filter:latest ${ECR_REPO_PREFIX}/s3photoapp-photo-filter:latest
	docker tag s3photoapp-photo-storage:latest ${ECR_REPO_PREFIX}/s3photoapp-photo-storage:latest
	docker tag s3photoapp-web-client:latest ${ECR_REPO_PREFIX}/s3photoapp-web-client:latest

push: tag
	docker push ${ECR_REPO_PREFIX}/s3photoapp-photo-filter:latest
	docker push ${ECR_REPO_PREFIX}/s3photoapp-photo-storage:latest
	docker push ${ECR_REPO_PREFIX}/s3photoapp-web-client:latest

clean-images:
	docker images -q -f "dangling=true" | xargs -I {} docker rmi {}

.PHONY: clean install lint test build tag push clean inspect