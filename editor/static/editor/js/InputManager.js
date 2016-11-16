function InputManager(divId){
	var div = document.getElementById(divId);
	this.form = document.createElement('form');
	this.callback = function(){ console.log('default callback'); };
	this.form.setAttribute('onsubmit', "event.preventDefault(); inputManager.getInputs();");
	this.numInputs = 0;
	this.submit = document.createElement('input');
	this.submit.setAttribute('type', 'submit');
	this.form.appendChild(this.submit);
	div.appendChild(this.form);
};

InputManager.prototype.addInput = function(tag, type){
	console.log("adding input", tag, type);
	var field = document.createElement('input');
	var text = document.createTextNode(tag + ":");
	field.setAttribute('type', type);
	if (type == 'number'){
		console.log('setting step to any');
		field.setAttribute('step', 'any');
	}
	field.setAttribute('name', tag);
	this.form.insertBefore(text, this.submit);
	this.form.insertBefore(field, this.submit);
	this.form.insertBefore(document.createElement('br'), this.submit);
};

InputManager.prototype.setCallback = function(callback){
	this.callback = callback;
};

InputManager.prototype.getInputs = function(){
	//read the inputs into an array
	var data = new Array();
	var success = true;
	var elements = this.form.elements;
	for (var i = 0, element; element = elements[i++];) {
		if (element.type != 'submit' && element.value == ""){
			console.log(element.value);
			alert("Enter a value in each field.");
			success = false;
			break;
		} else {
			console.log("success:", element.value);
		}
		data.push(element.value);
	}
	if (success){
		//clear the form
		Util.removeChildren(this.form);
		this.submit = document.createElement('input');
		this.submit.setAttribute('type', 'submit');
		this.form.appendChild(this.submit);
		this.callback(data);
	}
	return false;
};