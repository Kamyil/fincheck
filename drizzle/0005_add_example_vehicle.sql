-- Add example vehicle for client_example user
INSERT INTO "public"."vehicles" ("id", "user_id", "make", "model", "year", "vin", "registration", "created_at", "updated_at") 
VALUES (
    'vehicle_example_001',
    'example_client_001',
    'Peugeot',
    '308 1.6',
    2010,
    'VF34C5FWCAY102363',
    'KT 75795',
    NOW(),
    NOW()
);