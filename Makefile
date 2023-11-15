init:
	docker compose up -d --build

start:
	docker compose up -d

stop:
	docker compose stop

down:
	docker compose down

wp-shell:
	docker exec -it wp /bin/bash

db-shell:
	docker exec -it db /bin/bash

data-seed:
	@node ./scripts/data-seed.mjs

data-clear:
	@node ./scripts/data-clear.mjs

plugin-install:
	./scripts/plugins-install.sh $(filter-out $@,$(MAKECMDGOALS))

wp:
	@docker compose run --rm wp-cli $(MAKECMDGOALS) $(OPTIONS)
%:
	@: