/* ----------------------------------------------------------------------------------------- */
//
//	LOG
//
//
//
//	
//
/* ----------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------- */


/* ----------------------------------------------------------------------------------------- */
// REQUIRED MODULES
/* ----------------------------------------------------------------------------------------- */

	const time = require('../time/time')
	
	
/* ----------------------------------------------------------------------------------------- */
// 
/* ----------------------------------------------------------------------------------------- */
	
	var log = {};
	

/* ----------------------------------------------------------------------------------------- */
// LOGGING
/* ----------------------------------------------------------------------------------------- */
	
	log.send = function(process, msg, color, refresh){
		
		
		if(typeof refresh != 'undefined'){
			console.clear();
		}
		
		color = getColor(color);

		console.log(color, "\x1b[2m", time.fetchTime() + " ", "\x1b[1m", process + ": " + msg + "\x1b[0m");
		
	}
	
	log.break = function(color){
		
		color = getColor(color);

		console.log( color, "*-------------------------------------------------------*", "\x1b[0m");
		
	}
	
	log.clear = function(){
		console.clear();
	}
	


/* ----------------------------------------------------------------------------------------- */
// getColor
/* ----------------------------------------------------------------------------------------- */
	
	function getColor(color){
		
		switch(color){
			
			case "Bright": 
				return "\x1b[1m"
			break;
			case "Dim": 
				return "\x1b[2m"
			break;
			case "Underscore": 
				return "\x1b[4m"
			break;
			case "Blink": 
				return "\x1b[5m"
			break;
			case "Reverse": 
				return "\x1b[7m"
			break;
			case "Hidden": 
				return "\x1b[8m"
			break;
			case "FgBlack": 
				return "\x1b[30m"
			break;
			case "FgRed": 
				return "\x1b[31m"
			break;	
			case "FgGreen":
				return "\x1b[32m"
			break;	
			case "FgYellow":
				return "\x1b[33m"
			break;	
			case "FgBlue": 
				return "\x1b[34m"
			break;	
			case "FgMagenta": 
				return "\x1b[35m"
			break;	
			case "FgCyan": 
				return "\x1b[36m"
			break;	
			case "FgWhite": 
				return "\x1b[37m"
			break;
			case "BgBlack": 
				return "\x1b[40m"
			break;	
			case "BgRed": 
				return "\x1b[41m"
			break;	
			case "BgGreen": 
				return "\x1b[42m"
			break;
			case "BgYellow": 
				return "\x1b[43m"
			break;	
			case "BgBlue": 
				return "\x1b[44m"
			break;	
			case "BgMagenta": 
				return "\x1b[45m"
			break;
			case "BgCyan": 
				return "\x1b[46m"
			break;
			case "BgWhite": 
				return "\x1b[47m"
			break;
				
			default:
				return "\x1b[0m"
				
		}
		
		
	}
	


/* ----------------------------------------------------------------------------------------- */
// EXPORT
/* ----------------------------------------------------------------------------------------- */

	module.exports = log;
	
