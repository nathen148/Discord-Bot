const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = '/'; //Command Prefix
//------------------------------------------------------------------------------------------------------------------------------------
//DO NOT CHANGE ANYTHING IN THIS SECTION//
var fs = require ('fs');
var PastebinAPI = require('pastebin-js');
var bufchan;
var outpostchat;
var lastSender = null;
var lastCheckTime = Date.now();
var playerChecked = true;
var OutpostEnabled = true;
var BufferEnabled = true;
var a = fs.readFileSync('../ConsoleClient/Console/checked.txt', 'utf-8').split('\r\n');
//DO NOT CHANGE ANYTHING IN THIS SECTION//
//------------------------------------------------------------------------------------------------------------------------------------
var role = "Moderator"; //Role that can run moderation commands
var buffers = "bot-log"; //Channel to send buffer messages in 
var outposts = "owner-only"; //Channel to send outpost messages in
var reminderTime = 15;//here is how often you want reminded in minutes
var token = 'NTcyNzg1NTI0MjM1MDQyODI4.XMn8Xg.yK0GLA_zMp-6ZoGLCuIFbsqQrC8';//Put your bot token here
var pastebin = new PastebinAPI('28365c097143db31fa938a25ec52675c');//developer key - This can be found here: http://pastebin.com/api#1

 
//************************************************************INFORMATION*************************************************************
//   - This is a Discord Bot/Console Client Combination made by nathenisSocool
//   
// 	 - All Items that have a // comment next to them are editable
//
//   - PasteBin API only allows 5 posts every 10 min and a max of up to 20 new pastes per 24 hours For Free Members - Will Lock you out after.
//
//
//   - Adding a /Near Command to this bot is against Cosmic Rules as it counts towards raid detection
//************************************************************************************************************************************



bot.on('ready', () => {

    bufchan = bot.channels.find('name', buffers);
	outpostchat = bot.channels.find('name', outposts);
    console.log('Full Factions Moderation Bot Engaged.');
	console.log('Created by nathenisSocool')
	pastebin = new PastebinAPI({
                'api_dev_key' : '28365c097143db31fa938a25ec52675c', //PasteBin API Key, same as above
                'api_user_name' : 'nathen148', //Pastebin Username (NOT EMAIL)
                'api_user_password' : '852456abc' //Pastebin Password
               });
	bufchan.send("/checked").then(msg => {
    msg.delete(1000)
  })	
});

setInterval(function() {
    
		var whitelist2 = fs.readFileSync('../ConsoleClient/Console/whitelist.txt', 'utf-8').split('\r\n');
		var data =fs.readFileSync('../ConsoleClient/RaidAlerts/Messages.txt', 'utf-8');
		var outpost =fs.readFileSync('../ConsoleClient/RaidAlerts/Outpost.txt', 'utf-8'); 
		var logger = fs.readFileSync('../ConsoleClient/Factions/announce.txt', 'utf-8').split('\r\n');
		playerChecked = false;
//------------------------------------------------------------------------------------------------------------------------------------  		
		for (var i = 0; i < whitelist2.length && !playerChecked; i++) 
		{
			if (data.length > 1)
			{
		if (whitelist2[i] === data) 
		{
		
		playerChecked = true;
        bufchan.send(':white_check_mark: The buffers have been checked by ' + data + ' after ' + lastCheckedInMinutes() + ' minutes.');
		fs.writeFileSync('../ConsoleClient/Console/commands.txt', 'The buffers have been checked by ' + data + ' after ' + lastCheckedInMinutes() + ' minutes.', 'utf8');
		fs.truncate('../ConsoleClient/RaidAlerts/Messages.txt', 0, function(){});
		lastCheckTime = Date.now();
		}
		}
		}		
//------------------------------------------------------------------------------------------------------------------------------------

		if (logger != "")
		{
			bufchan.send(':exclamation: ' + logger);//Comment This out if you Dont want Discord Notifications 
			fs.truncate('../ConsoleClient/Factions/announce.txt', 0, function(){});
		}
		
//------------------------------------------------------------------------------------------------------------------------------------  		

		if (OutpostEnabled == true)
		{
		if (outpost != "")
		{
			outpostchat.send(':exclamation: everyone ' + outpost);//Comment This out if you Dont want Discord Notifications 
			fs.writeFileSync('../ConsoleClient/Console/commands.txt', outpost, 'utf8');//Comment This out if you Dont want In Game Notifications
			fs.truncate('../ConsoleClient/RaidAlerts/Outpost.txt', 0, function(){});
		}
		}
//------------------------------------------------------------------------------------------------------------------------------------  		
		if (BufferEnabled == true)
		{
		if (lastCheckTime <= Date.now() - (1000 * 60 * reminderTime))
		{
			fs.writeFileSync('../ConsoleClient/Console/commands.txt', 'The buffers have not been checked in ' + lastCheckedInMinutes() + " minutes!" , 'utf8');//Comment This out if you Dont want In Game Notifications
			bufchan.send('everyone The buffers have not been checked in ' + lastCheckedInMinutes() + ' minutes! CHECK BUFFERS!!!!');//Comment This out if you Dont want Discord Notifications
			playerChecked = false;
		}
		}
}, 5 * 1000);

//------------------------------------------------------------------------------------------------------------------------------------  	

function lastCheckedInMinutes() {
    return Math.floor(((Date.now()/1000) - (lastCheckTime/1000))/60);
    
}

function timeLeft(){
	return reminderTime - lastCheckedInMinutes();
}

//------------------------------------------------------------------------------------------------------------------------------------  	

bot.on('message', message => {
    const member = message.member;
    const mess = message.content.toLocaleLowerCase();
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
   
   
    //------------------------------------------------------------------------------------------------------------------------------------  	
                                            //COMMANDS//
 	//------------------------------------------------------------------------------------------------------------------------------------  
	if (message.content.startsWith(prefix + 'outpost')) //you can change command name here - not recommended but you can :)  
	{
		
        fs.truncate('../ConsoleClient/Console/output.txt', 0, function(){});
		fs.writeFileSync('../ConsoleClient/Console/commands.txt', '/outpost', 'utf8');
		message.reply('*Gathering Outpost Information*');
		
		setTimeout(function () {
				
				var out = fs.readFileSync('../ConsoleClient/Console/output.txt', 'utf-8').split('\r\n');
				var out2 = out.toString();
				var out3 = out2.split(",").join("\n");
				const outembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('TheArchon PvP Outpost')
                .addField('Status', "```" + out3 + "```")
                .setURL("")
				message.channel.sendEmbed(outembed)
				fs.truncate('../ConsoleClient/Console/output.txt', 0, function(){});
			}, 8000);
		}

	//------------------------------------------------------------------------------------------------------------------------------------
	
	else if (message.content.startsWith(prefix + 'seen')) //you can change command name here - not recommended but you can :) 
	{
		
		
		var bob = args[0];
		
		if (bob != undefined)
		{
        fs.writeFileSync('../ConsoleClient/Console/commands.txt', '/seen ' + bob, 'utf8');
		fs.truncate('../ConsoleClient/Console/output.txt', 0, function(){});
		message.reply('*Gathering Seen Information*');
		
		setTimeout(function () {
				
				var out4 = fs.readFileSync('../ConsoleClient/Console/output.txt', 'utf-8').split('\r\n');
				var out5 = out4.toString();
				var out6 = out5.split(",").join("\n");
				
				const outembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Archon PvP Seen ')
                .addField(args[0], "```" + out6 + "```")
                .setURL("")
				message.channel.sendEmbed(outembed)
				fs.truncate('../ConsoleClient/Console/output.txt', 0, function(){});
				

			}, 8000);
		
		}
		else
		{
			message.reply('*Please enter a valid player name.*');
		}
	}
   	//------------------------------------------------------------------------------------------------------------------------------------
	
	else if (message.content.startsWith(prefix + 'bal')) //you can change command name here - not recommended but you can :) 
	{
		
		
		var bal = args[0];
		
		if (bal != undefined)
		{
		
        fs.writeFileSync('../ConsoleClient/Console/commands.txt', '/bal ' + bal, 'utf8');
		fs.truncate('../ConsoleClient/Console/output.txt', 0, function(){});
		message.reply('*Gathering Balance Information*');
		
		setTimeout(function () {
				
				var out10 = fs.readFileSync('../ConsoleClient/Console/output.txt', 'utf-8').split('\r\n');
				var out11 = out10.toString();
				var out12 = out11.split(",").join("\n");
				
				const outembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Archon Factions Balance ')
                .addField(args[0], "```" + out12 + "```")
                .setURL("")
				message.channel.sendEmbed(outembed)
				fs.truncate('../ConsoleClient/Console/output.txt', 0, function(){});
				

			}, 8000);
		
		}		
		else
		{
			message.reply('*Please enter a valid player name.*');
		}
}

   	//------------------------------------------------------------------------------------------------------------------------------------

		else if (message.content.startsWith(prefix + 'ftop')) //you can change command name here - not recommended but you can :) 
		{
		
		
        fs.writeFileSync('../ConsoleClient/Console/commands.txt', '/f top', 'utf8');
		fs.truncate('../ConsoleClient/Console/output.txt', 0, function(){});
		message.reply('*Gathering Faction Top Information*');
		
		setTimeout(function () {
				
				var out18 = fs.readFileSync('../ConsoleClient/Console/output.txt', 'utf-8').split('\r\n');
				var out19 = out18.toString();
				var out20 = out19.split(",").join("\n");
				
				const outembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Cosmic PvP Top Factions ')
                .addField("Ftop: ", "```" + out20 + "```")
                .setURL("")
				message.channel.sendEmbed(outembed)
				fs.truncate('../ConsoleClient/Console/output.txt', 0, function(){});
				

			}, 8000);
		
}
   	//------------------------------------------------------------------------------------------------------------------------------------
	
	else if (message.content.startsWith(prefix + 'checked')) //you can change command name here - not recommended but you can :) 
	{
        lastSender = message.guild.lastSender = message.author
		playerChecked = true;
        bufchan.send(':white_check_mark: The buffers have been checked by ' + lastSender + ' after ' + lastCheckedInMinutes() + ' minutes.');
		lastCheckTime = Date.now();
	} 
	
	//------------------------------------------------------------------------------------------------------------------------------------
	
	else if (message.content.startsWith(prefix + 'buffers'))//you can change command name here - not recommended but you can :)  
	{
        if (message.guild.lastSender) {
            const wallembed = new Discord.RichEmbed()
                .setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Buffer info')
                .addField('The last wall check was at ', new Date(lastCheckTime))
                .addField('Time Till Reminder ', timeLeft() + " Minutes.")
                .setImage("https://pbs.twimg.com/media/BH1Kz5OCEAAqEuw.jpg:large")
                .setURL("")
            message.channel.sendEmbed(wallembed)
        } else {
            message.reply('Do /checked so i can tell you!');
        }
	} 
	
	//------------------------------------------------------------------------------------------------------------------------------------
	
	else if (message.content.startsWith(prefix + 'active')) //you can change command name here - not recommended but you can :) 
	{

		
		var c = fs.readFileSync('../ConsoleClient/Console/checked.txt', 'utf-8').split('\r\n');
		function countWords(arr) {
    
		var  count = {};
		c.forEach(function(i) { count[i] = (count[i]||0) + 1;});

		return count;
	}
		var answer = countWords(c);
		var answer2 = JSON.stringify(answer);
		var answer3 = answer2.split(",").join("\n");
		var answer4 = answer3.split("\"").join("**");
		var answer5 = answer4.split("\{").join( "");
		var answer6 = answer5.split("\}").join( "");
		console.log(answer6);
		
         const activeembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Checking info')
                .addField('Last Checkers: ', answer6)
                .setURL("")
				message.channel.sendEmbed(activeembed)   
        
	}
	
	//------------------------------------------------------------------------------------------------------------------------------------
	
	else if (message.content.startsWith(prefix + 'faction')) //you can change command name here - not recommended but you can :) 
	{
		if(message.member.roles.find("name", role))
		{
			var factionlogs = fs.readFileSync('../ConsoleClient/Factions/logs.txt', 'utf-8').split('\r\n');
			var factionlogs2 = factionlogs.toString();
			var factionlogs3 = factionlogs2.split(",").join("\n");
			
				message.reply('*Gathering Logs*');
				pastebin.createPaste
				({
				text: factionlogs3,
				title: "Claiming Info",
				format: null,
				privacy: 1, // 0 is public (recommended for unlimted max), 1 is unlisted (only linked people can see), 2 is Private (only account owner can see)
				expiration: '1M'
				}).then(function (data) {
				// paste succesfully created, data contains the id
				console.log(data);
				fs.writeFileSync('../ConsoleClient/Moderation/pastes.txt', data + "\r\n", encoding='utf8')
				})
				.fail(function (err) {
				// Something went wrong
				console.log(err);
				})
				
				setTimeout(function () {
				var paste3= fs.readFileSync('../ConsoleClient/Moderation/pastes.txt', 'utf-8').split('\r\n');
				var paste4 = paste3.toString();
				const modembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Faction Online Logs')
                .addField('LOGS', "**Faction Logs: ** " +  paste4)
                .setURL("")
				message.channel.sendEmbed(modembed)
				
				fs.truncate('../ConsoleClient/Moderation/pastes.txt', 0, function(){});
				}, 5000);
		}
		else 
		{
                message.channel.send("*I'm Sorry* " + message.author + " *but you do not have permission to use this command, please contact your faction leader about it*");

        }
	}		
		//------------------------------------------------------------------------------------------------------------------------------------	
	
	else if (message.content.startsWith(prefix + 'who')) //you can change command name here - not recommended but you can :) 
	{
		
		
		fs.truncate('../ConsoleClient/Console/output.txt', 0, function(){});
		var joe = args[0]
		if (joe != undefined)
		{
        fs.writeFileSync('../ConsoleClient/Console/commands.txt', '/f who ' + joe, 'utf8');
		
		message.reply('*Gathering Faction Information*');
		
		setTimeout(function () {
				
				var out7 = fs.readFileSync('../ConsoleClient/Console/output.txt', 'utf-8').split('\r\n');
				var out8 = out7.toString();
				var out9 = out8.split(",").join("\n");

				const outembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Archon Onyx Faction ')
                .addField(args[0], "```" + out9 + "```")
                .setURL("")
				message.channel.sendEmbed(outembed)
				fs.truncate('../ConsoleClient/Console/output.txt', 0, function(){});
				
			}, 8000);
		}
		else
		{
			message.reply('*Please enter a valid player/faction name.*');
		}
	}
	//------------------------------------------------------------------------------------------------------------------------------------
	
	else if (message.content.startsWith(prefix + 'logs')) //you can change command name here - not recommended but you can :) 
	{
		var money = fs.readFileSync('../ConsoleClient/Moderation/Money.txt', 'utf-8').split('\r\n');
		var claims = fs.readFileSync('../ConsoleClient/Moderation/Claiming.txt', 'utf-8').split('\r\n');
		var invites = fs.readFileSync('../ConsoleClient/Moderation/Invites.txt', 'utf-8').split('\r\n');
		var access = fs.readFileSync('../ConsoleClient/Moderation/Access.txt', 'utf-8').split('\r\n');
		var promote = fs.readFileSync('../ConsoleClient/Moderation/Promotions.txt', 'utf-8').split('\r\n');
		var cfs = fs.readFileSync('../ConsoleClient/Moderation/Cfs.txt', 'utf-8').split('\r\n');
		
		var money2 = money.toString();
		var claims2 = claims.toString();
		var invites2 = invites.toString();
		var access2 = access.toString();
		var promote2 = promote.toString();
		var cfs2 = cfs.toString();
		
		var money3 = money2.split(",").join("\n");
		var claims3 = claims2.split(",").join("\n");
		var invites3 = invites2.split(",").join("\n");
		var access3 = access2.split(",").join("\n");
		var promote3 = promote2.split(",").join("\n");
		var cfs3 = cfs2.split(",").join("\n");
		
		
		if(message.member.roles.find("name", role))
		{	
		
			if (args[0] === "money")
			{
				message.reply('*Gathering Logs*');
				pastebin.createPaste
				({
				text: money3,
				title: "Money Info",
				format: null,
				privacy: 1, // 0 is public (recommended for unlimted max), 1 is unlisted (only linked people can see), 2 is Private (only account owner can see)
				expiration: '1M'
				}).then(function (data) {
				console.log(data);
				fs.writeFileSync('../ConsoleClient/Moderation/pastes.txt', data + "\r\n", encoding='utf8')
				})
				.fail(function (err) {
				console.log(err);
				})
				
				setTimeout(function () {
				var paste= fs.readFileSync('../ConsoleClient/Moderation/pastes.txt', 'utf-8').split('\r\n');
				var paste2 = paste.toString();

				const modembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Moderation Log')
                .addField('LOGS', "**Faction Money: ** " + paste2)
                .setURL("")
				message.channel.sendEmbed(modembed)
				fs.truncate('../ConsoleClient/Moderation/pastes.txt', 0, function(){});
				fs.truncate('../ConsoleClient/Moderation/Money.txt', 0, function(){});
				}, 5000);
			}
			
		//------------------------------------------------------------------------------------------------------------------------------------
			
			else if (args[0] === "claims")
			{
				message.reply('*Gathering Logs*');
				pastebin.createPaste
				({
				text: claims3,
				title: "Claiming Info",
				format: null,
				privacy: 1, // 0 is public (recommended for unlimted max), 1 is unlisted (only linked people can see), 2 is Private (only account owner can see)
				expiration: '1M'
				}).then(function (data) {
				console.log(data);
				fs.writeFileSync('../ConsoleClient/Moderation/pastes.txt', data + "\r\n", encoding='utf8')
				})
				.fail(function (err) {
				console.log(err);
				})
				
				setTimeout(function () {
				var paste3= fs.readFileSync('../ConsoleClient/Moderation/pastes.txt', 'utf-8').split('\r\n');
				var paste4 = paste3.toString();
				const modembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Faction Claiming Log')
                .addField('LOGS', "**Faction Claims: ** " +  paste4)
                .setURL("")
				message.channel.sendEmbed(modembed)
				fs.truncate('../ConsoleClient/Moderation/pastes.txt', 0, function(){});
				fs.truncate('../ConsoleClient/Moderation/Claiming.txt', 0, function(){});
				}, 5000);
			}
			
		//------------------------------------------------------------------------------------------------------------------------------------	
			
			else if (args[0] === "invites")
			{
				message.reply('*Gathering Logs*');
				pastebin.createPaste
				({
				text: invites3,
				title: "Invite Info",
				format: null,
				privacy: 1, // 0 is public (recommended for unlimted max), 1 is unlisted (only linked people can see), 2 is Private (only account owner can see)
				expiration: '1M'
				}).then(function (data) {
				console.log(data);
				fs.writeFileSync('../ConsoleClient/Moderation/pastes.txt', data + "\r\n", encoding='utf8')
				})
				.fail(function (err) {
				console.log(err);
				})
				
				setTimeout(function () {
				var paste5= fs.readFileSync('../ConsoleClient/Moderation/pastes.txt', 'utf-8').split('\r\n');
				var paste6 = paste5.toString();
				const modembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Moderation Log')
                .addField('LOGS', "**Faction Invites: ** " +  paste6)
                .setURL("")
				message.channel.sendEmbed(modembed)
				fs.truncate('../ConsoleClient/Moderation/pastes.txt', 0, function(){});
				fs.truncate('../ConsoleClient/Moderation/Invites.txt', 0, function(){});
				}, 5000);
			}
			
			//------------------------------------------------------------------------------------------------------------------------------------
			
			else if (args[0] === "access")
			{
				message.reply('*Gathering Logs*');
				pastebin.createPaste
				({
				text: access3,
				title: "Access Info",
				format: null,
				privacy: 1, // 0 is public (recommended for unlimted max), 1 is unlisted (only linked people can see), 2 is Private (only account owner can see)
				expiration: '1M'
				}).then(function (data) {
				console.log(data);
				fs.writeFileSync('../ConsoleClient/Moderation/pastes.txt', data + "\r\n", encoding='utf8')
				})
				.fail(function (err) {
				console.log(err);
				})
				
				setTimeout(function () {
				var paste7= fs.readFileSync('../ConsoleClient/Moderation/pastes.txt', 'utf-8').split('\r\n');
				var paste8 = paste7.toString();
				const modembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Moderation Log')
                .addField('LOGS', "**Faction Access: ** " + paste8)
                .setURL("")
				message.channel.sendEmbed(modembed)
				fs.truncate('../ConsoleClient/Moderation/pastes.txt', 0, function(){});
				fs.truncate('../ConsoleClient/Moderation/Access.txt', 0, function(){});
				}, 5000);
			}
			
			//------------------------------------------------------------------------------------------------------------------------------------
			
			else if (args[0] === "promote")
			{
				message.reply('*Gathering Logs*');
				pastebin.createPaste
				({
				text: promote3,
				title: "Promotion Info",
				format: null,
				privacy: 1, // 0 is public (recommended for unlimted max), 1 is unlisted (only linked people can see), 2 is Private (only account owner can see)
				expiration: '1M'
				}).then(function (data) {
				console.log(data);
				fs.writeFileSync('../ConsoleClient/Moderation/pastes.txt', data + "\r\n", encoding='utf8')
				})
				.fail(function (err) {
				console.log(err);
				})
				
				setTimeout(function () {
				var paste9= fs.readFileSync('../ConsoleClient/Moderation/pastes.txt', 'utf-8').split('\r\n');
				var paste10 = paste9.toString();
				const modembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Moderation Log')
                .addField('LOGS', "**Faction Promotions: ** " + paste10)
                .setURL("")
				message.channel.sendEmbed(modembed)
				fs.truncate('../ConsoleClient/Moderation/pastes.txt', 0, function(){});
				fs.truncate('../ConsoleClient/Moderation/Promotions.txt', 0, function(){});
				}, 5000);
			}
			
			//------------------------------------------------------------------------------------------------------------------------------------
			
			else if (args[0] === "cfs")
			{
				message.reply('*Gathering Logs*');
				pastebin.createPaste
				({
				text: cfs3,
				title: "Cfs Info",
				format: null,
				privacy: 1, // 0 is public (recommended for unlimted max), 1 is unlisted (only linked people can see), 2 is Private (only account owner can see)
				expiration: '1M'
				}).then(function (data) {
				console.log(data);
				fs.writeFileSync('../ConsoleClient/Moderation/pastes.txt', data + "\r\n", encoding='utf8')
				})
				.fail(function (err) {
				console.log(err);
				})
				
				setTimeout(function () {
				var paste11= fs.readFileSync('../ConsoleClient/Moderation/pastes.txt', 'utf-8').split('\r\n');
				var paste12 = paste11.toString();
				const modembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Moderation Log')
                .addField('LOGS', "**Faction cfs: ** " + paste12)
                .setURL("")
				message.channel.sendEmbed(modembed)
				fs.truncate('../ConsoleClient/Moderation/pastes.txt', 0, function(){});
				fs.truncate('../ConsoleClient/Moderation/Cfs.txt', 0, function(){});
				}, 5000);
			}
			
			//------------------------------------------------------------------------------------------------------------------------------------
			
			else 
			{
			 message.reply("** please put a valid argument** - *(money, claims, access, invites, cfs, promote)*");
			}
		}

		else 
		{
                message.channel.send("*I'm Sorry* " + message.author + " *but you do not have permission to use this command, please contact your faction leader about it*");

        }
	}

	//------------------------------------------------------------------------------------------------------------------------------------
		
	else if (message.content.startsWith(prefix + 'info')) //you can change command name here - not recommended but you can :) 
	{
        const infoembed = new Discord.RichEmbed()
            .setColor(0xe580ff)
            .setTimestamp()
            .setTitle('Server Information!')
            .addField('The discord server was created on: ', message.guild.createdAt)
            .addField('Member count: ', message.guild.memberCount)
            .addField('The owner of this discord is ', message.guild.owner)
            .addField('Server location:', message.guild.region)
            .addField('The afk timeout is ', message.guild.afkTimeout)
			.addField('This Discord Bot Was Created By: ', 'nathenisSocool
			.addField('Info', 'This is a Factions Moderation Bot')
            .setURL("")
        message.channel.sendEmbed(infoembed)
	} 
	
	//------------------------------------------------------------------------------------------------------------------------------------
	
	else if (message.content.startsWith(prefix + 'toggle')) //you can change command name here - not recommended but you can :) 
	{
	if(message.member.roles.find("name", role))
	{
       if (args[0] === "outpost")
	   {
		if (args[1] === "true")
		{
			 OutpostEnabled = true;
			 message.reply("Outpost Moderation Turned On");
		}
		else if (args[1] === "false")
		{
			 OutpostEnabled = false;
			 message.reply("Outpost Moderation Turned Off");
		}
			
	   }
	   else if (args[0] === "buffers")
	   {
		if (args[1] === "true")
		{
			 BufferEnabled = true;
			 message.reply("Buffer Moderation Turned On");
		}
		else if (args[1] === "false")
		{
			 BufferEnabled = false;
			 message.reply("Buffer Moderation Turned Off");
		}
	   }
	   else if (args[0] === "list")
		{
			message.reply("\n" + "**Current Buffer Logs:** " + BufferEnabled + "\n" + "**Current Outpost Logs:** " + OutpostEnabled );
		}
	   else 
		{
			message.reply("** please put a valid argument** - *(buffers, outpost, list - true/false)*");
		}
	}
	else 
		{
                message.channel.send("*I'm Sorry* " + message.author + " *but you do not have permission to use this command, please contact your faction leader about it*");

        }
	} 
	
	//------------------------------------------------------------------------------------------------------------------------------------
	
	else if (message.content.startsWith(prefix + 'user')) //you can change command name here - not recommended but you can :) 
	{
	if(message.member.roles.find("name", role))
	{

		 if (args[0] === "add")
		 {
			
			fs.appendFileSync('../ConsoleClient/Console/whitelist.txt', args[1] + "\r\n", encoding='utf8')
			message.reply("Added user: " +  args[1] + " to whitelisted users.");
		 }

		 else if (args[0] === "list")
		 {
			var whitelist = fs.readFileSync('../ConsoleClient/Console/whitelist.txt', 'utf-8').split('\r\n');
			var whitelist2 = whitelist.toString();
			var whitelist3 = whitelist2.split(",").join("\n");
			
			const userembed = new Discord.RichEmbed()
				.setColor(0xe580ff)
                .setTimestamp()
                .setTitle('Faction Whitelisted Checkers')
                .addField('Whitelisted Users: ', "```" + whitelist3 + "```")
                .setURL("")
				message.channel.sendEmbed(userembed)   
		 }
		 else if (args[0] === "remove")
		 {
			var removal = fs.readFileSync('../ConsoleClient/Console/whitelist.txt', encoding='utf8')

			var removal2 = removal.toString()
			var removal3 = removal2.replace(args[1], "");
			var removal4 = removal3.split(",").join("\n")
			message.reply("Removed user: " +  args[1] + " from whitelisted users.");
			
			fs.writeFileSync('../ConsoleClient/Console/whitelist.txt', removal4 + "\r\n", encoding='utf8')
		 }
		 else 
		{
			message.reply("** please put a valid argument** - *(add, list, remove - PlayerName)*");
		}
	
		
	}
	else 
		{
                message.channel.send("*I'm Sorry* " + message.author + " *but you do not have permission to use this command, please contact your faction leader about it*");

        }
	}
	

	//------------------------------------------------------------------------------------------------------------------------------------
	
	else if (message.content.startsWith(prefix + 'help')) //you can change command name here - not recommended but you can :) 
	{
        const helpembed = new Discord.RichEmbed()
            .setColor(0xe580ff)
            .setTimestamp()
            .setTitle('All bot commands.')
			.addField('/active', 'Shows Most Checkers')
			.addField('/bal', 'Shows Players Balance')
            .addField('/buffers:', ' Shows you the buffer info.')
			.addField('/checked:', 'Marks the buffers as checked.')
			.addField('/factions:', 'Shows watched Faction Logs| ' + role + ' Only')
			.addField('/ftop:', "Shows the Top Factions on the Planet!")
            .addField('/help:', 'Shows this.')
			.addField('/info:', ' Shows the discord server info.')
			.addField('/logs:', 'Shows Moderation Logs| ' + role + ' Only')
			.addField('/outpost:', 'Shows Outpost Status')
			.addField('/seen:', 'Shows Player Log Info')
			.addField('/toggle:', 'Toggles alerts| ' + role + ' Only')
			.addField('/user:', 'Add / remove users from whitelist| ' + role + ' Only')
			.addField('/who:', 'Show /f Who')

            .setURL("")
        message.channel.sendEmbed(helpembed)
    }   
});
bot.login(token);
