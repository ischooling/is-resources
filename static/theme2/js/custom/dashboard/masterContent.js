
function getGradesData(requiredGrades){
	var grades=[]
	for(var index=0;index<requiredGrades.length;index++){
		var grade={};
		if(requiredGrades[index]=='N'){
			grade['key']=17;
			grade['value']='Nursery';
			grades.push(grade);
		}else if(requiredGrades[index]=='KG'){
			grade['key']=11;
			grade['value']='Grade K';
			grades.push(grade);
		}else if(requiredGrades[index]=='1'){
			grade['key']=12;
			grade['value']='Grade 1';
			grades.push(grade);
		}else if(requiredGrades[index]=='2'){
			grade['key']=13;
			grade['value']='Grade 2';
			grades.push(grade);
		}else if(requiredGrades[index]=='3'){
			grade['key']=14;
			grade['value']='Grade 3';
			grades.push(grade);
		}else if(requiredGrades[index]=='4'){
			grade['key']=15;
			grade['value']='Grade 4';
			grades.push(grade);
		}else if(requiredGrades[index]=='5'){
			grade['key']=16;
			grade['value']='Grade 5';
			grades.push(grade);
		}else if(requiredGrades[index]=='6'){
			grade['key']=1;
			grade['value']='Grade 6';
			grades.push(grade);
		}else if(requiredGrades[index]=='7'){
			grade['key']=2;
			grade['value']='Grade 7';
			grades.push(grade);
		}else if(requiredGrades[index]=='8'){
			grade['key']=3;
			grade['value']='Grade 8';
			grades.push(grade);
		}else if(requiredGrades[index]=='9'){
			grade['key']=4;
			grade['value']='Grade 9';
			grades.push(grade);
		}else if(requiredGrades[index]=='10'){
			grade['key']=5;
			grade['value']='Grade 10';
			grades.push(grade);
		}else if(requiredGrades[index]=='11'){
			grade['key']=6;
			grade['value']='Grade 11';
			grades.push(grade);
		}else if(requiredGrades[index]=='12'){
			grade['key']=7;
			grade['value']='Grade 12';
			grades.push(grade);
		}else if(requiredGrades[index]=='13'){
			grade['key']=19;
			grade['value']='Flexy - Elementary School';
			grades.push(grade);
		}else if(requiredGrades[index]=='14'){
			grade['key']=9;
			grade['value']='Flexy - Middle School';
			grades.push(grade);
		}else if(requiredGrades[index]=='15'){
			grade['key']=10;
			grade['value']='Flexy - High School';
			grades.push(grade);
		}else if(requiredGrades[index]=='16'){
			grade['key']=20;
			grade['value']='Flexy - Credit Recovery';
			grades.push(grade);
		}else if(requiredGrades[index]=='17'){
			grade['key']=21;
			grade['value']='Flexy - Advanced Placement';
			grades.push(grade);
		}else if(requiredGrades[index]=='EP'){
			grade['key']=8;
			grade['value']='Exact-Path';
			grades.push(grade);
		}
	}
	return grades;
}

function getGradesNameByIds(requiredGrades){
    var grades=[]
    for(var index=0;index<requiredGrades.length;index++){
        var grade={};
        if(requiredGrades[index]=='17'){
            grade['key']=17;
            grade['value']='Nursery';
            grades.push(grade);
        }else if(requiredGrades[index]=='11'){
            grade['key']=11;
            grade['value']='Grade K';
            grades.push(grade);
        }else if(requiredGrades[index]=='12'){
            grade['key']=12;
            grade['value']='Grade 1';
            grades.push(grade);
        }else if(requiredGrades[index]=='13'){
            grade['key']=13;
            grade['value']='Grade 2';
            grades.push(grade);
        }else if(requiredGrades[index]=='14'){
            grade['key']=14;
            grade['value']='Grade 3';
            grades.push(grade);
        }else if(requiredGrades[index]=='15'){
            grade['key']=15;
            grade['value']='Grade 4';
            grades.push(grade);
        }else if(requiredGrades[index]=='16'){
            grade['key']=16;
            grade['value']='Grade 5';
            grades.push(grade);
        }else if(requiredGrades[index]=='1'){
            grade['key']=1;
            grade['value']='Grade 6';
            grades.push(grade);
        }else if(requiredGrades[index]=='2'){
            grade['key']=2;
            grade['value']='Grade 7';
            grades.push(grade);
        }else if(requiredGrades[index]=='3'){
            grade['key']=3;
            grade['value']='Grade 8';
            grades.push(grade);
        }else if(requiredGrades[index]=='4'){
            grade['key']=4;
            grade['value']='Grade 9';
            grades.push(grade);
        }else if(requiredGrades[index]=='5'){
            grade['key']=5;
            grade['value']='Grade 10';
            grades.push(grade);
        }else if(requiredGrades[index]=='6'){
            grade['key']=6;
            grade['value']='Grade 11';
            grades.push(grade);
        }else if(requiredGrades[index]=='7'){
            grade['key']=7;
            grade['value']='Grade 12';
            grades.push(grade);
        }else if(requiredGrades[index]=='19'){
            grade['key']=19;
            grade['value']='Flexy - Elementary School';
            grades.push(grade);
        }else if(requiredGrades[index]=='9'){
            grade['key']=9;
            grade['value']='Flexy - Middle School';
            grades.push(grade);
        }else if(requiredGrades[index]=='10'){
            grade['key']=10;
            grade['value']='Flexy - High School';
            grades.push(grade);
        }else if(requiredGrades[index]=='20'){
            grade['key']=20;
            grade['value']='Flexy - Credit Recovery';
            grades.push(grade);
        }else if(requiredGrades[index]=='21'){
            grade['key']=21;
            grade['value']='Flexy - Advanced Placement';
            grades.push(grade);
        }else if(requiredGrades[index]=='8'){
            grade['key']=8;
            grade['value']='Exact-Path';
            grades.push(grade);
        }
    }
    return grades;
}

function getGrades(grades, selectOption){
	var html=''
	if(selectOption){
		html+='<option value="">Select Grade</option>';
	}
	$.each(grades, function(k, v) {
		html+='<option value="'+v.key+'">'+v.value+'</option>';
	});
	return html;
}


 
function getAllGrade(schoolId, selectOption){
    var requiredGrades = ['N','KG','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17'];
    var gradeAll= getGradesData(requiredGrades);
    var gradeOption = getGrades(gradeAll, selectOption);
    $('#gradeId').append(gradeOption);
    
}

function getGenderContent(){
	var html='<option value="">Select gender*</option>';
	html+='<option value="MALE">MALE</option>';
	html+='<option value="FEMALE">FEMALE</option>';
	// html+='<option value="TRANSGENDER">TRANSGENDER</option>';
	html+='<option value="DONOTWANTTOSPECIFY">DO NOT WANT TO SPECIFY</option>';
	return html;
}

function getRelationshipContent(){
	var html='<option value="">Select relationship*</option>'
	html+='<option value="Mother">Mother</option>';
	html+='<option value="Father">Father</option>';
	html+='<option value="Guardian">Guardian</option>';
	html+='<option value="Other">Other</option>';
	return html;
}

function getLearningProgramContent(schoolId){
	var html='';
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForLearningProgramList('LEARNING_PROGRAM_LIST', schoolId)),
		dataType: "json",
		cache: false,
		timeout: 600000,
		async: false,
		success: function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageBAS('serverError', data['message']);
			} else {
				html = getOptions(data.mastersData.learningPrograms, "")
			}
		},
		error: function(error) {
			console.log("Error:", error);
		}
	});
	return html;
}

function getAllScholarschipUsersContent(schoolId){
	var html='';
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForLearningProgramList('ALL_SCHOLARSHIP_USER', schoolId)),
		dataType: "json",
		cache: false,
		timeout: 600000,
		async: false,
		success: function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageBAS('serverError', data['message']);
			} else {
				html = getOptions(data.mastersData.data, "")
			}
		},
		error: function(error) {
			console.log("Error:", error);
		}
	});
	return html;
}

function getLearningLabel(){
	var html='<option value="">What is your Learning Level?</option>';
	html+='<option value="B">Basic | Beginner</option>';
	html+='<option value="I">Middle | Intermediate</option>';
	html+='<option value="A">Pro | Advanced</option>';
	return html;
}

function getStandardContentForFlexy(){
	var actualGrades=['13','14','15','16','17'];
	return getGrades(getGradesData(actualGrades));
}

function getStandardContentForDualDimploma(){
	var actualGrades=['8','9','10','11','12'];
	return getGrades(getGradesData(actualGrades));
}

function getStandardContentByCourseProviderId(schoolId, courseProviderId){
	var actualGrades='';
	if(schoolId==1 || schoolId==6){
		if(courseProviderId==40){
			actualGrades=['KG','1','2','3','4','5','6','7','8','9','10','11','12'];
		}else{
			actualGrades=['KG','1','2','3','4','5','6','7','8','9','10','11','12'];
		}
	}else{
		actualGrades=['1','2','3','4','5','6','7','8','9','10','11','12'];
	}
	return getGrades(getGradesData(actualGrades));
}
 
function getStandardContent(schoolId,fullGrade, selectOption){
	if(selectOption==undefined){
		selectOption=false;
	}
	var actualGrades='';
	if(schoolId==1 || schoolId==6){
		if(fullGrade){
			actualGrades=['KG','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','19', '20', '21', '22', '23'];
		}else{
			actualGrades=['KG','1','2','3','4','5','6','7','8','9','10','11','12'];
		}
	}else{
		actualGrades=['1','2','3','4','5','6','7','8','9','10','11','12'];
	}
	return getGrades(getGradesData(actualGrades), selectOption);
}

function getLmsPlatformContent(schoolId){
	var html='<option value="">Select LMS Platform</option>';
	if(schoolId==5){
		html+='<option value="36">BUZZ</option>';
	}else if(schoolId==1){
		html+='<option value="37">BUZZ-GC</option>';
		html+='<option value="38">BUZZ-GR</option>';
		html+='<option value="36">BUZZ</option>';
		html+='<option value="39">Exact-Path</option>';
		html+='<option value="40">Edmentum-Canvas</option>';
		html+='<option value="41">Courseware</option>';
		
		html+='<option value="1">Agilix Buzz</option>';
		html+='<option value="2">Odysseyware</option>';
		html+='<option value="31">Buzz</option>';
	}else{
		html+='<option value="37">BUZZ-GC</option>';
		html+='<option value="38">BUZZ-GR</option>';
		html+='<option value="41">Courseware</option>';
	}
	return html;
}

function getWaringContent1(){
	if(tt=='theme1'){
		$('body').append(getWaringContent1Theme1());
	}else{
		$('body').append(getWaringContent1Theme2());
	}
}

function getClassesContent(schoolId){
	var html=
	'<option value="batchName">Batch Name</option>'
	+'<option value="batchName">Batch Name</option>'
	+'<option value="batchName">Batch Name</option>'
	+'<option value="batchName">Batch Name</option>';
	return html;
}

function getTimeZonesList(formId, elementId, elementIdCheck,offsetForDate){
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','TIMEZONE-LIST')),
		dataType : 'json',
		global:false,
		async : false,
		success : function(data) {
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var defaultTZ = $('#'+elementIdCheck).val();
				var result = data['mastersData']['countryTimeZones'];
				var dropdown = $('#'+formId+' #'+elementId);
				dropdown.html('');
				$.each(result, function(k, v) {
					var mCurrent = moment.tz(offsetForDate, 'YYYY-MM-DD hh:mm:ss', v.value);
					offset='UTC '+mCurrent.format('Z');
					if(defaultTZ==v.value){
						dropdown.append('<option custom_timezone_id="' + v.key + '" value="' + v.value + '" selected>'+ v.extra1+' | '+v.extra3+' | '+offset + '</option>');
					}else{
						dropdown.append('<option custom_timezone_id="' + v.key + '" value="' + v.value + '">'+ v.extra1+' | '+v.extra3+' | '+offset + '</option>');
					}
				});
			}
		},
		error : function(e) {
			if (checkonlineOfflineStatus()) {
				return;
			}
			console.log(e);
		}
	});
}

function getTimeZones(formId,elementId,elementIdCheck){
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','TIMEZONE-LIST')),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var defaultTZ = $('#'+elementIdCheck).val();
				var result = data['mastersData']['countryTimeZones'];
				var dropdown = $('#'+formId+' #'+elementId);
				dropdown.html('');
				$.each(result, function(k, v) {
					if(defaultTZ==v.value){
						dropdown.append('<option value="' + v.key + '" selected>' + v.value.replaceAll('_',' ') + ' </option>');
					}else{
						dropdown.append('<option value="' + v.key + '">' + v.value.replaceAll('_',' ') + ' </option>');
					}
				});
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}

function getTeacherAssignedStudent(standardId, userId){
	if(standardId=='' || standardId=='0' || standardId=='undefined'){
		return false;
	}
	$('#classroomSessionFilter #studentName').html('');
	$('#classroomSessionFilter #meetingSubject').val('');
	$('#classroomSessionFilter #subjectIds').html('');
	$('#classroomSessionFilter #meetingDate').val('');
	$('#classroomSessionFilter #duration').val('50');
	$('#classroomSessionFilter #startTimeHours').val("").trigger('change');
	$('#classroomSessionFilter #startTimeMins').val("").trigger('change');
	if ($('#classroomSessionFilter #classEndDate').data('datepicker')) {
		$('#classroomSessionFilter #classEndDate').datepicker("destroy");
		$('#classroomSessionFilter #classEndDate').val('');
	}
	if ($('#classroomSessionFilter #classStartDate').data('datepicker')) {
		$('#classroomSessionFilter #classStartDate').datepicker("destroy");
		$('#classroomSessionFilter #classStartDate').val('');
	}
	$('.meetingSlotAdd').hide();
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','TEACHER_ASSIGNED_STUDENT_LIST', userId, standardId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['studentsList'];
				if(result.length>0){
					var dropdown = $('#classroomSessionFilter #studentName');
					dropdown.html('');
					dropdown.append('<option value="">Select Student Name</option>');
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.key + '" data-studentid="'+v.extra2+'" data-studentemail="'+v.extra1+'">'+ v.value + ' </option>');
					});
				}
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}

function callCoursesAssignedToteacher(studentStandardId, teacherUserId){
	if(studentStandardId=='' || studentStandardId=='0' || studentStandardId=='undefined' || studentStandardId=='null'){
		return false;
	}
	$('#classroomSessionFilter #subjectIds').html('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','TEACHER_ASSIGNED_SUBJECT_OF_STUDENT_LIST', studentStandardId, teacherUserId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['studentsList'];
				if(result.length>0){
					var dropdown = $('#classroomSessionFilter #subjectIds');
					dropdown.html('');
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
					});
					getMeetingTitle();
					// getStudentDetails('classroomSessionFilter',161);
				}
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}

function getWaringContent1Theme1(){
	html=
	'<div class="modal fade bhagat" id="remarksresetDelete1" tabindex="-1">'
		+'<div class="modal-dialog modal-md modal-notify modal-info" role="document">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header bg-info justify-content-center" style="top: 0 !important;width:100% !important;padding: 15px 10px;">'
					+'<p class="heading" style="color: #fff;" id="warningMessage1">Are you sure?</p>'
				+'</div>'
				+'<div id="statusMessage-1" class="modal-body delete-modal withdraw" style="padding-top:12px">'
					+'<i class="fa fa-refresh fa-4x" style="color:#337ab7 !important;"></i>'
				+'</div>'
				+'<div class="modal-footer text-center">'
					+'<div class="text-center" style="margin: 0 auto;">'
						+'<button id="resetDeleteErrorWarningYes1" type="button" class="btn" style="color:#59b2ff !important;border:1px solid #337ab7 !important;background:transparent !important">Yes</button>'
						+'<button id="resetDeleteErrorWarningNo1" type="button" class="btn" data-dismiss="modal" style="color:#59b2ff !important;border:1px solid #337ab7 !important;background:transparent !important">No</button>'
						+'<button id="resetDeleteErrorWarningCancel1" type="button" class="btn btn-default" data-dismiss="modal">Close</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function getWaringContent1Theme2(){
	html=
	'<div class="modal fade fade-scale" id="remarksresetDelete1" tabindex="-1">'
		+'<div class="modal-dialog modal-md modal-dialog-centered box-shadow-none" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header pt-2 pb-2 bg-info justify-content-center">'
					+'<h5 class="heading text-white text-center" id="warningMessage1">Are you sure?</h5>'
				+'</div>'
				+'<div id="statusMessage-1" class="modal-body delete-modal text-center">'
					+'<i class="fas fa-sync fa-4x text-info"></i>'
				+'</div>'
				+'<div class="modal-footer">'
					+'<div class="m-auto">'
						+'<button id="resetDeleteErrorWarningYes1" type="button" class="btn btn-outline-info mr-1">Yes</button>'
						+'<button id="resetDeleteErrorWarningNo1" type="button" class="btn btn-info mr-1" data-dismiss="modal">No</button>'
						+'<button id="resetDeleteErrorWarningCancel1" type="button" class="btn btn-success mr-1" data-dismiss="modal">Close</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function getMeetingVendorUserStatus(schoolId,userId,meetingVendor){
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','TEACHER_LENS_USER_STATUS',schoolId,userId, meetingVendor)),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['mastersData']['meetingVendorUserStatus'] == 'Yes') {
				$('#startAdminTaskButton, #showGuideLine').show();
				$('#showMessage').html('');
			} else {
				$('#startAdminTaskButton, #showGuideLine').hide();
				$('#showMessage').html('Your '+meetingVendor+' user is not created, please contact admin to start the admin task!');
				
			}
		}
	});
}

function getTeacherDetails(formId, elementId, elementIdAlternet, schoolId){
	var data = '';
	if(USER_ROLE=='TEACHER'){
		data = getRequestForMaster('formId', 'TEACHER_LIST', schoolId,USER_ID);
	}else{
		data = getRequestForMaster('formId', 'TEACHER_LIST', schoolId);
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(data),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(1, data['message']);
			} else {
				var html='';
				if(USER_ROLE!='TEACHER'){
					html+='<option value="">Select Teacher</option>'
				}
				$.each(data['mastersData']['data'], function(k, v) {
					html+='<option value="'+v.key+'" teacherId="'+v.extra+'" teacherTimezone="'+v.extra2+'">'+v.value+'</option>';
				});
				$("#"+formId+" #"+elementId).html(html);
				if(elementIdAlternet!=''){
					$("#"+elementIdAlternet).html(html);
				}
				
			}
			$("#"+formId+" #"+elementId).prop("disabled", false);
		}
	});
}

function getAccountCategory(){
	return {"Savings":"Savings","Checking":"Checking","Current":"Current"};
}
function getAccountCategoriesOption(preSelected){
	var html='<option value="">Select Account Type</option>'
	$.each(getAccountCategory(), function(k, v) {
		html+='<option value="'+k+'" '+(preSelected==k?'selected':'')+' >'+k+'</option>';
	});
	return html;
}

function getCurrencies(){
	return {"AED":"United Arab Emirates Dirham","AFN":"Afghan Afghani","ALL":"Albanian Lek","AMD":"Armenian Dram","ANG":"Netherlands Antillean Guilder","AOA":"Angolan Kwanza","ARS":"Argentine Peso","AUD":"Australian Dollar","AWG":"Aruban Florin","AZN":"Azerbaijani Manat","BAM":"Bosnia-Herzegovina Convertible Mark","BBD":"Barbadian Dollar","BDT":"Bangladeshi Taka","BGN":"Bulgarian Lev","BHD":"Bahraini Dinar","BIF":"Burundian Franc","BMD":"Bermudan Dollar","BND":"Brunei Dollar","BOB":"Bolivian Boliviano","BRL":"Brazilian Real","BSD":"Bahamian Dollar","BTC":"Bitcoin","BTN":"Bhutanese Ngultrum","BTS":"BitShares","BWP":"Botswanan Pula","BYN":"Belarusian Ruble","BZD":"Belize Dollar","CAD":"Canadian Dollar","CDF":"Congolese Franc","CHF":"Swiss Franc","CLF":"Chilean Unit of Account (UF)","CLP":"Chilean Peso","CNH":"Chinese Yuan (Offshore)","CNY":"Chinese Yuan","COP":"Colombian Peso","CRC":"Costa Rican Colón","CUC":"Cuban Convertible Peso","CUP":"Cuban Peso","CVE":"Cape Verdean Escudo","CZK":"Czech Republic Koruna","DASH":"Dash","DJF":"Djiboutian Franc","DKK":"Danish Krone","DOGE":"DogeCoin","DOP":"Dominican Peso","DZD":"Algerian Dinar","EAC":"EarthCoin","EGP":"Egyptian Pound","EMC":"Emercoin","ERN":"Eritrean Nakfa","ETB":"Ethiopian Birr","ETH":"Ethereum","EUR":"Euro","FCT":"Factom","FJD":"Fijian Dollar","FKP":"Falkland Islands Pound","FTC":"Feathercoin","GBP":"British Pound Sterling","GEL":"Georgian Lari","GGP":"Guernsey Pound","GHS":"Ghanaian Cedi","GIP":"Gibraltar Pound","GMD":"Gambian Dalasi","GNF":"Guinean Franc","GTQ":"Guatemalan Quetzal","GYD":"Guyanaese Dollar","HKD":"Hong Kong Dollar","HNL":"Honduran Lempira","HRK":"Croatian Kuna","HTG":"Haitian Gourde","HUF":"Hungarian Forint","IDR":"Indonesian Rupiah","ILS":"Israeli New Sheqel","IMP":"Manx pound","INR":"Indian Rupee","IQD":"Iraqi Dinar","IRR":"Iranian Rial","ISK":"Icelandic Króna","JEP":"Jersey Pound","JMD":"Jamaican Dollar","JOD":"Jordanian Dinar","JPY":"Japanese Yen","KES":"Kenyan Shilling","KGS":"Kyrgystani Som","KHR":"Cambodian Riel","KMF":"Comorian Franc","KPW":"North Korean Won","KRW":"South Korean Won","KWD":"Kuwaiti Dinar","KYD":"Cayman Islands Dollar","KZT":"Kazakhstani Tenge","LAK":"Laotian Kip","LBP":"Lebanese Pound","LD":"Linden Dollar","LKR":"Sri Lankan Rupee","LRD":"Liberian Dollar","LSL":"Lesotho Loti","LTC":"LiteCoin","LYD":"Libyan Dinar","MAD":"Moroccan Dirham","MDL":"Moldovan Leu","MGA":"Malagasy Ariary","MKD":"Macedonian Denar","MMK":"Myanma Kyat","MNT":"Mongolian Tugrik","MOP":"Macanese Pataca","MRU":"Mauritanian Ouguiya","MUR":"Mauritian Rupee","MVR":"Maldivian Rufiyaa","MWK":"Malawian Kwacha","MXN":"Mexican Peso","MYR":"Malaysian Ringgit","MZN":"Mozambican Metical","NAD":"Namibian Dollar","NGN":"Nigerian Naira","NIO":"Nicaraguan Córdoba","NMC":"Namecoin","NOK":"Norwegian Krone","NPR":"Nepalese Rupee","NVC":"NovaCoin","NXT":"Nxt","NZD":"New Zealand Dollar","OMR":"Omani Rial","PAB":"Panamanian Balboa","PEN":"Peruvian Nuevo Sol","PGK":"Papua New Guinean Kina","PHP":"Philippine Peso","PKR":"Pakistani Rupee","PLN":"Polish Zloty","PPC":"Peercoin","PYG":"Paraguayan Guarani","QAR":"Qatari Rial","RON":"Romanian Leu","RSD":"Serbian Dinar","RUB":"Russian Ruble","RWF":"Rwandan Franc","SAR":"Saudi Riyal","SBD":"Solomon Islands Dollar","SCR":"Seychellois Rupee","SDG":"Sudanese Pound","SEK":"Swedish Krona","SGD":"Singapore Dollar","SHP":"Saint Helena Pound","SLL":"Sierra Leonean Leone","SOS":"Somali Shilling","SRD":"Surinamese Dollar","SSP":"South Sudanese Pound","STD":"São Tomé and Príncipe Dobra (pre-2018)","STN":"São Tomé and Príncipe Dobra","STR":"Stellar","SVC":"Salvadoran Colón","SYP":"Syrian Pound","SZL":"Swazi Lilangeni","THB":"Thai Baht","TJS":"Tajikistani Somoni","TMT":"Turkmenistani Manat","TND":"Tunisian Dinar","TOP":"Tongan Pa\'anga","TRY":"Turkish Lira","TTD":"Trinidad and Tobago Dollar","TWD":"New Taiwan Dollar","TZS":"Tanzanian Shilling","UAH":"Ukrainian Hryvnia","UGX":"Ugandan Shilling","USD":"United States Dollar","UYU":"Uruguayan Peso","UZS":"Uzbekistan Som","VEF":"Venezuelan Bolívar Fuerte (Old)","VEF_BLKMKT":"Venezuelan Bolívar (Black Market)","VEF_DICOM":"Venezuelan Bolívar (DICOM)","VEF_DIPRO":"Venezuelan Bolívar (DIPRO)","VES":"Venezuelan Bolívar Soberano","VND":"Vietnamese Dong","VTC":"VertCoin","VUV":"Vanuatu Vatu","WST":"Samoan Tala","XAF":"CFA Franc BEAC","XAG":"Silver Ounce","XAU":"Gold Ounce","XCD":"East Caribbean Dollar","XDR":"Special Drawing Rights","XMR":"Monero","XOF":"CFA Franc BCEAO","XPD":"Palladium Ounce","XPF":"CFP Franc","XPM":"Primecoin","XPT":"Platinum Ounce","XRP":"Ripple","YER":"Yemeni Rial","ZAR":"South African Rand","ZMW":"Zambian Kwacha","ZWL":"Zimbabwean Dollar"};
}
function getCurrenciesOption(preSelected){
	var html=''
	$.each(getCurrencies(), function(k, v) {
		html+='<option value="'+k+'" '+(preSelected==k?'selected':'')+' >'+k+'</option>';
	});
	return html;
}

function getCountriesOption(countries, preSelected){
	var html='';
	$.each(countries, function(k, v) {
		html+='<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="'+v.key+'" '+(preSelected==v.key?'selected':'')+'>'+v.value+'</option>'
		//html+='<option value="'+v.key+'" '+(preSelected==v.key?'selected':'')+' >'+v.value+'</option>';
	});
	return html;
}
function getNationalityOption(countries, preSelected){
	var html='';
	$.each(countries, function(k, v) {
		html+='<option value="'+v.value+'" '+(preSelected==v.value?'selected':'')+'>'+v.value+'</option>'
		//html+='<option value="'+v.key+'" '+(preSelected==v.key?'selected':'')+' >'+v.value+'</option>';
	});
	return html;
}



function getStatesOption(states, preSelected){
	var html='';
	$.each(states, function(k, v) {
		html+='<option value="'+v.key+'" '+(preSelected==v.key?'selected':'')+' >'+v.value+'</option>';
	});
	return html;
}

function getCitiesOption(cities, preSelected){
	var html=''
	$.each(cities, function(k, v) {
		html+='<option value="'+k+'" '+(preSelected==k?'selected':'')+' >'+v+'</option>';
	});
	return html;
}

function getOptions(otions, preSelected){
	var html=''
	$.each(otions, function(k, v) {
		html+='<option value="'+v.key+'" '+(preSelected==v.key?'selected':'')+' >'+v.value+'</option>';
	});
	return html;
}

function getSchoolContent(schoolId){
	var html='';
	if(schoolId==''){
		html='<option value="">Select School</option>';
	}else{
		
	}
	// if(schoolId==1){
	// 	html+='<option value="1" extraschooluserid="2" selected="">International Schooling</option>';
	// }else if(schoolId==3){
	// 	html+='<option value="3" extraschooluserid="1266">Education Technologies</option>';
	// }else if(schoolId==4){
	// 	html+='<option value="4" extraschooluserid="4">iAGE Academy</option>';
	// }else if(schoolId==5){
	// 	html+='<option value="5" extraschooluserid="2762">Anchored Education</option>';
	// }else{
		html+='<option value="'+schoolId+'" extraschooluserid="0">'+SCHOOL_NAME+'</option>';
	// }
	return html;
}

function getPaymentTitle(control,schoolId,optionFor, paymentType,eligibleForAdvance){
	var html='';
	if(optionFor=='REGISTRATION_FEE'){
		html+='<option value="REGISTRATION_FEE">Reserve an Enrollment Seat</option>';
	}else{
		if(control=='A' || control=='AE'){
			html+='<option value="SUBJECT_FEE">Student Installment Fee</option>'
				+'<option value="BOOKSESSION_FEE">Teacher Assistance</option>';
				if(eligibleForAdvance=='Y'){
					html+='<option value="REGISTRATION_FEE_ADV">Reserve a Seat for Next Grade</option>';
				}else{
					html+='<option value="REGISTRATION_FEE">Reserve an Enrollment Seat</option>';
				}
				html+='<option value="EVALUATION_TEST">Connect to Impact Program Fee</option>'
				+'<option value="RECURRING_SESSION_FEE">Recurring Session Fee</option>'
				+'<option value="NOTARIZATION_FEE">Notarization Fee</option>'
				+'<option value="ADDITIONAL_COURSE_PAYMENT">Additional Course Fee</option>'
				+'<option value="OTHER_PAYMENT">Other Fee</option>';
		}else{
			if(SCHOOL_ID==4){
				// <option value="REGISTRATION_SUBJECT_FEE">Student Course and Application Fee</option>
				html+='<option value="REGISTRATION_SUBJECT_FEE">Student Course and Application Fee - Annual Plan</option>'
				+'<option value="SUBJECT_FEE">Student Installment Fee</option>'
				+'<option value="RECURRING_SESSION_FEE">Recurring Session Fee</option>';
			}else if(SCHOOL_ID==5){
				html+=
				'<option value="CUSTOMIZED_REGISTRATION_SUBJECT_FEE">Customised Student Enrollment and Course Fee</option>'
				+'<option value="CUSTOMIZED_SUBJECT_FEE">Customised Student Installment Fee</option>'
				+'<option value="REGISTRATION_FEE_ADV">Reserve a Seat for Next Grade</option>'
				+'<option value="REGISTRATION_FEE">Reserve an Enrollment Seat</option>'
				+'<option value="REGISTRATION_SUBJECT_FEE">Student Enrollment and Course Fee - One Time Payment Plan</option>'
				+'<option value="SUBJECT_FEE">Student Installment Fee</option>'
				+'<option value="EVALUATION_TEST">Evaluation Test Fee</option>'
				+'<option value="BOOKSESSION_FEE">Teacher Assistance</option>'
				+'<option value="RECURRING_SESSION_FEE">Recurring Session Fee</option>'
				+'<option value="OTHER_PAYMENT">Other Fee</option>';
			}else{
				html+=
				'<option value="REGISTRATION_SUBJECT_FEE_ADV">Student Enrollment and Course Fee-Advance</option>'
				+'<option value="SUBJECT_FEE_ADV">Student Installment Fee-Advance</option>'
				+'<option value="CUSTOMIZED_REGISTRATION_SUBJECT_FEE">Customised Student Enrollment and Course Fee</option>'
				+'<option value="CUSTOMIZED_SUBJECT_FEE">Customised Student Installment Fee</option>'
				+'<option value="REGISTRATION_SUBJECT_FEE">Student Enrollment and Course Fee - Annually</option>'
				+'<option value="SUBJECT_FEE">Student Installment Fee</option>'
				+'<option value="BOOKSESSION_FEE">Teacher Assistance</option>'
				+'<option value="REGISTRATION_FEE_ADV">Reserve a Seat for Next Grade</option>'
				+'<option value="REGISTRATION_FEE">Reserve an Enrollment Seat</option>'
				+'<option value="EVALUATION_TEST">Connect to Impact Program Fee</option>'
				+'<option value="RECURRING_SESSION_FEE">Recurring Session Fee</option>'
				+'<option value="NOTARIZATION_FEE">Notarization Fee</option>'
				+'<option value="ADDITIONAL_COURSE_PAYMENT">Additional Course Fee</option>'
				+'<option value="OTHER_PAYMENT">Other Fee</option>';
			}
		}
	}
	return html;
}

function getIntallmentNumbre(){
	var html=
	'<option value=""></option>'
	+'<option value="1">1<sup>st</sup></option>'
	+'<option value="2">2<sup>nd</sup></option>'
	+'<option value="3">3<sup>rd</sup></option>'
	+'<option value="4">4<sup>th</sup></option>'
	+'<option value="5">5<sup>th</sup></option>'
	+'<option value="6">6<sup>th</sup></option>'
	+'<option value="7">7<sup>th</sup></option>'
	+'<option value="8">8<sup>th</sup></option>'
	+'<option value="9">9<sup>th</sup></option>'
	+'<option value="10">10<sup>th</sup></option>'
	return html;
}
function getNumberOfMonths(){
	var html=
	'<option value=""></option>'
	+'<option value="1">1 Month</option>'
	+'<option value="2">2 Months</option>'
	+'<option value="3">3 Months</option>'
	+'<option value="4">4 Months</option>'
	+'<option value="5">5 Months</option>'
	+'<option value="6">6 Months</option>'
	+'<option value="7">7 Months</option>'
	+'<option value="8">8 Months</option>'
	+'<option value="9">9 Months</option>'
	+'<option value="10">10 Months</option>';
	return html;
}

function getCurrenciesBySchoolId(schoolId){
	var html='';
	if(schoolId==1){
		html+='<option value="USD">USD</option>'
		+'<option value="SGD">SGD</option>';
	}else if(schoolId==5){
		html+='<option value="ZAR">ZAR</option>';
	}else{
		html+='<option value="USD">USD</option>';
	}
	return html;
}

function getPaymentGatewayItem(schoolId){
	var html='<option value="BLANK">Select Payment Gateway</option>';
	JSON.parse(localStorage.getItem("pg"+schoolId)).forEach((elem) => html+=`<option value=${elem}>${elem}</option>`)
	return html
}

function getPaymentGateway(schoolId){
	if(localStorage.getItem('pg'+schoolId)==null){
		$.ajax({
			type : "GET",
			url : BASE_URL+CONTEXT_PATH+schoolId+'/api/v1/common/pg-getway-master',
			contentType: "application/json",
			dataType: 'json',
			async : false,
			success : function(data) {
				if(data["status"] == "1"){
					localStorage.setItem("pg"+schoolId,JSON.stringify(data["data"]))
				}else{
					showMessage(true, data['message']);
				}
				return getPaymentGatewayItem(schoolId)
			}
		});
	}else{
		return getPaymentGatewayItem(schoolId)
	}
}
function getPaymentStatus(){
	var html=
	'<option value="0" selected>Select Status</option>'
	+'<option value="SCHEDULED">SCHEDULED</option>'
	+'<option value="INITIATED">INITIATED</option>'
	+'<option value="PENDING">PENDING</option>'
	+'<option value="SUCCESS">SUCCESS</option>'
	+'<option value="FAILURE">FAILURE</option>'
	+'<option value="PAID">PAID</option>'
	+'<option value="UNPAID">UNPAID</option>'
	+'<option value="REJECTED">REJECTED</option>';
	return html;
}
function paymentVia(schoolId){
	var html='<option value="3">Credit Card/Debit Card</option>';
	if(schoolId==1 || schoolId==3){
		html+='<option value="1">Wire Transfer</option>'
		+'<option value="2">PayPal Transfer</option>'
		+'<option value="4">Convera</option>';
	}else{

	}
	return html;
}

function getPaymentMode(schoolId){
	var html='';
	if(schoolId==4){
		html+='<option value="customized">Customized Payment Plan</option>'
		+'<option value="annually">Full Time Payment</option>'
		+'<option value="threeMonthly">3 Months Plan</option>'
		+'<option value="fiveMonthly">5 Months Plan</option>';
	}else if(schoolId==5){
		html+='<option value="customized">Customized Payment Plan</option>'
		+'<option value="annually">One Time Payment</option>'
		+'<option value="tenMonthly">10 Monthly Payment</option>'
		+'<option value="twelveMonthly">12 Monthly Payment</option>'
		+'<option value="bookSession">Booked a Session</option>'
		+'<option value="discoveryAddon">Discovery Add-on Session</option>'
		+'<option value="bookSessionAndDiscoveryAddon">Booked a Session And Discovery Add-on</option>';
	}else{
		html+='<option value="customized">Customized Payment Plan</option>'
		+'<option value="annually">One Time Payment</option>'
		+'<option value="threeMonthly">3 Months Installment</option>'
		+'<option value="sixMonthly">6 Months Installment</option>'
		+'<option value="registration">Booked an Enrollment</option>'
		+'<option value="bookSession">Booked a Session</option>'
		+'<option value="discoveryAddon">Discovery Add-on Session</option>'
		+'<option value="bookSessionAndDiscoveryAddon">Booked a Session And Discovery Add-on</option>'
	}
	return html;
}
function getSessionMasterContent(data, allStatus){
	allStatus=allStatus==undefined?false:allStatus;
	var html='';
	if(allStatus){
		html+='<option value="all">ALL</option>';
	}else{
		html+='<option value="0">ALL</option>';
	}
	
	$.each(data, function(k, v) {

		if(allStatus){
			if(v.extra=='Y'){
				html+='<option value="'+v.value+'" selected>'+v.value+'</option>';
			}else{
				html+='<option value="'+v.value+'">'+v.value+'</option>';
			}
		}else{

			var curyear=localStorage.getItem("convertYear");
			if(curyear!='' && curyear!=undefined){
				console.log(curyear);
				var syear = v.value.toString().split("-")[0];
				if(syear>=curyear){
					if(v.extra=='Y'){
						html+='<option value="'+v.key+'" selected>'+v.value+'</option>';
					}else{
						html+='<option value="'+v.key+'">'+v.value+'</option>';
					}
				}else{
					if(v.extra=='Y'){
						html+='<option value="'+v.key+'" selected>'+v.value+'</option>';
					}else{
						html+='<option value="'+v.key+'">'+v.value+'</option>';
					}
				}
			}else{
				if(v.extra=='Y'){
					html+='<option value="'+v.key+'" selected>'+v.value+'</option>';
				}else{
					html+='<option value="'+v.key+'">'+v.value+'</option>';
				}
			}
		}


		
	});
	// html+='<option value="4">2019-2020</option>'
	// +'<option value="5">2020-2021</option>'
	// +'<option value="1">2021-2022</option>'
	// +'<option value="2">2022-2023</option>'
	// +'<option value="3" selected>2023-2024</option>';
	return html;
}
function getUserBasedOnCriteria(key, value, extra, extra1){
	var html = '';
	$.ajax({
	   type : "POST",
	   contentType : "application/json",
	   url : getURLForCommon('masters'),
	   data : JSON.stringify(getRequestForMaster('formId', key, value, extra, extra1)),
	   dataType : 'json',
	   async: false,
	   success : function(data) {
		   if (data['status'] == '0' || data['status'] == '2') {
			   showMessage(true, data['message']);
		   } else {
				$.each(data['mastersData']['data'], function(k, v) {
					html+='<option value="'+v.key+'">'+v.value+'</option>';
				});
			}
	   }
   });
   return html;
}

function getHoursAndMins(ends, duration){
	var html='';
	for(var start=0;start<=ends;){
	  if(start<10){
		html+='<option val="0'+start+'">0'+start+'</option>';
	  }else{
		html+='<option val="'+start+'">'+start+'</option>';
	  }
	  start=start+duration;
	}
	return html;
}

function getHoursAndMinsWithGapDuration(startingHour, startingMinutes, durationGap) {
	var  html = '';
	var timeIntervals = durationGap;
	var startHour = startingHour;
	var startMinutes = startingMinutes;
	for (let i = 0; i < (24 * 60) / timeIntervals; i++) {
		var displayHour = startHour % 12 || 12;
		var minutes = String(startMinutes).padStart(2, '0');
		var period = startHour < 12 ? 'AM' : 'PM';
		var displayTime = `${displayHour}:${minutes} ${period}`;
		// var valueTime = `${String(startHour).padStart(2, '0')}:${minutes}`;
		html += `<option value="${displayTime}">${displayTime}</option>`;
		startMinutes += timeIntervals;
		if (startMinutes >= 60) {
			startMinutes = 0;
			startHour++;
			if (startHour >= 24) {
				startHour = 0;
			}
		}
	}
	return html;
}
function getTeacherAssignedGrade(formId,userId){
	if(userId=='' || userId=='0' || userId=='undefined'){
		return false;
	}
	$('#'+formId+ '#studentName').html('');
	$('#'+formId+ '#meetingSubject').val('');
	$('#'+formId+ '#subjectIds').html('');
	$('#'+formId+ '#meetingDate').val('');
	$('#'+formId+ '#duration').val('50');
	$('#'+formId+ '#startTimeHours').val("").trigger('change');
	$('#'+formId+ '#startTimeMins').val("").trigger('change');
	$('.meetingSlotAdd').hide();
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','TEACHER_ASSIGNED_GRADE_LIST', userId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['standards'];
				if(result.length>0){
					var dropdown = $('#'+formId+ ' #standardId');
					var dropdownTZ = $('#'+formId+ ' #countryTimezoneFromId');
					dropdown.html('');
					dropdownTZ.html('');
					dropdown.append('<option value="">Select Grade</option>');
					var showPTM =result[0].extra2;
					var showCustom =result[0].extra3;
					$.each(result, function(k, v) {
						if(v.key!=null){
							dropdown.append('<option value="' + v.key + '">'+ v.value + ' </option>');
						}
					});
					dropdownTZ.append('<option value="' + result[0].extra1 + '" selected>'+result[0].extra + '</option>');
					
					if(showPTM=="N"){
						$("#meetingFor option[value='PTM']").remove();
					}
					if(showCustom=="N"){
						$("#meetingFor option[value='CUSTOM']").remove();
					}
				}
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}


function getSessionMasterList(formId, elementId, allStatus){
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','SESSIONS-LIST')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['data'];
				var html = getSessionMasterContent(result, allStatus);
				$('#'+formId+' #'+elementId).html(html);
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}

function getGradesByLearningProgram(formId,learningProgram,standardId, parentElement){
	var actualGrades='';
	var learningProgramValue = $('#'+formId+' #'+learningProgram).val();
	if(learningProgramValue=='ONE_TO_ONE_FLEX'){
		actualGrades=['13','14','15','16','17'];
	}else if(learningProgramValue=='BATCH'){
		actualGrades=['KG','1','2','3','4','5','6','7','8','9','10','11','12'];
	}else{
		actualGrades=['KG','1','2','3','4','5','6','7','8','9','10','11','12'];
	}
	var html='<option value="A" >ALL Grade</option>';
	html+=getGrades(getGradesData(actualGrades));
	$('#'+formId+' #'+standardId).html(html);
	if ($('#'+formId+' #'+standardId).hasClass("select2-hidden-accessible")) {
		$('#'+formId+' #'+standardId).select2('destroy');
	}
	$("#"+standardId).select2({
		theme:"bootstrap4",
		dropdownParent: "#"+parentElement
	});
}

function getAllCountryList(formId,elementId){
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','COUNTRIES-LIST')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['countries'];
				if(result.length>0){
					var dropdown = $('#'+formId+' #'+elementId);
					dropdown.html('');
					dropdown.append('<option value="">Select Country</option>');
					$.each(result, function(k, v) {
						dropdown.append('<option custom_country_icon="' + v.extra + '" custom_dial_code="' + v.extra1 + '" value="' + v.key + '">'+ v.value + ' </option>');
					});
				}
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}

function getAllTimezoneList(formId,elementId){
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','TIMEZONE-LIST')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['countryTimeZones'];
				if(result.length>0){
					var dropdown = $('#'+formId+' #'+elementId);
					dropdown.html('');
					dropdown.append('<option value="">Select Timezone</option>');
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.key + '">'+ v.value + ' </option>');
					});
				}
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}

function getValidatedUser(userId){
	var VIEW_ALL_COUNSELORS_PERMISSION = getSettingsByTypeAndKey('CONFIGURATION','VIEW_ALL_COUNSELORS_PERMISSION');
	var viewPermission = JSON.parse(VIEW_ALL_COUNSELORS_PERMISSION)
	var permission = viewPermission.data.metaValue.split(',');
	var forAll =false;
	$.each(permission, function(k,v){
		if(v==userId){
			forAll =true;
		}
	});
	// var forAll = jQuery.inArray(userId+'', permission)==0
	return forAll;
}

function getAllCounselorList(formId,elementId){
	var userId = $('#userId').val();
	if(userId==undefined || userId==null || userId==''){
		userId=USER_ID;
	}
	var forAll = getValidatedUser(USER_ID)
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','COUNSELOR-LIST')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['counselorList'];
				if(result.length>0){
					var dropdown = $('#'+formId+' #'+elementId);
					dropdown.html('');
					dropdown.append('<option value="">Select Counselor</option>');
					$.each(result, function(k, v) {
						if(forAll){
							dropdown.append('<option value="' + v.key + '">'+ v.value + ' </option>');
						}else{
							if(userId==v.key){
								dropdown.html('<option value="' + v.key + '" selected>'+ v.value + ' </option>');
								return false;
							}else{
								dropdown.append('<option value="' + v.key + '">'+ v.value + ' </option>');
							}
						}
					});
				}
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}

function getAllEventList(formId,elementId){
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','EVENTS-LIST',USER_ROLE)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['eventsList'];
				if(result.length>0){
					var dropdown = $('#'+formId+' #'+elementId);
					dropdown.html('');
					dropdown.append('<option value="">Select Event</option>');
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.key + '">'+ v.value + ' </option>');
					});
				}
			}
		},
		error : function(e) {
			console.log(e);
		}
	});

}	

	function getUserRights(schoolId, roleId, userId, moduleId){
	var data={};
          data['schoolId']=schoolId;
          data['roleId']=roleId;
          data['userId']=userId;
          data['moduleId']=moduleId;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('module',''),
		data : JSON.stringify(data),
		dataType : 'json',
		async: false,
		global: false,
		success : function(data) {
			roleAndModule=data
		},
		error : function(e) {
			if (checkonlineOfflineStatus()) {
				return;
			}else{
				showMessage(true, e.responseText);
			}
		}
	});
	return roleAndModule;
}

function callAllStudentList(formId, value, toElementId) {
	hideMessage('');
	var data = {};
	data["searchWord"] = value;
	data["userId"] = USER_ID;
	data["schoolId"] = SCHOOL_ID;
	$.ajax({
	  type: "GET",
	  contentType: "application/json",
	  url: getURLForHTML("dashboard", "get-all-student-list?payload="+encode(JSON.stringify(data))),
	  dataType: "json",
	  cache: false,
	  timeout: 600000,
	  success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
		}
	});
}

function callSlotList(formId, toElementId) {
	hideMessage('');
	var data = {};
	data["userId"] = USER_ID;
	data["schoolId"] = SCHOOL_ID;
	$.ajax({
	  type: "GET",
	  contentType: "application/json",
	  url: getURLForHTML("dashboard", "get-time-preference-slot-list?payload="+encode(JSON.stringify(data))),
	  dataType: "json",
	  cache: false,
	  timeout: 600000,
	  success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				$.each(data.timeAvailableList, function(i, v){
					$("#"+formId+" #"+toElementId).append('<option value="'+v+'">'+v+'</option>')
				});
			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
		}
	});
}

function callStudentSavedTimePreference(formId, toElementId,studentUserId) {
	hideMessage('');
	var data = {};
	data["userId"] = USER_ID;
	data["studentUserId"] = studentUserId;
	data["schoolId"] = SCHOOL_ID;
	$.ajax({
	  type: "GET",
	  contentType: "application/json",
	  url: getURLForHTML("dashboard", "get-student-saved-time-preference?payload="+encode(JSON.stringify(data))),
	  dataType: "json",
	  cache: false,
	  timeout: 600000,
	  success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				console.log(data.studentTimePreferenceList);
				$("#"+formId+" #"+toElementId).html(timePreferenceSlots(data.studentTimePreferenceList));
				
				$("#"+formId+" #gradeName").text(data.gradeName);
				//var learningProgram = data.enrollDetails.split("/")
				//$("#"+formId+" #enrollDetails").text([learningProgram][0]+" | "+learningProgram[1]);
				$("#"+formId+" #enrollDetails").text(data.learningProgram+" | "+data.lmsPlatform);	
				$("#"+formId+" .gradeAndLearningProgram").css({"display":"inline-flex"});
			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
		}
	});
}

function getLeadSourceList(formId,elementId){
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','LEAD-SOURCE-LIST')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['data'];
				if(result.length>0){
					var dropdown = $('#'+formId+' #'+elementId);
					dropdown.html('');
					dropdown.append('<option value="">Select Source</option>');
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.key + '">'+ v.value + ' </option>');
					});
				}
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}


function getHeighestEducation(){
	var object = {};
	object["High School"] = "High School";
	object["Bachelors"] = "Bachelor's";
	object["Masters"] = "Master's";
	object["Doctorate"] = "Doctorate";
	object["Associates"] = "Associate's";
	object["None of the above"] = "None of the above";
	return object
}

function getTotalExpYears() {
	var yearObject = {};
	for (index = 1; index <= 20; index++) {
		yearObject[index] = index;
	}
	return yearObject;
}

function getTotalExpMonths() {
	var monthObject = {}
	for (index = 0; index <= 11; index++) {
		monthObject[index] = index;
	}
	return monthObject;
}


function getFromYears(dateOfBirth) {
    let yearsMap = {};
    let currentYear = new Date().getFullYear();

    if (dateOfBirth != null && dateOfBirth != undefined && dateOfBirth != "") {
        let dobYear = parseInt(dateOfBirth.split("-")[2], 10);
        for (let year = currentYear; year > dobYear; year--) {
            yearsMap[year] = year;
        }
    }
    return yearsMap;
}
const monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthNameListByYear(lastJobToYYYY) {
    let toMonths = [];
    let today = new Date();
    let currentMonthId = today.getMonth() + 1;
    let currentYear = today.getFullYear();
	if(lastJobToYYYY !== null && lastJobToYYYY !== ""){
		if (parseInt(lastJobToYYYY, 10) === currentYear) {
			for (let index = 0; index < currentMonthId; index++) {
				toMonths.push(monthsName[index]);
			}
			return toMonths;
		}else if(parseInt(lastJobToYYYY, 10) > currentYear){
			return toMonths;
		} else {
			return monthsName;
		}
	}else{
		return toMonths;
	}
}

function getMonthsObject(lastJobToYYYY) {
    let months = {};
    let toMonths = getMonthNameListByYear(lastJobToYYYY);
    toMonths.forEach((month, index) => {
        months[index + 1] = month;
    });
    return months;
}

function getLastJobToYears(lastJobFromYYYY) {
    let toYears = [];
    let startYear = new Date().getFullYear();
	if(lastJobFromYYYY != null && lastJobFromYYYY != undefined && lastJobFromYYYY != ""){
		for (let year = startYear; year >= lastJobFromYYYY; year--) {
			toYears.push(year);
		}
	}

    return toYears;
}

function getToYears(lastJobFromYYYY) {
    let yearsMap = {};

    if (lastJobFromYYYY !== null) {
        let toYears = getLastJobToYears(parseInt(lastJobFromYYYY, 10));

        toYears.forEach(year => {
            yearsMap[year] = year;
        });
    }

    return yearsMap;
}

function getRequestForLearningProgramList(key, schoolId){
var request = {};
var requestData = {};
var authentication = {};
authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
authentication['userType'] = 'COMMON';
requestData['requestKey'] = key;
requestData['requestValue'] = schoolId;
request['requestData'] = requestData;
request['authentication'] = authentication;
return request;
}

function updateLearningPrograms(formId, elementId){
	var prefixHtml='<option value="">Select Learning Program</option><option value="ALL">All</option>';
	$('#'+formId+' #'+elementId).html(prefixHtml+$('#'+formId+' #'+elementId).html());
}

function getTggingMasterList(formId, elementId){
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','TAGGING-LIST')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['data'];
				var html = '';
				$.each(result, function(k, v) {
					html+='<option value="'+v.value+'">'+v.value+'</option>';
					
				});
				$('#'+formId+' #'+elementId).html(html);
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}




async function getChatEligibility(userId,schoolId){
	var responseData = await  getDesiredObject('chatavailability'+userId);
	if(typeof responseData =='object'){
		if(!responseData.ntc){
			return responseData;
		}
	}
	var data={};
	data['userId']=userId;
	data['schoolId']=schoolId;
	responseData = await getDataBasedUrlAndPayload('get-chat-eligibility', data);
	localStorage.setItem('chatavailability'+userId,JSON.stringify(responseData));
	return responseData;
}