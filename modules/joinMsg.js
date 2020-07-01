const {MessageEmbed} = require('discord.js');

exports.init=(log, mgr, db, cli)=>{
    cli.on('guildMemberAdd',(member)=>{
        switch(member.guild.id){
            case "714803464764522546": //R&D
                var embed = new MessageEmbed(buildEmbed(member));
                member.guild.channels.resolve("727869652776124416").send(embed);
                break;
            case "398644997412356106": //NCEES
                log(2,"Unimplemented member join: NCEES")//TODO fix this.
                break;
            default:
                log(2,`Unimplemented member join: ${guild.name}`)
                break;
        }
    });
    mgr.readyUp(exports.descriptor);
}

exports.requiredKeys=false;
exports.cmds=false;

exports.descriptor={
    name:"JoinMsg",
    version:"1.0.0",
    authors:[
        "Azurethi"
    ]
}


function buildEmbed(member){

    var memberNum = member.guild.memberCount;
    var suffix = "th"
    if(memberNum%100<10 || memberNum%100>20){
        switch(memberNum%10){
            case 1: suffix="st"; break;
            case 2: suffix="nd"; break;
            case 3: suffix="rd"; break;
        }
    }

    var nextGoal = Math.floor(memberNum/1000 + 1) * 1000;
    //███████████░░░░░░░░░

    var percent = (memberNum-nextGoal+1000)/10;
    var percentBar = "";
    for(var i=0; i<20; i++){
        if(i*5<percent){
            percentBar +="█";
        } else {
            percentBar +="░"
        }
    }

    percent = Math.floor(percent*10)/10;

    var footerUrl = "https://cdn.discordapp.com/avatars/714774039876337795/e82385007222252ffe6937a945b1cf89.png";
    var thumbnailUrl = member.guild.iconURL();
    var imageUrl = member.user.avatarURL();

    var template= {
        "content": "",
        "embed": {
          "title": `Welcome to the NCEES Networking Community, ${member.user.username}!`,
          "description": `**You're our ${memberNum}${suffix} member!** Bringing us 0.1% closer to our next goal of **${nextGoal}** members, thanks for the help!`,
          "url": "",
          "color": 13912604,
          "timestamp": "2020-07-01T12:57:10.477Z",
          "footer": {
            "icon_url": footerUrl,
            "text": "NCEES"
          },
          "thumbnail": {
            "url": thumbnailUrl
          },
          "image": {
            "url": imageUrl
          },
          "author": {
            "name": "NCEES",
            "url": "",
            "icon_url": footerUrl
          },
          "fields": [
            {
              "name": "Things to see",
              "value": "Please have a read of [rules]() & visit [roles]() to get started with the community"
            },
            {
              "name": "Progress to next goal",
              "value": `**${nextGoal-1000}**- ${percentBar} [${percent}%] -**${nextGoal}**`
            }
          ]
        }
      }
}