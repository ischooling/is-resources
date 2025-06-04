function getEmailVerifyContent(title, newTheme) {
	
	var html = '';

	html += '<div class="main-card mb-3">'
		+ '	<div class="card">';

	if (newTheme) {

	} else {
		html += '	<div class="card-header card-header-primary"><h4 class="card-title">' + title + '</h4></div>';
	}

	html += '<div class="card-body">';
	html += '<form id="emailVerifyForm" action="javascript:void(0);">';
					html += '<div class="row p-4">';
						html += '<div class="col-4">';
							html += '<label class="m-0 full">Enter Email</label>';
							html += '<input type="text" id="getVEmail" class="form-control" />';
						html += '</div>';
						html += '<div class="col-4">';
							html += '<button class="btn btn-sm btn-primary" onclick="getEmailVerifyByEmail()">Search</button>';
						html += '</div>';
					html += '</div>';
				html += '</form>';
	html += '</div>';

	html += '<div id="verificationDataTableWrapper" class="p-4">';

	html += '</div></div></div>';


	return html;

}

