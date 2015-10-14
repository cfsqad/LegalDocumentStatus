NFe Legal Document Status
===================

<a href="https://platform.telerik.com/#appbuilder/clone/https%3A%2F%2Fgithub.com%2Fcfsqad%2FLegalDocumentStatus" target="_blank"><img src="http://docs.telerik.com/platform/samples/images/try-in-appbuilder.png" alt="Try in AppBuilder" title="Try in AppBuilder" /></a>  <a href="https://github.com/cfsqad/LegalDocumentStatus" target="_blank"><img style="padding-left:20px" src="http://docs.telerik.com/platform/samples/images/get-github.png" alt="Get from GitHub" title="Get from GitHub"></a>

<a id="top"></a>
* [Overview](#overview)
* [Screenshots](#screenshots)
* [Instructions](#instructions)
* [Limitations](#limitations)

This sample shows you how to use the NFe Status app. It will scan a barcode then return if it is valid or not. Then the app will confirm if you would like to send an email out.

> *Supported mobile platforms:* Android, Windows Phone (untested)
>
> *Developed with:* Telerik Platform, Apache Cordova 3.7.0, BarcodeScanner 1.2.9

[Back to Top](#top)

# Screenshots
change the link and the image

Platform | Home
---|---
Android | ![](https://raw.githubusercontent.com/Icenium/sample-barcode-scanner/master/screenshots/home.jpg)

[Back to Top](#top)


# Install the NFe Status application

- [Run in the companion app.][companion]
- [Deploy on device via QR code.][QR code]<br>
or 
- In the Android settings make sure *Unknown sources* is enabled.
- Open *NFescanner.apk*
- Follow the steps on the screen to complete the installation.

[Back to Top](#top)

# Instructions

1. Install the application.
1. Click **Scan**.
1. Scan the NFe barcode for which you would like to have the status on.
1. Confirm the legal document number, it will be *valid* or *invalid*.
1. Click **OK** to notify the supplier via email or click **Cancel** to return to the main screen

[Back to Top](#top)

# Limitations

You cannot run this application in the device simulator or iOS.

[Back to Top](#top)

[companion]: http://docs.telerik.com/platform/appbuilder/testing-your-app/running-on-devices/run-companion/using-appbuilder-companion-app
[QR code]: http://docs.telerik.com/platform/appbuilder/testing-your-app/running-on-devices/deploy-remote
[emulators]: http://docs.telerik.com/platform/appbuilder/testing-your-app/running-in-emulators/native-emulators
