//Julie
function getLearningPlanName(schoolId, learningPlan) {
   if ((schoolId == undefined || schoolId == null) && (learningPlan == undefined || learningPlan == null)) {
        return false;
    }
    // var plan={"schoolId":schoolId,"requestExtra":learningPlan}
    var plan = {
        "authentication": {
            "hash": "ksdjflsajlf",
            "schoolId": schoolId
        },
        "requestData": {
            "requestExtra": learningPlan,
            "requestKey": "LEARNING_PLAN_LIST"
        }
    };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url : getURLForCommon('masters'),
        data: JSON.stringify(plan),
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log(data.mastersData.data);
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                        //$('#'+formId)[0].reset();
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                        //$('#'+formId)[0].reset();
                    }
                }

            } else {
                $("#standardGradeIdOption").html('');
                var standardFeePlanOption = '';
                $.each(data.mastersData.data, function (key, value) {
                    standardFeePlanOption += '<option value="' + value.value + '">' + value.value + '</option>'
                });
                $("#standardGradeIdOption").html(standardFeePlanOption);

                $("#gradePlanOption").html('');
                var gradePlanOption = '';
                $.each(data.mastersData.data, function (key, value) {
                    gradePlanOption += '<option value="' + value.value + '">' + value.value + '</option>'
                });
                $("#gradePlanOption").html(gradePlanOption);

                // $("#standardFeePlan").html('');
                // var standardFeePlan ='';
                // $.each(data.mastersData.data, function (key, value) {
                //     standardFeePlan += '<option value="' + value.value + '">' + value.value + '</option>'
                // });
                // $("#standardFeePlan").html(standardFeePlan);
                //if(learningPlan=='ONE_TO_ONE_FLEX'){
                    if(data.mastersData.data.length>0){
                        getAllGrade();
                    }
                    
                //}
                
               
            }
        }

    })
}
function getStandardGrade(schoolId, learningPlan, standardFeePlanName, standardId, tableID, tableWrapper) {
    if (!(schoolId == null) && (learningPlan == null) && (standardFeePlanName == null) && (standardId == null)) {
        return false;
    }
    var grade = {
        "schoolId": schoolId,
        "learningPlan": learningPlan,
        "standardFeePlanName": standardFeePlanName,
        "standardId": standardId
    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'standardFee-plan'),
        data: JSON.stringify(grade),
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                        //$('#'+formId)[0].reset();
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                        //$('#'+formId)[0].reset();
                    }
                }
            } else {
                $("#" + tableID + " tbody").html('');
                //$(".standardFeeStructureTableWrapper").show();
                var html = '';
                var sn = 0;
                
                $.each(data.standardFeesDTOs, function (key, value) {
                    
                    html += '<tr>'
                        + '<td>' + (key + 1) + '</td>'
                        + '<input type="hidden" id="primaryId" value="' + value.id + '"/>'
                       + '<td>' + value.gradeName + '</td>'
                       + '<td>' + value.standardFeePlan + '</td>'
                        + '<td>' + value.payMode + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.registrationFee + '</span>'
                        + '<input type="text" class="d-none inputValue registrationFee" id="registrationFee' + value.id + '" value="' + value.registrationFee + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.bookAnEnrollmentFee + '</span>'
                        + '<input type="text" class="d-none inputValue bookEnrollment" id="bookEnrollment' + value.id + '" value="' + value.bookAnEnrollmentFee + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.lateFee + '</span>'
                        + '<input type="text" class="d-none inputValue lateFee" id="lateFee' + value.id + '" value="' + value.lateFee + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.annualFee + '</span>'
                        + '<input type="text" class="d-none inputValue annualFee" id="annualFee' + value.id + '" value="' + value.annualFee + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.annualDiscount + '</span>'
                        + '<input type="text" class="d-none inputValue annualDiscount" id="annualDiscount' + value.id + '" value="' + value.annualDiscount + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.monthlyFee + '</span>'
                        + '<input type="text" class="d-none inputValue" id="monthlyFee' + value.id + '" value="' + value.monthlyFee + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.customPlanFirstInstallment + '</span>'
                        + '<input type="text" class="d-none inputValue" id="cusFir' + value.id + '" value="' + value.customPlanFirstInstallment + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.regFeeFullCredit + '</span>'
                        + '<input type="text" class="d-none inputValue" id="regFull' + value.id + '" value="' + value.regFeeFullCredit + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.regFeeHalfCredit + '</span>'
                        + '<input type="text" class="d-none inputValue" id="regHalf' + value.id + '" value="' + value.regFeeHalfCredit + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.crFeeFullCredit + '</span>'
                        + '<input type="text" class="d-none inputValue" id="crFull' + value.id + '" value="' + value.crFeeFullCredit + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.crFeeHalfCredit + '</span>'
                        + '<input type="text" class="d-none inputValue" id="crHalf' + value.id + '" value="' + value.crFeeHalfCredit + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.advFeeFullCredit + '</span>'
                        + '<input type="text" class="d-none inputValue" id="advFull' + value.id + '" value="' + value.advFeeFullCredit + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.advFeeHalfCredit + '</span>'
                        + '<input type="text" class="d-none inputValue" id="advHalf' + value.id + '" value="' + value.advFeeHalfCredit + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.honFeeFullCredit + '</span>'
                        + '<input type="text" class="d-none inputValue" id="honFull' + value.id + '" value="' + value.honFeeFullCredit + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.honFeeHalfCredit + '</span>'
                        + '<input type="text" class="d-none inputValue" id="honHalf' + value.id + '" value="' + value.honFeeHalfCredit + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.apFeeFullCredit + '</span>'
                        + '<input type="text" class="d-none inputValue" id="apFull' + value.id + '" value="' + value.apFeeFullCredit + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.apFeeHalfCredit + '</span>'
                        + '<input type="text" class="d-none inputValue" id="apHalf' + value.id + '" value="' + value.apFeeHalfCredit + '"/>'
                        + '</td>'
                        + '<td>'
                        + '<span class="textValue">' + value.discoveryEducationAddonFee + '</span>'
                        + '<input type="text" class="d-none inputValue" id="addonFee' + value.id + '" value="' + value.discoveryEducationAddonFee + '"/>'
                        + '</td>'
                        + '<td>' + value.status + '</td>'
                        + '<td>'
                        + '<a href="javascript:void(0)" type="button" class="btn bnt-sm btn-primary edit-button" id="editButton">Edit</a>'
                        + '<a href="javascript:void(0)" class="btn btn-sm btn-success save-button d-none" onclick="editPlanData(\'schoolSettingForm\',' + value.id +')">Save</a>'
                        + '<a href="javascript:void(0)" class="cancel-button btn btn-danger d-none">Cancel</a>'
                        + '</td>'
                        + '</tr>'
                });
                $("#" + tableID + " tbody").append(html);
                $("." + tableWrapper).removeClass()//"d-none"
                $("#"+tableID).show();
                // $("#"+tableID).dataTable();
                //onclick="editRow(this)"
            }
        }
    });
}



function getSavePlanData(formId) {
    var standardFeesDTO = savaPlan(formId);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'save-school-setting-standard-fee-data'),
        data: JSON.stringify(standardFeesDTO),
        dataType: 'json',
        success: function (data) {
            if (data.status === 'S001') {
                // Handle success
                showMessageTheme2(1,"Success",'',true)
                $("#" + formId)[0].reset();
                $("#standardFeeAddDiv").addClass("d-none")
                $("#standardFeeStructureTable").show();
            } else {
                // Handle errors
                showMessageTheme2(0,"Not Save", '',false)
                $("#" + formId)[0].reset();
                $("#standardFeeAddDiv").addClass("d-none");
            }
           
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed with status: " + status + " and error: " + error);
        }
    });
}

function savaPlan(formId) {
   
    if($("#" + formId + " #standardFeePlan").val() ==''){
       showMessageTheme2(0,"Standard Fee Plan is empty", '',false)
       $("#standardFeeAddDiv").addClass("d-none");
        return false;
    }
    var standardFeesDTO = {};
    
    standardFeesDTO['schoolId'] = $('#schoolSettigsSelection').val();
    standardFeesDTO['standardId'] = parseInt($("#" + formId + " #standardId").val());
    standardFeesDTO['learningPlanName'] = $("#" + formId + " #learningPlan").val();
    standardFeesDTO['standardFeePlan'] = $("#" + formId + " #standardFeePlan").val();
    standardFeesDTO['payMode'] = $("#" + formId + " #paymode").val();
    standardFeesDTO['registrationFee'] = parseFloat($("#" + formId + " #registrationFee").val());
    standardFeesDTO['bookAnEnrollmentFee'] = parseFloat($("#" + formId + " #bookEnrollment").val());
    standardFeesDTO['lateFee'] = parseInt($("#" + formId + " #lateFee").val());
    standardFeesDTO['annualFee'] = parseFloat($("#" + formId + " #annualFee").val());
    standardFeesDTO['annualDiscount'] = parseFloat($("#" + formId + " #annualDiscount").val());
    standardFeesDTO['monthlyFee'] = parseFloat($("#" + formId + " #monthlyFee").val());
    standardFeesDTO['customPlanFirstInstallment'] = parseFloat($("#" + formId + " #cusFir").val());
    standardFeesDTO['regFeeFullCredit'] = parseFloat($("#" + formId + " #regFull").val());
    standardFeesDTO['regFeeHalfCredit'] = parseFloat($("#" + formId + " #regHalf").val());
    standardFeesDTO['crFeeFullCredit'] = parseFloat($("#" + formId + " #crFull").val());
    standardFeesDTO['crFeeHalfCredit'] = parseFloat($("#" + formId + " #crHalf").val());
    standardFeesDTO['advFeeFullCredit'] = parseFloat($("#" + formId + " #advFull").val());
    standardFeesDTO['advFeeHalfCredit'] = parseFloat($("#" + formId + " #advHalf").val());
    standardFeesDTO['honFeeFullCredit'] = parseFloat($("#" + formId + " #honFull").val());
    standardFeesDTO['honFeeHalfCredit'] = parseFloat($("#" + formId + " #honHalf").val());
    standardFeesDTO['apFeeFullCredit'] = parseFloat($("#" + formId + " #apFull").val());
    standardFeesDTO['apFeeHalfCredit'] = parseFloat($("#" + formId + " #apHalf").val());
    standardFeesDTO['discoveryEducationAddonFee'] = parseFloat($("#" + formId + " #addonFee").val());
    standardFeesDTO['status'] = parseInt($("#" + formId + " #sfStatus").val());
    console.log(JSON.stringify(standardFeesDTO));
    return standardFeesDTO;
}

function editPlanData(formId, rowUniqueID) {
    var standardFeesDTO = savaRowPlanData(formId, rowUniqueID);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'save-school-setting-standard-fee-data'),
        data: JSON.stringify(standardFeesDTO),
        dataType: 'json',
        async:false,
        success: function (data) {
            if (data.status === 'S001') {
                showMessageTheme2(1,"Success",'',true);

                var learningPlan = $("#standardGradeId").select2('val');
			    var standardFeePlan = $("#standardGradeIdOption").select2('val');
			    var standardId = $("#allGradeId").select2('val');
			    var schoolid = $("#schoolSettigsSelection").val();
			    getStandardGrade(schoolid,learningPlan,standardFeePlan,standardId,'standardFeeStructureTable', 'standardFeeStructureTableWrapper');
            } else{
                showMessageTheme2(0,"Not Save", '',false)
                $('#'+formId)[0].reset();
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed with status: " + status + " and error: " + error);
        }
    });
}
function savaRowPlanData(formId, rowUniqueID) {
   
    var standardFeesDTO = {};
    standardFeesDTO['id'] = rowUniqueID;
    standardFeesDTO['registrationFee'] = parseFloat($("#" + formId + " #registrationFee" + rowUniqueID).val());
    standardFeesDTO['bookAnEnrollmentFee'] = parseFloat($("#" + formId + " #bookEnrollment" + rowUniqueID).val());
    standardFeesDTO['lateFee'] = parseFloat($("#" + formId + " #lateFee" + rowUniqueID).val());
    standardFeesDTO['annualFee'] = parseFloat($("#" + formId + " #annualFee" + rowUniqueID).val());
    standardFeesDTO['annualDiscount'] = parseFloat($("#" + formId + " #annualDiscount" + rowUniqueID).val());
    standardFeesDTO['monthlyFee'] = parseFloat($("#" + formId + " #monthlyFee" + rowUniqueID).val());
    standardFeesDTO['customPlanFirstInstallment'] = parseFloat($("#" + formId + " #cusFir" + rowUniqueID).val());
    standardFeesDTO['regFeeFullCredit'] = parseFloat($("#" + formId + " #regFull" + rowUniqueID).val());
    standardFeesDTO['regFeeHalfCredit'] = parseFloat($("#" + formId + " #regHalf" + rowUniqueID).val());
    standardFeesDTO['crFeeFullCredit'] = parseFloat($("#" + formId + " #crFull" + rowUniqueID).val());
    standardFeesDTO['crFeeHalfCredit'] = parseFloat($("#" + formId + " #crHalf" + rowUniqueID).val());
    standardFeesDTO['advFeeFullCredit'] = parseFloat($("#" + formId + " #advFull" + rowUniqueID).val());
    standardFeesDTO['advFeeHalfCredit'] = parseFloat($("#" + formId + " #advHalf" + rowUniqueID).val());
    standardFeesDTO['honFeeFullCredit'] = parseFloat($("#" + formId + " #honFull" + rowUniqueID).val());
    standardFeesDTO['honFeeHalfCredit'] = parseFloat($("#" + formId + " #honHalf" + rowUniqueID).val());
    standardFeesDTO['apFeeFullCredit'] = parseFloat($("#" + formId + " #apFull" + rowUniqueID).val());
    standardFeesDTO['apFeeHalfCredit'] = parseFloat($("#" + formId + " #apHalf" + rowUniqueID).val());
    standardFeesDTO['discoveryEducationAddonFee'] = parseFloat($("#" + formId + " #addonFee" + rowUniqueID).val());
    
    console.log(JSON.stringify(standardFeesDTO));
    return standardFeesDTO;
}

function getActiveFeeData(tableID, showContent) {
    var schoolId= $("#schoolSettigsSelection").val();
    if (showContent) {
        $("#FeeGrade").hide();
        $("#FeeApplyGrade").show();
    }
    var data = {};
    data['schoolId'] = schoolId;
    if (schoolId != null) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: getURLForHTML('dashboard', 'school-setting-grade-plan'),
            dataType: 'json',
            data : JSON.stringify(data),
            success: function (data) {
                if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                    if (data['status'] == '3') {
                        redirectLoginPage();
                    } else {
                        if (tt == 'theme1') {
                            showMessage(false, data['message']);
                            $('#'+formId)[0].reset();
                        } else {
                            showMessageTheme2(0, data['message'], '', true);
                            //$('#'+formId)[0].reset();
                        }
                    }
                } else {
                    $("#" + tableID + " tbody").html('');
                    var html = '';
                    var sn = 0;
                    $.each(data, function (key, value) {
                        html += '<tr>'
                            + '<td>' + value.id + '</td>'
                            + '<td>' + value.personalizePlan + '<br/>' + value.pdate + '</td>'
                            + '<td>' + value.collaborativePlan + '<br/>' + value.cdate + '</td>'
                            + '<td>' + value.acceleratedPlan + '<br/>' + value.adate + '</td>'
                            + '<td>' + value.flexyPlan + '<br/>' + value.fdate + '</td>'
                            + '</tr>'
                    });
                    $("#" + tableID + " tbody").append(html);
                    //$("."+tableWrapper).removeClass("d-none")
                }

            }

        });
    }
}

function saveApplyPlan() {
    var request = {};
    request['schoolId'] = SCHOOL_ID;
    request['gradePlan']= $("#gradePlan").val(); 
    request['gradePlanOption'] = $("#gradePlanOption").val();
    
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'school-setting-grade-plan-apply'),
        data: JSON.stringify(request),
        dataType: 'json',
        success: function (data) {
            if (data.statusCode === 'S001') {
                showMessageTheme2(1,"Success",'',true)
                //getActiveFeeData(tableID,showContent);
            } else{
                showMessageTheme2(0,"Not Save", '',false)
                
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed with status: " + status + " and error: " + error);
        }
    });
}
//setting
function getSettingDataList(tableID) {
    var schoolId= $("#schoolSettigsSelection").val();
    var data={};
        data['schoolId']=schoolId;

    if (schoolId != null) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: getURLForHTML('dashboard', 'school-setting-setting-data'),
            data : JSON.stringify(data),
            dataType: 'json',
            success: function (data) {
                if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                    if (data['status'] == '3') {
                        redirectLoginPage();
                    } else {
                        if (tt == 'theme1') {
                            showMessage(false, data['message']);
                            //$('#'+formId)[0].reset();
                        } else {
                            showMessageTheme2(0, data['message'], '', true);
                            //$('#'+formId)[0].reset();
                        }
                    }
                } else {
                    $("#settingDataSave").hide();
                    $(".settingTableWrapper").show();
                    $("#" + tableID + " tbody").html('');
                    var html = '';
                    var sn = 0;
                    $.each(data, function (key, value) {
                        html += '<tr id="schoolSettingRow'+key+'">'
                                + '<td>' + (key + 1) + '</td>'
                                + '<input type="hidden" id="primaryID" value="' + value.id + '"/>'
                                + '<td style="max-width:300px;width300px">'+ value.metaType + '</td>'
                                + '<td style="max-width:300px;width300px">'+ value.metaKey + '</td>'
                                + '<td style="max-width:300px;width300px">'
                                + '<span class="textValue" >' + value.metaValue + '</span>'
                                + '<textarea type="text" class="d-none inputValue metaValue" style="width:280px" maxlength="2000" id="metaValue' + value.id + '" value="'+ value.metaValue+'"/>'
                                + '</td>'
                                + '<td>'+ value.parentId + '</td>'
                                // + '<td>' + value.activated+ '</td>'
                                // + '<td>' + value.deleted+ '</td>'
                                + '<td style="max-width:250px;width250px">' + value.createdDate+ '</td>'
                                + '<td style="max-width:200px;width200px">' + value.updatedDate+ '</td>'
                                + '<td>'
                                + '<a href="javascript:void(0)" type="button" class="btn bnt-sm btn-primary edit-button" id="editButton"><i class="fas fa-edit"></i></a>'
                                + '<a href="javascript:void(0)" class="btn btn-sm btn-success save-button d-none" onclick="editSettingData(\'schoolSettingForm\',' + value.id + ',\'settingTable\')"><i class="fas fa-check"></i></a>'
                                + '<a href="javascript:void(0)" class="cancel-button btn btn-danger d-none"><i class="fas fa-times"></i></a>'
                                + '</td>'
                            + '</tr>'
                    });
                    $("#" + tableID + " tbody").append(html);
                    //$("."+tableWrapper).removeClass("d-none")
                }

            }

        });
        
    }
}

function saveSetting(formId) {
    var setting = savaSettingData(formId);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'school-setting-setting-addData'),
        data: JSON.stringify(setting),
        dataType: 'json',
        success: function (data) {
            if (data.statusCode === 'S001') {
                showMessageTheme2(1,"Success",'',true)
                $("#" + formId)[0].reset();
                
            } else{
                showMessageTheme2(0,"Not Save", '',false)
                $('#'+formId)[0].reset();
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed with status: " + status + " and error: " + error);
        }
    });


    //$('.addSetting').prop('required',true);
}


function savaSettingData(formId) {
    var setting = {};
    setting['metaType'] =$("#" + formId + " #metaType").val();
    setting['metaKey'] =$("#" + formId + " #metaKey").val();
    setting['metaValue'] =$("#" + formId + " #metaValue").val();
    setting['parentId'] =$("#" + formId + " #parentId").val();
    setting['activated'] =$("#" + formId + " #activated").val();
    setting['deleted'] =$("#" + formId + " #deleted").val();
    return setting;
}

function editSettingData(formId, rowUniqueID,tableID) {
    var setting = saveEditData(formId, rowUniqueID);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'school-setting-setting-addData'),
        data: JSON.stringify(setting),
        dataType: 'json',
        success: function (data) {
            if (data.statusCode === 'S002') {
                showMessageTheme2(1,"Success",'',true)
                getSettingDataList(tableID);
                $('#'+formId)[0].reset();
            } else {
                showMessageTheme2(0,"Not Save", '',false)
                $('#'+formId)[0].reset();
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed with status: " + status + " and error: " + error);
        }
    });
}
function saveEditData(formId, rowUniqueID) {
    var setting = {};
    setting['id'] = rowUniqueID;
    setting['metaType'] = $("#" + formId + " #metaType" + rowUniqueID).val();
    setting['metaKey'] = $("#" + formId + " #metaKey" + rowUniqueID).val();
    setting['metaValue'] =$("#" + formId + " #metaValue" + rowUniqueID).val();
    setting['parentId'] = $("#" + formId + " #parentId" + rowUniqueID).val();
    return setting;
}

//Save Edit Cancel Button Function

$(document).on("click", ".edit-button", function () {    
   
    var row = $(this).closest("tr");
    var currentValue = row.find(".textValue").text();
    row.find(".edit-button, .textValue").addClass("d-none");
    row.find(".save-button, .cancel-button, .inputValue").removeClass("d-none");
    row.find(".metaValue").val(currentValue);
    var currentSession =$(this).parent().closest("tr").find(".session-td").text()
    var sY =  $(this).parent().closest("tr").find(".session-td").attr("data-startyear").split("-");
    var sM =  $(this).parent().closest("tr").find(".session-td").attr("data-startmonth");
    var sD =  $(this).parent().closest("tr").find(".session-td").attr("data-startday");
    var eY =  $(this).parent().closest("tr").find(".session-td").attr("data-endyear").split("-");
    var eM =  $(this).parent().closest("tr").find(".session-td").attr("data-endmonth");
    var eD =  $(this).parent().closest("tr").find(".session-td").attr("data-endday");
    var eeY =  $(this).parent().closest("tr").find(".session-td").attr("data-eendyear").split("-");
	var eeM =  $(this).parent().closest("tr").find(".session-td").attr("data-eendmonth");
	var eeD =  $(this).parent().closest("tr").find(".session-td").attr("data-eendday");
    sY = parseInt(sY[0])-1;
    eY = parseInt(eY[1]);
    eeY = parseInt(eeY[1]);
   
    $(".session-td").val(currentSession).trigger("change");
    $('.sessionStartDate').datepicker("remove");
    $('.sessionStartDate').datepicker({  
        format: 'yyyy-mm-dd',
         startDate: new Date(sY+'-'+sM+'-'+sD),
         endDate: new Date(eY+'-'+eM+'-'+eD)
    });
    $('.sessionStartDate').datepicker('setDate',new Date(sY+'-'+sM+'-'+sD));

    $('.sessionEndDate').datepicker("remove");
    $('.sessionEndDate').datepicker({ 
        format: 'yyyy-mm-dd', 
         startDate: new Date(sY+'-'+sM+'-'+sD),
         endDate: new Date(eeY+'-'+eeM+'-'+eeD)
      });
    $('.sessionEndDate').datepicker('setDate',new Date(eY+'-'+eM+'-'+eD));
});
$(document).on("click", ".save-button", function () {
    var row = $(this).closest("tr");
    var primaryId = $(this).data("primaryId");
    var newValue = row.find(".inputValue").val(); 
    row.find(".textValue").text(newValue);
    row.find(".save-button, .cancel-button, .inputValue").addClass("d-none");
    row.find(".edit-button, .textValue").removeClass("d-none");
    //window.location.reload();
});

$(document).on("click", ".cancel-button", function () {
    var row = $(this).closest("tr");
    var primaryId = $(this).data("primaryId");
    row.find(".save-button, .cancel-button, .inputValue").addClass("d-none");
    row.find(".edit-button, .textValue").removeClass("d-none");
});

//Template Section 
function getTemplateForList() {
    var template = {
        templateType: $("#templateType").val(),
        
     };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'school-setting-template-typeFor'),
        data: JSON.stringify(template),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }

            } else {
                $("#templateForList").html('');
                var templateForList = '';
                $.each(data, function (key, value) {
                    templateForList += '<option value="" Selected >Select Template For</option>'
                    templateForList += '<option value="' + value.templateFor + '">' + value.templateFor + '</option>'
                });
                $("#templateForList").html(templateForList);

                
            }
        }
    });
}

function getTemplateTypeContent(){
    var template = {
        templateType: $("#templateType").val(),
        templateFor: $("#templateForList").val()
     };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'school-setting-template-typeFor'),
        data: JSON.stringify(template),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                        //$('#'+formId)[0].reset();
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                        //$('#'+formId)[0].reset();
                    }
                }

            } else {
                $("#templateContent").html('');
                var templateContent = '';
                $.each(data, function (key, value) {
                    templateContent += value.templateContent
                });
                $("#templateContent").html(templateContent);
                $("templateId").html('');
                
                $("#templateHtml").html('');
                if(data.length>0){
                    $('#templateId').val(data[0].id)
                }
                var templateContent = '';
                $.each(data, function (key, value) {
                    templateContent += value.templateContent
                });
                $("#templateHtml").html(templateContent);
            }
            }
        });
    }


function updateTemplate(formId) {
    var template = {};
    template['id'] =$('#templateId').val();
    template['templateContent'] =$("#" + formId + " #templateHtml").val();
    template['templateFor'] =$("#" + formId + " #addTemplateFor").val();
    template['templateType'] =$('#templateType').val();
     $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'school-setting-template-addData'),
        data: JSON.stringify(template),
        dataType: 'json',
        success: function (data) {
            if (data.statusCode === 'E0200') {
                showMessageTheme2(1,"Success",'',true)
                getTemplateTypeContent();
                $('#'+formId)[0].reset();
            } else{
                showMessageTheme2(0,"Not Save", '',false)
                $('#'+formId)[0].reset();
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed with status: " + status + " and error: " + error);
        }
    });
   
}

//Session
function getSessionMaster(tableID, istrue, sessionEleID) {
    $.ajax({
            type: "GET",
            contentType: "application/json",
            url: getURLForHTML('dashboard', 'school-setting-session-getList'),
            dataType: 'json',
            success: function (data) {
                if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                    if (data['status'] == '3') {
                        redirectLoginPage();
                    } else {
                        if (tt == 'theme1') {
                            showMessage(false, data['message']);
                            //$('#'+formId)[0].reset();
                        } else {
                            showMessageTheme2(0, data['message'], '', true);
                            //$('#'+formId)[0].reset();
                        }
                    }
                }else{  
                    $("#sessionDataSave").hide();;
                    $(".sessionTableWrapper").show();
                    $("#" + tableID + " tbody").html('');
                    var html = '';
                    var sn = 0;
                    $.each(data, function (key, value) {
                        html += '<tr id="schoolSettingRow'+key+'">'
                                + '<td>' + (key + 1) + '</td>'
                                + '<input type="hidden" id="primaryID" value="' + value.sessionId + '"/>'
                                + '<td>'+ value.migratedSessionId + '</td>'
                                + '<td id="sessionName-'+key+'" class="session-td" data-startYear="'+value.sessionName+'" data-startMonth="11" data-startDay="01" data-endYear="'+value.sessionName+'" data-endMonth="10" data-endDay="31" data-eendYear="'+value.sessionName+'" data-eendMonth="12" data-eendDay="31">'+ value.sessionName + '</td>'
                                + '<td>'+ value.sessionYear + '</td>'
                                + '<td>'+ value.sessionMonth + '</td>'
                                //+ '<td>'+ value.startDate + '</td>'
                                 + '<td>'
                                 + '<span class="textValue">' + value.startDate + '</span>'
                                 + '<input type="text" class="d-none inputValue sessionStartDate" id="sessionStartDate' + value.sessionId + '" value="' + value.startDate + '"/>'
                                 + '</td>'
                               //+ '<td>'+ value.endDate + '</td>'
                                + '<td>'
                                + '<span class="textValue">' + value.endDate + '</span>'
                                + '<input type="text" class="d-none inputValue sessionEndDate" id="sessionEndDate' + value.sessionId + '" value="' + value.endDate + '"/>'
                                + '</td>'
                                //+ '<td>'+ value.leadStartDate + '</td>'
                                + '<td>'
                                 + '<span class="textValue">' + value.leadStartDate + '</span>'
                                 + '<input type="text" class="d-none inputValue sessionStartDate" id="leadStartDate' + value.sessionId + '" value="' + value.leadStartDate + '"/>'
                                 + '</td>'
                                //+ '<td>'+ value.leadEndDate + '</td>'
                                + '<td>'
                                 + '<span class="textValue">' + value.leadEndDate + '</span>'
                                 + '<input type="text" class="d-none inputValue sessionEndDate" id="leadEndDate' + value.sessionId + '" value="' + value.leadEndDate + '"/>'
                                 + '</td>'
                                + '<td>'+ value.allowAdmissionStatus + '</td>'
                                + '<td>'+ value.servingSession + '</td>'
                                // + '<td>'+ value.active + '</td>'
                                // + '<td>'+ value.deleted + '</td>'
                                + '<td>'+ value.createdAt + '</td>'
                                + '<td>'+ value.updatedAT + '</td>'
                                + '<td>'
                                + '<a href="javascript:void(0)" type="button" class="btn bnt-sm btn-primary edit-button"><i class="fas fa-edit"></i></a>'
                                + '<a href="javascript:void(0)" class="btn btn-sm btn-success save-button d-none" onclick="updateSession(\'schoolSettingForm\',' + value.sessionId +')"><i class="fas fa-check"></i></a>'
                                + '<a href="javascript:void(0)" class="cancel-button btn btn-danger d-none"><i class="fas fa-times"></i></a>'
                                + '</td>'
                                + '</tr>'

                    });

                    $("#" + tableID + " tbody").append(html);
                } 
                
            }

        });
    }

    function saveSession(formId) {
        var session = saveSessionData(formId);
        
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: getURLForHTML('dashboard', 'school-setting-session-addList'),
            data: JSON.stringify(session),
            dataType: 'json',
            success: function (data) {
                if (data.statusCode === 'E200') {
                    showMessageTheme2(1,"Success",'',true)
                    $("#" + formId)[0].reset();
                } else{
                    showMessageTheme2(0,"Not Save", '',false)
                    $('#'+formId)[0].reset();
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX request failed with status: " + status + " and error: " + error);
            }
        });
        //$('.addSetting').prop('required',true);
 }

 function saveSessionData(formId) {
    var session = {};
    //session['migratedSessionId'] =$("#" + formId + " #migratedSessionId").val();
    session['sessionName'] =$("#" + formId + " .sessionName").val();
    //session['sessionYear'] =$("#" + formId + " #sessionYear").val();
    session['sessionMonth'] =$("#" + formId + " #sessionMonth").val();
    session['allowAdmissionStatus'] =$("#" + formId + " #allowAdmissionStatus").val();
    session['servingSession'] =$("#" + formId + " #servingSession").val();
    session['active'] =$("#" + formId + " #active").val();
    session['deleted'] =$("#" + formId + " #deleted").val();
    session['startDate'] =$("#" + formId + " #sessionStartDate").val();
    session['endDate'] =$("#" + formId + " #sessionEndDate").val();
    session['leadStartDate'] =$("#" + formId + " #leadStartDate").val();
    session['leadEndDate'] =$("#" + formId + " #leadEndDate").val();
    return session;
}

function updateSession(formId,rowUniqueID) {
    var session = saveupdateSession(formId,rowUniqueID);
    
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'school-setting-session-addList'),
        data: JSON.stringify(session),
        dataType: 'json',
        success: function (data) {
            if (data.statusCode === 'E201') {
                showMessageTheme2(1,"Success",'',true);
                getSessionMaster('sessionMasterListTable',true);
                $('#'+formId)[0].reset();
            } else{
                showMessageTheme2(0,"Not Save", '',false);
                $('#'+formId)[0].reset();
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed with status: " + status + " and error: " + error);
        }
    });
}
function saveupdateSession(formId, rowUniqueID) {
    var session = {};
    session['sessionId'] = rowUniqueID;
    session['sessionName'] =$("#" + formId + " .sessionName").val();
    session['startDate'] =$("#" + formId + " #sessionStartDate"+rowUniqueID).val();
    session['endDate'] =$("#" + formId + " #sessionEndDate"+ rowUniqueID).val();
    session['leadStartDate'] =$("#" + formId + " #leadStartDate"+ rowUniqueID).val();
    session['leadEndDate'] =$("#" + formId + " #leadEndDate"+ rowUniqueID).val();
    return session;
}

function getTechnicalList(tableID) {
    var schoolId= $("#schoolSettigsSelection").val();
    var data={};
          data['schoolId']=schoolId;
    if (schoolId != null) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: getURLForHTML('dashboard', 'school-setting-technical-getList'),
            data : JSON.stringify(data),
            dataType: 'json',
            success: function (data) {
                if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                    if (data['status'] == '3') {
                     } else {
                        if (tt == 'theme1') {
                            showMessage(false, data['message']);
                            //$('#'+formId)[0].reset();
                        } else {
                            showMessageTheme2(0, data['message'], '', true);
                            //$('#'+formId)[0].reset();
                        }
                    }
                }else {
                    $("#technicalDataSave").hide();
                    $(".technicalTableWrapper").show();
                    $("#" + tableID + " tbody").html('');
                    var html = '';
                    var sn = 0;
                    $.each(data, function (key, value) {
                        html += '<tr id="schoolSettingTechnicalRow'+key+'">'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">S No.</th>'
                                + '<td>' + (key + 1) + '</td>'
                                +'</tr>'
                                +'</tr>'
                                + '<input type="hidden" id="primaryID" value="' + value.schoolSettingsTechnicalId + '"/>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">SCHOOL ID</th>'
                                + '<td>'+ value.schoolId + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">VENDOR ID</th>'
                                + '<td>'+ value.vendorId + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">SHOW SUBJECT COST ON SIGNUP</th>'
                                + '<td>'+ value.showSubjectCostOnSignup + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">FLEX_ENROLLMENT</th>'
                                + '<td>'+ value.flexEnrollment + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">SCHOOL ENROLLMENT</th>'
                                + '<td>'+ value.schoolEnrollment + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">LETTER HEADER IMG</th>'
                                + '<td>'+ value.letterHeadImg + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">TEACHER AGREEMENT SIGNTURE</th>'
                                + '<td>'+ value.teachAgreementSign + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">AUTHORIZED PERSON_NAME</th>'
                                + '<td>'+ value.authorizedPersonName + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">COURSE PROVIDER ID</th>'
                                + '<td>'+ value.courseProviderId + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">COURSE PROVIDER ID BATCH</th>'
                                + '<td>'+ value.courseProviderIdBatch + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">COURSE PROVIDER NAME</th>'
                                + '<td>'+ value.courseProviderName + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">SHOW COURSE IN MANAGE COURSE</th>'
                                + '<td>'+ value.showCourseInManageCourse + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">CURRENCY ISO CODE</th>'
                                + '<td>'+ value.currencyIsoCode + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">CURRENCY SYMBOL</th>'
                                + '<td>'+ value.currencySymbol + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">CSS FILE</th>'
                                + '<td>'+ value.cssFile + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">LOGIN BG IMAGE</th>'
                                + '<td>'+ value.loginBgImage + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">SIGNUP TEACHER IMAGE</th>'
                                + '<td>'+ value.signupTeacherImage + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">SCHOOL TIMEZONE</th>'
                                + '<td>'+ value.schoolTimeZone + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">ALLOWED TIMEZONE</th>'
                                + '<td>'+ value.allowedTimezone + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">MEETING LINK_PROVIDER</th>'
                                + '<td>'+ value.meetingLinkProvider + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">MEETING PROVIDER SERVICE REQ</th>'
                                + '<td>'+ value.meetingProvServiceReq + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">BATCH TIMEZONE UTC1</th>'
                                + '<td>'+ value.batchTimeZoneUTC1 + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">BATCH TIMEZONE UTC2</th>'
                                + '<td>'+ value.batchTimeZoneUTC2 + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">COPYRIGHT YEAR</th>'
                                + '<td>'+ value.copyrightYear + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">COPYRIGHT URL</th>'
                                + '<td>'+ value.copyrightUrl + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">COPYRIGHT NAME</th>'
                                + '<td>'+ value.copyrightName + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">SESSION DURATION ELEMENTRY</th>'
                                + '<td>'+ value.sessionDurationElementry + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">SESSION DURATION MIDDLE</th>'
                                + '<td>'+ value.sessionDurationMiddle + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">SESSION DURATION HIGH</th>'
                                + '<td>'+ value.sessionDurationHigh + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">ONE TO ONE SIGNUP LABEL</th>'
                                + '<td>'+ value.oneToOneSignupLabel + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">BATCH SIGNUP LABEL</th>'
                                + '<td>'+ value.batchSignupLabel + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">SCHOLARSHIP SIGNUP LABEL</th>'
                                + '<td>'+ value.scholarshipSignupLabel + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">BOOK ENROLLMENT DURATION</th>'
                                + '<td>'+ value.bookEnrollmentDuration + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">DISCOVERY EDUCATION ADDON</th>'
                                + '<td>'+ value.discoveryEducationAddon + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">DISCOVERY EDUCATION ONE TO ONE</th>'
                                + '<td>'+ value.discoveryEducationOneToOne + '</td>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">DISCOVERY EDUCATION BATCH</th>'
                                + '<td>'+ value.discoveryEducationBatch + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">DISCOVERY EDUCATION SCHOLARSHIP</th>'
                                + '<td>'+ value.discoveryEducationScholarship + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">BATCH CLOSED FROM</th>'
                                + '<td>'+ value.batchClosedFrom + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold"><span>SHOW STUDENT COURSE SELECTION_MODAL</span><span>Deepak gupta</span></th>'
                                + '<td>'+ value.showStudentCourseSelectionStatus + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">LMS USER PROVIDER</th>'
                                + '<td>'+ value.lmsUserProvider + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">ELLIGIBLITY TO SEND REMINDER MAIL</th>'
                                + '<td>'+ value.elligiblityStatusToSendMail + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">EVALUATION TEST FEE</th>'
                                + '<td>'+ value.evaluationTestFee + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">MEETING AUTO DAYS</th>'
                                + '<td>'+ value.meetingAutoDays + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">COMMON PAYMENT USER ID</th>'
                                + '<td>'+ value.commonPaymentUserId + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">EVALUATION MODULE NAME</th>'
                                + '<td>'+ value.evaluationModuleName + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">EVALUATION MOD TERMS NAME</th>'
                                + '<td>'+ value.evaluationModTermsName + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">EVALUATION MOD ENABLED</th>'
                                + '<td>'+ value.evaluationModEnabled + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">EVALUATION MOD SLOT TIME</th>'
                                + '<td>'+ value.evaluationModSlotTime + '</td>'
                                 +'</tr>'
                                 +'<tr>'
                                 +'<th class="" style="font-weight: bold">EVALUATION MOD SLOT BUFFER TIME</th>'
                                + '<td>'+ value.evalModSlotBufTime + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">EVAL SLOT CRON TIME</th>'
                                + '<td>'+ value.evalSlotCronTime + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">EVAL SLOT VIEW TIME DIFF</th>'
                                + '<td>'+ value.evalSlotViewTimeDiff + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">PAYMENT REMINDER SERVICE</th>'
                                + '<td>'+ value.paymentReminderService + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">PAYMENT REMINDER BEFORE</th>'
                                + '<td>'+ value.paymentReminderBefore + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">PAYMENT REMINDER MAX DAYS</th>'
                                + '<td>'+ value.paymentReminderMaximumDays + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">PAYMENT REMINDER FREQUENCY</th>'
                                + '<td>'+ value.paymentReminderFrequency + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">LMS ACC LOCK SERVICE</th>'
                                + '<td>'+ value.lmsAccountLocService + '</td>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">ACC LOCK IN DAYS</th>'
                                + '<td>'+ value.accountLockInDays + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">TRANSCRIPT SIGNATURE</th>'
                                + '<td>'+ value.transcriptSignature + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">BOOK AN ENROLLMENT SERVICE</th>'
                                + '<td>'+ value.bookAnEnrollmentService + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">FLEX SIGNUP LABEL</th>'
                                + '<td>'+ value.flexSignupLabel + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">FLEX SIGNUP LABEL</th>'
                                + '<td>'+ value.curseProviderIdScholarship + '</td>'
                                +'</tr>'
                                +'<tr>'
                                +'<th class="" style="font-weight: bold">FLEX SIGNUP LABEL</th>'
                                + '<td>'+ value.oneRoasterUploadService + '</td>'
                                +'</tr>'

                                + '<a href="javascript:void(0)" type="button" class="btn bnt-sm btn-primary edit-button" id="editButton"><i class="fas fa-edit"></i></a>'
                                + '<a href="javascript:void(0)" class="btn btn-sm btn-success save-button d-none" onclick="editSettingData(\'schoolSettingForm\',' + value.id + ',\'settingTable\')"><i class="fas fa-check"></i></a>'
                                + '<a href="javascript:void(0)" class="cancel-button btn btn-danger d-none"><i class="fas fa-times"></i></a>'
                                + '</td>'
                            
                    });
                    $("#" + tableID + " tbody").append(html);
                    //$("#technicalTableId").html(html);
                    //$("."+tableWrapper).removeClass("d-none")
                }
            }
        });
    }
}
          