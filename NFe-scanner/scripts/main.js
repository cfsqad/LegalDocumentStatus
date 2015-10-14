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
     
    run: function() {
        var that = this,
        scanButton = document.getElementById("scanButton");
        
        that.resultsField = document.getElementById("result");
        
        scanButton.addEventListener("click",
                                    function() { 
                                        that._scan.call(that); 
                                    });
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
        var that = this,
            status = "",
            suggestedcontent = "",
            ldnumber = "",
            messagetext = "",
            issuedate = "",
        	state = "",
            fedtaxid = "";
        
        // Display Result
        if (message.length == 44) {
            ldnumber = message.substring(25, 34) + message.substring(22, 25);
            state = "State: Sao Paulo"; /* 35 = Sao Paulo */
            issuedate = "Issue Date: " + message.substring(4, 6)  + "/20" + message.substring(2, 4);
            fedtaxid = "Federal Tax Id: " + message.substring(6, 8) + "." + message.substring(8, 11) + "."
                						  + message.substring(11, 14) + "/" +  message.substring(14, 18) + "-"
                						  + message.substring(18, 20);
            
            //Check NFe Key Code status
            switch (ldnumber)
            {
				case "748113081001": 
               		status = "valid";
                    message = "Legal Document Number " + ldnumber + " is valid.";
					messagetext = "Legal Document Number " + ldnumber + " is valid. Notify supplier?";             		
				break;
                    
                case "000013060002": 
               		status = "valid";
                    message = "Legal Document Number " + ldnumber + " is valid.";
					messagetext = "Legal Document Number " + ldnumber + " is valid. Notify supplier?";             		
				break;
                    
                case "000013058002": 
               		status = "valid";
                    message = "Legal Document Number " + ldnumber + " is valid.";
					messagetext = "Legal Document Number " + ldnumber + " is valid. Notify supplier?";             		
				break;
                    
                case "000000313005":
                	status = "invalid";
                    message = "Legal Document Number " + ldnumber + " is invalid. Goods will be returned."; 
                    messagetext = "Legal Document Number " + ldnumber + " is invalid. Goods will be returned. Notify supplier?";
                break;
                    
                case "000013054002":
                	status = "invalid";
                    message = "Legal Document Number " + ldnumber + " is invalid. Goods will be returned."; 
                    messagetext = "Legal Document Number " + ldnumber + " is invalid. Goods will be returned. Notify supplier?";
                break;
                    
                case "000013055002":
                	status = "invalid";
                    message = "Legal Document Number " + ldnumber + " is invalid. Goods will be returned."; 
                    messagetext = "Legal Document Number " + ldnumber + " is invalid. Goods will be returned. Notify supplier?";
                break;
                    
                case "000013053002":
                	status = "invalid";
                    message = "Legal Document Number " + ldnumber + " is invalid. Goods will be returned."; 
                    messagetext = "Legal Document Number " + ldnumber + " is invalid. Goods will be returned. Notify supplier?";
                break;

				default: 
					status = "invalid";
					message = "Legal Document Number " + ldnumber + " is invalid."; 
                	messagetext = "Legal Document Number " + ldnumber + " is invalid. Goods will be returned. Notify supplier?";
				break;
            }
            
            if (status == "valid") {
                message = message + " <img src='images/valid.png'>";
            }
            else {
                message = message + " <img src='images/invalid.png'>";
            }
            
            message = message + "</br>" + 
                	  state + "</br>" + 
                	  issuedate + "</br>" +
                	  fedtaxid;
            
			//Add result to app form
            that._addMessageToLog(message);            
            
            //Ask user if wants to send e-mail to Supplier
            if (confirm(messagetext)){
               var attributes = {
                    "Recipients": [
                        "r3c@qad.com",
                        "cfs@qad.com",
                        "s7j@qad.com",
                        "j4t@qad.com",
                        "j6c@qad.com",
                        "dtl@qad.com",
                        "eho@qad.com"
                    ],
                    "Context": {
                        "LDNumber": ldnumber,
                        "State": state,
            			"IssueDate": issuedate,
                        "FEDTaxId": fedtaxid
                    }
                };            
                
                //Send e-mail         
                if (status == "valid"){      
                    $.ajax({
                        type: "POST",
                        url: 'http://api.everlive.com/v1/Metadata/Applications/GmDv3k6UQsrnHvq2/EmailTemplates/dde2b7d0-71f4-11e5-ae63-a5b944c54feb/send',
                        contentType: "application/json",
                        headers: {
                            "Authorization": "Masterkey itFsrDpZa8V0Z0wMQJrUjcLgRzFVSBIz"
                        },
                        data: JSON.stringify(attributes),
                        success: function(data) {
                            alert("Email successfully sent.");
                        },
                        error: function(error) {
                            alert(JSON.stringify(error));
                        }
                    });                    
                }
                else {      
                    $.ajax({
                        type: "POST",
                        url: 'http://api.everlive.com/v1/Metadata/Applications/GmDv3k6UQsrnHvq2/EmailTemplates/03b68e50-71f5-11e5-9c22-e7bf3c0cfb38/send',
                        contentType: "application/json",
                        headers: {
                            "Authorization": "Masterkey itFsrDpZa8V0Z0wMQJrUjcLgRzFVSBIz"
                        },
                        data: JSON.stringify(attributes),
                        success: function(data) {
                            alert("Email successfully sent.");
                        },
                        error: function(error) {
                            alert(JSON.stringify(error));
                        }
                    });                     
                }                                                     
            }                     
            
        } else {
            that._addMessageToLog("Incorrect code length: " + message.length);
        }
    },                  
} 