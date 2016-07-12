Run your chatbot with messenger
==============================

To run your chatbot with messenger build the docker image and run the container with your Facebook IDs

    docker build -t open-intent-messenger .

    docker run --rm -e FB_PAGE_ID=1585639818415248 -e FB_PAGE_TOKEN=EAAWiIYoeTJABANlkW0ku3WctGAxZAZCfnJW3U7IrJ1jNxdcbq83ZCdqAG91WNc3ODOtA2QNQNJ9S6KFAeeuCL2KqUZAPJyi9gLZCgQfXhpRp959aOQvM1ZCTcAwtDZBpblAgv72Xyf9WVJs1qZBhYwet0Jm30UhbsvqPYvZARIO9SSQZDZD -e FB_VERIFY_TOKEN=mytoken -v $(pwd)/custom_res:/usr/src/res open-intent-messenger
