var schoolSettingsLinks;
function renderSchoolPayment(){
	schoolSettingsLinks = getSchoolSettingsLinks(SCHOOL_ID);
    
    var html=
        `<div class="px-4 mt-2">`
            // +dashboardHeaderContent()
            +schoolPaymentCard()
            +schoolPaymentFilterAndTable()
            +viewStudentList()
            +studentFeesModalContent()
        html+=`</div>`;
        getPartnerSchoolPaymentDetails('paymentSeachForm');
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
                <h5 class="font-weight-semi-bold text-dark">${USER_ROLE == 'B2B_PARTNER' ? 'Enrollment Partner Payment' : 'School Payment'}</h5>`
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
            <div class="col-12 mb-2 border rounded-10 pb-3 pt-4 px-4 mb-4">
                <div class="">
                    <form id="paymentSeachForm" class="custom-field-scope">
                        <div class="row">
							<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">`;
                                if(USER_ROLE == "DIRECTOR"){
                                    html+=`<select id="schoolName" class="form-control" onchange="getPartnerSchoolsBase(\'schoolName\');"></select>`;
                                }else if(USER_ROLE == "SCHOOL_ADMIN"){
                                    html+=`<input type="text" id="schoolName" class="form-control" disabled readyonly data-schoolId='' placeholder=" "/>`;
                                }else if(USER_ROLE == "B2B_PARTNER"){
                                    html+=`<input type="text" id="schoolName" class="form-control" disabled readyonly data-schoolId='' placeholder=" "/>`;
                                }
                            html+=`<label for="schoolName">School Name</label>
                                </div>
                            </div> 
							<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">`;
                                if(USER_ROLE == "DIRECTOR"){
                                    html+=`<select id="partnerName" class="form-control"></select>`;
                                }else if(USER_ROLE == "SCHOOL_ADMIN"){
                                    html+=`<input type="text" id="partnerName" class="form-control" disabled readyonly placeholder=" "/>`;
                                }else if(USER_ROLE == "B2B_PARTNER"){
                                    html+=`<input type="text" id="partnerName" class="form-control" disabled readyonly placeholder=" "/>`;
                                }
                            html+=`<label for="partnerName">Partner Name</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <select id="academicSession" class="form-control"></select>
                                    <label for="academicSession">Academic Session</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <input type="text" id="transactionNo" class="form-control" placeholder=" " />
                                    <label for="transactionNo">Transaction No.</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <input type="text" id="userRefNo" class="form-control" placeholder=" " />
                                    <label for="userRefNo">User Reference No.</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <select id="paymentVia" class="form-control">
                                        <option value="">Select Payment Via</option>
                                        <option value="card">Credit Card/Debit Card</option>
                                        <option value="bankTransfer">Bank Transfer</option>
                                        <option value="cash">Cash</option>
                                    </select>
                                    <label for="paymentVia">Payment Via</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <select id="paymentGatewayUsed" class="form-control">`
                                        +getPaymentBySchoolId(SCHOOL_ID)
                                    html+=`</select>
                                    <label for="paymentGatewayUsed">Payment Gateway Used</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <select id="proofOfPayment" class="form-control">
                                        <option value="">Select Proof of Payment</option>
                                        <option value="Y">Yes</option>
                                        <option value="N">No</option>
                                    </select>
                                    <label for="proofOfPayment">Proof of Payment</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <select id="paymentReviewed" class="form-control">
                                        <option value="">Select Payment Reviewed</option>
                                        <option value="Y">Yes</option>
                                        <option value="N">No</option>
                                    </select>
                                    <label for="paymentReviewed">Payment Reviewed</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <select id="paymentStatus" class="form-control">
                                        <option value="">Select Payment Status</option>
                                        <option value="SUCCESS">Success</option>
                                        <option value="SCHEDULED">Scheduled</option>
                                        <option value="INITIATED">Initiated</option>
                                        <option value="REJECTED">Rejected</option>
                                        <option value="FAILURE">Failure</option>
                                        <option value="PENDING">Pending</option>
                                    </select>
                                    <label for="paymentStatus">Payment Status</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <input type="text" style="background-color:white;" id="paymentDateFrom" placeholder="Select Payment Date From" readonly class="form-control" />
                                    <label for="paymentDateFrom">Payment Date From</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <input type="text" style="background-color:white;" id="paymentDateTo" placeholder="Select Payment Date To" readonly class="form-control" />
                                    <label for="paymentDateTo">Payment Date To</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <select id="orderBy" class="form-control">
										<option value="scheduledPaymentDate">Initiated Payment Date</option>
                                        <option value="paymentDate">Payment Date</option>
                                    </select>
                                    <label for="orderBy">Order By</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <select id="sortIn" class="form-control">
                                        <option value="D">Descending</option>
                                        <option value="A">Ascending</option>
                                    </select>
                                    <label for="sortIn">Sort in</label>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                                <div class="position-relative custom-field mb-2 mt-3 p-0">
                                    <input type="text" value="25" id="noOfRecords" class="form-control" placeholder=" " />
                                    <label for="noOfRecords">No. of Records</label>
                                </div>
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
                        <button type="button" class="btn-close close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table id="studentListTable" class="table table-bordered">
                            <thead style="background-color:#C2DDF9;">
                                <tr>
                                    <th>Student ID</th>
                                    <th id="studentListEmailColHeader" style="display:none;">Email ID</th>
                                    <th>Student Name</th>
                                    <th>Grade</th>
                                    <th>Leaning Program</th>
                                    <th>Payment Amount</th>
                                    <th>Sub Partner Name</th>
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
                        <form id="searchStudentFees" class="full custom-field-scope">`
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
    var emailField = isEmailSearchFilterAllowed()
        ? `<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <div class="position-relative custom-field mb-2 mt-3 p-0">
                    <input type="text" id="studentEmailSearch" class="form-control" placeholder=" " />
                    <label for="studentEmailSearch" class="full text-primary">Email ID</label>
                </div>
            </div>`
        : '';
    var html=
        `<div class="row mb-3">
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <div class="position-relative custom-field mb-2 mt-3 p-0">
                    <select id="partnerNameSearch" class="form-control" disabled='true'>
                    </select>
                    <label for="partnerNameSearch" class="full text-primary">Partner Name</label>
                </div>
            </div>
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <div class="position-relative custom-field mb-2 mt-3 p-0">
                    <input type="text" id="studentIdSearch" class="form-control" placeholder=" " />
                    <label for="studentIdSearch" class="full text-primary">Student ID</label>
                </div>
            </div>
            ${emailField}
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <div class="position-relative custom-field mb-2 mt-3 p-0">
                    <input type="text" id="studentNameSearch" class="form-control" placeholder=" " />
                    <label for="studentNameSearch" class="full text-primary">Student Name</label>
                </div>
            </div>
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <div class="position-relative custom-field mb-2 mt-3 p-0">
                    <select id="gradeSearch" class="form-control"></select>
                    <label for="gradeSearch" class="full text-primary">Grade</label>
                </div>
            </div>
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <div class="position-relative custom-field mb-2 mt-3 p-0">
                    <select id="learningProgramSeach" class="form-control">
                        <option value="One to One Learning">One to One Learning</option>
                        <option value="Group Learning">Group Learning</option>
                        <option value="Self Study Learning">Self Study Learning</option>
                    </select>
                    <label for="learningProgramSeach" class="full text-primary">Learning Program</label>
                </div>
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
                <div class="position-relative custom-field mb-2 mt-3 p-0">
                    <input type="text" id="paymentDateFromSearch" class="form-control" placeholder=" " />
                    <label for="paymentDateFromSearch" class="full text-primary">Payment Date From</label>
                </div>
            </div>
            <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-3">
                <div class="position-relative custom-field mb-2 mt-3 p-0">
                    <input type="text" id="paymentDateToSearch" class="form-control" placeholder=" " />
                    <label for="paymentDateToSearch" class="full text-primary">Payment Date To</label>
                </div>
            </div>
            <div class="col-12 mt-2 text-right mb-2">
				<button type="reset" class="btn btn-danger btn-shadow float-right pr-4 pl-4 mr-2" id="resetStudentFeesBtn">Reset</button>
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
                            <th class="font-weight-bold text-white border-bottom-0" id="emailColHeader" style="display:none;">Email ID</th>
                            <th class="font-weight-bold text-white border-bottom-0" style="width:12%;">Student Name | Grade</th>
                            <th class="font-weight-bold text-white border-bottom-0">Learning Program</th>
                            ${/*
                                ${schoolSettingsOffice.schoolType != 'WLP'? '<th class="font-weight-bold text-white border-bottom-0">IS Fees</th>':''}    
                            */''}
                            <th class="font-weight-bold text-white border-bottom-0">Total Fee</th>`;
                            // <th class="font-weight-bold text-white border-bottom-0">Student Fees Pay Date</th>
					        html += `<th class="font-weight-bold text-white border-bottom-0">Commission Earned</th>
                            ${/*
                                ${schoolSettingsOffice.schoolType != 'WLP'? '<th class="font-weight-bold text-white border-bottom-0">Payable to IS</th>':''}
                                ${schoolSettingsOffice.schoolType != 'WLP'? '<th class="font-weight-bold text-white border-bottom-0">Commision Type | Rate</th>':''}
                            */''}
                            <th style="width:10%;" class="font-weight-bold text-white border-bottom-0 vertical-align-top rounded-top-right-10">Fee Payable to International Schooling</th>
                        </tr>
                    </thead>
                    <tbody id="schoolPaymentTable" style="max-height:420px;">
                        <tr>
                            <td colspan="8" class="text-center">No record found</td>
                        </tr>
                    </tbody>
					<tfoot id="schoolPaymentTableFoot"></tfoot>
                </table>
            </div>
			<div class="col-12 text-right mt-2">
				<a href="javascript:void(0)" onclick="openPartnerPaymentModal();" class="btn btn-primary btn-shadow float-right pr-4 pl-4 mr-2">Confirm & Pay</a>
			</div>
        </div>`;
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
                        <form autocomplete="off" id="paymentRemarksForm" class="custom-field-scope">
                            <div class="form-group custom-field">
                                <select class="form-control" name="remarksStatus" id="remarksStatus">
                                    <option value="">Select Status</option>
                                    <option value="SUCCESS">Approve Payment</option>
                                    <option value="REJECTED">Reject Payment</option>
                                </select>
                                <label for="interviewStatus" class="control-label">Status:</label>
                            </div>
                            <div id="pendingPartnerRemark" class="form-group custom-field">
                                <textarea class="form-control px-2" id="remarks" id="message-text" maxlength="200" placeholder="Enter Remarks" style="padding:6px 0"></textarea>
                                <label for="message-text" class="control-label">Remarks:</label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="addPaymentRemark" onclick="updatePaymentStatus('${sprId}', \'paymentRemarksForm\', \'paymentRemarksModal\')"> Add Remark</button>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function documentPreviewModal(){
	var html=
		`<div class="modal fade  mohit sahu" id="documentPreviewModal" tabindex="-1" role="dialog" aria-hidden="true">
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
