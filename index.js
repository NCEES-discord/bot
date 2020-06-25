const fs = require('fs');

const djs = require('discord.js');

const auth = require('./auth.json');
const db = require('./data/db');
const log = require('./logger');
log('CORE', 3,"",{type:"startup"});

var cli = new djs.Client();

const mgr = require('./mgr')(cli,db,log.bind(null,"MGR"),{regex:/^\/([a-zA-Z0-9_.]*)( |$)/});

var loadedModules = [];

log('CORE', 3,"Loading modules");
fs.readdir('./modules',(err,modules)=>{
    if(err) throw err;
    modules.forEach(modName => {
        var mod = require(`./modules/${modName}`);
        loadedModules.push(mod.descriptor);
        try{
            mgr.waitFor(mod.descriptor);
            mod.init(log.bind(null,mod.descriptor.name),mgr,db,cli);
            log('CORE', 3,"  ",{type:"moduleDesc",object:mod.descriptor});
        } catch(e){
            log('CORE', 3,"  ",{type:"moduleDescFail",object:mod.descriptor,reason:e});
        }
        
    });
    mgr.onReady(()=>{
        if(auth.token==""){
            log('CORE', 2,"No Auth token, running in debug mode!");
            //log('CORE', 3,"Severity formats:");
            //for(var i=0; i<5; i++)log('CORE', i,`Severity ${i}`);
            require('./debugger')(log.bind(null,'DEBUGGER'),cli);
        } else {
            cli.login(auth.token)
        }
    })
})

//testing the github-discord hook