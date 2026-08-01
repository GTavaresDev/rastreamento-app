-- CreateTable
CREATE TABLE "USER" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "permission" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "USER_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USER_PERMISSION" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,

    CONSTRAINT "USER_PERMISSION_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_email_key" ON "USER"("email");

-- CreateIndex
CREATE UNIQUE INDEX "USER_cpf_key" ON "USER"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "USER_PERMISSION_user_id_key" ON "USER_PERMISSION"("user_id");

-- AddForeignKey
ALTER TABLE "USER_PERMISSION"
ADD CONSTRAINT "USER_PERMISSION_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "USER"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Initial administrator (password stored as a bcrypt hash, cost 12).
INSERT INTO "USER" ("id", "name", "email", "cpf", "password", "permission")
VALUES (
    1,
    'Admin',
    'admin@local',
    '70649692110',
    '$2b$12$8layGZLRa/plAUSx7v1U1O4xVwE3bcmiq/7jiyf7F2n1b164ouLbi',
    1
);

INSERT INTO "USER_PERMISSION" ("id", "user_id", "name")
VALUES (1, 1, 'Administrador');

-- Keep the sequences aligned after inserting explicit IDs.
SELECT setval(pg_get_serial_sequence('"USER"', 'id'), 1, true);
SELECT setval(pg_get_serial_sequence('"USER_PERMISSION"', 'id'), 1, true);
