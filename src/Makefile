.PHONY: backend-app backend-test mobile-test mobile-dev

test: clean_container backend-test mobile-test

clean_container:
	docker container prune -f 

backend-app:
	docker build -t backend-app --target app backend/
	docker run backend-app 

backend-test:
	docker build -t backend-test --target test backend/
	docker run backend-test 

mobile-dev:
	docker build -t mobile-dev --target dev mobile/
	docker run mobile-dev	

mobile-test:
	docker build -t mobile-test --target test mobile/
	docker run mobile-test
