var schoolSettingsLinks;
async function renderSchoolPayment(){
	schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
    var html=
        `<div class="px-4 mt-2">`
            // +dashboardHeaderContent()
            +schoolPaymentCard()
            +schoolPaymentFilterAndTable()
            +viewStudentList()
            +studentFeesModalContent()
        html+=`</div>`
        getPartnerSchoolPaymentDetails('paymentSeachForm');
		getPartnerSchools(SCHOOL_ID);
        html+=`<div class="server-message">
            <span class="msg" id="msgTheme2"></span>
        </div>
		<div id="commonloaderId" class="unique-loader loader-bg" style="display:none;">`
			if(SCHOOL_ID==1){
				html+=`<img src="${PATH_FOLDER_IMAGE2}loader-new.gif" alt="${SCHOOL_NAME} Loader" class="new-loader-2024" />`;
			}else{
				html+=
				`<div id="commonloaderBody" class="loader" style="display:none">
				Please Wait... <span></span>
				</div>`
			}
    	html+=`</div>`
    return html;
}

function dashboardHeaderContent(){
    var html=
        `<div class="sticky-header bg-white">
            <div class="app-header header-shadow">
                <div class="app-header__logo">
                    <a href="${schoolSettingsLinks.schoolWebsite}" target="blank" class="logo-src" style="background:url('${schoolSettingsLinks.logoUrl}');"></a>
                </div>
                <div class="app-header__logo"></div>
            </div>
        </div>`
    return html;
}

function schoolPaymentCardSkeleton(){
    var html=
        `<div class="d-flex w-50 ml-1 mt-3">
            <div class="skeleton p-2 rounded-10 mr-2 mb-2 shadow-sm flex-grow-1" style="width:240px;height:80px;"></div>
            <div class="skeleton p-2 rounded-10 mr-2 mb-2 shadow-sm flex-grow-1" style="width:240px;height:80px;"></div>
            <div class="skeleton p-2 rounded-10 mr-2 mb-2 shadow-sm flex-grow-1" style="width:240px;height:80px;"></div>
        </div>`
    return html;
}

function schoolPaymentCard(){
    var html=
        `<div class="main-card mb-3 card rounded-10">
            <div class="card-body">
                <h5 class="font-weight-semi-bold text-dark">Enrollment Partner/ School Payment</h5>`
                // +schoolPaymentCardSkeleton()
                html+=`<div class="d-flex w-50 ml-1 mt-3">
                    <div class="p-2 rounded-10 mr-2 mb-2 shadow-sm flex-grow-1" style="width:100%; background-color:#CCE5FF;">
                        <p class="m-0 pb-2 border-bottom" style="border-color:#ADC2D8 !important"><b>Total Payout to IS</b></p>
                        <p id="total_amount" class="mb-0 pt-2 font-weight-bold" style="font-size:18px;"></p>
                    </div>    
                    <div class="p-2 rounded-10 mr-2 mb-2 shadow-sm flex-grow-1" style="width:100%; background-color:#FDF2D3;">
                        <p class="m-0 pb-2 border-bottom" style="border-color:#ADC2D8 !important"><b>Pending</b></p>
                        <p id="pending_amount" class="mb-0 pt-2 font-weight-bold" style="font-size:18px;"></p>
                    </div>    
                    <div class="p-2 rounded-10 mr-2 mb-2 shadow-sm flex-grow-1" style="width:100%; background-color:#D3F4DA;">
                        <p class="m-0 pb-2 border-bottom" style="border-color:#ADC2D8 !important"><b>Paid</b></p>
                        <p id="paid_amount" class="mb-0 pt-2 font-weight-bold" style="font-size:18px;"></p>
                    </div>    
                </div>
            </div>
        </div>`
    return html;
}

function schoolPaymentFilterAndTable(){
    var html=
        `<div class="main-card mb-3 card rounded">
            <div class="card-body">`
                +schoolPaymentFilter()
                +schoolPaymentTable()
                +schoolPaymentTableSkeleton()
            html+=`</div>
        </div>`
    return html;
}

function schoolPaymentFilter(){
    var html=
        `<h5 class="font-weight-semi-bold text-dark">Payment Search</h5>
            <div class="col-12 mb-2 border rounded-10 pb-3 pt-4 px-4 mb-4 bg-light-primary">
                <div class="">
                    <form id="paymentSeachForm">
                        <div class="row">
							<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
								<label for="schoolName" class="full text-primary">School Name</label>
								<select id="schoolName" class="form-control" onchange="getPartnerOnSchoolId(this);">
									<option value="ALL">Select School Name</option>
								</select>
							</div>
							<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="partnerName" class="full text-primary">Partner Name</label>
                                <select id="partnerName" disabled class="form-control"></select>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="academicSession" class="full text-primary">Academic Session</label>
                                <select id="academicSession" class="form-control"></select>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="transactionNo" class="full text-primary">Transaction No.</label>
                                <input type="text" id="transactionNo" class="form-control" />
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="userRefNo" class="full text-primary">User Reference No.</label>
                                <input type="text" id="userRefNo" class="form-control" />
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="paymentVia" class="full text-primary">Payment Via</label>
                                <select id="paymentVia" class="form-control">
                                    <option value="">Select Payment Via</option>
                                    <option value="card">Credit Card/Debit Card</option>
                                    <option value="bankTransfer">Bank Transfer</option>
                                    <option value="cash">Cash</option>
                                </select>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="paymentGatewayUsed" class="full text-primary">Payment Gateway Used</label>
                                <select id="paymentGatewayUsed" class="form-control">`
                                    +getPaymentBySchoolId(SCHOOL_ID)
                                html+=`</select>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="proofOfPayment" class="full text-primary">Proof of Payment</label>
                                <select id="proofOfPayment" class="form-control">
                                    <option value="">Select Proof of Payment</option>
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                </select>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="paymentReviewed" class="full text-primary">Payment Reviewed</label>
                                <select id="paymentReviewed" class="form-control">
                                    <option value="">Select Payment Reviewed</option>
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                </select>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="paymentStatus" class="full text-primary">Payment Status</label>
                                <select id="paymentStatus" class="form-control">
                                    <option value="">Select Payment Status</option>
                                    <option value="SUCCESS">Success</option>
                                    <option value="SCHEDULED">Scheduled</option>
                                    <option value="INITIATED">Initiated</option>
                                    <option value="REJECTED">Rejected</option>
                                    <option value="FAILURE">Failure</option>
                                    <option value="PENDING">Pending</option>
                                </select>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="paymentDateFrom" class="full text-primary">Payment Date From</label>
                                <input type="text" style="background-color:white;" id="paymentDateFrom" placeholder="Select Payment Date From" readonly class="form-control" />
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="paymentDateTo" class="full text-primary">Payment Date To</label>
                                <input type="text" style="background-color:white;" id="paymentDateTo" placeholder="Select Payment Date To" readonly class="form-control" />
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="orderBy" class="full text-primary">Order By</label>
                                <select id="orderBy" class="form-control">
									<option value="scheduledPaymentDate">Initiated Payment Date</option>
                                    <option value="paymentDate">Payment Date</option>
                                </select>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="sortIn" class="full text-primary">Sort in</label>
                                <select id="sortIn" class="form-control">
                                    <option value="D">Descending</option>
                                    <option value="A">Ascending</option>
                                </select>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <label for="noOfRecords" class="full text-primary">No. of Records</label>
                                <input type="text" value="25" id="noOfRecords" class="form-control" />
                            </div>
                            <div class="col-12 mt-2 text-right mb-2">`
								if(USER_ROLE != "DIRECTOR"){
									html+=`<a href="javascript:void(0)" onclick="openStudentFeesModal();" class="btn btn-primary btn-shadow float-right pr-4 pl-4 mr-2">Pay Student Fees</a>`;
								}
                                html+=`<a href="javascript:void(0)" onclick="resetPartner()" class="btn btn-danger btn-shadow float-right pr-4 pl-4 mr-2">Reset</a>
                                <a href="javascript:void(0)" onclick="currentPagePaymentList=1;getPartnerSchoolPaymentDetails('paymentSeachForm');" class="btn btn-success btn-shadow float-right pr-4 pl-4 mr-2" id="searchPayment">Search</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>`
    return html;
}

function schoolPaymentTableSkeleton(){
    var html=
        `<div class="col-12 mb-2 px-0" id="enroll-list-skeleton" style="display:block;">
            <table class="table table-bordered table-striped without_h_scroll" style="">
                <thead class="theme-bg primary-bg white-txt-color">
                    <tr>
                        <th class="skeleton">&nbsp;</th>
                        <th class="skeleton">&nbsp;</th>
                        <th class="skeleton">&nbsp;</th>
                        <th class="skeleton">&nbsp;</th>
                        <th class="skeleton">&nbsp;</th>
                        <th class="skeleton">&nbsp;</th>
                        <th class="skeleton">&nbsp;</th>
                        <th class="skeleton">&nbsp;</th>
                        <th class="skeleton">&nbsp;</th>
                        <th class="skeleton">&nbsp;</th>
                        <th class="skeleton">&nbsp;</th>
                        <th class="skeleton">&nbsp;</th>
                        <th class="skeleton">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                    </tr>
                    <tr>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                    </tr>
                    <tr>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                        <td class="skeleton" height="50px"></td>
                    </tr>
                </tbody>
            </table>
        </div>`
    return html;
}

function schoolPaymentTable(){
    var html=
        `<h5 class="font-weight-semi-bold text-dark mb-2">Payment List</h5>`
        html+=`<div class="table-responsive col-12 px-0" id="paymentListDiv" style="display:none;">
            <table class="table table-bordered font-12 border-radius-table" style="min-width:1300px;width:100%;font-size:11px !important" id="paymentListTable">
                <thead>
                    <tr>`
                        if(USER_ROLE == "DIRECTOR"){
                            html+=`<th class="bg-primary text-white bold rounded-top-left-10 border-bottom-0 vertical-align-top border-primary" style="border-top-color:transparent;border-right-color:#fff !important">School Name</th>`
                        }
                        html+=`<th class="bg-primary text-white bold ${USER_ROLE != "DIRECTOR" ? "rounded-top-left-10" : ""} border-bottom-0 vertical-align-top border-primary" style="border-top-color:transparent;border-right-color:#fff !important">Partner Name</th>
                        <th class="bg-primary text-white bold border-bottom-0 vertical-align-top">Transaction No.</th>
                        <th class="bg-primary text-white bold border-bottom-0 vertical-align-top">User Reference No.</th>
                        <th class="bg-primary text-white bold border-bottom-0 vertical-align-top">Payment Via/ Gateway Used</th>
                        <th class="bg-primary text-white bold border-bottom-0 vertical-align-top">Payment Name</th>
                        <th class="bg-primary text-white bold border-bottom-0 vertical-align-top">Payment Amount (USD)</th>
                        <th class="bg-primary text-white bold border-bottom-0 vertical-align-top">Proof of Payment</th>
                        <th class="bg-primary text-white bold border-bottom-0 vertical-align-top">Payment Status</th>
                        <th class="bg-primary text-white bold border-bottom-0 vertical-align-top">View Receipt</th>
                        <th class="bg-primary text-white bold border-bottom-0 vertical-align-top">Student List</th>
                        <th class="bg-primary text-white bold border-bottom-0 vertical-align-top">Payment Initiated Date</th>
                        <th class="bg-primary text-white bold border-bottom-0 vertical-align-top ${USER_ROLE != "DIRECTOR" ? "rounded-top-right-10" : ""}">Payment Reviewed Date</th>`
                        if(USER_ROLE == "DIRECTOR"){
                            html+=`<th class="bg-primary text-white bold border-bottom-0 vertical-align-top rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Action</th>`
                        }
                    html+=`</tr>
                </thead>
                <tbody id="paymentListTableBody"></tbody>
            </table>
			<div id="schoolPaymentPaginationContainer" class="text-center mt-4">
        </div>`;
    return html;
}

function viewStudentList(){
    var html=
        `<div id="studentListModal" class="modal fade" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Student List Details</h5>
                        <button type="button" class="btn-close close text-white" data-dismiss="modal" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <table id="studentListTable" class="table table-bordered">
                            <thead style="background-color:#C2DDF9;">
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Grade</th>
                                    <th>Leaning Program</th>
                                    <th>Payment Amount</th>
                                </tr>
                            </thead>
                            <tbody id="studentListTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function studentFeesModalContent(){
    var html = `
        <div class="modal fade pr-0 right-slide-modal" id="studentFeesModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-xl p-0 float-right">
                <div class="modal-content">
                    <div class="modal-header bg-primary py-2">
                        <h5 class="modal-title text-white w-100">Pay Students Fees</h5>
                        <button type="button" class="close bg-white rounded-top-left-10 rounded-bottom-left-10 opacity-10 p-2" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-32px;top:62px">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body overflow-y-auto">
                        <form id="searchStudentFees" class="full">`
                            +searchStudentFeesContent()
                        html+=`</form>`
                        +studentFeesTable()
                    html+=`</div>
                </div>
            </div>
        </div>`;
    return html;
}

function searchStudentFeesContent(){
    var html=
        `<div class="row mb-3">
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <label for="partnerNameSearch" class="full text-primary">Partner Name</label>
                <select id="partnerNameSearch" class="form-control" disabled='true'>
                </select>
            </div>
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <label for="studentIdSearch" class="full text-primary">Student ID</label>
                <input type="text" id="studentIdSearch" class="form-control" />
            </div>
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <label for="studentNameSearch" class="full text-primary">Student Name</label>
                <input type="text" id="studentNameSearch" class="form-control" />
            </div>
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <label for="gradeSearch" class="full text-primary">Grade</label>
                <select id="gradeSearch" class="form-control"></select>
            </div>
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <label for="learningProgramSeach" class="full text-primary">Learning Program</label>
                <select id="learningProgramSeach" class="form-control">
                    <option value="One to One Learning">One to One Learning</option>
                    <option value="Group Learning">Group Learning</option>
                    <option value="Self Study Learning">Self Study Learning</option>
                </select>
            </div>
            ${/*<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <label for="paymentTypeSearch" class="full text-primary">Payment Type</label>
                <select id="paymentTypeSearch" class="form-control">
                    <option value="One Time Installment">One Time Installment</option>
                    <option value="1st Installment">1st Installment</option>
                    <option value="2nd Installment">2nd Installment</option>
                    <option value="3rd Installment">3rd Installment</option>
                </select>
            </div>*/''}
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <label for="paymentDateFromSearch" class="full text-primary">Payment Date From</label>
                <input type="text" id="paymentDateFromSearch" class="form-control" />
            </div>
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <label for="paymentDateToSearch" class="full text-primary">Payment Date To</label>
                <input type="text" id="paymentDateToSearch" class="form-control" />
            </div>
            <div class="col-12 mt-2 text-right mb-2">
				<button type="reset" class="btn btn-primary btn-shadow float-right pr-4 pl-4 mr-2" id="resetStudentFeesBtn">Reset</button>
                <a href="javascript:void(0)" class="btn btn-success btn-shadow float-right pr-4 pl-4 mr-2" id="searchStudentFeesBtn" onclick="getPayStudentFeesDetais('searchStudentFees')">Search</a>
            </div>
        </div>`
    return html;
}

function studentFeesTable(){
    var html = `
        <div class="row">
            <div class="col-12 overflow-y-auto" style="max-height:425px;">
                <table class="table table-bordered font-12" id="studentFeesTableSearch">
                    <thead>
                        <tr style="top:0;left:0;z-index:1;" class="position-sticky bg-primary">
                            <th style="width:6%;" class="font-weight-bold text-white rounded-top-left-10 border-bottom-0 ">
                                <span class="mr-3">
                                    <input type="checkbox" id="selectAll" class="paymentCheck" />
                                </span>
                                All
                            </th>
                            <th class="font-weight-bold text-white border-bottom-0">Partner Name</th>
                            <th class="font-weight-bold text-white border-bottom-0">Student ID</th>
                            <th class="font-weight-bold text-white border-bottom-0" style="width:12%;">Student Name | Grade</th>
                            <th class="font-weight-bold text-white border-bottom-0">Learning Program</th>
                            <th class="font-weight-bold text-white border-bottom-0">IS Fees</th>
                            <th class="font-weight-bold text-white border-bottom-0">Student Fees</th>`;
                            // <th class="font-weight-bold text-white border-bottom-0">Student Fees Pay Date</th>
					html += `<th class="font-weight-bold text-white border-bottom-0">Revenue</th>
                            <th class="font-weight-bold text-white border-bottom-0">Payable to IS</th>
                            <th class="font-weight-bold text-white border-bottom-0">Commision Type | Rate</th>
                            <th style="width:10%;" class="font-weight-bold text-white border-bottom-0">Payable to IS Input</th>
                        </tr>
                    </thead>
                    <tbody id="schoolPaymentTable" style="max-height:420px;"></tbody>
					<tfoot id="schoolPaymentTableFoot"></tfoot>
                </table>
            </div>
			<div class="col-12 text-right mt-2">
				<a href="javascript:void(0)" onclick="openPartnerPaymentModal();" class="btn btn-primary btn-shadow float-right pr-4 pl-4 mr-2">Confirm & Pay</a>
			</div>
        </div>`;
    return html;
}

function callPaymentPartnerModal(data){
    // data = '' // for dummy
	var html ='';
	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null || data.pgsCash!=null || data.pgsAlternate!=null){
		html=
		'<div id="callPaymentPartnerModal" class="modal theme-modal fade payment-opiton-modal" role="dialog" data-backdrop="static" data-keyboard="false" style="overflow: auto;">'
			+'<div class="modal-dialog modal-lg">'
				+'<div class="modal-content">'
					+'<div class="modal-header primary-bg white-txt-color" style="padding: 10px;">'
						+'<button type="button" class="close close-with-red-color" data-dismiss="modal" aria-label="Close">'
							+'<span aria-hidden="true" style="color: #fff;">×</span>'
						+'</button>'
						+'<h4 class="modal-title" style="font-size: 14px">&nbsp;</h4>'
					+'</div>'
					+'<div class="modal-body" style="margin-top: 0 !important; position: relative; padding: 15px !important;">'
						+'<section class="payment-option-wrapper">'
							+'<div class="full">'
								+'<h4 class="section-heading primary-bg-before primary-bg-after">PAYMENT OPTIONS AVAILABLE</h4>'
								// +'<span style="width:100%;display:inline-block"><i class="fa fa-star text-primary"></i>&nbsp;'+SCHOOL_NAME+' is trusted by the safest and most reputed payment '+(SCHOOL_ID==1?'gateways, banks and wallets':'gateway and bank')+'</span>'
								// +'<button type="button" class="close" data-dismiss="modal" style="margin-top: -50px; color: #fff">&times; 2</button>'
							+'</div>'
							+'<div class="tab-wrapper">'
								+'<div class="payment-tabs">'
									+'<ul class="nav-tabs" role="tablist">';
										if(data.pgs!=null){
											html+=
											'<li role="presentation" class="'+(data.pgs!=null?"active":"")+' primary-bg-active">'
												// +'<a href="#credit-card-payment" aria-controls="uploadTab" role="tab" data-toggle="tab" class="payment-option-itme active-tab primary-border-color ">Pay via '+data.pgs.gatewayName+'</a>'
												+'<a href="#credit-card-payment" aria-controls="uploadTab" role="tab" data-toggle="tab" class="payment-option-itme active-tab primary-border-color ">Option 1: Pay via '+data.pgs.gatewayLabel+'</a>'
											+'</li>';
										}
										if(data.pgswu!=null){
											html+=
											'<li class="tab-item '+(data.pgs==null?"active":"")+' primary-bg-active primary-border-color">'
												+'<a href="#westernUnion" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">'+data.pgswu.gatewayLabel+'</a>'
											+'</li>';
										}
										if(data.pgswt!=null){
											if(SCHOOL_ID == 6){
												html+=
												'<li class="tab-item '+(data.pgs==null && data.pgswu==null?"active":"")+' primary-bg-active">'
													+'<a href="#wire-payment" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">'+data.pgswt.gatewayLabel+'</a>'
												+'</li>';
											}else{
												html+=
												'<li class="tab-item '+(data.pgs==null && data.pgswu==null?"active":"")+' primary-bg-active">'
													+'<a href="#wire-payment" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">'+data.pgswt.gatewayLabel+'</a>'
												+'</li>';
											}
										}
										if(data.pgsAlternate!=null){
											html+=
											'<li class="tab-item primary-border-color'+(data.pgs==null && data.pgswu==null?"active":"")+' primary-bg-active">'
												// +'<a href="#alternate-payment" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">Pay via '+toTitleCase(data.pgsAlternate.gatewayName)+'</a>'
												+'<a href="#alternate-payment" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">Option 2: Pay via '+toTitleCase(data.pgsAlternate.gatewayName)+'</a>'
											+'</li>';
										}
										if(data.pgsCash!=null){
											html+=
											'<li class="tab-item primary-bg-active">'
												+'<a href="#cash-payment" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">'+data.pgsCash.gatewayLabel+'</a>'
											+'</li>';
										}
										html+=
									'</ul>'
								+'</div>'
								+'<div class="payment-option tab-content">'
									+'<div role="tabpanel" id="credit-card-payment" class="tab-pane '+(data.pgs!=null?"active":"")+' credit-card-payment flex-item primary-border-color">'
										+'<div id="primary-pg" style="display:block;">'
											+'<div class="payment-icon lg">';
												if(data.pgName=='Stripe'){
													html+='<img src="'+PATH_FOLDER_IMAGE+'STRIPE.png">';
												}else if(data.pgName=='Smoovpay'){
													html+='<img src="'+PATH_FOLDER_IMAGE+'SMOOVPAY.png">';
												}else if(data.pgName=='Airwallex'){
													html+='<img src="'+PATH_FOLDER_IMAGE+'AIRWALLEX.png">';
												}else if(data.pgName=='WELLSFARGO'){
													html+='<img src="'+PATH_FOLDER_IMAGE+'wells_fargo.png">';
												}
												html+=
											'</div>'
											+'<div class="payment-icon m-0">'
												+'<div class="payment-method-icon">'
													+'<img src="'+PATH_FOLDER_IMAGE+'visa.png">'
													+'<p>Visa</p>'
												+'</div>'
												+'<div class="payment-method-icon">'
													+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png">'
													+'<p>Mastercard</p>'
												+'</div>'
											+'</div>';
											// +'<div class="payment-icon">'
											// 	+'<h3 class="fw-600">PAYMENT METHOD</h3>'
											// 	+'<img src="'+PATH_FOLDER_IMAGE+'visa.png">'
											// 	+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png">'
											// +'</div>';
											// if(data.enrollmentType!='REGISTRATION_REGISTER'){
											// 	html+='<p>Your SMS profile will be created instantly after successful payment</p>';
											// }
											if(data.schoolId==1 || data.schoolId==2){
												html+=
												'<div class="payment-icon " style="margin-top:0;margin-bottom:10px;justify-content:flex-end">'
													+'<div class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=REGISTRATION_SUBJECT_FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \''+data.pgs.gatewayName+'\');">'
														+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;">Pay Now</span>'
													+'</div>'
												+'</div>';
											}
											if(data.cr !=null && data.pgs.gatewayName=='Smoovpay'){
												html+=
												'<div class="full">'
													+'<p>Our payment partner will display the Course Fees in Singapore Dollars on the payment page. The current Singapore Dollar rate is:</p>'
													+'<p> <strong>1 '+data.fromCurrency+' = '+data.cr.conversionRation+' '+data.toCurrency+'</strong> </p>'
													+'<p> <strong>Total payable fee: '+data.finalPayableAmountAfterCalculation+' '+data.toCurrency+'</strong></p>'
												+'</div>';
											}
											if(data.pgs != null && data.pgs.gatewayName=='Smoovpay'){
												html+=
												'<div class="payment-icon " style="margin-top:0;margin-bottom:10px;justify-content:flex-end">'
													+'<div class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=REGISTRATION_SUBJECT_FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \''+data.pgs.gatewayName+'\');">'
														+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;">Pay Now</span>'
													+'</div>'
												+'</div>';
											}else if(data.pgs != null && data.pgs.gatewayName=='Airwallex'){
												html+=commonAirwallexCheckout(data);
											}else if(data.pgs != null && data.pgs.gatewayName=='YOCO'){
												html+=commonYocoCheckout(data);
											}
											html+=
										'</div>'
									+'</div>';
									if(data.pgswu!=null){
										html+=
										'<div role="tabpanel" id="westernUnion" class="tab-pane '+(data.pgs==null?'active':'')+' credit-card-payment flex-item primary-border-color">'
											+'<div class="payment-icon lg">'
												+'<img src="'+PATH_FOLDER_IMAGE+'/convera-logo.svg">'
												+'<p>&nbsp;</p>'
												+'<h4 class="full fw-600 text-left">Payment Processing Time:</h4>'
												+'<strong class="full fw-600">Card Payments: Upto 3 business days</strong>'
												+'<strong class="full fw-600">Bank Transfer: 2-7 business days</strong>'
											+'</div>'
											+'<div class="payment-icon" style="margin-bottom:0">'
												+'<h3 class="fw-600 text-left">Pay money from the comfort of your own home – Reliable, convenient international money transfer using your home/local currency</h3>'
												+'<p>&nbsp;</p>'
												+'<div class="row">'
													+'<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">'
														+'<ul class="full mt-4">'
															+'<li>'
																+'<h4 class="fw-600 text-left full">Step 1</h4>'
																+'<strong class="full">Select your preferred currency and click on Get Quote</strong>'
															+'</li>'
															+'<p style="margin:0">&nbsp;</p>'
															+'<li>'
																+'<h4 class="fw-600 text-left full">Step 2</h4>'
																+'<strong class="full">Verify your details – Student Name, Registered Email.</strong>'
															+'</li>'
															+'<li>'
																+'<br/>'
																+'<p>You can use a wide variety of services to complete your transactions. You can pay with your bank account or a credit/debit card* or use cash at your nearest in-person Convera agent location.</p>'
															+'</li>'
														+'</ul>'
													+'</div>'
													+'<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">'
														//+'<iframe width="100%" height="225" src="https://www.youtube.com/embed/6XcIHVAaa04" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
													+'</div>'
												+'</div>'
											+'</div>'
											+'<div class="payment-icon m-0">'
												+'<div class="payment-method-icon">'
													+'<img src="'+PATH_FOLDER_IMAGE+'visa.png">'
													+'<p>Visa</p>'
												+'</div>'
												+'<div class="payment-method-icon">'
													+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png">'
													+'<p>Mastercard</p>'
												+'</div>'
											+'</div>'		
											// +'<div class="payment-icon" style="margin-top:0">'
											// 	+'<h3 class="fw-600">We accept Mastercard and Visa</h3>'
											// 	+'<img src="'+PATH_FOLDER_IMAGE+'visa.png">'
											// 	+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png">'
											// +'</div>'
											+'<div class="payment-icon" style="margin-top:0;margin-bottom:10px;justify-content:flex-end">'
												+'<div class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=INSTALLMENT-FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \'CONVERA\');">'
													+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;" >Pay Now</span>'
												+'</div>'
											+'</div>'
										+'</div>';
									}
									if(data.pgswt!=null){
										html+=
										'<div role="tabpanel" id="wire-payment" class="tab-pane '+(data.pgs==null && data.pgswu ==null?'active':'')+' wire-payment flex-item primary-border-color">'
											+'<div class="payment-icon lg" style="mragin-top:0">';
											// if(SCHOOL_ID != 6){
											// 	html +='<img src="'+PATH_FOLDER_IMAGE+'wt.png">';
											// }
											html += 
											'</div>'
											+'<div class="full">';
												if(SCHOOL_ID == 1){
													html+=
													'<p>If you choose this method, please add US $35.00 to cover the bank’s fees for wire transfer charges. Here are the banking instructions for your payment:</p>'
													+'<ul>'
														+'<li>'
															+'<strong>BIC Name: Oversea-Chinese BankingCorporation Limited</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Bank Address: 63 Chulia Street, #11-01, OCBC Centre East, Singapore - 049514</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Swift Code: OCBCSGSG </strong>'
														+'</li>'
														+'<li>'
															+'<strong>Bank Code: 7339 </strong>'
														+'</li>'
														+'<li>'
															+'<strong>Branch Code: 503</strong></li>'
														+'<li>'
															+'<strong>Account Name: INTERNATIONAL SCHOOLING PTE. LTD.</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Account Number: 503396020301</strong>'
														+'</li>'
													+'</ul>';
												}else if(SCHOOL_ID == 2){
													html+=
													'<p>Here are the banking instructions for your payment:</p>'
													+'<ul>'
														+'<li>'
															+'<strong>Bank: Your Bank</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Account Name: Your School Name</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Account Number: 99999999</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Branch Code: abc123</strong>'
														+'</li>'
													+'</ul>';
												}else if(SCHOOL_ID == 5){
													html+=
													'<p>Here are the banking instructions for your payment:</p>'
													+'<ul>'
														+'<li>'
															+'<strong>Bank: FNB Bank</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Account Name: ANCHORED EDUCATION (PTY) LTD</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Account Number: 62861814385</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Branch Code: 250655</strong>'
														+'</li>'
													+'</ul>';
												}else if(SCHOOL_ID == 6){
													html+=
													'<p>Here are the banking instructions for your payment:</p>'
													+'<ul>'
														+'<li>'
															+'<strong>Provide your bank details</strong>'
														+'</li>'
													+'</ul>';
												}else{
													html+=
													'<p>Here are the banking instructions for your payment:</p>'
													+'<ul>'
														+'<li>'
															+'<strong>Provide your bank details</strong>'
														+'</li>'
													+'</ul>';
												}
												html+=
												'<p>Please clearly identify Student Name and City/State/Country in the reference information that accompanies the wire transfer, so that we can properly credit your account.</p>'
												+'<p>Your SMS profile will be created after the complete payment is processed in '+SCHOOL_NAME+'\'s bank Account</p>'
											+'</div>'
											+'<div class="payment-form">'
												+'<div id="wirePaymentForm" name="wirePaymentForm">'
													+'<input type="hidden" name="userPaymentDetailsId" id="userPaymentDetailsId" value="'+data.userPaymentDetailsId+'" />'
													+'<input type="hidden" name="paymentTitle" id="paymentTitle" value="'+data.paymentTitle+'" />'
													+'<ul>'
														+'<li>'
															+'<label>Payable Fee &nbsp;<b> '+data.currencyIsoCode+'</b></label>'
															+'<input type="text" name="wireTransferAmount" disabled placeholder="Fee" id="wireTransferAmount" required="" value="$ '+totalFee+'">'
														+'</li>'
														+'<li>'
															+'<label>Reference Number</label>'
															+'<input type="text" id="referenceNumberWire" name="referenceNumberWire" placeholder="Reference Number" maxlength="150" required="" onKeyDown="hideModalMessage(\'\');">'
														+'</li>'
														+'<li>'
															+'<label>Proof of Payment</label>'
															+'<div class="upload-btn-wrapper" style="align-items: center;">'
																+'<div class="file-btn">'
																	+'<span id="fileName3" class="fileName" style="display: none;"></span> '
																	+'<input onchange="uploadDocsFun(this, \'partnerPaymentWire\');" class="file-input" type="file" name="fileupload3" id="fileupload3" fileType="52" elem-id="3" value="Upload Proof of Payment"/> '
																	+'<span class="btn primary-bg white-txt-color mt-1 ml-1">Upload Proof of Payment</span>'
																+'</div>'
																+'<div id="divshowDocument3" class="custom-btn" style="display: none;">'
																	+'<div>'
																		+'<a id="showDocument3" href="javascript:void(0);" target="_self" data-toggle="tooltip" title="View">'
																			+'<i class="fa fa-eye"></i>'
																		+'</a>'
																	+'</div>'
																+'</div>'
																+'<div id="divdeleteDocument3" class="custom-btn" style="display: none;">'
																	+'<div>'
																		+'<a id="deleteDocument3" href="javascript:void(0);" data-toggle="tooltip" title="Delete">'
																			+'<i class="fa fa-trash"></i>'
																		+'</a>'
																	+'</div>'
																+'</div>'
																+'<p>Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 5 MB</p>'
															+'</div>'
														+'</li>'
														+'<li>'
															+'<label>&nbsp;</label>'
															+'<div class="pay-now-btn primary-border-color">'
																+'<span class="btn ref-no-btn primary-bg white-txt-color" data-toggle="modal" onclick="savePartnerTransferSubmit(\'wirePaymentForm\',\''+data.pgswt.gatewayName+'\');">Submit</span>'
															+'</div>'
														+'</li>'
													+'</ul>'
												+'</div>'
											+'</div>'
										+'</div>';
									}
									if(data.pgsCash!=null){
										html+=
										'<div role="tabpanel" id="cash-payment" class="tab-pane cash-payment flex-item primary-border-color">'
											+'<div class="payment-icon lg" style="mragin-top:0">'
												+'<img src="'+PATH_FOLDER_IMAGE+'Cash.png">'
											+'</div>'
											+'<div class="full">'
												+'<p> Pay by cash</p>'
											+'</div>'
											+'<div class="payment-form">'
												+'<div id="cashPaymentForm" name="cashPaymentForm">'
													+'<input type="hidden" name="userPaymentDetailsId" id="userPaymentDetailsId" value="'+data.userPaymentDetailsId+'" />'
													+'<input type="hidden" name="paymentTitle" id="paymentTitle" value="'+data.paymentTitle+'" />'
													+'<ul>'
														+'<li>'
															+'<label>Payable Fee &nbsp;<b> '+data.currencyIsoCode+'</b></label>'
															+'<input type="text" name="wireTransferAmount" disabled placeholder="Fee" id="wireTransferAmount" required="" value="$ '+totalFee+'">'
														+'</li>'
														+'<li>'
															+'<label>Reference Number</label>'
															+'<input type="text" id="referenceNumberCash" name="referenceNumberCash" placeholder="Reference Number" maxlength="150" required="" onKeyDown="hideModalMessage(\'\');">'
														+'</li>'
														+'<li>'
															+'<label>Proof of Payment</label>'
															+'<div class="upload-btn-wrapper" style="align-items: center;">'
																+'<div class="file-btn">'
																	+'<span id="fileName2" class="fileName" style="display: none;"></span> '
																	+'<input onchange="uploadDocsFun(this, \'partnerPaymentCash\');" class="file-input" type="file" name="fileupload2" id="fileupload2" fileType="52" elem-id="2" value="Upload Proof of Payment"/> '
																	+'<span class="btn primary-bg white-txt-color mt-1 ml-1">Upload Proof of Payment</span>'
																+'</div>'
																+'<div id="divshowDocument2" class="custom-btn" style="display: none;">'
																	+'<div>'
																		+'<a id="showDocument2" href="javascript:void(0);" target="_self" data-toggle="tooltip" title="View">'
																			+'<i class="fa fa-eye"></i>'
																		+'</a>'
																	+'</div>'
																+'</div>'
																+'<div id="divdeleteDocument2" class="custom-btn" style="display: none;">'
																	+'<div>'
																		+'<a id="deleteDocument2" href="javascript:void(0);" data-toggle="tooltip" title="Delete">'
																			+'<i class="fa fa-trash"></i>'
																		+'</a>'
																	+'</div>'
																+'</div>'
																+'<p>Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 5 MB</p>'
															+'</div>'
														+'</li>'
														+'<li>'
															+'<label>&nbsp;</label>'
															+'<div class="pay-now-btn primary-border-color">'
																+'<span class="btn ref-no-btn primary-bg white-txt-color" data-toggle="modal" onclick="savePartnerTransferSubmit(\'cashPaymentForm\',\''+data.pgsCash.gatewayName+'\');">Submit</span>'
															+'</div>'
														+'</li>'
													+'</ul>'
												+'</div>'
											+'</div>'
										+'</div>';
									}
									if(data.pgsAlternate!=null){
										html+=
										'<div role="tabpanel" id="alternate-payment" class="tab-pane '+(data.pgs==null && data.pgswu ==null?'active':'')+' alternate-payment flex-item primary-border-color">'
											+'<div id="alternate-pg">'
												+'<div class="payment-icon lg">';
													if(data.pgsAlternate.gatewayName=='Stripe'){
														html+='<img src="'+PATH_FOLDER_IMAGE+'STRIPE.png">';
													}else if(data.pgsAlternate.gatewayName=='Smoovpay'){
														html+='<img src="'+PATH_FOLDER_IMAGE+'SMOOVPAY.png">';
													}else if(data.pgsAlternate.gatewayName=='Airwallex'){
														html+='<img src="'+PATH_FOLDER_IMAGE+'AIRWALLEX.png">';
													}else if(data.pgsAlternate.gatewayName=='WELLSFARGO'){
														html+='<img src="'+PATH_FOLDER_IMAGE+'wells_fargo.png">';
													}else if(data.pgsAlternate.gatewayName=='Cash'){
														html+='<img src="'+PATH_FOLDER_IMAGE+'Cash.png">';
													}
													html+=
												'</div>'
												// +'<div class="payment-icon">'
												// 	+'<h3 class="fw-600">We accept Mastercard and Visa</h3>'
												// 	+'<img src="'+PATH_FOLDER_IMAGE+'visa.png">'
												// 	+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png">'
												// +'</div>';
												// +'<div class="payment-icon m-0">'
												// 	+'<h5 class="fw-600">PAYMENT METHODS</h5>'
												// +'</div>'
												+'<div class="payment-icon m-0">'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'visa.png">'
														+'<p>Visa</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png">'
														+'<p>Mastercard</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'american-express.png">'
														+'<p>American Express</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'Union-Pay.png">'
														+'<p>UnionPay</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'JCB-Pay.png">'
														+'<p>JCB</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'Apple-Pay.png">'
														+'<p>Apple Pay</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'g-pay.png">'
														+'<p>Google Pay</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'we-chat-pay.png">'
														+'<p>WeChat Pay</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'alipay.webp">'
														+'<p>Alipay</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'bancontact-pay.svg">'
														+'<p>Bancontact</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'my-bank-pay.png">'
														+'<p>MyBank</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'ideal-pay.png">'
														+'<p>iDEAL</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'klarna-pay.png">'
														+'<p>Sofort</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'pay-easy.png">'
														+'<p>Pay-easy</p><p class="blink-bg-warning text-dark p-0"><span class="blink-text">Coming soon</span></p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'Konbini-pay.png">'
														+'<p>Konbini</p><p class="blink-bg-warning text-dark p-0"><span class="blink-text">Coming soon</span></p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'kakao-pay.png">'
														+'<p>Kakao Pay</p><p class="blink-bg-warning text-dark p-0"><span class="blink-text">Coming soon</span></p>'
													+'</div>'
												+'</div>';
												// if(data.enrollmentType!='REGISTRATION_REGISTER'){
												// 	html+='<p>Your SMS profile will be created instantly after successful payment</p>';
												// }
												if(data.cr && data.pgsAlternate.gatewayName=="Smoovpay"){
													html+=
													'<div class="full">'
														+'<p>Our payment partner will display the Course Fees in Singapore Dollars on the payment page. The current Singapore Dollar rate is:</p>'
														+'<p> <strong>1 '+data.fromCurrency+' = '+data.cr.conversionRation+' '+data.toCurrency+'</strong> </p>'
														+'<p> <strong>Total payable fee: '+data.finalPayableAmountAfterCalculation+' '+data.toCurrency+'</strong></p>'
													+'</div>';
												}
												if(data.pgsAlternate.gatewayName=='Airwallex'){
													
												}
												html+=
												'<div class="payment-icon " style="margin-top:0;margin-bottom:10px;justify-content:flex-end">'
													+'<div class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=REGISTRATION_SUBJECT_FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \''+data.pgsAlternate.gatewayName+'\');">'
														+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;">Pay Now</span>'
													+'</div>'
												+'</div>'
											+'</div>'
										+'</div>';
									}
									html+=
								'</div>'
							+'</div>'
						+'</section>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	}
	return html;	
}

function commonYocoCheckout(data){
	var html = '';
	if(data.yocoData != null){
		html+=
		'<div class="payment-icon " style="margin-top:0;margin-bottom:10px;justify-content:flex-end" style="display:none;">'
			+'<div id="yocopaymentbutton" class="smoov lg primary-bg white-txt-color">'
				+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;">Pay Now</span>'
			+'</div>'
		+'</div>';
	}
	return html;
}

function commonAirwallexCheckout(data){
	var html = 
	'<div class="payment-icon " style="margin-top:0;margin-bottom:10px;justify-content:flex-end">'
		+'<div id="hpp" class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=REGISTRATION_SUBJECT_FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \''+data.pgsAlternate.gatewayName+'\');">'
			+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;">Pay Now</span>'
		+'</div>'
	+'</div>';
	return html;
}

function paymentRemarksModal(sprId){
    html=
        `<div class="modal fade " id="paymentRemarksModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
            <div id="paymentRemarks"  class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary">
                        <h5 class="modal-title font-weight-bold" id="exampleModalLabel1" style="color:#fff;">Payment Remarks</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" style="color:#fff;">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form autocomplete="off" id="paymentRemarksForm">
                            <div class="form-group">
                                <label for="interviewStatus" class="control-label">Status:</label>
                                <select class="form-control" name="remarksStatus" id="remarksStatus">
                                    <option value="">Select Status</option>
                                    <option value="SUCCESS">Approve Payment</option>
                                    <option value="REJECTED">Reject Payment</option>
                                </select>
                            </div>
                            <div id="pendingPartnerRemark" class="form-group">
                                <label for="message-text" class="control-label">Remarks:</label>
                                <textarea class="form-control px-2" id="remarks" id="message-text" maxlength="200" placeholder="Enter Remarks" style="padding:6px 0"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="addPaymentRemark" onclick="updatePaymentStatus('${sprId}')"> Add Remark</button>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function documentPreviewModal(){
	var html=
		`<div class="modal fade" id="documentPreviewModal" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
				<div class="modal-header bg-primary">
					<h5 class="modal-title text-white font-weight-bold">Document Preview</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
					<span>&times;</span>
					</button>
				</div>
				<div class="modal-body mx-auto">
					<!-- Content inserted dynamically -->
				</div>
				</div>
			</div>
		</div>`
	return html;
}