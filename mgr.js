module.exports=(cli, db, log, options={regex:/^\/([a-zA-Z0-9_.]*)( |$)/})=>{
    var registeredCMDS = {
        list:[],
        handlers:{}
    }
    var waitingFor = {};
    cli.on('message', msg=>{
        var cmd=options.regex.exec(msg.content);
        //TODO extract cmd args
        if(cmd != null && cmd[1]){
            var tlc = cmd[1].toLocaleLowerCase()
            var args = msg.content.split(' ');  //TODO better argument parsing (eg: quoted strings)
            if(registeredCMDS.list.includes(tlc)){
                registeredCMDS.handlers[tlc](false,msg,args);
            }
        }
    })
    const api = {
        registerCMD:(cmd, handler, options={getUserdata:false,createNew:false})=>{
            if(options.getUserdata){
                registeredCMDS.handlers[cmd.toLowerCase()]=(err, msg, args)=>{
                    if(err) handler(err);
                    db.get('users',(err,users)=>{
                        if(err){
                            handler(err,msg,args)
                        } else {
                            users.get(msg.user.id, (err,userdata)=>{
                                if(err){
                                    if(options.createNew && err == "Does not exist in users!"){
                                        handler(false,msg,args,users.create(msg.user.id, msg.user.tag),users);
                                    } else {
                                        handler(err,msg,args,null,null)
                                    }
                                } else {
                                    handler(false, msg, args, userdata,users)
                                }
                            })
                        }
                    })
                }
            } else {
                registeredCMDS.handlers[cmd.toLowerCase()] = handler;
            }
            registeredCMDS.list.push(cmd.toLowerCase());
        },
        getUserdata:(id, next)=>{
            db.get('users',(err,users)=>{
                if(err){
                    next(err)
                } else {
                    users.get(id, (err,userdata)=>{
                        if(err){
                            next(err)
                        } else {
                            next(false, userdata);
                        }
                    })
                }
            })
        },
        waitFor:(modDesc)=>{
           if(waitingFor[modDesc.name]){
               log(1, `Module name conflict: \n${JSON.stringify(modDesc)} With ${JSON.stringify(waitingFor[modDesc.name].desc)}`);
           } else {
                waitingFor[modDesc.name] = {
                    desc: modDesc,
                    ready:false
                }
           }
        },
        readyUp:(modDesc)=>{
            waitingFor[modDesc.name].ready=true;
            log(3, `${modDesc.name} module ready`);
        },
        onReady:(func)=>{
            var waited = 0;
            var waitingInterval = setInterval(()=>{
                var allReady = true;
                var mods = Object.keys(waitingFor);
                for(var i=0; i<mods.length; i++){
                    if(!waitingFor[mods[i]].ready) allReady=false;
                }
                if(allReady){
                    clearInterval(waitingInterval);
                    log(3, "All modules ready");
                    func();
                } else if(waited>4){
                    var ages = [];
                    for(var i=0; i<mods.length; i++){
                        if(!waitingFor[mods[i]].ready){
                            ages.push(mods[i]);
                        }
                    }
                    log(2, `Modules are taking a long time to ready up: ${ages.join(", ")}`);
                }
                waited++;
            }, 1000)
        }
    }
    return api;
}