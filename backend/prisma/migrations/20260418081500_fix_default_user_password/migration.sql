UPDATE "users"
SET "passwordHash" = '$2b$10$TpzIADqpLqrMBo5s98.Dx.bsfFZL1plJquQIOsUAz5ee5z4.Jni3m',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "email" = 'default@example.com';
