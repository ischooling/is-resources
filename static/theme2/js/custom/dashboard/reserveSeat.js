$(document).on("click", "#dashboardPayment #chkval", function () {
	if ($("#chkval").is(":checked")) {
		$("#payTabData").removeAttr("disabled");
	} else {
		$("#payTabData").attr("disabled", true);
	}
});

function showReserveSeatContent(){
	$(".need-help-slide-wrapper").removeClass("slide-in");
	$(".reserve-seat-btn").addClass("slide-out-btn");
	$(".reserve-seat-slide-wrapper").addClass("slide-in");
}
function hideReserveSeatContent(){
	$(".reserve-seat-btn").removeClass("slide-out-btn");
	$(".reserve-seat-slide-wrapper").removeClass("slide-in");
}
function showReserveSeatModal(){
	$("#reserveSeatModal").modal("show");
}

function getReserveASeatForNextGrade(userId){
	var postData = {};
	postData['userId'] = userId;
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'eligible-for-ras-for-next-grade'),
		data: JSON.stringify(postData),
		dataType: 'json',
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					// if(tt=='theme1'){
					// 	showMessage(false, data['message']);
					// }else{
					// 	showMessageTheme2(0, data['message'],'',true);
					// }
				}
				$(".need-help-slide-wrapper").removeClass("slide-in");
				// $('.reserve-seat-wrapper').hide();
			} else {
				if(data['statusCode'] == 'S001'){
					if($("body .reserve-seat-wrapper").length == 0){
						$("body").append(getReserveSeatContent(data));
					}
					showReserveSeatContent();
				}else{
					// $(".need-help-slide-wrapper").removeClass("slide-in");
					$('.reserve-seat-wrapper').hide();
				}
			}
			if(data.eligible == "Y") {
				if($("body #need-help-slide-wrapper").length == 0){
					$("body").append(getNeedAnyHelpHtml(data.standardId));
				}
				setTimeout(function() {
					needHelpContentShow(true, false)
					setTimeout(function() {
						needHelpContentShow(false, false)
					}, data.durationTime*1000)
					setInterval(function() {
						needHelpContentShow(true, false)
						setTimeout(function() {
							needHelpContentShow(false, false)
						}, data.durationTime*1000)
					},(data.timeInterval*1000*60)+ (data.durationTime*1000)) 
				}, data.durationTime*1000)
			}
		}
	});
}

function acceptReserveASeatForNextGrade(userId){
	var postData = {};
	postData['userId'] = userId;
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'accept-ras-for-next-grade'),
		data: JSON.stringify(postData),
		dataType: 'json',
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3' || data['status'] == 'E001') {
				if(data['status'] == 'E001' || data['status'] == '0' || data['status'] == '3'){
				 window.location.reload()
				}else{
					if(tt=='theme1'){
						showMessage(false, data['message']);
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				}
				$('.reserve-seat-wrapper').hide();
			} else {
				var details = data.details;
				$('#reserveSeatModal').remove();
				$('.reserve-seat-wrapper').after(getReserveSeatModal(data))
				$('#reserveSeatModal').modal({ backdrop: 'static', keyboard: false })
			}
		}
	});
}

function needHelpContentShow(needShow, isCliked) {
	
	if (needShow) {
		$(".reserve-seat-btn").addClass("slide-out-btn");
		$(".need-help-slide-wrapper").show()
		$(".need-help-slide-wrapper").addClass("slide-in");
		$(".reserve-seat-slide-wrapper").removeClass("slide-in");
	} else {
		// $(".need-help-slide-wrapper").hide()
		// if(isCliked){
			$(".reserve-seat-btn").removeClass("slide-out-btn");
			$(".need-help-slide-wrapper").removeClass("slide-in");
			$(".reserve-seat-slide-wrapper").removeClass("slide-in");
		// } else {
		// 	$(".reserve-seat-slide-wrapper").removeClass("slide-in");
		// 	$(".reserve-seat-btn").removeClass("slide-out-btn");
		// 	$(".need-help-slide-wrapper").removeClass("slide-in");
		// }
	}
}
