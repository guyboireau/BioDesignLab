#!/bin/sh
set -e

if [ ! -f wp-config.php ]; then
    echo "WordPress not found in $PWD!"
    ( set -x; sleep 18 )
fi

if ! $(wp core is-installed); then
    echo "Initializing WordPress install!"

    wp core install \
        --url="$WP_URL" \
        --admin_user=$WP_USER \
        --admin_password=$WP_PASSWORD \
        --admin_email=$WP_EMAIL \
        --title="$WP_TITLE" \
        --skip-email \
        --skip-plugins
        
    wp core update
    
    wp core update-db

    wp option update blogdescription "$WP_DESCRIPTION"
    
    wp config set WP_DEBUG $WP_DEBUG --raw
    
    wp rewrite structure '/%postname%/'
    
    wp plugin delete akismet hello

    if [ -f /var/www/html/wp-plugins.txt ]; then
        while IFS= read plugin || [ -n "$plugin" ]; do
            wp plugin install $plugin --activate
        done < /var/www/html/wp-plugins.txt
    fi

    # make everything owned by www-data
    chown -R xfs:xfs . || true

    exit 0
fi