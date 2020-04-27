window.addEventListener('keydown', function(e) {
	var key = e.keyCode;
	var flag = false;
	switch(key) {
		case 37:if(document.getElementById('data-input-5') == document.activeElement)
					document.getElementById('data-input-4').click();
				else if(document.getElementById('data-input-4') == document.activeElement)
					document.getElementById('data-input-3').click();
				else if(document.getElementById('data-input-3') == document.activeElement)
					document.getElementById('data-input-2').click();
				else if(document.getElementById('data-input-2') == document.activeElement)
					document.getElementById('data-input-1').click();
				else if(document.getElementById('data-input-1') == document.activeElement)
					document.getElementById('data-input-0').click();
				else if(document.getElementById('data-input-0') == document.activeElement)
					;
				else
					document.getElementById('data-input-0').click();
				break;
		case 38:if(displayCells.arrowMod == true)
					displayCells.decrement();
				break;
		case 39:if(document.getElementById('data-input-0') == document.activeElement)
					document.getElementById('data-input-1').click();
				else if(document.getElementById('data-input-1') == document.activeElement)
					document.getElementById('data-input-2').click();
				else if(document.getElementById('data-input-2') == document.activeElement)
					document.getElementById('data-input-3').click();
				else if(document.getElementById('data-input-3') == document.activeElement)
					document.getElementById('data-input-4').click();
				else if(document.getElementById('data-input-4') == document.activeElement)
					document.getElementById('data-input-5').click();
				else if(document.getElementById('data-input-5') == document.activeElement)
					;
				else
					document.getElementById('data-input-0').click();
				break;
		case 40:if(displayCells.arrowMod == true)
					displayCells.increment();
				break;
		case 82:if(e.altKey)
					document.getElementById('button-RES').click();
				break;
		case 73:if(e.altKey)
					document.getElementById('button-INR').click();
				break;
		case 79:if(e.altKey)
					document.getElementById('button-GO').click();
				break;
		case 71:if(e.altKey)
					document.getElementById('button-REG').click();
				break;
		case 83:if(e.altKey)
					document.getElementById('button-SET').click();
				break;
		case 67:if(e.altKey)
					document.getElementById('button-DCR').click();
				break;
		case 88:if(e.altKey)
					document.getElementById('button-EXEC').click();
				break;
		case 80:if(e.altKey)
					document.getElementById('button-STEP').click();
				break;


		case 97:document.getElementById('button-1').click();
				break;
		case 98:document.getElementById('button-2').click();
				break;
		case 99:document.getElementById('button-3').click();
				break;
		case 100:document.getElementById('button-4').click();
				break;
		case 101:document.getElementById('button-5').click();
				break;
		case 102:document.getElementById('button-6').click();
				break;
		case 103:document.getElementById('button-7').click();
				break;
		case 104:document.getElementById('button-8').click();
				break;
		case 105:document.getElementById('button-9').click();
				break;
		case 65:document.getElementById('button-A').click();
				break;
		case 66:document.getElementById('button-B').click();
				break;
		case 67:document.getElementById('button-C').click();
				break;
		case 68:document.getElementById('button-D').click();
				break;
		case 69:document.getElementById('button-E').click();
				break;
		case 70:document.getElementById('button-F').click();
				break;
		case 96:document.getElementById('button-0').click();
				break;

		default: key = 'none';
				break;
	}
});