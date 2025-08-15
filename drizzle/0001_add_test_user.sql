-- Create a test user for easy login
INSERT INTO "users" ("id", "age", "login", "email", "password_hash", "created_at", "updated_at")
VALUES (
    'test_user_id', 
    25, 
    'testuser', 
    'testuser@example.com',
    '$argon2id$v=19$m=19456,t=2,p=1$LZy7HxiIrzlLJyjSIl6Qbw$kswwJC0mMyDstRZnKKyt9bo80NLIH+YKCI+yxxKMx1c', -- password: 'testuser123'
    NOW(),
    NOW()
);