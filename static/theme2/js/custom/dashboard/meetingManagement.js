var currentPageOneDay = 1;
var currentPageRecurring = 1;
var currentPageRecurringRecording = 1;
var currentTabId = "oneDayMeetings";
var selectedHostKey = null;
var selectedRole = null;
var selectedHostName = null;
var selectedHostTimezone = null;
var selectedHostTimezoneName = null;
var selectedHostTimezoneUTC = null;
var isHaveRecurringMeetings = null;
var hostsData = getHostsOnly();
const allowedUsers = getSettingsByTypeAndKey('CONFIGURATION','ALLOW_SEEING_ALL_MEETINGS');
var allowedUserIds = JSON.parse(allowedUsers).data.metaValue.split(",").map(id => id.trim());
const isUserAllowed = allowedUserIds.includes(USER_ID.toString());
var selectedAttendees = [];
var cachedUserList = [];
var recordingTitle = null;
var timeOptions = [];
var getRecordingLimit = getSettingsByTypeAndKey("CONFIGURATION", "SHOW_RECORDINGS_LIMIT");
getRecordingLimit = JSON.parse(getRecordingLimit);
var recordingLimit = getRecordingLimit.data.metaValue;
const isUserAllowedRecordings = fetchUserIdToShowRecordings();
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 5) {
    let timeString = hour.toString().padStart(2, "0") + minute.toString().padStart(2, "0");
    timeOptions.push(timeString);
  }
}

function updateAvailableTimes() {
  const currentTimeString = changeDateFormat(convertTZ(new Date(), selectedHostTimezoneName == null ? USER_TIMEZONE : selectedHostTimezoneName ), 'yyyy-mm-dd hh:mm:ss');
  const [currentDate, currentTime] = currentTimeString.split(' ');
  const [currentHour, currentMinute] = currentTime.split(':').map(Number);
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const selectedDate = $('#when').datepicker('getDate');

  const $timeDropdown = $('#hour');
  const $ampmDropdown = $('#ampm');

  $timeDropdown.empty();
  $ampmDropdown.empty();

  const isToday = selectedDate && changeDateFormat(selectedDate, "yyyy-mm-dd") === currentDate;

  const availableTimes = timeOptions.filter((time) => {
    const hours = parseInt(time.substring(0, 2), 10);
    const minutes = parseInt(time.substring(2), 10);
    const optionTimeInMinutes = hours * 60 + minutes;

    return !isToday || optionTimeInMinutes > currentTimeInMinutes;
  });

  availableTimes.forEach((time) => {
    const formattedTime = formatTime(time);
    $timeDropdown.append(
      $('<option>', { value: time, text: formattedTime })
    );
  });
 
  const uniquePeriods = [...new Set(
    availableTimes.map((time) => {
      const hours = parseInt(time.substring(0, 2), 10);
      return hours < 12 ? 'AM' : 'PM';
    })
  )];

  uniquePeriods.forEach((period) => {
    $ampmDropdown.append(
      $('<option>', { value: period, text: period })
    );
  });

  $timeDropdown.on('change', function () {
    const selectedTime = $(this).val();
    const hours = parseInt(selectedTime?.substring(0, 2), 10);
    const period = hours < 12 ? 'AM' : 'PM';

    $ampmDropdown.empty();
    $ampmDropdown.append(
      $('<option>', { value: period, text: period })
    );
  });

  $timeDropdown.trigger('change');
}

function formatTime(time) {
  const hours = parseInt(time.substring(0, 2), 10);
  const minutes = time.substring(2);
  const period = hours < 12 ? 'AM' : 'PM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${formattedHours}:${minutes} ${period}`;
}

function saveFilterState() {
  var filterState = getFilterState();
  let selectedKeys = $("#filterHostUserId").val();
  
  if (!Array.isArray(selectedKeys)) {
    selectedKeys = selectedKeys ? [selectedKeys] : [];
  }

  filterState.filterHostUserId = selectedKeys.join(',');
  filterState.filterGeneralMeetingType = $("#filterGeneralMeetingType").val();
  filterState.filterDateDuration = $("#filterDateDuration").val();
  filterState.filterMeetingStartDate = $("#filterMeetingStartDate").val();
  filterState.filterMeetingEndDate = $("#filterMeetingEndDate").val();
}

$(document).on("change", "#filterMeeting input, #filterMeeting select", function () {
  saveFilterState();
});

function fetchMetaValue() {
  try {
    const metaValue = getSettingsByTypeAndKey('CONFIGURATION','SHOW_RECURRING_MEETINGS');
    if (metaValue == "false") {
      $('label:contains("Recurring meeting")').hide();
      $('#recurringTab').hide();
    }
  } catch (error) {
    console.error("Error retrieving settings:", error);
  }
}

function fetchUserIdToShowRecurringMeeting() {
  try {
    const val = getSettingsByTypeAndKey('CONFIGURATION','RECURRING_ACCESS_USERS');
    const allowedUserIdRecurring = JSON.parse(val).data.metaValue.split(",").map(id => id.trim());
    const isUserAllowedRecurring = allowedUserIdRecurring.includes(USER_ID.toString());
    if (!isUserAllowedRecurring) {
      $('label:contains("Recurring meeting")').hide();
      $('#recurringTab').hide();
    }
    if(!isUserAllowedRecurring && isHaveRecurringMeetings > 0) {
      $('#recurringTab').show();
      $('.trRecur').removeClass('hover-blue');
      $('.tdRecur').removeClass('hover-blue');
      $('.tdRecur').attr('style', 'cursor: auto !important;padding-left: 12px !important;');
      $('.tdRecur').off('click').removeAttr('onclick');
      $('.tdBtns').attr('style', 'display: none;');
      $('.meetingHostNameTd').attr('style', 'display: none;');
      $('.btnRecur').attr('disabled', 'true');
      $('.btnRecur').css('display', 'none');
      // $('#recurringMeetingActionTh').css('display', 'none');
      // $('#recurringMeetingTitleTh').css('border-radius','10px')
      if(currentTabId == "recurringMeetings"){
        $('#scheduleMeetingBtn').hide();
        $('.tabs').css('height', '60px');
      }
    }
  } catch (error) {
    console.error("Error retrieving settings:", error);
  }
}

function fetchUserIdToShowRecordings() {
  try {
    const val = getSettingsByTypeAndKey('CONFIGURATION','ALL_RECORDINGS_ACCESS_USERS');
    const allowedUserIdRecordings = JSON.parse(val).data.metaValue.split(",").map(id => id.trim());
    return allowedUserIdRecordings.includes(USER_ID.toString());
  } catch (error) {
    console.error("Error retrieving settings:", error);
  }
}

async function fetchUserIdToShowAllMeeting() {
  customLoader(true);
  try {
    if (!isUserAllowed) {
      $("<style>")
        .prop("type", "text/css")
        .html(`
          #select2-host-container{
            cursor: not-allowed !important;
          }
          #select2-filterHostUserId-container{
            cursor: not-allowed !important;
          }
        `)
      .appendTo("head");
      $("#filterHostUserId").attr("disabled", true);
      // if(currentTabId == "recurringMeetings") {
      //   $("#filterSearchButton").attr("disabled", true);
      //   $("#filterResetButton").attr("disabled", true);
      // } else {
      //    $("#filterSearchButton").attr("disabled", false);
      //   $("#filterResetButton").attr("disabled", false);
      // }
      var hostDetails=getHostDetails(USER_ID);
      getHostList(hostDetails);
      getHostListForFilter(hostDetails, isUserAllowed);
      $("#filterHostUserId").select2({
        placeholder: "Select Host",
        allowClear: true,
      });
      getAllTimeZone(USER_TIMEZONE);
      $("#host").attr("disabled", true);
      $("#timezone").attr("disabled", true);
      $("#meetingHostNameTh").css("display", "none");
      $("#recurringMeetingHostTh").css("display", "none");
      $(".meetingHostNameTd").css("display", "none");
      $("#meetingTitleTh").css("width", "25%");
      $("#meetingDurationTh").css("width", "30%");
      $("#recurringMeetingTitleTh").css("width", "40%");
      $("#recurringMeetingGeneralMeetingTypeTh").css("width", "40%");
    } else {
      $("#filterHostUserId").select2({
        placeholder: "Select Hosts",
        allowClear: true,
        multiple: true
      });
    }
  } catch (error) {
    console.error("Error retrieving settings:", error);
  }
  customLoader(false);
}

function resetRequiredFormData(hostId) {
  $(hostId).val('');
  $(hostId).trigger('change');
  $('#generalMeetingType').val('');
  $('#generalMeetingType').trigger('change');
  $("#topic").val('');
  $("#attendees").val('');
  selectedAttendees = [];
  $(".badge").remove();
  $("#when").val('');
  $("#hour").val('');
  $("#hour").trigger('change');
  $("#durationHour").val('00');
  $("#durationMinute").val('00');
  getAllTimeZone({key: ''});
  fetchUserIdToShowAllMeeting();
}

function getMeetingType() {
  const selectedType = $('input[name="meetingType"]:checked').val();

  if (selectedType == "2") {
    $('#attendeesContainer').hide();
    $('#whenContainer').hide();
    $('#durationContainer').hide();
    $('#when, #hour, #ampm, #durationHour, #durationMinute').prop('required', false);
  } else {
    $('#attendeesContainer').css('display', 'flex');
    $('#whenContainer').css('display', 'flex');
    $('#durationContainer').css('display', 'flex');
    $('#when, #hour, #ampm, #durationHour, #durationMinute').prop('required', true);
  }
  return selectedType;
}

function renderMeetingManagementContent() {
  $("#meetingManagementMainDiv").append(getMeetingManagementContent());
  fetchUserIdToShowAllMeeting();
  fetchUserIdToShowRecurringMeeting();
  if (currentTabId === "recurringMeetings") {
    $("#filterDateDuration").hide();
    $("#filterMeetingStartDate").hide();
    $("#filterMeetingEndDate").hide();
  }

  $(document).on('click', function (e) {
    if (!$(e.target).closest("#dynamic-attendees-list").length) {
      $("#dynamic-attendees-list").hide();
    }
  });

  $("#attendees").off("keypress").on("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (cachedUserList.length === 1) {
        const firstUser = cachedUserList[0];
        addAttendee(firstUser.userId, firstUser.userName);
        $("#dynamic-attendees-list").hide();
        $(this).val("");
      } else {
        handleAddAttendee();
        $("#dynamic-attendees-list").hide();
      }
    }
  });

  $("<style>")
  .prop("type", "text/css")
  .html(`
    .unique-loader {
      height: 100svh;
      width: 100vw;
      position: fixed;
      top: 0;
      right: 0;
      background-color: #00000055;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999999;
    }

    .loader-bg {
      background: rgba(0, 0, 0, 0.5);
      width: 100%;
      height: 100%;
      min-height: 100%;
      z-index: 9999;
      left: 0;
      top: 0;
      position: fixed;
    }

    .new-loader-2024 {
      width: 13%;
    }

    .tabs {
      display: flex;
      gap: 30px;
      margin-bottom: 10px;
      position: relative;
      border-bottom: 2px solid #e3e3e3;
    }

    .tab-button {
      padding: 0px;
      cursor: pointer;
      border: none;
      background-color: transparent;
      position: relative;
      transition: color 0.3s ease;
      font-size: 16px;
      color: #888888;
      font-weight: bold;
    }

    .tab-button:focus {
     outline: 0px auto -webkit-focus-ring-color;
    }

    .tab-button.active {
      color: #027FFF;
    }

    .active-line {
      position: absolute;
      bottom: -2px;
      height: 2px;
      background-color: #027FFF;
      transition: all 0.3s ease;
      border-radius: 50px;
    }
   
    .disabled {
      cursor: not-allowed !important;
    }
    .page-item.active .page-link {
      z-index: 1;
      background-color: #E4F2FF !important;
      color: black !important;
      border-radius: 6px !important;
      border: 1px solid #027FFF !important;
    }
    .select2-container--default .select2-selection--multiple .select2-selection__rendered li {
      margin-top: 5px !important;
    }
    .select2-container .select2-search--inline .select2-search__field {
      margin-top: 5px !important;
    }
  `)
  .appendTo("head");
  setDateToToday('#filterMeetingStartDate, #filterMeetingEndDate');
  var hostDetails=getHostDetails(USER_ID);
  getHostListForFilter(hostDetails, isUserAllowed);
  getGeneralMeetingTypeList('#filterGeneralMeetingType');
  fetchMeetings($('#filterHostUserId').val());
  $("#filterMeetingStartDate, #filterMeetingEndDate").on("change", function () {
    const formattedDate = changeDateFormat(new Date(this.value), "MMM-dd-yyyy");
    if(formattedDate == "undefined 0NaN, NaN"){
      $(this).val('');
    } else {
      $(this).val(formattedDate);
    }
  });

  $('#filterMeetingStartDate').datepicker({
    format: 'M dd, yyyy',
    autoclose: true
  }).on('changeDate', function (e) {
    $('#filterMeetingEndDate').val('');
    $('#filterMeetingEndDate').datepicker('setStartDate', e.date);
  });

  $('#filterMeetingEndDate').datepicker({
    format: 'M dd, yyyy',
    autoclose: true
  });
}

function backToList(buttonId) {
  if(buttonId != undefined){
    $(buttonId).off('click').on('click', function() {
      $("#meetingFormDiv, #savedMeetingLinkHtml").hide();
      $("#filterFormAndList").show();
      fetchUserIdToShowAllMeeting();
      resetRequiredFormData('#host');
      fetchMeetings($('#filterHostUserId').val());
    });
  }else{
    $("#meetingFormDiv, #savedMeetingLinkHtml").hide();
    $("#filterFormAndList").show();
    fetchUserIdToShowAllMeeting();
    resetRequiredFormData('#host');
    fetchMeetings($('#filterHostUserId').val());
  }
}

function setFilterDatesAccordingly(src, startDateId, endDateId){
  const value = $(src).val();
  const today = new Date();

  const getStartOfWeek = (date) => {
    const diff = date.getDate() - date.getDay();
    return new Date(date.setDate(diff));
  };

  const getEndOfWeek = (date) => {
    const startOfWeek = getStartOfWeek(date);
    return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
  };

  const getStartOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getEndOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };
  if (value === 'Today') {
    const formattedToday = changeDateFormat(today, "MMM-dd-yyyy");
    $(startDateId + "," + endDateId)
      .val(formattedToday)
      .prop('disabled', true);
  } else if (value === 'Week') {
    $(startDateId).val(changeDateFormat(getStartOfWeek(today), "MMM-dd-yyyy")).prop('disabled', true);
    $(endDateId).val(changeDateFormat(getEndOfWeek(today), "MMM-dd-yyyy")).prop('disabled', true);
  } else if (value === 'Month') {
    $(startDateId).val(changeDateFormat(getStartOfMonth(today), "MMM-dd-yyyy")).prop('disabled', true);
    $(endDateId).val(changeDateFormat(getEndOfMonth(today), "MMM-dd-yyyy")).prop('disabled', true);
  } else {
    $(startDateId + "," + endDateId).val('').prop('disabled', false);
  }
}

function setDateToToday(startAndEndDateIds) {
  const today = new Date();

  const formattedToday = changeDateFormat(today, "MMM-dd-yyyy");
    $(startAndEndDateIds)
      .val(formattedToday)
      .prop('disabled', true);
}

function goToPage(page) {
  if($("#recurringMeetingModal").length == 1){
    currentPageRecurringRecording = page;
    applyRecurringRecordingFilters($("#recurringMeetingModal").data("entityId"));
  } else {
    if(currentTabId === "oneDayMeetings") {
      currentPageOneDay = page;
    } else if (currentTabId === "recurringMeetings") {
      currentPageRecurring = page;
    }
    fetchMeetings($('#filterHostUserId').val());
  }
}

function renderPagination(currentPage, totalPages) {
  let paginationHtml = `
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
          <button class="page-link" onclick="goToPage(${currentPage - 1})"><i class="fa fa-chevron-left mr-2" style="font-size: 10px;"></i>Previous</button>
        </li>`;

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (startPage > 1) {
    paginationHtml += `
      <li class="page-item">
        <button class="page-link" onclick="goToPage(1)">1</button>
      </li>`;
    if (startPage > 2) {
      paginationHtml += `
        <li class="page-item">
          <span class="page-link" style="background: transparent; border: 0px; padding: 6px 0px;">...</span>
        </li>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHtml += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <button class="page-link" onclick="goToPage(${i})">${i}</button>
      </li>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHtml += `
        <li class="page-item">
          <span style="background: transparent; border: 0px; padding: 6px 0px;">...</span>
        </li>`;
    }
    paginationHtml += `
      <li class="page-item">
        <button class="page-link" onclick="goToPage(${totalPages})">${totalPages}</button>
      </li>`;
  }

  paginationHtml += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
          <button class="page-link" onclick="goToPage(${currentPage + 1})">Next<i class="fa fa-chevron-right ml-2" style="font-size: 10px;"></i></button>
        </li>
      </ul>
    </nav>`;

  return paginationHtml;
}

async function fetchMeetings(filterHostUserId) {
  customLoader(true);
  filterHostUserId = [filterHostUserId];
  filterHostUserId = filterHostUserId.join(',');
  const body = {
    title: $("#filterTitle").val(),
    hostUserId: filterHostUserId,
    meetingType: $("#filterGeneralMeetingType").val(),
    meetingStartDate: $("#filterMeetingStartDate").val() == '' ? '' : changeDateFormat(new Date($("#filterMeetingStartDate").val()), "yyyy-mm-dd"),
    meetingEndDate: $("#filterMeetingEndDate").val() == '' ? '' : changeDateFormat(new Date($("#filterMeetingEndDate").val()), "yyyy-mm-dd"),
    limit: $("#limit").val() ? $("#limit").val() : 10,
    pageNo: currentTabId === "oneDayMeetings" ? currentPageOneDay : currentPageRecurring,
    userId: USER_ID
  };

  $.ajax({
    url: BASE_URL + CONTEXT_PATH + "api/v1/get-all-meetings",
    method: "POST",
    data: JSON.stringify(body),
    contentType: "application/json",
    success: function (response) {
      const res = JSON.parse(response);

      var totalPageOneDay = res.data.meetingsTotalPages;
      var totalPageRecurring = res.data.recurringMeetingsTotalPages;

      isHaveRecurringMeetings = res.data.recurringMeetingsTotalPages;

      const oneDayMeetingsHtml = renderMeetings(res.data.meetings, false, totalPageOneDay, totalPageRecurring);
      const recurringMeetingsHtml = renderMeetings(res.data.recurringMeetings, true, totalPageOneDay, totalPageRecurring);

      const paginationHtml = currentTabId === "oneDayMeetings"
        ? renderPagination(currentPageOneDay, totalPageOneDay)
        : renderPagination(currentPageRecurring, totalPageRecurring);

      const responseHtml = `
        <div class="tabs" style="position: relative;">
          <button class="tab-button" id="oneDayTab" onclick="showTab('oneDayMeetings')">One Day Meetings</button>
          <button class="tab-button" id="recurringTab" onclick="showTab('recurringMeetings')">Recurring Meetings</button>
          <div class="active-line"></div>
          <button onclick="showMeetingForm()" class="btn my-3 ml-auto rounded scheduleAButtonRight" style="width: max-content; background-color: #027FFF; padding: 10px 20px; font-weight: bold; cursor: pointer;" id="scheduleMeetingBtn">Schedule a New Meeting</button>
        </div>
        ${res.data.meetingsTotalPages == 0 && res.data.recurringMeetingsTotalPages == 0 ?
          `
            <div class="d-flex flex-column justify-content-center align-items-center" style="height: 250px;">
              <h1 style="font-weight: bold;">Welcome To IS Meetings!</h1>
              <button onclick="showMeetingForm()" class="btn my-3 rounded" style="width: max-content; background-color: #027FFF; padding: 10px 20px; font-weight: bold; cursor: pointer;" id="scheduleMeetingBtn">Schedule a New Meeting</button>
            </div>
          `
          :
          `
            <div class="tab-content">
              <div id="oneDayMeetings" class="tab-pane">${oneDayMeetingsHtml}</div>
              <div id="recurringMeetings" class="tab-pane">${recurringMeetingsHtml}</div>
            </div>
            ${paginationHtml}
          `
        }
      `;

      $("#meetingTableContainer").html(responseHtml);

      if(res.data.meetingsTotalPages == 0 && res.data.recurringMeetingsTotalPages == 0) {
        $(".scheduleAButtonRight").hide();
        $(".tabs").css("padding", "16px 0px");
      }

      if (totalPageOneDay == 0 && currentTabId == "oneDayMeetings") {
        $(".pagination").hide();
      } else if(totalPageRecurring == 0 && currentTabId == "recurringMeetings") {
        $(".pagination").hide();
      } else {
        $(".pagination").show();
      }

      setTimeout(() => {
        $(".tab-button").removeClass('hover-blue');("active");
        $(`#${currentTabId === 'oneDayMeetings' ? 'oneDayTab' : 'recurringTab'}`).addClass("active");
        $(".tab-pane").hide();
        $(`#${currentTabId}`).show();
        const activeButton = $(".tab-button.active");
        const line = $(".active-line");
        line.css({
          width: activeButton.outerWidth(),
          left: activeButton.position()?.left,
        });
      }, 100);

      fetchMetaValue();
      fetchUserIdToShowAllMeeting();
      fetchUserIdToShowRecurringMeeting();
    },
    error: function () {
      showMessageTheme2(0, "Failed to fetch meetings.");
    }
  });
  customLoader(false);
}

function showTab(tabId) {
  currentTabId = tabId;
  $(".tab-button").removeClass('hover-blue');("active");
  $(`#${tabId === 'oneDayMeetings' ? 'oneDayTab' : 'recurringTab'}`).addClass("active");
  $(".tab-pane").hide();
  $(`#${tabId}`).show();

  const activeButton = $(".tab-button.active");
  const line = $(".active-line");
  line.css({
    width: activeButton.outerWidth(),
    left: activeButton.position()?.left,
  });

  if (tabId === "recurringMeetings") {
    $("#filterDateDuration").hide();
    $("#filterMeetingStartDate").hide();
    $("#filterMeetingEndDate").hide();
  } else {
    $("#filterMeeting").css("display", "flex");
    $("#filterDateDuration").show();
    $("#filterMeetingStartDate").show();
    $("#filterMeetingEndDate").show();
  }
  fetchMeetings($('#filterHostUserId').val());
  fetchUserIdToShowAllMeeting();
  fetchUserIdToShowRecurringMeeting();
}

function applyFilters() {
  $('#filterMeeting').off('submit').on('submit', function(event) {
    event.preventDefault();
    fetchMeetings($('#filterHostUserId').val());
  });
}

function resetFilter() {
  $("#filterHostUserId").val('');
  $("#filterHostUserId").trigger('change');
  $("#filterGeneralMeetingType").val('');
  $("#filterGeneralMeetingType").trigger('change');
  fetchUserIdToShowAllMeeting();
  $("#filterDateDuration").val("Today");
  setDateToToday('#filterMeetingStartDate, #filterMeetingEndDate');
  currentPageOneDay = 1;
  currentPageRecurring = 1;
}

function renderMeetings(meetings, isRecurring = false, totalPageOneDay, totalPageRecurring) {
  $("<style>")
    .prop("type", "text/css")
    .html(`
      .hover-blue:hover {
        color: #027FFF;
      }
      table th:first-child{
        border-radius:10px 0 0 10px;
      }
      table th:last-child{
        border-radius:0 10px 10px 0;
      }
    `)
    .appendTo("head");
    if ((!isRecurring && totalPageOneDay == 0) || (!isRecurring && meetings.length == 0)) {
      return `
      <div style="text-align: center; font-size: 18px; color: #6e6e6e; margin: 20px 0;">
        No Meetings Found
      </div>`;
    }

    if (isRecurring && (totalPageRecurring == 0 || meetings.length == 0)) {
      return `
      <div style="text-align: center; font-size: 18px; color: #6e6e6e; margin: 20px 0;">
        No Recurring Meetings Found
      </div>`;
    }
   
  let title = isRecurring ? "Recurring Meetings" : "One Day Meetings";
  let meetingsHtml = `
    <div class="meeting-list">
      <table id="mainTable" class="w-100">
        <thead style="background-color: #EEEEEE;">
          ${title == "Recurring Meetings" ?
            `
              <tr style="font-size: 14px;">
                <th id="recurringMeetingTitleTh" class="p-3" style="padding-left:16px !important;border-bottom: 0; border-top: 0px; width: 30%;font-weight: bold;">Meeting Title</th>
                <th id="recurringMeetingGeneralMeetingTypeTh" class="p-3" style="padding-left:16px !important;border-bottom: 0; border-top: 0px; width: 30%;font-weight: bold;">Meeting Type</th>
                <th id="recurringMeetingHostTh" class="p-3" style="padding-left:16px !important;border-bottom: 0; border-top: 0px; width: 20%;font-weight: bold;">Host</th>
                <th id="recurringMeetingActionTh" class="p-3" style="border-bottom: 0; border-top: 0px; font-weight: bold;">Actions</th>
              </tr>
            `
            :
            `
              <tr style="font-size: 14px;">
                <th id="meetingTitleTh" class="p-3" style="padding-left:16px !important;border-bottom: 0; border-top: 0px; font-weight: bold;width: 20%;">Meeting Title</th>
                <th id="meetingGeneralMeetingTypeTh" class="p-3" style="padding-left:16px !important;border-bottom: 0; border-top: 0px; font-weight: bold;width: 20%;">Meeting Type</th>
                <th id="meetingHostNameTh" class="p-3" style="padding-left:16px !important;border-bottom: 0; border-top: 0px; font-weight: bold;width: 20%;">Host</th>
                <th id="meetingDurationTh" class="p-3" style="border-bottom: 0; border-top: 0px; font-weight: bold;width: 20%;">Duration/Timezone</th>
                <th class="p-3" style="border-bottom: 0; border-top: 0px; font-weight: bold;">Actions</th>
              </tr>
            `
          }
        </thead>
        <tbody>`;

  let currentDate = null;
  meetings.forEach((meeting, index) => {
    const currentDateTime = new Date(changeDateFormat(convertTZ(new Date(), USER_TIMEZONE), 'yyyy-mm-dd hh:mm:ss'))
    const endDateTime = new Date(meeting.endDateTime?.replace(" ", "T"));
    const disableButtonsOnEndTime = currentDateTime > endDateTime;
    const disableButtonsOnEnd = meeting?.meetingStatus == "ended" || meeting?.meetingStatus =="ENDED";
    const disableButtonsOnStart = meeting?.meetingStatus == "started" || meeting?.meetingStatus =="STARTED";
    const today = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    const meetingDate = new Date(meeting.startDateTime?.split(" ")[0]).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    const displayDate = meetingDate === today ? "Today" : changeDateFormat(new Date(meeting.startDateTime?.split(" ")[0]), "MMM-dd-yyyy");
    const meetingStartDate = changeDateFormat(new Date(meeting.startDateTime?.split(" ")[0]), "MMM-dd-yyyy");
    const meetingStartTime = meeting.timeRange?.split('-')[0]
    var meetingTitle = meeting.title.replace(/'/g, "\\'");
    var pastDateLimit = new Date();
    pastDateLimit.setDate(pastDateLimit.getDate() - recordingLimit);

    if (currentDate != displayDate && displayDate != "undefined 0NaN, NaN") {
      currentDate = displayDate;
      meetingsHtml += `
        <tr>
          <td colspan="5">
            <div class="rounded p-3 my-2" style="background-color: #FFEDD9; font-weight: bold;">
              ${displayDate}
            </div>
          </td>
        </tr>`;
    }

    meetingsHtml += `
      <tr id="meetingRow${meeting.meetingId}" class="${disableButtonsOnEndTime ? '' : 'hover-blue'} trRecur" style="font-weight: bold; border-bottom: 1px solid #eee;">
        ${title == "Recurring Meetings" ? `
          <td
            onclick="showMeetingDetails(${meeting.meetingId})"
            style="cursor: pointer; padding-left: 12px !important;"
            class="hover-blue py-4 tdRecur">
            ${meeting.title}
          </td>
          <td
            onclick="showMeetingDetails(${meeting.meetingId})"
            style="cursor: pointer; padding-left: 12px !important;"
            class="hover-blue py-4 tdRecur">
            ${meeting.gmType}
          </td>
          <td
            onclick="showMeetingDetails(${meeting.meetingId})"
            style="cursor: pointer; padding-left: 12px !important;"
            class="hover-blue py-4 tdRecur meetingHostNameTd">
            ${meeting.hostName}
          </td>
          <td class=''>
            <button onclick="startLensUrl('${meeting.meetingId}', '${meetingTitle}', '${meetingStartDate}', '${meetingStartTime}')" class="btn rounded btnRecur tdBtns" style="padding: 6px 14px; font-size: 16px; background-color: #027FFF; font-weight: bold; text-transform: capitalize;">Start</button>
            <button onclick="showWarningMessage('Are you sure you want to delete this meeting?', 'deleteMeeting(${meeting.meetingId})')" style="border: 0; background: transparent; color: #FF0000 !important; padding: 5px; box-shadow: 0px 0px transparent;" class="btn btn-sm btnRecur tdBtns"><i class="fa fa-trash" style="font-size: 20px;"></i></button>
            <button onclick="copyJoinUrl('${meeting.meetingId}')" style="border: 0; background: transparent; color: #3E3E3E !important; padding: 5px; box-shadow: 0px 0px transparent;" class="btn btn-sm btnRecur tdBtns" title="Copy invite"><i style="font-size: 20px;" class="fa fa-clone"></i></button>
            ${meeting.recordingsCount > 0 ?
            `<button onclick="showRecurringMeetingRecordings('${meeting.meetingId}','${meeting.title}','${meeting.hostName}')" style="border: 0; background: transparent; color: #027FFF !important; padding: 5px; box-shadow: 0px 0px transparent;" class="btn btn-sm" title="Play Recording"><i class="fa fa-video-camera" style="font-size: 20px;"></i></button>`
            :
            ``
            }
          </td>
        ` : `
          <td
            onclick="${disableButtonsOnEndTime ? '' : `event.preventDefault(); showMeetingDetails(${meeting.meetingId})`}"
            style="cursor: ${disableButtonsOnEndTime ? '' : 'pointer'}; padding-left: 12px !important;"
            class="py-4 ${disableButtonsOnEndTime ? '' : 'hover-blue'}">
            ${meeting.title}
          </td>

          <td
            onclick="${disableButtonsOnEndTime ? '' : `event.preventDefault(); showMeetingDetails(${meeting.meetingId})`}"
            style="cursor: ${disableButtonsOnEndTime ? '' : 'pointer'}; padding-left: 12px !important;"
            class="py-4 ${disableButtonsOnEndTime ? '' : 'hover-blue'}">
            ${meeting.gmType}
          </td>

          <td
            onclick="${disableButtonsOnEndTime ? '' : `event.preventDefault(); showMeetingDetails(${meeting.meetingId})`}"
            style="cursor: ${disableButtonsOnEndTime ? '' : 'pointer'}; padding-left: 12px !important;"
            class="py-4 meetingHostNameTd ${disableButtonsOnEndTime ? '' : 'hover-blue'}">
            ${meeting.hostName}
          </td>

          <td
            onclick="${disableButtonsOnEndTime ? '' : `event.preventDefault(); showMeetingDetails(${meeting.meetingId})`}"
            style="cursor: ${disableButtonsOnEndTime ? '' : 'pointer'};"
            class="${disableButtonsOnEndTime ? '' : 'hover-blue'}">
            ${meeting.timeRange}
            <br/>
            ${meeting.timezoneName}
          </td>
          <td>
            <button onclick="startLensUrl('${meeting.meetingId}', '${meetingTitle}', '${meetingStartDate}', '${meetingStartTime}')" class="btn rounded" style="padding: 6px 14px; font-size: 16px; background-color: #027FFF; font-weight: bold; text-transform: capitalize;" ${disableButtonsOnEndTime ? "disabled" : ""}>Start</button>
            <button onclick="showWarningMessage('Are you sure you want to delete this meeting?', 'deleteMeeting(${meeting.meetingId})')" style="border: 0; background: transparent; color: #FF0000 !important; padding: 5px; box-shadow: 0px 0px transparent;" class="btn btn-sm" ${disableButtonsOnEndTime ? "disabled" : ""}><i class="fa fa-trash" style="font-size: 20px;"></i></button>
            <button onclick="copyJoinUrl('${meeting.meetingId}')" style="border: 0; background: transparent; color: #3E3E3E !important; padding: 5px; box-shadow: 0px 0px transparent;" class="btn btn-sm" title="Copy invite" ${disableButtonsOnEndTime ? "disabled" : ""}><i style="font-size: 20px;" class="fa fa-clone"></i></button>
            ${
              (isUserAllowedRecordings && meeting.recordingsCount > 0) || 
              (!isUserAllowedRecordings && meeting.recordingsCount > 0 && new Date(meetingStartDate).setHours(0,0,0,0) >= new Date(pastDateLimit).setHours(0,0,0,0)) 
              ?
              `<button onclick="openRecordingModal('${meeting.meetingId}', 'GENERAL_MEETINGS','${meeting.startDateTime?.split(" ")[0]}', '${meeting.title}', '${meeting.timeRange.split('-')[0]}', '${meeting.hostName}')" 
                    style="border: 0; background: transparent; color: #027FFF !important; padding: 5px; box-shadow: 0px 0px transparent;" 
                    class="btn btn-sm" title="Play Recording">
                <i class="fa fa-video-camera" style="font-size: 20px;"></i>
              </button>` 
              : ``
            }
          </td>
        `}
      </tr>
    `;
  });

  meetingsHtml += `
        </tbody>
      </table>
    </div>`;
  return meetingsHtml;
}

function showMeetingForm() {
  $("#meetingFormDiv").show();
  $("#filterFormAndList, #savedMeetingLinkHtml").hide();
  $("#meetingTypeContainer").css("display", "flex")

  if(currentTabId == "recurringMeetings") {
    $('input[name="meetingType"][value="2"]').prop("checked", true);
  }else{
    $('input[name="meetingType"][value="1"]').prop("checked", true);
  }
  $('#when').datepicker({
    format: 'M dd, yyyy',
    startDate: new Date(changeDateFormat(convertTZ(new Date(), selectedHostTimezoneName == null ? USER_TIMEZONE : selectedHostTimezoneName ), 'yyyy-mm-dd hh:mm:ss')),
    autoclose: true,
  }).on('changeDate', updateAvailableTimes);
  $('#hour').select2({
    placeholder: "Select Time",
    allowClear: true
  });

  getMeetingType();
  fetchMetaValue();
  fetchUserIdToShowRecurringMeeting();
  getHostList();
  getAllTimeZone();
  initializeMeetingForm();
  fetchUserIdToShowAllMeeting();
  updateAvailableTimes();
  getGeneralMeetingTypeList('#generalMeetingType');
  $("<style>")
    .prop("type", "text/css")
    .html(`
      #select2-timezone-container{
        cursor: not-allowed !important;
      }
    `)
  .appendTo("head");
  backToList("#backFromForm");
}

function updateNewDateInCalender() {
  $('#when').datepicker('update', '');
  $('#when').datepicker('remove');
  $('#when').datepicker({
    format: 'M dd, yyyy',
    startDate: new Date(changeDateFormat(convertTZ(new Date(), selectedHostTimezoneName == null ? USER_TIMEZONE : selectedHostTimezoneName ), 'yyyy-mm-dd hh:mm:ss')),
    autoclose: true,
  });
}


function initializeMeetingForm() {
  $('#meetingForm').off('submit').on('submit', function(event) {
    event.preventDefault();
    const formData = getMeetingFormData();
    submitMeetingForm(formData);
  });

  $('#meetingForm').on('keypress', function(event) {
    if (event.keyCode === 13) {
      if (event.target.id === 'attendees') {
        event.preventDefault();
        handleAddAttendee();
        $("#dynamic-attendees-list").hide();
      } else {
        event.preventDefault();
      }
    }
  });
}

function getMeetingFormData() {
  const dateInput = $('#when').val();
  const date = new Date(dateInput);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;

  const dayId = getDayId();
  const meetingType = getMeetingType();

  if (meetingType === "2") {
    return {
      userId: USER_ID,
      gmType: $("#generalMeetingType").val(),
      title: $('#topic').val(),
      hostUserId: $('#host').val(),
      timezone: $('#timezone').val(),
      schoolId: SCHOOL_ID,
      meetingType: meetingType,
    };
  }
  return {
    userId: USER_ID,
    gmType: $("#generalMeetingType").val(),
    title: $('#topic').val(),
    startDate: formattedDate,
    startTime: convertToAmPmForSaveBody(`${$('#hour').val()}`),
    duration: `${$('#durationHour').val()}:${$('#durationMinute').val()}`,
    hostUserId: $('#host').val(),
    attendees: selectedAttendees.map(user => user.userId).join(',').trim(),
    timezone: $('#timezone').val(),
    schoolId: SCHOOL_ID,
    dayId: dayId,
    meetingType: meetingType,
  };
}

function convertToAmPmForSaveBody(time) {
  const hours = parseInt(time.slice(0, 2), 10);
  const minutes = time.slice(2, 4);
 
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHour = hours % 12 || 12;
  return `${formattedHour}:${minutes} ${period}`;
}

function convertToAmPm(time) {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${period}`;
}

function submitMeetingForm(formData) {
  if($("#generalMeetingType").val() == ''){
    showMessageTheme2(0, "Please select a topic.")
  }else if(formData.duration == "00:00") {
    showErrorPopup("The duration cannot be set to 00 hours and 00 minutes. Please specify a valid time.");
    return;
  } else if($("#attendees").val() != ''){
    showMessageTheme2(0, "Please clear the 'Attendees' field or select attendee(s) to move forward.")
  } else {
    $.ajax({
      url: BASE_URL+CONTEXT_PATH+'api/v1/save-councellor-meeting',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function(response) {
        const res = JSON.parse(response);
        if (res.status == "failed") {
          const topic = res.data.title;
          const selectedDate = changeDateFormat(new Date($("#when").val()), "MMM-dd-yyyy")
          const startTime = convertToAmPm(res.data.startTime);
          const endTime = convertToAmPm(res.data.endTime);
          const timeRange = startTime + " - " + endTime
          showConflictPopUp(topic, selectedDate, timeRange);
          return;
        }
        const meetingId = res.data.meetingId;

        const hostDetails = {
          key : res.data.hostUserId,
          extra : res.data.hostName,
          extra1 : res.data.hostEmail,
          extra4 : res.data.roleName
        }
        const timezoneDetails = {
          key: res.data.timezone,
          extra: res.data.offset,
          value: res.data.countryTimezone
        }
        const allAttendees = res.data.allAttendees;
        savedMeetingDetails(meetingId, formData, hostDetails, timezoneDetails, allAttendees);
      },
      error: function() {
        showMessageTheme2(0, 'Failed to save the meeting.');
      }
    });
  }
}

function deleteMeeting(meetingId) {
  const formData = {
    "meetingId": meetingId,
    "type": "D"
  }
  $.ajax({
    url: BASE_URL+CONTEXT_PATH+'api/v1/update-councellor-meeting',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(formData),
    success: function() {
      customLoader(false);
      showMessageTheme2(1, "Meeting Deleted Successfully");
      $("#meetingRow"+meetingId).remove();
      backToList();
    },
    error: function() {
      customLoader(false);
      showMessageTheme2(0 ,"Failed to delete the meeting.");
    }
  });
}

function showMeetingDetails(meetingId) {
  $.ajax({
    url: BASE_URL+CONTEXT_PATH+`api/v1/get-meeting-details?meetingId=${meetingId}&userId=${USER_ID}`,
    method: 'GET',
    contentType: 'application/json',
    success: function(response) {
      try {
        if (response) {
          const meeting = JSON.parse(response);
          const formData = {
            title: meeting.data.title,
            startDate: meeting.data.meetingStartDateTime?.split(" ")[0],
            startTime: meeting.data.meetingStartDateTime?.split(" ")[1],
            duration: meeting.data.duration,
            timezone: meeting.data.countryTimezone,
            attendeesEmail: meeting.data.attendeesEmail,
            meetingStatus: meeting.data.meetingStatus,
            meetingType: meeting.data.meetingType,
            meetingEndDateTime: meeting.data.meetingEndDateTime,
            gmType: meeting.data.gmType
          }
          const hostDetails = {
            key : meeting.data.hostUserId,
            extra : meeting.data.hostName,
            extra1 : meeting.data.hostEmail,
            extra4 : meeting.data.roleName
          }

          const timezoneDetails = {
            key: meeting.data.timezone,
            extra: meeting.data.offset,
            value: meeting.data.countryTimezone
          }
          const allAttendees = meeting.data.allAttendees
          savedMeetingDetails(meetingId, formData, hostDetails, timezoneDetails, allAttendees);
        } else {
          throw new Error("Empty or invalid response received.");
        }
      } catch (e) {
        console.error("Error parsing JSON response: ", e.message);
        showMessageTheme2(0, 'Failed to parse the meeting data.');
      }
    }
  })
}

function savedMeetingDetails(meetingId, formData, hostDetails, timezoneDetails, allAttendees){
  let hour = null, minute = null, formattedDate = null;
  if (formData.meetingType == "1") {
    hour = formData.duration.split(":")[0];
    minute = formData.duration.split(":")[1];
    formattedDate = changeDateFormat(new Date(formData.startDate), "MMM-dd-yyyy");
  }
  let joinUrl = joinLensUrl(""+meetingId, formData.title);
  const meetingTypeName = formData.meetingType == "1" ? "One Day Meeting" : "Recurring Meeting"
  const currentDateTime = new Date(changeDateFormat(convertTZ(new Date(), USER_TIMEZONE), 'yyyy-mm-dd hh:mm:ss'))
  const endDateTime = new Date(formData.meetingEndDateTime?.replace(" ", "T"));
  var meetingTitle = formData.title.replace(/'/g, "\\'");
  let attendeesList = "Not Available";
  if (allAttendees?.length > 0) {
    attendeesList = `<ul style="list-style: none; padding: 0;">`;
    attendeesList += allAttendees?.map(a => {
      let icon;
      switch (a.attendee.emailSent) {
        case 'Y':
          icon = '<span data-toggle="tooltip" data-placement="top" data-original-title="Email Sent"><i class="fa fa-check-circle" style="color: #228B22; font-size:16px;" aria-hidden="true"></i></span>';
          break;
        case 'N':
          icon = '<span data-toggle="tooltip" data-placement="top" data-original-title="Email Not Sent"><i class="fa fa-times-circle" style="color: #D22B2B; font-size:16px;" aria-hidden="true"></i></span>';
          break;
        case 'U':
          icon = '<span data-toggle="tooltip" data-placement="top" data-original-title="Unverified"><i class="fa fa-minus-circle" style="color: #E5741A; font-size:16px;" aria-hidden="true"></i></span>';
          break;
        default:
          icon = '';
      }
      return `<li style="display: flex; align-items: center; gap: 8px;">
          ${a.attendee.attendeeName}  ${a.attendee.enrollmentNo == "" ? "" : " | " + a.attendee.enrollmentNo} ${icon}
      </li>`;
    }).join("");
    attendeesList += `</ul>`;
  }
  $("#formDataTitle").text("Manage " + "`" + formData.title + "`")
  $("#generalMeetingTypeTitle").text(formData.gmType)
  $("#formDataTitle1").text(formData.title)
  $("#hostDetailsExtra").text(hostDetails.extra)
  $("#meetingTypeName").text(meetingTypeName);
  if(formData.meetingType == "1"){
    $("#meetingTypeDiv").html(
      `<div style="display: flex; align-items: center; padding: 12px;">
        <div style="font-size: 14px; color: #666; width: 40%;"><strong>Attendees</strong></div>
        <div id="attendeesSaved" style="font-size: 14px; width: 80%;">${attendeesList}</div>
      </div>
      
      <div id="saveWhenContainer" style="display: flex; align-items: center; padding: 12px;">
        <div style="font-size: 14px; color: #666; width: 40%;"><strong>When</strong></div>
        <div id="formattedDateAndFormDataStartTime" style="font-size: 14px; width: 80%;">${formattedDate} ${(moment(formData.startTime,'h:mm a').format('h:mm a'))}</div>
      </div>

      <div id="saveDurationContainer" style="display: flex; align-items: center; padding: 12px;">
        <div style="font-size: 14px; color: #666; width: 40%;"><strong>Duration</strong></div>
        <div id="hourAndMin" style="font-size: 14px; width: 80%;">${hour} Hour(s) ${minute} Minute(s)</div>
      </div>`
    )
  }else{
    $("#meetingTypeDiv").html(`<div></div>`)
  }
  $("#timezoneDetailsExtraAndTimezoneDetailsValue").text("("+timezoneDetails.extra+") " + timezoneDetails.value)
  $("#joinUrl").text(joinUrl)
  if(currentDateTime > endDateTime){
    $("#startLensUrlBtn").prop('disabled', true);
    $("#deleteMeetingBtn").prop('disabled', true);
  }
  $("#startLensUrlBtn").attr("onclick", `startLensUrl(${meetingId}, '${meetingTitle}', '${formattedDate}', '${formData.startTime}')`);
  $("#deleteMeetingBtn").attr("onclick", `showWarningMessage('Are you sure you want to delete this meeting?', "deleteMeeting(${meetingId})")`)
  if(currentDateTime > endDateTime){
    if(currentTabId == "recurringMeetings"){
      $("#startLensUrlBtn").prop('disabled', false);
      $("#copyJoinUrlBtn").prop('disabled', false);
    }else{
      $("#startLensUrlBtn").prop('disabled', true);
      $("#copyJoinUrlBtn").prop('disabled', true);
    }
  }
  $("#copyJoinUrlBtn").attr("onclick", `copyJoinUrl(${meetingId})`);
  $("#savedMeetingLinkHtml").show();
  $("#filterFormAndList, #meetingFormDiv").hide();
  backToList('#backFromSaved');
  $('[data-toggle="tooltip"]').tooltip();
}

function getHostsOnly() {
  var responseData={};
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon('masters'),
    data: JSON.stringify(getRequestForHostList('GET-ALL-HOST-LIST')),
    dataType: 'json',
    cache: false,
    timeout: 600000,
    async : false,
    success: function(response) {
    responseData=response;
    },
    error: function(e) {
      console.log(e);
    }
  });
  return responseData;
}

var onChangeHostVar;
function getHostList(hostDetails) {
  const data = hostsData.mastersData.allHostList;
  onChangeHostVar = data;
  const hostEmailSelect = $("#host");
  hostEmailSelect.empty();
  hostEmailSelect.append('<option value="">Select Host</option>');
  
  data.forEach(host => {
    const optionHtml = `<option value="${host.key}">${host.extra}</option>`;
    hostEmailSelect.append(optionHtml);
  });

  if (hostDetails) {
    hostEmailSelect.val(hostDetails?.key);
  }

  hostEmailSelect.select2({
    placeholder: "Select Host",
    allowClear: true
  });

  selectedHostKey = hostDetails ? hostDetails.key : null;
  selectedHostName = hostDetails ? hostDetails.extra : null;
  selectedRole = hostDetails ? hostDetails.extra4 : null;
  selectedHostTimezone = hostDetails ? hostDetails.extra3 : null;
  selectedHostTimezoneName = hostDetails ? hostDetails.extra5 : null;
  selectedHostTimezoneUTC = hostDetails ? hostDetails.extra2 : null;
}

function onChangeHost(src){
  selectedHostKey = $(src).val();
  if(selectedHostKey != ''){
    const selectedHost = onChangeHostVar?.find(host => host.key === selectedHostKey);
    selectedHostName = selectedHost ? selectedHost.extra : null;
    selectedRole = selectedHost ? selectedHost.extra4 : null;
    selectedHostTimezone = selectedHost ? selectedHost.extra3 : null;
    selectedHostTimezoneName = selectedHost ? selectedHost.extra5 : null;
    selectedHostTimezoneUTC = selectedHost ? selectedHost.extra2 : null;
  
    getAllTimeZone(selectedHostTimezone ? {
      key: selectedHostTimezone,
      value: selectedHostTimezoneName,
      extra: selectedHostTimezoneUTC
    } : null);
  }
}

function getHostListForFilter(hostDetails, isUserAllowed) {
  const data = hostsData.mastersData.allHostList;
  var filterState = getFilterState(hostDetails.key);
  
  const hostEmailSelect = $("#filterHostUserId");
  hostEmailSelect.empty();

  data.forEach(host => {
    const optionHtml = `<option value="${host.key}">${host.extra}</option>`;
    hostEmailSelect.append(optionHtml);
  });
  if(isUserAllowed){

  }else{
    if (filterState.filterHostUserId != '') {
      const selectedKeys = filterState.filterHostUserId.split(',');
      hostEmailSelect.val(selectedKeys).trigger('change');
    } else {
      hostEmailSelect.val(hostDetails.key);
    }
  }
  

  hostEmailSelect.off('change').on('change', function() {
    currentPageOneDay = 1;
    currentPageRecurring = 1;
    var selectedKeys = $(this).val();
  
    if (!Array.isArray(selectedKeys)) {
      selectedKeys = [selectedKeys];
    }

    if (filterState.filterHostUserId !== '') {
      filterState.filterHostUserId = selectedKeys.join(',');
    }
  });
}

function getAllTimeZone(timezoneDetails) {
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: getURLForCommon('masters'),
      data: JSON.stringify(getRequestForMaster('', 'TIMEZONE-LIST', '')),
      dataType: 'json',
      cache: false,
      timeout: 600000,
      async : false,
      success: function(response) {
        const data = response.mastersData.countryTimeZones;
        const timezoneSelect = $("#timezone");
        timezoneSelect.empty();
        timezoneSelect.append('<option value="">Select Timezone</option>');

        data.forEach(timezone => {
          const isSelected = timezoneDetails === timezone.value ? "selected" : "";
          const optionHtml = `<option ${isSelected} value="${timezone.key}">(${timezone.extra}) ${timezone.value}</option>`;
          timezoneSelect.append(optionHtml);
        });

        if (timezoneDetails) {
          const selectedKey = data.find(tz => tz.value === timezoneDetails)?.key;
          if (selectedKey) {
            timezoneSelect.val(selectedKey);
          } else {
            timezoneSelect.val(timezoneDetails.key);
          }
        }

        timezoneSelect.select2({
          placeholder: "Select Timezone",
          allowClear: true,
        });
      },
      error: function(e) {
        console.error(e);
      }
    });
}


function startLensResponse(baseUrl, meetingName, meetingDate, meetingStartTime){
  $.ajax({
    type : "GET",
    contentType : "application/json",
    url : baseUrl,
    dataType : 'json',
    success : function(response) {
      if(response.status == "1"){
        window.open(response.redirectUrl,'_blank');
        showStartMeetingPopup(meetingName, meetingDate, meetingStartTime, response.redirectUrl)
      }else if(response.status == "3"){
        redirectLoginPage();
      }else{
        showMessageTheme2(0,response.message);
      }
    }
  });
}

// video urls start
function encode(data){
  return window.btoa(data);
}

function startLensUrl(entityId, meetingName, meetingDate, meetingStartTime) {
  if(meetingStartTime == null || meetingStartTime == undefined && currentTabId == "recurringMeetings"){
    meetingStartTime = '';
  }
  var payload={}
  payload['entityId']=entityId;
  payload['entityType']="GENERAL_MEETINGS";
  let baseUrl=BASE_URL+CONTEXT_PATH+SCHOOL_ID+"/start-general?payload=";
  baseUrl += encode(JSON.stringify(payload))
  startLensResponse(baseUrl, meetingName, meetingDate, meetingStartTime);
}


function joinLensUrl(entityId) {
  var payload={}
  payload['entityId']=entityId;
  payload['entityType']="GENERAL_MEETINGS";
  let baseUrl=BASE_URL+CONTEXT_PATH+SCHOOL_ID+"/join-general?payload=";
  baseUrl += encode(JSON.stringify(payload))
  return baseUrl;
}

function copyJoinUrl(entityId) {
  let url = joinLensUrl(entityId);
  if (!url) {
    showMessageTheme2(0, "Url Invalid");
  } else {
    navigator.clipboard.writeText(url).then(function(){
      showMessageTheme2(1, "URL copied successfully!")
    });
  }
}

function startLensRecording(meetingId) {
  var payload={}
  payload['meetingId']=meetingId;
  let baseUrl=BASE_URL+CONTEXT_PATH+SCHOOL_ID+"/lens-session-recording?payload=";
  baseUrl += encode(JSON.stringify(payload))
  window.open(baseUrl,'_blank')
}
// video urls end

function getDayId() {
  const dateInput = $('#when').val();
  if (!dateInput) return null;

  const date = new Date(dateInput);
  const dayId = date.getDay() + 1;

  return dayId;
}

// schedule list start
function getScheduleList() {
  const dayId = getDayId();
  const teacherUserId = selectedHostKey;
  const date = new Date($("#when").val());
  const reqDate = changeDateFormat(date, "yyyy-mm-dd")
  const now = new Date();
  const systemTime = now.toTimeString().split(' ')[0];
  const startDate = `${reqDate} ${systemTime}`;
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });

  const body = {
    teacherUserId: +teacherUserId,
    dayId: dayId,
    startDate: startDate,
    userId: +USER_ID
  }

  if (!teacherUserId || !dayId) return;

  $.ajax({
    url: BASE_URL+CONTEXT_PATH+UNIQUEUUID+`/api/v1/dashboard/get-schedule`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(body),
    success: function(response) {
      try {
        const res = JSON.parse(response);
        const schedule = res.data.schedule;
        if (schedule && schedule.length > 0) {
          $('#scheduleAndMeetingContainer').css("display", "flex");
          $('#scheduleSection').show();
          $('#scheduleContent').html(`
            <h3 class="mb-4 mt-0 text-center text-white rounded mx-3 py-2 px-3" style="font-weight: bold !important; background-color: #027FFF;">Teacher's Schedule for ${formattedDate}.</h3>
            ${schedule
              .map(item => `<p class="px-4 py-2 mx-5" style="background-color: #FFE6E2; border: 1px solid #F23B22; color: #F23B22; border-radius: 16px;">${item.timeRange}</p>`)
              .join('')}
            <p class="mb-4 mx-3 text-center" style="font-weight: bold !important; color: #F23B22;">
              Do not schedule meetings within these time ranges.
            </p>
          `);
        } else {
          $('#scheduleAndMeetingContainer').css("display", "flex");
          $('#scheduleSection').show();
          $('#scheduleContent').html(`
            <h3 class="mb-4 mt-0 text-center text-white rounded mx-3 py-2 px-3" style="font-weight: bold !important; background-color: #027FFF;">Teacher's Schedule for ${formattedDate}.</h3>
            <p class="text-center" style="font-size: 16px !important; font-weight: bold !important; color: #03BB17;">No meetings for now</p>
          `)
        }
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
        $('#scheduleContent').html('<p>Error loading schedule.</p>');
      }
    }
  })
}

function checkAndFetchSchedule() {
  const date = $('#when').val();
  selectedHostKey = $('#host').val();

  if (date && selectedHostKey && selectedRole == "TEACHER" && selectedHostKey !== "0") {
    getScheduleList();
  } else {
    $('#scheduleAndMeetingContainer').css("display", "none");
    $('#scheduleSection').hide();
  }
}
// schedule list end


function getRequiredDateTime() {
  const dateInput = $('#when').val();
  if (!dateInput) return null;

  const [month, day, year] = dateInput.replace(',', '').split(' ');
  const monthIndex = new Date(`${month} 1, 2000`).getMonth();
  const date = new Date(year, monthIndex, parseInt(day));

  const formattedDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const hour = $('#hour').val();
  if (!hour) return null;

  const [hours, minutes] = [hour.substring(0, 2), hour.substring(2)];

  const formattedDateTime = `${formattedDate} ${String(hours).padStart(2, '0')}:${minutes}:00`;
 
  return formattedDateTime;
}

// meeting list start
var isFetching = false;
function getMeetingList() {
  if (isFetching) return;
  isFetching = true;

  const meetingStartDate = getRequiredDateTime();
  const date = new Date($("#when").val());
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });

  if (!meetingStartDate) {
    return;
  }

  const formData = {
    "meetingStartDate": meetingStartDate,
    "hostUserId": $('#host').val(),
    userId: USER_ID
  };

  $.ajax({
    url: BASE_URL+CONTEXT_PATH+`api/v1/get-scheduled-meetings`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(formData),
    success: function(response) {
      isFetching = false;
      try {
        const res = JSON.parse(response);
        const meetings = res.data.meetings;
        if (meetings && meetings.length > 0) {
          $('#scheduleAndMeetingContainer').css("display", "flex");
          $('#meetingSection').show();
          $('#meetingContent').html(`
            <h3 class="mb-4 mt-0 text-center text-white rounded mx-3 py-2 px-3" style="font-weight: bold !important; background-color: #027FFF;">Existing meetings on ${formattedDate}.</h3>
            <div style="max-height:80vh; overflow-y:auto;">
              ${meetings
                .map(item => `<p class="px-4 py-2 mx-5 meeting-item relative"
                  data-details="Type: ${item.eventName}\nWhen: ${item.timeRange}\nInvitee Name: ${item.inviteeName}\nDuration: ${item.duration}\nTimezone: ${item.timezone}"
                  style="background-color: #FFE6E2; border: 1px solid #F23B22; color: #F23B22; border-radius: 16px;">${item.timeRange}</p>`)
                .join('')}
            </div>
            <p class="mb-4 mx-3 text-center" style="font-weight: bold !important; color: #F23B22;">
              Do not schedule meetings within these time ranges.
            </p>
          `);
        } else {
          $('#scheduleAndMeetingContainer').css("display", "flex");
          $('#meetingSection').show();
          $('#meetingContent').html(`
            <h3 class="mb-4 mt-0 text-center text-white rounded mx-3 py-2 px-3" style="font-weight: bold !important; background-color: #027FFF;">Existing meetings on ${formattedDate}.</h3>
            <p class="text-center" style="font-size: 16px !important; font-weight: bold !important; color: #03BB17;">No meetings for now</p>
          `);
        }
      } catch (error) {
        console.error("Failed to fetch meetings:", error);
        $('#meetingContent').html('<p>Error loading meetings.</p>');
      }
    }
  })
}

function hideConflictTooltip() {
  $('#tooltip').remove();
}

$(document).on('mouseover', '.meeting-item', function () {
  const details = $(this).data('details');
  showConflictTooltip(details, this);
});

$(document).on('mouseout', '.meeting-item', function () {
  hideConflictTooltip();
});

$(document).on('mouseout', '.meeting-item', function () {
  hideConflictTooltip();
});

function checkAndFetchMeetings() {
  const meetingStartDate = getRequiredDateTime();
 
  selectedHostKey = $('#host').val();

  if (meetingStartDate && selectedHostKey && selectedHostKey !== "0") {
    getMeetingList();
  } else {
    $('#scheduleAndMeetingContainer').css("display", "none");
    $('#meetingSection').hide();
  }
}
// meeting list end

function openRecordingModal(entityId, entityType, meetingStartDate, title, startTime, hostName) {
  const body = {
    entityId: entityId,
    entityName: entityType,
    meetingDate: changeDateFormat(new Date(meetingStartDate), "yyyy-mm-dd"),
    meetingType: "GENERAL_MEETING"
  };
  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/v1/leads/get-event-recordings",
    data: JSON.stringify(body),
    contentType: "application/json",
    success: function (response) {
      const res = JSON.parse(response);
      if (res.statusCode === 0 && res.status === "success") {
        const recordings = res.data.recordingUrls;
        if (recordings && recordings.length > 0) {
          populateRecordingModal(recordings, meetingStartDate, title, startTime, hostName);
        } else {
          showMessageTheme2(0, "No recordings available.", '', true);
        }
      } else {
        showMessageTheme2(0, `Error: ${res.message}`, '', true);
      }
    },
    error: function (e) {
      console.error("Error Fetching the data:", e.message);
    }
  });
}

function playRecording(videoUrl, title) {
  var videoModal = $("#videoModal");
  $.ajax({
    type: "GET",
    contentType: "application/json",
    dataType: 'json',
    url: getURLForSignVideo(videoUrl),
    success: function (responseData) {
      if (responseData.status == 0) {
        const signedUrl = responseData.url;
        recordingTitle = title;
        if (videoModal.length == 0) {
          $("body").append(`
            <div id="videoModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
              <div style="background: white; border-radius: 12px; overflow: hidden; width: 70%; max-width: 70%;margin: auto; margin-top:50px;">
                <div class="">
                  <div class="d-flex justify-content-between align-items-center" style="padding: 15px 10px; background: #027FFF;">
                    <h5 class="text-white mb-0" style="font-size: 18px; font-weight: bold;">${recordingTitle}</h5>
                    <button onclick="closeVideoModal();" type="button" class="text-white btn btn-sm btn-danger" data-bs-dismiss="modal" aria-label="Close" style="font-size: 20px !important; margin: 0; padding: 0px 8px;">&times;</button>
                  </div>
                  <div class="" style="padding: 20px;">
                    <video class="videoTag w-100" style="height: 70vh; overflow-y: auto;" controls>
                      <source src="${signedUrl}" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </div>
          `);
        } else {
          videoModal.find(".modal-title").text(title);
          videoModal.find(".videoTag source").attr("src", signedUrl);
          videoModal.find(".videoTag")[0]?.load();
        }

        $("#videoModal").modal("show");
      } else {
        showMessageTheme2(0, responseData.message || "Failed to fetch video URL", '', true);
      }

      customLoader(false);
    },
    error: function (e) {
      console.error("Error fetching signed video URL:", e.message);
      showMessageTheme2(0, "Error fetching video.", '', true);
      customLoader(false);
    }
  });
}

function getURLForSignVideo(videoUrl) {
  const payload = JSON.stringify({ url: videoUrl });
  const encodePayload = window.btoa(payload);
  return BASE_URL + CONTEXT_PATH + "videos/signed-url?payload=" + encodePayload;
}

function getURLForTranscriptContent(transcriptUrl) {
  var payload = JSON.stringify({ url: transcriptUrl });
  var encodePayload = window.btoa(payload);
  return BASE_URL + CONTEXT_PATH + "transcript/show-content?payload=" + encodePayload;
}

function convertToVTT(videoUrl) {
    if (!videoUrl.endsWith(".mp4")) {
      return null;
    }
    const urlParts = new URL(videoUrl);
    const filePath = urlParts.pathname.replace(
      /\/([^\/]+)-(\d+\.\d+)\.mp4$/,
      "/$1-transcript-$2.vtt"
    );
    let transcriptUrl = urlParts.origin + filePath;

    if (transcriptUrl === videoUrl) {
      const prefixUrl = "https://ischoolingwise.s3.us-east-1.amazonaws.com/recordings/";
      const sessionId = videoUrl.split(prefixUrl)[1].split("-")[0];
      transcriptUrl = `${prefixUrl}${sessionId}-transcript-1.1.vtt`;
    }
    return transcriptUrl;
}

function displayVTT(content, title) {
  const output = $("#transcript-modal-body");
  output.empty();

  if(content.includes("<Error><Code>")){
    output.append(`<p style="font-size: 18px;">No Transcript Available</p>`)
  } else {
    var lines = content.split("\n");
    lines.forEach(line => {
      var p = $("<p></p>").text(line);
      output.append(p);
    });
  }

  $("#transcriptModalTitle").html(title);
  $("#transcriptModal").modal("show");
}

function showVTTFile(url, title) {
  let transcriptModal = $("#transcriptModal");

  if (transcriptModal.length === 0) {
    $("body").append(`
      <div id="transcriptModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
        <div style="background: white; border-radius: 12px; overflow: hidden; width: 70%; max-width: 70%;margin: auto; margin-top:50px;">
          <div class="" style="height: 100%; display: flex; flex-direction: column;">
            <div class="d-flex justify-content-between align-items-center" style="padding: 15px 10px; background: #027FFF;">
              <h5 id="transcriptModalTitle" class="text-white mb-0" style="font-size: 18px; font-weight: bold;">${title}</h5>
              <button type="button" class="text-white btn btn-sm btn-danger" data-bs-dismiss="modal" aria-label="Close" style="font-size: 20px !important; margin: 0; padding: 0px 8px;" onclick="closeTranscriptModal();">&times;</button>
            </div>
            <div id="transcript-modal-body" class="text-left" style="flex-grow: 1; padding: 20px; height: 70vh; overflow-y: auto;">
              <!-- Transcript content will be populated here -->
            </div>
          </div>
        </div>
      </div>
    `);
  }

  customLoader(true);
  const vttFile = convertToVTT(url);
  $.ajax({
    type: "GET",
    contentType: "application/json",
    dataType: 'json',
    url: getURLForTranscriptContent(vttFile),
    success: function(responseData) {
      customLoader(false);
      displayVTT(responseData.content, title);
    },
    error: function() {
      customLoader(false);
      showMessageTheme2(0, "Failed to load transcript.", '', true);
    }
  });
}

function closeAllVideoModal(){
  $("#recordingModal").modal("hide");
}

function closeVideoModal(){
  const videoElement = $("#videoModal .videoTag")[0];
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  $("#videoModal").modal("hide");
  $("#videoModal").remove();
}

function closeTranscriptModal(){
  $("#transcriptModal").modal("hide");
}

function getFilterState(userId){
  var filterState = {
    filterHostUserId: userId,
    filterDateDuration: "Today",
    filterMeetingStartDate: "",
    filterMeetingEndDate: "",
  };
  return filterState;
}
function getHostDetails(userId){
  var hostDetails = {
    key: userId
  }
  return hostDetails;
}

function handleAddAttendee() {
  const inputVal = $('#attendees').val().trim();

  if (inputVal.length > 0) {
    if (validateEmail(inputVal)) {
      addAttendee(inputVal);
    } else {
      showMessageTheme2(0, "The attendee selection seems incorrect. Please choose a valid attendee");
    }
  }
}

function getAttendeesList() {
  var inputVal = $('#attendees').val().trim();
  if (inputVal.length >= 3) {
    $.ajax({
      url: BASE_URL + CONTEXT_PATH + `api/v1/get-all-user-list?searchKeyWords=${inputVal}`,
      method: 'GET',
      contentType: 'application/json',
      async: true,
      global: false,
      success: function (response) {
        try {
          const res = typeof response === "string" ? JSON.parse(response) : response;
          cachedUserList = res.data?.userList || [];

          $("#dynamic-attendees-list").empty();

          if (res.status === 'success' && cachedUserList.length) {
            $("#dynamic-attendees-list").show();

            cachedUserList.forEach((item) => {
              if (!selectedAttendees.some(user => user.userId === item.userId)) {
                $("#dynamic-attendees-list").append(
                  `<li class="rounded px-3 py-1 my-2 selectable" 
                      style="background-color:white; cursor:pointer;" 
                      data-user="${item.userId}">
                    ${item.userName} | ${item.enrollmentNo}
                  </li>`
                );
              }
            });

            $(".selectable").on('click', function () {
              const userId = $(this).data('user');
              const userName = $(this).text().trim();
              addAttendee(userId, userName);
              $("#dynamic-attendees-list").hide();
              $("#attendees").val("");
            });
          } else {
            $("#dynamic-attendees-list").hide();
          }
        } catch (e) {
          console.error("Error parsing JSON response: ", e.message);
          showMessageTheme2(0, 'Failed to parse the attendees data.');
        }
      },
      error: function (err) {
        if (checkonlineOfflineStatus()) {
					return;
				}else{
          console.error("Error fetching user list: ", err);
          showMessageTheme2(0, "Please enter a valid name or email.");
        }
      }
    });
  } else {
    $("#dynamic-attendees-list").hide();
  }
}

function addAttendee(userId, userName) {
  if (!selectedAttendees.some(att => att.userId == userId)) {
    selectedAttendees.push({ userId, userName });
    renderSelectedAttendees();
    $("#attendees").val("");
  }else{
    showMessageTheme2(0, "Already added, select another one.");
  }
}

function renderSelectedAttendees() {
  $("#selected-attendees-list").empty();
  selectedAttendees.forEach(att => {
    $("#selected-attendees-list").append(
      `<span class="badge bg-white p-2 m-2 rounded d-flex align-items-center" 
          style="gap:10px;color:black;font-size:12px;text-transform: none;">
        ${att.userName == undefined ? att.userId : att.userName}
        <button data-user="${att.userId}" class="btn-close" 
          style="background: red; color: white; border: none; padding: 1px 5px; 
          border-radius: 50%; cursor: pointer; font-size: 17px;">
          &times;
        </button>
      </span>`
    );
  });
  bindRemoveAttendeeEvent();
}

function bindRemoveAttendeeEvent() {
  $(".btn-close").off('click').on('click', function () {
    const userId = $(this).data('user');
    selectedAttendees = selectedAttendees.filter(att => att.userId != userId);
    renderSelectedAttendees();
  });
}

function getCurrentWeekDates() {
  let now = new Date();
  let startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  let endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

  return {
    startOfWeek: changeDateFormat(startOfWeek, "yyyy-mm-dd"),
    endOfWeek: changeDateFormat(endOfWeek, "yyyy-mm-dd"),
  };
}

function showRecurringMeetingRecordings(entityId, meetingTitle, hostName) {
  const { startOfWeek, endOfWeek } = getCurrentWeekDates();
  var body = {
    entityId: entityId,
    meetingStartDate: startOfWeek,
    meetingEndDate: endOfWeek,
    limit: 10,
    pageNo: currentPageRecurringRecording
  }
  $.ajax({
    url: BASE_URL + CONTEXT_PATH + "api/v1/get-recurring-recordings-list",
    type: "POST",
    data: JSON.stringify(body),
    contentType: "application/json",
    success: function (response) {
      var res = JSON.parse(response)
      try {
        populateRecurringRecording(res.data, meetingTitle, hostName, entityId, startOfWeek, endOfWeek, res.recordingsTotalPages);
        if(res.recordingsTotalPages != 0){
          $("#recurringPaginationContainer").html(renderPagination(currentPageRecurringRecording, res.recordingsTotalPages));
        }
      } catch (error) {
        console.log("Error Fetching Data:", error);
        
      }
    }
  });
}

function toggleRecording(index) {
  $(`#recording-${index}`).slideToggle();
}

function closeRecurringModal() {
  $("#recurringMeetingModal").removeClass("open");
  $("#recurringMeetingBackdrop").fadeOut(200);
  
  setTimeout(() => {
    $("#recurringMeetingModal").remove();
    $("#recurringMeetingBackdrop").remove();
    $("body").css("overflow", "auto");
  }, 300);
  currentPageRecurringRecording = 1;
}

function applyRecurringRecordingFilters(entityId) {
  event.preventDefault();

  var body = {
    entityId: entityId,
    meetingStartDate: $("#filterRecurringMeetingStartDate").val() == '' ? '' : changeDateFormat(new Date($("#filterRecurringMeetingStartDate").val()), "yyyy-mm-dd"),
    meetingEndDate: $("#filterRecurringMeetingEndDate").val() == '' ? '' : changeDateFormat(new Date($("#filterRecurringMeetingEndDate").val()), "yyyy-mm-dd"),
    limit: 10,
    pageNo: currentPageRecurringRecording
  };

  $.ajax({
    url: BASE_URL + CONTEXT_PATH + "api/v1/get-recurring-recordings-list",
    type: "POST",
    data: JSON.stringify(body),
    contentType: "application/json",
    success: function (response) {
      var res = JSON.parse(response);
      try {
        updateRecordingsTable(res.data);
        $("#recurringMeetingModal").data("entityId", entityId);
        if(res.recordingsTotalPages > 0){
          $("#recurringPaginationContainer").html(renderPagination(currentPageRecurringRecording, res.recordingsTotalPages));
        } else{
          $("#recurringPaginationContainer").html('');
        }
      } catch (error) {
        console.log("Error Fetching Data:", error);
      }
    }
  });
}

function getGeneralMeetingTypeList(id){
  $.ajax({
    type: "GET",
    contentType: "application/json",
    dataType: 'json',
    url: BASE_URL + CONTEXT_PATH + "api/v1/get-meeting-types",
    success: function (response) {
      var list = response.data.meetingTypes
      var dropdown = $(id);
      dropdown.empty();

      dropdown.append('<option value="">Select General Meeting Type</option>');

      if (list && list.length > 0) {
        list.forEach(function(type) {
          dropdown.append(`<option value="${type}">${type}</option>`);
        });
      }

      dropdown.append('<option value="Other">Other</option>');

      $(dropdown).select2({
        placeholder: "Select General Meeting Type",
        allowClear: true,
      });
    },
    error: function () {
      console.error("Failed to load meeting types.");
    }
  });
}