document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    navigator.splashscreen.hide();
    var app = new App();
    app.run();
}

function App() {
}

App.prototype = {
    resultsField: null,
	fileSystemHelper: null,
     
    run: function() {
        var that = this,
        scanButton = document.getElementById("scanButton");
        
        that.resultsField = document.getElementById("result");
        
        scanButton.addEventListener("click",
                                    function() { 
                                        that._scan.call(that); 
                                    });
		fileSystemHelper = new FileSystemHelper();
    },
    
    _scan: function() {
        var that = this;
        if (window.navigator.simulator === true) {             
            alert("Not Supported in Simulator.");
        }
        else {
            cordova.plugins.barcodeScanner.scan(
                function(result) {
                    if (!result.cancelled) {
                        //that._addMessageToLog(result.format + " | " + result.text);    
                        that._parseLegalDocNumber(result.text);
                    }
                }, 
                function(error) {
                    console.log("Scanning failed: " + error);
                },
				// options object
    			{
        			"preferFrontCamera" : false,
        			"showFlipCameraButton" : true,
                    "formats" : "CODE_128" // for Android Only, we can set what barcode type is being read
    			});
        }
    },

    _addMessageToLog: function(message) {
        var that = this,
        currentMessage = that.resultsField.innerHTML;
        
        that.resultsField.innerHTML = message + '<br />'; 
    },
    
    _parseLegalDocNumber: function (message) {
        var that = this;        
        
        // Display Result
        if (message.length == 44) {
			that._createAndSendFile(message);
            message = message.substring(25, 34) + message.substring(22, 25);
            that._addMessageToLog("Legal Document Number: " + message);
        } else {
            that._addMessageToLog("Incorrect code length: " + message.length);
        }
    },
    
    _createAndSendFile: function (message){
        var that = this;
        var filecontent;
        var filename;
        var dataURI;
        
        filecontent = '<?xml version="1.0" encoding="UTF-8" ?>' + 
        			  '<soap12:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' + 
            		  '<soap12:Header>' +
        			  '<nfeCabecMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NfeConsulta2">' +
                      '<cUF>35</cUF>' +
            		  '<versaoDados>3.10</versaoDados>' +
            		  '</nfeCabecMsg>' +
            		  '</soap12:Header>' +
            		  '<soap12:Body>' +
            		  '<nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NfeConsulta2">' +
            		  '<consSitNFe versao="3.10" xmlns="http://www.portalfiscal.inf.br/nfe">' +
            	      '<tpAmb>2</tpAmb>' +
            	      '<xServ>CONSULTAR</xServ>' +
            		  '<chNFe>' + message + '</chNFe>' +
            	      '</consSitNFe>' +
            		  '</nfeDadosMsg>' +
            		  '</soap12:Body>' +
            		  '</soap12:Envelope>';
        
        filename = message + ".xml";        
        //fileSystemHelper.deleteFile(filename, that._onSuccess, that._onError);
		fileSystemHelper.writeLine(filename, filecontent, that._onSuccess(filename), that._onError);
        
    },
    
	_onSuccess: function(filename) {     
        
        //If file creation was succesful, then transmit file to SEFAZ
        var that = this,
        	options = new FileUploadOptions(),     
            fileURI = filename,
            filePath = "",
			up = new FileTransfer();
        
		alert("File created: " + filename);          
        
        options.fileKey = filename;       
        options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);        
        options.mimeType = "application/xml";
        options.params = {}; // if we need to send parameters to the server request 
        //options.headers = {
          //  Connection: "Close"
        //};        
		options.chunkedMode = false;        

        up.upload(
            fileURI,
            encodeURI("http://www.portalfiscal.inf.br/nfe/wsdl/NfeConsulta2"),
            that._onFileUploadSuccess,
            that._onFileTransferFail,
            options);           
        
	},
    
	_onError: function(error) {
        //file creation error
		alert(error.message);
	}, 
    
    _onFileUploadSucces: function(){
        alert("File sent!");
    },
    
    _onFileTransferFail: function(error){
        //file transfer error
        alert(error.code + " " + error.source + " " + error.target);
    }
              
} 