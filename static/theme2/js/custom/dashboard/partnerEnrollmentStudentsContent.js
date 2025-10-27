function renderSchoolEnrollmentStudents(title){
    var html=
        `<div class="card">
            <div class="card-body">
                <h5 class="font-weight-bold">${title}</h5>
                <div class="col-12 mb-2 text-right">
                    <a href="javascript:void(0)" class="btn btn-primary btn-shadow mr-2 rounded-10" onclick="showAdvanceSearchForm()">
                        <i class="fa fa-search mr-2"></i>
                        Advance Search
                    </a>
                    ${/*<a href="javascript:void(0)" class="btn btn-outline-primary btn-shadow mr-2 rounded-10">
                        <i class="fa fa-pencil-square-o ml-2" ></i>
                        Bulk Update Commission
                    </a>*/''}
                </div>`
                +partnerEnrollFilterForm()
                +partnerEnrollmentCards()
                +partnerEnrollmentListDetailsSkeleton()
                html+=`<div class="table-responsive col-12 px-0" id="enrolled-list"></div>
            </div>
        </div>`
    return html;
}

function partnerEnrollmentCards(){
    var html=
		`<div class="col-12">
			<div class="d-flex row">
				<div class="p-2 bg-light-alternate border border-alternate rounded-10 position-relative mr-2 mb-2 shadow-sm text-alternate flex-grow-1" style="width:fit-content">
					<span class="line-left bg-alternate d-inline-block position-absolute rounded-10"></span>
					<p class="m-0 font-12"><b>Total Revenue</b></p>
                    <p id="total_revenue" class="mb-0 pt-1 font-weight-bold" style="font-size:16px;"></p>
				</div>
				<div class="p-2 bg-light-orange border border-orange rounded-10 position-relative mr-2 mb-2 shadow-sm text-orange flex-grow-1" style="width:fit-content">
					<span class="line-left bg-orange d-inline-block position-absolute rounded-10"></span>
					<div class="d-flex">
						<div class="mr-1">
							<select class="form-control form-control py-0 px-1" style="height:22px;font-size:12px" id="revenueType" onchange="changeRevenueTypePartner(\'revenueType\')">
								<option value="" data-value-Type="custom">Custom</option>
							</select>
						</div>
						<div class="mr-1 date-range" style="display:none">
							<input type="text" id="startDate" name="startDate" class="form-control datepikcer form-control py-0 px-1" placeholder="Date From" style="height:22px;font-size:12px;max-width:85px" readonly/>
						</div>
						<div class="date-range" style="display:none">
							<input type="text" id="endDate" name="endDate" class="form-control datepikcer form-control py-0 px-1" placeholder="Date To" style="height:22px;font-size:12px;max-width:85px" readonly disabled/>
						</div>
					</div>
                    <p id="monthly_amount" class="mb-0 pt-1 font-weight-bold" style="font-size:16px;">Monthly Revenue: ${currency} <span>0</span></p>
				</div>
				${/*<div class="p-2 bg-light-pink border border-pink rounded-10 position-relative mr-2 mb-2 shadow-sm text-pink flex-grow-1" style="width:fit-content">
					<span class="line-left bg-pink d-inline-block position-absolute rounded-10"></span>
					<p class="m-0 font-12"><b>Your Earnings</b></p>
					<div class="m-0">
						<span><b>$1,60,000</b></span>
					</div>
				</div>*/''}
				<div class="p-2 bg-light-primary border border-primary rounded-10 position-relative mr-2 mb-2 shadow-sm text-primary flex-grow-1" style="width:fit-content">
					<span class="line-left bg-primary d-inline-block position-absolute rounded-10"></span>
					<p class="m-0 font-12"><b>Total Payout to IS</b></p>
					<p id="total_amount" class="mb-0 pt-1 font-weight-bold" style="font-size:16px;"></p>
				</div>
				<div class="p-2 bg-light-warning border border-warning rounded-10 position-relative mr-2 mb-2 shadow-sm text-warning flex-grow-1" style="width:fit-content">
					<span class="line-left bg-warning d-inline-block position-absolute rounded-10"></span>
					<p class="m-0 font-12"><b>Pending</b></p>
					<p id="pending_amount" class="mb-0 pt-1 font-weight-bold" style="font-size:16px;"></p>
				</div>
				<div class="p-2 bg-light-success border border-success rounded-10 position-relative mr-2 mb-2 shadow-sm text-success flex-grow-1" style="width:fit-content">
					<span class="line-left bg-success d-inline-block position-absolute rounded-10"></span>
					<p class="m-0 font-12"><b>Paid</b></p>
					<p id="paid_amount" class="mb-0 pt-1 font-weight-bold" style="font-size:16px;"></p>
				</div>
			</div>
		</div>`;
	return html;
}

function partnerEnrollFilterForm(){
	var html=
        `<form id="partnerEnrollFilterForm" style="display:none">
            <div class="col-12 mb-2 border rounded-10 pb-1 pt-4 px-4  mb-4 bg-light-primary">
                <div class="row">
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Select School Name</label>
                        <select class="form-control" name="schoolName" id="schoolName" onchange="getPartnerOnSchoolId(this);">
                            <option value="ALL">Select School</option>
                        </select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Select Partner Name</label>
                        <select class="form-control" name="partnerName" id="partnerName" disabled>
                        </select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 hidden">
                        <label class="full text-primary">Select Sub-Partner Name</label>
                        <select class="form-control" name="subPartner" id="subPartner">
                            <option>Select Sub-Partner</option>
                            <option>Sub Partner1</option>
                            <option>Sub Partner2</option>
                            <option>Sub Partner3</option>
                        </select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Academic Year</label>
                        <select class="form-control" name="academicYear" id="academicYear">
                        </select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Enrollment Status</label>
                        <select class="form-control" name="enrollmentStatus" id="enrollmentStatus">
                            <option value="">Enrollment Status</option>
                            <option value="0">Enrolled</option>
                            <option value="1">Withdrawn</option>
                            <option value="2">Partial Entry</option>
                        </select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Grade</label>
                        <select class="form-control" name="gradeId" id="gradeId"></select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Student Name</label>
                        <input type="text" class="form-control" name="studentName" id="studentName"/>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Email</label>
                        <input type="text" class="form-control" name="email" id="email"/>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Country</label>
                        <select class="form-control" name="countryId" id="countryId"></select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">State</label>
                        <select class="form-control" name="stateId" id="stateId"></select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">City</label>
                        <select class="form-control" name="cityId" id="cityId"></select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Commission Status</label>
                        <select class="form-control" name="commissionStatus" id="commissionStatus">
                        <option value="">Select Commission Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="Amount Transferred">Amount Transferred</option>
                            <option value="None">None</option>
                        </select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Learning Program</label>
                        <select class="form-control" name="learningProgram" id="learningProgram">
                        </select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Payment Date From</label>
                        <input type="text" class="form-control" name="paymentDateFrom" id="paymentDateFrom"/>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Payment Date To</label>
                        <input type="text" class="form-control" name="paymentDateTo" id="paymentDateTo"/>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Payment Title</label>
                        <select class="form-control" name="paymentStatus" id="paymentTitle">
                            <option value="">Select Payment Title</option>
                            <option value="Reserve a Seat">Reserve a Seat</option>
                            <option value="Course and Enrollment Fee">Course and Enrollment Fee</option>
                        </select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Payment Status</label>
                        <select class="form-control" name="paymentStatus" id="paymentStatus">
                            <option value="">Select Payment Status</option>
                            <option value="SUCCESS">SUCCESS</option>
                            <option value="SCHEDULED">SCHEDULED</option>
                            <option value="INITIATED">INITIATED</option>
                            <option value="FAILED">FAILED</option>
                        </select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Sort By</label>
                        <select class="form-control" name="sortBy" id="sortBy">
                            <option value="DESC">Descending</option>
                            <option value="ASC">Asceding</option>
                        </select>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">
                        <label class="full text-primary">Page Size</label>
                        <input type="text" class="form-control" value="25" name="pageSize" id="pageSize"/>
                    </div>
                    <div class="col-12 mt-2 text-right">`
                        html+=`<a href="javascript:void(0)" class="btn btn-primary btn-shadow float-right pr-4 pl-4" onclick="resetEnrollmentForm(\'partnerEnrollFilterForm\')">Reset</a>
                        <a href="javascript:void(0)" class="btn btn-success btn-shadow float-right pr-4 pl-4 mr-2" onclick="callStudentListByPartnerWLP(\'partnerEnrollFilterForm\')">Search</a>
                    </div>
                </div>
            </div>
        </form>`;
	return html;
}


async function partnerEnrollmentListDetails(studentList){
	var html= 
		`<table class="table table-bordered font-12 border-radius-table" style="min-width:1300px;width:100%;font-size:11px !important" id="partnerEnrollmentList">
			<thead>
				<tr>
					<th class="bg-primary text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important">S No.</th>
					<th class="bg-primary text-white bold border-bottom-0">Partner Details</th>
					<th class="bg-primary text-white bold border-bottom-0">Student Details</th>
					<th class="bg-primary text-white bold border-bottom-0">Enrollment Details</th>
					<th class="bg-primary text-white bold border-bottom-0 text-center">Payment Details</th>
					<th class="bg-primary text-white bold border-bottom-0 text-center">Fee Schedule</th>
					<th class="bg-primary text-white bold border-bottom-0 rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Expected Commission</th>
				</tr>
			</thead>
            <tbody>`
                if(studentList.length > 0){
                    $.each(studentList, function(index, item){
                        var limit = $("#pageSize").val() == "" ? 25 : parseInt($("#pageSize").val())
                        html+=
                        `<tr>
                            <td>${(currentPagePartnerEnrollmentList - 1) * limit + index + 1}</td>
                            <td>
                                <span class="font-weight-bold">Partner Name:</span>
                                <span class="">${item.partnerName}</span>
                            </td>
                            <td>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Name:</span>
                                    <span class="">${item.studentName}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Country | State | City:</span>
                                    <span class="">${item.countryName} | ${item.stateName} | ${item.cityName}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Grade:</span>
                                    <span class="">${item.standardName}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Learning Program:</span>
                                    <span class="">${item.learningMode}</span>
                                </div>
                            </td>
                            <td>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Enrollment Status:</span>
                                    <span class="">${item.admissionType}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Enrollment Date:</span>
                                    <span class="">${item.admissionDate}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Academic Duration:</span>
                                    <span class="">${item.startDate == "N/A" ? "N/A" : item.startDate + " - " +  item.endDate}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Enrollment Type:</span>
                                    <span class="">${item.enrollType}</span>
                                </div>
                            </td>
                            <td>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Payment Plan:</span>
                                    <span class="">
                                        ${item.paymentType == '' || item.paymentType == 'N/A' ? "N/A" : (item.paymentType == "c_annually" || item.paymentType == "annually" || item.paymentType == "a_annually" ? "One Time Payment" : "Installment Plan")}
                                    </span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Total Fee:</span>
                                    <span class="">${item.payAmount == '' || item.payAmount == 'N/A' ? "N/A": currency +' '+ item.payAmount}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Pending Fee:</span>
                                    <span class="">${item.paymentDue == '' || item.paymentDue == 'N/A' ? "N/A" : item.paymentDue == 0.0 ? "All Paid": currency +' '+ item.paymentDue}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Last Payment Date:</span>
                                    <span class="">${item.paymentDate == 'N/A' || item.paymentDate == '' ? 'N/A' : changeDateFormat(new Date(item.paymentDate), "MMM-dd-yyyy hh:mm:ss")}</span>
                                </div>
                            </td>`;
                            if(item.admissionType == 'Withdrawn'){
                                html += `<td class="p-0 vertical-align-middle text-center" style="width: 230px;">
                                            <strong>N/A</strong>
                                        </td>`;
                            } else if (item.scheduleArray.length > 0) {
                                html += `<td class="p-0 vertical-align-top ulli" style="width: 230px;">`;
                        
                                if (item.scheduleArray != null) {
                                    html += `<ul class="follow-up-accordian m-0 p-0 overflow-auto" style="min-height: 180px; max-height: 180px;">`;
                        
                                    let callcss = 1;
                        
                                    item.scheduleArray.forEach((stuSchedule, index) => {
                                        let srNo = index + 1;
                                        let suffix = ['st', 'nd', 'rd'][srNo - 1] || 'th';
                                        let srStr = srNo + suffix;
                        
                                        let classActive = '';
                                        let classActiveCss = 'none';
                                        
                                        if ((stuSchedule.status === 'SCHEDULED' && callcss === 1) || (index === 0 && callcss === 1 && !item.scheduleArray.some(s => s.status === 'SCHEDULED'))) {
                                            classActive = 'follow-up-accordian-active';
                                            classActiveCss = 'block';
                                            callcss = 0;
                                        }
                        
                                        let liHeading = item.paymentType === 'annually' ? 'One Time Payment' : `${srStr} Installment`;
                                        let statusClass = stuSchedule.status === "SUCCESS"
                                            ? "bg-success text-white border-white"
                                            : "text-primary border-primary";
                                        let contentBoxClass = stuSchedule.status === "SUCCESS"
                                            ? "bg-light-success"
                                            : "bg-light-primary";
                        
                                        html += `<li class="${classActive}">
                                                    <span class="cursor follow-up-no p-2 text-center full bold ${statusClass}">
                                                        ${liHeading}
                                                        <i class="fa ${stuSchedule.status === 'SCHEDULED' ? "fa-angle-up" : "fa-angle-down"} float-right" style="line-height: 20px;"></i>
                                                    </span>
                                                    <div class="follow-up-content text-center" style="display:block">
                                                        <div class="${contentBoxClass} p-2 m-2 rounded text-left">
                                                            <span class="full d-block"><strong>Fee:</strong>${stuSchedule.payAmount == '' || stuSchedule.payAmount == 'N/A' ? "N/A" : currency +' '+ stuSchedule.payAmount}</span>
                                                            <span class="full d-block"><strong>Payment Status:</strong> ${stuSchedule.status}</span>
                                                            <span class="full d-block"><strong>Schedule Date:</strong> ${stuSchedule.scheduleDate}</span>`;
                        
                                        if (stuSchedule.payDate !== '') {
                                            html += `<span class="full d-block"><strong>Payment Date:</strong> ${stuSchedule.payDate}</span>`;
                                        }
                        
                                        html += `       </div>
                                                    </div>
                                                </li>`;
                                    });
                        
                                    html += `</ul>`;
                                }
                                html += `</td>`;
                            } else if(item.paymentType == null || item.paymentType == undefined || item.paymentType == '' || item.paymentType == "N/A"){
                                html += `<td class="p-0 vertical-align-middle text-center" style="width: 230px;">
                                            <strong>N/A</strong>
                                        </td>`;
                            } else if (item.admissionType == 'Partial Entry') {
                                html += `
                                    <td class="p-0 vertical-align-top ulli" style="width: 230px;">
                                        <ul class="follow-up-accordian m-0 p-0 overflow-auto" style="min-height: 180px; max-height: 180px;">
                                            <li class="follow-up-accordian-active">
                                                <span class="cursor follow-up-no p-2 text-center full boldtext-primary border-primary">
                                                    One Time Payment
                                                    <i class="fa fa-angle-up float-right" style="line-height: 20px;"></i>
                                                </span>
                                                <div class="follow-up-content text-center" style="display: block;">
                                                    <div class="bg-light-primary p-2 m-2 rounded text-left">
                                                        <span class="full d-block"><strong>Fee: </strong> 
                                                            ${item.payAmount !== 'N/A' ? `${currency} ${item.payAmount}` : 'N/A'}
                                                        </span>
                                                        <span class="full d-block"><strong>Payment Status: </strong>${item.paymentStatus}</span>
                                                        <span class="full d-block"><strong>Schedule Date: </strong> 
                                                            ${item.payAmount !== 'N/A' ? changeDateFormat(new Date(item.payDate), "MMM-dd-yyyy") : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>    
                                    </td>`;
                            } else {
                                html += `<td class="p-0 vertical-align-middle text-center" style="width: 230px;">
                                            <strong>No Pending Fees</strong>
                                        </td>`;
                            }                            
                            html+=`<td>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Commission:</span>
                                    <span class="">${item.commissionAmount == '' || item.commissionAmount == 'N/A' ? "N/A": currency +' '+ item.commissionAmount}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Payout:</span>
                                    <span class="">${item.totalPayoutToParentSchool == '' || item.totalPayoutToParentSchool == 'N/A' ? "N/A": currency +' '+ item.totalPayoutToParentSchool}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Status: </span>`
                                    let tag = "";
                                    let pendingAmountHtml = `
                                        <div class="mb-1">
                                            <span class="font-weight-bold">Pending Amount:</span>
                                            <span>${item.paymentDueToParentSchool == 'N/A' ? 'N/A' : currency +' '+ item.paymentDueToParentSchool}</span>
                                        </div>
                                    `;

                                    if (item.admissionType === "Withdrawn") {
                                        tag = `<span class="bg-danger text-white p-1 rounded">No Revenue</span>`;
                                    } else if (item.paymentDueToParentSchool == "0.0" && item.parentSchoolPaymentStatus == "SUCCESS") {
                                        tag = `<span class="bg-success text-white p-1 rounded">Success</span>`;
                                    } else if(item.totalPayoutToParentSchool != 'N/A' && item.paymentDueToParentSchool != 'N/A'){
                                        if (item.totalPayoutToParentSchool !== item.paymentDueToParentSchool && item.parentSchoolPaymentStatus != "REJECTED") {
                                        tag = `
                                            <span class="bg-warning text-white p-1 rounded">Initiated</span>
                                            ${pendingAmountHtml}
                                        `;
                                        } else {
                                            tag = `
                                                <span class="bg-primary text-white p-1 rounded">Pending</span>
                                                ${pendingAmountHtml}
                                            `;
                                        }
                                    }else{
                                        tag = `
                                                <span>N/A</span>`;
                                    } 
                                    html += tag;
                                html+=`</div>
                                <div class="mb-1">
                                    <span class="font-weight-bold">Payment Date:</span>
                                    <span class="">${item.lastPayDate}</span>
                                </div>
                            </td>
                        </tr>`
                    })
                }else{
                    html+=`<tr>
                        <td colspan="7" class="text-center">No Data Found</td>
                    </tr>`
                }
            html+=`</tbody>
		</table>
        <div id="enrollmentPartnerPaginationContainer" class="text-center mt-4">`;
	return html;
}

function partnerEnrollmentListDetailsSkeleton(){
	var html=
		`<div class="col-12 mb-2 px-0" id="enroll-list-skeleton">
            <table class="table table-bordered table-striped without_h_scroll" style="">
                <thead class="theme-bg primary-bg white-txt-color">
                    <tr>
                    <th style="width: 3%;" class="skeleton">&nbsp;</th>
                    <th style="width: 19%;" class="skeleton">&nbsp;</th>
                    <th style="width: 21%;" class="skeleton">&nbsp;</th>
                    <th style="width: 19%;" class="skeleton">&nbsp;</th>
                    <th style="width: 19%;" class="skeleton">&nbsp;</th>
                    <th style="width: 19%;" class="skeleton">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                    </tr>
                    <tr>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                    </tr>
                    <tr>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                        <td class="skeleton" height="100px"></td>
                    </tr>
                </tbody>
            </table>
		</div>`
	return html;
}