({
  url:
    process.env.DATABASE_URL_MESSENGER ||
    'postgresql://postgres:postgres@localhost:5432/messenger',
});
