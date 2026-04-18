CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

INSERT INTO "users" ("id", "email", "name", "passwordHash", "createdAt", "updatedAt")
VALUES (
    '00000000-0000-4000-8000-000000000001',
    'default@example.com',
    'Default User',
    '$2b$10$4sGda9VWm1fq6YmA1hvNGuODz39JpO1dKn2XUytSxoL9qvpFeM1h2',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO NOTHING;

ALTER TABLE "accounts" ADD COLUMN "userId" TEXT;
ALTER TABLE "categories" ADD COLUMN "userId" TEXT;
ALTER TABLE "transactions" ADD COLUMN "userId" TEXT;
ALTER TABLE "budgets" ADD COLUMN "userId" TEXT;

UPDATE "accounts" SET "userId" = '00000000-0000-4000-8000-000000000001' WHERE "userId" IS NULL;
UPDATE "categories" SET "userId" = '00000000-0000-4000-8000-000000000001' WHERE "userId" IS NULL;
UPDATE "transactions" SET "userId" = '00000000-0000-4000-8000-000000000001' WHERE "userId" IS NULL;
UPDATE "budgets" SET "userId" = '00000000-0000-4000-8000-000000000001' WHERE "userId" IS NULL;

ALTER TABLE "accounts" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "categories" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "transactions" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "budgets" ALTER COLUMN "userId" SET NOT NULL;

CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");
CREATE INDEX "categories_userId_idx" ON "categories"("userId");
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");
CREATE INDEX "budgets_userId_idx" ON "budgets"("userId");

ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "categories" ADD CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
