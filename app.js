const express = require('express');
const path = require('path');
const mysql = require('mysql'); 
const app = express();
const Promise = require('bluebird');

// db
const dbActions = require('./dbActions');
const database = new dbActions();

const testRouter = require('./routes/testRouter');

// global
global.mysql = mysql;

global.dbConnection = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: "muhasebem"
}

console.log(database.verim1);


app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


//app.use('/test', testRouter); // silme

app.get('/', (req, res) => { // anasayfa genel durum

    const connection = mysql.createConnection(global.dbConnection);

    Promise.join(
        database.runQuery(connection, 'SELECT (SELECT sum(miktar) FROM gelirler) gelir, (SELECT sum(miktar) FROM giderler) gider', []),
        database.runQuery(connection, 'SELECT ( SELECT sum(miktar) FROM gelirler WHERE kasaID = ? ) nakitGelir, ( SELECT sum(miktar) FROM giderler WHERE kasaID = ? ) nakitGider, (SELECT sum(miktar) FROM gelirler WHERE kasaID = ?) bankaGelir, (SELECT sum(miktar) FROM giderler WHERE kasaID = ?) bankaGider', [1,1,2,2])
    ).then(result => {
        const { gelir, gider } = result[0][0],
              { nakitGelir, nakitGider, bankaGelir, bankaGider } = result[1][0];
        res.render('index', {
            title: "Muhasebem", gelir, gider,
            nakitDurum: nakitGelir - nakitGider,
            bankaDurum: bankaGelir - bankaGider
        })
    })
    .catch(err => res.json(err))
    .finally(() => connection.end())

})

app.get('/gelirler', async(req,res) => {

    const connection = mysql.createConnection(global.dbConnection);
    const gelirler = await database.runQuery(connection, 'SELECT gelirler.*,kasalar.kasaAdi FROM gelirler JOIN kasalar ON kasalar.ID = gelirler.kasaID', []);
    const kasalar = await database.runQuery(connection, 'SELECT * FROM kasalar', []);
    res.render('gelirler', {title: "Gelirler - Muhasebem", gelirler,kasalar});

});

app.get('/giderler', async(req,res) => {

    const connection = mysql.createConnection(global.dbConnection);
    const giderler = await database.runQuery(connection, 'SELECT giderler.*,kasalar.kasaAdi FROM giderler JOIN kasalar ON kasalar.ID = giderler.kasaID', []);
    const kasalar = await database.runQuery(connection, 'SELECT * FROM kasalar', []);
    connection.end();
    res.render('giderler', {title: "Giderler - Muhasebem", giderler,kasalar});

});

app.get('/gelir-ekle', async(req,res) => {

    const connection = mysql.createConnection(global.dbConnection);
    const kasalar = await database.runQuery(connection, 'SELECT * FROM kasalar', []);
    connection.end();
    res.render('gelirEkle', {title: "Gelir Ekle - Muhasebem", kasalar});

});

app.get('/gider-ekle', async(req,res) => {

    const connection = mysql.createConnection(global.dbConnection);
    const kasalar = await database.runQuery(connection, 'SELECT * FROM kasalar', []);
    connection.end();
    res.render('giderEkle', {title: "Gider Ekle - Muhasebem", kasalar});

});

app.post('/gelir-ekle', async(req,res) => {
    
    const connection = mysql.createConnection(global.dbConnection);
    await database.runQuery(connection, 'INSERT INTO gelirler (miktar, kasaID) VALUES (?, ?)', [parseFloat(req.body.miktar), req.body.kasaID]).catch(err => res.json(err));
    connection.end();
    res.json(true);

});

app.post('/gelir-sil', async(req,res) => {

    const connection = mysql.createConnection(global.dbConnection);
    await database.runQuery(connection, 'DELETE FROM gelirler WHERE ID = ?', [parseInt(req.body.ID)]).catch(err => res.json(err));
    connection.end();
    res.json(true);

});

app.post('/gider-ekle', async(req,res) => {

    const connection = mysql.createConnection(global.dbConnection);
    await database.runQuery(connection, 'INSERT INTO giderler (miktar, kasaID) VALUES (?, ?)', [parseFloat(req.body.miktar), req.body.kasaID]).catch(err => res.json(err));
    connection.end();
    res.json(true);

});

app.post('/gider-sil', async(req,res) => {

    const connection = mysql.createConnection(global.dbConnection);
    await database.runQuery(connection, 'DELETE FROM giderler WHERE ID = ?', [parseInt(req.body.ID)]).catch(err => res.json(err));
    connection.end();
    res.json(true);

});

app.get('/kasalar', async(req, res) => {

    const connection = mysql.createConnection(global.dbConnection);
    const kasalar = await database.runQuery(connection, 'SELECT * FROM kasalar', []).catch(err => res.json(err));
    connection.end();
    res.render('kasalar', {kasalar});

});



app.listen(2000, () => {
    console.log("Sunucumuz çalışıyor.");
});
