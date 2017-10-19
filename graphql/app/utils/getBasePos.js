const R = require('ramda');

function getLastMatch(s1, s2) {
    var i = 0;
    for (; i < Math.min(s1.length, s2.length); ++i) {
        if (s1[i] !== s2[i]) break;
    }

    return i;
}

module.exports = function(paths) {
    return R.reduce((accum, val) => ({
        accum: accum.accum? Math.min(accum.accum, getLastMatch(accum.val, val)) : val.length,
        val
    }), {}, paths).accum;    
};
