var schoolSettingsOffice;
async function renderPartnerDashboard(title, roleAndModule, schoolId, userId, role){
	schoolSettingsOffice = await getSchoolSettingsOffice(SCHOOL_ID);
	var commissionRate = await getPartnerCommissionRate('','partnerCommitionRate',userId);
	customLoader(true);
	
	$("#dashboardContentInHTML").html(partnerDashboardContent(title, roleAndModule, schoolId, userId, role, commissionRate));
	generateTinyUrls();
	//console.log("render",commissionRate)
	// getEnrollmentChart('chart-pie-enroll-one');
	// getEnrollmentChart('chart-pie-enroll-group');
	// getEnrollmentChart('chart-pie-enroll-self');
	$("#discountForEnrollmentPartner").select2({
		theme:"bootstrap4"
	}).on('change', function(){
		// if($(this).val()=='0'){
		// 	$("#discountMsgTag").html(``);
		// 	$("#discountMsgTag").hide();
		// }
			
	});
	
	var data = getPartnerDashboardDetailsData(userId);
	console.log(data);
	$("#chartContentDiv").html(partnerDashboardLPContent(data, commissionRate.isSubPartner));
	var revenue=0.0;
	var revenue_d=0.0;
	var revenue_id=0.0;
	var revenue_pending=0.0;
	var revenue_pending_d=0.0;
	var revenue_pending_id=0.0;
	var schoolDicountSymbol="";
	var partnerDicountSymbol="";
	$.each(data.schoolLPDetails.learningProgramDetails, function(k,learningProgram){
		//console.log(learningProgram);
		schoolDicountSymbol=learningProgram.schoolDicountSymbol;
		partnerDicountSymbol=learningProgram.partnerDicountSymbol;
		
		revenue_d += parseFloat(learningProgram.revenue_d)
		revenue_id += parseFloat(learningProgram.revenue_id)
		revenue_pending_d += parseFloat(learningProgram.revenue_pending_d)
		revenue_pending_id += parseFloat(learningProgram.revenue_pending_id)
		//if(learningProgram.learningProgramCode=='ONE_TO_ONE'){
			getPartnerStudentGrade('',learningProgram.learningProgramCode+'_id_chart_'+k,userId,learningProgram.learningProgramCode,learningProgram.enrollmentFor);
		//}
	});
	partnerDicountSymbol='$';//partnerDicountSymbol=='Flat'?partnerDicountSymbol:'$';
	schoolDicountSymbol='$';//schoolDicountSymbol=='Flat'?schoolDicountSymbol:'$';
	revenue=revenue_d+revenue_id;
	revenue_pending=revenue_pending_d+revenue_pending_id;

	
	var dirPercent_p=revenue_pending==0.0?0.0:(revenue_pending_d/revenue_pending)*100;
	var thIsPercent_p=revenue_pending==0.0?0.0:(revenue_pending_id/revenue_pending)*100;
	revenue_d=revenue_d-revenue_pending_d;
	revenue_id=revenue_id-revenue_pending_id;
	revenue=revenue-revenue_pending;

	var dirPercent=revenue==0.0?0.0:(revenue_d/revenue)*100;
	var thIsPercent=revenue==0.0?0.0:(revenue_id/revenue)*100;
	// if(partnerDicountSymbol=='Flat'){
	// 	$("#totalRevenueValue").html(parseFloat(revenue).toFixed(2)+' Flat');
	// 	$("#directEnrollment").html(parseFloat(revenue_d).toFixed(2)+' Flat');
	// 	$("#throughIs").html(parseFloat(revenue_id).toFixed(2)+' Flat');
	// 	$("#pendingCommission").html(parseFloat(revenue_pending).toFixed(2)+' Flat');
	// }else{
		if(USER_ID == "19321" || USER_ID == "14388" || USER_ID == "18636"){
			$("#totalRevenueValue").html(partnerDicountSymbol+' '+parseFloat("324705").toFixed(2));
			$("#directEnrollment").html(partnerDicountSymbol+' '+parseFloat("310005").toFixed(2));
			$("#throughIs").html(schoolDicountSymbol+' '+parseFloat("14700").toFixed(2));
			$("#pendingCommission").html(partnerDicountSymbol+' '+parseFloat("15000").toFixed(2));
		}else{
			$("#totalRevenueValue").html(partnerDicountSymbol+' '+parseFloat(revenue).toFixed(2));
			$("#directEnrollment").html(partnerDicountSymbol+' '+parseFloat(revenue_d).toFixed(2));
			$("#throughIs").html(schoolDicountSymbol+' '+parseFloat(revenue_id).toFixed(2));
			$("#pendingCommission").html(partnerDicountSymbol+' '+parseFloat(revenue_pending).toFixed(2));
		}
		
	//}
	if(USER_ID == "19321" || USER_ID == "14388" || USER_ID == "18636"){
		$("#dirPercent").html(parseInt("95.39")+'%');
		$("#thIsPercent").html(parseInt("4.61")+'%');
		$("#dirPercent_p").html('$'+parseInt("15000"));
		$("#thIsPercent_p").html('$'+parseInt("0"));
	}else{
		$("#dirPercent").html(parseInt(dirPercent.toFixed())+'%');
		$("#thIsPercent").html(parseInt(thIsPercent.toFixed())+'%');
		$("#dirPercent_p").html('$'+parseInt(revenue_pending_d));
		$("#thIsPercent_p").html('$'+parseInt(revenue_pending_id));
	}
	
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var chartIndex = $(e.target).attr("data-tab-index");
		var chartIndexVal = $(e.target).attr("data-tab-value");
		valueMin1= $(e.target).attr("data-school-value");
		var valueMax1 = $(e.target).attr("data-partner-value");
		getCommissionRatesChart('chart'+chartIndex,''+chartIndexVal+'', valueMin1, valueMax1);
	});

}

function renderPartnerDashboardSchool(title, roleAndModule, schoolId, userId, role){
	var data = getPartnerDashboardDetailsData(userId);
	var html =
		'<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">'
			+dashboardHeaderContent()
			+'<div class="app-main p-0">'
				+'<div class="col p-0">'
					+'<div class="app-main__inner p-0">'
						+partnerDashboardContent(title, roleAndModule, schoolId, userId, role, data.allProgram, data.allStandard)
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
		+dashboardFooterContent()
		$('body').html(html);
		$("#chartContentDiv").html(partnerDashboardLPContent(data));
		$.each(data.schoolLPDetails.learningProgramDetails, function(k,learningProgram){
			getPartnerStudentGrade('',learningProgram.learningProgramCode+'_id_chart_'+k,userId,learningProgram.learningProgramCode,learningProgram.enrollmentFor);
		});
		// getPartnerStudentGrade('','chart-pie-enroll-one',userId);
		// getPartnerStudentGrade('','chart-pie-enroll-group',userId);
		// getPartnerStudentGrade('','chart-pie-enroll-self',userId);

		// getPartnerStudentGrade('','chart-pie-enroll-ssp',userId);
		// getPartnerStudentGrade('','chart-pie-enroll-elpss',userId);
		// getPartnerStudentGrade('','chart-pie-enroll-ddi',userId);
		$(".hideRate").addClass('d-none');
}

function partnerDashboardLPContent(data, isSubPartner){
	if(USER_ID == "19321" || USER_ID == "14388" || USER_ID == "18636"){
		data = [{
			"schoolLPDetails": {
				"learningProgramDetails": [
					{
						"c_revenue_id": "0",
						"partnerDicountSymbol": "Flat",
						"label": "Group Learning",
						"revenue_d": "29545.91",
						"revenue_pending_id": "0",
						"c_revenue_pending_d": "0",
						"learningProgramCode": "BATCH",
						"revenue_id": "0",
						"schoolDicountSymbol": "Flat",
						"c_revenue_d": "0",
						"c_revenue_pending_id": "0",
						"revenue_pending_d": "0.0",
						"schoolPartnerDicountSymbol": "-",
						"enrollmentFor": "enrollment"
					},
					{
						"c_revenue_id": "0",
						"partnerDicountSymbol": "Flat",
						"label": "Dual Diploma",
						"revenue_d": "53182.64",
						"revenue_pending_id": "0",
						"c_revenue_pending_d": "0",
						"learningProgramCode": "DUAL_DIPLOMA",
						"revenue_id": "0",
						"schoolDicountSymbol": "Flat",
						"c_revenue_d": "0",
						"c_revenue_pending_id": "0",
						"revenue_pending_d": "0",
						"schoolPartnerDicountSymbol": "-",
						"enrollmentFor": "enrollment"
					},
					{
						"c_revenue_id": "0",
						"partnerDicountSymbol": "Flat",
						"label": "One-To-One Learning",
						"revenue_d": "35955.09",
						"revenue_pending_id": "0",
						"c_revenue_pending_d": "0",
						"learningProgramCode": "ONE_TO_ONE",
						"revenue_id": "0",
						"schoolDicountSymbol": "Flat",
						"c_revenue_d": "0",
						"c_revenue_pending_id": "0",
						"revenue_pending_d": "0",
						"schoolPartnerDicountSymbol": "-",
						"enrollmentFor": "enrollment"
					},
					{
						"c_revenue_id": "0",
						"partnerDicountSymbol": "Flat",
						"label": "Flexy Program",
						"revenue_d": "46973.45",
						"revenue_pending_id": "0",
						"c_revenue_pending_d": "0",
						"learningProgramCode": "ONE_TO_ONE_FLEX",
						"revenue_id": "0",
						"schoolDicountSymbol": "Flat",
						"c_revenue_d": "0",
						"c_revenue_pending_id": "0",
						"revenue_pending_d": "0.0",
						"schoolPartnerDicountSymbol": "-",
						"enrollmentFor": "enrollment"
					},
					{
						"c_revenue_id": "0",
						"partnerDicountSymbol": "Flat",
						"label": "Self Study",
						"revenue_d": "52882.64",
						"revenue_pending_id": "0",
						"c_revenue_pending_d": "0",
						"learningProgramCode": "SCHOLARSHIP",
						"revenue_id": "0",
						"schoolDicountSymbol": "Flat",
						"c_revenue_d": "0",
						"c_revenue_pending_id": "0",
						"revenue_pending_d": "300.0",
						"schoolPartnerDicountSymbol": "-",
						"enrollmentFor": "enrollment"
					},
					{
						"c_revenue_id": "0",
						"partnerDicountSymbol": "Flat",
						"label": "Self Study Plus",
						"revenue_d": "70810.17",
						"revenue_pending_id": "0",
						"c_revenue_pending_d": "0",
						"learningProgramCode": "SSP",
						"revenue_id": "0",
						"schoolDicountSymbol": "Flat",
						"c_revenue_d": "0",
						"c_revenue_pending_id": "0",
						"revenue_pending_d": "0.0",
						"schoolPartnerDicountSymbol": "-",
						"enrollmentFor": "enrollment"
					},
					{
						"c_revenue_id": "0",
						"partnerDicountSymbol": "Flat",
						"label": "English Learning Program - One to One",
						"revenue_d": "17827.55",
						"revenue_pending_id": "0",
						"c_revenue_pending_d": "0",
						"learningProgramCode": "ONE_TO_ONE",
						"revenue_id": "0",
						"schoolDicountSymbol": "Flat",
						"c_revenue_d": "0",
						"c_revenue_pending_id": "0",
						"revenue_pending_d": "0",
						"schoolPartnerDicountSymbol": "-",
						"enrollmentFor": "exact-path-enrollment"
					},
					{
						"c_revenue_id": "0",
						"partnerDicountSymbol": "Flat",
						"label": "English Learning Program - Self Study",
						"revenue_d": "17827.55",
						"revenue_pending_id": "0",
						"c_revenue_pending_d": "0",
						"learningProgramCode": "SCHOLARSHIP",
						"revenue_id": "0",
						"schoolDicountSymbol": "Flat",
						"c_revenue_d": "0",
						"c_revenue_pending_id": "0",
						"revenue_pending_d": "0",
						"schoolPartnerDicountSymbol": "-",
						"enrollmentFor": "exact-path-enrollment"
					}
				],
				"referralCode": "IN2505073"
			},
			"message": "Partner Learning Program details",
			"status": "1",
			"statusCode": "S001"
		}];
	}
	var html =
		'<div class="col-12 p-0">'
			+'<div class="row">';
			if(USER_ID == "19321" || USER_ID == "14388" || USER_ID == "18636"){
				$.each(data[0].schoolLPDetails.learningProgramDetails, function(k,learningProgram){
					var revenue= parseFloat(learningProgram.revenue_d)+parseFloat(learningProgram.revenue_id);
					var revenue_pending=parseFloat(learningProgram.revenue_pending_d)+parseFloat(learningProgram.revenue_pending_id);
					revenue=revenue-revenue_pending;
					html+=
					'<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mb-4">'
						+'<div class="w-100 card h-100">'
							+'<div class="card-body">'
								+'<h5 class="card-title">'
									+'<div class="w-100 d-flex flex-wrap justify-content-between">'
										+'<span class="d-inline-block mb-1">'
											+learningProgram.label
										+'</span>'
										// +'<span class="pull-right text-primary mb-1">Commission: $'+(revenue == 0 && SCHOOL_ID == 2 ? (308*k):revenue)+'</span>'
										+'<span class="pull-right text-primary mb-1">'+(schoolSettingsOffice.schoolType == 'WLP' ? 'Revenue: $' : 'Commission: $')+(revenue == 0  ? (308*k):revenue)+'</span>'
									+'</div>'
								+'</h5>'
								+'<div id="'+learningProgram.learningProgramCode+'_id_chart_'+k+'"></div>'
							+'</div>'
						+'</div>' 
					+'</div>';
				});
			}else{
				$.each(data.schoolLPDetails.learningProgramDetails, function(k,learningProgram){
					var revenue= parseFloat(learningProgram.revenue_d)+parseFloat(learningProgram.revenue_id);
					var revenue_pending=parseFloat(learningProgram.revenue_pending_d)+parseFloat(learningProgram.revenue_pending_id);
					revenue=revenue-revenue_pending;
					html+=
					'<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mb-4">'
						+'<div class="w-100 card h-100">'
							+'<div class="card-body">'
								+'<h5 class="card-title">'
									+'<div class="w-100 d-flex flex-wrap justify-content-between">'
										+'<span class="d-inline-block mb-1">'
											+learningProgram.label
										+'</span>';
										if(isSubPartner == "N"){
											html+='<span class="pull-right text-primary mb-1">'+(schoolSettingsOffice.schoolType == 'WLP' ? 'Revenue: $' : 'Commission: $')+(revenue == 0 && SCHOOL_ID == 2 ? (308*k):revenue)+'</span>';
										}
									html+='</div>'
								+'</h5>'
								+'<div id="'+learningProgram.learningProgramCode+'_id_chart_'+k+'"></div>'
							+'</div>'
						+'</div>' 
					+'</div>';
				});
			}
			html+=
			'</div>'
		+'</div>'
	return html;
}

{/* <div class="page-title-subheading">${title}</div> */}
function partnerDashboardContent(title, roleAndModule, schoolId, userId, role, commissionRate){
	const enrollmentMap= {GP:"Enrollment Partner",WLP:"White Label Partner",RP:"Reseller Partner",EPER:"Enrollment Partner with Enrollment Rights"};

	var data=getPartnerDashboardDetails(userId);
	localStorage.setItem('convertYear',data.counselor.convertYear);
	localStorage.setItem('referralCode'+USER_ID,data.schoolServiceLinks.referralCode);
	localStorage.setItem('originalPartnerType'+USER_ID,data.originalPartnerType);
	var html = 
		`<div class="app-page-title mb-3 py-2">
			<div class="page-title-wrapper">
				<div class="page-title-heading">
                    <div class="page-title-icon"><img src="${PATH_FOLDER_IMAGE2}/Icon/sidebar/Dashboard.png" style="max-width:200px; width: 90%; margin-right: auto; display: flex;"></i></div>
					<div>
						<span class="text-primary welcome-name-text">Welcome ${data.userFullName}</span>
					</div>
				</div>
				${data.interestedFor == "B2B"?
					`<div class="page-title-actions mr-auto position-relative">
						<h6 class="font-size-lg">Partner Type:&nbsp;<span class="text-primary">${enrollmentMap[data.originalPartnerType]||''}</span></h6>
					</div>
					`:``
				}
					<div class="bg-primary text-white px-3 py-1 rounded-10">
						<div class="d-flex flex-wrap align-items-center">
							<span class="float-left font-weight-semi-bold font-size-14 mr-2">${enrollmentMap[data.originalPartnerType] == 'White Label Partner' ? 'Partner Code' : 'Enrollment Partner Code'}</span>
							<span class="float-right font-14 ml-3">${data.cityName} | ${data.countryName}</span>    
						</div>
						<div>
							<a href="javascript:void(0)" class="bg-white text-primary rounded-10 font-weight-semi-bold py-0 px-2 d-inline-flex align-items-center mt-1 text-decoration-none" onclick="copyURL('copyCode1','copy-msg-1')">${data.schoolServiceLinks.referralCode} <i class="fa fa-copy float-right ml-3"></i></a>    
							<b class="copy-msg-1 text-white ml-1" style="color:#fff !important"></b>
							<div style="top:18px;left:0;position:absolute;">
								<input type="text" id="copyCode1" value="${data.schoolServiceLinks.referralCode}" style="opacity:0;height:0px">
							</div>
						</div>
					</div>
			</div>
		</div>

		<div class="main-card mb-3">
			<h5 class="font-weight-semi-bold text-dark">Account Manager Details</h5>
			<div class="mb-3 card border rounded-10">
				<div class="card-body">`
					+getAccountManagerDetailsContent(data)
				html+=
				`</div>
			</div>
			<div class="row" id="commissionRow">
				<div class="col-xl-5 col-lg-5 col-md-6 col-sm-12 col-12 mb-2" id="partnerChartDiv"></div>				
				<div class="col-xl-7 col-lg-7 col-md-6 col-sm-12 col-12 mb-2" id="enrollmentLinkDiv"></div>`				
			html+=`</div>`;
			if(commissionRate.isSubPartner !="Y"){
				html+=getRevenueContent(data.originalPartnerType);
			}
			html+=getEnrollmentStatisticsContent();
		html+=`</div>`;
		getPartnerCommissionRateSchool('','partnerCommitionRate',userId, function(commissionData) {
			if(commissionData.isSubPartner == "N"){
				$("#commissionRow #partnerChartDiv").html(getChartContent(commissionData.commissionRates, userId, "",  data.allProgram, data.allStandard));
				$("#commissionRow #partnerChartDiv").show();
				$("#commissionRow #enrollmentLinkDiv").removeClass("col-12 mb-2")
				$("#commissionRow #enrollmentLinkDiv").addClass("col-xl-7 col-lg-7 col-md-6 col-sm-12 col-12 mb-2")
			}else{
				$("#commissionRow #partnerChartDiv").hide();
				$("#commissionRow #enrollmentLinkDiv").removeClass("col-xl-7 col-lg-7 col-md-6 col-sm-12 col-12 mb-2")
				$("#commissionRow #enrollmentLinkDiv").addClass("col-12 mb-2")
			}
			$("#commissionRow #enrollmentLinkDiv").html(getEnrollmentLinksContent(data));
			if(commissionData.commissionRates.length>0){
				var chartIndexVal1= $("#commissionRatesTab_0").attr("data-tab-value");
				var valueMin1=$("#commissionRatesTab_0").attr("data-school-value");
				var valueMax1=$("#commissionRatesTab_0").attr("data-partner-value");
				getCommissionRatesChart('chart0',''+chartIndexVal1+'', valueMin1, valueMax1);
			}
			
		}).then(function(){
			setTimeout(function() {
				$('a[data-toggle="tab"]').off('shown.bs.tab').on('shown.bs.tab', function (e) {
					var chartIndex = $(e.target).data("tab-index");
					var chartIndexVal = $(e.target).data("tab-value");
					var valueMin1 = $(e.target).data("school-value");
					var valueMax1 = $(e.target).data("partner-value");
					getCommissionRatesChart('chart' + chartIndex, chartIndexVal, valueMin1, valueMax1);
				});
			}, 1000);
		});
	return html;
}

function getAccountManagerDetailsContent(data){
	console.log(data);
	var html=
		`<div class="row align-items-center">
			<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 border-right text-dark mb-lg-0 mb-3">
				<div class="full px-3">
					<div class="d-flex w-100">
						<div class="icon-wrapper rounded-circle m-0" style="width:25px;height:25px">
							<div class="icon-wrapper-bg opacity-9 bg-primary"></div>
							<i class="fa fa-user text-white font-12"></i>
						</div> 
						<div>
							<h6 class="ml-1 font-size-lg font-weight-semi-bold">Name</h6>    
						</div>  
					</div>
					<div class="font-size-lg">${data.counselor.name}</div>
				</div>
			</div>
			<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 border-right text-dark mb-lg-0 mb-3">
				<div class="full px-3">
					<div class="d-flex w-100">
						<div class="icon-wrapper rounded-circle m-0" style="width:25px;height:25px">
							<div class="icon-wrapper-bg opacity-9 bg-primary"></div>
							<i class="fa fa-envelope text-white font-12"></i>
						</div> 
						<div>
							<h6 class="ml-1 font-size-lg font-weight-semi-bold">Email</h6>    
						</div>  
					</div>
					<div class="font-size-lg">${data.counselor.email}</div>
				</div>
			</div> 
			<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 text-dark mb-lg-0 mb-3">
				<div class="d-flex flex-wrap px-3 align-items-center justify-content-between">
					<div class="mb-md-0 mb-3">
						<div class="d-inline-flex w-100">
							<div class="icon-wrapper rounded-circle m-0" style="width:25px;height:25px">
								<div class="icon-wrapper-bg opacity-9 bg-primary"></div>
								<img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" class="position-relative mx-auto" style="z-index:5;width:15px;">
							</div> 
							<div>
								<h6 class="ml-1 font-size-lg font-weight-semi-bold">WhatsApp</h6>    
							</div>  
						</div>
						<div class="font-size-lg">${data.counselor.whatsapp}</div>    
					</div>
				</div>
			</div>   
		</div>`;
	return html;
}



function getChartContent(commissionRate, userId, isSubPartner, allProgram, allStandard){
	var html=
		`<div class="full">
			<h5 class="font-weight-semi-bold text-dark">${schoolSettingsOffice.schoolType == 'WLP' ? 'Total Revenue and Profit' : 'Your Commission Rates'}</h5>
			<div class="w-100 mb-3 card border rounded-10" style="height:calc(100% - 32px)">
				<div class="card-body">`
					+getEnrollmentRangeContentByLeaningAndGradeContent(userId, allProgram, allStandard);
					html+=`<div class="full" id="rangeAndCommissionRateDiv">`
						+getEnrollmentRangeContent(commissionRate, userId)
						+getEnrollmentRangeCommissionRateContent(commissionRate)
					html+=`</div>
				</div>
			</div>    
		</div>`;
	return html;
}

function getEnrollmentRangeContent(commissionRate){
	var html=``;
		if(commissionRate.length>0){
			html+=
			`<div class="d-flex flex-wrap align-items-center mb-1">
				<span class="font-weight-semi-bold d-inline-block mr-2">Enrollment Range: </span>
				<ul class="flex-grow-1 p-0 body-tabs body-tabs-layout tabs-animated body-tabs-animated nav" style="min-width:200px">`;
					$.each(commissionRate, function(i, v){
						var minmaxrange= v.min_range+'-'+v.max_range;
						if(v.max_range==0){
							minmaxrange= v.min_range+'+';
						}
						html+=
						`<li class="nav-item float-left">
							<a href="#commissionRatesTabContent_`+i+`" id="commissionRatesTab_`+i+`" data-tab-index="${i}" data-tab-value="${minmaxrange}" data-school-value="${v.bySchoolValue}" data-partner-value="${v.byPartnerValue}" class="px-2 py-1 nav-link ${i==0?'active':''}" role="tab" data-toggle="tab" aria-selected="false">
								<span>${minmaxrange}</span>
							</a>
						</li>`;
					});
				html+=`</ul>
			</div>`;
		}else{
			html+=`<br/>`;
		}
	return html;
}

function getCommissionPayTypeLabel(index, commissionRate){
	var commissionPayTypeColor='';
	var commissionPayTypeName='';
	if(commissionRate[index].commission_type=='SWP'){
		commissionPayTypeColor="bg-success";
		commissionPayTypeName="Commission Based Enrollment";
	}else if(commissionRate[index].commission_type=='PWP') {
		commissionPayTypeName='Seller Based Enrollment';
		commissionPayTypeColor="bg-primary";
	}
	
	var html=
	`<div class="full mb-2" id="commissionTypeLabel">
		<span class="${commissionPayTypeColor} p-1 text-white font-12">${commissionPayTypeName}</span>
	</div>`;
	return html;
}

function getEnrollmentRangeContentByLeaningAndGradeContent(userId, allProgram, allStandard){
	var html=``;
	if(USER_ROLE == "B2B_PARTNER"){
		html+=
		`<div class="d-flex flex-wrap align-items-center mb-1 gap-10">
			<div class="flex-grow-1">
				<select name="commissionlearningProgram" id="commissionlearningProgram" class="form-control form-control-sm">`;
					if(allProgram > 0){
						html += `<option value="A">All Program</option>`;
					}
					html+=getLearningProgramContent(SCHOOL_ID);
				html+=`</select>
			</div>
			<div class="flex-grow-1">
				<select name="commissionStandardId" id="commissionStandardId" class="form-control form-control-sm">`;
					if(allStandard > 0){
						html += `<option value="A">All Grade</option>`;
					}
					html+=getStandardContent(SCHOOL_ID, true);
				html+=`</select>
			</div>
			<div class="flex-grow-1 ml-auto">
				<a href="javascript:void(0)" class="btn btn-sm btn-primary w-100" onclick="getCommissionRatesByLearningAndGrade(${userId})">View</a>
			</div>
		</div>`;
	}
	return html;
}

function getEnrollmentRangeCommissionRateContent(commissionRate){
	var html=
		`<div class="tab-content">`;
			if(commissionRate.length>0){
				$.each(commissionRate, function(i,v){
					if(USER_ID == "19321" || USER_ID == "14388"){
						v.bySchoolType='%';
						var symbol=v.bySchoolType=='%'?'':'$';
					}else{
						var symbol=v.bySchoolType=='%'?'':'$';
					}
					html+=
					`<div class="tab-pane tabs-animation fade ${i==0?'show active':''}" id="commissionRatesTabContent_`+i+`" role="tabpanel">`
						if(USER_ROLE == "B2B_PARTNER"){
							html+=getCommissionPayTypeLabel(i, commissionRate);
						}
						html+=`<div class="d-flex flex-wrap">
							<div class="d-inline-flex flex-column flex-grow-1">
								<div class="mb-3">
									<span class="h-100 bg-primary rounded float-left mr-2" style="width:4px"></span>
									<h5 class="font-weight-light m-0">${symbol} ${v.bySchoolValue} ${v.bySchoolType}</h5>
									<p class="font-12 mb-2">${schoolSettingsOffice.schoolType == 'WLP' ? 'Revenue-Through IS' : 'Commission-Through IS'}</p>
								</div>
								<div>
									<span class="h-100 bg-alternate rounded float-left mr-2" style="width:4px"></span>
									<h5 class="font-weight-light m-0">${symbol} ${v.byPartnerValue} ${v.byPartnerType}</h5>
									<p class="font-12 m-0">${schoolSettingsOffice.schoolType == 'WLP' ? 'Revenue-Direct Enrollment' : 'Commission-Direct Enrollment'}</p>
								</div>
							</div>
							<div class="mx-auto overflow-hidden" style="position: relative; max-width:200px;max-height:101px;">
								<div id="chart`+i+`" style="visibility:hidden;opacity:0"></div>
								<div class="icon-wrapper rounded-circle m-0 position-absolute" style="width:25px;height:25px; top: calc(50% - 5px);left: 50%;width: 30px;height: 30px;transform: translate(-50%, -50%);z-index: 10;">
									<div class="icon-wrapper-bg opacity-9 bg-light-primary"></div>
									<i class="fa fa-users" style="font-size:14px;"></i>
								</div>
								
							</div>
						</div>
					</div>`;
				});
			}else{
				html+=
				`<div class="tab-pane tabs-animation fade active show">
					<div class="d-flex flex-wrap">
						<div class="d-inline-flex flex-column flex-grow-1">
							<div class="mb-3">
								<span class="h-100 bg-primary rounded float-left mr-2" style="width:4px"></span>
								<h5 class="font-weight-light m-0">00.0</h5>
								<p class="font-12 mb-2">Commission-Through IS</p>
							</div>
							<div>
								<span class="h-100 bg-alternate rounded float-left mr-2" style="width:4px"></span>
								<h5 class="font-weight-light m-0">00.0</h5>
								<p class="font-12 m-0">Commission-Direct Enrollment</p>
							</div>
						</div>
					</div>
				</div>`;
			}
		html+=`</div>`;
	return html;
}


function getEnrollmentLinksContent(data){
	var html=
		`<div class="full">
			<h5 class="font-weight-semi-bold text-dark invisible">Enrollments ${data.interestedFor == "B2B"?'':'& Seats Reservation'} Links</h5>
			<div class="w-100 mb-3 card border rounded-10" style="height:calc(100% - 32px)">
				<div class="card-body">
					<div class="d-flex mb-3 rounded-pill bg-light border overflow-hidden" style="width: fit-content; position: relative; z-index: 9;">
						<button type="button" class="btn btn-sm px-3 py-1 rounded-pill text-white bg-primary border-0" id="enrollmentTabBtn" onclick="toggleLinkTab('enrollment')">Your Enrollment Links</button>
						${data.interestedFor == "B2B"?``:`<button type="button" class="btn btn-sm px-3 py-1 rounded-pill text-dark bg-transparent border-0" id="seatTabBtn" onclick="toggleLinkTab('seat')">Seat Reservation Links</button>`}
						
					</div>
					<div id="enrollmentLinksSection" class="d-flex flex-wrap" style="gap:5px;">`;
						$.each(data.schoolServiceLinks.learningProgramLinks, function(k,learningProgram){
							var lProgram="";
							if(learningProgram.label=="Group Learning"){	
								lProgram="BATCH";	
							}else if(learningProgram.label=="Dual Diploma"){
								lProgram="DUAL_DIPLOMA";
							}else if(learningProgram.label=="One-To-One Learning"
								|| learningProgram.label=="English Learning Program - One to One"
							){
								lProgram="ONE_TO_ONE";
							}else if(learningProgram.label=="Flexy Program"){
								lProgram="ONE_TO_ONE_FLEX";
							}else if(learningProgram.label=="Self Study"
								|| learningProgram.label=="English Learning Program - Self Study"
							){
								lProgram="SCHOLARSHIP";
							}else if(learningProgram.label=="Self Study Plus"){
								lProgram="SSP";
							}else if(learningProgram.label=="Connect To Impact" ){
								lProgram="CTI";
							}
							if(USER_ROLE != "B2B_PARTNER"){
								html+=
								`<div>
									<a href="javascript:void(0)" class="bg-light-primary text-primary border border-light-primary rounded font-weight-semi-bold p-1 px-2 d-inline-flex align-items-center mt-1 text-decoration-none" onclick="copyURL('${learningProgram.learningProgramCode}_id_${k}','${learningProgram.learningProgramCode}_class_${k}');saveCounselorDashboardCopyLink('${data.schoolServiceLinks.referralCode}', '${lProgram}');">${learningProgram.label} <i class="fa fa-copy float-right ml-3"></i></a>    
									<b class="${learningProgram.learningProgramCode}_class_${k} mx-1"></b>
									<div style="top:18px;left:0;position:absolute;">
										<input class="tinyUrl" type="text" id="${learningProgram.learningProgramCode}_id_${k}" value="${learningProgram.link}" style="opacity:0;height:0px">
									</div>
								</div>`;
							}else{
								if(learningProgram.label != "Connect To Impact"){
									html+=
									`<div>
										<a href="javascript:void(0)" class="bg-light-primary text-primary border border-light-primary rounded font-weight-semi-bold p-1 px-2 d-inline-flex align-items-center mt-1 text-decoration-none" onclick="copyURL('${learningProgram.learningProgramCode}_id_${k}','${learningProgram.learningProgramCode}_class_${k}');saveCounselorDashboardCopyLink('${data.schoolServiceLinks.referralCode}', '${lProgram}');">${learningProgram.label} <i class="fa fa-copy float-right ml-3"></i></a>    
										<b class="${learningProgram.learningProgramCode}_class_${k} mx-1"></b>
										<div style="top:18px;left:0;position:absolute;">
											<input class="tinyUrl" type="text" id="${learningProgram.learningProgramCode}_id_${k}" value="${learningProgram.link}" style="opacity:0;height:0px">
										</div>
									</div>`;
								}
							}
						});
					html+=`</div>
					<div id="seatLinksSection" class="d-none flex-wrap" style="gap:5px;">`;
						$.each(data.schoolServiceLinks.learningProgramRasLinks, function(k,learningProgram){

							var lProgram="";
							if(learningProgram.label=="Group Learning"){	
								lProgram="BATCH";	
							}else if(learningProgram.label=="Dual Diploma"){
								lProgram="DUAL_DIPLOMA";
							}else if(learningProgram.label=="One-To-One Learning"
								|| learningProgram.label=="English Learning Program - One to One"
							){
								lProgram="ONE_TO_ONE";
							}else if(learningProgram.label=="Flexy Program"){
								lProgram="ONE_TO_ONE_FLEX";
							}else if(learningProgram.label=="Self Study"
								|| learningProgram.label=="English Learning Program - Self Study"
							){
								lProgram="SCHOLARSHIP";
							}else if(learningProgram.label=="Self Study Plus"){
								lProgram="SSP";
							}else if(learningProgram.label=="Connect To Impact"){
								lProgram="CTI";
							}

							const excludedLabels = [
								"Flexy Program",
								"English Learning Program - One to One",
								"English Learning Program - Self Study"
							];
							if (excludedLabels.includes(learningProgram.label)) return;
							html+=
							`<div>
								<a href="javascript:void(0)" class="bg-seat-light-primary text-seat-primary border border-light-primary rounded font-weight-semi-bold p-1 px-2 d-inline-flex align-items-center mt-1 text-decoration-none" onclick="copyURL('${learningProgram.learningProgramCode}_id_${k+"_seat"}','${learningProgram.learningProgramCode}_class_${k+"_seat"}');saveCounselorDashboardCopyLink('${data.schoolServiceLinks.referralCode}', '${lProgram}');">${learningProgram.label} <i class="fa fa-copy float-right ml-3"></i></a>    
								<b class="${learningProgram.learningProgramCode}_class_${k+"_seat"} mx-1"></b>
								<div style="top:18px;left:0;position:absolute;">
									<input class="tinyUrl" type="text" id="${learningProgram.learningProgramCode}_id_${k+"_seat"}" value="${learningProgram.link}" style="opacity:0;height:0px">
								</div>
							</div>`;
						});
					html+=`</div>
				</div>
			</div>    
		</div>`;
	return html;
}

function getRevenueContent(partnerOrgType){
	var showPendingCommission = partnerOrgType !== "WLP";
	
	var html =
	`<div class="row mt-3">
		<div class="col-12">
			<h5 class="font-weight-semi-bold text-dark">${showPendingCommission ? 'Commission Details' : 'Total Revenue and Profit'}</h5>
		</div>
		<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-3"> 
			<div class="bg-light-success border border-success px-2 p-1 rounded-10 h-100 d-flex align-items-center flex-column">
				<div class="d-flex flex-wrap mb-1 w-100">
					<h5 class="font-weight-semi-bold text-dark flex-grow-1 m-0 font-size-lg">${showPendingCommission ? 'Total Commission: ' : 'Total Revenue'}</h5>
					<h5 class="font-weight-semi-bold text-dark m-0 font-size-lg" id="totalRevenueValue"></h5>
				</div>
				<div class="p-1 px-2 text-right rounded ml-auto" style="background:rgba(255, 255, 255, 0.6)">
					<span class="text-alternate">Direct Enrollment: <label class="m-0" id="dirPercent">0%</label>&nbsp;|&nbsp;</span>
					<span class="text-primary">Through IS: <label class="m-0" id="thIsPercent">0%</label></span>
				</div>
			</div>
		</div>
		<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-3"> 
			<div class="bg-light-alternate border border-alternate px-2 p-1 rounded-10 h-100 d-flex align-items-center">
				<div class="d-flex flex-wrap mb-1 w-100">
					<h5 class="font-weight-semi-bold text-dark flex-grow-1 m-0 font-size-lg">Direct Enrollment: </h5>
					<h5 class="font-weight-semi-bold text-dark m-0 font-size-lg" id="directEnrollment">$ 00.00</h5>
				</div>
			</div>
		</div>
		<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-3"> 
			<div class="bg-light-primary border border-primary px-2 p-1 rounded-10 h-100 d-flex align-items-center">
				<div class="d-flex flex-wrap mb-1 w-100">
					<h5 class="font-weight-semi-bold text-dark flex-grow-1 m-0 font-size-lg">Through IS: </h5>
					<h5 class="font-weight-semi-bold text-dark m-0 font-size-lg" id="throughIs">$ 00.00</h5>
				</div>
			</div>
		</div>
		${showPendingCommission ? `
		<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-3"> 
			<div class="bg-light-orange border border-orange px-2 p-1 rounded-10 h-100 d-flex align-items-center flex-column">
				<div class="d-flex flex-wrap mb-1 w-100">
					<h5 class="font-weight-semi-bold text-dark flex-grow-1 m-0 font-size-lg">Pending Commission: </h5>
					<h5 class="font-weight-semi-bold text-dark m-0 font-size-lg" id="pendingCommission">$ 00.00</h5>
				</div>
				<div class="p-1 px-2 text-right rounded ml-auto" style="background:rgba(255, 255, 255, 0.6)">
					<span class="text-alternate">Direct Enrollment: <label class="m-0" id="dirPercent_p">0%</label>&nbsp;|&nbsp;</span>
					<span class="text-primary">Through IS: <label class="m-0" id="thIsPercent_p">0%</label></span>
				</div>
			</div>
		</div>
		` : ''}
	</div>`;
	return html;
}

function getEnrollmentStatisticsContent(){
	var html=
	`<div class="row mt-3">
		<div class="col-12">
			<h5 class="font-weight-semi-bold text-dark">Enrollment Statistics</h5>
		</div>
		<div class="col-12">
			<div id="chartContentDiv"></div>
		</div>
	</div>`;
	return html;
}

async function dashboardHeaderContent(){
	var schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	var html=
		'<div class="sticky-header">'
			+'<div class="app-header header-shadow">'
				+'<div class="app-header__logo">'
					+'<a href="'+schoolSettingsLinks.schoolWebsite+'" target="blank" class="logo-src" style="background:url('+schoolSettingsLinks.logoUrl+SCRIPT_VERSION+');"></a>'
				+'</div>'
				+'<div class="app-header__logo"></div>'
			+'</div>'
		+'</div>';
	return html;
}

async function dashboardFooterContent(){
	var schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
	var html=
	'<div class="app-wrapper-footer">'
		+'<div class="app-footer">'
			+'<div class="app-footer__inner">'
				+'<div class="col">'
					+ `<p style="margin:0">${schoolSettingsTechnical.isCoPoweredBy != null ? 'Powered by ' + schoolSettingsTechnical.copyrightName : 'Copyright © ' + schoolSettingsTechnical.copyrightYear + ' - ' + schoolSettingsTechnical.copyrightName + ' - All Rights Reserved.'}</p>`
				+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="server-message">'
			+'<span class="msg" id="msgTheme2"></span>'
		+'</div>'
	+'</div>';
	return html;
}

function loaderContent(){
	var html=
	'<div id="commonloaderIdNewLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">'
		// +'<div class="loader primary-border-top-color">'
		if(SCHOOL_ID==1){
			// html+=
			// '<div class="full">'
			// 	+'<img src="'+PATH_FOLDER_IMAGE2+'is_loader.gif" alt="${SCHOOL_NAME} Loader"/>'
			// +'</div>';
			html+=`<img src="`+PATH_FOLDER_IMAGE2+`loader-new.gif" alt="`+SCHOOL_NAME+` Loader" class="new-loader-2024" />`;
		}else{
			html+=
			'<div class="ball-rotate">'
				+'<div style="background-color: rgb(247, 185, 36);"></div>'
			+'</div>'
			+'<p>Loading ...</p>'
		}
		html+=
		// '</div>'
	'</div>';
	return html;
}

///////Enrolled Page 
async function renderPartnerList(title, roleAndModule, schoolId, userId, role){
	var payload = {};
    payload['userId'] = USER_ID;
    
    var subPartnerList = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-sub-partner-list',payload,'dashboard');
	if(role=='B2B_PARTNER'){
		$("#dashboardContentInHTML").html(partnerListContent(title, localStorage.getItem('referralCode'+USER_ID), localStorage.getItem('originalPartnerType'+USER_ID),subPartnerList.subPartnerList));
	}else if(USER_ROLE=='STUDENT_COUNSELOR' || USER_ROLE=='B2B_LEAD' || USER_ROLE=='DIRECTOR'){
		$("#dashboardContentInHTML").html(partnerListContent('Partner '+title, ''));
	}else{
		var html ='<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">';
			// html+= await dashboardHeaderContent();
			html+='<div class="app-main p-0">'
				+'<div class="col p-0">'
					+'<div class="app-main__inner p-0">'
						+partnerListContent(title, '')
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
		// html+= await dashboardFooterContent();
		$('#dashboardContentInHTML').html(html);
	}
	getLearningProgramContentFromServer(SCHOOL_ID,'partnerEnrollFilterForm','learningProgram')
	getSessionMasterList('partnerEnrollFilterForm', "academicYear", false);
	callPartnerCountries('partnerEnrollFilterForm', 0, 'countryId');
	callPartnerListBy('partnerEnrollFilterForm','partnerName');


	$("select#countryId").on("change",function(){
		callStates('partnerEnrollFilterForm', this.value, 'countryId');
	});
		
	$("select#stateId").on("change",function(){
		callCities('partnerEnrollFilterForm', this.value, 'stateId');
	});

	$("select#partnerName").on("change",function(){
		$("#referralCode").val($('option:selected', this).attr('dail-referral-code'));
   	});

	$("#partnerName").select2({
		theme:"bootstrap4"
	});
	$("#academicYear").select2({
		theme:"bootstrap4"
	});
	$("#enrollmentStatus").select2({
		theme:"bootstrap4"
	});
	$("#enrollmentBy").select2({
		theme:"bootstrap4"
	});
	$("#learningProgram").select2({
		theme:"bootstrap4"
	});
	$("#gradeId").select2({
		theme:"bootstrap4"
	});
	$("#commissionStatus").select2({
		theme:"bootstrap4"
	});
	$("#countryId").select2({
		theme:"bootstrap4"
	});
	$("#stateId").select2({
		theme:"bootstrap4"
	});
	$("#cityId").select2({
		theme:"bootstrap4"
	});
	$("#paymentDateFrom").datepicker({
		autoclose: true,
		format: 'M dd, yyyy',
	});
	$("#paymentDateTo").datepicker({
		autoclose: true,
		format: 'M dd, yyyy',
	});
	
	$(".follow-up-no").click(function(){
		$(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
		$(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
		$(this).parent().find(".follow-up-content").slideDown();
		$(this).parent().siblings().find(".follow-up-content").slideUp();
		$(this).parent().addClass("follow-up-accordian-active");
		$(this).parent().siblings().removeClass("follow-up-accordian-active");
	});
	getAllGrade(SCHOOL_ID);

	callStudentListByPartner('partnerEnrollFilterForm','default');
	$("#searchEnrolled").on('click',function(){
		callStudentListByPartner('partnerEnrollFilterForm','filter');
	});

	$("#bulkCommission").on('click',function(){
		//callStudentListByPartner('partnerEnrollFilterForm');
		$("#updateTransferCommission").modal('show');
		var totalCommiton  = getCallTotalCommission();
		$("#totalCommission").text(totalCommiton.toFixed(2));

		$("input[name=checkCommission]").on('change', function(){
			var totalCommiton  = getCallTotalCommission();
			$("#totalCommission").text(totalCommiton.toFixed(2));
		});
	});
	
	$("#btnClickCommission").on('click',function(){
		updateStudentPartnerCommissionRate('', '', '', '','');
	});

	$("#startDate").datepicker({
		format: 'M d, yyyy',
		autoclose: true,
	}).on("change", function(){
		var startDate = new Date($(this).val());
		startDate.setDate(startDate.getDate() + 1);
		$("#endDate").datepicker("remove");
		$("#endDate").datepicker({
			format: 'M d, yyyy',
			startDate: startDate,
			autoclose: true,
		});
		$("#endDate").prop("disabled",false);
	});
	$('html, body').animate({ scrollTop: 0 }, 500);
}

function partnerListContent(title, referralCode, originalPartnerType, subPartnerList){
	var hmlt=pageTitleEnrolledContent(title, originalPartnerType)
	hmlt+=mainCardEnrolled(referralCode, subPartnerList)
	return hmlt;
}

function pageTitleEnrolledContent(title, originalPartnerType){
	var html = 
		`<div class="app-page-title mb-3 py-2">
			<div class="page-title-wrapper d-flex justify-content-between align-items-center">
				<div class="page-title-heading">
					<div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>
					<h4>${title}</h4>
				</div>
				<div class="page-title-actions">
					<button onclick="toggleB2BPartnerFilterForm();" class="btn btn-sm btn-primary"><i class="fa fa-filter"></i>&nbsp;Filter</button>
				</div>
			</div>
		</div>`
	return html;
}

function mainCardEnrolled(referralCode, subPartnerList){
	var html= 
	'<div class="main-card mb-3 card">'
		+'<div class="card-body">'
			+'<div class="form-row" id="B2BStudentEnrollmentCountThumb"></div>'
			//+B2BStudentListfilterFormSkeleton()
			// +'<div class="row">'
			// 	+'<div class="col-12 mb-2 text-right">'
			// 		+'<a href="javascript:void(0)" class="btn btn-primary btn-shadow mr-2" onclick="showAdvanceSearchForm()"><i class="fa fa-search mr-2"></i>Advance Search</a>';
			// 		if(referralCode==''){
			// 			html+='<a href="javascript:void(0)" class="btn btn-success btn-shadow" id="bulkCommission"><i class="fa fa-edit mr-2"></i>Bulk Commission</a>';
			// 		}
			// 	html+='</div>'
			// +'</div>'
			+B2BStudentListfilterForm(referralCode, subPartnerList)
			// +revenueThumbListContentSkeleton()
			// +revenueThumbListContent()
			+B2BStudentListDetailsSkeleton()
			+'<div class="table-responsive col-12 px-0" id="enrolled-list">'
				//+B2BStudentListDetails()
			+'</div>'
		+'</div>'
	+'</div>'
	+B2BStudentListCommissionPopup();
	return html;
}

function getB2BStudentEnrollmentCount(enrollmentList){
	var html=``;
	$.each(enrollmentList, function(i,v){
		html+=
		`<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
			<div class="full p-2  border rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm ${i==0?'border-success bg-light-success':i==1?'border-warning bg-light-warning':'border-primary bg-light-primary'}">
				<span class="line-left d-inline-block position-absolute rounded-10 ${i==0?'bg-success':i==1?'bg-warning':'bg-primary'}"></span>
				<p class="m-0 font-12"><b>${v.label}</b></p>
				<p class="m-0">`;
					if(1>0){
						if(USER_ID == "19321" || USER_ID == "14388"){
							html+=`<b><a href="javascript:void(0)" class="text-dark" onclick="filterRequestData(\'partnerEnrollFilterForm\', \'${v.enrollmentValue}\')">${v.label=="Enrollment"?'785':v.label=="Incomplete enrollment"?'58':'572'}</a></b>`;
						}else{
							html+=`<b><a href="javascript:void(0)" class="text-dark" onclick="filterRequestData(\'partnerEnrollFilterForm\', \'${v.enrollmentValue}\')">${v.count}</a></b>`;
						}
					}else{
						html+=`-`;
					}
				html+=`</p>
			</div>
		</div>`;
	});
	return html;
}

function B2BStudentListfilterFormSkeleton(){
	var html=
		'<div class="col-12 mb-2">'
			+'<div class="row">'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12 mb-2">'
					+'<div class="full rounded skeleton" style="height:42px"></div>'
				+'</div>'
				+'<div class="col-xl-12 col-lg-3 col-sm-4 col-sm-6 col-12 text-right mb-2">'
					+'<div class="d-inline-block rounded skeleton" style="width:65px; height:38px"></div>'
				+'</div>'
			+'</div>'
		+'</div>'
	return html;
}

function B2BStudentListfilterForm(referralCode, subPartnerList){
	var html=
	'<form id="partnerEnrollFilterForm" class="custom-field-scope" style="display:none">'
		+'<div class="col-12 mb-2 border rounded-10 pb-1 pt-4 px-4  mb-4 ">'
			+'<div class="row">'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="schoolName" id="schoolName" disabled>'
							+'<option>Select School</option>'
							+'<option selected>'+SCHOOL_NAME+'</option>'
							+'<option>International School</option>'
						+'</select>'
						+'<label for="schoolName">Select School</label>'
					+'</div>'
				+'</div>';
				if(referralCode==''){
					html+='<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
						+'<div class="form-group custom-field">'
							+'<select class="form-control" name="partnerName" id="partnerName" >'
							+'</select>'
							+'<label for="partnerName">Select Partner</label>'
						+'</div>'
					+'</div>';
				}
				html+='<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="subPartner" id="subPartner">';
							if(USER_ROLE == "B2B_PARTNER"){
								html+='<option value="all">ALL</option>';
							}
							html+='<option value="">Select Sub-Partner</option>';
							if(USER_ROLE == "B2B_PARTNER"){
								$.each(subPartnerList, function(i, v){
									html+='<option value="'+v.id+'">'+v.userName+'</option>';
								});
							}
						html+='</select>'
						+'<label for="subPartner">Select Sub-Partner</label>'
					+'</div>'
				+'</div>'
				+'<input type="hidden" class="form-control" name="referralCode" id="referralCode" value="'+referralCode+'"/>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="academicYear" id="academicYear">'
						+'</select>'
						+'<label for="academicYear">Academic Year</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="enrollmentStatus" id="enrollmentStatus">'
						+ '<option value="">Enrollment Status</option>'
						+ '<option value="0">Enrolled</option>'
						+ '<option value="3">Re-Enrolled</option>'
						+ '<option value="1">Withdrawn</option>'
						+ '<option value="2">Partial Entry</option>'
						+'</select>'
						+'<label for="enrollmentStatus">Enrollment Status</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="enrollmentBy" id="enrollmentBy">'
						+ '<option value="">Select enrollment by</option>'
						+ '<option value="D">Direct enrolled</option>'
						+ '<option value="P">Added by Myself</option>'
						+'</select>'
						+'<label for="enrollmentBy">Enrollment By</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="gradeId" id="gradeId">'
						+'<option value="">Select Grade</option>'
						+ getStandardContent(SCHOOL_ID, false)
						+'</select>'
						+'<label for="gradeId">Grade</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<input type="text" class="form-control" name="studentName" id="studentName" placeholder=" "/>'
						+'<label for="studentName">Student Name</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<input type="text" class="form-control" name="email" id="email" placeholder=" "/>'
						+'<label for="email">Email</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="countryId" id="countryId"></select>'
						+'<label for="countryId">Country</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="stateId" id="stateId"></select>'
						+'<label for="stateId">State</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="cityId" id="cityId"></select>'
						+'<label for="cityId">City</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="commissionStatus" id="commissionStatus">'
							+'<option value="">Select Commission Status</option>'
							+'<option value="PENDING">Pending</option>'
							+'<option value="Amount Transferred">Amount Transferred</option>'
							+'<option value="None">None</option>'
						+'</select>'
						+'<label for="commissionStatus">Commission Status</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="learningProgram" id="learningProgram">'
						+'</select>'
						+'<label for="learningProgram">Learning Program</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<input type="text" class="form-control" name="paymentDateFrom" id="paymentDateFrom" placeholder=" " readonly onkeydown="return false"/>'
						+'<label for="paymentDateFrom">Payment Date From</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<input type="text" class="form-control" name="paymentDateTo" id="paymentDateTo" placeholder=" " readonly onkeydown="return false"/>'
						+'<label for="paymentDateTo">Payment Date To</label>'
					+'</div>'
				+'</div>'
				// +'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
				// 	+'<div class="form-group custom-field">'
				// 		+'<select class="form-control" name="paymentTitle" id="paymentTitle">'
				// 		+ getPaymentTitle(SCHOOL_ID)
				// 		+'</select>'
				// 		+'<label for="paymentTitle">Payment Title</label>'
				// 	+'</div>'
				// +'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="paymentStatus" id="paymentStatus">'
							+'<option value="">Select Payment Status</option>'
							+'<option value="SUCCESS">SUCCESS</option>'
							+'<option value="SCHEDULED">SCHEDULED</option>'
							+'<option value="INITIATED">INITIATED</option>'
							+'<option value="FAILED">FAILED</option>'
						+'</select>'
						+'<label for="paymentStatus">Payment Status</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="feeStatus" id="feeStatus">'
							+'<option value="">Select Fee Status</option>'
							+'<option value="PENDING">Pending Fees</option>'
							+'<option value="FULL">No Pending Fees</option>'
							+'<option value="FEENOTSELECT">Fee Plan not selected</option>'
						+'</select>'
						+'<label for="feeStatus">Fee Status</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<select class="form-control" name="sortBy" id="sortBy">'
							+'<option value="Desc">Desc</option>'
							+'<option value="Asc">Asc</option>'
						+'</select>'
						+'<label for="sortBy">Sort By</label>'
					+'</div>'
				+'</div>'
				// +'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
				// 	+'<div class="form-group custom-field">'
				// 		+'<select class="form-control" name="orderBy" id="orderBy">'
				// 			+'<option value="PAY_DATE">Fee Date</option>'
				// 			+'<option value="PAY_DATE">Fee Date</option>'
				// 		+'</select>'
				// 		+'<label for="orderBy">Order By</label>'
				// 	+'</div>'
				// +'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<div class="form-group custom-field">'
						+'<input type="text" class="form-control" value="25" name="pageSize" id="pageSize" placeholder=" "/>'
						+'<label for="pageSize">Page Size</label>'
					+'</div>'
				+'</div>'
				+'<div class="col-12 mt-2 text-right">';
				if(referralCode==''){
					html+='<a href="javascript:void(0)" class="btn btn-success  float-right pr-4 pl-4 ml-2" id="bulkCommission">Bulk Commission</a>';
				}

				html+='<a href="javascript:void(0)" class="btn btn-success  float-right pr-4 pl-4" id="searchEnrolled"><i class="fa fa-search"></i>&nbsp;Search</a>'
					+'<a href="javascript:void(0)" class="btn btn-danger  float-right pr-4 pl-4 mr-2" onclick="resetEnrollmentForm(\'partnerEnrollFilterForm\')"><i class="fa fa-undo"></i>&nbsp;Reset</a>'
				+'</div>'
			+'</div>'
		+'</div></form>';
	return html;
}

function B2BStudentListDetailsSkeleton(){
	var html=
		'<div class="col-12 mb-2 px-0" id="enroll-list-skeleton">'
		+'<table class="table table-bordered table-striped without_h_scroll" style="">'
		+'<thead class="theme-bg primary-bg white-txt-color">'
			+'<tr>'
			+'<th style="width: 3%;" class="skeleton">&nbsp;</th>'
			+'<th style="width: 19%;" class="skeleton">&nbsp;</th>'
			+'<th style="width: 21%;" class="skeleton">&nbsp;</th>'
			+'<th style="width: 19%;" class="skeleton">&nbsp;</th>'
			+'<th style="width: 19%;" class="skeleton">&nbsp;</th>'
			+'<th style="width: 19%;" class="skeleton">&nbsp;</th>'
			+'</tr>'
		+'</thead>'
		+'<tbody>'
			+'<tr>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
			+'</tr>'
			+'<tr>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
			+'</tr>'
			+'<tr>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
				+'<td class="skeleton" height="100px"></td>'
			+'</tr>'
		+'</tbody>'
	+'</table>'
		+'</div>'
	return html;
}

function B2BStudentListDetails(studentList, updateTransferMsg, isSubPartner){
	var html= 
		'<table class="table table-bordered font-12 border-radius-table" style="min-width:1300px;width:100%;font-size:11px !important" id="studentDataList">'
			+'<thead>'
				+'<tr>'
					+'<th class="bg-primary text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important">S No.</th>'
					+'<th class="bg-primary text-white bold border-bottom-0">Student Details</th>'
					+'<th class="bg-primary text-white bold border-bottom-0">Enrollment Details</th>'
					+'<th class="bg-primary text-white bold border-bottom-0 text-center">Fee Details</th>'
					+'<th class="bg-primary text-white bold border-bottom-0 text-center">Fee Schedule</th>';
					if(isSubPartner == 'N'){
						html += '<th class="bg-primary text-white bold border-bottom-0 text-center">Expected Commision</th>';
					}
					html += '<th class="bg-primary text-white bold border-bottom-0 rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Action</th>'
				+'</tr>'
			+'</thead>'
			+'<tbody class="student-table-css">';
				if(studentList.length>0){
					var sreno=1;
					for (let s = 0; s < studentList.length; s++) {
						const stuList = studentList[s];
						var onclickTransfer = "updateStudentPartnerCommissionRate('"+stuList.stuStandardId+"', 'Amount Transferred','"+stuList.commition+"','"+stuList.strCommRate+"','"+stuList.referralCode+"');";
						var onclickNone = "updateStudentPartnerCommissionRate('"+stuList.stuStandardId+"', 'None','"+stuList.commition+"','"+stuList.strCommRate+"','"+stuList.referralCode+"');";

						html+='<tr>'
								+'<td class="text-center" style="max-width:40px;min-width: 60px;">'+sreno+'</td>'
								+'<td class=" vertical-align-top">'
									+'<table class="w-100">'
										+'<tbody>'
											+'<tr>'
												+'<th class="border-0 p-1 font-weight-bold" style="width:148px">Name:</th>'
												+'<td class="border-0 p-1">'+stuList.studentName+'</td>'
											+'</tr>';
											if(stuList.admissionType=='Partial Entry'){
												html+='<tr>'
													+'<th class="border-0 p-1 font-weight-bold" style="width:148px">Email:</th>'
													+'<td class="border-0 p-1">'+stuList.email+'</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="border-0 p-1 font-weight-bold" style="width:148px">Phone:</th>'
													+'<td class="border-0 p-1">'+stuList.phone+'</td>'
												+'</tr>';
											}
											html+='<tr>'
												+'<th class="border-0 p-1 font-weight-bold" style="width:148px">Country | State | City:</th>'
												+'<td class="border-0 p-1">'+stuList.countryName+' | '+stuList.stateName+' | '+stuList.cityName+'</td>'
											+'</tr>'
											+'<tr>'
												+'<th class="border-0 p-1 font-weight-bold" style="width:148px">Grade:</th>'
												+'<td class="border-0 p-1">'+stuList.standardName.replace("Grade ","")+'</td>'
											+'</tr>'
											+'<tr>'
												+'<th class="border-0 p-1 font-weight-bold" style="width:148px">Learning Program:</th>'
												+'<td class="border-0 p-1">'+stuList.learningMode+'</td>'
											+'</tr>';
											var commissionPayTypeColor="";
											var commissionPayTypeName="";
											if(stuList.commissionPayType=='SWP'){
												commissionPayTypeColor="bg-success";
												commissionPayTypeName="Commission Based Enrollment";
											}else if(stuList.commissionPayType=='PWP') {
												commissionPayTypeName='Seller Based Enrollment';
												commissionPayTypeColor="bg-primary";
											}
											html+='<tr>'
													+'<td class="border-0 p-1 font-weight-bold " colspan="2"><span class="'+commissionPayTypeColor+' p-1 text-white">'+commissionPayTypeName+'</span></td>'
												+'</tr>'
										+'</tbody>'
									+'</table>'
								+'</td>'
								+'<td class="p-0  vertical-align-top">'
									+'<table class="w-100">'
										+'<tbody>'
											+'<tr>'
												+'<td class="border-0">'
													+'<table class="w-100">'
														+'<tbody>'
															+'<tr>'
																+'<th class="border-0 p-1 font-weight-bold" style="width:112px">Enrollment Status:</th>'
																+'<td class="border-0 p-1">'+stuList.admissionType+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-1 font-weight-bold" style="width:112px">Enrollment Date:</th>'
																+'<td class="border-0 p-1">'+(stuList.admissionType=='Partial Entry'?'N/A':stuList.admissionDate)+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-1 font-weight-bold" style="width:112px">Academic Duration:</th>'
																+'<td class="border-0 p-1">'+(stuList.startDate=='N/A'?'N/A':stuList.startDate+' - ')+stuList.endDate+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-1 font-weight-bold" style="width:112px">Enrollment Type:</th>'
																+'<td class="border-0 p-1">'+stuList.enrollType+'</td>'
															+'</tr>';
															// if(stuList.counselorId!=USER_ID){
																html+='<tr>'
																	+'<th class="border-0 p-1 font-weight-bold" style="width:112px">Partner Name:</th>'
																	+'<td class="border-0 p-1">'+stuList.counselorUsername+'</td>'
																+'</tr>';
															// }
															var enrollColor="bg-primary";
															var enrollType="Enrollment via IS";
															if(stuList.studentEnrollBy=='P'){
																if(stuList.referralCode == localStorage.getItem('referralCode'+USER_ID)){
																	enrollType='Added by Myself';
																}else{
																	enrollType='Added by Partner';
																}
																enrollColor="bg-orange";
															}else if(stuList.studentEnrollBy=='D'){
																enrollType='Direct Enrollment';
																enrollColor="bg-alternate";
															}
															html+='<tr>'
																	+'<td class="border-0 p-1 font-weight-bold " colspan="2"><span class="'+enrollColor+' p-1 text-white">'+enrollType+'</span></td>'
																+'</tr>';
															html+='</tbody>'
													+'</table>'
												+'</td>'
											+'</tr>'
										+'</tbody>'
									+'</table>'
								+'</td>'
								+'<td class="p-0  vertical-align-top">'
									+'<table class="w-100">'
										+'<tbody>'
											+'<tr>'
												+'<td class="border-0">'
													+'<table class="w-100">'
														+'<tbody>'
															+'<tr>'
																+'<th class="border-0 p-1 font-weight-bold" style="width:95px">Fee Plan:</th>'
																+'<td class="border-0 p-1">'+stuList.paymentType+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-1 font-weight-bold" style="width:95px">Total Fee:</th>'
																+'<td class="border-0 p-1">'+stuList.totalFee+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-1 font-weight-bold" style="width:95px">Pending Fee:</th>'
																+'<td class="border-0 p-1">'+stuList.paymentDue+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-1 font-weight-bold" style="width:95px">Last Paid Fee:</th>'
																+'<td class="border-0 p-1">'+stuList.amount+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-1 font-weight-bold" style="width:95px">Last Paid Date:</th>'
																+'<td class="border-0 p-1">'+stuList.paymentDate+'</td>'
															+'</tr>'
														+'</tbody>'
													+'</table>'
												+'</td>'
											+'</tr>'
										+'</tbody>'
									+'</table>'
								+'</td>';
								if(stuList.paymentType=='One-time payment' && stuList.paymentDue=="$ 0.00"){

									html+='<td class="p-0  vertical-align-middle text-center" style="width: 230px;">'
										+'<strong>No Pending Fees</strong>'
									+'</td>';
								}else{
									if(stuList.paymentDue=="$ 0.00" || stuList.paymentDue=='N/A' || stuList.paymentDue=="All Paid"){
										if(stuList.paymentType=="N/A"){
											html+='<td class="p-0  vertical-align-middle text-center" style="width: 230px;"><strong>N/A</strong></td>';
										}else{
											html+='<td class="p-0  vertical-align-middle text-center" style="width: 230px;"><strong>No Pending Fees</strong></td>';
										}
									}else{
										html+='<td class="p-0  vertical-align-top ulli" style="width: 230px;">';
										if(stuList.scheduleArray!=null){
											html+='<ul class="follow-up-accordian m-0 p-0 overflow-auto" style="min-height: 180px;max-height: 180px;">';
											var srNo=1;
											var callcss=1;
											for (let sc = 0; sc < stuList.scheduleArray.length; sc++) {
												var srStr="";
												if(srNo==1){
													srStr=srNo+'st';
												}else if(srNo==2){
													srStr=srNo+'nd';
												}else if(srNo==3){
													srStr=srNo+'rd';
												}else{
													srStr=srNo+'th';
												}
												const stuSchedule = stuList.scheduleArray[sc];
												var classActive='';
												var classActiveCss='none';
												//if(stuSchedule.status!='SUCCESS'){
													paymentList=false;
													// if(callcss==1){
													// 	classActive ="follow-up-accordian-active";
													// 	classActiveCss = "block";
													// }
													if(stuSchedule.status=='SCHEDULED'){
														if(callcss==1){
															classActive ="follow-up-accordian-active";
															classActiveCss = "block";
															callcss=0;
														}
													}	
													var liHeading=srStr+" Installment";
													if(stuList.paymentType=='One-time payment'){
														liHeading=stuList.paymentType;
													}
													html+='<li class="'+classActive+'">'
														+'<span class="cursor follow-up-no text-primary p-2 text-center border-primary full bold">'+liHeading+'<i class="fa '+(stuSchedule.status=='SCHEDULED'?"fa-angle-up":"fa-angle-down")+' float-right" style="line-height: 20px;"></i>'
														+'</span>'
														+'<div class="follow-up-content text-center" style="display:'+classActiveCss+'">'
															+'<div class="bg-light-primary p-2 m-2 rounded text-left">'
																+'<div class="full d-block mb-1">'
																	+'<span><strong>Fee:</strong>'+stuSchedule.payAmount+'</span>';
																	// if(stuSchedule.status != "SUCCESS"){
																	// 	html+='<span class="float-right" id="payNowBtn'+stuSchedule.userPaymentDetailsId+'"><a href="javascript:void(0)" class="pay_now_btn btn btn-primary btn-sm py-0 px-1" onclick="getPaymentGatewaysOptions(\''+stuSchedule.schoolId+'\',\''+stuSchedule.schoolId+'\',\''+stuSchedule.userPaymentDetailsId+'\',\''+stuSchedule.entityType+'\',\''+stuSchedule.entityId+'\',\''+USER_ID+'\')">Pay Now</a></span>';
																	// }
																html+='</div>'
																+'<div class="full d-block"><strong class="float-left">Payment Status:</strong> <span class="d-inline-block" id="paymentStatus'+stuSchedule.userPaymentDetailsId+'">'+stuSchedule.status+'</span></div>'
																+'<div class="full d-block"><strong>Schedule Date:</strong> <span>'+stuSchedule.scheduleDate+'</span></div>';
																if(stuSchedule.payDate!=''){
																	html+='<div class="full d-block"><strong>Payment Date:</strong> <span>'+stuSchedule.payDate+'</span></div>';
																}else{
																	html+='<div class="full d-none" id="paymentDate'+stuSchedule.userPaymentDetailsId+'Wrapper"><strong>Payment Date:</strong> <span id="paymentDate'+stuSchedule.userPaymentDetailsId+'"></span></div>';	
																}
															+'</div>'
														+'</div>'
													+'</li>'
													//callcss=callcss+1;
												//}
												srNo=srNo+1;
											}
											html+='</ul>';
										}
										html+='</td>';
									}
									
								}
								if(isSubPartner == 'N'){
									html+='<td class="p-0  vertical-align-top">'
											+'<table class="w-100">'
											+'<tbody>'
												+'<tr>'
													+'<td class="border-0">'
														+'<table class="w-100">'
															+'<tbody>'
																+'<tr>'
																	+'<th class="border-0 p-1 font-weight-bold" style="width:80px">Commission:</th>'
																	+'<td class="border-0 p-1">'+stuList.commition+'</td>'
																+'</tr>'
																+'<tr>';
																	if(stuList.commissionPayType=='SWP'){
																		html +='<th class="border-0 p-1 font-weight-bold" style="width:80px">Transfer Status:</th>'
																		+'<td class="border-0 p-1">'+stuList.transMessage+'</td>';
																	}else{
																		html +='<th class="border-0 p-1 font-weight-bold" style="width:80px">Payout to IS: </th>'
																		+'<td class="border-0 p-1">'+stuList.totalPayoutToIs+'</td>';
																	}
																html+='</tr>'
																+'<tr>'
																	if(stuList.commissionPayType=='SWP'){
																		html +='<th class="border-0 p-1 font-weight-bold" style="width:80px">Transfer Date:</th>'
																		+'<td class="border-0 p-1">'+stuList.transDate+'</td>';
																	}else{
																		html +='<th class="border-0 p-1 font-weight-bold" style="width:80px">Pending Amount: </th>'
																		+'<td class="border-0 p-1">'+stuList.pendingAmount+'</td>';
																	}
																html+='</tr>';
																if(stuList.commissionPayType=='PWP'){
																	html+='<tr>'
																		+'<th class="border-0 p-1 font-weight-bold" style="width:80px">Status:</th>'
																		+'<td class="border-0 p-1">'+(stuList.pendingAmount == '$0.00' ? 'Success' : 'Pending')+ '</td>'
																	+'</tr>'
																	+'<tr>'
																		+'<th class="border-0 p-1 font-weight-bold" style="width:80px">Payment Date:</th>'
																		+'<td class="border-0 p-1">'+(stuList.lastPayDate != "N/A" ? changeDateFormat(new Date(stuList.lastPayDate), "MMM-dd-yyyy") : stuList.lastPayDate) +'</td>'
																	+'</tr>';
																}
																if((USER_ROLE=="DIRECTOR") && (stuList.counselorId!=USER_ID) && stuList.paymentDue=="All Paid"){
																	html+='<tr>'
																		+'<td colspan="2" class="border-0 p-1 text-center">'
																			+'<div class="dropdown d-inline-block">'
																			+'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">Update</button>'
																				+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-md dropdown-menu p-2" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 28px, 0px);">'
																				+'<a href="javascript:void(0)" onclick="'+onclickTransfer+'" class="dropdown-item">Amount Transferred</a>'
																				+'<a href="javascript:void(0)" onclick="'+onclickNone+'" class="dropdown-item">None</a>'
																				+'</div>'
																			+'</div>'
																		+'</td>'
																	+'</tr>';
																}
															html+='</tbody>'
														+'</table>'
													+'</td>'
												+'</tr>'
											+'</tbody>'
										+'</table>'
									+'</td>';
									}
								html+='<td>';
								let tickFlag = true;
									if(stuList.studentEnrollBy=='P' && stuList.admissionType == "Partial Entry"){
										html+='<a href="javascript:void(0);" onclick="enrollmentPartnerStudent('+stuList.stdUserId+')" data-toggle="tooltip" data-placement="top" data-original-title="Edit" class="text-primary">'
											+'<i class="fa fa fa-pencil" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i>'
										+'</a>';
										tickFlag = false;
									}
									if(stuList.studentEnrollBy=='P' && stuList.admissionType == "Enrolled" && !stuList.password){
										html+='<a id = "'+stuList.stdUserId+'_'+stuList.stuStandardId+'" href="javascript:void(0);" onclick="showWarningMessage(\'Are you sure you want to send credentials email to student?\',\'resendMailToPartnerStudent('+stuList.stdUserId+','+stuList.stuStandardId+')\');" data-toggle="tooltip" data-placement="top" data-original-title="' + (stuList.emailSendStatus == 0 ? 'Send Credentials' : 'Resend Credentials') + '" class="text-primary">'
											+'<i class="fa fa fa-envelope" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i>'
										+'</a>';
										tickFlag = false;
									}
									if(stuList.applicationStatus == 'Y' && stuList.paymentStatus != 'SUCCESS' && stuList.paymentType == 'One-time payment'){
										tickFlag = false;
										html+='<a id = "move_to_dashboard_'+stuList.stdUserId+'_'+stuList.stuStandardId+'" href="javascript:void(0);" onclick="showWarningMessage(\'Are you sure you want to approve payment witout sending mails?\',\'moveToStudentEnrollmentsDashboard('+stuList.stdUserId+','+stuList.userPaymentDetailsId+', \\\'N\\\')\');" data-toggle="tooltip" data-placement="top" data-original-title="Move to dashboard" class="text-primary">'
												+'<svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M5.66667 13C4.0881 13 2.74914 12.4808 1.64981 11.4423C0.550476 10.4038 0.000539683 9.13875 0 7.64706C0 6.28333 0.47573 5.09473 1.42719 4.08124C2.37865 3.06774 3.56919 2.48478 4.99881 2.33235L3.72381 1.07059L4.85714 0L8.09524 3.05882L4.85714 6.11765L3.72381 5.02794L4.91786 3.9C3.95992 4.07843 3.17063 4.51814 2.55 5.21912C1.92937 5.9201 1.61905 6.72941 1.61905 7.64706C1.61905 8.7049 2.01356 9.60675 2.80257 10.3526C3.59159 11.0984 4.54629 11.4711 5.66667 11.4706H8.09524V13H5.66667ZM9.71429 6.11765V0.764706H17V6.11765H9.71429ZM9.71429 13V7.64706H17V13H9.71429ZM11.3333 11.4706H15.381V9.17647H11.3333V11.4706Z" fill="#0380FF"/> </svg>'
											+'</a>'; 
									}
									if(tickFlag){
										html+='<i class="fa fa-check text-success"></i>'; 
									}
								html+='</div>'
						+'</tr>';
						sreno=sreno+1;
					}
				}else{
					html+='<tr><td colspan="6" class="text-center bold font-16">No Record found</td></tr>';
				}
			html+='</tbody>'
		+'</table>'
		// +'<div id="b2bPartnerEnrollmentPaginationContainer" class="text-center mt-4">';
	return html;
}

function B2BStudentListCommissionPopup(){
	var html='<div class="modal fade" id="updateTransferCommission">'
	+'<div class="modal-dialog modal-md" role="document">'
	+'<div class="modal-content">'
	+'<div class="modal-header p-2 bg-primary text-white">'
	+'<h5 class="m-0">Update Commission Status</h5>'
	+'</div>'
	+'<form action="javascript:void(0);" id="transferCommissionForm" name="transferCommissionForm" autocomplete="off">'
	+'<div class="modal-body" >'
	+'<div class="row">'
	+'<div class="col-6 mt-2 text-left">Amount Transferred on:</div>'
	+'<div class="col-6 mt-2 text-right"><span id="totalCommissionDate">Jul 04, 2024</span></div>'
	+'</div>'
	+'<div class="row">'
	+'<div class="col-6 mt-2 text-left">Total Amount Transferred</div>'
	+'<div class="col-6 mt-2 text-right">$ <span id="totalCommission">300.00</span></div>'
	+'</div>'
	+'<div class="full mt-1 studentCommitionList"></div>'
	+'</div>'
	+'<div class="modal-footer">'
	+'<div class="full mt-1">'
	+'<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="btnClickCommission">Update</button>'
	+'<button type="button" class="btn btn-primary  float-right pr-4 pl-4 mr-2" data-dismiss="modal">Close</button>'
	+'</div>'
	+'</div>'
	+'</form>'
	+'</div>'
	+'</div>'
	+'</div>';
	return html;
}

function B2BStudentListCommission(studentList){
	var html= 
		'<table class="table table-bordered font-12 border-radius-table" style="width:100%;font-size:11px !important" id="commissionList">'
			+'<thead>'
				+'<tr>'
					+'<th class="bg-primary text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important">S No.</th>'
					+'<th class="bg-primary text-white bold border-bottom-0">Name</th>'
					+'<th class="bg-primary text-white bold border-bottom-0">Fee Plan</th>'
					+'<th class="bg-primary text-white bold border-bottom-0">Commission</th>'
					+'<th class="bg-primary text-white bold rounded-top-right-10 border-bottom-0">Commission Status</th>'
				+'</tr>'
			+'</thead>'
			+'<tbody class="student-table-css">';
			
				if(studentList.length>0){
					var sreno=1;
					for (let s = 0; s < studentList.length; s++) {
						const stuList = studentList[s];
						if(stuList.transMessage=='Pending' || stuList.transMessage=='None'){
							if(stuList.paymentDue=="All Paid"){
								html+='<tr class="commission_list" id="'+stuList.stuStandardId+'" data-commission="'+stuList.commition+'" data-commission-rate="'+stuList.strCommRate+'">'
										+'<td class="text-center"><input type="checkbox" class="chkcommission" checked name="checkCommission" id="checkCommission'+stuList.stuStandardId+'" value="'+stuList.stuStandardId+'">&nbsp;&nbsp;&nbsp;&nbsp;'+sreno+'</td>'
										+'<td class=" vertical-align-top">'+stuList.studentName+'</td>'
										+'<td class=" vertical-align-top">'+stuList.paymentType+'</td>'
										+'<td class=" vertical-align-top">'+stuList.commition+'</td>'
										+'<td class=" vertical-align-top">'
										+'<select class="form-control-update" name="commissionStatus" id="commissionStatus'+stuList.stuStandardId+'">'
										+'<option value="Amount Transferred">Amount Transferred</option>'
										+'<option value="None">None</option>'
										+'</select>'
										+'</td>'
								html+='</tr>';
		
								sreno=sreno+1;
							}

						}
					}
					if(sreno==1){
						html+='<tr>'
								+'<td class="text-center rounded-bottom-left-10 rounded-bottom-right-10" colspan="5">No Pending Commission</td>'
						html+='</tr>';
					}
				}else{
					html+='<tr><td colspan="6" class="text-center bold font-16 rounded-bottom-left-10 rounded-bottom-right-10 ">No Record found</td></tr>';
				}
			html+='</tbody>'
		+'</table>';
		
	return html;
}


function renderReferralCodeAndLinks(title, roleAndModule, schoolId, userId, role){
	$("#dashboardContentInHTML").html(referralCodeAndLinksContent(title, roleAndModule, schoolId, userId, role));
}

function referralCodeAndLinksContent(title, roleAndModule, schoolId, userId, role){
	var data=getReferralCodeAndLinksDetails(userId);
	console.log('responseData '+JSON.stringify(data))
	var html = 
		'<div class="col">'
			+'<div class="row">'
				+'<div class="col-md-12">'
					+'<div class="card">'
						+'<div class="card-header card-header-primary">'
							+'<h4 class="card-title">Referral Code & Links</h4>'
						+'</div>'
						+'<div class="card-body p-4">'
							+'<div class="full">'
								+'<div class="col-xl-12">'
									+'<h2 class="card-title '+(data['schoolServiceLinks']==undefined?'text-center mt-4':"")+'">Welcome '+data.userFullName+'</h2>'
								+'</div>'
								+'<div class="d-flex flex-wrap mt-3">';
									if(data['schoolServiceLinks']!=undefined){
										html+=
										'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-3">' 
											+'<div class="p-3 h-100" style="background:#f4eaf7;border-radius:10px">'
												+'<h3 class="text-primary bold">Enrollment Partner Code</h3>'
												+'<p class="bold m-0 text-black-50 "><button value="'+data.schoolServiceLinks.referralCode+'" class="mr-1 btn btn-primary btn-sm" id="referralCode" onclick="copyURL(\'referralCode\',\'referral-code\')"><i class="fa fa-copy"></i></button><span class="referral_code">'+data.schoolServiceLinks.referralCode+'</span><b class="referral-code full"></b></p>'
											+'</div>'
										+'</div>'
										+'<div class="col-xl-9 col-lg-9 col-md-8 col-sm-12 col-12 mb-3 partnerStudentUrl">'
											+'<div class="p-3" style="background:#f4eaf7;border-radius:10px">'
												+'<h3 class="bold text-primary">Your Enrollment Links</h3>'
												+'<div class="row">'
													$.each(data.schoolServiceLinks.learningProgramLinks, function(k,learningProgram){
														html+=
														'<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">'
															+'<p class="bold m-0 text-black-50 font-12"><button value="'+learningProgram.link+'" id="'+learningProgram.learningProgramCode+'_id_'+k+'" class="mr-1 btn btn-primary btn-sm" onclick="copyEnrollmentLink(\''+learningProgram.learningProgramCode+'_id_'+k+'\',\''+learningProgram.learningProgramCode+'_class_'+k+'\')"><i class="fa fa-copy"></i></button>'+learningProgram.label+'<b class="'+learningProgram.learningProgramCode+'_class_'+k+' full">&nbsp;</b></p>'
														+'</div>';
													});
												html+=
												'</div>'
											+'</div>'
										+'</div>';
									}else{
										html+=
										'<div class="col-12 mb-3">' 
											+'<h3 class="bold text-primary text-center mt-0">Your referral code is not created yet.</h3>'
										+'</div>';
									}
									html+=
									'</div>'
								+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	
	return html;
}


function getOptionDiscountOptions(discountRates){
	var html='';
	$.each(discountRates, function(k,v){
		if(v.discountType=='P'){
			html+=`<option discountCode="`+v.discountCode+`" discountType="`+v.discountType+`" value="`+v.discountValue+`">`+v.discountValue+`% Discount</option>`;
		}else if(v.discountType=='F'){
			html+=`<option discountCode="`+v.discountCode+`" discountType="`+v.discountType+`" value="`+v.discountValue+`">USD `+v.discountValue+` Discount</option>`;
		}
		
	})
	return html;
}

function copyEnrollmentLink(eleID, msgEle){
	var message='Copied!';
	var discount = $('#discountForEnrollmentPartner').val();
	if(discount>0){
		var originalUrl=$('#'+eleID).attr('value');
		var splitText='payload=';
		var params=originalUrl.split(splitText);
		if(params.length>1){
			var prefixUrl=originalUrl.split(splitText)[0];
			var suffixUrl=originalUrl.split(splitText)[1];
			var payload=JSON.parse(decode(suffixUrl))
			payload['discountType']=$('#discountMsgTag').attr('data-discount-type');
			payload['discountValue']=$('#discountMsgTag').attr('data-discount-value');
			payload['discountCode']=$('#discountMsgTag').attr('data-discount-code');
			var finalUrl=prefixUrl+splitText+window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
			$('#'+eleID).attr('value',finalUrl);
		}
		//message='Student will get '+discount+'% disount on enrollment';
	}
	return copyURL(eleID,msgEle,message);
}


function revenueThumbListContentSkeleton(){
	var html=
		`<div class="col-12">
			<div class="d-flex row">
				<div class="flex-grow-1 mr-2 mb-2 skeleton rounded-10">
					<div class="p-2 full invisible">
						<p class="m-0 font-12"><b>Total Revenue</b></p>
						<div class="m-0">
							<span><b>$1,60,000</b></span>
						</div>
					</div>
				</div>
				<div class="flex-grow-1 mr-2 mb-2 skeleton rounded-10">
					<div class="p-2 full invisible">
						<div class="d-flex">
							<div class="mr-1">
								<p class="m-0 font-12"><b>Your Earnings</b></p>
							</div>
							<div class="mr-1">
								<p class="m-0 font-12"><b>Your Earnings</b></p>
							</div>
							<div>
								<p class="m-0 font-12"><b>Your Earnings</b></p>
							</div>
						</div>
						<div class="m-0">
							<span><b>Monthly Revenue&nbsp;</b><b>$1,60,000</b></span>
						</div>
					</div>
				</div>
				<div class="flex-grow-1 mr-2 mb-2 skeleton rounded-10">
					<div class="p-2 full invisible">
						<p class="m-0 font-12"><b>Your Earnings</b></p>
						<div class="m-0">
							<span><b>$1,60,000</b></span>
						</div>
					</div>
				</div>
				<div class="flex-grow-1 mr-2 mb-2 skeleton rounded-10">
					<div class="p-2 full invisible">
						<p class="m-0 font-12"><b>Total Payout to IS</b></p>
						<div class="m-0">
							<span><b>$1,60,000</b></span>
						</div>
					</div>
				</div>
				<div class="flex-grow-1 mr-2 mb-2 skeleton rounded-10">
					<div class="p-2 full invisible">
						<p class="m-0 font-12"><b>Pending</b></p>
						<div class="m-0">
							<span><b>$1,60,000</b></span>
						</div>
					</div>
				</div>
				<div class="flex-grow-1 mr-2 mb-2 skeleton rounded-10">
					<div class="p-2 full invisible">
						<p class="m-0 font-12"><b>Paid</b></p>
						<div class="m-0">
							<span><b>$1,60,000</b></span>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}
function revenueThumbListContent(){
	var html=
		`<div class="col-12">
			<div class="d-flex row">
				<div class="p-2 bg-light-alternate border border-alternate rounded-10 position-relative mr-2 mb-2 shadow-sm text-alternate flex-grow-1" style="width:fit-content">
					<span class="line-left bg-alternate d-inline-block position-absolute rounded-10"></span>
					<p class="m-0 font-12"><b>Total Revenue</b></p>
					<div class="m-0">
						<span><b>$1,60,000</b></span>
					</div>
				</div>
				<div class="p-2 bg-light-orange border border-orange rounded-10 position-relative mr-2 mb-2 shadow-sm text-orange flex-grow-1" style="width:fit-content">
					<span class="line-left bg-orange d-inline-block position-absolute rounded-10"></span>
					<div class="d-flex">
						<div class="mr-1">
							<select class="form-control form-control py-0 px-1" style="height:22px;font-size:12px" id="revenueType" onchange="changeRevenueType(\'revenueType\')">
								<option value="" data-value-Type="custom">Custom</option>
								<option value="" data-value-Type="date" selected>Mar 25</option>
								<option value="" data-value-Type="date">Apr 25</option>
							</select>
						</div>
						<div class="mr-1 date-range" style="display:none">
							<input type="text" id="startDate" name="startDate" class="form-control datepikcer form-control py-0 px-1" placeholder="Date From" style="height:22px;font-size:12px;max-width:85px" readonly/>
						</div>
						<div class="date-range" style="display:none">
							<input type="text" id="endDate" name="endDate" class="form-control datepikcer form-control py-0 px-1" placeholder="Date To" style="height:22px;font-size:12px;max-width:85px" readonly disabled/>
						</div>
					</div>
					<div class="m-0">
						<span><b>Monthly Revenue&nbsp;</b><b>$1,60,000</b></span>
					</div>
				</div>
				<div class="p-2 bg-light-pink border border-pink rounded-10 position-relative mr-2 mb-2 shadow-sm text-pink flex-grow-1" style="width:fit-content">
					<span class="line-left bg-pink d-inline-block position-absolute rounded-10"></span>
					<p class="m-0 font-12"><b>Your Earnings</b></p>
					<div class="m-0">
						<span><b>$1,60,000</b></span>
					</div>
				</div>
				<div class="p-2 bg-light-primary border border-primary rounded-10 position-relative mr-2 mb-2 shadow-sm text-primary flex-grow-1" style="width:fit-content">
					<span class="line-left bg-primary d-inline-block position-absolute rounded-10"></span>
					<p class="m-0 font-12"><b>Total Payout to IS</b></p>
					<div class="m-0">
						<span><b>$1,60,000</b></span>
					</div>
				</div>
				<div class="p-2 bg-light-warning border border-warning rounded-10 position-relative mr-2 mb-2 shadow-sm text-warning flex-grow-1" style="width:fit-content">
					<span class="line-left bg-warning d-inline-block position-absolute rounded-10"></span>
					<p class="m-0 font-12"><b>Pending</b></p>
					<div class="m-0">
						<span><b>$1,60,000</b></span>
					</div>
				</div>
				<div class="p-2 bg-light-success border border-success rounded-10 position-relative mr-2 mb-2 shadow-sm text-success flex-grow-1" style="width:fit-content">
					<span class="line-left bg-success d-inline-block position-absolute rounded-10"></span>
					<p class="m-0 font-12"><b>Paid</b></p>
					<div class="m-0">
						<span><b>$1,60,000</b></span>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}

function b2bBankDetailsModal(){
	var html=
		`<div class="modal fade" id="b2bBankDetailsModal" tabindex="-1" role="dialog" aria-labelledby="b2bBankDetailsModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg modal-dialog-centered" role="document" style="box-shadow: 0 0;">
				<div class="modal-content shadow-lg border-0 rounded">
					<div class="modal-header bg-primary text-white">
						<h5 class="modal-title bg-primary text-white" id="b2bBankDetailsModalLabel">
							<i class="fa fa-university mr-2"></i> Bank Details
						</h5>
						<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
				
					<div class="modal-body">
						<form id="b2bBankDetailsForm">
							<div class="form-row">
								<div class="form-group col-md-6">
									<label for="bicName">BIC Name</label>
									<input type="text" class="form-control" id="bicName">
								</div>
								<div class="form-group col-md-6">
									<label for="bankAddress">Bank Address</label>
									<input type="text" class="form-control" id="bankAddress">
								</div>
							</div>

							<div class="form-row">
								<div class="form-group col-md-6">
									<label for="swiftCode">Swift Code</label>
									<input type="text" class="form-control" id="swiftCode">
								</div>
								<div class="form-group col-md-6">
									<label for="bankCode">Bank Code</label>
									<input type="text" class="form-control" id="bankCode">
								</div>
							</div>

							<div class="form-row">
								<div class="form-group col-md-6">
									<label for="branchCode">Branch Code</label>
									<input type="text" class="form-control" id="branchCode">
								</div>
								<div class="form-group col-md-6">
									<label for="accountName">Account Holder Name</label>
									<input type="text" class="form-control" id="accountName">
								</div>
							</div>

							<div class="form-group">
								<label for="accountNumber">Account Number</label>
								<input type="text" class="form-control" id="accountNumber" onkeydown="return M.digit(event);">
							</div>
						</form>
					</div>
				
					<div class="modal-footer">
						<button type="button" class="btn btn-light border" data-dismiss="modal">Add Later</button>
						<button type="button" class="btn btn-primary" onclick="saveB2bBankDetails('fromModal');">Save</button>
					</div>
				</div>
			</div>
		</div>`
	return html;
}