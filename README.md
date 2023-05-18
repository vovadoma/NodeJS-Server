# NodeJS-Server
NodeJS Application Server

#### Features
- Simple DB migration, Prisma schema -> JSON schema converter
- Schema JSON, validation, d.ts
- API transport (http/ws), no ws. HTT 2/3
- CRUD API (auto generation from the schema, JSON:API)
- JSON:API query builder to PostgresSQL
- Serialize JSON:API (on/off)
- Dictionary API (memory cache, RPC update, periodical, pre defined)
- Entity: document, tablePart, docList
- Entity: registerBalance, registerSale
- Workers, job, scheduling (app side)
- Domain multiple applications
- Module structure (users (entity): service, repository, api)
- Bus for external API (like metacom bus)
- RBAC
- Oauth 2.0
- Versions
- Cache like as memory Map or redis

#### Applications:
- quiz (learn english words, use any open api for words and translate)
- messenger (course task)
- openprocurement.api’s parser and client

#### Open API:
- https://public.api.openprocurement.org/api/2.3/tenders (bus.openprocurement.getTender(id))
- any currency rates
- OpenDataBot

#### Dependencies:
- pg
- ws
- pino
