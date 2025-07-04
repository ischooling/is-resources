
var LEAD_CATEGORY="B2C";
async function renderCounselorDashboard(title, roleAndModule, schoolId, userId, role){
	customLoader(true);
	var commissionRate = await getCounselorCommissionRate('','counselorCommitionRate',userId);
    var html=dashboardCounselorContent(title, roleAndModule, schoolId, userId, role, commissionRate);
    $('#dashboardContentInHTML').html(html);
	generateTinyUrls();
	if(USER_ROLE=='B2B_LEAD'){
		callB2BDashboardLead(moduleId,'B2B');
		LEAD_CATEGORY="B2B";
	}else{
		//callB2CDashboardLead(moduleId,'B2C');
		//LEAD_CATEGORY="B2C";
		$('#counselor-demo-meeting-list').DataTable(); 
		$('#followup-leads-list').DataTable(); 
	
		var data = getCounselorDashboardDetailsData(userId);
		//if(data.length>0){
			$("#chartContentDiv").html(counselorDashboardLPContent(data));
		//}
	
		var revenue=0.0;
		var revenue_d=0.0;
		var revenue_id=0.0;
		var revenue_pending=0.0;
		var revenue_pending_d=0.0;
		var revenue_pending_id=0.0;

		var c_revenue=0.0;
		var c_revenue_d=0.0;
		var c_revenue_id=0.0;
		var c_revenue_pending=0.0;
		var c_revenue_pending_d=0.0;
		var c_revenue_pending_id=0.0;

		var schoolDicountSymbol="";
		var partnerDicountSymbol="";
		var schoolPartnerDicountSymbol="";
	
		//if(data.length>0){
			$.each(data.schoolLPDetails.learningProgramDetails, function(k,learningProgram){
				//console.log(learningProgram);
				schoolDicountSymbol=learningProgram.schoolDicountSymbol;
				partnerDicountSymbol=learningProgram.partnerDicountSymbol;
				schoolPartnerDicountSymbol=learningProgram.schoolPartnerDicountSymbol;
				revenue_d += parseFloat(learningProgram.revenue_d)
				revenue_id += parseFloat(learningProgram.revenue_id)
				revenue_pending_d += parseFloat(learningProgram.revenue_pending_d)
				revenue_pending_id += parseFloat(learningProgram.revenue_pending_id)

				c_revenue_d += parseFloat(learningProgram.c_revenue_d)
				c_revenue_id += parseFloat(learningProgram.c_revenue_id)
				c_revenue_pending_d += parseFloat(learningProgram.c_revenue_pending_d)
				c_revenue_pending_id += parseFloat(learningProgram.c_revenue_pending_id)
			//if(learningProgram.learningProgramCode=='SCHOLARSHIP'){
				getCounselorStudentGrade('',learningProgram.learningProgramCode+'_id_chart_'+k,userId,learningProgram.learningProgramCode,learningProgram.enrollmentFor);
			//}
				
			});
		//}
		partnerDicountSymbol='$';//partnerDicountSymbol=='Flat'?partnerDicountSymbol:'$';
		schoolDicountSymbol='$';//schoolDicountSymbol=='Flat'?schoolDicountSymbol:'$';
		schoolPartnerDicountSymbol='$';
		revenue=revenue_d+revenue_id;
		revenue_pending=revenue_pending_d+revenue_pending_id;

		c_revenue=c_revenue_d+c_revenue_id;
		c_revenue_pending=c_revenue_pending_d+c_revenue_pending_id;
		revenue=revenue+c_revenue;
		revenue_pending=revenue_pending+c_revenue_pending;

		//revenue_d=revenue_d+c_revenue_d;
		revenue_id=revenue_id+c_revenue;
		revenue_pending_id=revenue_pending_id+c_revenue_pending;


		var dirPercent_p=revenue_pending==0.0?0.0:(revenue_pending_d/revenue_pending)*100;
		var thIsPercent_p=revenue_pending==0.0?0.0:(revenue_pending_id/revenue_pending)*100;
		//revenue_d=revenue_d-revenue_pending_d;
		//revenue_id=revenue_id-revenue_pending_id;
		//revenue=revenue-revenue_pending;

		var dirPercent=revenue==0.0?0.0:(revenue_d/revenue)*100;
		var thIsPercent=revenue==0.0?0.0:(revenue_id/revenue)*100;
		// if(partnerDicountSymbol=='Flat'){
		// 	$("#c_totalRevenueValue").html(parseFloat(revenue).toFixed(2)+' Flat');
		// 	$("#c_directEnrollment").html(parseFloat(revenue_d).toFixed(2)+' Flat');
		// 	$("#c_throughIs").html(parseFloat(revenue_id).toFixed(2)+' Flat');
		// 	$("#c_pendingCommission").html(parseFloat(revenue_pending).toFixed(2)+' Flat');
		// }else{
			$("#c_totalRevenueValue").html('$ '+parseFloat(revenue).toFixed(2));
			$("#c_directEnrollment").html('$ '+parseFloat(revenue_d).toFixed(2));
			$("#c_throughIs").html('$ '+parseFloat(c_revenue).toFixed(2));
			//$("#c_pendingCommission").html('$ '+parseFloat(revenue_pending).toFixed(2));
		//}
		$("#c_dirPercent").html(parseInt(dirPercent.toFixed())+'%');
		$("#c_thIsPercent").html(parseInt(thIsPercent.toFixed())+'%');

		$("#c_dirPercent_partner").html('$'+parseInt(c_revenue_d));
		$("#c_thIsPercent_partner").html('$'+parseInt(c_revenue_id));

		// $("#c_dirPercent_p").html('$'+parseInt(revenue_pending_d));
		// $("#c_thIsPercent_p").html('$'+parseInt(revenue_pending_id));
		
		
		var chartIndexVal1= $("#c_commissionRatesTab_0").attr("data-tab-value");
		var valueMin1=$("#c_commissionRatesTab_0").attr("data-school-value");
		var valueMax1=$("#c_commissionRatesTab_0").attr("data-partner-value");
		
		getCounselorCommissionRatesChart('c_chart0',''+chartIndexVal1+'', valueMin1, valueMax1);
		getCounselorPartnerCommissionRatesChart('c_chart_school0',''+chartIndexVal1+'', valueMin1, valueMax1);
		
		$('a[data-tab="counselor"]').on('shown.bs.tab', function (e) {
			var chartIndex = $(e.target).attr("data-tab-index");
			var chartIndexVal = $(e.target).attr("data-tab-value");
			valueMin1=$(e.target).attr("data-school-value");
			valueMax1=$(e.target).attr("data-partner-value");
			
			getCounselorCommissionRatesChart('c_chart'+chartIndex,''+chartIndexVal+'', valueMin1, valueMax1);
		});

		$('a[data-tab="counselor-partner"]').on('shown.bs.tab', function (e) {
			var chartIndex = $(e.target).attr("data-tab-index");
			var chartIndexVal = $(e.target).attr("data-tab-value");
			valueMin1=$(e.target).attr("data-school-value");
			valueMax1=$(e.target).attr("data-partner-value");
			console.log(chartIndex)
			getCounselorPartnerCommissionRatesChart('c_chart_school'+chartIndex,''+chartIndexVal+'', valueMin1, valueMax1);
		});
	}
}
{/* <div class="page-title-subheading">${title}</div> */}
function dashboardCounselorContent(title, roleAndModule, schoolId, userId, role, commissionRate){
	var html = '';
	if(USER_ROLE=='B2B_LEAD'){
		html+=`<div class="app-page-title">
				<div class="page-title-wrapper">
					<div class="page-title-heading">
						<div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>
						<div>
							<span class="text-primary welcome-name-text">Welcome ${USER_FULL_NAME}</span>
							
						</div>
					</div>
				</div>
			</div>`;
		html+=getCounselorB2BContent1();
	}else{
		var data=getCounselorDetails(userId);
		localStorage.setItem('convertYear',data.counselor.convertYear);
		localStorage.setItem('referralCode',data.schoolServiceLinks.referralCode);
		html += 
			`<div class="app-page-title">
				<div class="page-title-wrapper">
					<div class="page-title-heading">
						<div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>
						<div>
							<span class="text-primary welcome-name-text">Welcome ${data.userFullName}</span>
						</div>
					</div>
				</div>
			</div>
	
			<div class="main-card mb-3">
				<div class="mb-3 card border rounded-10">
					<div class="card-body">`
						+getAccountManagerDetailsContent(data)
					html+=
					`</div>
				</div>
				<div class="row">`
					+getCounselorChartContent(commissionRate.commissionRates)
					+getCounselorPartnerChartContent(commissionRate.commissionRates)
					+getCounselorEnrollmentLinksContent(data)
				html+=`</div>`
				+getCounselorRevenueContent()
				+getCounselorEnrollmentStatisticsContent()
			html+=`</div>`;
	}
	
	return html;
								
	// if(USER_ROLE=='B2B_LEAD'){
	// 	html+=getCounselorB2BContent1();
	// }else{
	// 	html+=getCounselorB2CContent1();
	// 	html+=getCounselorB2CContent2();
	// 	//html+=getCounselorMeetingB2CContent3();
	// }
	// return html;
}

function counselorDashboardLPContent(data){
	var html =
		'<div class="col-12">'
			+'<div class="row">';
			$.each(data.schoolLPDetails.learningProgramDetails, function(k,learningProgram){
				//var revenue= parseFloat(learningProgram.revenue_d)+parseFloat(learningProgram.revenue_id);
				var revenue= parseFloat(learningProgram.revenue_d)+parseFloat(learningProgram.revenue_id);
				var revenue_pending=parseFloat(learningProgram.revenue_pending_d)+parseFloat(learningProgram.revenue_pending_id);
				//revenue=revenue-revenue_pending;
				html+=
				'<div class="col-4 mb-3">'
					+'<div class="main-card mb-3 card">'
						+'<div class="card-body">'
						+'<h5 class="card-title"> '+learningProgram.label+' <span class="pull-right text-primary">Revenue: $'+revenue+'</span></h5>'
							+'<div id="'+learningProgram.learningProgramCode+'_id_chart_'+k+'"></div>'
						+'</div>  '
					+'</div>' 
				+'</div>';
			});
			html+=
			'</div>'
		+'</div>'
	return html;
}


function getCounselorEnrollmentRangeContent(commissionRate){
	var html=
		`<div class="d-flex flex-wrap align-items-center mb-1">
			<span class="font-weight-semi-bold">Enrollment Range:</span>
			<ul class="flex-grow-1 p-0 ml-2 body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">`;
			if(commissionRate.length>0){
				$.each(commissionRate, function(i, v){
					var minmaxrange= v.min_range+'-'+v.max_range;
					if(v.max_range==0){
						minmaxrange= v.min_range+'+';
					}
					html+=
					`<li class="nav-item">
						<a href="#c_commissionRatesTabContent_`+i+`" id="c_commissionRatesTab_`+i+`" data-tab-index="${i}"  data-tab-value="${minmaxrange}" data-school-value="${v.bySchoolValue}" data-partner-value="${v.byPartnerValue}"  class="px-2 py-1 nav-link ${i==0?'active':''}" role="tab" data-toggle="tab" data-tab="counselor" aria-selected="false">
							<span>${minmaxrange}</span>
						</a>
					</li>`;
				})
			}else{
				html+=
					`<li class="nav-item">
					<b>N/A</b>
					</li>`;
			}
				
			html+=`</ul>
		</div>`;
	return html;
}

function getCounselorChartContent(commissionRate){
	var html=
		`<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mb-2">
			<h5 class="font-weight-semi-bold text-dark">Your Commission Rates</h5>
			<div class="w-100 mb-3 card border rounded-10" style="height:calc(100% - 32px)">
				<div class="card-body">`
					+getCounselorEnrollmentRangeContent(commissionRate)
					html+=
					`<div class="tab-content">`;
						$.each(commissionRate, function(i,v){
							var symbol=v.bySchoolType=='%'?'':'$';
							html+=
							`<div class="tab-pane tabs-animation fade ${i==0?'show active':''}" id="c_commissionRatesTabContent_`+i+`" role="tabpanel">
								<div class="d-flex flex-wrap">
									<div class="d-inline-flex flex-column flex-grow-1">
										<div class="mb-3">
											<span class="h-100 bg-primary rounded float-left mr-2" style="width:4px"></span>
											<h5 class="font-weight-light m-0">${symbol} ${v.byPartnerValue} ${v.byPartnerType}</h5>
											<p class="font-12 m-0">Commission By School</p>
										</div>
										
									</div>
									<div class="mx-auto overflow-hidden" style="position: relative; max-width:200px;max-height:101px;">
										<div id="c_chart`+i+`" style="visibility:hidden;opacity:0"></div>
										<i class="fa fa-users position-absolute" style="font-size:20px; top: 50%;left: 50%;width: 30px;height: 30px;transform: translate(-50%, -50%);z-index: 10;"></i>
									</div>
								</div>
							</div>`;
						});
					html+=`</div>
				</div>
			</div>    
		</div>`;
	return html;
}

function getCounselorPartnerEnrollmentRangeContent(commissionRate){
	var html=
		`<div class="d-flex flex-wrap align-items-center mb-1">
			<span class="font-weight-semi-bold">Enrollment Range:</span>
			<ul class="flex-grow-1 p-0 ml-2 body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">`;
			if(commissionRate.length>0){
				$.each(commissionRate, function(i, v){
					var minmaxrange= v.min_range+'-'+v.max_range;
					if(v.max_range==0){
						minmaxrange= v.min_range+'+';
					}
					html+=
					`<li class="nav-item">
						<a href="#c_school_commissionRatesTabContent_`+i+`" id="c_school_commissionRatesTab_`+i+`" data-tab-index="${i}"  data-tab-value="${minmaxrange}" data-school-value="${v.bySchoolValue}" data-partner-value="${v.byPartnerValue}"  class="px-2 py-1 nav-link ${i==0?'active':''}" role="tab" data-toggle="tab" data-tab="counselor-partner" aria-selected="false">
							<span>${minmaxrange}</span>
						</a>
					</li>`;
				})
			}else{
				html+=
					`<li class="nav-item">
					<b>N/A</b>
					</li>`;
			}
				
			html+=`</ul>
		</div>`;
	return html;
}

function getCounselorPartnerChartContent(commissionRate){
	var html=
		`<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mb-2">
			<h5 class="font-weight-semi-bold text-dark">Your Commission Rates By Partner</h5>
			<div class="w-100 mb-3 card border rounded-10" style="height:calc(100% - 32px)">
				<div class="card-body">`
					+getCounselorPartnerEnrollmentRangeContent(commissionRate)
					html+=
					`<div class="tab-content">`;
						$.each(commissionRate, function(i,v){
							var symbol=v.bySchoolType=='%'?'':'$';
							html+=
							`<div class="tab-pane tabs-animation fade ${i==0?'show active':''}" id="c_school_commissionRatesTabContent_`+i+`" role="tabpanel">
								<div class="d-flex flex-wrap">
									<div class="d-inline-flex flex-column flex-grow-1">
										<div class="mb-3">
											<span class="h-100 bg-primary rounded float-left mr-2" style="width:4px"></span>
											<h5 class="font-weight-light m-0">${symbol} ${v.bySchoolValue} ${v.bySchoolType}</h5>
											<p class="font-12 m-0">Commission By Partner(Through IS)</p>
										</div>
										<div>
											<span class="h-100 bg-alternate  rounded float-left mr-2" style="width:4px"></span>
											<h5 class="font-weight-light m-0">${symbol} ${v.bySchoolPartnerValue} ${v.bySchoolPartnerType}</h5>
											<p class="font-12 m-0">Commission By Partner(Direct enrollment)</p>
										</div>
									</div>
									<div class="mx-auto overflow-hidden" style="position: relative; max-width:200px;max-height:101px;">
										<div id="c_chart_school`+i+`" style="visibility:hidden;opacity:0"></div>
										<i class="fa fa-users position-absolute" style="font-size:20px; top: 50%;left: 50%;width: 30px;height: 30px;transform: translate(-50%, -50%);z-index: 10;"></i>
									</div>
								</div>
							</div>`;
						});
					html+=`</div>
				</div>
			</div>    
		</div>`;
	return html;
}

function getCounselorEnrollmentLinksContent(data){
	var html=
		`<div class="col-xl-12 col-lg-12 col-md-6 col-sm-12 col-12 mb-2">
			<h5 class="font-weight-semi-bold text-dark mt-3">Enrollments & Seats Reservation Links</h5>
			<div class="w-100 mb-3 card border rounded-10" style="height:calc(100% - 32px)">
				<div class="card-body">
					<div class="d-flex mb-3 rounded-pill bg-light border overflow-hidden" style="width: fit-content; position: relative; z-index: 10;">
						<button type="button" class="btn btn-sm px-3 py-1 rounded-pill text-white bg-primary border-0" id="enrollmentTabBtn" onclick="toggleLinkTab('enrollment')">Your Enrollment Links</button>
						<button type="button" class="btn btn-sm px-3 py-1 rounded-pill text-dark bg-transparent border-0" id="seatTabBtn" onclick="toggleLinkTab('seat')">Seat Reservation Links</button>
					</div>
					<div id="enrollmentLinksSection" class="d-flex flex-wrap" style="gap:5px;">`;
						$.each(data.schoolServiceLinks.learningProgramLinks, function(k,learningProgram){
							html+=
							`<div>
								<a href="javascript:void(0)" class="bg-light-primary text-primary border border-light-primary rounded font-weight-semi-bold p-1 px-2 d-inline-flex align-items-center mt-1 text-decoration-none" onclick="copyURL('${learningProgram.learningProgramCode}_id_${k}','${learningProgram.learningProgramCode}_class_${k}')">${learningProgram.label} <i class="fa fa-copy float-right ml-3"></i></a>    
								<b class="${learningProgram.learningProgramCode}_class_${k} mx-1"></b>
								<div style="top:18px;left:0;position:absolute;">
									<input class="tinyUrl" type="text" id="${learningProgram.learningProgramCode}_id_${k}" value="${learningProgram.link}" style="opacity:0;height:0px">
								</div>
							</div>`;
						});
					html+=`</div>
					<div id="seatLinksSection" class="d-none flex-wrap" style="gap:5px;">`;
						$.each(data.schoolServiceLinks.learningProgramRasLinks, function(k,learningProgram){
							const excludedLabels = [
								"Flexy Program",
								"English Learning Program - One to One",
								"English Learning Program - Self Study"
							];
							if (excludedLabels.includes(learningProgram.label)) return;
							html+=
							`<div>
								<a href="javascript:void(0)" class="bg-seat-light-primary text-seat-primary border border-light-primary rounded font-weight-semi-bold p-1 px-2 d-inline-flex align-items-center mt-1 text-decoration-none" onclick="copyURL('${learningProgram.learningProgramCode}_id_${k+"_seat"}','${learningProgram.learningProgramCode}_class_${k+"_seat"}')">${learningProgram.label} <i class="fa fa-copy float-right ml-3"></i></a>    
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

function getCounselorRevenueContent(){
	var html=
	`<div class="row mt-3">
		<div class="col-12">
			<h5 class="font-weight-semi-bold text-dark">Revenue Details</h5>
		</div>
		<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-3"> 
			<div class="bg-light-success border border-success px-2 p-1 rounded-10 h-100 d-flex align-items-center flex-column">
				<div class="d-flex flex-wrap mb-1 w-100">
					<h5 class="font-weight-semi-bold text-dark flex-grow-1 m-0 font-size-lg">Total Revenue: </h5>
					<h5 class="font-weight-semi-bold text-dark m-0 font-size-lg" id="c_totalRevenueValue">$00.00</h5>
				</div>
				<div class="p-1 px-2 text-right rounded ml-auto" style="background:rgba(255, 255, 255, 0.6)">
					<span class="text-alternate">Direct Enrollment: <label class="m-0" id="c_dirPercent">0%</label>&nbsp;|&nbsp;</span>
					<span class="text-primary">Through Partner: <label class="m-0" id="c_thIsPercent">0%</label></span>
				</div>
			</div>
		</div>
		<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-3"> 
			<div class="bg-light-alternate border border-alternate px-2 p-1 rounded-10 h-100 d-flex align-items-center">
				<div class="d-flex flex-wrap mb-1 w-100">
					<h5 class="font-weight-semi-bold text-dark flex-grow-1 m-0 font-size-lg">Direct Enrollment: </h5>
					<h5 class="font-weight-semi-bold text-dark m-0 font-size-lg" id="c_directEnrollment">$00.00</h5>
				</div>
			</div>
		</div>
		<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-3"> 
			<div class="bg-light-primary border border-primary px-2 p-1 rounded-10 h-100 d-flex align-items-center flex-column">
				<div class="d-flex flex-wrap mb-1 w-100">
					<h5 class="font-weight-semi-bold text-dark flex-grow-1 m-0 font-size-lg">Through Partner: </h5>
					<h5 class="font-weight-semi-bold text-dark m-0 font-size-lg" id="c_throughIs">$00.00</h5>
				</div>
				<div class="p-1 px-2 text-right rounded ml-auto" style="background:rgba(255, 255, 255, 0.6)">
					<span class="text-alternate">Direct Enrollment: <label class="m-0" id="c_dirPercent_partner">0%</label>&nbsp;|&nbsp;</span>
					<span class="text-primary">Through IS: <label class="m-0" id="c_thIsPercent_partner">0%</label></span>
				</div>
			</div>
		</div>
		<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-3"> 
			<div class="bg-light-orange border border-orange px-2 p-1 rounded-10 h-100 d-flex align-items-center flex-column">
				<div class="d-flex flex-wrap mb-1 w-100">
					<h5 class="font-weight-semi-bold text-dark flex-grow-1 m-0 font-size-lg">Pending Commission: </h5>
					<h5 class="font-weight-semi-bold text-dark m-0 font-size-lg" id="c_pendingCommission">$00.00</h5>
				</div>
				<div class="p-1 px-2 text-right rounded ml-auto" style="background:rgba(255, 255, 255, 0.6)">
					<span class="text-alternate">Direct Enrollment: <label class="m-0" id="c_dirPercent_p">0%</label>&nbsp;|&nbsp;</span>
					<span class="text-primary">Through Partner: <label class="m-0" id="c_thIsPercent_p">0%</label></span>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function getCounselorEnrollmentStatisticsContent(){
	var html=
	`<div class="row mt-3">
		<div class="col-12">
			<h5 class="font-weight-semi-bold text-dark">Enrollment Statistics</h5>
		</div>
		<div class="col-12">
			<div class="card">
				<div class="card-body px-1">
					<div id="chartContentDiv"></div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

async function dashboardCounselorFooterContent(){
	var schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
	var html=
	'<div class="app-wrapper-footer">'
		+'<div class="app-footer">'
			+'<div class="app-footer__inner">'
				+'<div class="col">'
					+'<p style="margin: 0">'+schoolSettingsTechnical.copyrightYear+' © '+schoolSettingsTechnical.copyrightUrl+'</p>'
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
	'<div id="commonloaderIdNewLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">';
		// +'<div class="loader primary-border-top-color">'
		if(SCHOOL_ID==1){
			// html+=
			// '<div class="full">'
			// 	+'<img src="'+PATH_FOLDER_IMAGE2+'is_loader.gif" alt="${SCHOOL_NAME} Loader"/>'
			// +'</div>';
			html+=`<img src="`+PATH_FOLDER_IMAGE2+`loader-new.gif" alt="`+SCHOOL_NAME+` Loader" class="new-loader-2024"/>`;
		}else{
			html+=
			'<div class="ball-rotate">'
				+'<div style="background-color: rgb(247, 185, 36);"></div>'
			+'</div>'
			+'<p>Loading ...</p>';
		}
		html+=
		// '</div>'
	+'</div>';
	return html;
}

///////Enrolled Page 
function renderCounselorEnrollList(title, roleAndModule, schoolId, userId, role){
	if(role=='STUDENT_COUNSELOR'){
		$("#dashboardContentInHTML").html(counselorListContent(title, localStorage.getItem('referralCode')));
	}else{
		var html =
		'<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">'
			+dashboardHeaderContent()
			+'<div class="app-main  pb-4">'
				+'<div class="col p-0">'
					+'<div class="app-main__inner pt-2">'
						+counselorListContent(title, '')
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
		+dashboardCounselorFooterContent()
		$('body').html(html);
	}
	
	getSessionMasterList('counselorEnrollFilterForm', "academicYear", false);
	callCounselorCountries('counselorEnrollFilterForm', 0, 'countryId');
	callPartnerListBy('counselorEnrollFilterForm','partnerName');


	$("select#countryId").on("change",function(){
		callStates('counselorEnrollFilterForm', this.value, 'countryId');
	});
		
	$("select#stateId").on("change",function(){
		 callCities('counselorEnrollFilterForm', this.value, 'stateId');
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

	callStudentListByCounselor('counselorEnrollFilterForm','');
	$("#searchEnrolled").on('click',function(){
		callStudentListByCounselor('counselorEnrollFilterForm');
	});

	$("#bulkCommission").on('click',function(){
		//callStudentListByPartner('counselorEnrollFilterForm');
		$("#updateTransferCommission").modal('show');
		var totalCommiton  = getCallTotalCommission();
		$("#totalCommission").text(totalCommiton.toFixed(2));

		$("input[name=checkCommission]").on('change', function(){
			var totalCommiton  = getCallTotalCommission();
			$("#totalCommission").text(totalCommiton.toFixed(2));
		});
	});
	
	$("#btnClickCommission").on('click',function(){
		updateStudentCounselorCommissionRate('', '', '', '','');
	});
	
}

function counselorListContent(title, referralCode){
	var hmlt=pageTitleEnrolledCounselorContent(title)
	hmlt+=mainCounselorCardEnrolled(referralCode)
	return hmlt;
}

function pageTitleEnrolledCounselorContent(title){
	var html = 
		'<div class="app-page-title">'
			+'<div class="page-title-wrapper">'
				+'<div class="page-title-heading">'
					+'<div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>'
					+'<h4>'+title+'</h4>'
				+'</div>'
			+'</div>'
		+'</div>'
	return html;
}

function mainCounselorCardEnrolled(referralCode){
	var html= 
	'<div class="main-card mb-3 card">'
		+'<div class="card-body">'
			//+B2BStudentListfilterFormSkeleton()
			+B2CStudentListfilterForm(referralCode)
			+B2CStudentListDetailsSkeleton()
			+'<div class="table-responsive col-12" id="enrolled-list">'
				//+B2BStudentListDetails()
			+'</div>'
		+'</div>'
	+'</div>'
	+B2CStudentListCommissionPopup();
	return html;
}

function B2BStudentListfilterFormSkeleton(){
	var html=
		'<div class="col-12 mb-2" >'
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

function B2CStudentListfilterForm(referralCode){
	var html=
	'<form id="counselorEnrollFilterForm">'
		+'<div class="col-12 mb-2">'
			+'<div class="row">';
			if(referralCode==''){
				html+='<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Select Partner</label>'
					+'<select class="form-control" name="partnerName" id="partnerName" >'
					+'</select>'
				+'</div>';
			}

			html+='<input type="hidden" class="form-control" name="referralCode" id="referralCode" value="'+referralCode+'"/>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Academic Year</label>'
					+'<select class="form-control" name="academicYear" id="academicYear">'
					+'</select>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Enrollment Status</label>'
					+'<select class="form-control" name="enrollmentStatus" id="enrollmentStatus">'
					+ '<option value="">Enrollment Status</option>'
					+ '<option value="0">Enrolled</option>'
					+ '<option value="3">RE-Enrolled</option>'
					+ '<option value="1">Withdrawn</option>'
					+ '<option value="2">Partial Entry</option>'
					+'</select>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Grade</label>'
					+'<select class="form-control" name="gradeId" id="gradeId">'
					+'<option value="">Select Grade</option>'
					+ getStandardContent(SCHOOL_ID, false)
					+'</select>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Student Name</label>'
					+'<input type="text" class="form-control" name="studentName" id="studentName"/>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Email</label>'
					+'<input type="text" class="form-control" name="email" id="email"/>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Country</label>'
					+'<select class="form-control" name="countryId" id="countryId"></select>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">State</label>'
					+'<select class="form-control" name="stateId" id="stateId"></select>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">City</label>'
					+'<select class="form-control" name="cityId" id="cityId"></select>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Commission Status</label>'
					+'<select class="form-control" name="commissionStatus" id="commissionStatus">'
					+'<option value="">Select Commission Status</option>'
						+'<option value="PENDING">Pending</option>'
						+'<option value="Amount Transferred">Amount Transferred</option>'
						+'<option value="None">None</option>'
					+'</select>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Learning Program</label>'
					+'<select class="form-control" name="learningProgram" id="learningProgram">'
						+'<option value="">Select Learning Program</option>'
						// +'<option value="ONE_TO_ONE">One-to-One</option>'
						// +'<option value="BATCH">Group</option>'
						// +'<option value="SCHOLARSHIP">Self-Study With Plan</option>'
						// +'<option value="SSP">Self-Study</option>'
						// +'<option value="ONE_TO_ONE_FLEX">Flexy</option>'
						+getLearningProgramContent(SCHOOL_ID)
					+'</select>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Payment Date From</label>'
					+'<input type="text" class="form-control" name="paymentDateFrom" id="paymentDateFrom"/>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Payment Date To</label>'
					+'<input type="text" class="form-control" name="paymentDateTo" id="paymentDateTo"/>'
				+'</div>'
				// +'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
				// 	+'<label class="full text-primary">Payment Title</label>'
				// 	+'<select class="form-control" name="paymentTitle" id="paymentTitle">'
				// 	+ getPaymentTitle(SCHOOL_ID)
				// 	+'</select>'
				// +'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Payment Status</label>'
					+'<select class="form-control" name="paymentStatus" id="paymentStatus">'
						+'<option value="">Select Payment Status</option>'
						+'<option value="SUCCESS">SUCCESS</option>'
						+'<option value="SCHEDULED">SCHEDULED</option>'
						+'<option value="INITIATED">INITIATED</option>'
						+'<option value="FAILED">FAILED</option>'
					+'</select>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Fee Status</label>'
					+'<select class="form-control" name="feeStatus" id="feeStatus">'
						+'<option value="">Select Fee Status</option>'
						+'<option value="PENDING">Pending Fees</option>'
						+'<option value="FULL">No Pending Fees</option>'
						+'<option value="FEENOTSELECT">Fee Plan not selected</option>'
						
					+'</select>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Sort By</label>'
					+'<select class="form-control" name="sortBy" id="sortBy">'
						+'<option value="Desc">Desc</option>'
						+'<option value="Asc">Asc</option>'
					+'</select>'
				+'</div>'
				// +'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
				// 	+'<label class="full text-primary">Order By</label>'
				// 	+'<select class="form-control" name="orderBy" id="orderBy">'
				// 		+'<option value="PAY_DATE">Fee Date</option>'
				// 		+'<option value="PAY_DATE">Fee Date</option>'
				// 	+'</select>'
				// +'</div>'
				+'<div class="col-xl-3 col-lg-3 col-sm-4 col-sm-6 col-12">'
					+'<label class="full text-primary">Page Size</label>'
					+'<input type="text" class="form-control" value="25" name="pageSize" id="pageSize"/>'
				+'</div>'
				+'<div class="col-12 mt-2 text-right">';
				if(referralCode==''){
					html+='<a href="javascript:void(0)" class="btn btn-success btn-shadow float-right pr-4 pl-4 ml-2" id="bulkCommission">Bulk Commission</a>';
				}

				html+='<a href="javascript:void(0)" class="btn btn-success btn-shadow float-right pr-4 pl-4" id="searchEnrolled">Search</a>'
					+'<a href="javascript:void(0)" class="btn btn-primary btn-shadow float-right pr-4 pl-4 mr-2" onclick="resetEnrollmentForm(\'partnerEnrollFilterForm\')">Reset</a>'
				+'</div>'
			+'</div>'
		+'</div></form>';
	return html;
}

function B2CStudentListDetailsSkeleton(){
	var html=
		'<div class="col-12 mb-2" id="enroll-list-skeleton">'
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

function B2CStudentListDetails(studentList, updateTransferMsg){
	console.log(studentList);
	var html= 
		'<table class="table table-bordered font-12 border-radius-table" style="min-width:1300px;width:100%;font-size:11px !important" id="studentDataList">'
			+'<thead>'
				+'<tr>'
					+'<th class="bg-primary text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important">S No.</th>'
					+'<th class="bg-primary text-white bold border-bottom-0">Student Details</th>'
					+'<th class="bg-primary text-white bold border-bottom-0">Enrollment Details</th>'
					+'<th class="bg-primary text-white bold border-bottom-0 text-center">Fee Details</th>'
					+'<th class="bg-primary text-white bold border-bottom-0 text-center">Fee Schedule</th>'
					+'<th class="bg-primary text-white bold border-bottom-0 rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Expected Commision</th>'
				+'</tr>'
			+'</thead>'
			+'<tbody class="student-table-css">';
				if(studentList.length>0){
					var sreno=1;
					for (let s = 0; s < studentList.length; s++) {
						const stuList = studentList[s];
						var onclickTransfer = "updateStudentCounselorCommissionRate('"+stuList.stuStandardId+"', 'Amount Transferred','"+stuList.commition+"','"+stuList.strCommRate+"','"+stuList.referralCode+"');";
						var onclickNone = "updateStudentCounselorCommissionRate('"+stuList.stuStandardId+"', 'None','"+stuList.commition+"','"+stuList.strCommRate+"','"+stuList.referralCode+"');";

						html+='<tr>'
								+'<td class="text-center" style="max-width:40px;min-width: 60px;">'+sreno+'</td>'
								+'<td class=" vertical-align-top">'
									+'<table class="w-100">'
										+'<tbody>'
											+'<tr>'
												+'<th class="border-0 p-1 font-weight-bold" style="width:148px">Name:</th>'
												+'<td class="border-0 p-1 ">'+stuList.studentName+'</td>'
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
															if(stuList.counselorId!=USER_ID){
																html+='<tr>'
																	+'<th class="border-0 p-1 font-weight-bold" style="width:112px">Partner Name:</th>'
																	+'<td class="border-0 p-1">'+stuList.counselorUsername+'</td>'
																+'</tr>';
															}

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
																+'<span class="full d-block"><strong>Fee:</strong>'+stuSchedule.payAmount+'</span>'
																+'<span class="full d-block"><strong>Payment Status:</strong> '+stuSchedule.status+'</span>'
																+'<span class="full d-block"><strong>Schedule Date:</strong> '+stuSchedule.scheduleDate+'</span>';
																if(stuSchedule.payDate!=''){
																	html+='<span class="full d-block"><strong>Payment Date:</strong> '+stuSchedule.payDate+'</span>';
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
															+'<tr>'
																+'<th class="border-0 p-1 font-weight-bold" style="width:80px">Status:</th>'
																+'<td class="border-0 p-1">'+stuList.transMessage+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-1 font-weight-bold" style="width:80px">Updated Date:</th>'
																+'<td class="border-0 p-1">'+stuList.transDate+'</td>'
															+'</tr>';
														if((stuList.counselorId!=USER_ID) && stuList.paymentDue=="All Paid"){
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
														// var enrollColor="bg-primary";
														// var enrollType="DIRECT ENROLLMENT";
														// if(stuList.studentEnrollBy=='ID'){
														// 	enrollType='ENROLLMENT VIA IS';
														// 	enrollColor="bg-alternate";
														// }
														// html+='<tr>'
														// 	+'<td class="border-0 p-1 font-weight-bold " colspan="2"><span class="'+enrollColor+' p-1 text-white">'+enrollType+'</span></td>'
														// +'</tr>';
														html+='</tbody>'
													+'</table>'
												+'</td>'
											+'</tr>'
										+'</tbody>'
									+'</table>'
								+'</td>'
						html+='</tr>';

						sreno=sreno+1;
					}
				}else{
					html+='<tr><td colspan="6" class="text-center bold font-16">No Record found</td></tr>';
				}
			html+='</tbody>'
		+'</table>';
	return html;
}

function B2CStudentListCommissionPopup(){
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
	+'<button type="button" class="btn btn-success btn-shadow float-right pr-4 pl-4" id="btnClickCommission">Update</button>'
	+'<button type="button" class="btn btn-info btn-shadow float-right pr-4 pl-4 mr-2" data-dismiss="modal">Close</button>'
	+'</div>'
	+'</div>'
	+'</form>'
	+'</div>'
	+'</div>'
	+'</div>';
	return html;
}

function B2CStudentListCommission(studentList){
	var html= 
		'<table class="table table-bordered font-12 border-radius-table" style="width:100%;font-size:11px !important" id="commissionList">'
			+'<thead>'
				+'<tr>'
					+'<th class="bg-primary text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important">S No.</th>'
					+'<th class="bg-primary text-white bold border-bottom-0">Name</th>'
					+'<th class="bg-primary text-white bold border-bottom-0">Fee Plan</th>'
					+'<th class="bg-primary text-white bold border-bottom-0">Commission</th>'
					+'<th class="bg-primary text-white bold border-bottom-0">Commission Status</th>'
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
								+'<td class="text-center" colspan="3">No Pending Commission</td>'
						html+='</tr>';
					}
				}else{
					html+='<tr><td colspan="6" class="text-center bold font-16">No Record found</td></tr>';
				}
			html+='</tbody>'
		+'</table>';
		
	return html;
}

function getCounselorB2BContent1(){
	var html='';
	html+='<div class="main-card mb-3 card">'
		+'<div class="no-gutters row">'
		+'	<div class="col-md-6 col-xl-3">'
		+'		<div class="widget-content">'
		+'			<div class="widget-content-wrapper">'
		+'				<div class="widget-content-right ml-0 mr-3">'
		+'					<div class="widget-numbers" id="totalB2bLead">0</div>'
		+'				</div>'
		+'				<div class="widget-content-left">'
		+'					<div class="widget-heading">Total Lead</div>'
		+'					<div class="widget-subheading">This year</div>'
		+'				</div>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		+'	<div class="col-md-6 col-xl-3">'
		+'		<div class="widget-content">'
		+'			<div class="widget-content-wrapper">'
		+'				<div class="widget-content-right ml-0 mr-3">'
		+'					<div class="widget-numbers text-success" id="convertB2bLead">0</div>'
		+'				</div>'
		+'				<div class="widget-content-left">'
		+'					<div class="widget-heading">Converted</div>'
		+'					<div class="widget-subheading">On boarding</div>'
		+'				</div>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		+'	<div class="col-md-6 col-xl-3">'
		+'		<div class="widget-content">'
		+'			<div class="widget-content-wrapper">'
		+'				<div class="widget-content-right ml-0 mr-3">'
		+'					<div class="widget-numbers text-primary" id="unattendedB2bLead">0</div>'
		+'				</div>'
		+'				<div class="widget-content-left">'
		+'					<div class="widget-heading">Unattended</div>'
		+'					<div class="widget-subheading">Current Active</div>'
		+'				</div>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		+'	<div class="col-md-6 col-xl-3">'
		+'		<div class="widget-content">'
		+'			<div class="widget-content-wrapper">'
		+'				<div class="widget-content-right ml-0 mr-3">'
		+'					<div class="widget-numbers text-warning" id="positiveB2bLead">0</div>'
		+'				</div>'
		+'				<div class="widget-content-left">'
		+'					<div class="widget-heading">Positive</div>'
		+'					<div class="widget-subheading">Organization Interested</div>'
		+'				</div>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		+'</div>'
	+'</div>';
	return html;
}

function getCounselorB2CContent1(){
	var html='';
	html+='<div class="main-card mb-3 card">'
		+'<div class="no-gutters row">'
		+'	<div class="col-md-6 col-xl-3">'
		+'		<div class="widget-content">'
		+'			<div class="widget-content-wrapper">'
		+'				<div class="widget-content-right ml-0 mr-3">'
		+'					<div class="widget-numbers" id="totalLead">0</div>'
		+'				</div>'
		+'				<div class="widget-content-left">'
		+'					<div class="widget-heading">Total Lead</div>'
		+'					<div class="widget-subheading">This academic year</div>'
		+'				</div>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		+'	<div class="col-md-6 col-xl-3">'
		+'		<div class="widget-content">'
		+'			<div class="widget-content-wrapper">'
		+'				<div class="widget-content-right ml-0 mr-3">'
		+'					<div class="widget-numbers text-success" id="hotLead">0</div>'
		+'				</div>'
		+'				<div class="widget-content-left">'
		+'					<div class="widget-heading">Hot</div>'
		+'					<div class="widget-subheading">Current Active</div>'
		+'				</div>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		+'	<div class="col-md-6 col-xl-3">'
		+'		<div class="widget-content">'
		+'			<div class="widget-content-wrapper">'
		+'				<div class="widget-content-right ml-0 mr-3">'
		+'					<div class="widget-numbers text-primary" id="coldLead">0</div>'
		+'				</div>'
		+'				<div class="widget-content-left">'
		+'					<div class="widget-heading">Cold</div>'
		+'					<div class="widget-subheading">This academic year</div>'
		+'				</div>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		+'	<div class="col-md-6 col-xl-3">'
		+'		<div class="widget-content">'
		+'			<div class="widget-content-wrapper">'
		+'				<div class="widget-content-right ml-0 mr-3">'
		+'					<div class="widget-numbers text-warning" id="warmLead">0</div>'
		+'				</div>'
		+'				<div class="widget-content-left">'
		+'					<div class="widget-heading">Warm</div>'
		+'					<div class="widget-subheading">This academic year</div>'
		+'				</div>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		+'</div>'
	+'</div>';
	return html;
}

function getCounselorB2CContent2(){
	var html='';
	html+='<div class="main-card mb-3 card">'
		+'<div class="no-gutters row">'
		
		+'	<div class="col-md-6 col-xl-3">'
		+'		<div class="widget-content">'
		+'			<div class="widget-content-wrapper">'
		+'				<div class="widget-content-right ml-0 mr-3">'
		+'					<div class="widget-numbers text-success" id="convertLead">0</div>'
		+'				</div>'
		+'				<div class="widget-content-left">'
		+'					<div class="widget-heading">Converted</div>'
		+'					<div class="widget-subheading">Enrolled</div>'
		+'				</div>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		+'	<div class="col-md-6 col-xl-3">'
		+'		<div class="widget-content">'
		+'			<div class="widget-content-wrapper">'
		+'				<div class="widget-content-right ml-0 mr-3">'
		+'					<div class="widget-numbers text-warning" id="positiveLead">0</div>'
		+'				</div>'
		+'				<div class="widget-content-left">'
		+'					<div class="widget-heading">Positive to enrollment</div>'
		+'					<div class="widget-subheading">Interested</div>'
		+'				</div>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		+'	<div class="col-md-6 col-xl-3">'
		+'		<div class="widget-content">'
		+'			<div class="widget-content-wrapper">'
		+'				<div class="widget-content-right ml-0 mr-3">'
		+'					<div class="widget-numbers" id="totalDemoLead">0</div>'
		+'				</div>'
		+'				<div class="widget-content-left">'
		+'					<div class="widget-heading">Total Demo</div>'
		+'					<div class="widget-subheading">This academic year</div>'
		+'				</div>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		+'	<div class="col-md-6 col-xl-3">'
		+'		<div class="widget-content">'
		+'			<div class="widget-content-wrapper">'
		+'				<div class="widget-content-right ml-0 mr-3">'
		+'					<div class="widget-numbers text-primary" id="totalDemoDone">0</div>'
		+'				</div>'
		+'				<div class="widget-content-left">'
		+'					<div class="widget-heading">Demo Completed</div>'
		+'					<div class="widget-subheading">This academic year</div>'
		+'				</div>'
		+'			</div>'
		+'		</div>'
		+'	</div>'
		
		+'</div>'
	+'</div>';
	return html;
}

function getCounselorMeetingB2CContent3(){
	var html='';
		html+='<div class="row">'
				+'<div class="col-md-6">'
					+'<div class="main-card mb-3 card">'
					+'<div class="card-header-tab card-header">'
					+'<div class="card-header-title font-size-lg text-capitalize font-weight-normal">Meeting List</div>'
					+'</div>'
						+'<div class="card-body">'
							+'<table class="table table-bordered table-striped" id="counselor-demo-meeting-list" style="font-size:11px !important" >'
								+'<thead>'
									+'<tr>'
										+'<th style="5% !important" class="text-center bg-primary text-white">Sr no.</th>'
										+'<th class="text-center bg-primary text-white">Meeting Title</th>'
										+'<th class="text-center bg-primary text-white">Time</th>'
										+'<th class="text-center bg-primary text-white">Status</th>'
									+'</tr>'
								+'</thead>'
								+'<tbody id="demo-meeting-list"></tbody>'
							+'</table>'
						+'</div>'
					+'</div>'
				+'</div>'
				+'<div class="col-md-6">'
					+'<div class="main-card mb-3 card">'
					+'<div class="card-header-tab card-header">'
					+'<div class="card-header-title font-size-lg text-capitalize font-weight-normal">Followup Reminder List</div>'
					+'</div>'
						+'<div class="card-body">'
							+'<table class="table table-bordered table-striped" id="followup-leads-list" style="font-size:11px !important" >'
								+'<thead>'
									+'<tr>'
										+'<th style="5% !important" class="text-center bg-primary text-white">Sr no.</th>'
										+'<th class="text-center bg-primary text-white">Name</th>'
										+'<th class="text-center bg-primary text-white">Contact</th>'
										+'<th class="text-center bg-primary text-white">Reminder Time</th>'
									+'</tr>'
								+'</thead>'
								+'<tbody id="demo-meeting-list"></tbody>'
							+'</table>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>';
	return html;
}

