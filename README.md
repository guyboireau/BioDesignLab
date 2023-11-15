# BIO DESIGN LAB - WORDPRESS

## Local credentials

```
email: admin@biodesignlab.com
username: admin
password: password
```

## Getting started

```bash
make init
```

## Start docker containers

```bash
make start
```

## Stop

```bash
make stop
```

## Add a plugin

```bash
make plugin-install # to install all plugins listed in wp-plugins.txt
make plugin-install <plugin-name>
```

**Note:** If you install a plugin manually, make sure to add it in `wp-plugins.txt` and **add a new line at the end of the file**.

## Use `wp` cli

```bash
make wp <command>
```

**Note:** You add options to the command. Escape the options with `--` like this: `make wp -- --help`

You can find the list of commands [here](https://developer.wordpress.org/cli/commands/)
