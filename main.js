
/* ----------------------------------------------------------------------------------------- */
//
//	MAIN
//
//
//
//	
//
/* ----------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------- */


/* ----------------------------------------------------------------------------------------- */
// REQUIRE MODULES	
/* ----------------------------------------------------------------------------------------- */
	
	// LOG
	const log = require('./modules/log/log');
	
	// TIME
	const time = require('./modules/time/time');
	
	// BIANCE
	const binance = require('./exchange-communication/binance.js');
		
	// WEBSOCKET
	//const ws = require('./view/socket/socket')
	
/* ----------------------------------------------------------------------------------------- */
// START UP
/* ----------------------------------------------------------------------------------------- */
	

	console.clear();
	log.break();
	log.send("MAIN", "STARTING SYSTEM", "FgCyan")
	
	// Start Binance 
	binance.start('VETBTC');

	



/* ----------------------------------------------------------------------------------------- */
// END
/* ----------------------------------------------------------------------------------------- */

	