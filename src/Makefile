################################################################################
###                                  APP                                     ###
################################################################################
.PHONY: app-down
app-down:
	docker-compose down

.PHONY: app
app:
	docker-compose up --build & \
	chromium-browser http://localhost:19006 \
		--auto-open-devtools-for-tabs \
		--disable-web-security \
		--user-data-dir="/tmp/chromium-unsafe-dev"

################################################################################
###                              WEB FRONTEND                                ###
################################################################################

.PHONY: frontend
frontend:
	docker-compose up --build frontend

.PHONY: frontend-public
frontend-public:
	(cd mobile/meinbundestag-mobile/ && yarn web) & \
	chromium-browser http://localhost:19002 http://localhost:19006 \
		--auto-open-devtools-for-tabs \
		--disable-web-security \
		--user-data-dir="/tmp/chromium-unsafe-dev"

.PHONY: frontend-test
frontend-test:
	(cd mobile/meinbundestag-mobile/scripts && ./lint)


################################################################################
###                              PYTHON BACKEND                              ###
################################################################################

.PHONY: backend
backend:
	docker-compose up --build api api database
	# docker-compose -f backend/ods/amse-ws1920-ods-app/docker-compose.yml up -d

.PHONY: backend-test-docker
backend-test-docker:
	# Running docker build
	docker build -f backend/Dockerfile -t backend-test backend/python

.PHONY: backend-test-source
backend-test-source:
	# Running linting
	(cd backend/python && ./lint)
	# Running unittest
	(cd backend/python && python3 main.py --test)
