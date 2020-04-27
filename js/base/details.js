//Useless stub. Intended for use for an eventual gjs port.

var details = {
	version: '0.1.0',
	release: 'beta',
	website: 'NA'
}

details.v = function() {
	console.log("Version " + details.version + " (" + details.release + " release) \nTo check for updates, run details.update()");
}

details._getLatestVersion = function(){
	return '0.0.0'
}

details._compareVersions = function() {
	return false;
}

details.update = function() {
	console.log("Version " + details.version + " (" + details.release + " release)");
	console.log("Checking for updates...");
	var latest = details._getLatestVersion();
	if(details._compareVersions(details.version, latest)) {
		console.log("Version " + latest + " available!");
	} else {
		console.log("Latest Version.");
	}
}