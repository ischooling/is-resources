function renderCardDetailsContent(userId){
    let cartCount = parseInt($("#cartHeaderCount").text());
    if(cartCount<=0){
        showMessageTheme2(2, "Cart is empty", '', false);
        return false;
    }
    getCartDetails(userId);
    cartDetailsOnLoadEvent();
}

function cartHeaderContent(data){
    var html=
       `<div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon"> <i class="fa fa-shopping-cart text-primary"> </i> </div>
                    <div>Your Cart (<span id="cartCount">${data.length || data.cartCount}</span> Items)</div>
                </div>
            </div>
        </div>`;
    return html;
}

function cartDetailContent(data, userId){
    var html=
    `<div class="main-card mb-3 card">
        <div class="card-body">`;
            if(data.cartCount == 0){
                html+=
                `<h4 class="text-center text-primary font-weight-bold font-30 mt-3">
                    Oops!
                    <br>
                    There are no plans added to your cart.
                </h4>
                <div class="full mt-2 mb-2 p-2 text-center">
                    <a class="btn btn-lg btn-primary " href="javascript:void(0)" onclick="return callDashboardPageSchool(89,'student-addon');"> Browse Plans </a>
                </div>`
            }else{
                html+=
                `<div class="row">
                    <div class="col-md-8 cart-item-list">
                        <div class="cart-wrapper rounded-10 border  p-3">
                            <ul class="item-list vertical-timeline--animate">`;
                                $.each(data.cart.cartItems, function(i,item){
                                    var noOfWeeks = getWeeksBetweenDates(item.planStartDate, item.planEndDate);
                                    html+=
                                    `<li class="item vertical-timeline-element-content ml-0 bounce-in">
                                        <span class="item-img">
                                            <img src="${item.imgURl}" alt="course-img" style="aspect-ratio: 1; object-fit: cover;" />
                                        </span>
                                        <div class="item-info">
                                            <h4 class="item-name font-20 font-weight-bold mb-1">${item.subjectName}</h4>
                                            <h5 class="item-type font-16 mb-1">
                                                <label class="label mr-2">No. of Classes:</label>
                                                <span class="font-weight-bold"> ${item.classCount} extra `+(item.classCount==1?'class':'classes')+`</span>
                                            </h5>
                                            <h5 class="item-type font-16 mb-1">
                                                <label class="label mr-2">Plan Duration:</label>
                                                <span class="font-weight-bold">${item.planStartDate} - ${item.planEndDate} (${noOfWeeks == 1 ? noOfWeeks + ' week' : noOfWeeks + ' weeks'})</span>
                                            </h5>
                                            <h6 class="item-type font-16 mb-1 flex-wrap">
                                                <label class="label mr-2">Plan Fee:</label>
                                                <span class="font-weight-bold">${schoolSettingsTechnical.currencySymbol} `+(parseFloat(item.planAmount).toFixed(2))+`</span>
                                                <div class="ml-auto">
                                                    <a href="javascript:void(0)" class="btn btn-danger " onclick="updateCartDetails(${userId},'remove',${item.cartId});">
                                                        <i class="fa fa-trash"></i>
                                                    </a>
                                                    <a href="javascript:void(0)" class="btn btn-primary " onclick="renderBuyExtraClasses(${userId}, ${item.subjectId});">
                                                        <i class="fa fa-edit"></i>
                                                    </a>
                                                </div>
                                            </h6>
                                        </div>
                                    </li>`;
                                });
                            html+=`</ul>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="full rounded-10 border p-3">
                            <div class="cart-price-details mt-3">
                                <input type="hidden" name="bookingId" id="bookingId" value="${data.cart.bookSessionIds}">
                                <input type="hidden" name="userIdAddon" id="userIdAddon" value="${userId}">
                                <h6 class="font-20 font-weight-bold mb-3">Fee Details</h6>
                                <ul class="price-type-list">
                                    <li class="list-item font-18 font-weight-semi-bold mb-3">
                                        <span class="type">Cart Total</span>
                                        <span class="price">${schoolSettingsTechnical.currencySymbol} `+(parseFloat(data.cart.cartTotal).toFixed(2))+`</span>
                                    </li>
                                    <li class="list-item font-18 font-weight-semi-bold">
                                        <span class="type">Discount Code</span>
                                        <span class="price">${data.cart.discountCode == '' ? '' : schoolSettingsTechnical.currencySymbol+' '+parseFloat(data.cart.cpDiscount).toFixed(2)}</span>
                                    </li>
                                    <li class="list-item font-16 font-weight-semi-bold mb-4">
                                        <div class="input-group">
                                        <input type="text" class="form-control" id="scholarshipCodeInside" name="scholarshipCode" value="${data.cart.discountCode == '' ? '' : data.cart.discountCode}" maxlength="15" onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);" ${data.cart.discountCode == '' ? '' : 'disabled'}>
                                            <div class="input-group-append">
                                                <button class="btn btn-primary font-16" onclick="return applyDiscountOnCart('addonPaymentForm', ${userId}, ${data.cart.discountCode == '' ? '1' : 2});" data-toggle="tooltip" title=" Apply Discount Code">${data.cart.discountCode == '' ? 'Apply' : 'Remove'}</button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <div class="total-price">
                                    <h6 class="font-16 font-weight-semi-bold">
                                        Total <span class="float-right">${schoolSettingsTechnical.currencySymbol} `+(parseFloat(data.cart.totalPayAmount).toFixed(2))+`</span>
                                    </h6>
                                </div>
                                <div class="full mt-3">
                                    <button class="btn btn-primary w-100 p-2 font-20" 
                                    onclick="addToCartPayment('${data.cart.totalPayAmount}','${data.cart.bookSessionIds}','${data.cart.subjectId}')"
                                    ${data.cart.errorMsg == 'Discounted amount is more than the total amount' ? "disabled" : ""}
                                    >
                                        CONFIRM AND PAY
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
            }
        html+=`</div>
    </div>`
    return html;
}

function cartCountContent(data, userId){
    var html=
        `<a href="javascript:void(0);" onclick="renderCardDetailsContent(${userId});" class="p-0 mr-2 btn"> 
           <span class="icon-wrapper icon-wrapper-alt rounded-circle"> 
                <span class="icon-wrapper-bg bg-warning"></span> 
                <i class="fa fa-shopping-cart text-warning "></i> 
                <span id="cartHeaderCount" class="badge  badge badge-pill text-white badge-warning position-absolute ml-4 p-1">${data.length || data.cartCount}</span> 
           </span> 
         </a>`
    return html;
}

function renderCartPaymentTerms(data){
    var html=
        `<div id="payTabBookingSessionModal" class="modal fade fade-scale" role="dialog">
            <div class="modal-dialog modal-xl modal-dialog-centered box-shadow-none">
                <div class="modal-content">
                    <div class="modal-header pt-2 pb-2 theme-bg text-white">
                        <h5 class="modal-title">Terms and Conditions</h5>
                        <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body" id="bookSessionTermModal">
                        <p class="scroll-down" style="margin-top:5px;"><a href="#" class="animate"></a></p>
                        <form id="bookSessionTerm" name="bookSession" method="post" autocomplete="off">
                            <input type="hidden" id="userId" value="${USER_ID}" />
                            <input type="hidden" id="paymentType" value="annually" />
                            <div class="agree">`;
                                if(data.planStatus === 'b' || data.planStatus === 'bd'){
                                    html+=`<p><b>Please note the important fee refund policy and terms & conditions before enrolling for Extra Classes:</b></p>`;
                                }else{
                                    html+=`<p><b>Please note the below important terms and conditions before enrolling for Discovery Education Add-on:</b></p>`;
                                }
                                html+=`<ol style="list-style: auto;" class="pl-4">`;
                                    if(SCHOOL_ID==5 && (data.planStatus === 'b'  || data.planStatus === 'bd')){
                                        html+=
                                        `<li>Each student receives one complimentary class per Grade.</li>
                                        <li>Extra Classes are defined as doubt-clearing classes which are in addition to your one complimentary class per Grade.</li>
                                        <li>Students have to pay in full for the Extra Classes in advance.</li>
                                        <li>The fee will be accepted through the online payment method only.</li>
                                        <li>All your Extra Classes will be pre-booked by you at the beginning of every month. There are time periods in which you can book for the Extra Classes. You will be notified duly about your Extra Classes Schedule via mail.</li>
                                        <li>In case you want to change the date and/or timings of your Extra Classes, you will have to inform ${schoolSettings.schoolName} via mail at least 7 days in advance.</li>
                                        <li>Under any circumstances/conditions, fees for Extra Classes are not refundable or transferable. Absence is not valid for any compensation class or refund of fee.</li>
                                        <li>The class will be compensated only if it is canceled by ${schoolSettings.schoolName}. The compensation will occur only through policies of ${schoolSettings.schoolName}. You cannot claim a refund of fees in such cases.</li>`
                                    }else if(SCHOOL_ID==1 && (data.planStatus === 'b' || data.planStatus === 'bd')){
                                        if(data.standardId>=11 && data.standardId<=17){
                                            html+=`<li>Extra Classes are defined as doubt-clearing classes which are in addition to your complimentary classes. For example, 2 extra classes per week mean 1 complimentary doubt-clearing class + 2 extra doubt-clearing classes = 3 doubt-clearing classes per week.</li>`;
                                        }else{
                                            html+=`<li>Extra Classes are defined as doubt-clearing classes which are in addition to your complimentary classes. For example, 2 extra classes per week mean 1 complimentary doubt-clearing class + 2 extra doubt-clearing classes = 3 doubt-clearing classes per week.</li>`;
                                        }
                                        html+=
                                        `<li>Students have to pay in full for the Extra Classes in advance.</li>
                                        <li>Fees will be accepted through online payment methods only.</li>
                                        <li>All your Extra Classes will be pre-booked at the beginning of every month. You will be notified duly about your Extra Classes Schedule via mail.</li>
                                        <li>In case you want to change the date and/or timings of your Extra Class(s), you will have to inform ${schoolSettings.schoolName} via mail at least 7 days in advance.</li>
                                        <li>Under any circumstances/conditions, fee for Extra Class is non-refundable, non-transferable and non-adjustable. Absence is not valid for any compensation class or refund of fee.</li>
                                        <li>The class will be compensated only if it is canceled by ${schoolSettings.schoolName}. The compensation will occur only through policies of ${schoolSettings.schoolName}. You cannot claim a refund of fees in such cases.</li>
                                        <li>Students (or their parents/guardians) are responsible for regularly checking the website for any upcoming notifications. ${schoolSettings.schoolName} will not send notifications or updates separately to students (or their parents/guardians)</li>
                                        <li>${schoolSettings.schoolName} reserves the right to amend, limit or revoke any offers or terms at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>`
                                    }else if(planStatus === 'd'){
                                        html+=`<li>Under any circumstances/conditions, fees for Discovery Education Add-on is not refundable or transferable.</li>`;
                                    }else{
                                        if(data.standardId>=11 && data.standardId<=17){
                                            html+=`<li>Extra Classes are defined as doubt-clearing classes which are in addition to your complimentary classes. For example, 2 extra classes per week mean 1 complimentary doubt-clearing class + 2 extra doubt-clearing classes = 3 doubt-clearing classes per week.</li>`;
                                        }else{
                                            html+=`<li>Extra Classes are defined as doubt-clearing classes which are in addition to your complimentary classes. For example, 2 extra classes per week mean 1 complimentary doubt-clearing class + 2 extra doubt-clearing classes = 3 doubt-clearing classes per week.</li>`;
                                        }
                                        html+=
                                        `<li>Students have to pay in full for the Extra Classes in advance.</li>
                                        <li>Fees will be accepted through online payment methods only.</li>
                                        <li>All your Extra Classes will be pre-booked at the beginning of every month. You will be notified duly about your Extra Classes Schedule via mail.</li>
                                        <li>In case you want to change the date and/or timings of your Extra Class(s), you will have to inform ${schoolSettings.schoolName} via mail at least 7 days in advance.</li>
                                        <li>Under any circumstances/conditions, fee for Extra Class is non-refundable, non-transferable and non-adjustable. Absence is not valid for any compensation class or refund of fee.</li>
                                        <li>The class will be compensated only if it is canceled by ${schoolSettings.schoolName}. The compensation will occur only through policies of ${schoolSettings.schoolName}. You cannot claim a refund of fees in such cases.</li>
                                        <li>Students (or their parents/guardians) are responsible for regularly checking the website for any upcoming notifications. ${schoolSettings.schoolName} will not send notifications or updates separately to students (or their parents/guardians)</li>
                                        <li>${schoolSettings.schoolName} reserves the right to amend, limit or revoke any offers or terms at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>`
                                    }
                                    if(data.planStatus === 'bd'){
                                        html+=
                                        `<p><b>Please note the below important terms and conditions before enrolling for Discovery Education Add-on:</b></p>
                                        <li>Under any circumstances/conditions, fees for Discovery Education Add-on is not refundable or transferable.</li>`
                                    }
                                html+=`</ol>			
                                <div class="modal-footer" style="text-align:left;">
                                    <div class="col-sm-12 col-xs-12" style="flex:1">
                                        <input type="checkbox" id="chkvalBookSession" class="checkbox-lg" name="chkvalBook">
                                        <label for="chkvalBookSession" style="position: relative;top: -0.5px;color: #333;cursor: pointer;" >I confirm that I have read and agree to the above-mentioned fee refund policy and terms & conditions.</label>
                                    </div>
                                    <button type="button" id="payBookingSessionTabData" class="btn btn-success" disabled="disabled" onclick="callClientCommonPaymentGateway('bookSessionPaymentModal','student','${USER_ID}','${data.userPaymentDetailsId}','booksession','${USER_ID}');" style="float:right">Pay Now</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}