.PHONY: backend backend-test mobile-test mobile-dev

test:
	@make clean_container
	@make backend-test
	@make mobile-test

clean_container:
	docker container prune -f

backend:
	docker-compose -f backend/docker-compose.yml rm --force
	docker-compose -f backend/docker-compose.yml up --build --abort-on-container-exit

backend-down:
	docker-compose -f backend/docker-compose.yml down

backend-test:
	cd backend && ./check
	#docker build --rm -t backend-test --target test backend/
	#docker run backend-test 

mobile-dev:
	docker build --rm -t mobile-dev --target dev mobile/
	docker run mobile-dev	

mobile-test:
	docker build --rm -t mobile-test --target test mobile/
	docker run mobile-test
