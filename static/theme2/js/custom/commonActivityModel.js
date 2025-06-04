function calendarMeetingLinkValidate(){
	var html =
		`<div class="calendarClassDetails modal fade" id="classJoinInSameWindowModal" tabindex="-1" role="dialog" aria-labelledby="classJoinInSameWindowModalLabel" aria-hidden="true">
			<div class="modal-dialog `+(tt!="theme1"? 'modal-lg':'')+`">
				<div class="modal-content" style="border-radius: 16px !important;">
					<div class="modal-header py-2 bg-primary" style="border-radius: 16px 16px 0px 0px;">`
						if(tt!="theme1"){
							html+=`<div class="d-flex justify-content-between align-items-center w-100">
										<h5 class="modal-title text-white d-flex align-items-center" style="gap:5px;">
											<i class="fa fa-info-circle" aria-hidden="true"></i>
											Information
										</h5>
										<button type="button" class="btn btn-sm bg-transparent" data-dismiss="modal" style="box-shadow: 0px 0px; padding: 8px; font-weight: bold;"><i class="fa fa-times" style="font-size: 18px; color: #FFF;" aria-hidden="true"></i></button>
									</div>`;
						}else{
							html+=`<div class="d-flex justify-content-between align-items-center w-100">
										<h4 class="modal-title text-white d-flex align-items-center" style="gap:5px;">
											<i class="fa fa-info-circle" aria-hidden="true"></i>
											Information
										</h4>
										<button type="button" class="btn btn-sm bg-transparent" data-dismiss="modal" style="box-shadow: 0px 0px; padding: 8px; font-weight: bold;"><i class="fa fa-times" style="font-size: 18px; color: #FFF;" aria-hidden="true"></i></button>
									</div>`;
						}
					html+=`</div>
					<div id="classJoinInSameWindowBody" class="modal-body py-4">
					</div>
				</div>
			</div>
		</div>`
		html+= `<div class="modal fade" id="joinUrlInfo">
				<div class="modal-dialog modal-md" role="document">
					<div id="joinUrlInfo-content" class="modal-content">
					</div>
				</div>
			</div>`;
	return html;
}

function proceedwithActivityControll(response){
	if (response['status'] == '0' || response['status'] == '2' || response['status'] == '3') {
		if (response['status'] == '3') {
			redirectLoginPage();
		}else{
			$('#classJoinInSameWindowModal').modal({backdrop: 'static', keyboard: false});
			$('#classJoinInSameWindowBody').html(calendarMeetingLinkValidateActivity(response['message']));
		}
	}else{
		var classUrl=response['redirectUrl'];
		$('#classJoinInSameWindowModal').modal({backdrop: 'static', keyboard: false});
		$('#classJoinInSameWindowBody').html(calendarMeetingLinkValidateActivityStudent(classUrl, response));
		window.setTimeout(function () { $('#classJoinInSameWindowModal').modal('hide');}, getSettingsByTypeAndKey("CONFIGURATION", "MEETING_JOIN_MODAL_HIDE_MIN")*1000);
		window.open(classUrl,"_blank");
	}
}

function classDetailsOnModalActivity(url){
	customLoader(true);
	$.ajax({
		type : "GET",
		contentType: "application/json",
		dataType: 'json',
		url : url,
		success : function(responseData) {
			console.log('baseUrl '+url);
			console.log('responseData '+JSON.stringify(responseData));
			proceedwithActivityControll(responseData);
			customLoader(false);
		}
	});
}

function calendarMeetingLinkValidateActivity(message){
	var html=
	`<div id="classJoinWaringDiv" class="full text-center my-4" >`
		if(tt != 'theme1'){
			html +=`<h5>` + message + `.</h5>`;
		}else{
			html +=`<h4>` + message + `.</h4>`;
		}	
		// if (response.meetingId &&  response.meetingPasscode ){
		// 	html += `<h6 class="text-center">If you are having issues with redirection to the class, please join with the credentials given below. </h6>
		// 	<h5 class="text-center" > Meeting ID : ` + response.meetingId + '<br/>  Meeting Passcode : ' + response.meetingPasscode + `</h5>`
		// }
		html +=`
		<div class="full text-center mt-2">
			<button type="button" class="btn btn-outline-dark font-size-lg" data-dismiss="modal">Close</button>
		</div>
	</div>`;
	return html;
}

function calendarMeetingLinkValidateActivityStudent(url, response){
	var warringMessage=false;
	if(response['dateStatus']=='past'){
		warringMessage=true;
	}else if(response['dateStatus']=='future'){
		warringMessage=true;
	}
	var html = 
		`<div id="classJoinWaringDiv">
			${tt == "theme1" ?
				`<h3 class="text-center">The class ${response.activityTitle} is scheduled for `+convertDatetimeWithFormat(response.startDatetime, response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME)+`</h3>`
				:
				`<h6 class="text-center">The class ${response.activityTitle} is scheduled for `+convertDatetimeWithFormat(response.startDatetime, response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME)+`</h6>`
			}
			<a target="_blank" id="classJoinWaring" href="${url}" onclick="autodiposeModel('classJoinInSameWindowModal')" class="btn btn-sm rounded mt-2 mx-auto" style="background-color: #027FFF; box-shadow: 0px 0px; padding: 5px 10px; display: flex; width: max-content; font-weight: bold; color: white;">Join Class Now</a>
			<hr style="border-top: 2px dashed #cdcdcd;">
			<h6 class="text-center">If you are facing issues with joining, copy the class link below and paste it into a new tab on your browser:</h6>
			<p class="copy-msg-0 mt-3 mb-0" style="text-align: center; font-weight: bold;"></p>
			${DEPLOYMENT_MODE != "PROD" ?`<textarea style="width:100%;height:100px;">${url}</textarea>`:`<input style="opacity:0;height:0px;display:none;">`}
			<button value="${url}" class="btn btn-sm btn-success rounded mt-2 mx-auto align-items-center" style="border: 0px; box-shadow: 0px 0px; padding: 5px 10px; display: flex; width: max-content; font-weight: bold;" onclick="copyURL('copyURL0','copy-msg-0')"><i class="fa fa-clone" style="font-size: 14px;"></i>&nbsp;Copy Class Link</button>
			<div style="top:0;left:0;position:absolute;">
				<input type="text" id="copyURL0" value="${url}" style="opacity:0;height:0px">
			</div>
		</div>`
	return html;
}

$(document).ready(function () {
    $("body").append(calendarMeetingLinkValidate());
})

function copyLinkUrl(link) {
	if (!link || link == '') {
	  showMessage(false, "Url Invalid");
	} else {
	  navigator.clipboard.writeText(link).then(
		() => showMessage(false, "URL copied successfully!")
	  );
	}
  }
  