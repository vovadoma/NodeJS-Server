# NodeJS-Server
NodeJS Application Server

#### Features
- Simple DB migration, DB generation or Prisma (schema generate)
- Schema JSON, validation, d.ts
- API transport (http/ws)
- CRUD API (auto generation from the schema, JSON:API)
- JSON:API query builder to PostgresSQL
- Serialize JSON:API (on/off)
- Dictionary API (memory cache, ws update, periodical, pre defined)
- Entity: document, tablePart, docList
- Entity: registerBalance, registerSale
- Parser open API, workers, job, scheduling (app side)
- Domain multiple applications
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
