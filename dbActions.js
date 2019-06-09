const Promise = require('bluebird');

class dbActions {
    runQuery(baglanti, query, alanlar){
        return new Promise((resolve,reject) => 
        baglanti.query(query,alanlar, (err,result) => {
            if(err)
                reject(err)
            console.log(query, " : Tamamlandı");
            resolve(result);
        })
        )
    }
    
    constructor(){
        this.verim1 = "test verim bir"
    }
}

module.exports = dbActions;