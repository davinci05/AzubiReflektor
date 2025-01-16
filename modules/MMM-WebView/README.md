# Module: MMM-Webview
IFrames have some security issues (depending on the url used). The [webview](https://github.com/electron/electron/blob/master/docs/api/webview-tag.md), however, does not suffer from these problems as it is rendered separately. So you get iframe behavior in a secure way.  There are several quirks associated with using the webview, but most of these can be overcome, and your MagicMirror will render those pages that could not be rendered using an IFRAME.

## Setting up to use this Module
There are a 3 things you will need to do in your overall configuration so you can then render these webview(s).
1. ***Electron version 3.0.0+***
MagicMirror (at the time of this writing) runs with a much older version of Electron. This version did not result in proper renderings of certain modules with webview modules when applying the electron options settings (next bullet). Here is how you would change your MagicMirror to use this version of electron:
	- go to your MagicMirror installation directory
	- remove `rm -rf node_modules` the node_modules directory. This will take a long time, so be patient.
	- remove `rm package-lock.json` the package lock file.
	- edit the `package.json` file.
		- search for `"electron": "^2.0.0",`
		- replace it with `"electron": "^3.0.0",`
		- save the file
	- now reinstall the packages for your MagicMirror: `npm install` This will also take a long time.
	- DONE
2. ***Electron Options***
Referring to the [MagicMirror Configuration](https://github.com/MichMich/MagicMirror#configuration), you will need to add the `nodeIntegration: true` to `electronOptions`.  I am uncertain why this is needed (I have plenty of educated guesses), but if this value is false, things don't render.
````javascript
	electronOptions: {
	/*  Note: MagicMirror uses Object.assign() to 'override' its defaults. In order to ensure
	    you get the defaults for webPreferences along with your 'override' you must fully define 
	    webPreferences to have all the MagicMirror defaults along with your override (nodeIntegration).
	    Thankfully, MagicMirror's default for webPreferences is zoomFactor: 1
	    and we are overriding the other default nodeIntegration
	*/
		webPreferences: {
			zoomFactor: 1, // default is actually zoomFactor: config.zoom, and zoom's default is 1.
			nodeIntegration: true, 
				// the default for this is false. we are overriding this. While it is a security concern,
				// the webview operates with nodeIntegration: false, 
				// and this specific use case is controlled by the person configuring it.
	},
````
3. ***Custom CSS***
This is a kinda optional. Things do render without it, but the sizing is all crap. Basically what I am saying here is use CSS to style your webview; do not use the webview inline style. There are PLENTY of references/complaints online about how the webview isn't rendering fully as specified in the inline style. I wanted my entire screen to render as the webview. I finally came across a [reference](https://github.com/electron/electron/issues/8277) that presented a solution that actually worked (I hate css). This CSS did the trick; put this in your MagicMirror custom css `css/custom.css`.
````css
webview {
  position: absolute;
  top: 0;
  left: 0;
  width: 90%;
  height: 100%;
  margin: 0 0 0 2em;
  display: inline-flex;
}
````
I did some adjustments based on the page I was loading as in my application the rendered webview was 'too wide' and then shifted too much to the left.

## Using the module
This module is simple. It basically creates and configures the webview element to have a src obtained by calling the configured `getURL()` function, and all its styling is obtained from the aforementioned ***custom css*** class. I have chosen not to expose the other *many* webview options as some are ill-advised, and others are problemmatic; css class definition approach has so far proven to be the most consistent.

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
{
	module: 'MMM-Webview',
	position: 'bottom_bar',	// This can be any of the regions.
	config: {
		updateInterval: 30 * 1000, // rebuild the webview every 30 seconds
		getURL: () => "http://magicmirror.builders/",
		cssClassname: 'yourWebviewCSSDefinitionName',
	}
}
````

## Configuration options

The following properties can be configured:
<table width="100%">
	<tr>
		<th>Option</th>
		<th width="100%">Description</th>
	</tr>
	<tr>
		<td><code>updateInterval</code></td>
		<td>the update internal for the webview.<br>
			<br><b>Example for 30 seconds:</b><code>30 * 1000</code>
			<br><b>Default value:</b> <code>"0"</code> (never update; except based on module lifecycle)
		</td>
	</tr>	
	<tr>
		<td><code>getURL</code></td>
		<td>Function that returns the URL used as webview src attribute<br>
			<br><b>Default value:</b> <code>() => "http://magicmirror.builders/"</code>
		</td>
	</tr>		
	<tr>
		<td><code>cssClassname</code></td>
		<td>The name of the css definition for this webview.<br>
			If you created a CSS class definition in ***Custom CSS*** setup step above<br>
			and its name is not `webview`, and you would like to use it for this webview<br>
			you should provide that name for this option<br>
			<br><b>Default value:</b> <code>'webview'</code> (no actual assignment as the element name matches the css class name)
			<br><b>Example using css class definition `.webviewFullscreen`:</b><code>'.webviewFullscreen'</code>
			<UL>
<LI>custom.css

````javascript
.webviewFullscreen {
  position: absolute;
  top: 0;
  left: 0;
  width: 90%;
  height: 100%;
  margin: 0 0 0 2em;
  display: inline-flex;
}
````
</LI><LI>config.js:

````javascript
{
	module: 'MMM-Webview',
	position: 'bottom_bar',	// This can be any of the regions.
	config: {
		getURL: () => "http://magicmirror.builders/",
		cssClassname: 'webviewFullscreen', // note: drop leading '.' from definition above
	}
}
````
		
</LI></UL>
		</td>
	</tr>		
</table>

## Known Issues
- The webviews rendered by this module in MagicMirror only render in the electron browser (used by MagicMirror). I have not been able to remotely render these views in Chrome or Firefox when 'browsing' to my MagicMirror server. Many online comments indicate that webview is also considered a potential security risk (which I've waived as I control my internal mirror). I am certain, however, that you could start chrome or firefox up in a way (command line args) so as to then browse and see these webviews. As a rule I don't like to have my solutions require some hokey browser setting, but for a dumb page on a R-Pi for personal use.. I don't care.
