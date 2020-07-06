const http = require('http');
const express = require('express');
const app = express();

app.get("/", (request, response) => {
 console.log(Date.now() + " Just got pinged!");
 response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
 http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

//Variables
const config = process.env;
//APIs--------------------------------------
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const roblox = require('roblox-js');
//Ready-------------------------------------
client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setActivity(`${client.users.size} users | .help`, {
        type: "WATCHING",
        url: "https://devforum.roblox.com/"
      });
  });

client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);
        client.user.setActivity(`${client.users.size} users | .help`, {
        type: "WATCHING",
        url: "https://devforum.roblox.com/"
      });
})

//removed from a server
client.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name);
        client.user.setActivity(`${client.users.size} users | .help`, {
        type: "WATCHING",
        url: "https://devforum.roblox.com/"
      });
})

//Embeds
const devforumnotfoundembed = new Discord.RichEmbed()
  .setColor(`#F44242`)
  .setTitle("User not found on DevForums")
  .setTimestamp();
const robloxnotfoundembed = new Discord.RichEmbed()
  .setColor(`#F44242`)
  .setTitle("User not found on Roblox")
  .setTimestamp();

const devforumincorrect = new Discord.RichEmbed()
  .setColor(`#E4B00F`)
  .setTitle("Error: Incorrect Usage")
  .setDescription("*.search devforum {username}*")
  .setTimestamp();
const robloxincorrect = new Discord.RichEmbed()
  .setColor(`#E4B00F`)
  .setTitle("Error: Incorrect Usage")
  .setDescription("*.search roblox {username}*")
  .setTimestamp();

//Commands-------------------------------------
client.on('message', msg => {
    const lowercase = msg.content.toLowerCase();

    //ping
      if (lowercase.startsWith('.ping')) {
    msg.reply('Ping: ' + client.ping + " ms");
  }
      //help
      if (lowercase.startsWith('.help')) {
        
   const helpembed = new Discord.RichEmbed()
  .setTitle("Command List")
  .setColor("#00A1FF")
  .setDescription("All data provided by RoSearch is public data. Bot made by <@238454751107350531>, contact me for any help.\nAPIs Used: RoVer, Roblox, Discourse, Roblox-js")
  .setFooter("V1.4")
  .setTimestamp()
  .addBlankField(true)
  .addField(".ping", "Replies with bot's ping", false)
  .addField(".invite", "Creates bot invite link", false)
  .addField(".search devforum {username}", "Searches for user in Discourse(DevForum), RoVer and Roblox APIs for information.", false)
  .addField(".search roblox {username}", "Searches for user in Roblox APIs for information.", false);

  msg.channel.send(helpembed);
      }
  
      //invite
      if (lowercase.startsWith('.invite')) {
        
   const inviteembed = new Discord.RichEmbed()
  .setTitle("Bot Invite")
  .setColor("#6F83CB")
  .setDescription("https://discordapp.com/oauth2/authorize?client_id=490399237771624460&scope=bot&permissions=117760")
  .setTimestamp()

  msg.channel.send(inviteembed);
      }

    //search
      if (lowercase.startsWith('.search devforum')) {
        const args = msg.content.slice(17).trim().split(/ +/g);
        let username = args[0]; // Remember arrays are 0-based!
        let extraargs = args[1];
        if (!username || extraargs) return msg.channel.send(devforumincorrect);
        msg.reply(`Searching DevForum site for **${username}**...`);
        
  request(`https://devforum.roblox.com/u/${username}.json`, { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  if (!body["user"])return msg.channel.send(devforumnotfoundembed);
const trust = body["user"]["trust_level"]

//Creation Date
let creationdate = new Date(body["user"]["created_at"]);
let year = creationdate.getFullYear();
let month = creationdate.getMonth()+1;
let dt = creationdate.getDate();

if (dt < 10) {
  dt = '0' + dt;
}
if (month < 10) {
  month = '0' + month;
}
//-------------------
    
//Last Seen Date
let FormattedLastSeenDate = "Unknown"
let lastseendate = new Date(body["user"]["last_seen_at"]); 
let lastseenyear = lastseendate.getFullYear();
let lastseenmonth = lastseendate.getMonth()+1;
let lastseenday = lastseendate.getDate();
    
if (lastseenday < 10) {
  lastseenday = '0' + lastseenday;
}
if (lastseenmonth < 10) {
  lastseenmonth = '0' + lastseenmonth;
}
if (lastseendate) {FormattedLastSeenDate = lastseenyear+'-'+lastseenmonth+'-'+lastseenday};

//-------------------

//ROBLOX API (username to ID)
  
  request(`http://api.roblox.com/users/get-by-username?username=${username}`, { json: true }, (erra, resa, bodya) => {
  let robloxid = "Unknown"
  if (erra) { return console.log(erra); }
  if (!bodya) {return console.log("Error, not found");}
  robloxid = bodya["Id"];

//ROBLOX API (friends)
  request(`https://www.roblox.com/friends/json?userId=${robloxid}&currentPage0&pageSize##20&imgWidth=110&imgHeight=110&imgFormat=jpeg&friendsType=BestFriends`, { json: true }, (errc, resc, bodyc) => {
    if (errc) { return console.log(errc); }
    if (!bodyc) {return console.log("Error, not found");}
    let friends = bodyc["TotalFriends"];

//ROBLOX API ([profile)
  request(`https://www.roblox.com/profile?userid=${robloxid}`, { json: true }, (errd, resd, bodyd) => {
    if (errd) { return console.log(errd); }
    if (!bodyd) {return console.log("Error, not found");}
    let robloxBC = "No Membership";
    let robloxfriendshipstatus = bodyd["FriendshipStatus"]
if (bodyd["BC"]) {
robloxBC = "BC";
} else if (bodyd["TBC"]) {
robloxBC = "TBC";
} else if (bodyd["OBC"]){
 robloxBC = "OBC";
}
else{
  robloxBC = "No Membership";
}
    
//-----------------------------
    
//RoVer API
  request(`https://verify.eryn.io/api/roblox/${robloxid}`, { json: true }, (errb, resb, bodyb) => {
  let discordid = "Unknown"
  if (errb) { return console.log(errb); }
  if (!bodyb) {return console.log("Error, not found");}
  if (!bodyb["users"]) {return discordid = "Unknown";}
  else if (bodyb["users"]) {discordid = `<@${bodyb["users"]}>`.toString().replace(",", ">,<@");}
//-----------------------------
    
    
//Info Variables
let loc = body["user"]["location"];
if (!loc) { loc = "Unknown"}
let website = body["user"]["website"];
if (!website) { website = "None"}
let title = body["user"]["title"];
if (!title) { title = "None"}
let bio = body["user"]["bio_raw"];
if (!bio) { bio = "None"}

if (bio.length > 1010) {
bio = bio.slice(bio.length - 1010);
bio = bio + '...'};

    
    let groups = [];
    for(let group of body["user"]["groups"]) {
    if (group.title){
    groups.push(group.title)}
    }
    if (groups.length < 1) {groups.push('None')};
    
    
  //Info Message
  const embed = new Discord.RichEmbed()
  .setTitle(`Info Panel`)
  .setColor(`#00A1FF`)
  .setAuthor(body["user"]["username"], `https://devforum.roblox.com/user_avatar/devforum.roblox.com/${username}/120/288849_1.png`)
  .setDescription(`Discord: ${discordid}`)
  .addField("Roblox Info", `ID: **${robloxid}**\nMembership: **${robloxBC}**\nFriends: **${friends}**\nFriendship Status: **${robloxfriendshipstatus}**`)
  .setFooter("All data provided is public data")
  .setTimestamp()
  .setURL(`https://devforum.roblox.com/u/${username}`)
  .addField("Bio", bio)
  .addField("\n Joined On", year+'-' + month + '-'+dt, true)
  .addField("\n Last Seen At", FormattedLastSeenDate,true)
  .addField("\n Trust Level", body["user"]["trust_level"], true)
  .addField("\n Title", title, true)
  .addField("\n Location", loc, true)
  .addField("\n Badges", body["user"]["badge_count"], true)
  .addField("\n Website", website, true)
  .addField("\n Groups", groups, false)

  msg.channel.send(embed);
        });
      });
    });
  });
});


  }
  
  //roblox lookup
        if (lowercase.startsWith('.search roblox')) {
        const rargs = msg.content.slice(15).trim().split(/ +/g);
        let rusername = rargs[0]; // Remember arrays are 0-based!
        let rextraargs = rargs[1];
        if (!rusername || rextraargs) return msg.channel.send(robloxincorrect);
        msg.reply(`Searching Roblox site for **${rusername}**... (Might take some time to scrape Roblox)`);
    //check if user exists
    request(`http://api.roblox.com/users/get-by-username?username=${rusername}`, { json: true }, (error, response, body) => {
    if (error) { return console.log(error); }
    if (body["errorMessage"])return msg.channel.send(robloxnotfoundembed);

    
    //roblox api/variables
    request(`https://api.roblox.com/users/get-by-username?username=${rusername}`, { json: true }, (e, r, b) => {
    let RoID = "0"
    let RoUsername = "Name"
    if (e) { return console.log(e); }
    if (!b) {return console.log("Error, not found");}
    RoID = b["Id"];
    RoUsername = b["Username"];
      
  //RoVer API
  request(`https://verify.eryn.io/api/roblox/${RoID}`, { json: true }, (errb, resb, bodyb) => {
  let discordid = "Unknown"
  if (errb) { return console.log(errb); }
  if (!bodyb) {return console.log("Error, not found");}
  if (!bodyb["users"]) {return discordid = "Unknown";}
  else if (bodyb["users"]) {discordid = `<@${bodyb["users"]}>`.toString().replace(",", ">,<@");}
  //-----------------------------
    
    //ROBLOX API (friends)
    request(`https://www.roblox.com/friends/json?userId=${RoID}&currentPage0&pageSize##20&imgWidth=110&imgHeight=110&imgFormat=jpeg&friendsType=BestFriends`, { json: true }, (errc, resc, bodyc) => {
    if (errc) { return console.log(errc); }
    if (!bodyc) {return console.log("Error, not found");}
    let friends = bodyc["TotalFriends"];
    
    //Roblox-js stuff
let RobloxAbout = "None"
roblox.getBlurb(RoID)
.then(function(blurb) {
if (!blurb) {RobloxAbout = "None"}
if (blurb) {RobloxAbout = blurb}
  
let RobloxStatus = "None"
roblox.getStatus(RoID)
.then(function(status) {
if (!status) {RobloxStatus = "None"}
if (status) {RobloxStatus = status}
  //
  
   const robloxlookupembed = new Discord.RichEmbed()
  .setTitle(`Info Panel`)
  .setDescription(`ID: ${RoID}\nDiscord: ${discordid}\nOnline: ${body["IsOnline"]}`)
  .setColor(`#E2231A`)
  .setAuthor(RoUsername, `https://www.roblox.com/headshot-thumbnail/image?userId=${RoID}&width=420&height=420&format=png`)
  .setFooter("All data provided is public data")
  .setTimestamp()
  .setURL(`https://www.roblox.com/users/${RoUsername}/profile`)
  .setImage(`https://www.roblox.com/Thumbs/Avatar.ashx?x=200&y=200&username=${RoUsername}`)
  .addField("About", RobloxAbout,false)
  .addField("Status", RobloxStatus,false)
  .addField("Friends",friends,true);
          
          
   msg.channel.send(robloxlookupembed);
  }).catch(function(err) {
    console.log(err)
});
      
  }).catch(function(err) {
    console.log(err)
});
      
      
               });
             });
           });
         }); 
        }
  
  //new command
  
  

});

client.login(config.token);