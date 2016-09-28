const crypto = require('crypto')

const DB_HOST     = process.env.OPENSHIFT_POSTGRESQL_DB_HOST || "127.0.0.1"
const DB_PORT     = process.env.OPENSHIFT_POSTGRESQL_DB_PORT || 5433
const DB_USERNAME = process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME
const DB_PASSWORD = process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD
const DB_NAME     = "learnenglishbackend"
const DB_URL      = process.env.OPENSHIFT_POSTGRESQL_DB_URL || "postgres://" + (DB_USERNAME ? DB_USERNAME + ":" + DB_PASSWORD + "@" : "") +
    DB_HOST + ":" + DB_PORT + "/" + DB_NAME

const CONFIG = {
    secret: crypto.randomBytes(256).toString('hex'),
    DB_URL: DB_URL
}

module.exports = CONFIG