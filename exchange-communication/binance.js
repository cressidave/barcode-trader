/* ----------------------------------------------------------------------------------------- */
//
//	BINANCE API CONNECTION
//  - Websocket
//  - REST 
//
//	
//
/* ----------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------- */
// 


/* ----------------------------------------------------------------------------------------- */
// REQUIRE MODULES	
/* ----------------------------------------------------------------------------------------- */
	
	// FETCH
	var request   = require('request');

	// LOG
	const log = require('../modules/log/log');

	// TIME
	const time = require('../modules/time/time');

	// CONFIG
	const config = require('../config.js');
	
	// WEBSOCKET
	const websocket = require('ws');

	// CRYPTO (For sha256 signing)
	var crypto = require('crypto');
	var querystring = require('querystring');

/* ----------------------------------------------------------------------------------------- */
// binanceConnect
/* ----------------------------------------------------------------------------------------- */
	

	var binanceConnect = { status: 'STOPPED' };
	binanceConnect.ws = null;


/* ----------------------------------------------------------------------------------------- */
// SETTINGS
/* ----------------------------------------------------------------------------------------- */

	binanceConnect.settings = {
		
		api_url: 'https://api.binance.com/api',
		listenKey: {}
		
	}

/* ----------------------------------------------------------------------------------------- */
// START / INIT
/* ----------------------------------------------------------------------------------------- */

	binanceConnect.start = function(pair){
		
		var self = this;
		
		
		if(this.status == 'STOPPED'){
			this.fetchListenKey(function(){
				self.status = 'LOADING';
				setTimeout( function(){ self.start(pair); }, 100);
			});
			return;
		}
		
		if(this.status == 'LOADING'){
			
			this.fetchOrderbook(pair, function(){
				self.status = 'STARTING';
				setTimeout( function(){ self.start(pair); }, 100);
			});
			return;
		}
		
		if(this.status == 'STARTING'){
			
			if(this.ws.readyState == 1){
				
				self.status = 'RUNNING';
				self.wsSubscribe(pair);
				return;
				
			}
			setTimeout( function(){ self.start(pair); }, 100);
		
			return;
		}
		

	}



/* ----------------------------------------------------------------------------------------- */
// DATA STORAGE
/* ----------------------------------------------------------------------------------------- */

	binanceConnect.data = {
		
		orderBooks: {},
		trades: {}
		
		
	}
	

/* ----------------------------------------------------------------------------------------- */
// TRADE / ORDER DATA
/* ----------------------------------------------------------------------------------------- */

	binanceConnect.orders = [];
	
	binanceConnect.addOrder = function(orderData){
		
		if(orderData.X == 'NEW'){
			this.orders.push({
				orderID: orderData.c,
				orderTime: orderData.E,
				orderRaw: orderData,
				orderStatus: 'OPEN',
				orderbooksnapshot: [ this.data.orderBooks[orderData.s].bids[0][0], this.data.orderBooks[orderData.s].bids[0][1]],
				estimatedPosition: { timeStart: time.unixMicroTimestamp(), start: this.data.orderBooks[orderData.s].bids[0][1], estimated: this.data.orderBooks[orderData.s].bids[0][1], completedtrades: 0 }
			});
			
			console.log(this.orders)
			
		}
						 
		
	}

	
	binanceConnect.checkOrders = function(orderBook, trade){

		// Find order
		for(let i = 0; i < this.orders.length; i++){
			
			if(typeof trade != 'undefined'){
				if(parseFloat(trade.p) == parseFloat(this.orders[i].orderbooksnapshot[0])){
					console.log(trade)
					this.orders[i].estimatedPosition.completedtrades += parseFloat(trade.q);
				}
			}
			
			
			if(this.data.orderBooks['VETBTC'].bids[0][1] < this.orders[i].estimatedPosition.estimated ){
				this.orders[i].estimatedPosition.estimated  = this.data.orderBooks['VETBTC'].bids[0][1];
			}
			
			log.send("TIMER: ", time.formatSeconds( (time.unixMicroTimestamp() - this.orders[i].estimatedPosition.timeStart) / 1000 ), "FgCyan", 'refresh');	
			log.send("ORDER BOOK AT OPEN: ", this.orders[i].estimatedPosition.start * this.orders[i].orderbooksnapshot[0]  , "FgGreen", );	
			log.send("ESTIMATED POSITION: ", (this.orders[i].estimatedPosition.estimated * this.orders[i].orderbooksnapshot[0]) - (this.orders[i].estimatedPosition.completedtrades *  this.orders[i].orderbooksnapshot[0]) , "FgGreen");
			log.send("TRADES TOTAL: ", (this.orders[i].estimatedPosition.completedtrades *  this.orders[i].orderbooksnapshot[0]) , "FgGreen");
			log.send("CURRENT ORDERBOOK: ", this.data.orderBooks['VETBTC'].bids[0][1] * this.data.orderBooks['VETBTC'].bids[0][0], "FgGreen", );	
			
		}
		
	}
	
	
/* ----------------------------------------------------------------------------------------- */
// UPDATE ORDER BOOK
/* ----------------------------------------------------------------------------------------- */

	binanceConnect.updateOrderbook = function(data){
			
		var tk = data.s;
		this.data.orderBooks[tk].lastUpdate = data.u;
		
		for(let i = 0; i < data.b.length; i++){
			
			var price 	= data.b[i][0];
			var qty 	= data.b[i][1];
			
			// Update bids
			for(let n = 0; n < this.data.orderBooks[tk]['bids'].length; n++){
				if(this.data.orderBooks[tk]['bids'][n][0] ==  price){
					this.data.orderBooks[tk]['bids'][n][1] =  qty;
					break;
				}
			}
			
						
		}
		
		for(let i = 0; i < data.a.length; i++){
			
			var price 	= data.a[i][0];
			var qty 	= data.a[i][1];
			
			// Update bids
			for(let n = 0; n < this.data.orderBooks[tk]['asks'].length; n++){
				if(this.data.orderBooks[tk]['asks'][n][0] ==  price){
					this.data.orderBooks[tk]['asks'][n][1] =  qty;
					break;
				}
			}
			
						
		}
		
		
	}

	binanceConnect.printOrderbook = function(pair){
		return;
		log.send("ORDER BOOK", this.data.orderBooks['VETBTC'].lastUpdate, "FgCyan", 'refresh');	
		
		for(let i = 0; i < 10; i++){
			log.send("BID", this.data.orderBooks['VETBTC'].bids[i][0] +' - '+ this.data.orderBooks['VETBTC'].bids[i][1] , "FgGreen");	
		}
		for(let i = 0; i < 10; i++){
			log.send("ASK", this.data.orderBooks['VETBTC'].asks[i][0]+' - '+ this.data.orderBooks['VETBTC'].asks[i][1] , "FgRed");	
		}
		
	}

/* ----------------------------------------------------------------------------------------- */
// WEBSOCKET
/* ----------------------------------------------------------------------------------------- */

	binanceConnect.wsConnect = function(){
		
		var self = this;
		
		this.ws = new websocket('wss://stream.binance.com:9443/stream?streams='+this.settings.listenKey.key);

		this.ws.on('message', function incoming(data) {
	
			
			var inData = JSON.parse(data);
			
			if(typeof inData.data == 'undefined'){
				return;
			}
			
			switch(inData.data.e){
					
				case 'depthUpdate':
					self.updateOrderbook(inData.data)
					self.checkOrders(inData.data);
					self.printOrderbook();
				break;
					
				case 'trade':
					self.checkOrders(null, inData.data);
				break;
				
				
				case 'executionReport':
					self.addOrder(inData.data);
				break;
				
			}
			
		});

		this.ws.on('ping', function incoming(data) {
			
		});
		
	}
	
	binanceConnect.wsSubscribe = function(pair){
		
		var self = this;
		
		
		this.ws.send(
			JSON.stringify({
			  "method": "SUBSCRIBE",
			  "params": [
				pair.toLowerCase()+'@depth',
				pair.toLowerCase()+'@trade'
			  ],
			  "id": 1
			})
		);
		
	}
	
/* ----------------------------------------------------------------------------------------- */
// FETCH FULL ORDER BOOK FROM BINANCE
/* ----------------------------------------------------------------------------------------- */

	// Set Request URL
	binanceConnect.fetchOrderbook = function(pair, callback){

		var self = this;
		
		var url = this.settings.api_url + '/v1/depth?limit=100&symbol='+pair;
		
		var options = { url: url, timeout: 30000 };
		
		request( options, function(error, response, body){ // RETURN DATA
			
			// ERROR
			if(error){
				log.send('BINANCE CONNECT', 'ERROR ON ORDERBOOK FETCH', 'FgRed');
				return;
			}
		
			// PROCESS RESPONSE
			if(response.statusCode == 200){
				log.send('BINANCE CONNECT', 'FETCHING ORDERBOOK '+pair, 'FgCyan');
				
				var orderbook  = JSON.parse(body);
				self.data.orderBooks[pair] = { lastUpdate: orderbook.lastUpdateId, bids: orderbook.bids, asks: orderbook.asks };			
				
				callback();
				
			}else{
				
				// status cose != 200
				log.send('BINANCE CONNECT', 'URL: '+options.url , 'FgRed');
				log.send('BINANCE CONNECT', 'Response: '+response.statusCode , 'FgRed');
				
			}
			
		
		});
				
	}


/* ----------------------------------------------------------------------------------------- */
// 	GET LISTEN KEY
/* ----------------------------------------------------------------------------------------- */

	binanceConnect.fetchListenKey = function(callback){
		
		var self = this;
		
		
		// Set Request URL
		var url = this.settings.api_url + '/v3/userDataStream';
	
		// Set options
		options = { url: url, timeout: 30000, headers: { 'X-MBX-APIKEY': config.binance.key  }, method: 'POST' }
		
		request( options, function(error, response, body){ // RETURN DATA
			
			// ERROR
			if(error){
				log.send('BINANCE CONNECT', 'ERROR ON FETCHING LISTEN KEY', 'FgRed');
				return;
			}
		
			// PROCESS RESPONSE
			if(response.statusCode == 200){
				
				var data = JSON.parse(body);
				
				log.send('BINANCE CONNECT', 'FETCHING LISTEN KEY', 'FgCyan');
				//log.send('BINANCE CONNECT', data.listenKey , 'FgCyan');
				
				self.settings.listenKey = { time: Date.now(), key: data.listenKey  };
				self.wsConnect();
				callback();
				
			}else{
				
				// status cose != 200
				log.send('BINANCE CONNECT', 'ERROR ON FETCHING LISTEN KEY: STATUS CODE - '+response.statusCode, 'FgRed');
				
			}
			
		
		});
		
	}
	
/* ----------------------------------------------------------------------------------------- */
// 	AUTH REQUEST
/* ----------------------------------------------------------------------------------------- */

	function signRequest(params){
		
		
		if(typeof params == 'string' || params instanceof String){
			params = params;
		}else{
			params = querystring.stringify(params)
		}
		
		let signature = crypto.createHmac('sha256', config.binance.secret ).update( params ).digest('hex');
		
		return signature;
		
	}

	

/* ----------------------------------------------------------------------------------------- */
// MODULE EXPORTS
/* ----------------------------------------------------------------------------------------- */

	module.exports = binanceConnect;
	

