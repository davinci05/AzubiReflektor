/* Config Sample
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	address: "localhost",	// Address to listen on
	port: 8080,
	basePath: "/",
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses

	useHttps: false,
	httpsPrivateKey: "",
	httpsCertificate: "",

	language: "de",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{module: "clock",
			position: "top_left",
			config: {
				displayType:"analog",
				analogFace: "face-012",
				analogSize: "900px"
			}},
		{
			module: "clock",
			position: "top_left",
			config: {
				displaySeconds: false,
				showWeek: true,
				showSunTimes: true,
				lat: 51.002178,
				lon: 6.950610
			}
		},
		{
			module: "calendar",
			header: "Arbeitszeitbetrug",
			position: "top_left",
			config: {
				calendars: [
					{
						fetchInterval: 7 * 24 * 60 * 60 * 1000,
						symbol: "calendar-check",
						url: "https://ics.calendarlabs.com/56/e261b915/International_Holidays.ics"
					}
				]
			}
		},
		{
			module: "compliments",
			position: "lower_third"
		},
		{
			module: "MMM-DailyWeather",
			position: "top_right",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				lat: 40.776676,
				lon: -73.971321
			}
		},

		{
			module: "newsfeed",
			position: "middle_center",
			config: {

				feeds: [
					{
						title: "WDR Rheinland",
						url: "https://www1.wdr.de/nachrichten/rheinland/uebersicht-rheinland-100.feed"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true
			}
		},
		{
			module: "MMM-PublicTransportHafas",
			position: "top_right",

			config: {
				// Departures options
				stationID: "900000367",                   // Replace with your stationID!
				stationName: "Köln Niehl Geestemünder Str.", // Replace with your station name!
				direction: "",                    // Show only departures heading to this station. (A station ID.)
				excludedTransportationTypes: [],  // Which transportation types should not be shown on the mirror? (comma-separated list of types) possible values: "tram", "bus", "suburban", "subway", "regional" and "national"
				ignoredLines: [],                 // Which lines should be ignored? (comma-separated list of line names)
				timeToStation: 7,                // How long do you need to walk to the next Station?

				// Look and Feel
				displayLastUpdate: true,          // Display the last time of module update.
				maxUnreachableDepartures: 0,      // How many unreachable departures should be shown?
				maxReachableDepartures: 7,        // How many reachable departures should be shown?
				showColoredLineSymbols: true,     // Want colored line symbols?
				customLineStyles: "",             // Prefix for the name of the custom css file. ex: Leipzig-lines.css (case sensitive)
				showOnlyLineNumbers: false,       // Display only the line number instead of the complete name, i. e. "11" instead of "STR 11"
				showTableHeadersAsSymbols: true,  // Table Headers as symbols or text?
				useColorForRealtimeInfo: true     // Want colored real time information (timeToStation, early)?
			}
		},
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
