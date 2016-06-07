var http	=require('http')
,AlexaSkill =require('./AlexaSkill')
,APP_ID= 'amzn1.echo-sdk-ams.app.07380916-9868-486c-ba86-6ec4367ea99f';


var url=function(crime){
	if(crime=='violence')
		crime='domestic violence';
	else if(crime=='abuse')
		crime='animal abuse';
/*
	var options={
		hostname: 'http://nflarrest.com/api/v1/crime/topPlayers/',
		path: encodeURI(crime)
	};
*/
	
	return 'http://nflarrest.com/api/v1/crime/topPlayers/'+encodeURI(crime);
};

var getJsonFromNFL=function(crime, callback){
	http.get(url(crime), function(res){
		var body='';
		res.on('data', function(data){
			body+=data;
		});

		res.on('end', function(){
			var result=JSON.parse(body);
			callback(result);
		});

	}).on('error', function(e){
		console.log('Error: ' +e);
	});
};

var handleNextCrimeRequest= function(intent, session, response){
	getJsonFromNFL(intent.slots.crime.value, function(data){
		if(data[0].Name){
			var text=data[0].Name;
			var cardText = 'The highest person is '+text;
		}
		else{
			var text = 'Does not work';
			var cardtext=text;
		}
	var heading= 'Highest crime score for ' +intent.slots.crime.value;
	response.tellWithCard(text, heading, cardText);
	});
};

var NFLCrime=function(){
	AlexaSkill.call(this, APP_ID);
};


NFLCrime.prototype=Object.create(AlexaSkill.prototype);
NFLCrime.prototype.constructor=NFLCrime;
NFLCrime.prototype.eventHandlers.onLaunch=function(launchRequest, session, response){
	var output= "Welcome to NFL Crime, name a crime";
	var reprompt= "What crime would you like to know more about?";
	response.ask(output, reprompt);	
};


NFLCrime.prototype.intentHandlers={
	GetCrimeIntent: function(intent, session, response){
		handleNextCrimeRequest(intent, session, response);
	},
	HelpIntent: function(intent, session, response){
	var speech='learn about a crime';
	response.ask(speech);

	}
};


exports.handler =function(event, context){
	var skill= new NFLCrime();
	skill.execute(event, context);
};

