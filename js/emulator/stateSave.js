document.querySelector('#file-uploader').addEventListener('change', readFile);

function openMemory(event) {
	document.querySelector('#file-uploader').click();
}

function readFile(event) {
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
		try {
			loader.load(JSON.parse(reader.result));
			document.getElementById('load-code').classList.remove('hidden');
			window.setTimeout(()=>document.getElementById('load-code').classList.add('hidden'), 4000);
		} catch(err) {
			document.querySelector('#toast').textContent = "Invalid memory file!";
			document.getElementById('toast').classList.remove('hidden');
			window.setTimeout(()=>document.getElementById('toast').classList.add('hidden'), 4000);
		}
	});
	reader.readAsText(file, 'UTF-8');
}

function saveMemory(event) {
	var listingObj = {
		listing: memory.constructMinAssocArr(),
		breakpoints: __break_pts
	};

	var blob = new Blob([JSON.stringify(listingObj)], {type: 'text/plain;charset=utf-8'});
	var name = window.prompt("Enter a name for the memory file: ", "listing.txt");
	while(name !== null) {
		if(name.slice(name.indexOf('.')+1) == "txt")
			break;
		window.alert("The name must end in .txt!");
		name = window.prompt("Enter a name for the memory file: ", "listing.txt");
	}

	if(name === null)
		return;

	saveAs(blob, name);
	document.querySelector('#modal-shade').click();
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

function shareMemory(event) {
	var listingObj = {
		listing: memory.constructMinAssocArr(),
		breakpoints: __break_pts
	};

	var str = JSON.stringify(listingObj);
	var uri = encodeURIComponent(str);

	if(navigator.share) {
		navigator.share({
			title: 'Neutrino 8085 Assembler',
			url: window.location.origin + '/redir.html?listing=' + uri
		});
	} else {
		copyTextToClipboard(window.location.origin + '/redir.html?listing=' + uri);
		document.querySelector('#load-code').textContent = "Sharable link copied to clipboard!";
		document.querySelector('#load-code').classList.add('shareOverride');
		document.querySelector('#load-code').classList.remove('hidden');
		setTimeout( e => {
			document.querySelector('#load-code').classList.add('hidden');
			setTimeout(e => {
				document.querySelector('#load-code').textContent = "Loaded code!";
				document.querySelector('#load-code').classList.remove('shareOverride');
			}, 200);
		}, 4000);
	}
}