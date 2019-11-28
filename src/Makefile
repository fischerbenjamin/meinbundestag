.PHONY: backend backend-test mobile-test mobile-dev

test: clean_container backend-test mobile-test

clean_container:
	docker container prune -f

backend:
	docker-compose -f backend/docker-compose.yml rm --force
	docker-compose -f backend/docker-compose.yml up --build --abort-on-container-exit

backend-down:
	docker-compose -f backend/docker-compose.yml down

backend-test:
	docker build --rm -t backend-test --target test backend/
	(cd backend && ./check) || exit 1

mobile-dev:
	docker build --rm -t mobile-dev --target dev mobile/
	docker run mobile-dev	

mobile-test:
	docker build --rm -t mobile-test --target test mobile/
	docker run mobile-test
