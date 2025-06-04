function validateEmail(email) {
	var expr = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
	return expr.test(email);
}
function validPassword(password) {
	if(password==''){
		return false;
	}
	return true;
}
function validateCaptcha(captcha) {
	var expr = /^[_A-z0-9]{1,}$/;
	return expr.test(captcha);
}
function restrictKeyEnter(id) {
	$('#' + id).keydown(function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			return false;
		}
	});
}
function validateCharacters(inputString) {
	var isValid = /^[\x00-\x7F]*$/.test(inputString);
	return isValid;

}
function validateFormAscii(formId) {
	var form=$("#" + formId ).find('input:text, input[type=password], textarea, input[type=email],input[type=file]');
	var flag = true;
	$(form).each(function(index) {
		var input = $(this);
//		console.log('Type: ' + input.attr('type') + '  Name: ' + input.attr('name') + '  Value: ' + input.val());
		if(input.attr('name')=='location'){
			
		}else{
			if (input.val()) {
				if (!validateCharacters(input.val())) {
					console.log("inside the illegal code");
					if (flag) {
						flag = false;
					}
				}
			}
		}
	});
	return flag;
}
function escapeCharacters(inputString) {
	if(inputString) {
		inputString = inputString.trim();
		if(inputString.includes("%26amp;")){
			inputString = inputString.replace(/%26amp;/g,"%26")
		}
		if(inputString.includes("&")) {
			inputString = inputString.replace(/&/g, "%26")
		}
		if(inputString.includes("'")) {
			inputString = inputString.replace(/'/g,"%27")
		}
		if(inputString.includes("‘")){
			inputString = inputString.replace(/‘/g,"%27")
		}
		if(inputString.includes("’")){
			inputString = inputString.replace(/’/g,"%27")
		}
		if(inputString.includes("%26nbsp;")){
			inputString = inputString.replace(/%26nbsp;/g," ")
		}
		if(inputString.includes('"')) {
			inputString = inputString.replace(/\"/g,"%22")
		}
		if(inputString.includes('×')) {
			inputString = inputString.replace(/×/g,"x")
		}
		if(inputString.includes("%;")){
			inputString = inputString.replace(/%;/g,"%25")
		}
	}
	return inputString;
}
function escapeCharactersForSyllabus(inputString) {
	console.log('String Before conversion '+inputString);
	if(inputString) {
		inputString = inputString.trim();
		if(inputString.includes("%26amp;")){
			inputString = inputString.replace(/%26amp;/g,"%26")
		}
		if(inputString.includes("&")) {
			inputString = inputString.replace(/&/g, "%26")
		}
		if(inputString.includes("%26nbsp;")){
			inputString = inputString.replace(/%26nbsp;/g," ")
		}
		if(inputString.includes('"')) {
			inputString = inputString.replace(/\"/g,"%22")
		}
		if(inputString.includes('×')) {
			inputString = inputString.replace(/×/g,"x")
		}
		console.log('String After conversion '+inputString);
	}
	return inputString;
}