CREATE TABLE _migrations (
    "id" SERIAL NOT NULL,
    "file" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "_migrations_pkey" PRIMARY KEY ("id")
);
