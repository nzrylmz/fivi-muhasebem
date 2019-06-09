const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

const dbActions = require('../dbActions');
const database = new dbActions();


router.get('/', (req,res) => {

    const connection = global.mysql.createConnection(global.dbConnection);
    Promise.join(
        database.runQuery(connection, 'SELECT (select sum(miktar) from gelirler) gelir, (select sum(miktar) from giderler) gider, (select count(ID) from gelirler) toplamGelirler, (select count(ID) from giderler) toplamGiderler', []),
        database.runQuery(connection, 'SELECT * FROM giderler', [])
    ).then(results => {
        
        res.json(results)
    })
    .catch(err => res.json(err))
    .finally(() => connection.end());

})

router.get('/2', async(req,res) => {
        const connection = global.mysql.createConnection(global.dbConnection);
        const genel = await database.runQuery(connection, 'SELECT (select sum(miktar) from gelirler) gelir, (select sum(miktar) from giderler) gider, (select count(ID) from gelirler) toplamGelirler, (select count(ID) from giderler) toplamGiderler', [])
        .catch((err) => res.json(err));
        connection.end();
        res.json(genel);
})


module.exports = router;