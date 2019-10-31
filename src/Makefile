.PHONY: backend-app backend-test mobile-test mobile-dev

test: clean_container backend-test mobile-test

clean_container:
	docker container prune -f 

backend-app:
	docker build --rm -t backend-app --target app backend/
	docker run backend-app 

backend-test:
	docker build --rm -t backend-test --target test backend/
	docker run backend-test 

mobile-dev:
	docker build --rm -t mobile-dev --target dev mobile/
	docker run mobile-dev	

mobile-test:
	docker build --rm -t mobile-test --target test mobile/
	docker run mobile-test
