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
    
    echo "Installing plugins from wp-plugins.txt"
    wp plugin delete akismet hello
    if [ -f /var/www/html/wp-plugins.txt ]; then
        cat /var/www/html/wp-plugins.txt | tr -d '\r' > /var/www/html/wp-plugins.txt
        while IFS= read plugin || [ -n "$plugin" ]; do
            wp plugin install $plugin --activate
        done < /var/www/html/wp-plugins.txt
    fi

    # media settings
    wp option update uploads_use_yearmonth_folders 0
    
    # graphql settings
    wp option add graphql_general_settings --format=json '{"graphql_endpoint":"graphql","restrict_endpoint_to_logged_in_users":"off","batch_queries_enabled":"on","batch_limit":"10","query_depth_enabled":"off","query_depth_max":10,"graphiql_enabled":"on","show_graphiql_link_in_admin_bar":"on","delete_data_on_deactivate":"on","debug_mode_enabled":"off","tracing_enabled":"off","tracing_user_role":"administrator","query_logs_enabled":"off","query_log_user_role":"administrator","public_introspection_enabled":"on"}'

    # svg support settings
    wp option add bodhi_svgs_settings --format=json '{"sanitize_svg_front_end":"on","restrict":["administrator"],"sanitize_svg":"on","sanitize_on_upload_roles":["administrator","editor"]}'

    # make everything owned by www-data
    chown -R xfs:xfs . || true

    exit 0
fi