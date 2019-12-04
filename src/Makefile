################################################################################
###                              WEB FRONTEND                             ###
################################################################################

.PHONY: frontend
frontend:
	(cd mobile/meinbundestag-mobile/ && yarn web) & \
	chromium-browser http://localhost:19002 http://localhost:19006 \
		--auto-open-devtools-for-tabs \
		--disable-web-security \
		--user-data-dir="/tmp/chromium-unsafe-dev"


################################################################################
###                              PYTHON BACKEND                              ###
################################################################################

.PHONY: backend
backend:
	docker-compose up --build
	# docker-compose -f backend/ods/amse-ws1920-ods-app/docker-compose.yml up -d

.PHONY: backend-down
backend-down:
	docker-compose down
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