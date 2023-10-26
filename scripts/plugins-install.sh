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
    echo "Installing $1"
    make wp plugin install $1 -- --activate
    if [ $? -ne 0 ]; then
        exit 1
    fi
    if [[ -s "$1" && -z "$(tail -c 1 "$1")" ]]; then
        echo "" >> ./wp-plugins.txt
    fi
    echo "$1" >> ./wp-plugins.txt
fi
