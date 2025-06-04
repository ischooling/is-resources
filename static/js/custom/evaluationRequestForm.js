function validateRequestForEvaluationFormDetails(formId, otpType) {
  hideMessageErrorNew("evaluationFieldError");
  hideMessageErrorNew("studEmailIdError");
  hideMessageErrorNew("studFirstNameError");
  hideMessageErrorNew("studLastNameError");
  hideMessageErrorNew("studGenderError");
  hideMessageErrorNew("dobError");
  hideMessageErrorNew("ptFirstNameError");
  hideMessageErrorNew("ptLastNameError");
  hideMessageErrorNew("studentContactNoError");
  hideMessageErrorNew("studentContactNoError");
  hideMessageErrorNew("ptEmailIdError");
  hideMessageErrorNew("parentContactNoError");
  hideMessageErrorNew("countryIdError");
  hideMessageErrorNew("parentContactNoError");
  hideMessageErrorNew("fileupload1Error");
  hideMessageErrorNew("fileupload2Error");
  hideMessageErrorNew("currentGradeIdError");
  hideMessageErrorNew("gradeIdError");
  hideMessageErrorNew("genderError");
  hideMessageErrorNew("addressError");
  hideMessageErrorNew("newDateslectedError");
  hideMessageErrorNew("countryTimezoneIdError");
  hideMessageErrorNew("freeSlotListError");
  hideMessageErrorNew("evaluationDocsError");
  hideMessageErrorNew("counselorIdError");

  var flag = true;
  if (
    $("#" + formId + " #currentGradeId").val() == 0 ||
    $("#" + formId + " #currentGradeId").val() == null
  ) {
    showMessageErrorNew(
      true,
      "Previous/Current Grade is required",
      "currentGradeIdError"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #gradeId").val() == 0 ||
    $("#" + formId + " #gradeId").val() == null
  ) {
    showMessageErrorNew(true, "Enrolling in Grade is required", "gradeIdError");
    flag = false;
  }
  if (
    $("#" + formId + " #studFirstName").val() == "" ||
    $("#" + formId + " #studFirstName").val() == null
  ) {
    showMessageErrorNew(true, "Student Name is required", "studFirstNameError");
    flag = false;
  }
  if (
    $("#" + formId + " #studLastName").val() == "" ||
    $("#" + formId + " #studLastName").val() == null
  ) {
    showMessageErrorNew(true, "Last Name is required", "studLastNameError");
    flag = false;
  }
  if (
    $("#" + formId + " #studGender").val() == 0 ||
    $("#" + formId + " #studGender").val() == null
  ) {
    showMessageErrorNew(true, "Student Gender is required", "studGenderError");
    flag = false;
  }
  if (
    $("#" + formId + " #dob").val() == null ||
    $("#" + formId + " #dob").val() == ""
  ) {
    showMessageErrorNew(true, "Date of Birth is required", "dobError");
    flag = false;
  }
  if (
    $("#" + formId + " #dob").val() != null &&
    $("#" + formId + " #dob").val() != ""
  ) {
    var dobd = getDateInDateFormat($("#" + formId + " #dob").val());
    dobd = changeDateFormat(dobd, "mm-dd-yyyy");
    var dob1 = dobd.split("-");
    dobd = dobd.split("-").length;
    if (
      parseInt(dobd) != 3 ||
      parseInt(dob1[1]) > 31 ||
      parseInt(dob1[0]) > 12
    ) {
      showMessageErrorNew(true, "Date of Birth is not valid", "dobError");
      flag = false;
    }
  }
  if (
    $("#" + formId + " #counselorId").val() == "" ||
    $("#" + formId + " #counselorId").val() == null
  ) {
    showMessageErrorNew(true, "Referral Code is required", "counselorIdError");
    flag = false;
  }
  if (
    $("#" + formId + " #ptFirstName").val() == "" ||
    $("#" + formId + " #ptFirstName").val() == null
  ) {
    showMessageErrorNew(true, "Parent Name is required", "ptFirstNameError");
    flag = false;
  }
  if (
    $("#" + formId + " #ptLastName").val() == "" ||
    $("#" + formId + " #ptLastName").val() == null
  ) {
    showMessageErrorNew(true, "Last Name is required", "ptLastNameError");
    flag = false;
  }
  if (
    $("#" + formId + " #countryId").val() == 0 ||
    $("#" + formId + " #countryId").val() == null
  ) {
    showMessageErrorNew(true, "Country is required", "countryIdError");
    flag = false;
  }
  if (
    $("#" + formId + " #stateId").val() == 0 ||
    $("#" + formId + " #stateId").val() == null
  ) {
    showMessageErrorNew(true, "Province is required", "stateIdError");
    flag = false;
  }
  if (
    $("#" + formId + " #cityId").val() == 0 ||
    $("#" + formId + " #cityId").val() == null
  ) {
    showMessageErrorNew(true, "City is required", "cityIdError");
    flag = false;
  }
  if (
    $("#" + formId + " #isdCodeStudent").val() == "" ||
    $("#" + formId + " #isdCodeStudent").val() == null
  ) {
    showMessageErrorNew(true, "ISD Code is required", "studentContactNoError");
    flag = false;
  }
  if (
    $("#" + formId + " #studentContactNo").val() == "" ||
    $("#" + formId + " #studentContactNo").val() == null
  ) {
    showMessageErrorNew(
      true,
      "Phone Number is required",
      "studentContactNoError"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #newDateslected").val() == "" ||
    $("#" + formId + " #newDateslected").val() == null
  ) {
    showMessageErrorNew(true, "Please select a Date", "newDateslectedError");
    flag = false;
  }
  if (
    $("#" + formId + " #countryTimezoneId").val() == "" ||
    $("#" + formId + " #countryTimezoneId").val() == null
  ) {
    showMessageErrorNew(
      true,
      "Please select a Time Zone",
      "countryTimezoneIdError"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #freeSlotList").val() == "" ||
    $("#" + formId + " #freeSlotList").val() == null
  ) {
    showMessageErrorNew(
      true,
      "Please select any one Slot",
      "freeSlotListError"
    );
    flag = false;
  }

  //	if ($("#"+formId+" #isdCodeWtsp").val()=='' || $("#"+formId+" #isdCodeWtsp").val()==null) {
  //		showMessageErrorNew(true, 'ISD Whatsapp Code is required', 'wtspNumberError');
  //		flag=false;
  //	}
  //	if ($("#"+formId+" #wtspNumber").val()=='' || $("#"+formId+" #wtspNumber").val()==null) {
  //		showMessageErrorNew(true, 'Whatsapp Number is required','wtspNumberError');
  //		flag= false
  //	}

  //	if (!validateEmail($("#" + formId + " #ptEmailId").val().trim())) {
  //		showMessageErrorNew(true, 'Email is required','ptEmailIdError');
  //		flag=false;
  //	}
  //	if(validateEmail($("#" + formId + " #ptEmailId").val().trim()) && validateEmail($("#" + formId + " #studEmailId").val().trim())) {
  //		if($("#" + formId + " #ptEmailId").val().trim() == $("#" + formId + " #studEmailId").val().trim()){
  //			showMessageErrorNew(true, 'Student & Parent Email cannot be same','ptEmailIdError');
  //			flag=false;
  //		}
  //	}
  //	if ($("#"+formId+" #isdCodeParent").val()=='' || $("#"+formId+" #isdCodeParent").val()==null) {
  //		showMessageErrorNew(true, 'Parent ISD Code is required', 'parentContactNoError');
  //		flag=false;
  //	}
  //	if ($("#"+formId+" #parentContactNo").val()=='' || $("#"+formId+" #parentContactNo").val()==null) {
  //		showMessageErrorNew(true, 'Parent Phone Number is required','parentContactNoError');
  //		flag= false;
  //	}
  //	if ($("#"+formId+" #parentContactNo").val()=='' || $("#"+formId+" #parentContactNo").val()==null) {
  //		showMessageErrorNew(true, 'Parent Phone Number is required','parentContactNoError');
  //		flag= false;
  //	}

  if (
    !validateEmail(
      $("#" + formId + " #studEmailId")
        .val()
        .trim()
    )
  ) {
    showMessageErrorNew(
      true,
      "Email is either empty or invalid",
      "studEmailIdError"
    );
    flag = false;
  }

  //var flagAttach=false;
  //var attachmentName1 = $("#" + formId + " #evluationATTachement1").val();
  //if (attachmentName1 == "" || attachmentName1== undefined || attachmentName1.trim() == "No file chosen..." ) {
  //	showMessageErrorNew(true, 'Last Academic Proof is Required','fileupload1Error');
  //	flagAttach=true;
  //	flag= false;
  //}

  //	var attachmentName2 = $("#" + formId + " #evluationATTachement2").val();
  //	if (attachmentName2 == "" || attachmentName2== undefined || attachmentName2.trim() == "No file chosen..." ) {
  //		showMessageErrorNew(true, 'Age Proof is Required','fileupload2Error');
  //		flagAttach=true;
  //		flag= false;
  //	}
  //	if(flagAttach){
  //		showMessageErrorNew(true, 'Documents are Required','fileuploadsError');
  //		flag= false;
  //	}

  //	if ($("#"+formId+" #address").val()=='' || $("#"+formId+" #address").val()==null) {
  //		showMessageErrorNew(true, 'Address is required','addressError');
  //		flag= false
  //	}
  if (!flag) {
    $("#evaluationDataSubmit").attr("disabled", false);
  }
  return flag;
}

function callForEvaluationForm(formId, moduleId) {
  if (!validateRequestForEvaluationFormDetails(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/evaluation-form-content",
    contentType: "application/json",
    data: JSON.stringify(getRequestForEvaluation(formId, moduleId)),
    dataType: "html",
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          showMessageErrorNew(true, stringMessage[1], "evaluationFieldError");
          $("#evaluationDataSubmit").attr("disabled", false);
        } else if (stringMessage[0] == "NOPAYMENTGATEWAYENABLED") {
          showMessageErrorNew(true, stringMessage[1], "evaluationFieldError");
          $("#evaluationDataSubmit").attr("disabled", false);
        } else {
          $("#paymentEvaluationMethodModel").html(htmlContent);
          $("#evaluationRequestFormModal").modal({
            backdrop: "static",
            keyboard: false,
          });
        }
        return false;
      }
      return false;
    },
    error: function (e) {
      showMessage(true, e.responseText);
    },
  });
}
function getRequestForEvaluation(formId, moduleId) {
  var request = {};
  var authentication = {};
  var evaluationFormDTO = {};
  var url = window.location.href;
  var isDemoUser = url.split("?isDemoUser")[1];
  if (isDemoUser != undefined && isDemoUser != "") {
    isDemoUser = isDemoUser.split("=")[1];
    evaluationFormDTO["isDemoUser"] = isDemoUser;
  }
  evaluationFormDTO["evaluationId"] = $("#" + formId + " #evaluationId").val();
  evaluationFormDTO["evaluationUUID"] = $(
    "#" + formId + " #evaluationUUID"
  ).val();
  evaluationFormDTO["studFirstName"] = toTitleCase(
    $("#" + formId + " #studFirstName").val()
  );
  evaluationFormDTO["studLastName"] = toTitleCase(
    $("#" + formId + " #studLastName").val()
  );
  evaluationFormDTO["studGender"] = $("#" + formId + " #studGender").val();
  evaluationFormDTO["studEmailId"] = $("#" + formId + " #studEmailId").val();
  evaluationFormDTO["ptFirstName"] = toTitleCase(
    $("#" + formId + " #ptFirstName").val()
  );
  evaluationFormDTO["ptLastName"] = toTitleCase(
    $("#" + formId + " #ptLastName").val()
  );
  evaluationFormDTO["gradeId"] = $("#" + formId + " #gradeId").val();
  evaluationFormDTO["gradeName"] = $(
    "#" + formId + " #gradeId :selected"
  ).text();
  var dobd = getDateInDateFormat($("#" + formId + " #dob").val());
  evaluationFormDTO["dob"] = changeDateFormat(dobd, "mm-dd-yyyy");
  evaluationFormDTO["isdCodeStudent"] = $(
    "#" + formId + " #isdCodeStudent"
  ).val();
  evaluationFormDTO["isdCodeStudentIcon"] = $(
    "#" + formId + " #isdCodeStudentIcon"
  ).val();
  evaluationFormDTO["studentContactNo"] = $(
    "#" + formId + " #studentContactNo"
  ).val();
  if ($("#" + formId + " #sameWhatsapp").is(":checked")) {
    evaluationFormDTO["sameWhatsapp"] = "Y";
  } else {
    evaluationFormDTO["sameWhatsapp"] = "N";
  }
  if (
    $("#" + formId + " #wtspNumber").val() ==
    $("#" + formId + " #studentContactNo").val()
  ) {
    evaluationFormDTO["sameWhatsapp"] = "Y";
  } else {
    evaluationFormDTO["sameWhatsapp"] = "N";
  }
  evaluationFormDTO["isdCodeWtsp"] = $("#" + formId + " #isdCodeWtsp").val();
  evaluationFormDTO["isdCodeWtspIcon"] = $(
    "#" + formId + " #isdCodeWtspIcon"
  ).val();
  evaluationFormDTO["wtspNumber"] = $("#" + formId + " #wtspNumber").val();

  evaluationFormDTO["countryId"] = $("#" + formId + " #countryId").val();
  evaluationFormDTO["stateId"] = $("#" + formId + " #stateId").val();
  evaluationFormDTO["cityId"] = $("#" + formId + " #cityId").val();
  evaluationFormDTO["additionalInfo"] = escapeCharacters(
    toSentenceCase($("#" + formId + " #additionalInfo").val())
  );

  evaluationFormDTO["counselorId"] = $("#" + formId + " #counselorId")
    .val()
    .trim();
  evaluationFormDTO["prevGradeId"] = $("#" + formId + " #currentGradeId").val();
  evaluationFormDTO["prevGradeName"] = $(
    "#" + formId + " #currentGradeId :selected"
  ).text();
  var evaluationFormAttachmentArray = [];
  if (
    $("#" + formId + " #evluationATTachement1").val() != "" &&
    $("#" + formId + " #evluationATTachement1").val() != undefined
  ) {
    var evaluationFormAttachment = {};
    evaluationFormAttachment["attachment"] = $(
      "#" + formId + " #evluationATTachement1"
    ).val();
    evaluationFormAttachment["attachmentType"] = "34";
    evaluationFormAttachmentArray.push(evaluationFormAttachment);
  }
  if (
    $("#" + formId + " #evluationATTachement2").val() != "" &&
    $("#" + formId + " #evluationATTachement2").val() != undefined
  ) {
    var evaluationFormAttachment = {};
    evaluationFormAttachment["attachment"] = $(
      "#" + formId + " #evluationATTachement2"
    ).val();
    evaluationFormAttachment["attachmentType"] = "35";
    evaluationFormAttachmentArray.push(evaluationFormAttachment);
  }
  if (
    $("#" + formId + " #evluationATTachement3").val() != "" &&
    $("#" + formId + " #evluationATTachement3").val() != undefined
  ) {
    var evaluationFormAttachment = {};
    evaluationFormAttachment["attachment"] = $(
      "#" + formId + " #evluationATTachement3"
    ).val();
    evaluationFormAttachment["attachmentType"] = "36";
    evaluationFormAttachmentArray.push(evaluationFormAttachment);
  }
  if (
    $("#" + formId + " #evluationATTachement4").val() != "" &&
    $("#" + formId + " #evluationATTachement4").val() != undefined
  ) {
    var evaluationFormAttachment = {};
    evaluationFormAttachment["attachment"] = $(
      "#" + formId + " #evluationATTachement4"
    ).val();
    evaluationFormAttachment["attachmentType"] = "37";
    evaluationFormAttachmentArray.push(evaluationFormAttachment);
  }
  if (
    $("#" + formId + " #evluationATTachement5").val() != "" &&
    $("#" + formId + " #evluationATTachement5").val() != undefined
  ) {
    var evaluationFormAttachment = {};
    evaluationFormAttachment["attachment"] = $(
      "#" + formId + " #evluationATTachement5"
    ).val();
    evaluationFormAttachment["attachmentType"] = "38";
    evaluationFormAttachmentArray.push(evaluationFormAttachment);
  }
  evaluationFormDTO["evaluationFormAttachment"] = evaluationFormAttachmentArray;

  evaluationFormDTO["countryTimezoneId"] = $(
    "#" + formId + " #countryTimezoneId option:selected"
  ).attr("custom_timezone_id");
  evaluationFormDTO["timeZoneValue"] = $(
    "#" + formId + " #countryTimezoneId option:selected"
  ).val();
  evaluationFormDTO["meetingDate"] = $(
    "#" + formId + " #newDateslected option:selected"
  )
    .text()
    .trim();
  evaluationFormDTO["meetingSlotId"] = $(
    "#" + formId + " #freeSlotList option:selected"
  ).attr("custom_slotidattr");
  evaluationFormDTO["meetingSlotTime"] = $(
    "#" + formId + " #freeSlotList option:selected"
  ).val();
  evaluationFormDTO["meetingDuration"] = $(
    "#" + formId + " #freeSlotList option:selected"
  ).attr("slotDuration");
  evaluationFormDTO["location"] = $("#" + formId + " #location").val();
  evaluationFormDTO["meetingType"] = "CONNECTMEET";

  /*evaluationFormDTO['attachment1'] = $("#" + formId + " #evluationATTachement1").val();
	evaluationFormDTO['attachmentType1'] = '34';
	evaluationFormDTO['attachment2'] = $("#" + formId + " #evluationATTachement2").val();
	evaluationFormDTO['attachmentType2'] = '35';
	evaluationFormDTO['attachment3'] = $("#" + formId + " #evluationATTachement3").val();
	evaluationFormDTO['attachmentType3'] = '36';
	evaluationFormDTO['attachment4'] = $("#" + formId + " #evluationATTachement4").val();
	evaluationFormDTO['attachmentType4'] = '37';
	evaluationFormDTO['attachment5'] = $("#" + formId + " #evluationATTachement5").val();
	evaluationFormDTO['attachmentType5'] = '38';*/

  //	evaluationFormDTO['ptEmailId'] = $("#" + formId + " #ptEmailId").val();
  //	evaluationFormDTO['isdCodeParent'] = $("#" + formId + " #isdCodeParent").val();
  //	evaluationFormDTO['isdCodeParentIcon'] = $("#" + formId + " #isdCodeParentIcon").val();
  //	evaluationFormDTO['parentContactNo'] = $("#" + formId + " #parentContactNo").val();
  //	evaluationFormDTO['address'] = $("#" + formId + " #address").val();

  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  request["authentication"] = authentication;
  request["data"] = evaluationFormDTO;
  return request;
}
function validateElement(formId, fieldId, fielderrorId) {
  flag = true;
  if (fieldId == "studEmailId") {
    if (
      !validateEmail(
        $("#" + formId + " #studEmailId")
          .val()
          .trim()
      )
    ) {
      //	showMessageErrorNew(false, 'Email is either empty or invalid', 'studEmailIdError');
      //	flag=false;
      //		}else if(validateEmail($("#" + formId + " #ptEmailId").val().trim()) && validateEmail($("#" + formId + " #studEmailId").val().trim())) {
      //			if($("#" + formId + " #ptEmailId").val().trim() == $("#" + formId + " #studEmailId").val().trim()){
      //				showMessageErrorNew(true, 'Student & Parent Email cannot be same','ptEmailIdError');
      //				flag=false;
      //			}else {
      //				hideMessageErrorNew('studEmailIdError');
      //				hideMessageErrorNew('ptEmailIdError');
      //			//  callEvaluationEmailCheck($("#" + formId + " #studEmailId").val().trim());
      //			}
    } else {
      hideMessageErrorNew("studEmailIdError");
      //			callEvaluationEmailCheck($("#" + formId + " #studEmailId").val().trim());
    }
  } else if (fieldId == "studFirstName") {
    if (
      $("#" + formId + " #studFirstName").val() == "" ||
      $("#" + formId + " #studFirstName").val() == null
    ) {
    } else {
      hideMessageErrorNew("studFirstNameError");
    }
  } else if (fieldId == "studLastName") {
    if (
      $("#" + formId + " #studLastName").val() == "" ||
      $("#" + formId + " #studLastName").val() == null
    ) {
    } else {
      hideMessageErrorNew("studLastNameError");
    }
  } else if (fieldId == "dob") {
    if (
      $("#" + formId + " #dob").val() == null ||
      $("#" + formId + " #dob").val() == ""
    ) {
    } else if (
      $("#" + formId + " #dob").val() != null &&
      $("#" + formId + " #dob").val() != ""
    ) {
      var dobd = getDateInDateFormat($("#" + formId + " #dob").val());
      dobd = changeDateFormat(dobd, "mm-dd-yyyy");
      var dob1 = dobd.split("-");
      dobd = dobd.split("-").length;
      if (
        parseInt(dobd) != 3 ||
        parseInt(dob1[1]) > 31 ||
        parseInt(dob1[0]) > 12
      ) {
      } else {
        hideMessageErrorNew("dobError");
      }
    } else {
      hideMessageErrorNew("dobError");
    }
  } else if (fieldId == "ptFirstName") {
    if (
      $("#" + formId + " #ptFirstName").val() == "" ||
      $("#" + formId + " #ptFirstName").val() == null
    ) {
    } else {
      hideMessageErrorNew("ptFirstNameError");
    }
  } else if (fieldId == "ptLastName") {
    if (
      $("#" + formId + " #ptLastName").val() == "" ||
      $("#" + formId + " #ptLastName").val() == null
    ) {
    } else {
      hideMessageErrorNew("ptLastNameError");
    }
  } else if (fieldId == "studentContactNo") {
    if (
      $("#" + formId + " #isdCodeStudent").val() == "" ||
      $("#" + formId + " #isdCodeStudent").val() == null
    ) {
    } else if (
      $("#" + formId + " #studentContactNo").val() == "" ||
      $("#" + formId + " #studentContactNo").val() == null ||
      $("#" + formId + " #isdCodeStudent").val() == "" ||
      $("#" + formId + " #isdCodeStudent").val() == null
    ) {
    } else {
      hideMessageErrorNew("studentContactNoError");
    }
  } else if (fieldId == "ptEmailId") {
    if (
      !validateEmail(
        $("#" + formId + " #ptEmailId")
          .val()
          .trim()
      )
    ) {
      showMessageErrorNew(
        false,
        "Parent Email is either empty or invalid",
        "ptEmailIdError"
      );
      flag = false;
    } else if (
      validateEmail(
        $("#" + formId + " #ptEmailId")
          .val()
          .trim()
      ) &&
      validateEmail(
        $("#" + formId + " #studEmailId")
          .val()
          .trim()
      )
    ) {
      if (
        $("#" + formId + " #ptEmailId")
          .val()
          .trim() ==
        $("#" + formId + " #studEmailId")
          .val()
          .trim()
      ) {
        showMessageErrorNew(
          true,
          "Student & Parent Email cannot be same",
          "ptEmailIdError"
        );
        flag = false;
      } else {
        hideMessageErrorNew("studEmailIdError");
        hideMessageErrorNew("ptEmailIdError");
      }
    } else {
      hideMessageErrorNew("ptEmailIdError");
    }
  } else if (fieldId == "parentContactNo") {
    if (
      $("#" + formId + " #isdCodeParent").val() == "" ||
      $("#" + formId + " #isdCodeParent").val() == null
    ) {
    } else if (
      $("#" + formId + " #parentContactNo").val() == "" ||
      $("#" + formId + " #parentContactNo").val() == null
    ) {
    } else {
      hideMessageErrorNew("parentContactNoError");
    }
  } else if (fieldId == "wtspNumber") {
    if (
      $("#" + formId + " #isdCodeWtsp").val() == "" ||
      $("#" + formId + " #isdCodeWtsp").val() == null
    ) {
    } else if (
      $("#" + formId + " #wtspNumber").val() == "" ||
      $("#" + formId + " #wtspNumber").val() == null
    ) {
    } else {
      hideMessageErrorNew("wtspNumberError");
    }
  } else if (fieldId == "countryId") {
    if (
      $("#" + formId + " #countryId").val() == 0 ||
      $("#" + formId + " #countryId").val() == null
    ) {
    } else {
      hideMessageErrorNew("countryIdError");
    }
  } else if (fieldId == "stateId") {
    if (
      $("#" + formId + " #stateId").val() == 0 ||
      $("#" + formId + " #stateId").val() == null
    ) {
    } else {
      hideMessageErrorNew("stateIdError");
    }
  } else if (fieldId == "cityId") {
    if (
      $("#" + formId + " #cityId").val() == 0 ||
      $("#" + formId + " #cityId").val() == null
    ) {
    } else {
      hideMessageErrorNew("cityIdError");
    }
  } else if (fieldId == "fileupload1") {
    var attachmentName1 = $("#" + formId + " #evluationATTachement1").val();
    if (attachmentName1.trim() == "" || attachmentName1.trim() == undefined) {
    } else {
      $("#fileupload1").removeClass("w100");
      hideMessageErrorNew("evaluationFieldError");
      hideMessageErrorNew("fileupload1Error");
    }
  } else if (fieldId == "fileupload2") {
    var attachmentName1 = $("#" + formId + " #evluationATTachement2").val();
    if (attachmentName1.trim() == "" || attachmentName1.trim() == undefined) {
    } else {
      $("#fileupload2").removeClass("w100");
      hideMessageErrorNew("evaluationFieldError");
      hideMessageErrorNew("fileupload2Error");
    }
  } else if (fieldId == "fileupload3") {
    var attachmentName1 = $("#" + formId + " #evluationATTachement3").val();
    if (attachmentName1.trim() == "" || attachmentName1.trim() == undefined) {
    } else {
      $("#fileupload3").removeClass("w100");
      hideMessageErrorNew("evaluationFieldError");
      hideMessageErrorNew("fileupload3Error");
    }
  } else if (fieldId == "fileupload4") {
    var attachmentName1 = $("#" + formId + " #evluationATTachement4").val();
    if (attachmentName1.trim() == "" || attachmentName1.trim() == undefined) {
    } else {
      $("#fileupload4").removeClass("w100");
      hideMessageErrorNew("evaluationFieldError");
      hideMessageErrorNew("fileupload4Error");
    }
  } else if (fieldId == "fileupload5") {
    var attachmentName1 = $("#" + formId + " #evluationATTachement5").val();
    if (attachmentName1.trim() == "" || attachmentName1.trim() == undefined) {
    } else {
      $("#fileupload5").removeClass("w100");
      hideMessageErrorNew("evaluationFieldError");
      hideMessageErrorNew("fileupload5Error");
    }
  } else if (fieldId == "address") {
    if (
      $("#" + formId + " #address").val() == "" ||
      $("#" + formId + " #address").val() == null
    ) {
    } else {
      hideMessageErrorNew("addressError");
    }
  } else if (fieldId == "currentGradeId") {
    if (
      $("#" + formId + " #currentGradeId").val() == 0 ||
      $("#" + formId + " #currentGradeId").val() == null
    ) {
    } else {
      hideMessageErrorNew("currentGradeIdError");
    }
  } else if (fieldId == "gradeId") {
    if (
      $("#" + formId + " #gradeId").val() == 0 ||
      $("#" + formId + " #gradeId").val() == null
    ) {
    } else {
      hideMessageErrorNew("gradeIdError");
    }
  } else if (fieldId == "counselorId") {
    if (
      $("#" + formId + " #counselorId").val() == 0 ||
      $("#" + formId + " #counselorId").val() == null
    ) {
    } else {
      hideMessageErrorNew("counselorIdError");
    }
  } else if (fieldId == "freeSlotList") {
    if (
      $("#" + formId + " #freeSlotList").val() == "" ||
      $("#" + formId + " #freeSlotList").val() == null
    ) {
    } else {
      hideMessageErrorNew("freeSlotListError");
    }
  } else if (fieldId == "countryTimezoneId") {
    if (
      $("#" + formId + " #countryTimezoneId").val() == "" ||
      $("#" + formId + " #countryTimezoneId").val() == null
    ) {
    } else {
      hideMessageErrorNew("countryTimezoneIdError");
    }
  } else if (fieldId == "newDateslected") {
    // console.log("Date Changing");
    if (
      $("#" + formId + " #newDateslected").val() == "" ||
      $("#" + formId + " #newDateslected").val() == null
    ) {
    } else {
      hideMessageErrorNew("newDateslectedError");
    }
  } else if (fieldId == "studGender") {
    if (
      $("#" + formId + " #studGender").val() == 0 ||
      $("#" + formId + " #studGender").val() == null
    ) {
    } else {
      hideMessageErrorNew("studGenderError");
    }
  }
  return flag;
}

function callEvaluatonPay(formId, callingFrom) {
  hideModalMessage(true);
  $("#evaluationDataSubmit").attr("disabled", false);
  $("#callPaymentStudentModal").modal({ backdrop: "static", keyboard: false });
  $("#evaluationRequestFormModal").modal("hide");
  setTimeout(function () {
    $("body").addClass("modal-open");
  }, 1000);
}
function callEvaluationEmailCheck(studEmail, studUUID) {
  var data = {};
  data["studEmail"] = studEmail;
  data["studUUID"] = studUUID;
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/evaluation-email-check",
    data: JSON.stringify(getFinalValue(data)),
    dataType: "html",
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          showMessageErrorNew(true, stringMessage[1], "evaluationFieldError");
        } else if ("SUCCESS" == stringMessage[0]) {
          if (stringMessage[2] == "EF-INITIATED") {
            $("#emailVerfystatusModel").modal({
              backdrop: "static",
              keyboard: false,
            });
            $("#evaluationRequestMesgForm #userName").html(
              "Dear " + stringMessage[3]
            );
            $("#evaluationRequestMesgForm #viewUrl").attr(
              "href",
              stringMessage[5]
            );
            $("#evaluationRequestMesgForm #pendingMesg").html(
              "Your Connect To Impact Program Fee payment is under verification.<br>You will be notified via email <b>once payment is received.</b> You can contact us at <b>info@internationalschooling.org</b> for more information."
            );
          } else if (stringMessage[2] == "EF-SUCCESS") {
            $("#emailVerfystatusModel").modal({
              backdrop: "static",
              keyboard: false,
            });
            $("#evaluationRequestMesgForm #userName").html(
              "Dear " + stringMessage[3]
            );
            $("#evaluationRequestMesgForm #viewUrl").attr(
              "href",
              stringMessage[5]
            );
            $("#evaluationRequestMesgForm #viewRecipt").attr(
              "href",
              stringMessage[7]
            );
            $("#evaluationRequestMesgForm #viewUrl").css({
              display: "inline-block",
            });
            $("#evaluationRequestMesgForm #viewRecipt").css({
              display: "inline-block",
            });
            $("#evaluationRequestMesgForm #pendingMesg").html(
              "You have already made payment for the Connect To Impact Program.<br> Our team will reach out to you to schedule the date and time of the Connect To Impact Program."
            );
            //						$('#evaluationRequestMesgForm #pendingMesg').html("Your Connect To Impact Program Fee payment of <b>"+stringMessage[6]+"</b> is completed successfully.<br><b>An Email will be sent to your registered email</b> containing the link to book your preferred slot for Connect To Impact Program. You will also receive a link to check the status of your evaluation. Your Reference Number is: <b>"+stringMessage[4]+"</b>");
          } else if (stringMessage[2] == "EF-NEW-UNPAID") {
          }
        } else {
          $("#evaluationRequestContents").html(htmlContent);
        }
        return false;
      }
      return false;
    },
    error: function (e) {
      showMessage(true, e.responseText);
    },
  });
}
function validateForEvaluationSlots(formId) {
  hideMessageErrorNew("newDateslectedError");
  hideMessageErrorNew("countryTimezoneIdError");
  hideMessageErrorNew("freeSlotListError");
  var meetingDate = $("#" + formId + " #newDateslected").val();
  var referralCode = $("#" + formId + " #counselorId").val();
  if (meetingDate == "" || meetingDate == undefined) {
    $("#freeSlotList").html("");
    showMessageErrorNew(
      true,
      "Please select a date",
      "newDateslectedError",
      "newDateslected"
    );
    return false;
  }
  var schoolId = $("#" + formId + " #schoolId").val();
  var countryTimezoneId = $("#" + formId + " #countryTimezoneId").val();
  if (countryTimezoneId != null && countryTimezoneId != 0) {
    var requestType = "CONNECTMEET";
    var lat = "";
    var lon = "";
    var book = "Y";
    if ($("#location").val() != "") {
      var locations = JSON.parse($("#location").val());
      lat = locations.lat;
      lon = locations.lon;
    }
    console.log("callEvaluationFormFreeSlots");
    callEvaluationFormFreeSlots(
      "date=" +
        meetingDate +
        "&countryTimezoneId=" +
        countryTimezoneId +
        "&lat=" +
        lat +
        "&lon=" +
        lon +
        "&requestType=" +
        requestType +
        "&book=" +
        book +
        "&schoolId=" +
        schoolId +
        "&referralCode=" +
        referralCode
    );
  } else {
    $("#freeSlotList").html("");
    showMessageErrorNew(
      true,
      "Please select a Time Zone",
      "countryTimezoneIdError",
      "countryTimezoneId"
    );
    return false;
  }
}
function callEvaluationFormFreeSlots(actionUrl) {
  //   console.log(actionUrl);
  console.log("evalution");
  $("#freeSlotList").html("");
  var finalUrl = "/get-request-demo-free-slots?" + actionUrl;
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + finalUrl.split("?")[0],
    data: JSON.stringify(parseUrlToJson(finalUrl)),
    dataType: "html",
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          showMessageErrorNew(
            true,
            stringMessage[1],
            "countryTimezoneIdError",
            "countryTimezoneId"
          );
          $("#freeSlotList").html("");
        } else {
          $("#freeSlotList").html(htmlContent);
        }
        return false;
      }
      return false;
    },
    error: function (e) {
      showMessage(true, e.responseText);
    },
  });
}
