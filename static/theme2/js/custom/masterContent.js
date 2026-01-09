var grades_KG_12=['KG','1','2','3','4','5','6','7','8','9','10','11','12'];
var grades_1_12=['1','2','3','4','5','6','7','8','9','10','11','12'];
var grades_all=['KG','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','19', '20', '21', '22', '23'];
var grades_KG_10 = ['KG','1','2','3','4','5','6','7','8','9','10'];
var requiredGrades = ['N','KG','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17'];
var languages = [{ code: 'aa', name: 'Afar' },
            { code: 'ab', name: 'Abkhazian' },
            { code: 'ae', name: 'Avestan' },
            { code: 'af', name: 'Afrikaans' },
            { code: 'ak', name: 'Akan' },
            { code: 'am', name: 'Amharic' },
            { code: 'an', name: 'Aragonese' },
            { code: 'ar', name: 'Arabic' },
            { code: 'as', name: 'Assamese' },
            { code: 'av', name: 'Avaric' },
            { code: 'ay', name: 'Aymara' },
            { code: 'az', name: 'Azerbaijani' },
            { code: 'ba', name: 'Bashkir' },
            { code: 'be', name: 'Belarusian' },
            { code: 'bg', name: 'Bulgarian' },
            { code: 'bh', name: 'Bihari' },
            { code: 'bi', name: 'Bislama' },
            { code: 'bm', name: 'Bambara' },
            { code: 'bn', name: 'Bengali' },
            { code: 'bo', name: 'Tibetan' },
            { code: 'br', name: 'Breton' },
            { code: 'bs', name: 'Bosnian' },
            { code: 'ca', name: 'Catalan' },
            { code: 'ce', name: 'Chechen' },
            { code: 'ch', name: 'Chamorro' },
            { code: 'co', name: 'Corsican' },
            { code: 'cr', name: 'Cree' },
            { code: 'cs', name: 'Czech' },
            { code: 'cu', name: 'Church Slavic' },
            { code: 'cv', name: 'Chuvash' },
            { code: 'cy', name: 'Welsh' },
            { code: 'da', name: 'Danish' },
            { code: 'de', name: 'German' },
            { code: 'dv', name: 'Divehi' },
            { code: 'dz', name: 'Dzongkha' },
            { code: 'ee', name: 'Ewe' },
            { code: 'el', name: 'Greek' },
            { code: 'en', name: 'English' },
            { code: 'eo', name: 'Esperanto' },
            { code: 'es', name: 'Spanish' },
            { code: 'et', name: 'Estonian' },
            { code: 'eu', name: 'Basque' },
            { code: 'fa', name: 'Persian' },
            { code: 'ff', name: 'Fulah' },
            { code: 'fi', name: 'Finnish' },
            { code: 'fj', name: 'Fijian' },
            { code: 'fo', name: 'Faroese' },
            { code: 'fr', name: 'French' },
            { code: 'fy', name: 'Western Frisian' },
            { code: 'ga', name: 'Irish' },
            { code: 'gd', name: 'Scottish Gaelic' },
            { code: 'gl', name: 'Galician' },
            { code: 'gn', name: 'Guarani' },
            { code: 'gu', name: 'Gujarati' },
            { code: 'gv', name: 'Manx' },
            { code: 'ha', name: 'Hausa' },
            { code: 'he', name: 'Hebrew' },
            { code: 'hi', name: 'Hindi' },
            { code: 'ho', name: 'Hiri Motu' },
            { code: 'hr', name: 'Croatian' },
            { code: 'ht', name: 'Haitian' },
            { code: 'hu', name: 'Hungarian' },
            { code: 'hy', name: 'Armenian' },
            { code: 'hz', name: 'Herero' },
            { code: 'ia', name: 'Interlingua' },
            { code: 'id', name: 'Indonesian' },
            { code: 'ie', name: 'Interlingue' },
            { code: 'ig', name: 'Igbo' },
            { code: 'ii', name: 'Sichuan Yi' },
            { code: 'ik', name: 'Inupiaq' },
            { code: 'io', name: 'Ido' },
            { code: 'is', name: 'Icelandic' },
            { code: 'it', name: 'Italian' },
            { code: 'iu', name: 'Inuktitut' },
            { code: 'ja', name: 'Japanese' },
            { code: 'jv', name: 'Javanese' },
            { code: 'ka', name: 'Georgian' },
            { code: 'kg', name: 'Kongo' },
            { code: 'ki', name: 'Kikuyu' },
            { code: 'kj', name: 'Kuanyama' },
            { code: 'kk', name: 'Kazakh' },
            { code: 'kl', name: 'Kalaallisut' },
            { code: 'km', name: 'Khmer' },
            { code: 'kn', name: 'Kannada' },
            { code: 'ko', name: 'Korean' },
            { code: 'kr', name: 'Kanuri' },
            { code: 'ks', name: 'Kashmiri' },
            { code: 'ku', name: 'Kurdish' },
            { code: 'kv', name: 'Komi' },
            { code: 'kw', name: 'Cornish' },
            { code: 'ky', name: 'Kyrgyz' },
            { code: 'la', name: 'Latin' },
            { code: 'lb', name: 'Luxembourgish' },
            { code: 'lg', name: 'Ganda' },
            { code: 'li', name: 'Limburgish' },
            { code: 'ln', name: 'Lingala' },
            { code: 'lo', name: 'Lao' },
            { code: 'lt', name: 'Lithuanian' },
            { code: 'lu', name: 'Luba-Katanga' },
            { code: 'lv', name: 'Latvian' },
            { code: 'mg', name: 'Malagasy' },
            { code: 'mh', name: 'Marshallese' },
            { code: 'mi', name: 'Maori' },
            { code: 'mk', name: 'Macedonian' },
            { code: 'ml', name: 'Malayalam' },
            { code: 'mn', name: 'Mongolian' },
            { code: 'mr', name: 'Marathi' },
            { code: 'ms', name: 'Malay' },
            { code: 'mt', name: 'Maltese' },
            { code: 'my', name: 'Burmese' },
            { code: 'na', name: 'Nauru' },
            { code: 'nb', name: 'Norwegian Bokmål' },
            { code: 'nd', name: 'North Ndebele' },
            { code: 'ne', name: 'Nepali' },
            { code: 'ng', name: 'Ndonga' },
            { code: 'nl', name: 'Dutch' },
            { code: 'nn', name: 'Norwegian Nynorsk' },
            { code: 'no', name: 'Norwegian' },
            { code: 'nr', name: 'South Ndebele' },
            { code: 'nv', name: 'Navajo' },
            { code: 'ny', name: 'Chichewa' },
            { code: 'oc', name: 'Occitan' },
            { code: 'oj', name: 'Ojibwa' },
            { code: 'om', name: 'Oromo' },
            { code: 'or', name: 'Oriya' },
            { code: 'os', name: 'Ossetian' },
            { code: 'pa', name: 'Punjabi' },
            { code: 'pi', name: 'Pali' },
            { code: 'pl', name: 'Polish' },
            { code: 'ps', name: 'Pashto' },
            { code: 'pt', name: 'Portuguese' },
            { code: 'qu', name: 'Quechua' },
            { code: 'rm', name: 'Romansh' },
            { code: 'rn', name: 'Rundi' },
            { code: 'ro', name: 'Romanian' },
            { code: 'ru', name: 'Russian' },
            { code: 'rw', name: 'Kinyarwanda' },
            { code: 'sa', name: 'Sanskrit' },
            { code: 'sc', name: 'Sardinian' },
            { code: 'sd', name: 'Sindhi' },
            { code: 'se', name: 'Northern Sami' },
            { code: 'sg', name: 'Sango' },
            { code: 'si', name: 'Sinhala' },
            { code: 'sk', name: 'Slovak' },
            { code: 'sl', name: 'Slovenian' },
            { code: 'sm', name: 'Samoan' },
            { code: 'sn', name: 'Shona' },
            { code: 'so', name: 'Somali' },
            { code: 'sq', name: 'Albanian' },
            { code: 'sr', name: 'Serbian' },
            { code: 'ss', name: 'Swati' },
            { code: 'st', name: 'Southern Sotho' },
            { code: 'su', name: 'Sundanese' },
            { code: 'sv', name: 'Swedish' },
            { code: 'sw', name: 'Swahili' },
            { code: 'ta', name: 'Tamil' },
            { code: 'te', name: 'Telugu' },
            { code: 'tg', name: 'Tajik' },
            { code: 'th', name: 'Thai' },
            { code: 'ti', name: 'Tigrinya' },
            { code: 'tk', name: 'Turkmen' },
            { code: 'tl', name: 'Tagalog' },
            { code: 'tn', name: 'Tswana' },
            { code: 'to', name: 'Tonga' },
            { code: 'tr', name: 'Turkish' },
            { code: 'ts', name: 'Tsonga' },
            { code: 'tt', name: 'Tatar' },
            { code: 'tw', name: 'Twi' },
            { code: 'ty', name: 'Tahitian' },
            { code: 'ug', name: 'Uighur' },
            { code: 'uk', name: 'Ukrainian' },
            { code: 'ur', name: 'Urdu' },
            { code: 'uz', name: 'Uzbek' },
            { code: 've', name: 'Venda' },
            { code: 'vi', name: 'Vietnamese' },
            { code: 'vo', name: 'Volapük' },
            { code: 'wa', name: 'Walloon' },
            { code: 'wo', name: 'Wolof' },
            { code: 'xh', name: 'Xhosa' },
            { code: 'yi', name: 'Yiddish' },
            { code: 'yo', name: 'Yoruba' },
            { code: 'za', name: 'Zhuang' },
            { code: 'zh', name: 'Chinese' },
            { code: 'zu', name: 'Zulu' } ];

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


 
function getAllGrade(schoolId, selectOption, elementId){
    var gradeAll= getGradesData(requiredGrades);
    var gradeOption = getGrades(gradeAll, selectOption);
	if(elementId == undefined){
		elementId = "gradeId";
	}
    $('#'+elementId).append(gradeOption);
}

function getAllGradeWithFormId(schoolId, selectOption, formId, elementId){
    var gradeAll= getGradesData(requiredGrades);
    var gradeOption = getGrades(gradeAll, selectOption);
	if(elementId == undefined){
		elementId = "gradeId";
	}
    $("#"+formId+" #"+elementId).html(gradeOption);
}

function getAllGradeOnSelectId(elementId, selectOption){
    var requiredGrades = ['N','KG','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17'];
    var gradeAll= getGradesData(requiredGrades);
    var gradeOption = getGrades(gradeAll, selectOption);
    $('#'+elementId).html(gradeOption);
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
	// html+='<option value="Other">Other</option>';
	return html;
}

function getBloodGroup(){
	var html='<option value="">Select bloodgroup*</option>'
	html+='<option value="A Positive">A Positive</option>';
	html+='<option value="A Negative">A Negative</option>';
	html+='<option value="B Positive">B Positive</option>';
	html+='<option value="B Negative">B Negative</option>';
	html+='<option value="O Positive">O Positive</option>';
	html+='<option value="O Negative">O Negative</option>';
	html+='<option value="A Positive">A Positive</option>';
	html+='<option value="A Negative">A Negative</option>';
	return html;
}

function getLearningProgramContent(schoolId, requestExtra){
	if(requestExtra==undefined || requestExtra==''){
		requestExtra = 'N';
	}
	var html='';
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForLearningProgramList('LEARNING_PROGRAM_LIST', schoolId, requestExtra)),
		dataType: "json",
		async: false,
		success: function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageBAS('serverError', data['message']);
			} else {
				html = getOptions(data.mastersData.learningPrograms, "")
			}
		}
	});
	return html;
}

function getAllLearningProgramContent(schoolId){
	return getLearningProgramContent(schoolId, 'Y');
}

function getRequestForScholarschipUsers(key, userId){
	var request = {};
	var requestData = {};
	var authentication = {};
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'COMMON';
	requestData['requestKey'] = key;
	requestData['requestValue'] = userId;
	request['requestData'] = requestData;
	request['authentication'] = authentication;
	return request;
}

function getAllScholarschipUsersContent(userId){
	var html='';
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForScholarschipUsers('ALL_SCHOLARSHIP_USER', userId)),
		dataType: "json",
		cache: false,
		timeout: 600000,
		async: false,
		success: function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageBAS('serverError', data['message']);
			} else {
				if(data.mastersData.data.length>1){
					html+='<option value="">Select User</option>';
				}
				html+=getOptions(data.mastersData.data, "");
			}
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
			actualGrades=grades_KG_12;
		}else{
			actualGrades=grades_KG_12;
		}
	}else{
		actualGrades=grades_1_12
	}
	return getGrades(getGradesData(actualGrades));
}
 
function getStandardContent(schoolId,fullGrade,selectOption,gradeFor){
	if(selectOption==undefined){
		selectOption=false;
	}
	var actualGrades='';
	if(schoolId==1 || schoolId==6){
		if(fullGrade){
			actualGrades=grades_all;
		}else{
			if(gradeFor=='cti'){
				actualGrades=grades_KG_10;
			}else{
				actualGrades=grades_KG_12;
			}
		}
	}else{
		actualGrades=grades_1_12
	}
	return getGrades(getGradesData(actualGrades), selectOption);
}

function getLmsPlatformContent(schoolId) {
	var html = '<option value="">Select LMS Platform</option>';

	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster1('LMS-PLATFORM-LIST', schoolId)),
		dataType: 'json',
		async: false,
		success: function (data) {
			if (data.status === '0' || data.status === '2') {
				showMessage(true, data.message);
			} else {
				var result = data.mastersData?.data;
				if (Array.isArray(result) && result.length > 0) {
					result.forEach(function (v) {
						html += `<option value="${v.key}">${v.value}</option>`;
					});
				}
			}
		},
		error: function (e) {
			console.error(e);
		}
	});

	return html;
}

function getCourseContent(key,key1) {
	var html = '<option value="">Select Course</option>';
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster("",'SUBJECT-LIST-BY-GRADE', key,"","",key1)),
		dataType: 'json',
		async: false,
		success: function (data) {
			if (data.status === '0' || data.status === '2') {
				showMessage(true, data.message);
			} else {
				var result = data.mastersData?.subject
				if (Array.isArray(result) && result.length > 0) {
					result.forEach(function (v) {
						html += `<option value="${v.key}">${v.value}</option>`;
					});
				}
			}
		},
		error: function (e) {
			console.error(e);
		}
	});
	return html;
}

function getAllInterviewerList(formId,elementId){
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','INTERVIEWER_LIST',USER_ROLE)),
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
					var dropdown =  $('#'+formId+' #'+elementId);
					dropdown.html('');
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.key + '">'+ v.value + ' </option>');
					});
				}
			}
		}
	});

}	

function getCountryListContent(schoolId) {
	var html = '<option value="">Select Country List</option>';

	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster1('COUNTRIES-LIST', schoolId)),
		dataType: 'json',
		async: false,
		success: function (data) {
			if (data.status === '0' || data.status === '2') {
				showMessage(true, data.message);
			} else {
				var result = data.mastersData?.countries;
				if (Array.isArray(result) && result.length > 0) {
					result.forEach(function (v) {
						html += `<option value="${v.key}">${v.value}</option>`;
					});
				}
			}
		},
		error: function (e) {
			console.error(e);
		}
	});
	return html;
}

function getRequestForMaster1(key, value) {
	var request = {};
	var authentication = {};
	var requestData = {};
	requestData['requestKey'] = key;
	requestData['requestValue'] = value;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'COMMON';
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
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
		contentType : APPLICATION_JSON_VALUE,
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

// function getTimeZones(formId,elementId,elementIdCheck){
// 	$.ajax({
// 		type : "POST",
// 		contentType : APPLICATION_JSON_VALUE,
// 		url : getURLForCommon('masters'),
// 		data : JSON.stringify(getRequestForMaster('formId','TIMEZONE-LIST')),
// 		dataType : 'json',
// 		async : false,
// 		success : function(data) {
// 			if (data['status'] == '0' || data['status'] == '2') {
// 				showMessage(true, data['message']);
// 			} else {
// 				var defaultTZ = $('#'+elementIdCheck).val();
// 				var result = data['mastersData']['countryTimeZones'];
// 				var dropdown = $('#'+formId+' #'+elementId);
// 				dropdown.html('');
// 				$.each(result, function(k, v) {
// 					if(defaultTZ==v.value){
// 						dropdown.append('<option value="' + v.key + '" selected>' + v.value.replaceAll('_',' ') + ' </option>');
// 					}else{
// 						dropdown.append('<option value="' + v.key + '">' + v.value.replaceAll('_',' ') + ' </option>');
// 					}
// 				});
// 			}
// 		}
// 	});
// }

// function getLearningProgramContentFromServer(schoolId) {

//     return new Promise(function(resolve, reject){
//         hideMessage('');
//         const data = {
//             userId: USER_ID,
//             schoolId: schoolId
//         };

//         $.ajax({
//             type: "GET",
//             contentType: "application/json",
//             url: getURLForHTML("dashboard", "get-learning-program-list?payload=" + encode(JSON.stringify(data))),
//             dataType: "json",
//             cache: false,
//             timeout: 600000,
//             success: function (response) {
//                 if (response.status === '0' || response.status === '2') {
//                     showMessage(true, response.message);
//                     reject(response.message); // Rejecting the promise if the status indicates an issue
//                 } else {
//                     let html = '';
//                     $.each(response.lpList, function (i, v) {
//                         html += '<option value="' + v.learningProgram + '">' + v.learningProgramValue + '</option>';
//                     });
//                     resolve(html); // Resolving the promise with the generated HTML
//                 }
//             },
//             error: function (error) {
//                 console.error("Error:", error);
//                 reject(error); // Rejecting the promise in case of an error
//             }
//         });
//     });
// }
function getTimeZones(formId, elementId, elementIdCheck) {
    return new Promise((resolve, reject) => {

        $.ajax({
            type: "POST",
            contentType: APPLICATION_JSON_VALUE,
            url: getURLForCommon('masters'),
            data: JSON.stringify(getRequestForMaster('formId', 'TIMEZONE-LIST')),
            dataType: 'json',

            success: function (data) {
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessage(true, data['message']);
                    reject(data['message']); // reject on failure
                    return;
                }

                try {
                    const defaultTZ = $('#' + elementIdCheck).val();
                    const result = data['mastersData']['countryTimeZones'];
                    const dropdown = $('#' + formId + ' #' + elementId);

                    dropdown.html('');

                    $.each(result, function (k, v) {
                        const opt = `<option value="${v.key}" ${defaultTZ == v.value ? "selected" : ""}>
                            ${v.value.replaceAll('_', ' ')}
                        </option>`;
                        dropdown.append(opt);
                    });

                    resolve(true); // success
                } catch (e) {
                    reject(e);
                }
            },

            error: function (xhr, status, error) {
                reject(error);
            }
        });

    });
}


function getLearningProgramContentFromServer(schoolId,formId,elementId){
	hideMessage('');
	var data = {};
	data["userId"] = USER_ID;
	data["schoolId"] = schoolId;
	$.ajax({
	  type: "GET",
	  contentType: "application/json",
	  url: getURLForHTML("dashboard", "get-learning-program-list?payload="+encode(JSON.stringify(data))),
	  dataType: "json",
	  cache: false,
	  timeout: 600000,
	  success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var dropdown = $('#'+formId+' #'+elementId);
				dropdown.html('');
				dropdown.append('<option value="" data-enrollmentFor="">Select Learning Program</option>');
				$.each(data.lpList, function(i, v){
					dropdown.append('<option value="'+v.learningProgram+'"  data-enrollmentFor="'+v.enrollmentFor+'">'+v.learningProgramValue+'</option>');
				});
			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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
		}
	});
}

function getWaringContent1Theme1(){
	html=
	'<div class="modal fade" id="remarksresetDelete1" tabindex="-1">'
		+'<div class="modal-dialog modal-md modal-notify modal-info" role="document">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header justify-content-center" style="top: 0 !important;width:100% !important;padding: 15px 10px;">'
					+'<p class="heading text-white" id="warningMessage1">Are you sure?</p>'
				+'</div>'
				+'<div id="statusMessage-1" class="modal-body delete-modal withdraw" style="padding-top:12px">'
					+'<i class="fa fa-sync fa-4x text-primary" ></i>'
				+'</div>'
				+'<div class="modal-footer text-center">'
					+'<div class="text-center" style="margin: 0 auto;">'
						+'<button id="resetDeleteErrorWarningYes1" type="button" class="btn" style="color:var(--pc) !important;border:1px solid var(--pc) !important;background:transparent !important">Yes</button>'
						+'<button id="resetDeleteErrorWarningNo1" type="button" class="btn" data-dismiss="modal" style="color:var(--pc) !important;border:1px solid var(--pc) !important;background:transparent !important">No</button>'
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
				+'<div class="modal-header pt-2 pb-2 bg-primary justify-content-center">'
					+'<h5 class="heading text-white text-center" id="warningMessage1">Are you sure?</h5>'
				+'</div>'
				+'<div id="statusMessage-1" class="modal-body delete-modal text-center">'
					+'<i class="fas fa-sync fa-4x text-primary"></i>'
				+'</div>'
				+'<div class="modal-footer">'
					+'<div class="m-auto">'
						+'<button id="resetDeleteErrorWarningYes1" type="button" class="btn btn-outline-primary mr-1">Yes</button>'
						+'<button id="resetDeleteErrorWarningNo1" type="button" class="btn btn-primary mr-1" data-dismiss="modal">No</button>'
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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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
		html+='<option value="'+v.key+'" '+(preSelected==v.key?'selected':'')+' enrollmentFor="'+v.extra+'" courseProviderId="'+v.extra1+'" >'+v.value+'</option>';
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

function getPaymentTitle(formId, control,schoolId,optionFor, paymentType,eligibleForAdvance){
	var html='';
	if(optionFor=='REGISTRATION_FEE'){
		html+=`<option value="${optionFor}">Reserve an Enrollment Seat</option>`;
	}else if(optionFor=='EXTERNAL_PAYMENT') {
		html+=`<option value="${optionFor}">External Payment</option>`;
	} else{
		if(control=='A' || control=='AE'){
			html+='<option value="SUBJECT_FEE">Student Installment Fee</option>'
				+'<option value="BOOKSESSION_FEE">Teacher Assistance</option>';
				if(eligibleForAdvance=='Y'){
					html+='<option value="REGISTRATION_FEE_ADV">Reserve a Seat for '+getNextGrade(formId, "standardId1")+'</option>';
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
				+'<option value="REGISTRATION_FEE_ADV">Reserve a Seat for '+getNextGrade(formId, "standardId1")+'</option>'
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
				+'<option value="REGISTRATION_FEE_ADV">Reserve a Seat for '+getNextGrade(formId, "standardId1")+'</option>'
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
			contentType: APPLICATION_JSON_VALUE,
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
	return html;
}
function getSessionMasterContentAll(data){
	var html='';
	html+='<option value="ALL">ALL</option>';
	$.each(data, function(k, v) {
		html+='<option value="'+v.value+'">'+v.value+'</option>';
	});
	return html;
}
function getUserBasedOnCriteria(key, value, extra, extra1){
	var html = '';
	$.ajax({
	   type : "POST",
	   contentType : APPLICATION_JSON_VALUE,
	   url : getURLForCommon('masters'),
	   data : JSON.stringify(getRequestForMaster('formId', key, value, extra, extra1)),
	   dataType : 'json',
	   async: false,
	   success : function(data) {
		   if (data['status'] == '0' || data['status'] == '2') {
			   showMessage(true, data['message']);
		   } else {
				$.each(data['mastersData']['data'], function(k, v) {
					html+='<option value="'+v.key+'" data-reffcode="'+v.extra+'">'+v.value+'</option>';
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
// function getTeacherAssignedGrade(formId,userId){
// 	if(userId=='' || userId=='0' || userId=='undefined'){
// 		return false;
// 	}
// 	$('#'+formId+ '#studentName').html('');
// 	$('#'+formId+ '#meetingSubject').val('');
// 	$('#'+formId+ '#subjectIds').html('');
// 	$('#'+formId+ '#meetingDate').val('');
// 	$('#'+formId+ '#duration').val('50');
// 	$('#'+formId+ '#startTimeHours').val("").trigger('change');
// 	$('#'+formId+ '#startTimeMins').val("").trigger('change');
// 	$('.meetingSlotAdd').hide();
// 	$.ajax({
// 		type : "POST",
// 		contentType : APPLICATION_JSON_VALUE,
// 		url : getURLForCommon('masters'),
// 		data : JSON.stringify(getRequestForMaster('formId','TEACHER_ASSIGNED_GRADE_LIST', userId)),
// 		dataType : 'json',
// 		cache : false,
// 		timeout : 600000,
// 		async : false,
// 		success : function(data) {
// 			if (data['status'] == '0' || data['status'] == '2') {
// 				showMessage(true, data['message']);
// 			} else {
// 				var result = data['mastersData']['standards'];
// 				if(result.length>0){
// 					var dropdown = $('#'+formId+ ' #standardId');
// 					var dropdownTZ = $('#'+formId+ ' #countryTimezoneFromId');
// 					dropdown.html('');
// 					dropdownTZ.html('');
// 					dropdown.append('<option value="">Select Grade</option>');
// 					var showPTM =result[0].extra2;
// 					var showCustom =result[0].extra3;
// 					$.each(result, function(k, v) {
// 						if(v.key!=null){
// 							dropdown.append('<option value="' + v.key + '">'+ v.value + ' </option>');
// 						}
// 					});
// 					dropdownTZ.append('<option value="' + result[0].extra1 + '" selected>'+result[0].extra + '</option>');
					
// 					if(showPTM=="N"){
// 						$("#meetingFor option[value='PTM']").remove();
// 					}
// 					if(showCustom=="N"){
// 						$("#meetingFor option[value='CUSTOM']").remove();
// 					}
// 				}
// 			}
// 		}
// 	});
// }
function getTeacherAssignedGrade(formId, userId) {
    return new Promise((resolve, reject) => {

        if (userId === '' || userId === '0' || userId === 'undefined') {
            return reject("Invalid userId");
        }

        // Reset form fields
        $('#' + formId + ' #studentName').html('');
        $('#' + formId + ' #meetingSubject').val('');
        $('#' + formId + ' #subjectIds').html('');
        $('#' + formId + ' #meetingDate').val('');
        $('#' + formId + ' #duration').val('50');
        $('#' + formId + ' #startTimeHours').val("").trigger('change');
        $('#' + formId + ' #startTimeMins').val("").trigger('change');
        $('.meetingSlotAdd').hide();

        $.ajax({
            type: "POST",
            contentType: APPLICATION_JSON_VALUE,
            url: getURLForCommon('masters'),
            data: JSON.stringify(getRequestForMaster('formId', 'TEACHER_ASSIGNED_GRADE_LIST', userId)),
            dataType: 'json',
            cache: false,
            timeout: 600000,

            success: function (data) {

                if (data['status'] == '0' || data['status'] == '2') {
                    showMessage(true, data['message']);
                    return reject(data['message']);
                }

                try {
                    const result = data['mastersData']['standards'];

                    if (result.length > 0) {

                        const dropdown = $('#' + formId + ' #standardId');
                        const dropdownTZ = $('#' + formId + ' #countryTimezoneFromId');

                        dropdown.html('');
                        dropdownTZ.html('');

                        dropdown.append('<option value="">Select Grade</option>');

                        const showPTM = result[0].extra2;
                        const showCustom = result[0].extra3;

                        // Grade list
                        $.each(result, function (k, v) {
                            if (v.key != null) {
                                dropdown.append(`<option value="${v.key}">${v.value}</option>`);
                            }
                        });

                        // Timezone
                        dropdownTZ.append(
                            `<option value="${result[0].extra1}" selected>${result[0].extra}</option>`
                        );

                        // Show/hide PTM and Custom
                        if (showPTM === "N") {
                            $("#meetingFor option[value='PTM']").remove();
                        }

                        if (showCustom === "N") {
                            $("#meetingFor option[value='CUSTOM']").remove();
                        }
                    }

                    resolve(true);

                } catch (err) {
                    reject(err);
                }
            },

            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
}



function getSessionMasterList(formId, elementId, allStatus){
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','SESSIONS-LIST')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				var result = data['mastersData']['data'];
				var html = getSessionMasterContent(result, allStatus);
				if(formId!=''){
					$('#'+formId+' #'+elementId).html(html);
				}else{
					$('#'+elementId).html(html);
				}
				
			}
		}
	});
}

function getSchoolSessionMasterList(formId, elementId, schoolId){
	if(schoolId == "ALL" || schoolId == ""){
		schoolId = SCHOOL_ID
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster3('formId','SCHOOL-SESSIONS-LIST', schoolId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['data'];
				var html = getSessionMasterContentAll(result);
				$('#'+formId+' #'+elementId).html(html);
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}

function getRequestForMaster3(formId, key, value) {
	var request = {};
	var authentication = {};
	var requestData = {};
	requestData["formId"] = formId;
	requestData["requestKey"] = key;
	requestData["requestValue"] = value;
	authentication["hash"] = getHash();
	authentication["schoolId"] = SCHOOL_ID;
	authentication["schoolUUID"] = SCHOOL_UUID;
	authentication["userType"] = "COMMON";
	request["authentication"] = authentication;
	request["requestData"] = requestData;
	return request;
  }

function getGradesByLearningProgram(formId,learningProgram,standardId, parentElement){
	var actualGrades='';
	var learningProgramValue = $('#'+formId+' #'+learningProgram).val();
	if(learningProgramValue=='ONE_TO_ONE_FLEX'){
		actualGrades=['13','14','15','16','17'];
	}else if(learningProgramValue=='BATCH'){
		actualGrades=grades_KG_12;
	}else{
		actualGrades=grades_KG_12;
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
		contentType : APPLICATION_JSON_VALUE,
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
		}
	});
}

function getAllTimezoneList(formId,elementId){
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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
		}
	});
}

function getAllAdminCounselorList(formId,elementId){
	var userId = $('#userId').val();
	if(userId==undefined || userId==null || userId==''){
		userId=USER_ID;
	}
	var forAll = getValidatedUser(USER_ID)
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','ADMIN-COUNSELOR-LIST')),
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
					// dropdown.append('<option value="">Select User</option>');
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
		}
	});
}

function getAllEventList(formId,elementId){
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
		}
	});

}	

function getUserRights(schoolId, roleId, userId, moduleId) {
    return new Promise((resolve, reject) => {

        $.ajax({
            type: "POST",
            contentType: APPLICATION_JSON_VALUE,
            url: getURLFor('module', ''),
            data: JSON.stringify({ schoolId, roleId, userId, moduleId }),
            dataType: 'json',
            global: false,

            success: function (response) {
                if (!response || $.isEmptyObject(response)) {
                    reject("Empty response");
                    return;
                }
                resolve(response);
            },

            error: function (e) {
                if (!navigator.onLine) {
                    reject("offline");
                } else {
                    reject(e.responseText || "Server error");
                }
            }
        });
    });
}



function callAllStudentList(formId, value, toElementId) {
	hideMessage('');
	var data = {};
	data["searchWord"] = value;
	data["userId"] = USER_ID;
	data["schoolId"] = SCHOOL_ID;
	$.ajax({
	  type: "GET",
	  contentType: APPLICATION_JSON_VALUE,
	  url: getURLForHTML("dashboard", "get-all-student-list?payload="+encode(JSON.stringify(data))),
	  dataType: "json",
	  cache: false,
	  timeout: 600000,
	  success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
			}
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
	  contentType: APPLICATION_JSON_VALUE,
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
	  contentType: APPLICATION_JSON_VALUE,
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
		}
	});
}

function getLeadSourceList(formId,elementId){
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
var monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

function getRequestForLearningProgramList(key, schoolId, requestExtra){
	var request = {};
	var requestData = {};
	var authentication = {};
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'COMMON';
	requestData['requestKey'] = key;
	requestData['requestValue'] = schoolId;
	requestData['requestExtra'] = requestExtra;
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
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','TAGGING-LIST')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
			} else {
				var result = data['mastersData']['data'];
					var html = '';
					$.each(result, function(k, v) {
						html+='<option value="'+v.value+'" data-shorttag="'+v.extra+'">'+v.value+'</option>';
						
					});
					$('#'+formId+' #'+elementId).html(html);
				
			}
		}
	});
}

function getTggingMasterListPromise(formId) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: "POST",
            contentType: APPLICATION_JSON_VALUE,
            url: getURLForCommon('masters'),
            data: JSON.stringify(getRequestForMaster(formId, 'TAGGING-LIST')),
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function(data) {
                if (data['status'] == '0' || data['status'] == '2') {
                    resolve(''); // no data case
                } else {
                    var result = data['mastersData']['data'];
					//console.log(result)
                    resolve(result); // resolve with raw result
                    
                }
            },
            error: function(xhr, status, error) {
                reject(error); // reject on error
            }
        });
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

function getNextGrade(formId, elementId){
	var selectedOption = $('#'+formId+' #'+elementId+' option:selected');
	var nextOption = selectedOption.next('option');
	if (nextOption.length > 0) {
		return nextOption.text();
	} else {
		return selectedOption.text();
	}
}


function getTimeForDropdownContent(formId, elemntid, intervalValue){
   var $select = $('#'+elemntid);
   var start = 0; // Start time in minutes (0 minutes past midnight)
   var end = 1440; // End time in minutes (1440 minutes in a day)
   var interval = 30;
   if(intervalValue != null && intervalValue != undefined){
	interval = intervalValue;
   }
    // Interval in minutes
	for (var hour = 0; hour < 24; hour++) {
	   for (var minutes = 0; minutes < 60; minutes += interval) {
		   var ampm = hour < 12 ? 'AM' : 'PM';
		   var displayHour = hour % 12;
		   displayHour = displayHour ? displayHour : '00'; // the hour '0' should be '12'
		   var displayMinutes = minutes < 10 ? '0' + minutes : minutes;
		   var timeString = displayHour + ':' + displayMinutes + ' ' + ampm;
		   $select.append($('<option></option>').val(timeString).html(timeString));
	   }
   }
   $select.append('<option value="11:59 PM">11:59 PM</option>');
}

function getLanguages(selectOption){
	var html=''
	if(selectOption){
		html+='<option value="">Select Languages</option>';
	}
	$.each(languages, function(k, v) {
		html+='<option value="'+v.code+'">'+v.name+'</option>';
	});
	return html;
}
function getLanguagesValueByCode(langCode) {
    var existingValues = '';
    if (langCode != undefined && langCode != '') {
        langCode = langCode.split(',');
        var names = [];
        $.each(langCode, function (k, v) {
            $.each(languages, function (k1, v1) {
                if (v === v1.code) {
                    names.push(v1.name);
                }
            });
        });
        existingValues = names.join(', ');
        console.log('Existing values:', existingValues);
    }
    return existingValues;
}


function getCourseProviderNameByIds(id){
	var courseProviderObject = {
		1:"Agilix Buzz",
		2:"Odysseyware",
		31:"Buzz",
		36:"BUZZ",
		37:"BUZZ-GC",
		38:"BUZZ-GR",
		39:"Exact-Path",
		40:"Edmentum-Canvas",
		41:"Courseware"
	}
	return courseProviderObject[id];
}
function getLearningProgramAndCourseProviderMappingBySchoolId(schoolId, defaultOption, defaultOptionValue){
	var html='';
	if(defaultOption){
		if(defaultOptionValue){
			html+=`<option value="${defaultOptionValue}" data-id="${defaultOptionValue}" >${defaultOption}</option>`;
		}else{
			html+=`<option value="" data-id="" >${defaultOption}</option>`;
		}
	}
	if($("#originalPartnerType").val() == "WLP"){
		schoolId = $('#pSchoolId').val();
	}else{
		schoolId = SCHOOL_ID;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestLearningProgramAndCourseProvider('LEARNING_PROGRAM_WITH_COURSE_PROVIDER_ID', schoolId)),
		dataType: "json",
		cache: false,
		timeout: 600000,
		async: false,
		success: function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageBAS('serverError', data['message']);
				return false;
			} else {
				var details = data.mastersData.data;
				$.each(details, function(k, v) {
					html+=`<option value="${v.extra}" data-id="${v.extra2}" >${v.extra1}</option>`;
				});
			}
		},
		error: function(error) {
			console.log("Error:", error);
			return false;
		}
	});
	return html;
}

function getRequestLearningProgramAndCourseProvider(key, schoolId){
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

function callAllStandardList(formId, elementId) {
	resetDropdown($('#'+formId+' #'+elementId), 'Select Grade');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId', 'ALL-STANDARD-LIST', 'gradeList')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['standards'];
				var dropdown = $('#'+formId+' #'+elementId);
				dropdown.html('');
				dropdown.append('<option value="0">Select Grade</option>');
				$.each(result, function(k, v) {
					dropdown.append('<option value="' + v.key + '">' + v.value+ ' </option>');
				});
			}
		}
	});
}

function getPartnerSchools(schoolId) {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: BASE_URL + CONTEXT_PATH + SCHOOL_ID + `/dashboard/get-partner-schools?schoolId=${schoolId}`,
        dataType: 'json',
        success: function (data) {

            if (data.status === '0' || data.status === '2' || data.status === '3') {
                if (data.status === '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, data.message, '', true);
                }
                return;
            }

            const partnerSchools = data.partnerSchoolsList || [];
            const $schoolSelect = $('#schoolName');
            const $partnerSelect = $('#partnerName');

            $schoolSelect.empty();
            $partnerSelect.empty();

            // If only one partner-school mapping exists
            if (partnerSchools.length === 1) {
                const item = partnerSchools[0];

                $schoolSelect
                    .append(`<option value="${item.schoolId}">${item.schoolName}</option>`)
                    .val(item.schoolId)
                    .attr("disabled", true);

                $partnerSelect
                    .append(`<option value="${item.partnerUserId}">${item.partnerName}</option>`)
                    .val(item.partnerUserId);

                $schoolSelect.data('fullList', partnerSchools);
                return;
            }

            // Multiple entries → create unique school dropdown
            $schoolSelect.append(`<option value="">Select School Name</option>`);
            $partnerSelect.append(`<option value="${USER_ID}">${USER_FULL_NAME}</option>`);

            // Store full list for later use (e.g. on change)
            $schoolSelect.data('fullList', partnerSchools);

            // Remove duplicate schoolIds
            const uniqueSchools = {};
            partnerSchools.forEach(item => {
                if (item.schoolId && !uniqueSchools[item.schoolId]) {
                    uniqueSchools[item.schoolId] = item.schoolName;
                }
            });

            // Append unique schools only
            Object.keys(uniqueSchools).forEach(sId => {
                $schoolSelect.append(
                    `<option value="${sId}">${uniqueSchools[sId]}</option>`
                );
            });
        }
    });
}


function getPartnerOnSchoolId(src){
	const selectedSchoolId = $(src).val();
    const partnerSchools = $(src).data('fullList') || [];
    const $partnerSelect = $('#partnerName');

    if (selectedSchoolId) {
        const matched = partnerSchools.filter(item => item.schoolId === selectedSchoolId);
        matched.forEach(item => {
            $partnerSelect.html(`<option value="${item.partnerUserId}">${item.partnerName}</option>`);
        });
    }else{
        $partnerSelect.html(`<option value="ALL">Select Partner Name</option>`);
    }
}




async function getAllCoursesOnBasisOfSchool(){
    var payload = {};
    payload['schoolId'] = SCHOOL_ID;
    var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-signup-subject-details', payload, '/teacher/signup');
    if(responseData && responseData.details.subjectDetails) {
        const allCourses = [
            ...responseData.details.subjectDetails.elementryAllSubject,
            ...responseData.details.subjectDetails.middleAllSubject,
            ...responseData.details.subjectDetails.highAllSubject
        ];
        const uniqueCourses = [...new Set(allCourses)];
        return uniqueCourses;
    }
    return [];
}

function getAllCoursesOptions(elemId){
	let optionsHTML = '';
	getAllCoursesOnBasisOfSchool().then(courses => {
        if (courses && courses.length > 0) {            
            courses.forEach(course => {
                optionsHTML += `<option value="${course}">${course}</option>`;
            });
            const coursesSelect = $('#'+elemId);
            if (coursesSelect.length) {
                coursesSelect.html(optionsHTML);
            }
        }
    }).catch(error => {
        console.error('Error loading courses:', error);
    });
	return optionsHTML;
}


function getPriorityMasterList(formId, elementId){
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','PRIORITY-LIST')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
			} else {
				var result = data['mastersData']['data'];
					var html = '<option value="">Select Priority</option>';
					$.each(result, function(k, v) {
						html+='<option value="'+v.value+'" data-shorttag="'+v.extra+'">'+v.value+'</option>';
						
					});
					$('#'+formId+' #'+elementId).html(html);
				
			}
		}
	});
}

function initializeCountryStateCity(formId, countryId, stateId, cityId){
    if(!countryId){ countryId = "countryId"; }
    if(!stateId){ stateId = "stateId"; }
    if(!cityId){ cityId = "cityId"; }

    getAllCountryList(formId, countryId);

    $("#" + formId + " #" + countryId).on("change", function() {
        if($(this).val()) {
            callStates(formId, this.value, countryId, stateId, cityId);
			$("#" + formId + " #" + cityId).html(`<option value="">Select City*</option>`).prop("disabled", true);
        } else {
            $("#" + formId + " #" + stateId).html(`<option value="">Select State/Province*</option>`).prop("disabled", true);
            $("#" + formId + " #" + cityId).html(`<option value="">Select City*</option>`).prop("disabled", true);

            if($("#"+formId+" #"+cityId).data('select2')) {
                $("#"+formId+" #"+cityId).select2("destroy").select2({ theme:"bootstrap4" });
            }
        }

        if($("#"+formId+" #"+stateId).data('select2')) {
            $("#"+formId+" #"+stateId).select2("destroy").select2({ theme:"bootstrap4" });
        }
    });

    $("#" + formId + " #" + stateId).on("change", function() {
        if($(this).val()) {
            callCities(formId, this.value, stateId, cityId);
        } else {
            $("#" + formId + " #" + cityId).html(`<option value="">Select City*</option>`).prop("disabled", true);
        }

        if($("#"+formId+" #"+cityId).data('select2')) {
            $("#"+formId+" #"+cityId).select2("destroy").select2({ theme:"bootstrap4" });
        }
    });
    $("#" + formId + " #" + countryId).select2({ theme:"bootstrap4" });
    $("#" + formId + " #" + stateId).select2({ theme:"bootstrap4" });
    $("#" + formId + " #" + cityId).select2({ theme:"bootstrap4" });
}

function getAllNationalityList(formId,elementId){
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
						dropdown.append('<option custom_country_icon="' + v.extra + '" custom_dial_code="' + v.extra1 + '" value="' + v.key + '">'+ v.extra2 + ' </option>');
					});
				}
			}
		}
	});
}

function deleteWarning(warningMessage, callbackFunction) {
	var html =
		'<div class="modal fade fade-scale mt-3" id="remarksresetDelete2" tabindex="-1" aria-hidden="true" >'
			+'<div class="modal-dialog modal-sm" role="document">'
				+'<div class="modal-content shadow-lg">'
					+'<div class="modal-header pt-2 pb-2 bg-primary justify-content-center">'
						+'<h5 class="heading text-white text-center" id="warningMessage2">' + warningMessage + '</h5>'
					+'</div>'
					+'<div id="statusMessage-2" class="modal-body delete-modal text-center">'
						+'<i class="fas fa-sync fa-4x text-primary"></i>'
					+'</div>'
					+'<div class="modal-footer">'
						+'<div class="m-auto">'
							+'<button id="resetDeleteErrorWarningYes2" type="button" class="btn btn-outline-primary mr-2" onclick="' + callbackFunction + '">Yes</button>'
							+'<button id="resetDeleteErrorWarningNo2" type="button" class="btn btn-primary mr-1" data-dismiss="modal">No</button>'
							+'<button id="resetDeleteErrorWarningCancel2" type="button" class="btn btn-success mr-1" data-dismiss="modal" style="display: none;">Close</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}

function initializeIntelInput(formId, eleId, itiInstances, flagCode, saveType,avalWhtsAppStatusID, index){
	if(formId == ""){
		var phoneNumber = document.querySelector("#"+eleId);
	}else{
		var phoneNumber = document.querySelector("#"+formId+" #"+eleId);
	}
    // var phoneNumber = document.querySelector("#"+formId+" #"+eleId);
    // if (phoneNumber.intlTelInputInstance) {
    //     phoneNumber.intlTelInputInstance.destroy();
    //     phoneNumber.removeAttribute('data-intlTelInput-initialized');
    // }
    var itiInstances = window.intlTelInput(phoneNumber, {
        separateDialCode: true,
		utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.17/js/utils.js"
    });
    if(flagCode == null || flagCode == undefined || flagCode == ""){
        itiInstances.setCountry("US");
    }else{
        itiInstances.setCountry(flagCode);   
    }
	$("#"+eleId).attr("data-countryCode", itiInstances.getSelectedCountryData().iso2);
	$("#"+eleId).attr("data-ISD-Code",itiInstances.getSelectedCountryData().dialCode);
    phoneNumber.addEventListener('countrychange', function(e) {
		if(saveType == "selfSave"){
			phoneNumberDailCodeChange(phoneNumber.intlTelInputInstance.a.id,flagCode,phoneNumber.intlTelInputInstance.j, avalWhtsAppStatusID, index)
		}
        $("#"+eleId).attr("data-countryCode", itiInstances.getSelectedCountryData().iso2);
        $("#"+eleId).attr("data-ISD-Code",itiInstances.getSelectedCountryData().dialCode);
    });
    phoneNumber.intlTelInputInstance = itiInstances;
    //phoneNumber.setAttribute('data-intlTelInput-initialized', 'true');
}

function validatePhoneNumber(eleId) {
    var phoneNumber = document.getElementById(eleId);
    if (phoneNumber && phoneNumber.intlTelInputInstance) {
        var iti = phoneNumber.intlTelInputInstance;
        if (iti.isValidNumber()) {
            return {
                valid: true,
                number: iti.getNumber(),
                dialCode: iti.getSelectedCountryData().dialCode,
                countryCode: iti.getSelectedCountryData().iso2
            };
        } else {
            return {
                valid: false,
                message: "Invalid phone number"
            };
        }
    } else {
        return {
            valid: false,
            message: "IntlTelInput instance not found"
        };
    }
}

function parseTimeToMinutes(timeStr) {
	var [time, modifier] = timeStr.trim().split(' ');
	var [hours, minutes] = time.split(':').map(Number);
	if (modifier.toUpperCase() === 'PM' && hours !== 12) {
		hours += 12;
	} else if (modifier.toUpperCase() === 'AM' && hours === 12) {
		hours = 0;
	}
	return hours * 60 + minutes;
}

function formatMinutesTo12Hour(mins) {
	var hours = Math.floor(mins / 60);
	var minutes = mins % 60;
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	if (hours === 0) hours = 12;
	return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function generateTimeDropdown(startTime, endTime, gapMinutes) {
    var start = parseTimeToMinutes(startTime);
    var end = parseTimeToMinutes(endTime);
    var html = `<option value="">Select Time*</option>`;

    while (start < end) {
        var timeStr = formatMinutesTo12Hour(start);
        html += `<option value="${timeStr}">${timeStr}</option>`;
        start += gapMinutes;
    }

    if (start === end) {
        var timeStr = formatMinutesTo12Hour(end);
        html += `<option value="${timeStr}">${timeStr}</option>`;
    } else if (start > end && (end - (start - gapMinutes)) > 0) {
        var timeStr = formatMinutesTo12Hour(end);
        html += `<option value="${timeStr}">${timeStr}</option>`;
    }
	return html;
}