var pbus = document.getElementById('pbus');

//Defined Events
pbus.events = {
	updatedRegister: new Event('register-updated'),
	updateMemory: new Event('memory-update'),
	error: new Event('error')
}