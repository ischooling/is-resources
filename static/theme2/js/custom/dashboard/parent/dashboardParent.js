async function changeStudentByParent(studentId, studentDashboardRedirectUrl) {
	var payload = {};
	payload['studentId'] = studentId;
	responseData = await getDashboardDataBasedUrlAndPayload(false, false, 'select-student-by-parent', payload);
	if (responseData.status == 1) {
		location.replace(studentDashboardRedirectUrl);
	}
}

function redirectLms(e, isPayLmsPaymentPending) {
	if (isPayLmsPaymentPending != null && isPayLmsPaymentPending != "") {
		showMessageTheme2(0, isPayLmsPaymentPending);
		setTimeout(function() {
			$('.switch').find('.switch-input').prop('checked', false);
		}, 600);

	} else {
		var go_to_url = $(e).attr('changeurl');
		var checkedValue = $('.redirectLmsUrl').val()
		if ($('.redirectLmsUrl').is(":checked") == true && checkedValue == "yes") {
			setTimeout(function() {
				$('.switch').find('.switch-input').prop('checked', false);
			}, 600);
			setTimeout(function() {
				if(getSession()){
					window.open(go_to_url, '_blank');
				}else{
					redirectLoginPage();
				}
			}, 500);
		}
	}
}

function callLocationAndSelectCountryNew(formId) {
  $.ajax({
    global: false,
    type: "GET",
    url: PRO_IP_API_URL,
    success: function (data) {
      callLocationAndSelectCountryNewFill(formId, data);
    },
    error: function(e){
      if (checkonlineOfflineStatus()) {
				return;
			}
    }
  });
}

function callLocationAndSelectCountryNewFill(formId, data) {
  if (data != undefined && data != "") {
    if ($("#" + formId + " #countryTimezoneId").length) {
      $("#countryTimezoneId").val(data.timezone).trigger("change");
    }
    $("#countryId").val(data.country).trigger("change");
    $("#" + formId + " #location").val(JSON.stringify(data));
  }
}