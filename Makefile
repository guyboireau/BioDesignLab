init:
	docker-compose up -d --build

start:
	docker-compose up -d

stop:
	docker-compose stop

down:
	docker-compose down

ifeq ($(firstword $(MAKECMDGOALS)),$(filter $(firstword $(MAKECMDGOALS)),wp plugin-install))   
  runargs := $(wordlist 2, $(words $(MAKECMDGOALS)), $(MAKECMDGOALS))
  $(eval $(runargs):;@true)
endif

wp:
	@docker-compose run --rm wp-cli wp $(runargs)

plugin-install:
	./scripts/plugins-install.sh $(runargs)
	
