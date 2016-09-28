-- BACKUP

\copy WORDS TO '/tmp/words.csv' WITH DELIMITER ',' CSV HEADER QUOTE '"';
\copy USERS TO '/tmp/users.csv' WITH DELIMITER ',' CSV HEADER QUOTE '"';
\copy USERS_SCORES TO '/tmp/users_scores.csv' WITH DELIMITER ',' CSV HEADER QUOTE '"';

DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
CREATE EXTENSION "uuid-ossp"; -- for UUIDs
DROP EXTENSION IF EXISTS "pgcrypto" CASCADE;
CREATE EXTENSION "pgcrypto"; -- for passwords storage

------------- TABLE WORDS -------------

DROP TABLE IF EXISTS WORDS CASCADE;
CREATE TABLE WORDS (
    words_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expression TEXT NOT NULL, -- The actual word or expression
    meanings TEXT ARRAY NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    added_by UUID REFERENCES USERS ON DELETE CASCADE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (expression, added_by)
);

-- TODO assocation table between WORDS and LISTS (which are lists created by users, to be created as well)


------------- TABLE USERS -------------

DROP TABLE IF EXISTS USERS CASCADE;
CREATE TABLE USERS (
    users_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    signed_up_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_use_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- TODO find a use for this
);

------------- TABLE USERS_SCORES -------------

DROP TABLE IF EXISTS USERS_SCORES CASCADE;
CREATE TABLE USERS_SCORES (
    users_fk UUID REFERENCES USERS ON DELETE CASCADE,
    words_fk UUID REFERENCES WORDS ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY(users_fk, words_fk)
);

------------- TABLE USERS_RESET_PWD -------------

-- TODO
DROP TABLE IF EXISTS USERS_RESET_PWD CASCADE;
CREATE TABLE USERS_RESET_PWD (
    users_id UUID REFERENCES USERS ON DELETE CASCADE PRIMARY KEY,
    temp_access_token TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Taken from http://www.hagander.net/talks/Secure%20password%20storage.pdf
DROP FUNCTION IF EXISTS login(text,text) CASCADE;
CREATE OR REPLACE FUNCTION login(_email text, _pwd text, OUT _userid UUID)
    RETURNS UUID
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        SELECT users_id INTO _userid FROM USERS
        WHERE users.email=_email
        AND password = crypt(_pwd, users.password);
    END;
    $$
;

DROP FUNCTION IF EXISTS signup(text,text) CASCADE;
CREATE OR REPLACE FUNCTION signup(_email text, _pwd text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        INSERT INTO USERS ("email", "password")
        VALUES (_email, crypt(_pwd, gen_salt('bf')));
    END;
    $$
;

DROP FUNCTION IF EXISTS get_words(UUID) CASCADE;
CREATE OR REPLACE FUNCTION get_words(_users_id UUID)
    RETURNS TABLE(words_id uuid, expression text, meanings text array, score integer)
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        RETURN QUERY
        SELECT WORDS.words_id, WORDS.expression, WORDS.meanings, COALESCE(USERS_SCORES.score,-10000) as score
        FROM WORDS
        LEFT OUTER JOIN USERS_SCORES
        ON WORDS.words_id = USERS_SCORES.words_fk AND USERS_SCORES.users_fk = CAST(_users_id as uuid)
        WHERE WORDS.added_by = CAST(_users_id as uuid)
        --WHERE language = (SELECT preferred_language from users where users_id = CAST($1 as uuid)) -- TODO list
        ORDER BY score ASC, added_at ASC;
    END;
    $$
;

DROP FUNCTION IF EXISTS search_words(text,UUID) CASCADE;
CREATE OR REPLACE FUNCTION search_words(_word text, _users_id UUID)
    RETURNS TABLE(words_id uuid, expression text)
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        RETURN QUERY
        SELECT WORDS.words_id, WORDS.expression
        FROM WORDS
        WHERE WORDS.expression ILIKE '%' || _word || '%' -- TODO enable searching for different words separated by spaces
        AND WORDS.added_by = CAST (_users_id as UUID);
    END;
    $$
;

DROP FUNCTION IF EXISTS add_word(text, text array, UUID) CASCADE;
CREATE OR REPLACE FUNCTION add_word(_expression text, _meanings text array, _added_by UUID, OUT _words_id UUID)
    RETURNS UUID
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        INSERT INTO WORDS ("expression", "meanings", "added_by")
        VALUES (_expression, _meanings, _added_by)
        RETURNING words_id into _words_id;
    END;
    $$
;

-- http://www.depesz.com/2012/06/10/why-is-upsert-so-complicated/
DROP FUNCTION IF EXISTS increment_score(UUID, UUID) CASCADE;
CREATE OR REPLACE FUNCTION increment_score(_users_id UUID, _words_id UUID)
    RETURNS VOID
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        LOOP
            UPDATE USERS_SCORES
            SET score = score + 1, last_seen_at = NOW()
            WHERE users_fk = _users_id AND  words_fk = _words_id;
            IF found THEN
                RETURN;
            END IF;
            BEGIN
                INSERT INTO USERS_SCORES("users_fk", "words_fk", "score") VALUES (_users_id, _words_id, 1);
                RETURN;
            EXCEPTION WHEN unique_violation THEN
            END;
        END LOOP;
    END;
    $$
;

DROP FUNCTION IF EXISTS decrement_score(UUID, UUID) CASCADE;
CREATE OR REPLACE FUNCTION decrement_score(_users_id UUID, _words_id UUID)
    RETURNS VOID
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        LOOP
            UPDATE USERS_SCORES
            SET score = score - 2, last_seen_at = NOW()
            WHERE users_fk = _users_id AND  words_fk = _words_id;
            IF found THEN
                RETURN;
            END IF;
            BEGIN
                INSERT INTO USERS_SCORES("users_fk", "words_fk", "score") VALUES (_users_id, _words_id, -2);
                RETURN;
            EXCEPTION WHEN unique_violation THEN
            END;
        END LOOP;
    END;
    $$
;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public;


-- POPULATING

\copy USERS FROM '/tmp/users.csv' WITH DELIMITER ',' CSV HEADER QUOTE '"';
\copy WORDS FROM '/tmp/words.csv' WITH DELIMITER ',' CSV HEADER QUOTE '"';
\copy USERS_SCORES FROM '/tmp/users_scores.csv' WITH DELIMITER ',' CSV HEADER QUOTE '"';