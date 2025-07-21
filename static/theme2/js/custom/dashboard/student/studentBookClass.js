function studentBookClassOnLoad() {
  if ($("#studentBookClassStyle").length < 1) {
    $("head").append(`
            <style id="studentBookClassStyle">
                .flex-course-disc-head{width:100%;display:block;padding:15px 20px;background:#eff7ff;box-shadow:1px 1px 6px 1px #d5e1eb;margin:20px auto}.flex-course-disc-head .course-name{margin-bottom:5px;text-align:center;font-weight:600}.flex-course-disc-head ul{list-style:none;width:100%;display:inline-block;padding:0}.flex-course-disc-head ul li{font-size:16px;text-align:center;line-height:24px}
				@media(max-width:990px) {
					.fullView .chat-message{display:block}
					.fullView .notify-bell-chat{width:fit-content;}
				}
				@media(max-width:550px) {
					.fullView .chat-message{font-size: 13px !important;}
				}
            </style>
        `);
  }
}

function bookedCalssCotentFormReset(formID) {
  $("#" + formID + " #selectedType")
    .val("today")
    .trigger("change");
}

function getDetailsForStudentBookaClass(studentStandardId) {
  return new Promise(function (resolve, reject) {
    hideMessageTheme2("");
    var data = {};
    data["studentStandardId"] = studentStandardId;
    data["schoolId"] = SCHOOL_ID;
    data["sessionUserId"] = USER_ID;
    data["bookingDate"] = $("#bookingDate").val();
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: getURLForHTML(
        "dashboard",
        "student-book-a-class-details?payload=" + encode(JSON.stringify(data))
      ),
      dataType: "json",
      cache: false,
      timeout: 600000,
      success: function (data) {
        if (
          data["status"] == "0" ||
          data["status"] == "2" ||
          data["status"] == "FAILED"
        ) {
          showMessageTheme2(0, data["message"], "", true);
          reject(data);
        } else {
          resolve(data);
        }
        return false;
      },
      error: function (e) {
        showMessageTheme2(0, "An error occurred.", "", true);
        reject(e);
        return false;
      },
    });
  });
}

function selectTypeChange(src) {
  if ($(src).val() == "custom") {
    $("#startDate, #endDate").datepicker("destroy"); // Remove previous datepickers
    $("#startDate")
      .datepicker({
        format: "M dd, yyyy",
        container: "#bookClassOneToOne .datepickerStartWrapper",
        autoclose: true,
        //startDate:new Date()
      })
      .on("change", function () {
        // Get the startDate
        var startDate = new Date($(this).val());
        var endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1); // Increment by 1 day

        // Remove and reinitialize #endDate with updated startDate
        $("#endDate").datepicker("destroy");
        $("#endDate").datepicker({
          format: "M dd, yyyy",
          container: "#bookClassOneToOne .datepickerEndWrapper",
          autoclose: true,
          startDate: endDate, // Set minimum date for #endDate
        });
      });

    // Initialize #endDate initially without restrictions
    $("#endDate").datepicker({
      format: "M dd, yyyy",
      container: "#bookClassOneToOne .datepickerEndWrapper",
      autoclose: true,
    });

    // Enable and clear the fields
    $("#startDate, #endDate").attr("disabled", false);
    $("#startDate, #endDate").val("");
  } else {
    // Disable fields for non-custom types
    $("#startDate, #endDate").attr("disabled", true);
    // $("#startDate, #endDate").val("");
  }
}

function changeElementrySubject(
  src,
  roleModuleId,
  studentStandardId,
  teacherAssignFlag,
  weekLeftClassCount
) {
  var subjectId = $(src).val();
  if (subjectId != "") {
    $("#viewElementrySlot").removeClass("disabled");
    $("#viewElementrySlot").attr(
      "onclick",
      "bookingSlotModalNew(" +
        `${subjectId}` +
        "," +
        `${roleModuleId}` +
        "," +
        `${studentStandardId}` +
        "," +
        teacherAssignFlag +
        "," +
        weekLeftClassCount +
        ")"
    );
  } else {
    $("#viewElementrySlot").addClass("disabled");
    $("#viewElementrySlot").attr("onclick", "");
  }
}

function bookingSlotModalForElementry(
  subjectId,
  roleModuleId,
  studentStandardId,
  teacherAssignFlag,
  weekLeftClassCount,
  assignedTeacherCount
) {
  if (!teacherAssignFlag) {
    showMessageTheme2(2, "You do not have a teacher assigned yet", "", true);
    return false;
  }
  if (weekLeftClassCount < 1) {
    showMessageTheme2(
      2,
      "You have booked all your classes for this week",
      "",
      true
    );
    return false;
  }
  var data = {};
  data["userId"] = USER_ID;
  data["roleModuleId"] = roleModuleId;
  data["studentStandardId"] = studentStandardId;
  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: getURLForHTML(
      "dashboard",
      "student-subject-session-booking-elementry?payload=" +
        encode(JSON.stringify(data))
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: async function (data) {
      if (
        data["status"] == "0" ||
        data["status"] == "2" ||
        data["status"] == "3"
      ) {
        if (data["status"] == "3") {
          redirectLoginPage();
        } else {
          showMessageTheme2(2, data["message"], "", true);
        }
      } else {
        console.log(data);

        if ($("#weeklyBookClassModal").length > 0) {
          $("#weeklyBookClassModal").remove();
          $("body").append(
            weeklyBookClassModal(
              data,
              subjectId,
              studentStandardId,
              roleModuleId,
              "modal-md",
              weekLeftClassCount,
              assignedTeacherCount
            )
          );
        } else {
          $("body").append(
            weeklyBookClassModal(
              data,
              subjectId,
              studentStandardId,
              roleModuleId,
              "modal-md",
              weekLeftClassCount,
              assignedTeacherCount
            )
          );
        }
        if ($("#elementrySubjectID").hasClass("select2-hidden-accessible")) {
          $("#elementrySubjectID").select2("destroy");
        }
        $("#elementrySubjectID").select2({
          theme: "bootstrap4",
          dropdownParent: "#bookClassForm",
        });
        $("#weeklyBookClassModal").modal("show");
        $(
          "#weeklyClassSlotTable .custom-radio-label-tag .custom-control-input"
        ).on("change", function () {
          if ($(this).is(":checked")) {
            $("#bookClassBtn").prop("disabled", false).removeClass("disabled");
          }
        });
      }
      customLoader(false);
    },
    error: function (e) {
      //showMessage(true, TECHNICAL_GLITCH);
    },
  });
}

async function bookingSlotModalNew(
  subjectId,
  roleModuleId,
  studentStandardId,
  teacherAssignFlag,
  weekLeftClassCount
) {
  if (!teacherAssignFlag) {
    showMessageTheme2(2, "You do not have a teacher assigned yet", "", true);
    return false;
  }
  if (weekLeftClassCount < 1) {
    showMessageTheme2(
      2,
      "You have booked all your classes for this week",
      "",
      true
    );
    return false;
  }
  var data = {};
  data["userId"] = USER_ID;
  data["subjectId"] = subjectId;
  data["roleModuleId"] = roleModuleId;
  data["studentStandardId"] = studentStandardId;

  customLoader(true); // Show loader at the start

  try {
    const response = await $.ajax({
      type: "GET",
      contentType: "application/json",
      url: getURLForHTML(
        "dashboard",
        "student-subject-session-booking-new?payload=" +
          encode(JSON.stringify(data))
      ),
      dataType: "json",
      cache: false,
      timeout: 600000,
    });

    if (
      response["status"] == "0" ||
      response["status"] == "2" ||
      response["status"] == "3"
    ) {
      if (response["status"] == "3") {
        redirectLoginPage();
      } else {
        showMessageTheme2(2, response["message"], "", true);
      }
    } else {
      if (response["teacherAssigned"] === "YES") {
        var currentDate = new Date();
        if (
          $("#bookingDate").val() != "" &&
          $("#bookingDate").val() != undefined
        ) {
          currentDate = new Date($("#bookingDate").val());
        }
        var availabilityData = await getTeacherTimeToShowWeeklyCalendar(
          subjectId,
          response["assignedTeacherUserId"],
          "STUDENT",
          "WEEK",
          response["studentStandardId"],
          currentDate
        );

        if ($("#weeklyBookClassModal").length > 0) {
          $("#weeklyBookClassModal").remove();
        }

        $("body").append(
          weeklyBookClassModal(
            availabilityData,
            subjectId,
            studentStandardId,
            roleModuleId,
            "modal-xl"
          )
        );
        $("#weeklyBookClassModal").modal("show");

        $(
          "#weeklyClassSlotTable .custom-radio-label-tag .custom-control-input"
        ).on("change", function () {
          if ($(this).is(":checked")) {
            $("#bookClassBtn").prop("disabled", false).removeClass("disabled");
          }
        });
      } else {
        showMessageTheme2(2, response["message"], "", true);
      }
    }
  } catch (error) {
    customLoader(false);
    console.error(error);
  }

  customLoader(false); // Hide loader **only after everything is complete**
}
function bookedCalssCotentFun(
  subjectId,
  moduleId,
  studentStandardId,
  flag,
  teacherAssignFlag,
  weekLeftClassCount,
  assignedTeacherCount
) {
  // if(!teacherAssignFlag){
  // 	showMessageTheme2(2, 'You do not have a teacher assigned yet', '', true);
  // 	return false;
  // }
  var data = {};
  data["userId"] = USER_ID;
  data["subjectId"] = subjectId;
  data["studentStandardId"] = studentStandardId;
  data["callFrom"] = USER_ROLE;
  data["startDate"] =
    $("#bookClassOneToOne #startDate").val() != undefined
      ? $("#bookClassOneToOne #startDate").val()
      : "";
  data["endDate"] =
    $("#bookClassOneToOne #endDate").val() != undefined
      ? $("#bookClassOneToOne #endDate").val()
      : "";
  data["dateType"] = $("#bookClassOneToOne #selectedType").val();
  // data['roleModuleId'] = roleModuleId;
  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: getURLForHTML(
      "dashboard",
      "student-booked-classes-details?payload=" + encode(JSON.stringify(data))
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      console.log(data);
      if (
        data["status"] == "0" ||
        data["status"] == "2" ||
        data["status"] == "3"
      ) {
        if (data["status"] == "3") {
          redirectLoginPage();
        } else {
          showMessageTheme2(2, data["message"], "", true);
        }
      } else {
        if (flag == "filter" && flag != undefined && flag != null) {
          $("#bookedClassesWrapper").html(
            bookedClassesThumbsContent(data.subjectCountDatials) +
              bookedClassesTableContent(data.meetingDetails)
          );
        } else {
          renderBookedClassContent(
            data,
            flag,
            teacherAssignFlag,
            weekLeftClassCount,
            assignedTeacherCount
          );
          if (data.meetingDetails.length < 1) {
            var colspan = $("#bookClassTable thead tr").children().length;
            html = `<tr>
								<td class="rounded-bottom-left-10 rounded-bottom-right-10 font-weight-bold text-center" colspan="${colspan}">No records found</td>    
							</tr>`;
            if ($.fn.dataTable.isDataTable("#bookClassTable")) {
              $("#bookClassTable").DataTable().destroy(); // Destroy the previous instance
            }
            $("#bookClassTable").DataTable({
              scrollX: true,
            }); // Initialize it again
          }
        }
      }
      customLoader(false);
    },
    error: function (e) {
      //showMessage(true, TECHNICAL_GLITCH);
    },
  });
}

function getRequestForStudentBookClassSlots(formId, moduleId) {
  var request = {};
  var authentication = {};
  var meetingSlotDTO = {};

  meetingSlotDTO["meetingPersoneId"] = USER_ID;
  meetingSlotDTO["meetingDate"] = $(
    "#weeklyClassSlotTable tbody tr td input:checked"
  ).attr("data-meeting-start-date-time");
  var cst =
    $("#weeklyClassSlotTable tbody tr td input:checked").attr(
      "data-class-date"
    ) +
    " " +
    $("#weeklyClassSlotTable tbody tr td input:checked").attr(
      "data-class-start-time"
    );
  var duration = $("#weeklyClassSlotTable tbody tr td input:checked").attr(
    "data-duration"
  );
  var endDateTime = calculateEndDateTime(cst, duration);
  meetingSlotDTO["meetingEndDate"] = endDateTime.endDateTime;
  meetingSlotDTO["meetingType"] = "STUDENT_DOUBT_SESSION";
  meetingSlotDTO["subjectId"] = $(
    "#weeklyClassSlotTable tbody tr td input:checked"
  ).attr("data-suject-id");
  meetingSlotDTO["studentStandardId"] = $(
    "#weeklyClassSlotTable tbody tr td input:checked"
  ).attr("data-studentstandard-id");
  meetingSlotDTO["teachUserId"] = $(
    "#weeklyClassSlotTable tbody tr td input:checked"
  ).attr("data-teacher-id");
  meetingSlotDTO["schoolPersonId"] = $(
    "#weeklyClassSlotTable tbody tr td input:checked"
  ).attr("data-teacher-id");
  meetingSlotDTO["schoolId"] = SCHOOL_ID;
  meetingSlotDTO["meetingVendor"] = "LENS";
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  request["meetingSlotDTO"] = meetingSlotDTO;
  return request;
}

function validateRequestForStudentBookSessionSlots(formId, moduleId) {
  if ($("input[name='slotTime']:checked").val() == undefined) {
    showMessageTheme2(0, "Please select any one Slot.", "", false);
    return false;
  }
  return true;
}

function callForStudentBookClassSlots(formId, moduleId, roleModuleId) {
  if (!getSession()) {
    redirectLoginPage();
  }
  hideMessage("");
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "student-book-session-slots-submit-new"),
    data: JSON.stringify(getRequestForStudentBookClassSlots(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(0, data["message"], "", false);
      } else {
        $("#weeklyBookClassConfirmationModal").modal("hide");
        renderBookClassContent(
          `${data.studentStandardId}`,
          `${roleModuleId}`,
          $("#classPlanCount").attr("data-classPlanCount"),
          false,
          `${roleModuleId}`
        );
        showMessageTheme2(1, data["message"], "", false);
      }
      return false;
    },
    error: function (e) {
      return false;
    },
  });
}

function showBookClassConfirmationModal(roleModuleId) {
  var cst =
    $("#weeklyClassSlotTable tbody tr td input:checked").attr(
      "data-class-date"
    ) +
    " " +
    $("#weeklyClassSlotTable tbody tr td input:checked").attr(
      "data-class-start-time"
    );
  var duration = $("#weeklyClassSlotTable tbody tr td input:checked").attr(
    "data-duration"
  );
  var endTime = calculateEndDateTime(cst, duration);
  var cet = endTime.endTime;
  var cn = $("#weeklyClassSlotTable tbody tr td input:checked").attr(
    "data-subject-name"
  );
  var tn = $("#weeklyClassSlotTable tbody tr td input:checked").attr(
    "data-teacher-name"
  );
  var cDate = $("#weeklyClassSlotTable tbody tr td input:checked").attr(
    "data-class-date"
  );
  if ($("#weeklyBookClassConfirmationModal").length > 0) {
    $("#weeklyBookClassConfirmationModal").remove();
  }
  $("body").append(
    weeklyBookClassConfirmationModal(cst, cet, cDate, cn, tn, roleModuleId)
  );
  $("#weeklyBookClassModal").modal("hide");
  $("#weeklyBookClassConfirmationModal").modal("show");
}

function backToweeklyBookClassModal() {
  $("#weeklyBookClassConfirmationModal").modal("hide");
  $("#weeklyBookClassModal").modal("show");
}

function calculateEndDateTime(startDateTime, duration) {
  // Parse the input date-time string into a Date object
  let startDate = new Date(startDateTime);

  // Add the duration (in minutes)
  startDate.setMinutes(startDate.getMinutes() + Number(duration));

  // Format the result as "YYYY-MM-DD HH:mm:ss"
  var year = startDate.getFullYear();
  var month = String(startDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  var day = String(startDate.getDate()).padStart(2, "0");
  var hours = String(startDate.getHours()).padStart(2, "0"); // Hours in 24-hour format
  var minutes = String(startDate.getMinutes()).padStart(2, "0");
  var seconds = String(startDate.getSeconds()).padStart(2, "0");
  var modifier = hours >= 12 ? "PM" : "AM";
  // Hours in 12-hour format

  var hours12Format = startDate.getHours();
  hours12Format = hours12Format % 12 || 12;
  // Format the date-time string in 24-hour format
  var endDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  var endTime = `${hours12Format}:${minutes} ${modifier}`;
  return { endDateTime: endDateTime, endTime: endTime };
}

// function checkDateAndTimeIsPastOrNot(dateString, timezone, secs) {
// 	var providedDate = new Date(dateString);
// 	var currentDate = new Date(convertLocalToUTC(dateString,DATE_UTC,timezone));
// 	var addtwohours = currentDate.setHours(currentDate.getHours() + 2)
//   	return providedDate < addtwohours;
// }
function checkDateAndTimeIsPastOrNot(dateString, timezone, hours) {
  hours = parseInt(hours);
  var providedDate = new Date(dateString);
  var currentDate = new Date(
    convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, timezone).format(
      "MMM DD, YYYY hh:mm:ss a"
    )
  );
  var futureDate = new Date(currentDate.getTime() + hours * 60 * 60 * 1000);

  return providedDate < futureDate;
}

function toggleLinkTab(type) {
  if (type === "totalClass") {
    $("#totalClassBtn")
      .addClass("text-white bg-primary")
      .removeClass("text-dark bg-transparent");

    $("#totalClassForWeekBtn")
      .addClass("text-dark bg-transparent")
      .removeClass("text-white bg-primary");
    $("#totalClassSection").removeClass("d-none").addClass("d-flex");
    $("#totalClassForWeekBtnSection").addClass("d-none").removeClass("d-flex");
  } else {
    $("#totalClassForWeekBtn")
      .addClass("text-white bg-primary")
      .removeClass("text-dark bg-transparent");
    $("#totalClassBtn")
      .addClass("text-dark bg-transparent")
      .removeClass("text-white bg-primary");
    $("#totalClassForWeekBtnSection").removeClass("d-none").addClass("d-flex");
    $("#totalClassSection").removeClass("d-flex").addClass("d-none");
  }
}

function getClassTypeColor(index) {
  var color = ["primary", "success", "warning", "danger"];
  if (typeof index !== "number" || index < 0 || index >= colors.length) {
    console.error("Invalid Number");
  } else {
    return color[index];
  }
}
