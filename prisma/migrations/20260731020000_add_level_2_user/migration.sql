-- Add the initial level 2 user (password stored as a bcrypt hash, cost 12).
INSERT INTO "USER" (
    "id",
    "name",
    "email",
    "cpf",
    "password",
    "permission"
)
VALUES (
    2,
    'Usuário',
    'usuario@local',
    '84627915020',
    '$2b$12$zr/GlMGbh5Kk4AKQ3Vruz.dmbI7xMA21l9COwJTxudvDpquOQsNb.',
    2
);

INSERT INTO "USER_PERMISSION" ("id", "user_id", "name")
VALUES (2, 2, 'Usuário');

-- Keep sequences aligned after inserting explicit IDs.
SELECT setval(
    pg_get_serial_sequence('"USER"', 'id'),
    (SELECT MAX("id") FROM "USER"),
    true
);
SELECT setval(
    pg_get_serial_sequence('"USER_PERMISSION"', 'id'),
    (SELECT MAX("id") FROM "USER_PERMISSION"),
    true
);
