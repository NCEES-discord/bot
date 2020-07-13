const {MessageEmbed} = require('discord.js');

exports.init=(log, mgr, db, cli)=>{
    cli.on('guildMemberAdd',(member)=>{
        switch(member.guild.id){
            case "714803464764522546": //R&D
                var embed = buildEmbed(member);
                var chan = member.guild.channels.resolve("727869652776124416");
                //chan.send(`Welcome ${member}`).then(m=>{..edit message with embed..})
                chan.send({content:`||${member}||`,embed}).then(msg=>{
                    msg.react("one")
                    msg.react("two")
                    msg.react("three")
                    msg.react("four")
                    msg.react("five")
                });

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
            percentBar +=" "
        }
    }

    percent = Math.floor(percent*10)/10;

    var footerUrl = member.guild.iconURL();
    var thumbnailUrl = member.user.avatarURL(); 
    var imageUrl = "https://media.discordapp.net/attachments/725770219158634586/732302838645915648/unknown.png"


    var embed = new MessageEmbed()
        .setTitle(`Welcome to the NCEES Networking Community, ${member.user.username}!`)
        .setColor(0xD44A1C) //TODO colour based on profile pic or server colour scheme
        .setAuthor("NCEES",footerUrl)
        .setDescription(`**You're our ${memberNum}${suffix} member!** Bringing us 0.1% closer to our next goal of **${nextGoal}** members, thanks for the help!`)
        .setFooter("NCEES",footerUrl)
        .setImage(imageUrl)
        .setThumbnail(thumbnailUrl)
        .addField("Things to See","Please have a read of [rules]() & visit [roles]() to get started with the community")
        .addField("Progress to next goal",`**${nextGoal-1000}**- \`\`${percentBar}\`\` [${percent}%] -**${nextGoal}**`)
    return embed;
}