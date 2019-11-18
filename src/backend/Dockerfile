### Base build
FROM python AS base
# Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
RUN apt-get -y update \
    && apt-get install -y google-chrome-stable \
    && apt-get install -yqq unzip \
    && apt-get clean
# Chrome Driver
RUN wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`/chromedriver_linux64.zip \
    && unzip /tmp/chromedriver.zip chromedriver -d /usr/local/bin/ \
    && rm /tmp/chromedriver.zip
# Set display port to avoid crash
ENV DISPLAY=:99
# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN python -m nltk.downloader punkt
RUN mkdir /protocols
RUN mkdir /usr/data/
COPY data/protocol.dtd /usr/data/
COPY data/protocol.xml /usr/data/
COPY data/template.html /usr/data/
# Working directory
WORKDIR /usr/src/app


### Application build
FROM base AS app
COPY src/ src
COPY main.py .
CMD [ "python", "-u", "main.py" ]


### Test build
FROM base AS test
COPY src/ src
COPY test/ test
COPY main.py .
CMD [ "python", "-u", "main.py", "--test" ]
