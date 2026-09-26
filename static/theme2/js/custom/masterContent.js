var grades_KG_12=['KG','1','2','3','4','5','6','7','8','9','10','11','12'];
var grades_1_12=['1','2','3','4','5','6','7','8','9','10','11','12'];
var grades_all=['KG','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','19', '20', '21', '22', '23'];
var grades_KG_10 = ['KG','1','2','3','4','5','6','7','8','9','10'];
var requiredGrades = ['N','KG','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17'];
var SCHOOL_POPOVER_TIMER;
var SCHOOL_DIARY_INITIATES_ROLE = false;
var SHOW_ONLY_RELEASE_NOTE = false;
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

var SCHOOL_STANDARD_GRADE_MASTER = [
	{"key":"11","value":"Grade K","orderBy":"1"},
	{"key":"12","value":"Grade 1","orderBy":"2"},
	{"key":"13","value":"Grade 2","orderBy":"3"},
	{"key":"14","value":"Grade 3","orderBy":"4"},
	{"key":"15","value":"Grade 4","orderBy":"5"},
	{"key":"16","value":"Grade 5","orderBy":"6"},
	{"key":"1","value":"Grade 6","orderBy":"7"},
	{"key":"2","value":"Grade 7","orderBy":"8"},
	{"key":"3","value":"Grade 8","orderBy":"9"},
	{"key":"4","value":"Grade 9","orderBy":"10"},
	{"key":"5","value":"Grade 10","orderBy":"11"},
	{"key":"6","value":"Grade 11","orderBy":"12"},
	{"key":"7","value":"Grade 12","orderBy":"13"},
	{"key":"19","value":"Flexy - Elementary School","orderBy":"14"},
	{"key":"9","value":"Flexy - Middle School","orderBy":"15"},
	{"key":"10","value":"Flexy - High School","orderBy":"16"},
	{"key":"20","value":"Flexy - Credit Recovery","orderBy":"17"},
	{"key":"21","value":"Flexy - Advanced Placement","orderBy":"18"}
];
function formatDropdownDisplayLabel(label){
	if(label === undefined || label === null){
		return '';
	}
	return String(label)
		.trim()
		.toLowerCase()
		.replace(/[_-]+/g, ' ')
		.replace(/\s+/g, ' ')
		.replace(/\b\w/g, function (char) {
			return char.toUpperCase();
		});
}
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
	html+='<option value="MALE">Male</option>';
	html+='<option value="FEMALE">Female</option>';
	// html+='<option value="TRANSGENDER">TRANSGENDER</option>';
	html+='<option value="DONOTWANTTOSPECIFY">Do Not Want To Specify</option>';
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
	if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummySubjectOptionsByGrade === "function") {
		var dummySubjects = getDummySubjectOptionsByGrade(key);
		$.each(dummySubjects, function (i, v) {
			html += `<option value="${v.key}">${v.value}</option>`;
		});
		return html;
	}
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
	var html='<option value=" ">Select Account Type</option>'
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
					$('#'+formId+' #'+elementId).html(html).trigger("change");
				}else{
					$('#'+elementId).html(html).trigger("change");
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
					dropdown.append('<option value="">Select Academic Counselor</option>');
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
            timeout: 30000,

            success: function (response) {
                if (!response || $.isEmptyObject(response)) {
                    reject({ status: 200, reason: 'empty', message: 'Empty response' });
                    return;
                }
                resolve(response);
            },

            // Reject with a structured object so callers can tell apart an aborted /
            // interrupted request (status 0) from a real server error, instead of
            // collapsing everything into the string "Server error".
            error: function (xhr, textStatus) {
                if (!navigator.onLine) {
                    reject({ status: 0, reason: 'offline', message: 'offline' });
                    return;
                }
                reject({
                    status: xhr.status || 0,                 // 0 = aborted / network / CORS
                    reason: textStatus,                      // 'abort' | 'timeout' | 'parsererror' | 'error'
                    message: xhr.responseText || textStatus || 'Server error'
                });
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
				if (data.learningProgram != null && data.lmsPlatform != null) {
					$("#"+formId+" #enrollDetails").text(data.learningProgram+" | "+data.lmsPlatform);
				}
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
            $("#" + formId + " #" + stateId).html(`<option value="">Select Province/State*</option>`).prop("disabled", true);
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

// URL for the intl-tel-input utils.js (v16-compatible). Once loaded, the library
// can compute the exact valid length for EVERY country via getExampleNumber(),
// so we no longer depend on the small built-in map below.
var INTL_TEL_UTILS_SCRIPT_URL = "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.1.0/js/utils.js";
var INTL_TEL_UTILS_LOADING = false;
var INTL_TEL_UTILS_CALLBACKS = [];

// Loads intl-tel-input utils.js once (if not already present) and invokes the
// callback when ready. This makes country-specific length work for ALL countries
// on every page, even those that don't include utils.js in their JSP.
function ensureIntlUtilsLoaded(callback) {
	// Already available.
	if (window.intlTelInputUtils && typeof intlTelInputUtils.getExampleNumber === "function") {
		if (typeof callback === "function") { callback(); }
		return;
	}
	if (typeof callback === "function") {
		INTL_TEL_UTILS_CALLBACKS.push(callback);
	}
	if (INTL_TEL_UTILS_LOADING) {
		return;
	}
	INTL_TEL_UTILS_LOADING = true;

	var runCallbacks = function () {
		INTL_TEL_UTILS_LOADING = false;
		var cbs = INTL_TEL_UTILS_CALLBACKS.slice();
		INTL_TEL_UTILS_CALLBACKS = [];
		for (var i = 0; i < cbs.length; i++) {
			try { cbs[i](); } catch (e) {}
		}
	};

	try {
		var script = document.createElement("script");
		script.src = INTL_TEL_UTILS_SCRIPT_URL;
		script.async = true;
		script.onload = runCallbacks;
		script.onerror = function () {
			// Loading failed (offline/CDN blocked); fall back to the built-in map.
			runCallbacks();
		};
		document.head.appendChild(script);
	} catch (e) {
		runCallbacks();
	}
}

// Built-in national-number length map (iso2 -> expected mobile digit count).
// FALLBACK ONLY — used if utils.js fails to load (offline/blocked CDN). When
// utils.js is available, getExpectedPhoneDigitCount uses it for ALL countries.
var PHONE_NATIONAL_DIGIT_MAP = {
	in: 10, // India
	sg: 8,  // Singapore
	us: 10, ca: 10, // North America
	gb: 10, // UK (mobile)
	ae: 9,  // UAE
	sa: 9,  // Saudi Arabia
	qa: 8,  // Qatar
	kw: 8,  // Kuwait
	bh: 8,  // Bahrain
	om: 8,  // Oman
	au: 9,  // Australia
	nz: 9,  // New Zealand (mobile, 8-10; use 9 as common)
	pk: 10, // Pakistan
	bd: 10, // Bangladesh
	lk: 9,  // Sri Lanka
	np: 10, // Nepal
	my: 9,  // Malaysia (mobile 9-10)
	id: 11, // Indonesia (varies 9-12)
	ph: 10, // Philippines
	th: 9,  // Thailand
	cn: 11, // China
	hk: 8,  // Hong Kong
	jp: 10, // Japan
	kr: 10, // South Korea
	za: 9,  // South Africa
	ng: 10, // Nigeria
	ke: 9,  // Kenya
	eg: 10, // Egypt
	de: 11, // Germany (varies)
	fr: 9,  // France
	it: 10, // Italy
	es: 9,  // Spain
	nl: 9,  // Netherlands
	ru: 10, // Russia
	br: 11, // Brazil
	mx: 10  // Mexico
};

// Reads the expected national digit count for the currently selected country.
// Order of preference:
//   1) intl-tel-input utils.js example number (most accurate, when loaded)
//   2) built-in PHONE_NATIONAL_DIGIT_MAP (works without utils.js)
// Returns 0 only when the country is unknown to both sources.
function getExpectedPhoneDigitCount(iti) {
	try {
		var countryData = itiGetCountry(iti);
		if (!countryData || !countryData.iso2) {
			return 0;
		}
		var iso2 = countryData.iso2.toLowerCase();

		// 1) Try utils.js example number when available.
		if (window.intlTelInputUtils && typeof intlTelInputUtils.getExampleNumber === "function") {
			var numberType = (intlTelInputUtils.numberType && intlTelInputUtils.numberType.MOBILE != null)
				? intlTelInputUtils.numberType.MOBILE
				: 1;
			var exampleNumber = intlTelInputUtils.getExampleNumber(iso2, false, numberType);
			if (exampleNumber) {
				var nationalDigits = exampleNumber.replace(/\D/g, "");
				var dialCode = (countryData.dialCode || "").replace(/\D/g, "");
				if (dialCode && nationalDigits.indexOf(dialCode) === 0) {
					nationalDigits = nationalDigits.substring(dialCode.length);
				}
				if (nationalDigits.length > 0) {
					return nationalDigits.length;
				}
			}
		}

		// 2) Fallback to the built-in map (works even without utils.js).
		if (PHONE_NATIONAL_DIGIT_MAP[iso2]) {
			return PHONE_NATIONAL_DIGIT_MAP[iso2];
		}

		return 0;
	} catch (e) {
		return 0;
	}
}

// libphonenumber validationError codes (as exposed by intl-tel-input utils.js):
//   IS_POSSIBLE = 0, INVALID_COUNTRY_CODE = 1, TOO_SHORT = 2, TOO_LONG = 3, NOT_A_NUMBER = 4
// Returns the MAXIMUM number of national significant digits the selected country
// accepts, derived purely from libphonenumber possible-length metadata.
//
// How it works: we ask libphonenumber (via intl-tel-input utils.js) for the
// country's example MOBILE number, take its national significant number (NSN)
// digits, and strip any leading national/trunk prefix "0". That NSN length is
// the country's maximum input length. This is metadata-driven (no hardcoded
// country list) and never counts the country dial code (+91, +65, ...).
// Examples: India -> 10, Singapore -> 8, US -> 10, UK -> 10, UAE -> 9.
// Default maxlength used for phone inputs when country-wise validation is
// turned OFF via the PHONE_NUMBER_VALIDATION setting.
var PHONE_VALIDATION_DISABLED_MAXLENGTH = 15;

// Setting toggle: CONFIGURATION / PHONE_NUMBER_VALIDATION.
//  - 'true'  (default) => keep all country-wise length checks & validations.
//  - 'false'           => bypass ALL phone checks/validations; maxlength = 15.
var __phoneValidationEnabled = null;
function isPhoneValidationEnabled() {
	if (__phoneValidationEnabled !== null) {
		return __phoneValidationEnabled;
	}
	// Default to enabled if the setting is missing or can't be read.
	var enabled = true;
	try {
		if (typeof getSettingsByTypeAndKey === "function") {
			var setting = getSettingsByTypeAndKey('CONFIGURATION', 'PHONE_NUMBER_VALIDATION');
			var metaValue = JSON.parse(setting).data.metaValue;
			// Only an explicit 'false' disables validation; anything else keeps it on.
			enabled = String(metaValue).trim().toLowerCase() !== "false";
		}
	} catch (e) {
		enabled = true;
	}
	__phoneValidationEnabled = enabled;
	return __phoneValidationEnabled;
}

function getMaxValidPhoneDigitCount(iti) {
	try {
		var countryData = itiGetCountry(iti);
		if (!countryData || !countryData.iso2) {
			return 0;
		}
		var iso2 = countryData.iso2;

		if (window.intlTelInputUtils && typeof intlTelInputUtils.getExampleNumber === "function") {
			// The example number is a real, valid national number. Its NSN length
			// is the country's valid length. IMPORTANT: many countries' example
			// numbers include a leading national/trunk prefix "0" (e.g. India
			// "08123456789", Germany "015123456789") which is NOT part of the
			// national significant number. We strip that leading 0 so the length
			// is correct (India -> 10, not 11).
			var mobileType = (intlTelInputUtils.numberType && intlTelInputUtils.numberType.MOBILE != null) ? intlTelInputUtils.numberType.MOBILE : 1;
			var ex = intlTelInputUtils.getExampleNumber(iso2, true, mobileType); // nationalMode
			var exDigits = (ex || "").replace(/\D/g, "");

			// Strip a single leading trunk-prefix 0 (national significant numbers
			// don't start with 0).
			if (exDigits.length > 1 && exDigits.charAt(0) === "0") {
				exDigits = exDigits.substring(1);
			}

			if (exDigits.length > 0) {
				// The example number's NSN length is the reliable maximum. We do
				// NOT probe with getValidationError for longer lengths because that
				// API is length-only and too lenient (it reports many over-length
				// values as "possible", e.g. India 11-13), which caused overshoot.
				// getExampleNumber already returns the representative valid number
				// for the country, so its NSN length is the correct cap.
				return exDigits.length;
			}
		}

		// Fallback: example-number length / built-in map (utils.js not loaded).
		return getExpectedPhoneDigitCount(iti);
	} catch (e) {
		return getExpectedPhoneDigitCount(iti);
	}
}

// True when the given national-digit count is within the country's max length.
function isPhoneDigitCountWithinMax(iti, digitCount) {
	if (digitCount < 1) { return true; }
	var max = getMaxValidPhoneDigitCount(iti);
	return max < 1 || digitCount <= max;
}

// Detects whether the given intl-tel-input instance renders the dial code
// separately (separateDialCode:true). Uses the DOM structure so it works
// regardless of the minified property name across library versions.
function isSeparateDialCodeInput(inputEl, iti) {
	try {
		if (iti && iti.d && typeof iti.d.separateDialCode !== "undefined") {
			return !!iti.d.separateDialCode;
		}
	} catch (e) {}
	// DOM fallback: separateDialCode adds an element with this class.
	if (inputEl) {
		var container = inputEl.closest ? inputEl.closest(".iti") : null;
		if (container && container.querySelector(".iti__selected-dial-code")) {
			return true;
		}
	}
	return false;
}

// One global capture-phase listener that records which country the user picked
// Makes the country dropdown the SINGLE source of truth for the selected country.
//
// intl-tel-input v16 automatically re-derives the flag from the typed number on
// every keyup via its internal _v() ("update flag from number"). For shared
// calling codes (e.g. +1: US/CA/JM/BS/...), this auto-detection would switch the
// dropdown based on the NANP area code the user typed — overriding a country the
// user deliberately selected (e.g. selecting Canada then typing a US area code
// would flip it to USA).
//
// Per requirement, we DISABLE that automatic country-from-number detection: the
// selected country only ever changes when the user picks it in the dropdown (or
// via setCountry). We neutralise _v() so it never changes the country and never
// broadcasts a spurious countrychange. Length validation still runs against the
// currently selected country, showing the existing error when invalid.
function disableAutoCountryDetection(iti) {
	if (!iti || iti.__autoDetectDisabled || typeof iti._v !== "function") {
		return;
	}
	iti.__autoDetectDisabled = true;
	// Replace _v with a no-op that never re-selects a country from the number.
	// Returning false tells the library's keyup handler NOT to fire countrychange.
	iti._v = function () { return false; };
}

// ---------------------------------------------------------------------------
// Version-agnostic intl-tel-input adapters + reusable initializer
//
// The app runs TWO intl-tel-input versions depending on the page:
//   - v29 (new): window.intlTelInputV29 (signup) or window.intlTelInput (pages
//     using the common header). API: setSelectedCountry(iso2) /
//     getSelectedCountry() -> { iso2, dialCode, name }.
//   - v16 (old): window.intlTelInput (dashboard pages). API: setCountry(iso2) /
//     getSelectedCountryData() -> { iso2, dialCode, name }.
// These adapters let all shared code work on EITHER version without caring
// which one produced the instance.
// ---------------------------------------------------------------------------

// Return the selected country object { iso2, dialCode, name } for any instance,
// using whichever getter the library version exposes. Returns null if unknown.
function itiGetCountry(iti) {
	if (!iti) { return null; }
	try {
		if (typeof iti.getSelectedCountryData === "function") { // v16
			return iti.getSelectedCountryData();
		}
		if (typeof iti.getSelectedCountry === "function") { // v29
			return iti.getSelectedCountry();
		}
	} catch (e) {}
	return null;
}

// Set the selected country (iso2) for any instance, using whichever setter the
// library version exposes.
function itiSetCountry(iti, iso2) {
	if (!iti || !iso2) { return; }
	try {
		if (typeof iti.setCountry === "function") { // v16
			iti.setCountry(iso2);
		} else if (typeof iti.setSelectedCountry === "function") { // v29
			iti.setSelectedCountry(iso2);
		}
	} catch (e) {}
}

// The intl-tel-input constructor to use: prefer the isolated v29 global when a
// page has loaded it (signup), otherwise fall back to the page's window global
// (which is v29 on common-header pages, v16 on dashboard pages).
function getIntlTelInputCtor() {
	if (typeof window.intlTelInputV29 === "function") {
		return window.intlTelInputV29;
	}
	if (typeof window.intlTelInput === "function") {
		return window.intlTelInput;
	}
	return null;
}

// Version-agnostic replacement for window.intlTelInputGlobals.getInstance(el).
// v16 exposes it on window.intlTelInputGlobals; v29 exposes it as a static
// method on the constructor (intlTelInput.getInstance). Also falls back to the
// instance we cache on the DOM element (phoneNumber.intlTelInputInstance).
function itiGetInstance(inputEl) {
	if (!inputEl) { return null; }
	try {
		var ctor = getIntlTelInputCtor();
		if (ctor && typeof ctor.getInstance === "function") { // v29 static
			return ctor.getInstance(inputEl);
		}
		if (window.intlTelInputGlobals && typeof window.intlTelInputGlobals.getInstance === "function") { // v16
			return window.intlTelInputGlobals.getInstance(inputEl);
		}
	} catch (e) {}
	return inputEl.intlTelInputInstance || null;
}

// Strict, version-agnostic "is this number valid for the selected country?"
// check. Uses PRECISE validation when available (v29 isValidNumberPrecise),
// which enforces the country's real number pattern (e.g. Singapore must start
// with 3/6/8/9) — not just the length. Falls back to isValidNumber (v16 / when
// precise is unavailable). Returns true/false, or null if no validator exists.
// Canadian NANP (+1) area codes. libphonenumber treats the whole +1 plan as one
// region, so it reports a Canadian number (e.g. area code 416 = Toronto) as
// "valid" even when the selected country is USA. We use this set to reject a
// number whose area code belongs to the OTHER +1 country than the one selected.
// Source: standard Canadian numbering plan area codes.
var NANP_CANADA_AREA_CODES = {
	"204":1,"226":1,"236":1,"249":1,"250":1,"263":1,"289":1,"306":1,"343":1,"354":1,
	"365":1,"367":1,"368":1,"382":1,"403":1,"416":1,"418":1,"431":1,"437":1,"438":1,
	"450":1,"468":1,"474":1,"506":1,"514":1,"519":1,"548":1,"579":1,"581":1,"584":1,
	"587":1,"600":1,"604":1,"613":1,"639":1,"647":1,"672":1,"683":1,"705":1,"709":1,
	"742":1,"753":1,"778":1,"780":1,"782":1,"807":1,"819":1,"825":1,"867":1,"873":1,
	"879":1,"902":1,"905":1
};

// For a +1 (NANP) selected country, returns false when the typed area code
// clearly belongs to the OTHER country (US number under CA, or CA number under
// US). Returns true otherwise (leave the decision to libphonenumber). Only
// applies to us/ca; other +1 territories keep default behaviour.
function nanpAreaCodeMatchesSelected(iti) {
	try {
		var cc = itiGetCountry(iti) || {};
		var iso2 = (cc.iso2 || "").toLowerCase();
		var dial = (cc.dialCode || "").replace(/\D/g, "");
		if (dial !== "1" || (iso2 !== "us" && iso2 !== "ca")) {
			return true; // not a US/CA case
		}
		var digits = "";
		if (typeof iti.getNumber === "function") {
			digits = (iti.getNumber() || "").replace(/\D/g, "");
			// getNumber returns E.164 (+1XXXXXXXXXX) -> strip leading country code.
			if (digits.charAt(0) === "1" && digits.length > 10) { digits = digits.substring(1); }
		}
		if (digits.length < 3) { return true; } // not enough to judge yet
		var area = digits.substring(0, 3);
		var isCanadaArea = !!NANP_CANADA_AREA_CODES[area];
		if (iso2 === "us" && isCanadaArea) { return false; } // CA number under US
		if (iso2 === "ca" && !isCanadaArea) { return false; } // US/other number under CA
		return true;
	} catch (e) {
		return true;
	}
}

function itiIsValidNumber(iti) {
	if (!iti) { return null; }
	try {
		var base = null;
		if (typeof iti.isValidNumberPrecise === "function") { // v29 strict
			base = iti.isValidNumberPrecise();
		} else if (typeof iti.isValidNumber === "function") { // v16 / fallback
			base = iti.isValidNumber();
		}
		// Extra NANP guard: libphonenumber passes a Canadian number under a US
		// selection (and vice-versa) because +1 is shared. Reject when the area
		// code doesn't match the selected US/CA country.
		if (base === true && !nanpAreaCodeMatchesSelected(iti)) {
			return false;
		}
		return base;
	} catch (e) {}
	return null;
}

// True when libphonenumber utils (needed for isValidNumber pattern validation)
// are available. v16 exposes them as window.intlTelInputUtils; v29 bundles them
// on the constructor as intlTelInput.utils (the WithUtils build loads them
// synchronously). Either being present means isValidNumber()/getValidationError()
// will do real country-pattern validation, not just length.
function itiUtilsAvailable() {
	if (window.intlTelInputUtils) { return true; }
	try {
		var ctor = getIntlTelInputCtor();
		if (ctor && ctor.utils) { return true; }
	} catch (e) {}
	return false;
}

// Version-agnostic replacement for window.intlTelInputGlobals.getCountryData().
// Returns the array of { name, iso2, dialCode } for all countries.
function itiGetCountryList() {
	try {
		var ctor = getIntlTelInputCtor();
		// v29 (the "WithUtils" bundle actually in use here) exposes the list as
		// the static getAllCountries() — getCountryData() does not exist on it
		// (confirmed against the vendor bundle: Object.keys(intlTelInput) has no
		// "getCountryData"). Without this, itiGetCountryList() always silently
		// returned [], which broke matchCountryByDialCode() for every caller.
		if (ctor && typeof ctor.getAllCountries === "function") { // v29 static
			return ctor.getAllCountries();
		}
		if (ctor && typeof ctor.getCountryData === "function") { // older v29 builds
			return ctor.getCountryData();
		}
		if (window.intlTelInputGlobals && typeof window.intlTelInputGlobals.getCountryData === "function") { // v16
			return window.intlTelInputGlobals.getCountryData();
		}
	} catch (e) {}
	return [];
}

// Given a digits-only international number (e.g. "918533990022"), find the
// country whose dial code the number starts with. Prefers the LONGEST matching
// dial code (so "+1..." US vs "+1868..." Trinidad resolve correctly, and
// 3-digit codes like "998" win over shorter partial matches). Returns the
// country object { name, iso2, dialCode } or null.
function matchCountryByDialCode(digitsAll) {
	try {
		digitsAll = (digitsAll || "").replace(/\D/g, "");
		if (!digitsAll) { return null; }
		var list = itiGetCountryList() || [];
		var best = null;
		var bestLen = 0;
		for (var i = 0; i < list.length; i++) {
			var dc = (list[i].dialCode || "").replace(/\D/g, "");
			if (dc && digitsAll.indexOf(dc) === 0 && dc.length > bestLen) {
				best = list[i];
				bestLen = dc.length;
			}
		}
		return best;
	} catch (e) {}
	return null;
}

// Reusable phone-input initializer that applies the SAME configuration we use on
// signup everywhere: searchable country dropdown, dial code hidden (national
// mode), no format-as-you-type, and the country-wise length limiter/validation.
//
// This is the ONE function every page should call to init a phone field.
//
// Params:
//   inputElOrId : the <input> DOM element, or its id string.
//   opts (all optional):
//     initialCountry   : iso2 to preselect (default "us"; ignored if empty).
//     allowedNumberTypes: array for v29 validation (e.g. ["MOBILE"]). Omit to
//                         keep the library default.
//     onCountryChange  : function(country, iti) called on init AND whenever the
//                         user changes the country. Use it to sync hidden
//                         fields (country iso2 / dial code) per page.
//     containerClass   : extra class for the injected wrapper (default
//                         "iti-v29" so the v29 theme CSS applies).
//
// Returns the iti instance (or null if the input/constructor is missing).
function initPhoneInputV29(inputElOrId, opts) {
	opts = opts || {};
	var inputEl = (typeof inputElOrId === "string")
		? document.getElementById(inputElOrId)
		: inputElOrId;
	if (!inputEl) { return null; }

	var ctor = getIntlTelInputCtor();
	if (!ctor) { return null; }

	// Guard against double initialization (e.g. re-init after a country/state
	// change, or a page that inits then calls a location helper that inits
	// again). Destroy the previous instance and unwrap the stray .iti container
	// so we never stack wrappers / show duplicate flags.
	try {
		if (inputEl.intlTelInputInstance) {
			try { inputEl.intlTelInputInstance.destroy(); } catch (e) {}
			inputEl.intlTelInputInstance = null;
		}
		var $prevWrap = $(inputEl).closest(".iti");
		if ($prevWrap.length > 0) {
			$prevWrap.find(".iti__flag-container, .iti__country-container").remove();
			$(inputEl).unwrap();
		}
	} catch (e) {}

	// Remove any stale maxlength/data-max-digits from a previous init BEFORE the
	// library reads the value. A prefilled "+<dialCode> <national>" string
	// (e.g. "+91 8533990022") would otherwise be clipped by an old country-based
	// maxlength (e.g. 10 -> "+91 85339") before we normalize it to national
	// digits. attachPhoneLengthLimit re-applies the correct maxlength afterward.
	try {
		inputEl.removeAttribute("maxlength");
		inputEl.removeAttribute("data-max-digits");
	} catch (e) {}
var validationEnabled = (typeof opts.isValidationEnabledFn === "function")
		? !!opts.isValidationEnabledFn()
		: isPhoneValidationEnabled();

	var options = {
		classNames: { container: opts.containerClass || "iti-v29" },
		// National mode: hide the dial code next to the flag (v29 default true).
		separateDialCode: false,
		// Keep v29 in NATIONAL mode. With separateDialCode:false this stops v29
		// from re-detecting/auto-switching the country from the typed number
		// (e.g. Canada flipping to US when a US-style area code is typed). The
		// selected country only changes when the user picks it in the dropdown.
		numberDisplayFormat: "NATIONAL",
		// Do not auto-format the number as the user types.
		formatAsYouType: false,
		// IMPORTANT: strictMode is OFF. v29's strictMode strips a leading "0"
		// (national trunk prefix) as you type, which made valid numbers lose
		// their leading zero and behaved inconsistently between fields. We do our
		// OWN length capping in attachPhoneLengthLimit (digits-only + country max)
		// and validate correctness with isValidNumberPrecise at save, so the
		// user's leading 0 is preserved and phone/alt-phone behave identically.
		strictMode: false,
		// Load libphonenumber utils so per-country FORMAT validation works
		// (e.g. Singapore must start with 3/6/8/9) and getExampleNumber() gives
		// the exact maxlength per country.
		utilsScript: INTL_TEL_UTILS_SCRIPT_URL
	};
	if (validationEnabled && opts.allowedNumberTypes) {
		options.allowedNumberTypes = opts.allowedNumberTypes;
	}
	// countrySearch defaults to true in v29, so the dropdown is searchable
	// automatically; passing it explicitly is harmless and documents intent.
	options.countrySearch = true;

	var iti = ctor(inputEl, options);

	// v16 backward-compatibility shims: lots of existing page code calls
	// iti.setCountry(...) and iti.getSelectedCountryData() directly on the
	// instance (outside init, e.g. in country-dropdown change handlers). v29
	// renamed these to setSelectedCountry()/getSelectedCountry(). To avoid
	// touching every call site, we add the old method names onto the v29
	// instance so both APIs work. (No-ops if the methods already exist.)
	if (iti && typeof iti.setCountry !== "function" && typeof iti.setSelectedCountry === "function") {
		iti.setCountry = function (iso2) { return iti.setSelectedCountry(iso2); };
	}
	if (iti && typeof iti.getSelectedCountryData !== "function" && typeof iti.getSelectedCountry === "function") {
		iti.getSelectedCountryData = function () { return iti.getSelectedCountry(); };
	}

	// Preselect a country (default US) unless caller passes an empty string.
	var initial = (typeof opts.initialCountry === "undefined") ? "us" : opts.initialCountry;

	// Decide the country + normalize the prefilled value.
	// If the prefilled value has an EXPLICIT "+<dialCode>" prefix, that number's
	// own dial code is authoritative (a saved "+91 8533990022" IS an India number
	// even if the caller passes UZ as initialCountry). Otherwise the passed
	// initialCountry is the source of truth. Fixes the "country resets on re-edit"
	// regression AND the "+91 shown under UZ" mismatch.
	(function selectCountryAndNormalize() {
		try {
			var raw = (inputEl.value || "").trim();
			if (raw.charAt(0) === "+") {
				var digitsAll = raw.replace(/\D/g, "");
				var detected = itiGetCountry(iti) || {};
				var detDial = (detected.dialCode || "").replace(/\D/g, "");
				if (!detDial || digitsAll.indexOf(detDial) !== 0) {
					var best = matchCountryByDialCode(digitsAll);
					if (best) {
						itiSetCountry(iti, best.iso2);
						detected = itiGetCountry(iti) || best;
						detDial = (detected.dialCode || "").replace(/\D/g, "");
					}
				}
				var national = digitsAll;
				if (detDial && digitsAll.indexOf(detDial) === 0 && digitsAll.length > detDial.length) {
					national = digitsAll.substring(detDial.length);
				}
				if (inputEl.value !== national) {
					inputEl.value = national;
				}
			} else {
				if (initial) {
					itiSetCountry(iti, initial);
				}
				var digitsOnly = raw.replace(/\D/g, "");
				if (raw && inputEl.value !== digitsOnly) {
					inputEl.value = digitsOnly;
				}
			}
		} catch (e) {}
	})();

	// Country-wise length limiting + digit-only enforcement (version-agnostic;
	// no-ops the parts that don't apply to v29's own strictMode).
	attachPhoneLengthLimit(inputEl, iti, opts.isValidationEnabledFn);

	// Fire the caller's sync callback now (initial state) and on every change.
	if (typeof opts.onCountryChange === "function") {
		var fireSync = function () {
			opts.onCountryChange(itiGetCountry(iti), iti);
		};
		fireSync();
		inputEl.addEventListener("countrychange", fireSync);
	}

	// Cache the instance on the DOM element so the double-init guard (above) and
	// page code (e.g. checkPhoneNumberLength lookups) can find it.
	try { inputEl.intlTelInputInstance = iti; } catch (e) {}

	return iti;
}

// Generic, reusable length limiter for ANY intl-tel-input instance, regardless
// of how it was initialized (works on the DOM element directly, no id needed).
// Handles: initial maxlength, re-apply after utils.js loads, live trimming of
// extra digits, recomputation on country change, and disabling the library's
// automatic country-from-number detection so the dropdown selection is the sole
// source of truth (no auto-switching between +1 countries).
// Usage (one line at any init site): attachPhoneLengthLimit(inputEl, iti);
// Optional 3rd arg isEnabledOverrideFn: a caller-supplied function used in place
// of the global isPhoneValidationEnabled() check (e.g. Lead List's own
// isLeadPhoneValidationEnabled, independent of PHONE_NUMBER_VALIDATION). Omit it
// to keep the existing global-flag behavior unchanged.
function attachPhoneLengthLimit(inputEl, iti, isEnabledOverrideFn) {
	if (!inputEl || !iti) {
		return;
	}
	var $input = $(inputEl);
	var validationEnabled = (typeof isEnabledOverrideFn === "function")
		? !!isEnabledOverrideFn()
		: isPhoneValidationEnabled();

	// Validation disabled via setting: no country-wise length logic. Just set a
	// fixed default maxlength (15) and skip all normalize/cap/auto-detect logic.
	if (!validationEnabled) {
		$input.removeAttr("data-max-digits");
		$input.attr("maxlength", PHONE_VALIDATION_DISABLED_MAXLENGTH);
		return;
	}

	// The dropdown selection is the single source of truth for the country.
	// Disable intl-tel-input's automatic country-from-number detection so a
	// manually selected +1 country (e.g. Canada) is never auto-switched to
	// another +1 country (e.g. USA) based on the typed NANP area code.
	disableAutoCountryDetection(iti);

	// Snapshot the digit count that was ALREADY in the field when this limiter
	// was first attached (i.e. the prefilled server value). This is the ONLY
	// value we ever allow to exceed the country max — a legacy number that was
	// saved with the country code inline (e.g. India "918533990022"). It is
	// captured once so later re-applies (utils.js load, 800ms safety net,
	// countrychange) never re-loosen the limit based on what the user has typed.
	var initialDigitLen = (($input.val() || "").replace(/\D/g, "")).length;
	// This "grace" length only stays in effect while the field still holds that
	// original over-length value. Once the user edits it down to within the max,
	// the grace is dropped and the country max becomes a hard cap.
	var graceActive = true;

	// Force the input to contain ONLY digits (no spaces, dashes, brackets, etc.).
	// Any formatting the library or server value may have added (e.g.
	// "416-555-0123") is stripped to digits. Length is capped to the country max
	// UNLESS the legacy grace (see above) is still active for a prefilled value.
	var normalizeToDigits = function () {
		var maxDigits = parseInt($input.attr("data-max-digits"), 10);
		var digitsOnly = ($input.val() || "").replace(/\D/g, "");
		// Effective cap: country max, or the larger initial length while the
		// legacy prefilled value is still present.
		var cap = maxDigits;
		if (graceActive && initialDigitLen > cap) {
			cap = initialDigitLen;
		}
		if (!isNaN(cap) && cap > 0 && digitsOnly.length > cap) {
			digitsOnly = digitsOnly.substring(0, cap);
		}
		if ($input.val() !== digitsOnly) {
			$input.val(digitsOnly);
		}
	};

	var applyLimit = function () {
		// MAX VALID length for the country (supports multiple valid lengths, e.g.
		// a country valid at 8 and 10 digits gets a cap of 10). Metadata-driven.
		var maxDigitCount = getMaxValidPhoneDigitCount(iti);
		var separateDialCode = isSeparateDialCodeInput(inputEl, iti);
		if (maxDigitCount > 0) {
			$input.attr("data-max-digits", maxDigitCount);
			$input.attr("data-separate-dial", separateDialCode ? "1" : "0");
			// maxlength = country max, but loosened to the ORIGINAL prefilled
			// length while that legacy over-length value is still present. Using
			// the snapshot (not the live value) prevents the browser from either
			// truncating a prefilled value on load OR letting the user type past
			// the max once they start editing.
			var attrMax = maxDigitCount;
			if (graceActive && initialDigitLen > attrMax) {
				attrMax = initialDigitLen;
			}
			$input.attr("maxlength", attrMax);
		} else {
			$input.removeAttr("data-max-digits");
			$input.attr("maxlength", Math.max(20, graceActive ? initialDigitLen : 0));
		}
		// Strip formatting characters and enforce the effective cap.
		normalizeToDigits();
	};

	// Apply immediately (built-in map covers common countries right away).
	applyLimit();
	// Ensure utils.js is loaded so EVERY country gets its exact length, then
	// re-apply. Also re-apply after a short delay as a safety net.
	ensureIntlUtilsLoaded(applyLimit);
	setTimeout(applyLimit, 800);

	// Live: keep the input digits-only on every keystroke/paste and enforce the
	// effective cap. As soon as the value drops to within the country max, the
	// legacy grace is dropped so the user can never re-expand beyond the max.
	$input.off("input.phoneLimit").on("input.phoneLimit", function () {
		if (graceActive) {
			var maxDigits = parseInt($input.attr("data-max-digits"), 10);
			var len = (($input.val() || "").replace(/\D/g, "")).length;
			if (!isNaN(maxDigits) && maxDigits > 0 && len <= maxDigits) {
				// User has edited the legacy value down to a valid length: tighten.
				graceActive = false;
				$input.attr("maxlength", maxDigits);
			}
		}
		normalizeToDigits();
	});

	// Remove any 'countrychange' listeners a PREVIOUS call of this function left on
	// this same inputEl. Some callers (e.g. the "Complete Your Profile" modal)
	// re-initialize the same persistent <input> twice (render + 'shown.bs.modal'),
	// and native addEventListener has no dedup: without this, the stale listener
	// from the first init stays bound alongside the new one. On a real country
	// pick both fire; the stale one reads its closed-over (now destroyed) `iti`
	// instance, clears inputEl.__userPickedCountry before the new listener sees
	// it, and the new listener then "reverts" the flag back — so a selected
	// country visually never sticks.
	if (inputEl.__phoneLimitApplyLimit) {
		inputEl.removeEventListener("countrychange", inputEl.__phoneLimitApplyLimit);
	}
	if (inputEl.__phoneLimitCountryChangeHandler) {
		inputEl.removeEventListener("countrychange", inputEl.__phoneLimitCountryChangeHandler);
	}

	// Recompute the allowed length whenever the user changes the country.
	inputEl.addEventListener("countrychange", applyLimit);
	inputEl.__phoneLimitApplyLimit = applyLimit;

	// --- Keep the user's selected country; block v29's auto-switch on typing ---
	//
	// v29 re-detects the country from the typed number and, for shared dial codes
	// (e.g. +1: US / CA / JM ...), silently switches the flag as the user types an
	// area code. We must keep whatever country the user picked. v29's detection
	// lives in private (#) methods we can't override, so we correct it reactively
	// on the 'countrychange' event:
	//   - USER pick (dropdown click / Enter in search): accept as the new locked
	//     country AND clear the number (number typed for one country must not carry
	//     over to another).
	//   - PROGRAMMATIC set (prefill / address->phone sync via setCountry): accept
	//     as the new lock, do NOT clear.
	//   - v29 AUTO-SWITCH while typing: revert to the locked country, do NOT clear.
	// The revert fires only at the moment of a switch (not every keystroke), and
	// restores the same national digits, so typing stays smooth.
	var getIso = function () {
		var cc = itiGetCountry(iti) || {};
		return (cc.iso2 || "").toLowerCase();
	};
	inputEl.__lockedCountry = getIso();

	// Detect a genuine user pick from the dropdown.
	try {
		var $limitWrap = $(inputEl).closest(".iti");
		$limitWrap.off("mousedown.lockPick touchstart.lockPick keydown.lockPick")
			.on("mousedown.lockPick touchstart.lockPick", ".iti__country, .iti__country-list li, .iti__dropdown-content .iti__country", function () {
				inputEl.__userPickedCountry = true;
			})
			.on("keydown.lockPick", ".iti__search-input", function (e) {
				if (e.which === 13) { inputEl.__userPickedCountry = true; }
			});
	} catch (e) {}

	// Wrap setSelectedCountry/setCountry ONCE so every programmatic set updates the
	// lock (and is flagged, so the revert logic below never fights it).
	if (iti && typeof iti.setSelectedCountry === "function" && !iti.__lockSetterWrapped) {
		iti.__lockSetterWrapped = true;
		var _origSet = iti.setSelectedCountry.bind(iti);
		iti.setSelectedCountry = function (iso2) {
			iti.__programmaticSet = true;
			var r = _origSet(iso2);
			inputEl.__lockedCountry = (iso2 || "").toString().toLowerCase();
			iti.__programmaticSet = false;
			return r;
		};
		iti.setCountry = function (iso2) { return iti.setSelectedCountry(iso2); };
	}

	var onLockedCountryChange = function () {
		if (iti.__revertingCountry) { return; } // ignore our own revert's event

		if (inputEl.__userPickedCountry) {
			// Genuine user pick: accept + clear the number.
			inputEl.__lockedCountry = getIso();
			inputEl.__userPickedCountry = false;
			$(inputEl).val('');
			return;
		}
		if (iti.__programmaticSet) {
			// Prefill / sync: accept, keep the value.
			inputEl.__lockedCountry = getIso();
			return;
		}
		// v29 auto-switched from the typed number: revert to the locked country.
		// IMPORTANT: setSelectedCountry() can re-parse/reformat the value and drop
		// trailing digits (e.g. typing a Toronto area code "416..." on USA made
		// v29 briefly switch to Canada; reverting then trimmed "4165550123" ->
		// "416555"). So we SNAPSHOT the raw digits before the revert and RESTORE
		// them (capped to the country max) right after, preserving the caret at the
		// end. This keeps both the flag AND the full typed number intact.
		var current = getIso();
		var locked = (inputEl.__lockedCountry || "").toLowerCase();
		if (locked && current && current !== locked) {
			var _digitsBefore = ($(inputEl).val() || "").replace(/\D/g, "");
			try {
				iti.__revertingCountry = true;
				if (typeof iti.setSelectedCountry === "function") {
					iti.setSelectedCountry(locked);
				}
			} catch (e) {} finally {
				iti.__revertingCountry = false;
			}
			// Restore the digits the user had typed (they belong to the locked
			// country now). Re-apply the country length cap so nothing over-length
			// sneaks in, then place the caret at the end.
			try {
				var _maxAfter = getMaxValidPhoneDigitCount(iti);
				var _restore = _digitsBefore;
				if (_maxAfter > 0 && _restore.length > _maxAfter) {
					_restore = _restore.substring(0, _maxAfter);
				}
				if (($(inputEl).val() || "").replace(/\D/g, "") !== _restore) {
					$(inputEl).val(_restore);
				}
				if (typeof inputEl.setSelectionRange === "function") {
					var _end = (inputEl.value || "").length;
					inputEl.setSelectionRange(_end, _end);
				}
			} catch (e) {}
		}
	};
	inputEl.addEventListener("countrychange", onLockedCountryChange);
	inputEl.__phoneLimitCountryChangeHandler = onLockedCountryChange;
}

// Opt-in helper: clears a phone input's value whenever the user picks a
// different country from the intl-tel-input dropdown (iti__country-container),
// so a number typed for one country is never silently kept under another.
// Registered AFTER init (call this right after initPhoneInputV29/getInputIntel),
// so the library's own initial/programmatic country selection during init never
// triggers it — only a genuine subsequent user-driven country change does.
// NOT used by attachPhoneLengthLimit's own countrychange handling above, which
// intentionally preserves the number and re-validates length at save time
// instead (e.g. the profile-edit popup, so an already-saved/verified number is
// never wiped out by an accidental flag change).
function clearContactNumberOnCountryChange(inputEl) {
	// No-op retained for backward compatibility. Clearing the number on a genuine
	// user-driven country pick (and NOT on programmatic set / v29 auto-switch) is
	// now handled centrally inside attachPhoneLengthLimit, which runs for every
	// phone field. Duplicating it here would double-clear / double-bind listeners.
	return;
}

// Pure (no-UI) phone length check for ANY intl-tel-input instance.
// Does NOT show any message — returns a result object so each page/form can
// display errors using its own messaging system.
// Returns:
//   { valid: true }                                  -> ok (or optional & empty)
//   { valid: false, reason: 'empty' }                -> mandatory & empty
//   { valid: false, reason: 'length', expectedDigits, enteredDigits, countryName }
//   { valid: false, reason: 'invalid' }              -> unknown-length & lib says invalid
function checkPhoneNumberLength(inputEl, iti, isMandatory) {
	if (!inputEl || !iti) {
		return { valid: true };
	}
	// Validation disabled via setting: bypass all checks.
	if (!isPhoneValidationEnabled()) {
		return { valid: true };
	}
	var rawValue = ($(inputEl).val() || "").trim();
	if (rawValue === "") {
		return isMandatory ? { valid: false, reason: 'empty' } : { valid: true };
	}
	var countryData = itiGetCountry(iti);
	var countryName = (countryData && countryData.name) ? countryData.name : "the selected country";
	var maxDigits = getMaxValidPhoneDigitCount(iti);

	// The field is in national mode (the dial code is shown separately via the
	// flag), so the user should enter ONLY the national number. We therefore
	// count ALL digits actually typed in the box as the national number and do
	// NOT auto-strip a leading dial code. This is important: a value like India
	// "918533990033" (12 digits) must be flagged as too long even though
	// libphonenumber's isValidNumber() would "rescue" it by treating the leading
	// "91" as the country code and validating the remaining 10 digits.
	var enteredDigits = rawValue.replace(/\D/g, "");

	// HARD LENGTH CAP FIRST: if more digits than the country's max were entered,
	// it's invalid regardless of what isValidNumber() reports. This runs before
	// isValidNumber() so the dial-code-prefix rescue can't hide an over-length
	// number.
	if (maxDigits > 0 && enteredDigits.length > maxDigits) {
		return { valid: false, reason: 'length', expectedDigits: maxDigits, enteredDigits: enteredDigits.length, countryName: countryName };
	}

	// When libphonenumber metadata is available, use full validation so that
	// countries with MULTIPLE valid lengths are handled correctly (any valid
	// length passes; only invalid/too-short is rejected). This also validates the
	// number PATTERN (e.g. Singapore must start with 3/6/8/9), not just length.
	// Over-length was already rejected above.
	if (itiUtilsAvailable()) {
		var validRes = itiIsValidNumber(iti);
		if (validRes === true) {
			return { valid: true };
		}
		if (validRes === false) {
			return { valid: false, reason: 'invalid', expectedDigits: maxDigits, enteredDigits: enteredDigits.length, countryName: countryName };
		}
	}

	// Fallback (utils not loaded / no validator): length was already checked above.
	return { valid: true };
}

// Reusable validation for ANY intl-tel-input instance using the DOM element.
// Mirrors validatePhoneNumberField but does not depend on a unique id.
// Returns true when valid (or optional & empty); shows the message otherwise.
function validatePhoneNumberElement(inputEl, iti, isMandatory) {
	var result = checkPhoneNumberLength(inputEl, iti, isMandatory);
	if (result.valid) {
		return true;
	}
	if (result.reason === 'empty') {
		showMessageTheme2(0, ' Either field value is invalid or empty.', '', false);
	} else if (result.reason === 'length') {
		showMessageTheme2(0, "Phone number for " + result.countryName + " can be at most " + result.expectedDigits + " digits.", '', false);
	} else {
		showMessageTheme2(0, "Please enter a valid phone number for " + result.countryName + ".", '', false);
	}
	return false;
}

function initializeIntelInput(formId, eleId, itiInstances, flagCode, saveType,avalWhtsAppStatusID, index){
	if(formId == ""){
		var phoneNumber = document.querySelector("#"+eleId);
	}else{
		var phoneNumber = document.querySelector("#"+formId+" #"+eleId);
	}
	var placeholderValue = "xxx-xxx-xxxx";
	// Never let the library format the number (no dashes/spaces/brackets). The
	// input must contain ONLY digits so it fits within the digit-based maxlength
	// (e.g. Canada "4165550123", not "416-555-0123" which would get truncated).
	var formatOnDisplay = false;
	if(formId == "meetingBookSlotForm" && eleId == "phoneNo"){
		placeholderValue = "";
	}
    if (!phoneNumber) {
        return;
    }
    // Guard against double initialization. If intl-tel-input is initialized twice
    // on the same input it wraps the input again, producing a duplicate
    // .iti__flag-container (two flags/dial codes). This happens for the profile
    // modal because getInputIntel() runs both on render and again on
    // 'shown.bs.modal'. Destroy any existing instance (and clean up a stray .iti
    // wrapper) before re-initializing so there is always exactly one flag.
    if (phoneNumber.intlTelInputInstance) {
        try {
            phoneNumber.intlTelInputInstance.destroy();
        } catch (e) { /* instance already gone */ }
        phoneNumber.intlTelInputInstance = null;
        phoneNumber.removeAttribute('data-intlTelInput-initialized');
    }
    // destroy() does NOT remove the custom 'countrychange' listener we add below.
    // Remove any stale one first, otherwise on re-init setCountry() fires
    // 'countrychange' and the old closure (which read the now-null instance) throws.
    if (phoneNumber.itiCountryChangeHandler) {
        phoneNumber.removeEventListener('countrychange', phoneNumber.itiCountryChangeHandler);
        phoneNumber.itiCountryChangeHandler = null;
    }
    var $existingItiWrapper = $(phoneNumber).closest(".iti");
    if ($existingItiWrapper.length > 0) {
        // Unwrap the input from a leftover .iti container so we don't stack
        // wrappers. Remove the injected country UI (v16 .iti__flag-container OR
        // v29 .iti__country-container) so no duplicate flag remains.
        $existingItiWrapper.find(".iti__flag-container, .iti__country-container").remove();
        $(phoneNumber).unwrap();
    }
    // Remove any stale maxlength/data-max-digits from a previous init BEFORE the
    // library reads the value, so a prefilled "+<dialCode> <national>" string
    // (e.g. "+91 8533990022") is not clipped by an old country-based maxlength
    // (10 -> "+91 85339") before normalization. attachPhoneLengthLimit re-applies
    // the correct maxlength afterward.
    try {
        phoneNumber.removeAttribute("maxlength");
        phoneNumber.removeAttribute("data-max-digits");
    } catch (e) {}
    // Version-agnostic init options. On v29 (new) these apply natively; on v16
    // (old) the unknown ones (countrySearch/classNames/formatAsYouType) are
    // ignored. We hide the separate dial code (national mode), make the dropdown
    // searchable (v29), and never auto-format the number.
    var _validationEnabled = isPhoneValidationEnabled();
    var itiOptions = {
        classNames: { container: "iti-v29" },
        separateDialCode: false,
        // Keep v29 in NATIONAL mode so it never auto-switches the country from the
        // typed number (e.g. Canada -> US on a US-style area code). Country changes
        // only when the user picks it from the dropdown.
        numberDisplayFormat: "NATIONAL",
        countrySearch: true,
        autoPlaceholder: "off",
        formatOnDisplay: formatOnDisplay,
        formatAsYouType: false,
        // strictMode is OFF: v29's strictMode strips a leading "0" (trunk prefix)
        // as you type, which broke valid numbers. We do our own digits-only +
        // country-max length capping in attachPhoneLengthLimit and validate with
        // isValidNumberPrecise at save, so the leading 0 is preserved.
        strictMode: false,
        utilsScript: INTL_TEL_UTILS_SCRIPT_URL
    };
    if (formId == "requestProfileForm") {
        itiOptions.dropdownContainer = document.body;
    }
    var ctor = getIntlTelInputCtor();
    var itiInstances = ctor ? ctor(phoneNumber, itiOptions) : null;
    if (!itiInstances) { return; }
    // v16 backward-compatibility shims: page code (e.g. TimeAvailabilityBook.jsp)
    // calls .setCountry()/.getSelectedCountryData() directly on this instance.
    // v29 renamed these to setSelectedCountry()/getSelectedCountry(); add the old
    // names so both APIs work on a v29 instance.
    if (typeof itiInstances.setCountry !== "function" && typeof itiInstances.setSelectedCountry === "function") {
        itiInstances.setCountry = function (iso2) { return itiInstances.setSelectedCountry(iso2); };
    }
    if (typeof itiInstances.getSelectedCountryData !== "function" && typeof itiInstances.getSelectedCountry === "function") {
        itiInstances.getSelectedCountryData = function () { return itiInstances.getSelectedCountry(); };
    }
    if (formId == "requestProfileForm") {
        $(".iti--container, .iti__country-list").css({ "z-index": "2060" });
    }
    // Decide the country + normalize the prefilled value.
    //
    // Two possible sources of truth for the country:
    //   (a) the dropdown/saved flagCode passed in (e.g. UZ), and
    //   (b) the dial code embedded in the prefilled value (e.g. "+91 8533990022").
    //
    // When the prefilled value carries an EXPLICIT international "+<dialCode>"
    // prefix, that number's own dial code is authoritative (the user typed/saved
    // "+91", so it IS an India number even if some other field says UZ). We let
    // the library keep the auto-detected country from the number and strip the
    // "+<dialCode>" down to national digits. When there is no "+" prefix, we use
    // the passed flagCode as the source of truth. This fixes both the
    // "country resets on re-edit" regression and the "+91 shown under UZ" mismatch.
    (function selectCountryAndNormalize() {
        try {
            var raw = ($(phoneNumber).val() || "").trim();
            var fallbackCountry = (flagCode == null || flagCode == undefined || flagCode == "") ? "US" : flagCode;

            if (raw.charAt(0) === "+") {
                // Let the value's own "+<dialCode>" drive the country. The v29 ctor
                // already auto-detected it from the value; if it didn't (e.g. v16),
                // try matching the prefix against the known country list.
                var detected = itiGetCountry(itiInstances) || {};
                var digitsAll = raw.replace(/\D/g, "");
                var detDial = (detected.dialCode || "").replace(/\D/g, "");
                if (!detDial || digitsAll.indexOf(detDial) !== 0) {
                    // Auto-detect failed/mismatched: find the longest dial code that
                    // the number starts with and set that country explicitly.
                    var best = matchCountryByDialCode(digitsAll);
                    if (best) {
                        itiSetCountry(itiInstances, best.iso2);
                        detected = itiGetCountry(itiInstances) || best;
                        detDial = (detected.dialCode || "").replace(/\D/g, "");
                    }
                }
                // Strip the leading dial code, leaving national digits only.
                var national = digitsAll;
                if (detDial && digitsAll.indexOf(detDial) === 0 && digitsAll.length > detDial.length) {
                    national = digitsAll.substring(detDial.length);
                }
                if ($(phoneNumber).val() !== national) {
                    $(phoneNumber).val(national);
                }
            } else {
                // No "+" prefix: the passed flagCode is the source of truth.
                itiSetCountry(itiInstances, fallbackCountry);
                var digitsOnly = raw.replace(/\D/g, "");
                if (raw && $(phoneNumber).val() !== digitsOnly) {
                    $(phoneNumber).val(digitsOnly);
                }
            }
        } catch (e) {}
    })();

    $(phoneNumber).attr("placeholder", placeholderValue);
	var _initCountry = itiGetCountry(itiInstances) || {};
	$("#"+eleId).attr("data-countryCode", _initCountry.iso2 || "");
	$("#"+eleId).attr("data-ISD-Code", _initCountry.dialCode || "");
	// Apply the country-specific length limit (handles maxlength, live-trim, and
	// recomputation on country change). Uses the built-in length map so it works
	// even when the intl-tel-input utils.js is not loaded on the page.
	attachPhoneLengthLimit(phoneNumber, itiInstances);
    var onCountryChange = function (e) {
		var cc = itiGetCountry(itiInstances) || {};
		if(saveType == "selfSave"){
			// Use the local itiInstances (closure) rather than
			// phoneNumber.intlTelInputInstance: setCountry() fires 'countrychange'
			// synchronously during init, before the DOM property is assigned, so
			// reading phoneNumber.intlTelInputInstance would be null here.
			phoneNumberDailCodeChange(eleId, flagCode, cc.iso2 || "", avalWhtsAppStatusID, index)
		}
        $(phoneNumber).attr("data-countryCode", cc.iso2 || "");
        $(phoneNumber).attr("data-ISD-Code", cc.dialCode || "");
        $(phoneNumber).attr("placeholder", placeholderValue);
		if(formId == "profileForm"){
			$("label[for='"+eleId+"']").css({"left":$("#"+eleId).css("padding-left")})
		}
    };
    // Store the handler so a later re-init can removeEventListener it (see guard above).
    phoneNumber.itiCountryChangeHandler = onCountryChange;
    phoneNumber.addEventListener('countrychange', onCountryChange);
    phoneNumber.intlTelInputInstance = itiInstances;
    //phoneNumber.setAttribute('data-intlTelInput-initialized', 'true');
	setTimeout(function () {
		if(formId == "profileForm"){
			$("label[for='"+eleId+"']").css({"left":$("#"+eleId).css("padding-left")})
		}
	},500);
}

function validatePhoneNumber(eleId) {
    var phoneNumber = document.getElementById(eleId);
    // Validation disabled via setting: bypass all checks, treat as valid.
    if (!isPhoneValidationEnabled()) {
        var itiBypass = phoneNumber ? phoneNumber.intlTelInputInstance : null;
        var cd = itiGetCountry(itiBypass);
        return {
            valid: true,
            number: (itiBypass && typeof itiBypass.getNumber === "function") ? itiBypass.getNumber() : $("#" + eleId).val(),
            dialCode: cd ? cd.dialCode : "",
            countryCode: cd ? cd.iso2 : ""
        };
    }
    if (phoneNumber && phoneNumber.intlTelInputInstance) {
        var iti = phoneNumber.intlTelInputInstance;
        var countryData = itiGetCountry(iti);
        var countryName = (countryData && countryData.name) ? countryData.name : "the selected country";
        var maxDigits = getMaxValidPhoneDigitCount(iti);

        // National-mode field: count ALL typed digits as the national number and
        // do NOT auto-strip a leading dial code, so an over-length value like
        // India "918533990033" (12 digits) is flagged even though isValidNumber()
        // would rescue it by treating the leading "91" as the dial code.
        var enteredDigitsStr = ($("#" + eleId).val() || "").replace(/\D/g, "");
        var enteredDigits = enteredDigitsStr.length;

        // HARD LENGTH CAP FIRST (before isValidNumber() rescue).
        if (maxDigits > 0 && enteredDigits > maxDigits) {
            return {
                valid: false,
                message: "Phone number for " + countryName + " can be at most " + maxDigits + " digits.",
                expectedDigits: maxDigits,
                enteredDigits: enteredDigits
            };
        }

        // When libphonenumber metadata is available, use full validation so that
        // ALL valid lengths pass AND the number pattern is checked (e.g. Singapore
        // must start with 3/6/8/9), not just the length.
        if (itiUtilsAvailable() && itiIsValidNumber(iti) !== null) {
            if (itiIsValidNumber(iti)) {
                return {
                    valid: true,
                    number: (typeof iti.getNumber === "function") ? iti.getNumber() : $("#" + eleId).val(),
                    dialCode: countryData.dialCode,
                    countryCode: countryData.iso2
                };
            }
            var msg = "Please enter a valid phone number for " + countryName + ".";
            return { valid: false, message: msg, expectedDigits: maxDigits, enteredDigits: enteredDigits };
        }

        // Fallback (utils.js not loaded): cap by the max known length only.
        if (maxDigits > 0 && enteredDigits > maxDigits) {
            return {
                valid: false,
                message: "Phone number for " + countryName + " can be at most " + maxDigits + " digits.",
                expectedDigits: maxDigits,
                enteredDigits: enteredDigits
            };
        }
        return {
            valid: true,
            number: (typeof iti.getNumber === "function") ? iti.getNumber() : $("#" + eleId).val(),
            dialCode: countryData ? countryData.dialCode : "",
            countryCode: countryData ? countryData.iso2 : ""
        };
    } else {
        return {
            valid: false,
            message: "IntlTelInput instance not found"
        };
    }
}

// Reusable phone validation: checks the country-specific length using the
// intl-tel-input instance and shows the message automatically.
// - Returns true  => valid (or optional & empty, so nothing to validate).
// - Returns false => invalid; the error message is shown via showMessageTheme2.
// Params:
//   eleId       -> input element id (e.g. "phoneNumber", "altPhoneNumber")
//   isMandatory -> when false, an empty value is treated as valid (skipped).
function isPhoneNumberValid(eleId, isMandatory) {
	var rawValue = ($("#" + eleId).val() || "").trim();

	// Optional field left empty => nothing to validate.
	if (rawValue === "") {
		if (isMandatory) {
			showMessageTheme2(0, ' Either field value is invalid or empty.', '', false);
			return false;
		}
		return true;
	}

	var result = validatePhoneNumber(eleId);
	if (!result.valid) {
		showMessageTheme2(0, result.message, '', false);
		return false;
	}
	return true;
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

function getRequestForMasterForHiring(key) {
	var request = {};
	var authentication = {};
	var requestData = {};
	requestData['requestKey'] = key;
	requestData['requestExtra1'] = "Y";
	requestData['requestExtra2'] = "N";
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'COMMON';
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function timeAgo(dateString) {
    var pastDate = new Date(dateString.replace(" ", "T"));
    var now = new Date();
	var diffMs = now - pastDate;
	var minute = 1000 * 60;
    var hour   = minute * 60;
    var day    = hour * 24;
    var month  = day * 30;   // approx
    var year   = day * 365;  // approx
	if (diffMs < minute) {
        return "Just now";
    }
	if (diffMs < hour) {
        var mins = Math.floor(diffMs / minute);
        return mins + " min" + (mins > 1 ? "s" : "") + " ago";
    }
	if (diffMs < day) {
        var hrs = Math.floor(diffMs / hour);
        return hrs + " hour" + (hrs > 1 ? "s" : "") + " ago";
    }
	if (diffMs < month) {
        var days = Math.floor(diffMs / day);
        var hrs = Math.floor((diffMs % day) / hour);
		return days + " day" + (days > 1 ? "s" : "") +
               (hrs > 0 ? " " + hrs + " hour" + (hrs > 1 ? "s" : "") : "") +
               " ago";
    }
	if (diffMs < year) {
        var months = Math.floor(diffMs / month);
        var days = Math.floor((diffMs % month) / day);
		return months + " month" + (months > 1 ? "s" : "") +
               (days > 0 ? " " + days + " day" + (days > 1 ? "s" : "") : "") +
               " ago";
    }
	var years = Math.floor(diffMs / year);
    var months = Math.floor((diffMs % year) / month);
	return years + " year" + (years > 1 ? "s" : "") +
           (months > 0 ? " " + months + " month" + (months > 1 ? "s" : "") : "") +
           " ago";
}

function calendarTimeInterval(timeZone) {
	var userTimeInterval = setInterval(function () {
        if($("#currentTimeForUser").length>0){
			if(timeZone == "Asia/Singapore"){
				var studentTimezone = STUDENT_LIST?.studentBasicDetails?.find(s => s.userId == ACTIVE_STUDENT_ID) ?.studentTimezone || moment.tz.guess();
				var userTime = new Date(convertDatetimeWithFormat(new Date(), timeZone, studentTimezone, DATE_UTC+'T'+TIME_UTC))
			}else{
				var userTime = new Date($("#currentTimeForUser").text())
			}
			var year = userTime.getFullYear();
			var month = userTime.toLocaleString('en-US', {month: 'short'});
			var day = userTime.getDate();
			var hours = userTime.getHours();
			var minutes = userTime.getMinutes();
			var seconds = userTime.getSeconds();
			var ampm = hours >= 12 ? 'PM' : 'AM';
			minutes = minutes<=9 ? '0'+minutes:minutes;
			seconds = seconds<=9 ? '0'+seconds:seconds;
			// Convert hours from 24-hour to 12-hour format
			hours = hours % 12;
			hours = hours ? hours : 12; // The hour '0' should be '12'
			hours = hours<=9 ? '0'+hours:hours;
			$(".user_current_day").text(month+" "+day+","+" "+year);
			// $(".user_current_hour").text(hours);
			// $(".user_current_mins").text(minutes);
			// $(".user_current_second").text(seconds);
			// $(".user_current_am_pm").text(ampm);
			$(".user_current_time").html(hours+":"+minutes+":"+seconds+" "+`<span class="user_current_am_pm clock-bg time-label">${ampm}</span>`);
		} else {
			clearInterval(userTimeInterval);
        }
    }, 1000);
}

function getLearningProgramLabel(registrationType) {
    if (!registrationType || registrationType.trim() === "") {
        return "";
    }

    var key = registrationType.trim().toUpperCase();

    const programMap = {
        "BATCH": "Group Learning",
        "DUAL_DIPLOMA": "Dual Diploma",
        "ONE_TO_ONE": "One-to-One Learning",
        "ONE_TO_ONE_FLEX": "Flexy Program",
        "SCHOLARSHIP": "Self Study",
        "SSP": "Self Study Plus"
    };

    return programMap[key] || registrationType;
}


function getAnnouncementAndNewsContent() {
	var showOnlyReleaseNote = SHOW_ONLY_RELEASE_NOTE === true;
  var html = 
    `<div class="right_fixed_action">
      <!-- Deliberately still the old app. Diary was not migrated and lives
           there; the new support app serves no /iframe/diary-bridge, so
           "fixing" this URL alongside the others would silently break diary. -->
      <iframe src="https://is-chat-react.vercel.app/iframe/diary-bridge?userId=${USER_ID}"  style="height:0px"/>`;

	//   if(!showOnlyReleaseNote && CHAT_URL != "" && USER_ROLE != "DIRECTOR") {
    //     var data = {u: UNIQUEUUID, e: DEPLOYMENT_MODE, d: new Date().getTime()};
    //     var jsonString = JSON.stringify(data);
    //     var chatPayload = btoa(unescape(encodeURIComponent(jsonString)));
    //     var chatUrl = `${CHAT_URL}/signIn?uuid=${UNIQUEUUID}+&p=` + chatPayload;
    //     html += 
    //       `<a href="${chatUrl}" type="button" target="_blank" class="custom-btn-open-options btn bg-success text-white"  data-toggle="tooltip" data-placement="left" title="Talk to Us!">
    //           <img src="${PATH_FOLDER_IMAGE2}chat.gif" width="30" />
    //           <span class="counts-badge badge badge-pill badge-danger ml-0 mr-2" id="chatUnseenCoutn"></span>
    //       </a>`;
    //   }
	
	if(!showOnlyReleaseNote && CHAT_URL != "" && USER_ROLE != "DIRECTOR") {
        var data = {u: UNIQUEUUID, e: DEPLOYMENT_MODE, d: new Date().getTime()};
        var jsonString = JSON.stringify(data);
        var chatPayload = btoa(unescape(encodeURIComponent(jsonString)));
        var chatUrl = `${CHAT_URL}/sign-in?uuid=${UNIQUEUUID}+&p=` + chatPayload;
        html += 
          `<a href="${chatUrl}" type="button" target="_blank" class="custom-btn-open-options btn bg-success text-white" data-toggle="tooltip" data-toggle="tooltip" data-placement="left" title="Talk to Us!">
              <img src="${PATH_FOLDER_IMAGE2}chat.gif" width="30" />
              <span class="counts-badge badge badge-pill badge-danger ml-0 mr-2" id="chatUnseenCoutn"></span>
          </a>`;
        // Badge rendered means badge populated. The count was fetched from the
        // student, teacher and parent dashboards and from nowhere else, while
        // this markup renders for every role except DIRECTOR — so a member of
        // staff got the badge and never got a number in it. Monika, an admin
        // with one unread message, saw an empty pill.
        //
        // Asking here rather than adding a fourth role-specific caller: the two
        // facts are now one line apart and cannot drift again. The existing
        // three callers become redundant rather than wrong — they refresh the
        // same figure — and can be removed separately.
        //
        // Deferred by a tick because `html` is injected into the DOM by the
        // caller, synchronously, after this function returns.
        if (typeof getChat === "function") {
          setTimeout(function () {
            getChat(typeof GLOBAL_EMAIL !== "undefined" ? GLOBAL_EMAIL : "", USER_ROLE);
          }, 0);
        }
	}
      if(!showOnlyReleaseNote && USER_ROLE != "DIRECTOR"){
        html+=
        `<button type="button" class="custom-btn-open-options btn btn-primary" onclick="openRightSideBar(\'announcement_side_wrapper\')" data-toggle="tooltip" data-placement="left" title="Announcement">
          <i class="fa fa-bullhorn fa-w-16"></i>
          <span class="counts-badge badge badge-pill badge-danger ml-0 mr-2" id="announcementBadge">10</span>
        </button>`;
      }
      if(!showOnlyReleaseNote && USER_ROLE != "PARENT" && USER_ROLE != "DIRECTOR"){
          html+=
          `<button type="button" class="custom-btn-open-options btn btn-primary" id="newsBtn" onclick="openRightSideBar(\'news_side_wrapper\')" data-toggle="tooltip" data-placement="left" title="News">
            <i class="fa fa-newspaper-o fa-w-16"></i>
            <span class="counts-badge badge badge-pill badge-danger ml-0 mr-2" id="newsBadge"></span>
          </button>`;
      }
      html +=
        `<button type="button" class="custom-btn-open-options btn btn-primary" id="releaseNoteBtn" onclick="openRightSideBar(\'releaseNote_side_wrapper\');loadDashboardReleaseNotePanel(true);" data-toggle="tooltip" data-placement="left" title="Release Notes">
          <i class="fa fa-rocket fa-w-16"></i>
          <span class="counts-badge badge badge-pill badge-danger ml-0 mr-2 d-none" id="releaseNoteBadge"></span>
        </button>`;
      
      if (
        !showOnlyReleaseNote &&
        (
          USER_ROLE == "PARENT" ||
          USER_ROLE == "TEACHER" ||
          USER_ROLE == "STUDENT" ||
          SCHOOL_DIARY_INITIATES_ROLE
        )
      ) {
        html += `<button type="button" class="custom-btn-open-options btn btn-primary" id="schoolDiaryBtn" onclick="openRightSideBar(\'schoolDiary_side_wrapper\', false)" data-toggle="tooltip" data-placement="left" title="${USER_ROLE == "TEACHER" ? "Teacher Diary" : USER_ROLE == "PARENT" || USER_ROLE == "STUDENT" ? "Student Diary" : "School Diary"}">
            <i class="fa fa-address-book fa-w-16"></i>
            <span class="counts-badge badge badge-pill badge-danger ml-0 mr-2 d-none" id="schoolDiaryBadge"></span>
          </button>`;
      }
      html += `</div>`;
      if(!showOnlyReleaseNote){
        html += `
        <div class="ui-theme-settings custome-ui-theme-settings" id="announcement_side_wrapper" >
            <button type="button" class="custom-btn-open-options close-right-slide-bar-btn border text-white mb-0" onclick="openRightSideBar(\'announcement_side_wrapper\')" style="background:red; position: absolute;left: -18px;top: 20px;z-index: 99;">
                <i class="fa fa-times"></i>
            </button>
            <div class="full" id="announcementDiv"></div>
        </div>`;
        if(USER_ROLE != "PARENT"){
        html+=`<div class="ui-theme-settings custome-ui-theme-settings" id="news_side_wrapper" ${USER_ROLE == "PARENT" ?  "displat:none":""}>
            <button type="button" class="custom-btn-open-options close-right-slide-bar-btn border text-white mb-0" onclick="openRightSideBar(\'news_side_wrapper\')" style="background:red; position: absolute;left: -18px;top: 20px;z-index: 99;">
                <i class="fa fa-times"></i>
            </button>
            <div class="full mt-3" id="newsyDiv"></div>
        </div>`;
        }
      }
      html += `<div class="ui-theme-settings custome-ui-theme-settings" id="releaseNote_side_wrapper">
          <button type="button" class="custom-btn-open-options close-right-slide-bar-btn  border text-white mb-0" onclick="openRightSideBar(\'releaseNote_side_wrapper\')" style="position: absolute;left: -18px;top: 20px;z-index: 99;background:red;">
              <i class="fa fa-times"></i>
          </button>
          <div class="full p-2 mt-3" id="releaseNoteDashboardPanel">
              <div class="text-muted p-3">Loading release notes...</div>
          </div>
      </div>`;
	 
	if (!showOnlyReleaseNote && ( USER_ROLE == "PARENT" || USER_ROLE == "TEACHER" || USER_ROLE == "STUDENT" ||  SCHOOL_DIARY_INITIATES_ROLE)) {
        html += `<div class="ui-theme-settings custome-ui-theme-settings" id="schoolDiary_side_wrapper">
          <button type="button" class="custom-btn-open-options close-right-slide-bar-btn border text-white mb-0" onclick="openRightSideBar(\'schoolDiary_side_wrapper\', true)" style="position: absolute;left: -18px;top: 20px;z-index: 99;background:red;">
            <i class="fa fa-times"></i>
          </button>
          <div class="full" id="schoolDiaryDiv"></div>
        </div>`;
	}
  html += `<div class="custome-ui-theme-settings-overlay" onclick="openRightSideBar(\'settings-overlay\')"></div>`;
  setTimeout(function () {
      loadDashboardReleaseNotePanel(true);
      initNotificationBadgeObservers();
  }, 250);
  return html;
}

// Toggle a notification badge based on its count: hide when 0/empty, show otherwise.
// For the chat badge, add the shake animation when the unseen count is greater than 1.
function updateNotificationBadge(el) {
  if (!el) return;
  var count = parseInt($(el).text(), 10);
  if (isNaN(count) || count <= 0) {
    $(el).addClass("d-none");
    $(el).removeClass("shake_animation");
    return;
  }
  $(el).removeClass("d-none");
  if (el.id === "chatUnseenCoutn") {
    $(el).toggleClass("shake_animation", count > 1);
  }
}

// Watch the notification badges so their visibility stays in sync with the count,
// which is set asynchronously from several other scripts.
function initNotificationBadgeObservers() {
  var ids = ["chatUnseenCoutn", "announcementBadge", "newsBadge", "schoolDiaryBadge"];
  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el || el.dataset.badgeObserved === "true") return;
    el.dataset.badgeObserved = "true";
    updateNotificationBadge(el);
    var observer = new MutationObserver(function () {
      updateNotificationBadge(el);
    });
    observer.observe(el, { childList: true, characterData: true, subtree: true });
  });
}

function openRightSideBar(eleId, closeFlag) {
  if ($(".mobile-slide-up").length > 0) {
    $(".mobile-slide-up").removeClass("slideUp");
  }
  if (eleId == "settings-overlay") {
    $(".custome-ui-theme-settings").removeClass("settings-open");
  } else {
    $("#" + eleId).toggleClass("settings-open");
    $(".tooltip").remove();
  }
  $("body").toggleClass("overflow-hidden");
  $(".custome-ui-theme-settings-overlay").toggleClass("show-custom-overlay");
  if (eleId == "schoolDiary_side_wrapper") {
    $(".school-diary-notebook").hide();
    $(".short-chat").show();
	if(!closeFlag){
    	getChatUserList(true);
	}
  }
}

window.RELEASE_NOTE_DASHBOARD_STATE = window.RELEASE_NOTE_DASHBOARD_STATE || {
	loading: false,
	loaded: false,
	releaseNotes: [],
	newCount: 0
};

function releaseNoteDashboardNormalizeResponse(response) {
	if (typeof response === "string") {
		try {
			return JSON.parse(response);
		} catch (e) {
			return {};
		}
	}
	return response || {};
}

function releaseNoteDashboardIsSuccess(response) {
	var status = String((response || {}).status || "").toUpperCase();
	var statusCode = String((response || {}).statusCode || "").toUpperCase();
	return status === "1" || status === "SUCCESS" || statusCode === "SUCCESS";
}

function releaseNoteDashboardFormatUtcDate(dateTimeValue) {
	var raw = String(dateTimeValue || "").trim();
	if (!raw) {
		return "-";
	}
	var timezone = String(window.USER_TIMEZONE || "").trim() || "UTC";
	try {
		if (typeof convertUTCToTimezoneAs === "function" && typeof DATETIME_UTC_FORMATTER !== "undefined") {
			return convertUTCToTimezoneAs(raw, DATETIME_UTC_FORMATTER, timezone).format("MMM D, YYYY hh:mm A");
		}
	} catch (e) {}
	try {
		if (typeof moment === "function" && moment.utc) {
			return moment.utc(raw, "YYYY-MM-DD HH:mm:ss").tz(timezone).format("MMM D, YYYY hh:mm A");
		}
	} catch (e) {}
	return raw;
}

function renderDashboardReleaseNotePanel() {
	var state = window.RELEASE_NOTE_DASHBOARD_STATE || {};
	var notes = Array.isArray(state.releaseNotes) ? state.releaseNotes : [];
	var newCount = parseInt(state.newCount, 10) || 0;
	var totalCount = notes.length;
	var $releaseNoteBtn = $("#releaseNoteBtn");
	var $badge = $("#releaseNoteBadge");
	if ($releaseNoteBtn.length) {
		if (totalCount >= 1) {
			$releaseNoteBtn.removeClass("d-none");
			$(".right_fixed_action").show();
		} else {
			$releaseNoteBtn.addClass("d-none");
			if (SHOW_ONLY_RELEASE_NOTE === true) {
				$(".right_fixed_action").hide();
			}
		}
	}
	if ($badge.length) {
		if (newCount > 0) {
			$badge.text(newCount).removeClass("d-none");
		} else {
			$badge.addClass("d-none").text("");
		}
	}

	var $panel = $("#releaseNoteDashboardPanel");
	if (!$panel.length) {
		return;
	}

	if (!notes.length) {
		$panel.html(
			"<div class='card mb-0'>" +
				"<div class='card-body'>" +
					"<h6 class='mb-2'>Release Notes</h6>" +
					"<p class='text-muted mb-0'>Coming soon.</p>" +
				"</div>" +
			"</div>"
		);
		return;
	}

	var latest = notes[0] || {};
	var latestTitle = String(latest.title || "Untitled Release");
	var latestVersion = String(latest.versionLabel || "N/A");
	var latestDate = releaseNoteDashboardFormatUtcDate(latest.publishedDateUtc || latest.publishedDate);
	var latestSummary = String(latest.contentPreview || latest.summary || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
	if (latestSummary.length > 180) {
		latestSummary = latestSummary.substring(0, 180) + "...";
	}

	var html = [
		"<div class='card mb-2'>",
			"<div class='card-body p-3'>",
				"<div class='d-flex align-items-start justify-content-between'>",
					"<div>",
						"<h6 class='mb-1'>Latest Release</h6>",
						"<div class='font-weight-bold'>" + $('<div>').text(latestTitle).html() + "</div>",
						"<div class='small text-muted'>Version: " + $('<div>').text(latestVersion).html() + "</div>",
						"<div class='small text-muted'>Published: " + $('<div>').text(latestDate).html() + "</div>",
					"</div>",
					(latest.isNew ? "<span class='badge badge-danger'>NEW</span>" : ""),
				"</div>",
				"<div class='small mt-2'>" + $('<div>').text(latestSummary || "No summary available.").html() + "</div>",
				"<button type='button' class='btn btn-sm btn-primary mt-3' onclick='openDashboardReleaseNoteModule()'>Open Release Notes</button>",
			"</div>",
		"</div>",
		"<div class='card mb-0'>",
			"<div class='card-body p-3'>",
				"<div class='d-flex align-items-center justify-content-between mb-2'>",
					"<h6 class='mb-0'>Recent Releases</h6>",
					"<button type='button' class='btn btn-sm btn-outline-secondary' onclick='loadDashboardReleaseNotePanel(true)'><i class='fa fa-refresh'></i></button>",
				"</div>"
	];

	html.push("<div class='list-group'>");
	for (var i = 0; i < notes.length && i < 8; i++) {
		var note = notes[i] || {};
		var noteTitle = $('<div>').text(String(note.title || "Untitled Release")).html();
		var noteDate = $('<div>').text(releaseNoteDashboardFormatUtcDate(note.publishedDateUtc || note.publishedDate)).html();
		var noteVersion = $('<div>').text(String(note.versionLabel || "N/A")).html();
		var newTag = note.isNew ? "<span class='badge badge-danger ml-2'>NEW</span>" : "";
		html.push(
			"<div class='list-group-item p-2'>" +
				"<div class='font-weight-semi-bold text-dark'>" + noteTitle + newTag + "</div>" +
				"<div class='small text-muted'>Version: " + noteVersion + "</div>" +
				"<div class='small text-muted'>Published: " + noteDate + "</div>" +
			"</div>"
		);
	}
	html.push("</div>");
	html.push(
			"</div>",
		"</div>"
	);
	$panel.html(html.join(""));
}

function loadDashboardReleaseNotePanel(forceRefresh) {
	var state = window.RELEASE_NOTE_DASHBOARD_STATE || {};
	if (!forceRefresh && (state.loading || state.loaded)) {
		renderDashboardReleaseNotePanel();
		return;
	}
	state.loading = true;
	window.RELEASE_NOTE_DASHBOARD_STATE = state;

	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("api/v1/release-note", "user/list"),
		data: JSON.stringify({
			userId: parseInt(USER_ID, 10) || 0,
			schoolId: parseInt(SCHOOL_ID, 10) || 0,
			moduleId: 0
		}),
		dataType: "json",
		global: false,
		success: function (rawResponse) {
			var response = releaseNoteDashboardNormalizeResponse(rawResponse);
			if (String(response.status || "") === "3") {
				if (typeof redirectLoginPage === "function") {
					redirectLoginPage();
				}
				return;
			}
			if (!releaseNoteDashboardIsSuccess(response)) {
				state.releaseNotes = [];
				state.newCount = 0;
				state.loaded = true;
				return;
			}
			state.releaseNotes = Array.isArray(response.releaseNotes) ? response.releaseNotes.slice(0) : [];
			state.newCount = parseInt(response.newReleaseCount, 10);
			if (isNaN(state.newCount)) {
				state.newCount = 0;
			}
			state.loaded = true;
		},
		error: function () {
			state.releaseNotes = [];
			state.newCount = 0;
			state.loaded = true;
		},
		complete: function () {
			state.loading = false;
			window.RELEASE_NOTE_DASHBOARD_STATE = state;
			renderDashboardReleaseNotePanel();
		}
	});
}

function openDashboardReleaseNoteModule() {
	openRightSideBar("settings-overlay");
	if (typeof callDashboardPageSchool === "function") {
		callDashboardPageSchool(0, "release-note", "", "?renderInAdditional=Y");
	}
}

function schoolPopover(show){
	clearTimeout(SCHOOL_POPOVER_TIMER);
	var btn=$("#schoolBtn"), pop=$("#schoolSlideBtn");
	if(btn.length<1 || pop.length<1) return;

	if(show){
		$(".tooltip").remove();
		var btnOffset=btn.offset()||{top:0};
		var popHeight=pop.outerHeight()||0;
		var top=(btnOffset.top-$(window).scrollTop())+(btn.outerHeight()/2)-(popHeight/2);
		top=Math.max(10,Math.min(top,$(window).height()-popHeight-10));
		pop.css("top",top+"px").addClass("show");
	}else{
		SCHOOL_POPOVER_TIMER=setTimeout(function(){
			pop.removeClass("show");
		},150);
	}
}

function getSpoofUrlExpiryOptions() {
	var options = [
		{ value: 5, label: "5 minutes" },
		{ value: 10, label: "10 minutes" },
		{ value: 15, label: "15 minutes" },
		{ value: 30, label: "30 minutes" },
		{ value: 45, label: "45 minutes" }
	];
	for (var h = 1; h <= 24; h++) {
		options.push({ value: h * 60, label: h + " hour" });
	}
	return options;
}

function getSpoofUrlModalHtml() {
	var optionsHtml = '<option value="">Select Validity</option>';
	$.each(getSpoofUrlExpiryOptions(), function (_, opt) {
		optionsHtml += '<option value="' + opt.value + '" data-label="' + opt.label + '">' + opt.label + '</option>';
	});
	return `<div class="modal fade" id="spoofUrlModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white py-2">
                    <h5 class="modal-title">View as User</h5>
                    <button type="button" class="close text-white opacity-100" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label><b>Name:&nbsp;</b><span id="spoofUrlUserName"></span></label>
                    </div>
                    <div class="form-group">
                        <label for="spoofUrlExpirySelect">Select URL Validity</label>
                        <select id="spoofUrlExpirySelect" class="form-control" style="width:100%;" onchange="onSpoofUrlExpiryChange(this);">
                            ${optionsHtml}
                        </select>
                    </div>
                    <div id="spoofUrlResultBox" class="mt-3" style="display:none;">
                        <div class="form-group">
                            <label><b>Generated URL:</b></label>
                            <div class="input-group">
                                <input type="text" id="spoofUrlGeneratedUrl" class="form-control" readonly>
                            </div>
                        </div>
                        <textarea id="spoofUrlInvitationText" style="position:absolute;left:-9999px;opacity:0;height:0;width:0;"></textarea>
                        <div class="text-center mt-3">
                            <button type="button" class="btn btn-success mr-2" onclick="copyURL('spoofUrlGeneratedUrl','spoofUrlCopyMsg')"><i class="fa fa-copy"></i>&nbsp;Copy URL</button>
                            <button type="button" class="btn btn-primary" onclick="copyURL('spoofUrlInvitationText','spoofUrlCopyMsg')"><i class="fa fa-copy"></i>&nbsp;Copy Invitation</button>
                        </div>
                        <div class="text-center mt-2"><span class="spoofUrlCopyMsg"></span></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>`;
}

function openSpoofUrlModal(type, entityId, userName, roleLabel) {
	if (!entityId) {
		showMessageTheme2(0, "Invalid user.");
		return false;
	}
	if ($("#spoofUrlModal").length === 0) {
		$("body").append(getSpoofUrlModalHtml());
	}
	$("#spoofUrlModal").attr("data-user-type", type);
	$("#spoofUrlModal").attr("data-user-id", entityId);
	$("#spoofUrlUserName").text(userName || "");
	$("#spoofUrlResultBox").hide();
	$("#spoofUrlGeneratedUrl").val("");
	$("#spoofUrlInvitationText").val("");
	var $select = $("#spoofUrlExpirySelect");
	$select.val("");
	if ($.fn.select2) {
		if ($select.hasClass("select2-hidden-accessible")) {
			$select.select2("destroy");
		}
		$select.select2({
			dropdownParent: $("#spoofUrlModal"),
			placeholder: "Select Validity",
			width: "100%"
		});
	}
	$("#spoofUrlModal").modal("show");
	return false;
}

function onSpoofUrlExpiryChange(selectEl) {
	var $select = $(selectEl);
	var minutes = $select.val();
	if (!minutes) {
		$("#spoofUrlResultBox").hide();
		return;
	}
	var entityId = $("#spoofUrlModal").attr("data-user-id");
	var type = $("#spoofUrlModal").attr("data-user-type");
	var label = $select.find("option:selected").attr("data-label") || (minutes + " minutes");
	generateSpoofUrl(type, entityId, minutes, label);
}

async function generateSpoofUrl(type, entityId, expiryMinutes, validityLabel) {
	try {
		customLoader(true);
		var extraParams = getSpoofUrlExtraParams();
		var requestBody = $.extend({
			type: type + "",
			entityId: entityId + "",
			expiryMinutes: expiryMinutes + ""
		}, extraParams || {});
		var ajaxReqDetails = {
			method: "POST",
			url: APP_BASE_URL + SCHOOL_UUID + "/create-spoof-url/" + UNIQUEUUID,
			body: requestBody,
			global: true,
			showMessage: true,
			onFaildResolved: true,
			onSuccessResolved: true
		};
		var response = await callCommonAjax(ajaxReqDetails);
		if (response && (response.status === "SUCCESS" || response.statusCode === "200") && response.details) {
			var details = response.details;
			var spoofUrl = appendSpoofUrlExtraParams(details.spoofUrl || "", extraParams);
			$("#spoofUrlUserName").text(details.userName || $("#spoofUrlUserName").text());
			$("#spoofUrlGeneratedUrl").val(spoofUrl);
			var invitationText = "Name - " + (details.userName || "")
				+ "\nValidity - " + validityLabel
				+ "\nUrl - " + spoofUrl;
			$("#spoofUrlInvitationText").val(invitationText);
			$("#spoofUrlResultBox").show();
		} else {
			$("#spoofUrlResultBox").hide();
			showMessageTheme2(0, (response && response.message) || "Unable to generate URL.");
		}
	} catch (e) {
		console.error("generateSpoofUrl error", e);
		showMessageTheme2(0, "Unable to generate URL.");
	} finally {
		customLoader(false);
	}
}

function getSpoofUrlExtraParams() {
	try {
		return JSON.parse($("#spoofUrlModal").attr("data-extra-params") || "{}") || {};
	} catch (e) {
		return {};
	}
}

function appendSpoofUrlExtraParams(spoofUrl, extraParams) {
	if (!spoofUrl || !extraParams || $.isEmptyObject(extraParams)) {
		return spoofUrl || "";
	}
	try {
		var url = new URL(spoofUrl, window.location.origin);
		$.each(extraParams, function (key, value) {
			if (value !== undefined && value !== null && value !== "") {
				url.searchParams.set(key, value);
			}
		});
		return url.toString();
	} catch (e) {
		return spoofUrl;
	}
}

function openParentDashboardPreviewFromQuery() {
	try {
		var params = new URLSearchParams(window.location.search || "");
		if (params.get("parentDemoPreview") !== "Y" || typeof callDashboardPageSchool !== "function") {
			return;
		}
		var feedUserId = params.get("demoFeedUserId") || "";
		if (feedUserId) {
			localStorage.setItem("PARENT_DEMO_FEED_USER_ID", feedUserId);
		}
		var previewModuleId = params.get("parentDemoModuleId") || (typeof moduleId !== "undefined" ? moduleId : 0);
		callDashboardPageSchool(previewModuleId, "Parent-dashboard");
	} catch (e) {
		console.warn("Unable to open parent dashboard preview", e);
	}
}

$(function () {
	openParentDashboardPreviewFromQuery();
});

function getNewReleaseNotificationModal(){
	var html=
	`<div class="modal fade" id="newReleaseNotificationModal" tabindex="-1" role="dialog" aria-labelledby="newReleaseNotificationModalLabel" aria-modal="true" data-backdrop="static">
		<div class="modal-dialog modal-lg modal-dialog-scrollable" style="max-width:420px">
			<div class="modal-content rounded-15 overflow-hidden">
				<div class="modal-body px-0 py-0">
					<div class="full mt-4">
						<h2 class="text-center font-weight-bold font-24">System Update</h2>
					</div>
					<div class="full mt-3 px-3 mb-2">
						<p class="text-center font-weight-bold text-dark font-18 mb-0">Version <span id="new_cdn_version"></span> is now available.</p>
						<p class="text-center text-black-80 font-16" style="line-height:22px">Update now to get the latest improvements.<br/>It only takes a few seconds.</p>
					</div>
					<div class="full py-2 text-center border-top border-bottom">
						<a href="javascript:void(0)" class="text-primary font-weight-semi-bold font-20" onclick="acceptnNewReleaseRequest();">Update Now</a>
					</div>
					<div class="full py-2 text-center mb-1">
						<a href="javascript:void(0)" class="text-dancer font-weight-semi-bold font-20" onclick="skipNewReleaseRequest();">Close</a>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

async function getAllUserRoles(){
	var ajaxReqDetails = {
		method : "POST",
		url : getURLForCommon('masters'),
		body : getRequestForMaster('', 'ROLES-LIST', SCHOOL_ID),
		global: false,
		showMessage: false,
		onFaildResolved: true,
		onSuccessResolved: true
	};
	var response = await callCommonAjax(ajaxReqDetails);
	var roleList = [];
	var list = response && response.mastersData ? response.mastersData.data : [];
	$.each(list || [], function(_, role){
		roleList.push({
			id: role.key,
			name: role.value
		});
	});
	return roleList;
}

function getDatepickerMobileViewContent(){
	var html=
	`<div class="modal fade fade-scale" id="datepickerModal"  aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered box-shadow-none modal-lg mx-auto" role="document" style="width: 100%;max-width: fit-content;">
			<div class="modal-content text-center border-0" style="background: transparent;">
				<div class="modal-body p-0" id="datepickerModalView"></div>
			</div>
		</div>
	</div>`;
	return html;
}
