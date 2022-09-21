const fs = require('fs');
const { get } = require('http');

const Suscribers = {
    add(res) {
        //Add new suscriber to an external storage (Reddis ?)
    },
    get(){
        //reeturn list of suscribers
    }
}

module.exports = Suscribers;