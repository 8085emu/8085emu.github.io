var loader = {

}

loader.__testObject = JSON.parse('{"list":{"F000":"31","F001":"00","F002":"FF","F003":"3A","F004":"00","F005":"F5","F006":"B7","F007":"47","F008":"21","F009":"01","F00A":"00","F00B":"48","F00C":"CD","F00F":"05","F010":"C2","F011":"0B","F012":"F0","F013":"22","F014":"50","F015":"F5","F016":"CF","F017":"76","F018":"21","F019":"01","F01A":"00","F01B":"22","F01C":"50","F01D":"F5","F01E":"CF","F01F":"76","F020":"0D","F021":"C2","F024":"C9","F025":"54","F026":"5D","F027":"19","F028":"0D","F029":"C2","F02A":"27","F02B":"F0","F02C":"C9","F00D":"20","F00E":"F0","F022":"25","F023":"F0"},"breakpoints":["F00F"]}');
loader.__testObject2 = JSON.parse('{"list":{"F000":"31","F001":"00","F002":"FF","F003":"3A","F004":"00","F005":"F5","F006":"21","F007":"50","F008":"F5","F009":"16","F00A":"64","F00B":"CD","F00E":"71","F00F":"23","F010":"16","F011":"0A","F012":"CD","F015":"71","F016":"23","F017":"77","F018":"CF","F019":"76","F100":"0E","F101":"FF","F102":"90","F103":"0C","F104":"D2","F105":"02","F106":"F1","F107":"82","F108":"C9","F00C":"00","F00D":"F1","F013":"00","F014":"F1"},"breakpoints":[]}');
loader.__testObject3 = JSON.parse('{"list":{"F000":"31","F001":"00","F002":"FF","F003":"3A","F004":"00","F005":"F5","F006":"21","F007":"50","F008":"F5","F009":"16","F00A":"64","F00B":"CD","F00E":"71","F00F":"23","F010":"16","F011":"0A","F012":"CD","F015":"71","F016":"23","F017":"77","F018":"CF","F019":"76","F100":"0E","F101":"FF","F102":"0C","F103":"92","F104":"D2","F105":"02","F106":"F1","F107":"82","F108":"C9","F00C":"00","F00D":"F1","F013":"00","F014":"F1"},"breakpoints":[]}');
loader.__testObject4 = JSON.parse('{"list":{"F500":"0A","F501":"49","F502":"52","F503":"68","F504":"79","F505":"53","F506":"56","F507":"24","F508":"16","F509":"35","F50A":"56","F000":"21","F001":"00","F002":"F5","F003":"AF","F004":"06","F005":"00","F006":"4E","F007":"23","F008":"86","F009":"27","F00A":"D2","F00D":"57","F00E":"78","F00F":"C6","F010":"01","F011":"27","F012":"47","F013":"7A","F014":"23","F015":"0D","F016":"C2","F017":"08","F018":"F0","F019":"21","F01A":"50","F01B":"F5","F01C":"77","F01D":"78","F01E":"23","F01F":"77","F020":"CF","F021":"76","F00B":"14","F00C":"F0"},"breakpoints":[]}');
/*
 Expects object with the following structure: 
  {
  	list: {
		    addr: val,
		    addr: val,
		    addr: val,
		    ...
		},
	breakpoints: [addr, addr, addr, ...]
  }
*/
loader.load = function (listingobj) {
	for(var location in listingobj.listing) {
		memory.writeAt(location, listingobj.listing[location]);
	}

	for(var location in listingobj.breakpoints) {
		breakpoints.addBreakpoint(listingobj.breakpoints[location]);
	}

	return true;
}

loader.extractAsByte = function () {
	var final = [];
	for(var i in memory.data) {
   		final.push(memory.data[i]);
	}
	return final;
}

window.addEventListener('load', (e) => {
	var url = window.location.href;

	if(url.indexOf('?codeString=') != -1) {
		var start = url.indexOf('?codeString=') + 12;
		window.location = window.origin + '/coder.html?codeString=' + url.slice(start);
		return;
	}

	if(url.indexOf('?listing=') == -1) {
		return;
	}
	
	var start = url.indexOf('?listing=') + 9;
	console.log("RECEIVED ", decodeURIComponent(url.slice(start)));
	var obj = JSON.parse(decodeURIComponent(url.slice(start)));
	loader.load(obj);

	document.querySelector('#assembler--button').style.display = "none";
	document.getElementById('load-code').classList.remove('hidden');
	window.setTimeout(()=>document.getElementById('load-code').classList.add('hidden'), 2000);
})