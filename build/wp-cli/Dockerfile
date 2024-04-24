FROM wordpress:cli

ENV WP_URL="localhost:8000"
ENV WP_USER="admin"
ENV WP_PASSWORD="password"
ENV WP_EMAIL="admin@biodesignlab.com"
ENV WP_TITLE="Bio Desing Lab - WordPress"
ENV WP_DEBUG=true

# copy install script with root permission
USER root

RUN apk update && apk add nodejs dos2unix

RUN mv /usr/local/bin/wp /usr/local/bin/_wp && \
    echo -e '#!/bin/sh\n_wp --allow-root "$@"' > /usr/local/bin/wp && \
    chmod +x /usr/local/bin/wp
ADD scripts/docker-install.sh /usr/local/bin/
COPY build/wp/.htaccess /var/www/html/.htaccess
RUN chmod +x /usr/local/bin/docker-install.sh
RUN dos2unix /usr/local/bin/docker-install.sh

CMD ["docker-install.sh" ]