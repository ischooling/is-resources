function getReserveSeatContent(data){
	var html = 
	getReserveSeatSlideContent(data)
	+needHelpSlideContent(data.standardId)
	return html;
}

function getNeedAnyHelpHtml(standardId){
	var html = needHelpSlideContent(standardId)
	return html;
}

function getReserveSeatSlideContent(data){
	var details = data.details;
	var html = 
		'<div id="reserve-seat-wrapper" class="reserve-seat-wrapper reserve-seat-slide-wrapper">'
			+'<div class="reserve-seat-btn reserve-btn">'	
				+'<a href="javascript:void(0)" class="btn btn-primary border-white mr-1" onclick="showReserveSeatContent()">';
				if(details.eligibleFor=='ADV'){
					if(details.monthName != null && details.monthName != undefined && details.monthName != ''){
						html+='Enroll for '+details.activeSessionYear+' Group Learning';
					}else{
						html+='Enroll in Next Grade';
					}
				}else if(details.eligibleFor=='BAE'){
					html+='Reserve Seat';
				}
				html+=
				'</a>'
			+'</div>'
			+'<div class="reserve-seat">'
				+'<div class="reserve-seat-content-wrapper position-relative p-3">';
					if(details.eligibleFor=='ADV'){
						if(details.monthName != null && details.monthName != undefined && details.monthName != ''){
							html+='<h6 style="font-size:14px"><b>Enroll for '+details.activeSessionYear+' Group Learning!</b></h6>'
							+'<P>Click on "Enroll Now" to enroll for the '+details.activeSessionYear+' Group Learning!</P>';
						}else{
							html+='<h6 style="font-size:14px"><b>Enroll for the next grade!</b></h6>'
							+'<P>Click on "Enroll Now" to enroll for the next grade!</P>';
						}
					}else if(details.eligibleFor=='BAE'){
						html+='<h6 style="font-size:14px">Reserve a seat for next grade</h6>'
						+'<P>Kindly Click on "Reserve" to reserve a seat for the next grade.</P>';
					}
					html+=
					'<div class="full text-center">'
						+'<a href="javascript:void(0)" class="btn btn-outline-white mr-1" onclick="hideReserveSeatContent()">Later</a>';
						if(details.eligibleFor=='ADV'){
							html+='<a href="javascript:void(0)" class="btn btn-white ml-1" onclick="acceptReserveASeatForNextGrade('+details.userId+');">Enroll Now</a>';
						}else if(details.eligibleFor=='BAE'){
							html+='<a href="javascript:void(0)" class="btn btn-white ml-1" onclick="acceptReserveASeatForNextGrade('+details.userId+');">Reserve</a>';
						}
						html+=
					'</div>'
				+'</div>'
				+'<div class="reserve-seat-graphics">'
					+'<img src="'+PATH_FOLDER_IMAGE2+'reserveSeatSlideImg.png'+SCRIPT_VERSION+'" />'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}

function needHelpSlideContent(standardId){
    var html = 
        '<div id="need-help-slide-wrapper" class="reserve-seat-wrapper need-help-slide-wrapper" style="display:none;">'
            +'<div class="reserve-seat align-items-center">'
				+'<div class="mr-3">'
					+'<div class="reserve-seat-content-wrapper position-relative p-3" style="height:max-content;">'
						+'<h6 style="font-size:14px" class="m-0">Need Any Help?</h6>'
					+'</div>'
					+'<div class="d-flex text-center mt-2">'
						+'<a href="https://chat.internationalschooling.org/signIn?uuid='+UNIQUEUUID+'" target="_blank" class="btn btn-primary btn-outline-white mr-2 w-100" onclick="needHelpContentShow(false)">Yes</a>'
						+'<a href="javascript:void(0)" class="btn btn-white btn-outline-primary w-100" onclick="needHelpContentShow(false, true)">No</a>'
					+'</div>'
				+'</div>'
                +'<div class="reserve-seat-graphics">';
				if(USER_ROLE == "STUDENT") {
					if((standardId >= 11 && standardId <= 16) || standardId == 19) {
						html += '<img src="'+PATH_FOLDER_IMAGE2+'needHelpSlideImgEleGirl.png'+SCRIPT_VERSION+'" style="width: 75px;" />'
					} else if ((standardId >= 1 && standardId <= 3) || standardId == 9) {
						html += '<img src="'+PATH_FOLDER_IMAGE2+'needHelpSlideImgMiddleBoy.png'+SCRIPT_VERSION+'" style="width: 75px;" />'
					} else if((standardId >= 4 && standardId <= 7) ||standardId == 10 || standardId == 8) {
						html += '<img src="'+PATH_FOLDER_IMAGE2+'needHelpSlideImgHighGirl.png'+SCRIPT_VERSION+'" style="width: 50px;" />'
					} else {
						html += '<img src="'+PATH_FOLDER_IMAGE2+'needHelpSlideImgMiddleGirl.png'+SCRIPT_VERSION+'" />'
					}
				} else if (USER_ROLE == "TEACHER") {
					html += '<img src="'+PATH_FOLDER_IMAGE2+'needHelpSlideTeacher3.png'+SCRIPT_VERSION+'" style="width: 75px;" />'
				}
                html +='</div>'
            +'</div>'
        +'</div>';
    return html;
}

function getReserveSeatModal(data){
	var details = data.details;
	var html=
	'<div class="modal fade" id="reserveSeatModal" tabindex="-1">'
		+'<div class="modal-dialog modal-lg" role="document">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header pt-2 pb-2 theme-bg text-white ">'
				+'<h5 class="modal-title">';
				if(details.eligibleFor=='ADV'){
					if(details.monthName != null && details.monthName != undefined && details.monthName != ''){
						html+='Enroll for '+details.activeSessionYear+' Group Learning Now';
					}else{
						html+='Pay Course Fee For Next Grade';
					}
				}else{
					html+='Reserve A Seat For Next Grade';
				}
				html+='</h5>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
						+'<span aria-hidden="true">×</span>'
					+'</button>'
				+'</div>'
				+'<div class="modal-body">'
					+'<div class="full">'
						+'<table class="table table-bordered table-striped text-left m-0" style="width:100%">'
							+'<thead>'
								+'<th class="bg-primary text-white">Description</th>'
								+'<th class="bg-primary text-white">Fee (USD)</th>'
								+'<th class="bg-primary text-white">Total Fee</th>'
							+'</thead>'
							+'<tbody>'
								+'<td>Payable Fee</td>'
								+'<td>'+details.payableFee+'</td>'
								+'<td>'+details.payableFee+'</td>'
							+'</tbody>'
						+'</table>'
					+'</div>'
					+'<div class="full">';
						if(details.eligibleFor=='ADV'){
							html+='<p class="text-left">*This payable fee is for '+details.grade+' of '+details.learningProgramLabel;
							if(details.learningProgram=='DUAL_DIPLOMA' || details.learningProgram=='ONE_TO_ONE_FLEX'){

							}else{
								html+=' for '+details.credits+' regular credits.</p>';
							}
						}else if(details.eligibleFor=='BAE'){
						}
						html+='<p class="text-left">*This fee will be deducted from your Course Fee at the time of re-enrollment</p>'
					+'</div>'
				+'</div>'
				+'<div class="modal-footer text-right">'
					+'<a href="javaScript:void(0);" class="btn btn-primary" onclick="callClientCommonPaymentGateway(\'paymentForm\',\'student\','+details.userId+','+details.userPaymentDetailsId+',\'advance-payment\','+details.userId+');">Proceed to Pay</a>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}