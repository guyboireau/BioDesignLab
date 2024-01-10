init:
	@docker compose up -d --build
	@echo "\nWaiting for database to be ready and for settings to be applied..."
	@sleep 30
	@docker compose run --rm wp-cli node ./scripts/data-seed.mjs

start:
	docker compose up -d

stop:
	docker compose stop

down:
	docker compose down -v

wp-shell:
	docker exec -it biolab-wp /bin/bash

db-shell:
	docker exec -it biolab-db /bin/bash

data-seed:
	@docker compose run --rm wp-cli node ./scripts/data-seed.mjs

data-clear:
	@docker compose run --rm wp-cli node ./scripts/data-clear.mjs

plugin-install:
	@docker compose run --rm wp-cli ./scripts/plugins-install.sh $(filter-out $@,$(MAKECMDGOALS))

wp:
	@docker compose run --rm wp-cli $(MAKECMDGOALS) $(OPTIONS)
%:
	@: