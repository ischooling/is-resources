function getReserveSeatContent(data, nextGrade){
	var html = 
	getReserveSeatSlideContent(data, nextGrade)
	+needHelpSlideContent(data.standardId)
	return html;
}

function getNeedAnyHelpHtml(standardId){
	var html = needHelpSlideContent(standardId)
	return html;
}

function getReserveSeatSlideContent(data, nextGrade){
	var details = data.details;
	var html = 
		'<div id="reserve-seat-wrapper" class="reserve-seat-wrapper reserve-seat-slide-wrapper">'
			+'<div class="reserve-seat-btn reserve-btn">'	
				+'<a href="javascript:void(0)" class="btn bg-secondary text-white border-white mr-1" onclick="showEnrollReserveModal();">';
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
		+'</div>'
		+enrollReserveModalContent(details, nextGrade);
			// +'<div class="reserve-seat">'
			// 	+'<div class="reserve-seat-content-wrapper position-relative p-3 bg-secondary" style="height:100px;">';
			// 		if(details.eligibleFor=='ADV'){
			// 			if(details.monthName != null && details.monthName != undefined && details.monthName != ''){
			// 				html+='<h6 style="font-size:14px" class="mb-3 text-white"><b>Enroll for '+details.activeSessionYear+' Group Learning!</b></h6>';
			// 			}else{
			// 				html+='<h6 style="font-size:14px" class="mb-3 text-white"><b>Enroll now for the Next Grade!</b></h6>';
			// 			}
			// 		}else if(details.eligibleFor=='BAE'){
			// 			html+='<h6 style="font-size:14px" class="mb-3 text-white">Reserve a seat for next grade</h6>';
			// 		}
			// 		html+=
			// 		'<div class="full text-center">'
			// 			+'<a href="javascript:void(0)" class="btn border border-white text-white mr-1" onclick="hideReserveSeatContent()">Later</a>';
			// 			if(details.eligibleFor=='ADV'){
			// 				html+='<a href="javascript:void(0)" class="btn ml-1 text-secondary bg-white font-weight-semi-bold" onclick="acceptReserveASeatForNextGrade('+details.userId+');">Enroll Now</a>';
			// 			}else if(details.eligibleFor=='BAE'){
			// 				html+='<a href="javascript:void(0)" class="btn ml-1 text-secondary bg-white font-weight-semi-bold" onclick="acceptReserveASeatForNextGrade('+details.userId+');">Reserve</a>';
			// 			}
			// 			html+=
			// 		'</div>'
			// 	+'</div>'
			// 	+'<div class="reserve-seat-graphics">'
			// 		+'<img src="'+PATH_FOLDER_IMAGE2+'reserveSeatSlideImg.png'+SCRIPT_VERSION+'" />'
			// 	+'</div>'
			// +'</div>'
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
						if(CHAT_URL != ''){
							+'<a href="'+CHAT_URL+'/signIn?uuid='+UNIQUEUUID+'" target="_blank" class="btn btn-primary btn-outline-white mr-2 w-100" onclick="needHelpContentShow(false)">Yes</a>'
						}
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

function getReserveSeatModal(data) {
	var details = data.details;
	var totalFee = details.eligibleFor == 'BAE' ? details.payableFee : details.courseFee;
	var titleText = '';
	if (details.eligibleFor == 'ADV') {
		if (details.monthName) {
			titleText = 'Enroll for ' + details.activeSessionYear + ' Group Learning Now';
		} else {
			titleText = `Pay Course Fee For ${details.grade}`;
		}
	} else {
		titleText = 'Reserve A Seat For Next Grade';
	}

	var html = `
	<div class="modal fade" id="reserveSeatModal" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-dialog-centered mx-auto" role="document" style="max-width: 500px; box-shadow: 0 0;">
			<div class="modal-content modal-rounded border-0 rounded-15 overflow-hidden">

				<div class="modal-header bg-white border-0 justify-content-start align-items-center position-relative" style="border-bottom: 1px solid #eee !important;">
					<h6 class="modal-title font-weight-bold mb-0" style="max-width: 75%;">${titleText}</h6>
					<div class="position-absolute d-flex align-items-center" style="right: 12px; top: 10px; gap:6px;">
						<button type="button" class="close text-white position-absolute mt-2" style="right: 14px;" data-dismiss="modal"><span class="text-white">×</span></button>
					</div>
				</div>

				<div class="modal-body px-4"> 
					<div class="d-flex justify-content-between rounded-10 py-2 px-3 font-weight-semi-bold font-18">
						<span>Total Fee</span>
						<span class="font-22">${totalFee}</span>
					</div>`
                    if(details.planDiscount && details.planDiscount != '$0.00'){
						html+=`<div class="d-flex justify-content-between rounded-10 py-2 px-3 font-weight-semi-bold font-16  text-success">
							<span>One Time Discount</span>
							<span class="font-18">- ${details.planDiscount}</span>
						</div>`;
					}
					if(details.eligibleForProgressionDiscount == 'Y' && details.progressionDiscount){
						html+=`<div class="d-flex justify-content-between rounded-10 py-2 px-3 font-weight-semi-bold font-16 text-success">
							<span>Progression Discount</span>
							<span class="font-18">- ${details.progressionDiscount}</span>
						</div>`;
					}
					if(details.addtionalDiscount && details.addtionalDiscount != '$0.00'){
						html+=`<div class="d-flex justify-content-between rounded-10 py-2 px-3 font-weight-semi-bold font-16  text-success">
							<span>Additional Discount</span>
							<span class="font-18">- ${details.addtionalDiscount}</span>
						</div>`;
					}
					html+=`<div class="d-flex justify-content-between align-items-center bg-light-primary rounded-10 py-2 px-3 my-2">
						<div class="text-black font-14 mb-1 text-left">Payable Fee (USD)</div>
						<div class="font-18 font-weight-bold text-dark text-right">${details.payableFee}</div>
					</div>

					<div class="bg-light-warning text-black font-12 border border-warning py-2 px-3 text-left rounded-10 d-flex align-items-start">
						<i class="fas fa-info-circle mr-1 mt-1"></i>
						<div class="">`
							if(details.eligibleFor == 'ADV'){
								html+=`<p class="text-left text-black mb-1">*This payable fee is for ${details.grade}`
								if(details.learningProgram == 'DUAL_DIPLOMA' || details.learningProgram == 'ONE_TO_ONE_FLEX'){
								}else{
									html+=` for ${details.credits} regular credits.</p>`;
								}
							}else if(details.eligibleFor == 'BAE'){
								html+=`<p class="text-left mb-1">*This fee will be deducted from your Course Fee at the time of re-enrollment</p>`;
							}
						html+=`</div>
					</div>
				</div>

				<div class="modal-footer border-0 px-4 pb-4 bg-transparent justify-content-center">
					<a href="javascript:void(0);" 
						class="btn btn-primary rounded-10 shadow btn-pay font-weight-bold font-16"
						style="width: 170px;"
						onclick="checkPayment('paymentForm', ${details.userPaymentDetailsId}, '${SCHOOL_ID}');">
						<i class="fas fa-lock mr-2"></i> Proceed to Pay
					</a>
				</div>

			</div>
		</div>
	</div>`;

	return html;
}

function enrollReserveModalContent(data, nextGrade){
	var html=
		`<style>
			@keyframes pulseScale {
				0% { transform: scale(0.95); }
				50% { transform: scale(1.02); }
				100% { transform: scale(0.95); }
			}
			.btn-enroll {
				animation: pulseScale 1.5s infinite ease-in-out;
			}
		</style>

		<div class="modal fade custom-modal" id="enrollReserveModal" tabindex="-1" role="dialog">`;
			if(data.eligibleFor == 'ADV' && ((data.progressionDiscount && data.progressionDiscount != 0 && data.progressionDiscount != '$0.00') || (data.planDiscount && data.planDiscount != 0 && data.planDiscount != '$0.00'))){
				html+=`<div class="modal-dialog modal-dialog-centered mx-auto" role="document" style="max-width: 600px; box-shadow: 0 0;">`;
			}else{
				html+=`<div class="modal-dialog modal-dialog-centered mx-auto" role="document" style="max-width: 400px; box-shadow: 0 0;">`;
			}
			html+=`
				<div class="modal-content p-0 rounded-15 border-0 text-center">

					<div class="modal-header bg-primary text-white border-b-0 justify-content-center position-relative" style="border-top-left-radius: 15px; border-top-right-radius: 15px;">
						<h5 class="modal-title font-weight-bold">`;
							if(data.eligibleFor == 'ADV' && ((data.progressionDiscount && data.progressionDiscount != 0 && data.progressionDiscount != '$0.00') || (data.planDiscount && data.planDiscount != 0 && data.planDiscount != '$0.00'))){
								html+=`Congratulations!`;
							}else{
								html+=`Awesome!`;
							}
						html+=`</h5>
						<button type="button" class="close text-white position-absolute" style="right: 14px;" data-dismiss="modal"><span class="text-white">&times;</span></button>
					</div>

					<div class="modal-body">
						`;
						if(data.eligibleFor == 'ADV' && ((data.progressionDiscount && data.progressionDiscount != 0 && data.progressionDiscount != '$0.00') || (data.planDiscount && data.planDiscount != 0 && data.planDiscount != '$0.00'))){
						}else{
							html+=`<div class="font-22 bg-primary text-white d-inline-flex align-items-center justify-content-center rounded-circle mx-auto my-3" style="width: 55px; height: 55px;">
							<i class="fas fa fa-check"></i>
						</div>`;
						}
						html+=`
						<h4>Hi ${USER_FULL_NAME}!</h4>
						<p class="font-16 text-black mt-2">Now you are eligible for re-enrollment for the next grade</p>`;
						if(data.eligibleFor == 'ADV' && ((data.progressionDiscount && data.progressionDiscount != 0 && data.progressionDiscount != '$0.00') || (data.planDiscount && data.planDiscount != 0 && data.planDiscount != '$0.00'))){
							html+=`<div class="bg-light-primary rounded-10 p-3 mb-4 mt-2">
							<div class="d-flex align-items-center" style="margin-left:32px;">
								<div class="text-center px-2" style="margin-left:25px;">
									<img src="${PATH_FOLDER_IMAGE2}reenrollement.png${SCRIPT_VERSION}" style="width: 90px;" />
								</div>
								<div class="border-left pl-4 ml-3 text-center flex-grow-2">
									<span class="bg-primary text-white d-inline-block px-3 py-1 rounded text-center w-fit-content font-weight-bold font-12 mb-2">`;
									if(data.progressionDiscount && data.progressionDiscount != 0 && data.progressionDiscount != '$0.00'){
										html+=`EXCLUSIVE RE-ENROLLMENT OFFER`;
									}else if(data.planDiscount && data.planDiscount != 0 && data.planDiscount != '$0.00'){
										html+=`EXCLUSIVE ONE-TIME OFFER`;
									}
									html+=`</span>
									<p class="font-14 text-dark mb-0">You get a special discount of</p>
									<div class="d-flex align-items-center justify-content-center">`;
										if(data.progressionDiscount && data.progressionDiscount != 0 && data.progressionDiscount != '$0.00'){
											html+=`<div class="text-primary mb-0" style="font-size:44px; font-weight:800;">${data.progressionDiscount.toString().split('.')[0]}<span> OFF</span></div>`;
										}else if(data.planDiscount && data.planDiscount != 0 && data.planDiscount != '$0.00'){
											html+=`<div class="text-primary mb-0" style="font-size:44px; font-weight:800;">${data.planDiscount.toString().split('.')[0]}<span> OFF</span></div>`;
										}
										// else if(data.addtionalDiscount && data.addtionalDiscount != 0 && data.addtionalDiscount != '$0.00'){
										// 	html+=`<div class="text-primary mb-0" style="font-size:44px; font-weight:800;">${data.addtionalDiscount.toString().split('.')[0]}<span> OFF</span></div>`;
										// }
									html+=`
									</div>
								</div>
							</div>
						</div>`;
						if(data.progressionDiscountDueDate){
							html+=`<div id="reserveSeatDiscountCountdownWrapper" class="d-flex align-items-center rounded-10 border border-warning mb-3 overflow-hidden" data-progression-discount-due-date="${data.progressionDiscountDueDate}" style="background:#fffaf0;">
							<div class="d-flex align-items-center text-left px-2 py-2 flex-shrink-0" style="width:34%; min-width:260px;">
								<div class="d-inline-flex align-items-center justify-content-center rounded-circle text-warning mr-2 flex-shrink-0" style="width:30px; height:30px; border:1px solid #ffd778; background:#fff7df;">
									<i class="fas fa-calendar-alt"></i>
								</div>
								<div class="font-14 font-weight-semi-bold text-dark">This offer is valid for a limited time only!</div>
							</div>
							<div id="reserveSeatDiscountCountdown" class="d-flex align-items-center justify-content-end flex-grow-1 px-2 py-2" style="min-width:0;"></div>
						</div>
						<script>
							if(window.RESERVE_SEAT_DISCOUNT_COUNTDOWN_INTERVAL){
								clearInterval(window.RESERVE_SEAT_DISCOUNT_COUNTDOWN_INTERVAL);
							}
							var reserveSeatDiscountCycle = parseInt("${data.progressionDiscountDueDate}", 10) * 24 * 60 * 60 * 1000;
							var reserveSeatDiscountEndTime = new Date().getTime() + reserveSeatDiscountCycle;
							var reserveSeatDiscountCountdown = function(){
								var distance = reserveSeatDiscountEndTime - new Date().getTime();
								if(distance <= 0){
									reserveSeatDiscountEndTime = new Date().getTime() + reserveSeatDiscountCycle;
									distance = reserveSeatDiscountCycle;
								}
								var timeList = [
									{value: Math.floor(distance / (1000 * 60 * 60 * 24)), label: "Days"},
									{value: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), label: "Hours"},
									{value: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), label: "Minutes"},
									{value: Math.floor((distance % (1000 * 60)) / 1000), label: "Seconds"}
								];
								$("#reserveSeatDiscountCountdown").html($.map(timeList, function(timer, index){
									return \`<div class="d-inline-flex align-items-center">
										<div class="d-inline-flex flex-column rounded bg-white text-dark px-1 py-1 font-weight-bold border" style="min-width:50px;">
											<div class="font-20 text-danger" style="line-height:20px">\${padTo2Digits(timer.value)}</div>
											<span class="font-weight-semi-bold font-10 text-center">\${timer.label}</span>
										</div>\${index < timeList.length - 1 ? '<span class="font-16 text-dark font-weight-bold d-inline-block px-1 pb-1">:</span>' : ''}
									</div>\`;
								}).join(""));
							}
							reserveSeatDiscountCountdown();
							window.RESERVE_SEAT_DISCOUNT_COUNTDOWN_INTERVAL = setInterval(reserveSeatDiscountCountdown, 1000);
						</script>`;
						}
						html+=`
						<div class="d-flex" style="gap:10px;">
							<a href="javascript:void(0)" class="btn bg-light-primary text-primary rounded-10 font-weight-bold font-16 flex-grow-1" data-dismiss="modal">Maybe Later</a>
							<button onclick="acceptReserveASeatForNextGrade('${data.userId}')" class="btn btn-primary rounded-10 shadow btn-enroll font-weight-bold font-18 flex-grow-1">
								 ${data.eligibleFor == 'ADV' ? "Re-Enroll Now For The Next Grade" : "Reserve a Seat Now For Next Grade"}
							</button>
						</div>`;
						}else{
							html+=`<div class="bg-light-primary text-primary p-1 mx-0 mb-4 mt-2 font-weight-semi-bold rounded-10 font-18 font-weight-bold">
							Ready for ${nextGrade}?
						</div>
						<button onclick="acceptReserveASeatForNextGrade('${data.userId}')" class="btn btn-primary btn-block rounded-10 shadow btn-enroll font-weight-bold font-18">
							 ${data.eligibleFor == 'ADV' ? "Re-Enroll Now For The Next Grade" : "Reserve a Seat Now For Next Grade"}
						</button>`;
						}
					html+=`
					</div>
				</div>
			</div>
		</div>`
	return html;
}
