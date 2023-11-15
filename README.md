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
make data-seed
```

You can now access the website at [http://localhost:8000](http://localhost:8000)

## Start docker containers

```bash
make start
```

## Stop

```bash
make stop
```

## Fixtures

```bash
make data-seed # to seed the database with fixtures
make data-clear # to clear the database
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

**Note:** To add options to the command, pass them inside `OPTIONS` variable like this: `make wp OPTIONS='--help'`

You can find the list of commands [here](https://developer.wordpress.org/cli/commands/)
