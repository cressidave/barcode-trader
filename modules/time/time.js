/* ----------------------------------------------------------------------------------------- */
//
//	Time functions
//
//
//
//	
//
/* ----------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------- */
// 
	
/* ----------------------------------------------------------------------------------------- */
// SYSTEM UPTIME
/* ----------------------------------------------------------------------------------------- */
	
    var timeStart = unixTimestamp();

	function uptime(){
		
		var timeNow = unixTimestamp();
		
        return formatSeconds(timeNow - timeStart);
        
	}


/* ----------------------------------------------------------------------------------------- */
// UNIX TTIME NOW
/* ----------------------------------------------------------------------------------------- */
	
	function unixTimestamp(){
		
		var timeNow = new Date();
		var timeNowUnix = parseInt(timeNow / 1000) ;
		
		
		return timeNowUnix;
	}


	function unixMicroTimestamp(){
		
		var timeNow = new Date();
		var timeNowUnix = parseInt(timeNow.getTime()) ;
		return timeNowUnix;
	}


/* ----------------------------------------------------------------------------------------- */
// DIFFERENCE BETWEEN 2 TIME STAMPS
/* ----------------------------------------------------------------------------------------- */

	function diff(t1, t2){
		
		return t2 - t1;
		
		
	}

/* ----------------------------------------------------------------------------------------- */
// GET TIME
/* ----------------------------------------------------------------------------------------- */
	
	function fetchTime(){
		
		var time = unix2time(unixTimestamp());
		
		return time;
		
	}


/* ----------------------------------------------------------------------------------------- */
// CONVERT TIME MODULE
/* ----------------------------------------------------------------------------------------- */
	
	function unix2time(timestamp){
		
		var t = new Date(timestamp * 1000);

		var year = t.getFullYear();
		var month = ("0" + (t.getMonth()+1)).slice(-2);
		var date = t.getDate();
		var hour = ("0" + t.getHours()).slice(-2);
		var min = ("0" + t.getMinutes()).slice(-2);
		var sec = ("0" + t.getSeconds()).slice(-2);
		var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec ;
		
		return time;
		
	}


/* ----------------------------------------------------------------------------------------- */
// CONVERT ISO TIME
/* ----------------------------------------------------------------------------------------- */
	
	function convertISO(ISO_time){
		
		var dateConvert = new Date(ISO_time);
		var timeNowUnix = parseInt( dateConvert.getTime() / 1000) ;
		
		
		return timeNowUnix;
	}


	
/* ----------------------------------------------------------------------------------------- */
// FORMAT SECONDS - HHH:MM:SS
/* ----------------------------------------------------------------------------------------- */

	function formatSeconds(seconds){
		
		var hours = parseInt(seconds / (60 * 60));
		var minutes = ("0" + parseInt((seconds / 60) % 60)).slice(-2);
		var seconds = ("0" + parseInt(seconds % 60)).slice(-2);
		
		return hours+":"+minutes+":"+seconds;
		
	}

/* ----------------------------------------------------------------------------------------- */
// MODULE EXPORTS
/* ----------------------------------------------------------------------------------------- */

	module.exports = {
		
		unixTimestamp: unixTimestamp,
		unixMicroTimestamp: unixMicroTimestamp,
		fetchTime: fetchTime,
		unix2time: unix2time,
		formatSeconds: formatSeconds,
		convertISO: convertISO,
        upTime: uptime,
		diff: diff
		
	};
	



	
