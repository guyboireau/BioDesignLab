#!/bin/sh
if [ $# -eq 0 ]; then
    if [ -f ./wp-plugins.txt ]; then
        echo "Installing plugins from wp-plugins.txt"
        while IFS= read plugin || [ -n "$plugin" ]; do
            echo "Installing $plugin"
            make wp plugin install -- --activate $plugin
        done < ./wp-plugins.txt
    fi
    echo "Done installing plugins"
else
    echo "Installing $0"
    make wp plugin install $0 -- --activate
    if [ $? -eq 0 ]; then
        echo "$0" >> ./wp-plugins.txt
    fi
fi
