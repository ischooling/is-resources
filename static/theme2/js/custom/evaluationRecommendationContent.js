


function renderEvaluationAddRecommendation(userId, evaluationId, logoUrl, copyrightYear, copyrightUrl) {
	var responseData = getCTIDetails(userId, evaluationId);
	var recommendation = responseData.recommendation;
	console.log('responseData '+responseData);
	var html=
		CTIHeader(recommendation)
		+connectToImpactDetails(recommendation)
		+addRecommendationsCard(userId, evaluationId, recommendation)
		+serverMessageContent();
	$('body').append(html);
	$('#recommendedGradeId').val(recommendation.recommendedGradeId);
}
	
function CTIHeader(recommendation){
	var html = 
		'<div class="container-fluid card">'
			+'<div class="row">'
				+'<div class="col-md-12 text-center">'
					+'<h3 class="py-2 px-1 text-primary">Connect to Impact Program Recommendations | '+recommendation.studentName+'</h3>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;	
}

function connectToImpactDetails(recommendation){
	var html =
		'<div class="container-fluid">'
			+'<div class="row">'
				+'<div class="col-md-4">'
					+'<div class="widget MT-40 MB-15">'
						+'<p>'
							+'<strong>Recommendation No.</strong>: '+recommendation.referenceNumber
						+'</p>'
					+'</div>'
				+'</div>'
				+'<div class="col-md-4">'
					+'<div class="widget MT-40 MB-15">'
						+'<p>'
							+'<strong>Student Name</strong> : <span>'+recommendation.studentName+'</span>'
						+'</p>'
					+'</div>'
				+'</div>'
				+'<div class="col-md-4">'
					+'<div class="widget MT-40 MB-15">'
						+'<p>'
							+'<strong>Parent Name</strong> : '+recommendation.parentName
						+'</p>'
					+'</div>'
				+'</div>'
				+'<div class="col-md-4">'
					+'<div class="widget MB-40">'
						+'<p>'
							+'<strong>Country | City</strong> : <span>'+recommendation.countryName+' | '+recommendation.cityName+'</span>'
						+'</p>'
					+'</div>'
				+'</div>'
				+'<div class="col-md-4">'
					+'<div class="widget MB-40">'
						+'<p>'
							+'<strong>Previous/Current Grade</strong> : '+recommendation.currentGrade
						+'</p>'
					+'</div>'
				+'</div>'
				+'<div class="col-md-4">'
					+'<div class="widget MB-40">'
						+'<p>'
							+'<strong>Seeking Enrollment in Grade</strong> : '+recommendation.seekingGrade
						+'</p>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;	
}

function addRecommendationsCard(userId, evaluationId, recommendation){
	var html =
		'<div class="container-fluid">'
			+'<div class="row">'
				+'<div class="col-md-12 mb-2">'
					+'<div class="main-card mb-4 card">'
						+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
							+'<div class="row">'
								+'<h5 class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-0 p-2 bg-primary text-white card-img-top">ADD RECOMMENDATIONS</h5>'
							+'</div>'
						+'</div>'
						+'<div class="card-body">'
							+addRecommendationsTable(recommendation)
							+scoreLegend(recommendation)
							+finalRemarks(recommendation)
							+saveAndPreviewBtn(userId, evaluationId, recommendation)
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;	
}

function addRecommendationsTable(recommendation){
	html =
		'<div class="row">'
			+'<table class="table table-bordered table-striped">'
				+'<thead>'
					+'<tr>'
						+'<th>Course Name</th>'
						+'<th>Score</th>'
						+'<th>Remarks</th>'
					+'</tr>'
				+'</thead>'
				+'<tbody>';
					$.each(recommendation.details, function (k, v) {
						html+=
						'<tr>'
							+'<td style="width:250px;" id="courseName'+v.id+'">'+v.courseName+'</td>'
							+'<td style="width:250px;">'
								+'<select id="score'+v.id+'" class="form-control">'
									+'<option value="4" '+(v.score==4?'selected':'')+' >4 Excellent</option>'
									+'<option value="3" '+(v.score==3?'selected':'')+' >3 Very Good</option>'
									+'<option value="2" '+(v.score==2?'selected':'')+' >2 Good</option>'
									+'<option value="1" '+(v.score==1?'selected':'')+' >1 Average</option>'
								+'</select>'
							+'</td>'
							+'<td>'
								+'<textarea class="form-control" id="remarks'+v.id+'" maxlength="1000">'+v.remarks+'</textarea>'
							+'</td>'
						+'</tr>';
					});
					html+='</tr>'
				+'</tbody>'
			+'</table>'
		+'</div>';
	return html;	
}

function scoreLegend(recommendation){
	var html=
		'<div class="row">'
			+'<div class="full mt-2">'
				+'<h5 class="font-size-lg font-weight-bold">The following key demonstrates the level of understanding</h5>'
			+'</div>'
			+'<div class="col-lg-12 col-md-12 col-sm-12 col-12">'
				+'<table width="100%" border="0" cellpadding="0" cellspacing="0">'
					+'<tbody>'
						+'<tr>'
							+'<td style="vertical-align: middle;">'
								+'<div >'
									+'<div class="border-primary" style="font-size: 13px;line-height: 18px;padding: 10px; border:2px solid;float: left;width: 100%;">'
										+'<p style="margin: 0;"><strong class="text-primary">4 Excellent</strong>&nbsp;(Student can apply the skill or concept correctly and independently. She/he is progressing successfully)</p>'
										+'<p style="margin: 0;"><strong class="text-primary">3 Very Good</strong>&nbsp;(Student shows some understanding. However, errors or misunderstandings still occur. Requires hints and suggestions)</p>'
										+'<p style="margin: 0;"><strong class="text-primary">2 Good</strong>&nbsp;(Student is just beginning to understand this skill or concept)</p>'
										+'<p style="margin: 0;"><strong class="text-primary">1 Average</strong>&nbsp;(Student is having trouble with this concept or skill. Assistance at home is needed)</p>'
									+'</div>'
								+'</div>'
							+'</td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</div>'
		+'</div>';
	return html;
}
function finalRemarks(recommendation){
	var html=
		'<div class="row">'
			+'<div class="full mt-2">'
				+'<h5 class="font-size-lg font-weight-bold">Final Remarks</h5>'
			+'</div>'
			+'<div class="col-lg-8 col-md-12 col-sm-12 col-12">'
				+'<span class="d-inline-block full text-white" style="background-color:#0044cd"> &nbsp;We thank '+ recommendation.studentName+' for participating in our <img src="'+PATH_FOLDER_IMAGE+'connectToImpact/connect_to_impact.png" width="195"/> program.'
				+'<textarea class="form-control" name="finalRemarks" id="finalRemarks" rows="5" maxlength="1000">'+recommendation.finalRemarks+'</textarea>'
			+'</div>'
			+'<div class="col-lg-4 col-md-12 col-sm-12 col-12">'
				+'<div class="full mb-2">'
					+'<label for="recommendedGradeId" class="m-0">Recommended Grade</label>'
					+'<select id="recommendedGradeId" class="form-control">'
						+ getStandardContent(SCHOOL_ID,'Y')
					+'</select>'
				+'</div>'
				+'<div class="full mb-2">'
					+'<label for="recommendedBy" class="m-0">Academic Expert</label>'
					+'<select name="recommendedBy" id="recommendedBy" class="form-control">'
						+'<option value="0">Select Academic Expert</option>';
						for(var i=0; i<recommendation.ctiRoleList.length;i++){
							if(recommendation.ctiRoleList[i].key==recommendation.academicExpert){
								html+='<option value="'+recommendation.ctiRoleList[i].key+'" selected>'+recommendation.ctiRoleList[i].value+'</option>';
							}else{
								html+='<option value="'+recommendation.ctiRoleList[i].key+'">'+recommendation.ctiRoleList[i].value+'</option>';
							}
						}
						
				html+='</select>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;	

}

function saveAndPreviewBtn(userId, evaluationId, recommendation){
	var html=
		'<div class="row">'
			+'<div class="full text-center mt-2">'
				+'<button class="btn btn-success mr-2" onclick="confirmCTIRecommendation('+userId+', '+evaluationId+')">Save</button>'
				+'<a class="btn btn-primary" href="'+recommendation.previewUrl+'" target="_blank">Preview Report</a>'
			+'</div>'
		+'</div>';
	return html;	
}

function serverMessageContent(){
	var html=
		'<div class="server-message">'
			+'<span class="msg" id="msgTheme2"></span>'
		+'</div>';
	return html;	
}