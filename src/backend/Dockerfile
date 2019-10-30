### Base build
FROM python AS base
# Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
RUN apt-get -y update
RUN apt-get install -y google-chrome-stable
# Chrome Driver
RUN apt-get install -yqq unzip
RUN wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`/chromedriver_linux64.zip
RUN unzip /tmp/chromedriver.zip chromedriver -d /usr/local/bin/
# Selenium
RUN pip install selenium
# Set display port to avoid crash
ENV DISPLAY=:99
# Working directory
WORKDIR /usr/src/app


### Application build
FROM base AS app
COPY src/app.py .
COPY src/scraper.py .
# Run application
CMD [ "python", "-u", "app.py" ]


### Test build
FROM base AS test 
COPY src/ ./
# Run application
CMD [ "python", "-u", "test.py" ]
