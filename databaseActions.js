const Promise = require('bluebird');

class DatabaseActions{
    runQuery(connection, sql, values) {
        return new Promise((resolve, reject) => {
            connection.query(sql, values, (err, result) => {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(result);
            })
        })
    }
}

module.exports = DatabaseActions;