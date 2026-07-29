function cartDetailsOnLoadEvent(){
    if($("#cartDetailsStyle").length < 1){
        $("head").append(`
            <style id="cartDetailsStyle">
                .checkbox-lg{width: 17px;height: 17px;position: relative;top: 2.5px;}
            </style>
        `)
    }
    $("#dashboardContentInHTML").show();
    $("#dashboardContentInHTMLAdditional").hide();
}

async function getCartCount(userId) {
	var payload = {};
	payload['schoolId'] = SCHOOL_ID;
	payload['userId'] = userId;
	var data = await getDashboardDataBasedUrlAndPayload(true, true,'get-cart-count', payload);
	$("#cartCounts").html(cartCountContent(data, userId));
}
async function getCartDetails(userId) {
    var payload = {};
    payload['schoolId'] = SCHOOL_ID;
    payload['userId'] = userId;
    var data = await getDashboardDataBasedUrlAndPayload(true, true,'get-cart-details', payload);
    $("#dashboardContentInHTML").html(cartHeaderContent(data.details)+cartDetailContent(data.details, userId));
}

async function updateCartDetails(userId, type, bookId){
    var payload = {};
    payload['schoolId'] = SCHOOL_ID;
    payload['userId'] = userId;
    payload['type'] = type;
    payload['bookId'] = bookId;
    var data = await getDashboardDataBasedUrlAndPayload(true, true,'update-cart-details', payload);
    $("#dashboardContentInHTML").html(cartHeaderContent(data.details)+cartDetailContent(data.details, userId));
    $("#cartCounts").html(cartCountContent(data.details, userId));
}

async function addToCartPayment(amount, bookingIds, subjectId){
    var payload = {};
    payload['schoolId'] = SCHOOL_ID;
    payload['userId'] = USER_ID;
    payload['amount'] = amount;
    payload['bookingIds'] = bookingIds;
    payload['subjectId'] = subjectId;
    var data = await getDashboardDataBasedUrlAndPayload(true, true,'cart-payment', payload);
    $("#payTabBookingSessionModal").remove();
    $("body").append(renderCartPaymentTerms(data.details));
    $("#payTabBookingSessionModal").modal('show');
}

async function addToCartOrBuyNow(type, planId, planName, singleClassFee, planAmount, planCount, noOfWeeks, userId) {
    var planStartDate = changeDateFormat(new Date(), "yyyy-mm-dd");
    var planEndDate = getDateAfterNDays(noOfWeeks*7);
    var subjectId = '';
    $(".buyextraclass").each(function(index, element) {
        if($(element).hasClass('active')){
            subjectId=$(element).attr('courseId');
        }
    })
	var payload = {};
    payload['schoolId'] = SCHOOL_ID;
    payload['userId'] = userId;
    payload['subjectId'] = subjectId;
    payload['planId'] = planId;
    payload['planName'] = planName;
    payload['singleClassFee'] = singleClassFee;
    payload['planAmount'] = planAmount;
    payload['sessionCount'] = planCount;
    payload['planStartDate'] = planStartDate;
    payload['planEndDate'] = planEndDate;
    var data = await getDashboardDataBasedUrlAndPayload(true, true,'add-to-cart', payload);
    if(data.status != "1"){
        showMessageTheme2(0, data.message, '', false);
        return false;
    }
    showMessageTheme2(1, " Item added to your cart", '', false);
    await updateCartHeaderCount(userId);
    if(type == "buyNow"){
        renderCardDetailsContent(userId);
    }
}

async function updateCartHeaderCount(userId){
    await getCartCount(userId);
}

async function applyDiscountOnCart(formId, userId, appliedScholarshipCode ){
	hideMessage('');
	if($('#scholarshipCodeInside').length>0){
		if (!validateCharacters($('#scholarshipCodeInside').val().trim())) {
			showMessageTheme2(0, 'Please use the English Keyboard while providing information','',true);
			return false
		}
		if($('#scholarshipCodeInside').val().trim()=='' || $('#scholarshipCodeInside').val().trim()==' '){
			showMessageTheme2(0, "Enter a valid Scholarship code.",'',true);
			return false;
		}
	}

    var payload = {};
	payload['requestKey']='APPLY-SCHOLARSHIP';
	payload['paymentMode']='annually'
	payload['scholarshipCode']=$("#scholarshipCodeInside").val().trim();
	payload['appliedScholarshipCode']=appliedScholarshipCode;
	payload['scholarshipFor']='Teacher Assistance';
    payload['learningProgram']='Teacher Assistance';
    payload['userId']=userId

    var data = await getDashboardDataBasedUrlAndPayload(true, true,'apply-discount-on-cart', payload);
    if(data.status != "1"){
        showMessageTheme2(0, data.message, '', false);
        return false;
    }
    if(appliedScholarshipCode==2){
        $('#'+formId+' #scholarshipCodeInside').val('');
        $('#'+formId+' #scholarshipCode').val('');
        $('#scholarshipCodeInside').val('');
        showMessageTheme2(1, ' Discount code removed successfully ','',true);
    }else{
        showMessageTheme2(1, ' Discount code applied successfully','',true);
    }
    renderCardDetailsContent(userId);
}