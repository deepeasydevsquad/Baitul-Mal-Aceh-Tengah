const { Member } = require("../models");
const bcrypt = require("bcryptjs");
    
const validation = {};

validation.username = async ( value ) => {
    var check = await Member.findOne({
        where: { username : value }, 
    });
    if (!check) {
        throw new Error("Username tidak terdaftar dipangkalan data");
    }
    return true;
}

validation.password = async ( value, { req } ) => {
    var q = await Member.findOne({
        where: { username : req.body.username }, 
    });
     if (!q) {
        throw new Error("Member ini tidak terdaftar dipangkalan data");
    }else{
        const salt = await bcrypt.genSalt(10);
        const hasil = await bcrypt.hash(value, salt)
        console.log(' Username Password ');
        console.log(hasil);
        
        console.log(value);
        console.log(q.password);
        console.log(' Username Password ');
        



        const valid_password = await bcrypt.compare(value, q.password);
        if (!valid_password) {
            throw new Error("Username atau Password anda tidak valid.");
        }
    }
    return true;
}

module.exports = validation;