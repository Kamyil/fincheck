-- Add example client user (username: client_example, password: client123)
INSERT INTO "public"."users" ("id", "login", "email", "password_hash", "role", "created_at", "updated_at") 
VALUES (
    'example_client_001', 
    'client_example', 
    'client@pan-samochodzik.local',
    '$argon2id$v=19$m=19456,t=2,p=1$DkV1iQXcZXXtDDjG/pldGA$LLgaBA2cOmyppM9d/wKxGX0TKHZEcwXS9tsAphGuXEg',
    'CLIENT',
    NOW(),
    NOW()
);

-- Add example mechanic user (username: mechanic_example, password: mechanic123)
INSERT INTO "public"."users" ("id", "login", "email", "password_hash", "role", "created_at", "updated_at")
VALUES (
    'example_mechanic_001',
    'mechanic_example', 
    'mechanic@pan-samochodzik.local',
    '$argon2id$v=19$m=19456,t=2,p=1$L7QPQDptnpp3j4hmigklRw$E0b4WU1RJM9iOw6hxdtj6ANA23RgEO+4WFzSGRWP03k',
    'MECHANIC',
    NOW(), 
    NOW()
);