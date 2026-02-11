function renderB2BPartnerFeeStructureContent(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	$('#dashboardContentInHTML').html(getB2BPartnerFeeStructureContent(title));
	getB2BPartnerStandardFee('');
}
function getB2BPartnerFeeStructureContent(title){
	var html=
	`<div class="app-page-title mb-3 py-2">
		<div class="page-title-wrapper">
			<div class="page-title-heading">
			  <div class="page-title-icon"><img src="${PATH_FOLDER_IMAGE2}/Icon/sidebar/Payment_Management 1.png" style="max-width:200px; width: 90%; margin-right: auto; display: flex;"></i></div>
				<div>
					<span class="text-primary welcome-name-text">${title}</span>
				</div>
			</div>
		</div>
	</div>`;
	html+=getB2BPartnerFeeStructureCard()
	return html;
}
function getB2BPartnerFeeStructureCard(){
	var html=
	`<div class="main-card mb-3">
		<h5 class="font-weight-semi-bold text-dark">Account Manager Details</h5>
		<div class="mb-3 card border rounded-10">
			<div class="card-body">
				<div class="full">
					<div class="d-flex align-items-center" style="gap: 10px;">
						<select class="p-2 rounded form-control mb-4" style="width:20%" id="feeStructureLearningProgram" onchange="selectB2BPartnerCourseProvider();"></select>
						<select class="p-2 rounded form-control mb-4" style="width:20%" id="feeStructurecourseProvider"></select>
						<button class="btn btn-lg btn-primary d-flex ml-auto" style="font-size:16px;" onclick="getB2BPartnerStandardFee(\'fromButton\');">Get data</button>
					</div>
					<div class="full" id="feeStructureWrapper">`
						+getB2bPartnerFeeStructureContent()
					html+=`</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function getB2bPartnerFeeStructureContent(gradesArr){
	if(!gradesArr){
		 gradesArr = ["KG","1","2","3","4","5","6","7","8","9","10","11","12","Flexy - Advanced Placement","Flexy - Credit Recovery", "Flexy - Elementary School","Flexy - High School","Flexy - Middle School"]
	}
	var html =
		`<div class="overflow-auto" style="max-height:70vh;">
			<table id="feeStructureTable" class="table table-bordered">`
				+feeB2BPartnerStructureTableHead()
				+feeB2bPartnerStructureTableBody(gradesArr)
			html+=`</table>
		</div>
		<div class="full text-right">
			<button class="btn btn-lg btn-primary d-flex ml-auto mt-3" style="font-size:16px;" onclick="saveB2BPartnerStandardFee();">Save</button>
		</div>`
	return html;
}

function feeB2BPartnerStructureTableHead(){
	var html=
		`<style>
			#feeStructureTable input, #feeStructureTable select {
				font-size: 12px;
			}
		</style>
		<thead class="position-sticky" style="top:0;z-index:10;">
			<tr class="bg-primary text-white text-center">
				<th>Grade</th>
				<th>Reg. Fee</th>
				<th style="width:70px;">Reserve a seat</th>
				<th>Prog Disc</th>
				<th>Course Fee</th>
				<th>Annual Discount</th>
				<th style="width:70px;">Min Credit</th>
				<th>FT</th>
				<th>CR</th>
				<th>ADV</th>
				<th>HON</th>
				<th>AP</th>
				<th>Action</th>
			</tr>
		</thead>`
	return html;
}
function feeB2bPartnerStructureTableBody(gradesArr){
	var html=
		`<tbody>`;
			if(gradesArr.length>0){
			html+=
				`<tr class="bg-light text-dark">
					<td class="p-0" colspan="7"></td>
					<td class="p-0">
						<div class="w-50 text-center float-left border-right border-white">1</div>
						<div class="w-50 text-center float-left">1/2</div>
					</td>
					<td class="p-0">
						<div class="w-50 text-center float-left border-right border-white">1</div>
						<div class="w-50 text-center float-left">1/2</div>
					</td>
					<td class="p-0">
						<div class="w-50 text-center float-left border-right border-white">1</div>
						<div class="w-50 text-center float-left">1/2</div>
					</td>
					<td class="p-0">
						<div class="w-50 text-center float-left border-right border-white">1</div>
						<div class="w-50 text-center float-left">1/2</div>
					</td>
					<td class="p-0">
						<div class="w-50 text-center float-left border-right border-white">1</div>
						<div class="w-50 text-center float-left">1/2</div>
					</td>
					<td class="p-0"></td>
				</tr>`
				$.each(gradesArr, function(index, grades){
					html+=
					`<tr id="tr_${grades.replaceAll(" ","")}">
						<td>${grades}</td>
						<td>
							<input type="hidden" id = "id_${index}" value="" />
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('regFee_${index}')"  id = "regFee_${index}" />
						</td>
						<td>
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('bae_${index}')" id = "bae_${index}" />
						</td>
						<td>
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('progDisc_${index}')" id="progDisc_${index}" />
						</td>
						<td>
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onkeyup="calculateFee('${index}');" onblur="tempFunction('courseFee_${index}')" id="courseFee_${index}"/>
						</td>
						<td>
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onkeyup="calculateFee('${index}');" onblur="tempFunction('annualDiscount_${index}')" id="annualDiscount_${index}" /> 
						</td>
						<td>
							<select type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('minCredit_${index}')" onchange="calculateFee('${index}')" id="minCredit_${index}">
								<option value="" selected>Credit</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="10">10</option>
								<option value="20">20</option>
								<!-- change in DB also if changing in the options-->
							</select>
						</td>
						<td>
							<div class="d-flex" style="gap:6px;">
								<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('ftFull_${index}');" id="ftFull_${index}" />
								<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('ftHalf_${index}')" id="ftHalf_${index}" />
							</div>
						</td> 
						<td>
							<div class="d-flex" style="gap:6px;">
								<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('crFull_${index}')" id="crFull_${index}" />
								<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('crHalf_${index}')" id="crHalf_${index}" />
							</div>
						</td>
						<td>
							<div class="d-flex" style="gap:6px;">
								<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('advFull_${index}')" id="advFull_${index}" />
								<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('advHalf_${index}')" id="advHalf_${index}" />
							</div>
						</td>
						<td>
							<div class="d-flex" style="gap:6px;">
								<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('honFull_${index}')" id="honFull_${index}" />
								<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('honHalf_${index}')" id="honHalf_${index}" />
							</div>
						</td>
						<td>
							<div class="d-flex" style="gap:6px;">
								<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('apFull_${index}')" id="apFull_${index}" />
								<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('apHalf_${index}')" id="apHalf_${index}" />
							</div>
						</td>
						<td>
							<div class="d-flex" style="gap:6px;">
								<button class="btn btn-sm btn-primary" onclick="disabledEnableRow('tr_${grades.replaceAll(" ","")}','${index}')">Edit</button>
								<button class="btn btn-sm btn-outline-primary" onclick="getLogData('${index}')">Logs</button>
								${/*<button class="btn btn-sm btn-outline-primary" onclick="openFeeStructureLogsModal()">Logs</button>*/''}
							</div>
						</td>
					</tr>`
				});
			}else{
				html+=
				`<tr>
					<td colspan="13" class="text-center font-weight-semi-bold">No record found</td>
				</tr>`;
			}
		html+=`</tbody>`
	return html;
}