const DataTemplate = require('../dataTemplate');
const log = require('../../logger').bind(null, "T/users");
class UserTemplate extends DataTemplate{
    constructor(){
        super([
            {key:"id", required:true, default:null},
            {key:"tag",required:true, default:null}
        ]);
    }

    create(...vals){
        var obj=super.create(...vals);
        log(3, `User create: ${vals.join('/')}`)
        return obj;
    }

    registerKey(desc={}){
        log(4,`Registed User key: ${JSON.stringify(desc)}`);
        super.registerKey(desc);
    }
}

module.exports = UserTemplate;