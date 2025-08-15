-- Create a demo user for easy login
INSERT INTO "users" ("id", "age", "login", "email", "password_hash", "created_at", "updated_at")
VALUES (
    'demo_user_id', 
    30, 
    'demo', 
    'demo@pan-samochodzik.local',
    '$argon2id$v=19$m=19456,t=2,p=1$cyu1mxBJErBvDxG8qIxq2A$T7JI8lbVAJ/kzcvH6AJakCpMpW/DG0Y2zD/E8fdji+I', -- password: 'pansamochodzik'
    NOW(),
    NOW()
);