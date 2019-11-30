################################################################################
###                                APPLICATION                              ###
################################################################################



################################################################################
###                              MOBILE FRONTEND                             ###
################################################################################

mobile-dev:
	docker build --rm -t mobile-dev --target dev mobile/
	docker run mobile-dev	

mobile-test:
	docker build --rm -t mobile-test --target test mobile/
	docker run mobile-test


################################################################################
###                              PYTHON BACKEND                              ###
################################################################################

.PHONY: backend
backend:
	docker-compose -f backend/docker/docker-compose.yml up --build
	# docker-compose -f backend/ods/amse-ws1920-ods-app/docker-compose.yml up -d

.PHONY: backend-down
backend-down:
	docker-compose -f backend/docker/docker-compose.yml down
	# docker-compose -f backend/ods/amse-ws1920-ods-app/docker-compose.yml down

.PHONY: backend-test-docker
backend-test-docker:
	# Running docker build
	docker build -f backend/docker/Dockerfile -t backend-test backend/python

.PHONY: backend-test-source
backend-test-source:
	# Running linting
	(cd backend/python && ./lint)
	# Running unittest
	(cd backend/python && python3 main.py --test)

.PHONY: backend-restart
backend-restart: backend-down backend