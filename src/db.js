const CONFIG = require('./config.js')
const pg     = require('pg')

/** Unit -> Promise(pg.client, Error) */
pg.connection = () => {
    return new Promise((resolve, reject) => {
        pg.connect(CONFIG.DB_URL, (err, client, done) => {
            if(err) {
                reject(err)
            }
            else {
                client.close = done
                resolve(client)
            }
        })
    })
}

module.exports = pg;