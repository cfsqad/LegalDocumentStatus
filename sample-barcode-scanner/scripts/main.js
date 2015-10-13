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
            var attributes = {
                "Recipients": [
                    "r3c@qad.com",
                    "cfs@qad.com"
                ],
                "Context": {
                    "LDNumber": "999999999999"
                }
            };            
            
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
            ldnumber = "";
        
        // Display Result
        if (message.length == 44) {
            ldnumber = message.substring(25, 34) + message.substring(22, 25);
            
            //Check NFe Key Code status
            switch (ldnumber)
            {
               case "748113081001": 
                   status = "authorized";
                   break;
                    
                case "000000313005":
                    status = "rejected";
                    break;

               default: 
                   status = "rejected";
                   break;
            }
            
			//Add result to app form
            message = ldnumber + "</br>Status: " + status;
            that._addMessageToLog("Legal Document Number: " + message);            
            
            //Ask user if wants to send e-mail to Supplier
            if (confirm("The Legal Document Number " + ldnumber + " is " + status + ". Notify Supplier?")){
                alert(status);
                //Send e-mail         
                if (status == "authorized"){          
                }
                else {
                }                                                     
            }                     
            
        } else {
            that._addMessageToLog("Incorrect code length: " + message.length);
        }
    },
    
    _callbackemail: function(error, result){
        alert('whatsuppp');        
    }
              
} 