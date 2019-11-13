.PHONY: backend backend-test mobile-test mobile-dev

test: clean_container backend-test mobile-test

clean_container:
	docker container prune -f

backend:
	docker-compose -f backend/docker-compose.yml rm --force
	docker-compose -f backend/docker-compose.yml up --build -d

backend-test:
	docker build --rm -t backend-test --target test backend/
	docker run backend-test 

mobile-dev:
	docker build --rm -t mobile-dev --target dev mobile/
	docker run mobile-dev	

mobile-test:
	docker build --rm -t mobile-test --target test mobile/
	docker run mobile-test
