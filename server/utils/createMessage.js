
var moment = require('moment');

var createMessage = function(from, msg){
    return{
        from,
        msg,
        createdAt: moment().valueOf(),
    }
};
module.exports = { createMessage }