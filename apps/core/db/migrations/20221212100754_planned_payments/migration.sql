-- CreateTable
CREATE TABLE "planned_payments" (
    "id" SERIAL NOT NULL,
    "addedById" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planned_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "planned_payments_amount_notes_idx" ON "planned_payments"("amount", "notes");
