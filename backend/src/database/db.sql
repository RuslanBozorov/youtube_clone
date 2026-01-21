CREATE TABLE "users"(
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "avatar" TEXT NOT NULL,
    "socket_id" VARCHAR(50) NOT NULL
);


CREATE TABLE "files"(
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "size" INTEGER NOT NULL,
    "user_id" INT REFERENCES users(id) ON DELETE CASCADE,
    "created_at" TIMESTAMP DEFAULT(CURRENT_TIMESTAMP)
);


CREATE TABLE "message"(
    "id" SERIAL NOT NULL,
    "message_type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "user_id_to" INT REFERENCES users(id),
    "user_to_from" INT REFERENCES users(id),
    "created_at" TIMESTAMP DEFAULT(CURRENT_TIMESTAMP )
);