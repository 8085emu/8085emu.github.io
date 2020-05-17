var fileAtInput;
var isReadyForInput;
var autoIndent = true;
var undos = 0;
var revertCopy = '';

var finalCode = false;
var usingFlask = false;

var saveSettings = {
	dups: document.querySelector('#save-file--unroll-dup'),
	macros: document.querySelector('#save-file--expand-macro')
}

var preprocessorSettings = {
	master: document.querySelector('#preprocessor-view--isEnabled'),
	dup: document.querySelector('#preprocessor-view--isDup'),
	macro: document.querySelector('#preprocessor-view--isMacro'),
	macroMangle: document.querySelector('#preprocessor-view--isMangle'),
	detectLoop: document.querySelector('#preprocessor-view--isDetectLoop'),
	experimental: document.querySelector('#preprocessor-view--isExperimental'),
	controlProcess: document.querySelector('#preprocessor-view--doPreprocess'),
	controlRevert: document.querySelector('#preprocessor-view--doRevert')
};

var target = document.querySelector('#code-editor');

CodeMirror.defineSimpleMode("asm8085", {
	start: [
		{regex: /\b(ORG|EQU|IF|ELIF|ELSE|ENDIF|=|DUP|DEF|DEFARR|DDEF|BRK|brk|org|equ|if|elif|else|endif|=|dup|def|defarr|ddef|LXI|STAX|INX|INR|DCR|MVI|RAL|DAD|RIM|SHLD|DAA|SIM|STA|STC|MOV|HLT|ADD|ADC|SUB|SBB|ACI|ADI|ANA|ANI|CALL|CC|CM|CMA|CMC|CMP|CNC|CNZ|CP|CPE|CPI|CPO|CZ|DCX|DI|EI|IN|JC|JM|JMP|JNC|JNZ|JP|JPE|JPO|JZ|LDA|LDAX|LHLD|NOP|ORA|ORI|OUT|PCHL|POP|PUSH|RAR|RC|RET|RLC|RM|RNC|RNZ|RP|RPE|RPO|RRC|RST|RZ|SBI|SPHL|SUI|XCHG|XRA|XRI|XTHL|lxi|stax|inx|inr|dcr|mvi|ral|dad|rim|shld|daa|sim|sta|stc|mov|hlt|add|adc|sub|sbb|aci|adi|ana|ani|call|cc|cm|cma|cmc|cmp|cnc|cnz|cp|cpe|cpi|cpo|cz|dcx|di|ei|in|jc|jm|jmp|jnc|jnz|jp|jpe|jpo|jz|lda|ldax|lhld|nop|ora|ori|out|pchl|pop|push|rar|rc|ret|rlc|rm|rnc|rnz|rp|rpe|rpo|rrc|rst|rz|sbi|sphl|sui|xchg|xra|xri|xthl)\b/, token:"keyword"},
		{regex: /\b[0-9a-fA-F]+(H|h)?\b/, token:"number"},
		{regex: /\b([A-Ea-eHLhlMm]|SP|sp|PSW|psw)\b/, token: "number"},
		{regex: /\".*\"/, token: "variable"},
		{regex: /\'.*\'/, token: "variable"},
		{regex: /\#[^ ]*\b/, token: "number"},
		{regex: /\b\w+\b/, token:"normal"},
		{regex: /[\S\s]*\:/, token:"label", dedent:true},
		{regex: /\;[\s\S]*/, token: "comment"}
	],
	meta: {
		lineComment: ";",
	}
});

var editor = CodeMirror.fromTextArea(target, {
	indentUnit: 8,
	lineNumbers: true,
	firstLineNumber: 0,
	mode: "asm8085",
	theme: "material-darker",
	scrollbarStyle: "overlay"
});

editor.on("keydown", function(editorInstance) {
	var cursor = editor.getCursor();

	var currentLineNumber = cursor.line;
	var line = editor.getLine(currentLineNumber);
	var tokens = line.trim().split(/[\s,]+/);

	if(tokens.length <= 0 || !autoIndent)
		return;

	if(tokens[0].slice(-1) == ':'){
		length = tokens[0].slice(0,-1).length;
		editor.indentLine(currentLineNumber, -80);
		editor.indentLine(currentLineNumber, (8-length) < 0 ? 0 : (8-length));
	} else {
		editor.indentLine(currentLineNumber, -80);
		editor.indentLine(currentLineNumber, 10);

	}
});

function correctIndentation() {
	for(var i = 0; i < editor.doc.lineCount(); ++i) {
		var line = editor.getLine(i);
		var tokens = line.trim().split(/[\s,]+/);

		if(tokens.length <= 0)
			return;

		if(tokens[0].slice(-1) == ':'){
			length = tokens[0].slice(0,-1).length;
			editor.indentLine(i, -80);
			editor.indentLine(i, (8-length) < 0 ? 0 : (8-length));
		} else {
			editor.indentLine(i, -80);
			editor.indentLine(i, 10);
		}
	}
}

function showMenu(event) {
	document.querySelector('#more-menu').classList.remove('hidden');
	document.getElementById('modal-shade').classList.remove('hidden');


	var wrapperHM = function (e) {
		hideMenu();
		document.getElementById('modal-shade').classList.add('hidden');
		document.querySelector('#modal-shade').removeEventListener('click', wrapperHM);
	}

	document.querySelector('#modal-shade').addEventListener('click', wrapperHM);
}

function hideMenu(event) {
	document.querySelector('#more-menu').classList.add('hidden');
}

function hideModal(name) {
	console.log('hiding'+name);
	document.getElementById(name).classList.add('hidden');

}

function showModal(name) {
	console.log(name);
	document.getElementById(name).classList.remove('hidden');
	document.getElementById('modal-shade').classList.remove('hidden');

	if(name == 'open-file')
		readFile();

	if(name == 'save-file')
		document.querySelector('#save-file--warn').textContent = '';

	var wrapperHM = function(event) {
		hideModal(name);
		document.querySelector('#modal-shade').removeEventListener('click', wrapperHM);
		document.getElementById('modal-shade').classList.add('hidden');

		document.getElementById(name)
				.querySelector('.buttons > button:first-child')
				.removeEventListener('click', wrapperHM);

		document.getElementById(name)
				.querySelector('.header > span')
				.removeEventListener('click', wrapperHM);
	}

	document.querySelector('#modal-shade').addEventListener('click', wrapperHM);

	if(name == "helpModal") {
		document.getElementById(name)
				.querySelector('.buttons > button:last-child')
				.addEventListener('click', wrapperHM);

		document.getElementById(name)
				.querySelector('.buttons > button:first-child')
				.addEventListener('click', function(e) {
					var a = document.createElement('a');
					a.href = "mailto:therealrdas@gmail.com?subject=NEUTRINO%20Help%20Needed&body=Enter%20your%20query%20here%3A%0A";
					a.target = "_blank";
					a.click();
					console.log("dundun")
				});

		document.getElementById(name)
				.querySelector('.header > span')
				.addEventListener('click', wrapperHM);
	} else {
		document.getElementById(name)
				.querySelector('.buttons > button:first-child')
				.addEventListener('click', wrapperHM);

		document.getElementById(name)
				.querySelector('.header > span')
				.addEventListener('click', wrapperHM);
	}
}

function readFile(event) {
	document.querySelector('#open-file--warn').textContent = '';
	var file = event.target.files[0];
	var ext = file.name.split('.').slice(-1)[0];

	if(!['txt'].includes(ext)){
		document.querySelector('#toast').textContent = "Invalid file extension! Choose a file with .txt extension."
		document.getElementById('toast').classList.remove('hidden');
		window.setTimeout(()=>document.getElementById('toast').classList.add('hidden'), 4000);
		return;
	}

	var reader = new FileReader;
	reader.addEventListener('load', () => {
		fileAtInput = reader.result;
		console.log(fileAtInput, 'enabling...');
		document.querySelector('#open-file--submit-button').disabled = false;
		editor.doc.setValue(reader.result);
		flask.updateCode(reader.result);
	})
	reader.readAsText(file, 'UTF-8');
}

function initSearch(){
	editor.execCommand('find');
}

function goto(){
	editor.execCommand('jumpToLine');
}

function getSaverSettings() {
	return {
		dups: saveSettings.dups.checked,
		macros: saveSettings.macros.checked
	}
}

function saveFile() {
	document.querySelector('#save-file--warn').textContent = '';

	var name = document.querySelector('#save-file--filename').value;
	var ext = name.split('.').slice(-1)[0];

	if(!['txt'].includes(ext)) {
		document.querySelector('#save-file--warn').textContent = 'File Extension must be .txt, for compatibility.';
		return;
	}
	var copy;
	if(usingFlask)
		copy = flask.getCode();
	else
		copy = editor.doc.getValue();

	var settings = getPreprocessorSettings();
	var fileSaveSettings = getSaverSettings();

	setPreprocessorSettings({
		dups: fileSaveSettings.dups,
		macros: fileSaveSettings.macros,
		mangle: settings.mangle,
		detectLoop: settings.detectLoop,
		experimental: settings.experimental
	});
	compileCode(true);

	var toSave
	if(usingFlask)
		toSave = flask.getCode();
	else
		toSave = editor.doc.getValue();

	setPreprocessorSettings(settings);
	if(usingFlask)
		flask.updateCode(copy);
	else
		editor.doc.setValue(copy);

	var blob = new Blob([toSave], {type: 'text/plain;charset=utf-8'});
	saveAs(blob, name);
	document.querySelector('#modal-shade').click();
}

function newFile() {
	editor.doc.clearHistory();
	flask.updateCode('');
	document.querySelector('#modal-shade').click();
	editor.setValue('');
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function shareFile(e) {
	var _doc;
	
	if(usingFlask)
		_doc = flask.getCode();
	else
		_doc = editor.doc.getValue();

	if(navigator.share) {
		navigator.share({
			title: 'Neutrino 8085 Assembler',
			url: window.location.origin + '/redir.html?codeString=' + encodeURIComponent('"' + _doc + '"')
		})
	} else {
		copyTextToClipboard(window.location.origin + '/redir.html?codeString=' + encodeURIComponent('"' + _doc + '"'));
		document.querySelector('#toast').textContent = "Sharable link copied to clipboard!";
		document.querySelector('#toast').classList.remove('hidden');
		setTimeout( e => document.querySelector('#toast').classList.add('hidden'), 4000);
	}
}

function toggleAutoIndent() {
	document.querySelector('#autoindent-enable--button').classList.toggle('soft-disabled');
	autoIndent = !autoIndent;
}

function insertBreakpoint() {
	//https://stackoverflow.com/questions/22609868/how-to-add-new-line-programmatically-in-codemirror

	if(usingFlask) {
		flask.updateCode(flask.getCode() + '\nbrk');
		return;
	}

	var doc = editor.getDoc();
	var cursor = doc.getCursor(); // gets the line number in the cursor position
	var line = doc.getLine(cursor.line); // get the line contents
	var pos = { // create a new object to avoid mutation of the original selection
	    line: cursor.line,
	    ch: line.length // set the character position to the end of the line
	}
	doc.replaceRange('\n          BRK', pos); // adds a new line

}

function undo() {
	++undos;
	editor.doc.undo();
	if(undos > 0)
		document.getElementById('redo--button').classList.remove('disabled');
}

function redo() {
	if(undos == 0)
		return;
	--undos;
	editor.doc.redo();
	if(undos <= 0)
		document.getElementById('redo--button').classList.add('disabled');
}

document.querySelector('#more-menu--button').addEventListener('click', showMenu);

//File upload
document.querySelector('#open-file--button').addEventListener('click', e => document.querySelector('#file-uploader').click());
document.querySelector('#file-uploader').addEventListener('change', readFile);

//File save
document.querySelector('#save-file--button').addEventListener('click', (e) => showModal('save-file'));


document.querySelector('#new-file--button').addEventListener('click', (e) => showModal('new-file'));
document.querySelector('#open-file--submit-button').addEventListener('click', (e) => readFile());
document.querySelector('#save-file--submit-button').addEventListener('click', (e) => saveFile());
document.querySelector('#new-file--submit-button').addEventListener('click', (e) => newFile());

document.querySelector('#autoindent-enable--button').addEventListener('click', (e) => toggleAutoIndent());
document.querySelector('#indent-now--button').addEventListener('click', (e) => correctIndentation());
document.querySelector('#insert-breakpoint--button').addEventListener('click', (e) => insertBreakpoint());
document.querySelector('#assemble--button').addEventListener('click', (e) => compileCode(false));
document.querySelector('#emulate--button').addEventListener('click', (e) => window.open(goToRunner(encodeDocument()), 'Emulator', 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1200,height=600,left=100,top=100'))
document.querySelector('#undo--button').addEventListener('click', (e) => undo());
document.querySelector('#redo--button').addEventListener('click', (e) => redo());
document.querySelector('#search--button').addEventListener('click', (e) => initSearch());
document.querySelector('#goto--button').addEventListener('click', (e) => goto());
document.querySelector('#file-uploader').addEventListener('change', readFile);
document.querySelector('#share-file--button').addEventListener('click', shareFile);

document.querySelector('#help-modal--button').addEventListener('click', (e)=> {showModal('helpModal'); hideMenu()});
document.querySelector('#about--button').addEventListener('click', (e)=> {showModal('about'); hideMenu()});
document.querySelector('#bug-report--button').addEventListener('click', (e)=> {showModal('bug-report'); hideMenu()});
/*Panel funcs*/
function tabberShowPanel(panelName) {
	var panels = document.getElementsByClassName('tabber-view');
	for(var i = 0; i < panels.length; ++i)
		panels[i].classList.add('hidden');

	var tabs = document.getElementsByClassName('tabber-tabs--tab');
	for(var i = 0; i < tabs.length; ++i)
		tabs[i].classList.remove('active');

	console.log('tabber-view--'+panelName);
	document.getElementById('tabber-view--'+panelName).classList.remove('hidden');
	document.getElementById('tabber-tabs--'+panelName).classList.add('active');
}

function addError(err, line, hint){
	var lineNoShown = true, hintShown = true;
	if(line === undefined){
		lineNoShown = false;
	}
	if(hint === undefined) {
		hintShown = false;
	}

	var error = document.createElement('span');
	error.classList.add('tabber-view--log-err');
	var img = document.createElement('img');
	img.setAttribute('src', 'img/compiler/small-icons/err.png');
	img.classList.add("tabber-view--log-img", "disable-selection");
	error.appendChild(img);
	var body = document.createElement('span');
	body.classList.add('body');
	if(lineNoShown) {
		var lineNo = document.createElement('i');
		lineNo.textContent = line;
		lineNo.classList.add('tabber-view--log-linelink');
		lineNo.setAttribute('onclick', 'editor.setCursor('+line+',10); editor.focus();');
		body.appendChild(lineNo);
	}
	body.appendChild(document.createTextNode(err));
	if(hintShown) {
		var brk = document.createElement('br');
		body.appendChild(brk);
		body.appendChild(document.createTextNode(hint));
	}
	error.appendChild(body);
	document.querySelector('#tabber-view--logs').appendChild(error);
}

function addWarning(err, line, hint){
	var lineNoShown = true, hintShown = true;
	if(line === undefined){
		lineNoShown = false;
	}
	if(hint === undefined) {
		hintShown = false;
	}

	var error = document.createElement('span');
	error.classList.add('tabber-view--log-warn');
	var img = document.createElement('img');
	img.setAttribute('src', 'img/compiler/small-icons/warn.png');
	img.classList.add("tabber-view--log-img", "disable-selection");
	error.appendChild(img);
	var body = document.createElement('span');
	body.classList.add('body');
	if(lineNoShown) {
		var lineNo = document.createElement('i');
		lineNo.textContent = line;
		lineNo.classList.add('tabber-view--log-linelink');
		lineNo.setAttribute('onclick', 'editor.setCursor('+line+',11); editor.focus();');
		body.appendChild(lineNo);
	}
	body.appendChild(document.createTextNode(err));
	if(hintShown) {
		var brk = document.createElement('br');
		body.appendChild(brk);
		body.appendChild(document.createTextNode(hint));
	}
	error.appendChild(body);
	document.querySelector('#tabber-view--logs').appendChild(error);
}

function addLog(err, line){
	var lineNoShown = true, hintShown = true;
	if(line === undefined){
		lineNoShown = false;
	}

	var error = document.createElement('span');
	error.classList.add('tabber-view--log');

	if(lineNoShown) {
		var lineNo = document.createElement('i');
		lineNo.textContent = line;
		lineNo.classList.add('tabber-view--log-linelink');
		lineNo.setAttribute('onclick', 'editor.setCursor('+line+',11); editor.focus();');
		error.appendChild(lineNo);
	}

	error.appendChild(document.createTextNode(err));
	document.querySelector('#tabber-view--logs').appendChild(error);
}

function clearLogs() {
	document.querySelector('#tabber-view--logs').innerHTML = '';
}

/*Preprocessor Settings*/ 
document.getElementById('preprocessor-view--isEnabled').addEventListener('click', function (e) {
	if(preprocessorSettings.master.checked == false) {
		for(var i in preprocessorSettings) {
			if(!['master', 'experimental', 'controlRevert'].includes(i)) {
				preprocessorSettings[i].disabled = true;
			}
		}
	} else {
		for(var i in preprocessorSettings) {
			if(!['master', 'experimental', 'controlRevert', 'detectLoop'].includes(i)) {
				preprocessorSettings[i].disabled = false;
			}
		}
	}
});

document.getElementById('preprocessor-view--isMacro').addEventListener('click', function (e) {
	if(preprocessorSettings.macro.checked == false) {
		preprocessorSettings.macroMangle.disabled = true;
		preprocessorSettings.detectLoop.disabled = true;
	} else {
		preprocessorSettings.macroMangle.disabled = false;
		preprocessorSettings.detectLoop.disabled = false;
	}
})

function getPreprocessorSettings() {
	return {
		dups: preprocessorSettings.dup.checked,
		macros: preprocessorSettings.macro.checked,
		mangle: preprocessorSettings.macroMangle.checked,
		detectLoop: preprocessorSettings.detectLoop.checked,
		experimental: preprocessorSettings.experimental.checked
	}
}

function setPreprocessorSettings (preprocessorSettingsObject) {
	preprocessorSettings.dup.checked = preprocessorSettingsObject.dups;
	preprocessorSettings.macro.checked = preprocessorSettingsObject.macros;
	preprocessorSettings.macroMangle.checked = preprocessorSettingsObject.mangle;
	preprocessorSettings.detectLoop.checked = preprocessorSettingsObject.detectLoop;
	preprocessorSettings.experimental.checked = preprocessorSettingsObject.experimental;
}

function revert() {
	editor.doc.setValue(revertCopy);
	flask.updateCode(revertCopy);
	document.querySelector('#preprocessor-view--doRevert').disabled = true;
}

function compileCode(preOnly) {
	clearLogs();
	var onlyPreprocess;

	if(preOnly == undefined)
		onlyPreprocess = false;
	else
		onlyPreprocess = preOnly;

	if(onlyPreprocess == true)
		return

	var text;
	if(usingFlask)
 		text = flask.getCode();
 	else
		text = editor.getValue();
	var stateObject = assembler.compile(text);

	if(stateObject.errors.length == 0 && stateObject.warnings.length == 0)
		addLog('Finished assembly without any errors or warnings.');
	else if(stateObject.errors.length == 0 && stateObject.warnings.length != 0)
		addLog('Finished assembly, but with ' + stateObject.warnings.length + ' warning(s).');
	else if(stateObject.errors.length != 0)
		addLog('Could not assemble due to ' + stateObject.errors.length + ' error(s) and ' + stateObject.warnings.length + ' warning(s).');

	for(var i in stateObject.errors) {
		addError(mesg[stateObject.errors[i].body](stateObject.errors[i].at, stateObject.errors[i].context), stateObject.errors[i].at);
	}

	for(var i in stateObject.warnings) {
		addWarning(mesg[stateObject.warnings[i].body](stateObject.warnings[i].at, stateObject.warnings[i].context), stateObject.warnings[i].at);
	}


	if(stateObject.errors.length == 0) {
		finalCode = {
			listing: stateObject.listing,
			breakpoints: stateObject.breakPointTable
		};
	}

	var cwlisting = stateObject.cwlisting;
	var listing = stateObject.listing;
	var seenAddresses = [];

	if(stateObject.errors.length == 0) {
		var colors = ["#0DA1FE","#0BCBE6","#00FCD7","#0BE687","#0DFE51","#FC990D"];
		var colorI = 0;
		var totalListing = "<tr><th>Address</th><th>Data</th><th>Instruction</th></tr>";
		for(var i in cwlisting) {
			var str = "<tr><td rowspan=" + Object.keys(cwlisting[i].codes).length +
			" style=\"border-right-color: " + colors[colorI] +
			"; border-right-width: 2px; border-right-style: solid;\">" + cwlisting[i].line + "</td>";
			var first = true;
			for(var j in cwlisting[i].codes) {
				if(first) {
					first = !first; 
				} else {
					str += '<tr>';
				}
				str += '<td>' + j + '</td><td>' + cwlisting[i].codes[j] + '</td></tr>';
				seenAddresses.push(j);
			}
			totalListing += str;
			colorI = (colorI + 1) % colors.length;
		}
		for(var i in listing) {
			if(!(seenAddresses.includes(i))) {
				totalListing += '<tr><td>By <code>def<code>,<code>ddef<code> or <code>defarr<code></td><td>'+i+'</td><td>'+listing[i]+"</td></tr>";
			}
		}
		document.querySelector('#listing-table').innerHTML = totalListing;
		document.querySelector('#sidebar').classList.remove('hidden');
	}

	/*References*/
	var totalListing = "<tr><th>Line</th><th>Label</th><th>Assembled Address</th></tr>";
	for(var label in stateObject.referenceTable) {
		var str = "<tr><td>"+stateObject.referenceTable[label]+"</td>";
		str += "<td>"+label+"</td><td>"+stateObject.codePointTable[stateObject.referenceTable[label]]+"</td></tr>";
		totalListing += str;
	}

	document.querySelector('#references-listing').innerHTML = totalListing;

	/*Symbol Table*/
	var totalListing = "<tr><th>Symbol</th><th>Value</th></tr>";
	for(var symbol in stateObject.symbolTable.hexadecimal) {
		var str = "<tr><td>"+symbol+"</td>";
		str += "<td>"+stateObject.symbolTable.hexadecimal[symbol]+"</td></tr>";
		totalListing += str;
	}
	document.querySelector('#symbol-table').innerHTML = totalListing;

	/*Breakpoint table*/
	var totalListing = '<tr><th>Breakpoint at address</th><th class="disabled">After Instruction</th></tr>';
	for(var hex in stateObject.breakPointTable) {
		var str = '<tr><td>' + stateObject.breakPointTable[hex] + '</td><td class="disabled"></td>';
		totalListing += str;
	}
	document.querySelector('#breakpts-table').innerHTML = totalListing;

	stateObject.errors.length == 0 ? document.querySelector('#listing--button').classList.remove('disabled') : false;
	stateObject.errors.length == 0 ? document.querySelector('#emulate--button').classList.remove('disabled') : false;

	return stateObject.errors.length == 0;

}

document.querySelector('#preprocessor-view--doPreprocess').addEventListener('click', (e) => compileCode(true));
document.querySelector('#preprocessor-view--doRevert').addEventListener('click', (e) => revert());

function showSidebar() {
	document.querySelector('body').classList.add('minned');
	document.querySelector('#sidebar').classList.remove('hidden');
}

function hideSidebar() {
	document.querySelector('body').classList.remove('minned');
	document.querySelector('#sidebar').classList.add('hidden');
}

function toggleSidebar() {
	document.querySelector('body').classList.toggle('minned');
	document.querySelector('#sidebar').classList.toggle('hidden');
}

document.querySelector('#listing--button').addEventListener('click', (e)=> toggleSidebar());
document.querySelector('#sidebar--close-button').addEventListener('click', (e)=> hideSidebar());

function changeTabDebug(name) {
	var tabs = document.getElementsByClassName('debug-tab--tabs');

	for(var i = 0; i < tabs.length; ++i) {
		tabs[i].classList.remove('active');
	}

	var views = document.getElementsByClassName('debug-tab--views');

	for(var i = 0; i < views.length; ++i) {
		views[i].classList.add('hidden');
	}

	document.getElementById('debug-tab--' + name + '-tab').classList.add('active');
	document.getElementById('debug-tab--' + name).classList.remove('hidden');
}

document.querySelector('#debug-tab--references-tab').addEventListener('click', (e) => changeTabDebug('references'));
document.querySelector('#debug-tab--symtab-tab').addEventListener('click', (e) => changeTabDebug('symtab'));
document.querySelector('#debug-tab--breakpts-tab').addEventListener('click', (e) => changeTabDebug('breakpts'));
document.querySelector('#debug-tab--condasm-tab').addEventListener('click', (e) => {;});

function encodeDocument() {
	return encodeURIComponent(JSON.stringify(finalCode));
}

function goToRunner(code) {
	var urlBase = window.location.origin;
	var goto = urlBase + '/?listing='+ code;
	return goto;
}


/*Codeflask stuff*/
var flask;

window.onload = function(e) {

    flask = new CodeFlask('#mobile-code-editor', {language: 'js', lineNumbers: true, defaultTheme: false});
    console.log("Setting flask");
    flask.addLanguage('8085asm',{
			keywords: /\b(ORG|EQU|IF|ELIF|ELSE|ENDIF|=|DUP|DEF|DEFARR|DDEF|BRK|brk|org|equ|if|elif|else|endif|=|dup|def|defarr|ddef|LXI|STAX|INX|INR|DCR|MVI|RAL|DAD|RIM|SHLD|DAA|SIM|STA|STC|MOV|HLT|ADD|ADC|SUB|SBB|ACI|ADI|ANA|ANI|CALL|CC|CM|CMA|CMC|CMP|CNC|CNZ|CP|CPE|CPI|CPO|CZ|DCX|DI|EI|IN|JC|JM|JMP|JNC|JNZ|JP|JPE|JPO|JZ|LDA|LDAX|LHLD|NOP|ORA|ORI|OUT|PCHL|POP|PUSH|RAR|RC|RET|RLC|RM|RNC|RNZ|RP|RPE|RPO|RRC|RST|RZ|SBI|SPHL|SUI|XCHG|XRA|XRI|XTHL|lxi|stax|inx|inr|dcr|mvi|ral|dad|rim|shld|daa|sim|sta|stc|mov|hlt|add|adc|sub|sbb|aci|adi|ana|ani|call|cc|cm|cma|cmc|cmp|cnc|cnz|cp|cpe|cpi|cpo|cz|dcx|di|ei|in|jc|jm|jmp|jnc|jnz|jp|jpe|jpo|jz|lda|ldax|lhld|nop|ora|ori|out|pchl|pop|push|rar|rc|ret|rlc|rm|rnc|rnz|rp|rpe|rpo|rrc|rst|rz|sbi|sphl|sui|xchg|xra|xri|xthl)\b/,
			function: /\b[^\s]*\:/,
			number: /\b[0-9a-fA-F]+(H|h)?\b/,
			operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
			string: {
				pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
				greedy: true
			},
			constant: /\b(__len_[^\s]+|[^\s]+_indLocInstNo[^\s]+)\b/,
			comment: {
				pattern: /\;.*/,
				greedy: true
			}
		});
	flask.updateLanguage('8085asm');
	editor.setValue("          ORG F000\n          ;The ORG statement\n          ;loads code starting\n          ;from f000\n\n          ;Enter you code after\n          ;this line\n   START: ");
	flask.updateCode("ORG F000\n;The ORG statement\n;loads code starting\n;from f000\n\n;Enter you code after\n;this line\n");
};

const mq = window.matchMedia("(max-width: 910px)");
mq.addListener(widthChange);
widthChange(mq);

var firstTimeWidthChange = true;

function widthChange(mq) {
	try {
		if(mq.matches) {
			console.log("Mobile");
			usingFlask = true;

			//Only for first time
			if(firstTimeWidthChange === true) {
				firstTimeWidthChange = false;
				return;
			}

			//Sync document contents
			flask.updateCode(editor.getValue());
		} else {
			console.log("Desktop");
			usingFlask = false;

			//Only for first time
			if(firstTimeWidthChange === true) {
				firstTimeWidthChange = false;
				return;
			}
			editor.setValue(flask.getCode());
			editor.refresh();
		}
	} catch (err) {
		console.log("Trying again...");
		setTimeout(()=> {widthChange(mq);}, 500);
	}
}