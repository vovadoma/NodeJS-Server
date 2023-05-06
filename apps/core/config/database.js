({
  url:
    process.env.DATABASE_URL_CORE ||
    'postgresql://postgres:postgres@localhost:5433/node_server',
});
