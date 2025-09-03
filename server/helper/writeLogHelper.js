
const moment = require("moment");
const { System_log, Member, Company } = require("../models");
const jwt = require("jsonwebtoken");
const helper = {};

helper.writeLog = async (req, t, param) => {
    // get ip user
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // get datetimes
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    // get info user from token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.decode(token);
    const company_code = decoded.company_code;
    const type = decoded.type;
    const username = decoded.username;

    var user_id = 0;
    var name = '';
    var company_id = 0;
    // get info user from database
    if( type !== 'administrator') {
      await Member.findOne({
        include : {
          required : true,
          model : Division,
          include : {
            required : true,
            model : Company,
            where : { code : company_code }
          }
        },
        where: { whatsapp_number: username },
      }).then(async (e) => {
        if (e) {
            user_id = e.id;
            name = e.fullname;
            company_id = e.Division.Company.id
        }
      });
    } else {
        await Company.findOne({
        where: { code: company_code },
        }).then(async (e) => {
        if (e) {
            name = e.company_name;
            company_id = e.id
        }
        });
    }

    try {
        // input system log to database
        await System_log.create({
            user_id : user_id, 
            msg : name + " " + param.msg, 
            ip : ip, 
            company_id : company_id,
            createdAt : myDate, 
            updatedAt : myDate
        }, {
            transaction: t,
        });
        
    } catch (error) {
        console.log("------ERERER");
        console.log(error);
        console.log("------ERERER");
    }
};

module.exports = helper;
