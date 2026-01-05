INSERT INTO "users" ("id", "age", "login", "email", "password_hash", "created_at", "updated_at")
VALUES (
    'test_user_id', 
    25, 
    'testuser', 
    'testuser@example.com',
    '$argon2id$v=19$m=19456,t=2,p=1$LZy7HxiIrzlLJyjSIl6Qbw$kswwJC0mMyDstRZnKKyt9bo80NLIH+YKCI+yxxKMx1c',
    NOW(),
    NOW()
) ON CONFLICT (login) DO NOTHING;

INSERT INTO "users" ("id", "age", "login", "email", "password_hash", "created_at", "updated_at")
VALUES (
    'demo_user_id', 
    30, 
    'demo', 
    'demo@app.local',
    '$argon2id$v=19$m=19456,t=2,p=1$cyu1mxBJErBvDxG8qIxq2A$T7JI8lbVAJ/kzcvH6AJakCpMpW/DG0Y2zD/E8fdji+I',
    NOW(),
    NOW()
) ON CONFLICT (login) DO NOTHING;
