function getMeetingManagementContent() {
  $("<style>")
    .prop("type", "text/css")
    .html(`
      .select2-selection.select2-selection--single {
        border: 1px solid #a1a1a1 !important;
        border-radius: 5px !important;
      }
      .select2-container--default.select2-container--focus .select2-selection--multiple, .select2-container--default .select2-selection--multiple {
        border: 1px solid #a1a1a1 !important;
        border-radius: 5px !important;
      }
      input[disabled] {
        background-color: #d6d6d6 !important;
        cursor: not-allowed !important;
      }
    `)
    .appendTo("head");

  let htmlContent = `
    <!-- showMessage -->
    <div class="modal fade" id="modalMessage" tabindex="-1" role="dialog" style="z-index: 1040; display: none;" aria-hidden="true">
      <div class="modal-dialog modal-notify modal-info" role="document">
        <div class="modal-content text-center">
          <div id="statusMessage" class="modal-body danger-color"></div>
        </div>
      </div>
    </div>

    <!-- showWarningMessageModal -->
    <div class="modal fade" id="remarksresetDelete" tabindex="-1" style="background: rgba(0, 0, 0, 0.8);">
      <div class="modal-dialog" role="document">
        <div class="modal-content text-center rounded">
            <div class="modal-header bg-danger justify-content-center"
              style="top: 0 !important;width:100% !important;background-color:#f44336 !important; padding: 15px 10px;border-radius: 5px 5px 0px 0px !important">
              <p class="heading mb-0" style="color: #fff; font-size: 16px; font-weight: bold;" id="warningMessage">Are you sure?</p>
            </div>
              <div id="statusMessage-1" class="modal-body delete-modal" style="padding-top:12px">
                <i class="fa fa-trash fa-4x" style="color:#f44336 !important;"></i>
              </div>
            <div class="modal-footer text-center rounded">
              <div class="text-center" style="margin: 0 auto;">
              <button id='resetDeleteErrorWarningYes' type="button" class="rounded btn" style="color:#f44336 !important;border:1px solid #f44336 !important;background:transparent !important;font-weight: 700;">Yes</button>
              <button id='resetDeleteErrorWarningNo' type="button" class="rounded btn btn-danger " data-dismiss="modal" style="font-weight: 700;" >No</button>
              <button id='resetDeleteErrorWarningCancel' type="button" class="rounded btn btn-default" data-dismiss="modal" style="font-weight: 700;">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MessageTheme2 -->
    <div class="server-message">
      <span class="msg" id="msgTheme2"></span>
    </div>

    <!-- Loader -->
    <div id="commonloaderId" class="unique-loader loader-bg" style="display:none;">`
      if(SCHOOL_ID==1){
        htmlContent+=`<img src="${PATH_FOLDER_IMAGE2}loader-new.gif" alt="${SCHOOL_NAME} Loader" class="new-loader-2024" />`;
      }else{
        htmlContent+=
        `<div id="commonloaderBody" class="loader" style="display:none">
          Please Wait... <span></span>
        </div>`
      } 
    htmlContent+=`</div>

    <div class="main-card mb-3">
      <div class="card mt-4" style="box-shadow: 0px 0px;">
        <div id="card-body" class="card-body px-4 mx-5">`
          +filterFormAndList()
          +getMeetingFormHtml()
          +savedMeetingLinkHtml()
        htmlContent+=`</div>
      </div>
    </div>`;
    return htmlContent;
}

function filterFormAndList(){
  var html=
  `<div id="filterFormAndList" class="full">
    <h2 class="mb-0" style="color: #6e6e6e; font-size: 24px; font-weight: bold;">Meetings</h2>
    <form id="filterMeeting" class="justify-content-between align-items-center mb-3" style="display: flex;" autocomplete="off">
      <div class="d-flex w-100 align-items-center my-4" style="gap: 8px;">
      
        <div class="d-none hidden">
          <label class="text-dark" for="filterTitle">Title</label>
          <input type="text" id="filterTitle" class="" placeholder="Enter meeting title" />
        </div>

        <div id="filterHostUserIdDiv" style="width: 20%;">
          <select id="filterHostUserId" name="filterHostUserId" class="p-3 border rounded" style="border-color: #a1a1a1 !important;width: 100%; font-size: 14px;">
            <!-- Dynamically loaded -->
          </select>
        </div>

        <div id="filterGeneralMeetingTypeDiv" style="width: 20%;">
          <select id="filterGeneralMeetingType" name="filterGeneralMeetingType" class="p-3 border rounded" style="border-color: #a1a1a1 !important;width: 100%; font-size: 14px;">
            <!-- Dynamically loaded -->
          </select>
        </div>

        <div class="" style="width: 10%">
          <select onchange="setFilterDatesAccordingly(this, '#filterMeetingStartDate', '#filterMeetingEndDate')" id="filterDateDuration" name="filterDateDuration" class="border rounded" style="border-color: #a1a1a1 !important;width: 100%; font-size: 14px; padding: 8px; appearance: auto; -webkit-appearance: auto; -moz-appearance: auto;">
            <option value="Today" selected>Today</option>  
            <option value="Week">Week</option>
            <option value="Month">Month</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <div class="">
          <input onchange="getDatepickerChangeVal(this)" type="text" id="filterMeetingStartDate" class="border rounded" style="border-color: #a1a1a1 !important;width: 100%; font-size: 14px; padding: 8px;" placeholder="Select Start Date" autocomplete="off" />
        </div>
        <div class="">
          <input onchange="getDatepickerChangeVal(this)" type="text" id="filterMeetingEndDate" class="border rounded" style="border-color: #a1a1a1 !important;width: 100%; font-size: 14px; padding: 8px;" placeholder="Select End Date" autocomplete="off" />
        </div>

        <div class="d-none hidden">
          <label class="text-dark" for="limit">Limit</label>
          <input type="number" min="1" id="limit" class="" value="" placeholder="Enter Limit" />
        </div>

      </div>
      <div class="text-right d-flex" style="gap: 6px;">
        <button id="filterSearchButton" type="submit" onclick="applyFilters();" class="btn ml-auto rounded" style="width: max-content; background-color: #027FFF; padding: 10px 20px; font-weight: bold;">Search</button>
        <button id="filterResetButton" type="button" onclick="resetFilter();" class="btn ml-auto rounded" style="width: max-content; background-color: #FFF; padding: 10px 20px; font-weight: bold; color: #027FFF;; border: 1px solid #027FFF;">Reset</button>
      </div>
    </form>
    <div id="meetingTableContainer">
    </div>
  </div>
  `
  return html;
}

function getMeetingFormHtml() {
  $("<style>")
    .prop("type", "text/css")
    .html(`
      .select2-selection.select2-selection--single {
        border: 1px solid #a1a1a1 !important;
        border-radius: 5px !important;
      }
    `)
    .appendTo("head");

  return `
    <div id="meetingFormDiv" class="full" style="display: none;">
      <div class="d-flex w-100">
      <!-- Main meeting form on the left -->
        <div class="main-card mb-3" style="width: 70%">
          <div class="card" style="box-shadow: 0px 0px;">
            <div class="card-body mx-5">
              <button id="backFromForm" class="bg-transparent mb-4 border-0" style="font-size: 16px; color: #393185;">
                <i class="fa fa-chevron-left" style="margin-right: 4px; font-size: 14px"></i> Back to Meeting
              </button>
              <h2 class="mb-5" style="font-weight: bold;">Schedule Meeting</h2>
              <form id="meetingForm" autocomplete="off">
                <div class="mb-5 d-flex align-items-center" style="gap: 50px;">
                  <label for="generalMeetingType" style="color: #2E2E2E; font-size: 16px; width: 25%;">Meeting Type</label>
                  <select id="generalMeetingType" name="generalMeetingType" class="p-3 border rounded" style="border-color: #a1a1a1 !important;width: 100%; font-size: 14px; right: 0; left: 0; margin: auto;" required autocomplete="off">
                    <!-- Dynamically loaded -->
                  </select>
                </div>

                <div class="mb-5 d-flex align-items-center" style="gap: 50px;">
                  <label for="topic" style="color: #2E2E2E; font-size: 16px; width: 25%;">Topic</label>
                  <input type="text" id="topic" class="p-3 border rounded" style="border-color: #a1a1a1 !important; width: 100%; font-size: 14px;" placeholder="Enter topic" autocomplete="off" required />
                </div>

                <div id="meetingTypeContainer" class="mb-5 align-items-center" style="gap: 50px;" style="display: none;">
                  <label for="meetingType" style="color: #2E2E2E; font-size: 16px; width: 19%;">Type of Meeting</label>
                  <div class="d-flex" style="gap: 16px;">
                    <label class="rounded" style="display: flex;align-items: center;gap: 5px;border: 1px solid #a1a1a1;border-radius: 3px;font-size: 16px;padding: 5px;color: #2e2e2e;">
                      One day meeting
                      <input
                        class="m-0 ml-3"
                        type="radio"
                        name="meetingType"
                        value="1"
                        checked
                        required
                        onchange="getMeetingType()"
                        autocomplete="off"
                      >
                    </label>
                    <label class="rounded" style="display: flex;align-items: center;gap: 5px;border: 1px solid #a1a1a1;border-radius: 3px;font-size: 16px;padding: 5px;color: #2e2e2e;">
                      Recurring meeting
                      <input
                        class="m-0 ml-3"
                        type="radio"
                        name="meetingType"
                        value="2"
                        onchange="getMeetingType()"
                        autocomplete="off"
                      >
                    </label>
                  </div>
                </div>

                <div class="mb-5 d-flex align-items-center" style="gap: 50px;">
                  <label for="host" class="" style="color: #2E2E2E; font-size: 16px; width: 25%;">Host</label>
                  <select onchange="onChangeHost(this);checkAndFetchMeetings();updateNewDateInCalender();" id="host" name="host" class="p-3 border rounded" style="border-color: #a1a1a1 !important;width: 100%; font-size: 14px; right: 0; left: 0; margin: auto;" required autocomplete="off">
                    <!-- Dynamically loaded -->
                  </select>
                </div>

                <div id="attendeesContainer" class="mb-5 align-items-center" style="gap: 50px;display: none;">
                  <label for="attendees" style="color: #2E2E2E; font-size: 16px; width: 25%;">Attendees</label>
                  <div class="d-flex flex-column w-100">
                    <div class="d-flex flex-column w-100 position-relative" style="gap:2px;">
                      <input id="attendees" class="p-3 border rounded w-100" style="border-color: #a1a1a1 !important; font-size: 14px;" type="text" placeholder="Search by name & email" oninput="getAttendeesList();">
                      <ul id="dynamic-attendees-list" class="rounded m-0 px-2 position-absolute" style="background-color: #eee; list-style: none; max-height: 150px;z-index: 1;overflow-y: auto;width: 100%;top: 42px; display: none;"></ul>
                    </div>
                    <!-- List of selected attendees -->
                    <div id="selected-attendees-list" class="mt-2 d-flex flex-wrap rounded" style="background-color: #EDF6FF;"></div>
                  </div>
                </div>
              
                <div id="whenContainer" class="mb-5 align-items-center w-100" style="gap: 50px; display: none;">
                  <label for="when" class="form-label" style="color: #2E2E2E; font-size: 16px; width: 25%;">When</label>
                  <div class="d-flex w-100" style="gap: 16px;">
                    <input
                      onchange="checkAndFetchMeetings();getDatepickerChangeVal(this);"
                      type="text"
                      id="when"
                      name="when"
                      placeholder="Select Date"
                      class="p-3 border rounded datepicker"
                      style="border-color: #a1a1a1 !important; font-size: 14px; width: 100%;"
                      autocomplete="off"
                      required
                    >
                    <select
                      onchange="checkAndFetchMeetings();"
                      id="hour"
                      name="hour"
                      class="p-3 border rounded"
                      style="border-color: #a1a1a1 !important; font-size: 14px; width: 100%;"
                      required
                      autocomplete="off"
                    >
                      <option value="" disabled selected>HH:MM</option>
                    </select>
                  </div>
                </div>

                <div id="durationContainer" class="mb-5 align-items-center" style="gap: 50px; display: none;">
                  <label for="durationHour" class="form-label" style="color: #2E2E2E; font-size: 16px; width: 25%;">Duration</label>
                  <div class="d-flex w-100" style="gap: 16px;">
                    <div class="d-flex align-items-center w-25" style="gap: 6px;">
                      <select
                        id="durationHour"
                        name="durationHour"
                        class="p-3 border rounded w-100"
                        style="border-color: #a1a1a1 !important; font-size: 14px;"
                        required
                        autocomplete="off"
                      >
                        <option value="00">00</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="04">04</option>
                        <option value="05">05</option>
                        <option value="06">06</option>
                        <option value="07">07</option>
                      </select>
                      <p class="m-0">Hr</p>
                    </div>

                    <div class="d-flex align-items-center w-25" style="gap: 6px;">
                      <select
                        id="durationMinute"
                        name="durationMinute"
                        class="p-3 border rounded w-100"
                        style="border-color: #a1a1a1 !important; font-size: 14px;"
                        required
                        autocomplete="off"
                      >
                        <option value="00">00</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                      </select>
                      <p class="m-0">Min</p>
                    </div>
                  </div>
                </div>

                <div class="mb-5 d-flex align-items-center" style="gap: 50px;">
                  <label for="timezone" style="color: #2E2E2E; font-size: 16px; width: 25%;">Time Zone</label>
                  <select id="timezone" name="timezone" class="p-3 border rounded" style="border-color: #a1a1a1 !important;width: 100%; font-size: 14px; right: 0; left: 0; margin: auto;" disabled required autocomplete="off">
                    <!-- Add more timezones as needed -->
                  </select>
                </div>

                <div class="d-flex w-100 pt-2" style="gap: 16px;">
                  <button type="submit" class="btn rounded" style="background-color: #027FFF !important;">Save</button>
                  <button type="button" class="btn rounded btn-secondary border" onclick="resetRequiredFormData('#host');">Reset</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <!-- Schedule section on the right -->
        <div id="scheduleAndMeetingContainer" class="flex-column mx-auto" style="gap: 8px; display: none; padding-left: 15px;margin-top: 50px; border-left: 2px solid #DBDBDB;">
          <div id="scheduleSection" class="main-card mb-3" style="display: none; border-bottom: 1px solid #DBDBDB;"">
            <div class="card mb-2" style="box-shadow: 0px 0px;">
              <div class="card-body">
                <div id="scheduleContent">Loading schedule...</div>
              </div>
            </div>
          </div>

          <div id="meetingSection" class="main-card mb-3" style="display: none;">
            <div class="card mt-2 mb-0" style="box-shadow: 0px 0px;">
              <div class="card-body">
                <div id="meetingContent">Loading meetings...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function savedMeetingLinkHtml() {
  return `
    <div id="savedMeetingLinkHtml" class="meeting-container" style="padding-top: 30px; padding-left: 6rem; display: none;">
      <div class="d-flex align-items-center" style="gap: 10px;">
        <button id="backFromSaved" class="bg-transparent mb-0 border-0" style="font-size: 16px; color: #393185;">
          Back to Meeting
        </button>
        <i class="fa fa-chevron-right" style="margin-right: 4px; font-size: 14px"></i>
        <p id="formDataTitle" class="m-0" style="font-size: 16px;"></p>
      </div>
     
      <div class="meeting-detail" style="padding-top: 10px;">
        <h3 style="font-size: 26px; color: #333; margin-bottom: 40px; margin-left: 10px; font-weight: bold;">Meeting Details</h3>
       
        <div class="" style="width: 75%;">
          <div style="display: flex; align-items: center; padding: 12px;">
            <div style="font-size: 14px; color: #666; width: 40%;"><strong>General Meeting Type</strong></div>
            <div id="generalMeetingTypeTitle" style="font-size: 14px; width: 80%;"></div>
          </div>

          <div style="display: flex; align-items: center; padding: 12px;">
            <div style="font-size: 14px; color: #666; width: 40%;"><strong>Topic</strong></div>
            <div id="formDataTitle1" style="font-size: 14px; width: 80%;"></div>
          </div>

          <div style="display: flex; align-items: center; padding: 12px;">
            <div style="font-size: 14px; color: #666; width: 40%;"><strong>Host Details</strong></div>
            <div id="hostDetailsExtra" style="font-size: 14px; width: 80%;"></div>
          </div>

          
          <div id="meetingTypeDiv"></div>
          
          <div style="display: flex; align-items: center; padding: 12px;">
            <div style="font-size: 14px; color: #666; width: 40%;"><strong>Type of Meeting</strong></div>
            <div id="meetingTypeName" style="font-size: 14px; width: 80%;"></div>
          </div>

          <div style="display: flex; align-items: center; padding: 12px;">
            <div style="font-size: 14px; color: #666; width: 40%;"><strong>Time Zone</strong></div>
            <div id="timezoneDetailsExtraAndTimezoneDetailsValue" style="font-size: 14px; width: 80%;"></div>
          </div>

          <div style="display: flex; align-items: center; padding: 12px;">
            <div style="font-size: 14px; color: #666; width: 40%;"><strong>Invite Link</strong></div>
            <div id="joinUrl" style="font-size: 14px; width: 80%; color: #027FFF;;"></div>
          </div>

          <div class="action-buttons" style="display: flex; justify-content: flex-start; gap: 12px; margin-top: 50px;">
            <button id="startLensUrlBtn" class="btn rounded" style="padding: 10px 20px; font-size: 16px; background-color: #027FFF; font-weight: bold;" >Start</button>
            <button id="copyJoinUrlBtn" class="btn rounded" style="padding: 10px 20px; font-size: 16px; border: 1px solid #ddd; background-color: #FFF; color: #000;font-weight: bold;">
              <i class="fa fa-clone" style="font-size: 16px; margin-right: 6px;"></i>
              Copy Invitation
            </button>
            <button id="deleteMeetingBtn" class="btn rounded" style="padding: 10px 20px; font-size: 16px; background-color: #EB2314; color: #FFF; font-weight: bold;">Delete</button>
          </div>
        </div>
      </div>
    </div>`
}

function showConflictPopUp(topic, date, time) {
  const popupHtml = `
    <div id="conflictPopup" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
      <div style="background: white; border-radius: 12px; overflow: hidden; width: 40%;">
      <div class="d-flex flex-column align-items-center" style="padding: 50px; background: #027FFF; padding: 30px 10px 15px; gap: 8px;">
        <i class="fa fa-exclamation-circle" style="color: white; font-size: 30px;"></i>
        <h4 style="font-size: 18px; font-weight: bold; color: white; text-align: center;">The meeting you are trying to schedule is clashing with the following meeting:</h4>
      </div>
        <div className="" style="padding: 20px;">
          <p style="font-size: 14px !important; margin-left: 16px;"><strong>Topic:</strong> ${topic}</p>
          <p style="font-size: 14px !important; margin-left: 16px;"><strong>Date:</strong> ${date}</p>
          <p style="font-size: 14px !important; margin-left: 16px;"><strong>Time:</strong> ${time}</p>
          <button id="closePopup" class="d-flex mx-auto" style="margin-top: 15px; padding: 5px 20px; border: none; background: #ef4444; color: white; border-radius: 5px; cursor: pointer;">CLOSE</button>
        </div>
      </div>
    </div>
  `;
  $('body').append(popupHtml);

  $('#closePopup').on('click', function () {
    $('#conflictPopup').remove();
  });
}

function showErrorPopup(message) {
  const popupHtml = `
    <div id="errorPopup" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
      <div style="background: white; border-radius: 12px; overflow: hidden; width: 40%;">
      <div class="d-flex flex-column align-items-center" style="padding: 50px; background: #027FFF; padding: 15px 10px 15px; gap: 8px;">
        <i class="fa fa-exclamation-circle" style="color: white; font-size: 30px;"></i>
      </div>
        <div className="" style="padding: 20px;">
          <p style="font-size: 16px !important; text-align: center;">${message}</p>
          <button id="closeErrorPopup" class="d-flex mx-auto" style="margin-top: 15px; padding: 5px 20px; border: none; background: #ef4444; color: white; border-radius: 5px; cursor: pointer;">CLOSE</button>
        </div>
      </div>
    </div>
  `;
  $('body').append(popupHtml);

  $('#closeErrorPopup').on('click', function () {
    $('#errorPopup').remove();
  });
}

function showConflictTooltip(details, targetElement) {
  $('#tooltip').remove();

  const formattedDetails = details.replace(/\n/g, '<br>');
  const $tooltip = $(`
    <div id="tooltip" style="
      position: absolute;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      font-size: 12px;
      color: #333;
      width: 250px;">
      <p style="margin: 0; font-weight: bold;">Meeting Details</p>
      <div style="margin: 0; color: #666;">${formattedDetails}</div>
    </div>
  `);

  $('body').append($tooltip);

  const elementOffset = $(targetElement).offset();
  const tooltipWidth = $tooltip.outerWidth();
  const tooltipHeight = $tooltip.outerHeight();
  const elementHeight = $(targetElement).outerHeight();

  $tooltip.css({
    top: elementOffset.top + (elementHeight / 2) - (tooltipHeight / 2),
    left: elementOffset.left - tooltipWidth - 10,
  });
}

function showStartMeetingPopup(meetingName, meetingDate, meetingStartTime, url) {
  const popupHtml = `
    <div class="start-meeting-popup" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
      <div style="background: white; border-radius: 16px; overflow: hidden; width: 50%;">
        <div style="padding: 10px; background: #027FFF; text-align: center; color: white; border-radius: 16px 16px 0 0;display: flex; justify-content: space-between; align-items: center;">
          <div class="d-flex align-items-center" style="gap: 8px;">
            <i class="fa fa-info-circle" style="font-size: 30px;"></i>
            <h4 style="font-size: 18px; font-weight: bold; margin: 10px 0;">Information</h4>
          </div>
          <button class="close-popup" style="display: block; margin: 0; padding: 0px 10px; border: none; background: #ef4444; color: white; border-radius: 5px; cursor: pointer; height: 30px;"><i class="fa fa-times"></i></button>
        </div>
        <div style="padding: 20px;">
          ${currentTabId == "oneDayMeetings" ?
            `<h6 style="text-align: center; font-size: 14px; text-transform: none;">The meeting <strong>${meetingName}</strong> is scheduled for <strong>${meetingDate} ${meetingStartTime}</strong></h6>`
            :
            `<h6 style="text-align: center; font-size: 14px; text-transform: none;">The meeting <strong>${meetingName}</h6>`
          }
          <a href="${url}" target="_blank" style="display: block; text-align: center; margin: 15px auto; padding: 10px 20px; background: #027FFF; color: white; border-radius: 5px; text-decoration: none; font-weight: bold; width: 110px;">Start Now</a>
          <hr style="border-top: 2px dashed #cdcdcd;">
          <h6 style="text-align: center; font-size: 14px; text-transform: none;">If you face issues with joining, copy the host link below and paste it into a new tab on your browser:</h6>
          <p class="copy-msg-1 mt-3 mb-0" style="text-align: center; font-weight: bold;"></p>
          <textarea readonly style="width: 100%; margin: 10px 0; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">${url}</textarea>
          <button onclick="copyURL('copyURL1','copy-msg-1')" class="copy-link-button" data-url="${url}" style="display: block; margin: 0 auto; padding: 10px 20px; border: none; background: #4caf50; color: white; border-radius: 5px; cursor: pointer; font-weight: 600">Copy Link</button>
          <input type="text" id="copyURL1" value="${url}" style="opacity:0;height:0px">
        </div>
      </div>
    </div>
  `;

  $('body').append(popupHtml);

  $('.close-popup').on('click', function () {
    $('.start-meeting-popup').remove();
  });
}

function populateRecordingModal(recordings, meetingStartDate, title, startTime, hostName) {
  const titles = {
    "shared_screen_with_speaker_view.mp4": "Shared Screen with Speaker View",
    "active_speaker.mp4": "Active Speaker",
    "shared_screen_with_gallery_view.mp4": "Shared Screen With Gallery View",
    "gallery_view.mp4": "Gallery View",
    "shared_screen.mp4": "Shared Screen",
    "shared_screen_with_speaker_view_CC.mp4": "Shared Screen With Speaker View CC",
    "-1.1.mp4": "Recording",
    "-1.2.mp4": "Recording 2",
    "audio_only": "Audio File",
  };

  var meetingStartDateFormatted = changeDateFormat(new Date(meetingStartDate), "MMM-dd-yyyy");

  let modalContent = `
    <div id="recordingModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
      <div style="background: white; border-radius: 12px; overflow: hidden; width: 70%; max-width: 70%;margin: auto; margin-top:50px;">
        <div class="">
          <div class="d-flex justify-content-between align-items-center" style="padding: 15px 10px; background: #027FFF;">
            <h5 class="text-white mb-0" style="font-size: 18px; font-weight: bold;">Available Recordings | ${title} | ${meetingStartDateFormatted} ${startTime} | ${hostName}</h5>
            <button onclick="closeAllVideoModal();" type="button" class="text-white btn btn-sm btn-danger" data-bs-dismiss="modal" aria-label="Close" style="font-size: 20px !important; margin: 0; padding: 0px 8px;">&times;</button>
          </div>
          <div class="" style="padding: 20px; height: 70vh; overflow-y: auto">`;

  recordings.forEach(record => {
    const meetingId = record.meetingId;
    const sessionUrls = record.urls
      .map(urlData => {
        for (const key in titles) {
          if (urlData.url.includes(key)) {
            return { url: urlData.url, title: titles[key] };
          }
        }
      })

    const transcriptUrl = record.urls[record.urls.length - 1]?.url;

    if (sessionUrls.length > 0) {
      modalContent += `
        <div class="session-block pb-4">
          <h3 class="mb-3 mt-0">Meeting ID: ${meetingId}</h3>
          ${sessionUrls.map((recording, index) => `
            <div class="recording-item pb-3 pt-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom:1px solid #eee;">
              <h4>${index + 1}. ${recording.title}</h4>
              <button class="btn btn-sm rounded" style="background-color: #027FFF; border: 1px solid #027FFF;" onclick="playRecording('${recording.url}', '${recording.title}')">Play</button>
            </div>
          `).join("")}
          ${
          transcriptUrl
              ? `
              <div class="recording-item pb-3 pt-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom:1px solid #eee;">
                <h4>${sessionUrls.length + 1}. Transcript</h4>
                <button class="btn btn-sm bg-white rounded" style="border: 1px solid #000; color: #000;" onclick="showVTTFile('${transcriptUrl}', 'Transcript')">Read</button>
              </div>`
              : ""
          }
        </div>`;
    }
  });

  modalContent += `
          </div>
        </div>
      </div>
    </div>
  `;

  let modalElement = $("#recordingModal");
  if (modalElement.length > 0) {
    modalElement.remove();
  }

  $("body").append(modalContent);
  $("#recordingModal").modal("show");
}

function populateRecurringRecording(data, meetingTitle, hostName, entityId, startOfWeek, endOfWeek){
  startOfWeek = changeDateFormat(new Date(startOfWeek), "MMM-dd-yyyy");
  endOfWeek = changeDateFormat(new Date(endOfWeek), "MMM-dd-yyyy");
  var pastDateLimit = new Date();
  pastDateLimit.setDate(pastDateLimit.getDate() - recordingLimit);
  $("<style>")
    .prop("type", "text/css")
    .html(`
      .recurring-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        z-index: 999;
      }

      .recurring-modal {
        position: fixed;
        top: 0;
        right: -90%;
        width: 90%;
        height: 100vh;
        background: white;
        box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.2);
        transition: right 0.3s ease-in-out;
        z-index: 1000;
      }

      .recurring-modal.open {
        right: 0;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #007bff;
        color: white;
      }

      .modal-body {
        padding: 20px;
      }

      .session-block {
        margin-bottom: 15px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
      }

      .close-btn {
        background: transparent;
        border: none;
        font-size: 24px;
        color: white;
        cursor: pointer;
      }

      .play-btn {
        background: #007bff;
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 5px;
      }

      .play-btn:hover {
        background: #0056b3;
      }

      .accordion-btn {
        background: #D7EBFF;
        padding: 5px 10px;
        width: 100%;
        text-align: left;
        cursor: pointer;
        font-weight: bold;
        border-radius: 5px;
        
      }

      .accordion-btn:focus {
        outline: 0px !important;
      }

      .recording-list {
        padding: 10px;
        background: #fff;
        border-radius: 5px;
      }
    `)
  .appendTo("head");

  const titles = {
    "shared_screen_with_speaker_view.mp4": "Shared Screen with Speaker View",
    "active_speaker.mp4": "Active Speaker",
    "shared_screen_with_gallery_view.mp4": "Shared Screen With Gallery View",
    "gallery_view.mp4": "Gallery View",
    "shared_screen.mp4": "Shared Screen",
    "shared_screen_with_speaker_view_CC.mp4": "Shared Screen With Speaker View CC",
    "-1.1.mp4": "Recording",
    "-1.2.mp4": "Recording 2",
    "audio_only": "Audio File",
  };

  var modalContent = `
    <div id="recurringMeetingBackdrop" class="recurring-modal-backdrop" onclick="closeRecurringModal();"></div>
    <div id="recurringMeetingModal" class="recurring-modal">
      <div class="p-3" style="background-color:#027FFF;">
        <h5 class="mb-0" style="color: white;font-size:18px;font-weight: 700;">${meetingTitle} | ${hostName}</h5>
         <button onclick="closeRecurringModal();" type="button" class="p-2" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-30px;top:35px;background-color: white !important;border-radius: 5px 0px 0px 5px;font-size: 35px;border:0px;color:#000;">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div style="background-color: #F1F3F5; height: 100vh;">

        <!-- Date Filter Section -->
        <form id="filterRecurringRecording" class="d-flex align-items-center mb-3 px-5" autocomplete="off" style="gap: 10px;">
          <select onchange="setFilterDatesAccordingly(this, '#filterRecurringMeetingStartDate', '#filterRecurringMeetingEndDate');" id="filterRecurringDateDuration" class="border rounded" style="border-color: #a1a1a1 !important;width: 10%; font-size: 14px; padding: 8px; appearance: auto; -webkit-appearance: auto; -moz-appearance: auto;">
            <option value="Week" selected>This Week</option>
            <option value="Month">This Month</option>
            <option value="Custom">Custom</option>
          </select>

          <div class="d-flex align-items-center my-4" style="gap:10px;">
            <input onchange="getDatepickerChangeVal(this);" type="text" id="filterRecurringMeetingStartDate" value="${startOfWeek}" class="border rounded" style="border-color: #a1a1a1 !important;width: 100%; font-size: 14px; padding: 8px;" placeholder="Select start date">
            <input onchange="getDatepickerChangeVal(this);" type="text" id="filterRecurringMeetingEndDate" value="${endOfWeek}" class="border rounded" style="border-color: #a1a1a1 !important;width: 100%; font-size: 14px; padding: 8px;" placeholder="Select end date">
          </div>

          <button id="filterRecurringSearchButton" type="submit" onclick="applyRecurringRecordingFilters('${entityId}');" class="btn ml-auto rounded" style="width: max-content; background-color: #027FFF; padding: 10px 20px; font-weight: bold;">Search</button>
        </form>

        <div class="mt-5 px-5" style="height: 80vh;overflow-y:auto;">
          <table id="recurring-recordings-table" class="w-100 table">
            <thead style="background-color: #027FFF;position: sticky;top: 0;z-index: 1;">
              <tr style="font-size: 14px;">
                <th class="p-3" style="padding-left:16px !important;border-bottom: 0; border-top: 0px; font-weight: bold;width: 25%; color:#FFF">Start Time</th>
                <th class="p-3" style="padding-left:16px !important;border-bottom: 0; border-top: 0px; font-weight: bold;width: 25%; color:#FFF">Meeting ID</th>
                <th class="p-3" style="border-bottom: 0; border-top: 0px; font-weight: bold;width: 50%; color:#FFF">Recordings</th>
              </tr>
            </thead>
            <tbody id="recurringRecordingsTableBody">
            ${data
            .map((session, index) => {
              var sessionDate = new Date(session.startTime);
              var showRecordingButton = sessionDate >= pastDateLimit || USER_ROLE == "DIRECTOR";
              return`
                <tr colspan="3" style="height:3px;"></tr>
                  <tr>
                    <td style="font-weight: 700;border-top-left-radius: 10px;border-bottom-left-radius: 10px;background-color:#fff;" class="py-3 pl-4">${convertUTCToTimezoneAs(session.startTime, DATETIME_FORMATTER, USER_TIMEZONE).format('MMM DD, YYYY hh:mm:ss a')}</td>
                    <td style="font-weight: 700;background-color:#fff;" class="py-3 pl-4">${session.meetingId}</td>
                    <td class="py-3 pr-5" style="border-top-right-radius: 10px;border-bottom-right-radius: 10px;background-color:#fff;">
                      ${showRecordingButton ?
                        `<button class="accordion-btn d-flex justify-content-between align-items-center border-0" onclick="toggleRecording(${index})">
                          <span>Recording list</span>
                          <i class="fa fa-chevron-down" aria-hidden="true"></i>
                        </button>`
                      :
                        ""
                      }
                      <div class="recording-list" id="recording-${index}" style="display: none;">
                        <div>
                          ${session.recordings.map((recording, i) => {
                            let title;
                            for (const key in titles) {
                              if (recording.includes(key)) {
                                title = titles[key];
                                break;
                              }
                            }

                            return `
                            <div class="recording-item py-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom:1px solid #eee;">
                              <h4 style="font-size:13px;font-weight:700;">${i + 1}. ${title}</h4>
                              <button class="btn btn-sm rounded" style="background-color: #027FFF; border: 1px solid #027FFF;" onclick="playRecording('${recording}', '${title}')">Play</button>
                            </div>`;
                          }).join('')}

                          ${session.recordings.length > 0 ? (() => {
                            const transcriptUrl = session.recordings[session.recordings.length - 1];
                            return transcriptUrl
                              ? `
                              <div class="recording-item py-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom:1px solid #eee;">
                                <h4 style="font-size:13px;font-weight:700;">${session.recordings.length + 1}. Transcript</h4>
                                <button class="btn btn-sm bg-white rounded" style="border: 1px solid #000; color: #000;" onclick="showVTTFile('${transcriptUrl}', 'Transcript')">Read</button>
                              </div>`
                              : "";
                          })() : ""}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr colspan="3" style="height:3px;"></tr>
                `;
                })
                .join("")}
            </tbody>
          </table>
          <!-- Pagination -->
          <div id="recurringPaginationContainer" class="text-center mt-4">
  
          </div>
        </div>
      </div>
    </div>
  `;

  $("body").append(modalContent);
  if(startOfWeek && endOfWeek){
    $("#filterRecurringMeetingStartDate").attr("disabled", true);
    $("#filterRecurringMeetingEndDate").attr("disabled", true);
  }

  if (!data || data.length === 0) {
    $("#recurringRecordingsTableBody").html('<tr><td colspan="3" class="text-center py-5" style="font-size: 16px;font-weight: 700;">No recordings found</td></tr>');
  }

  setTimeout(() => {
    $("#recurringMeetingBackdrop").fadeIn(200);
    $("#recurringMeetingModal").addClass("open");
    $("body").css("overflow", "hidden");
  }, 50);

  $("#filterRecurringMeetingStartDate, #filterRecurringMeetingEndDate").on("change", function () {
    const formattedDate = changeDateFormat(new Date(this.value), "MMM-dd-yyyy");
    if(formattedDate == "undefined 0NaN, NaN"){
      $(this).val('');
    } else {
      $(this).val(formattedDate);
    }
  });
  $('#filterRecurringMeetingStartDate').datepicker({
    format: 'M dd, yyyy',
    autoclose: true,
  }).on('changeDate', function (e) {
    $('#filterRecurringMeetingEndDate').val('');
    $('#filterRecurringMeetingEndDate').datepicker('setStartDate', e.date);
  });;
  $('#filterRecurringMeetingEndDate').datepicker({
    format: 'M dd, yyyy',
    autoclose: true,
  });
}

function updateRecordingsTable(data) {
  var pastDateLimit = new Date();
  pastDateLimit.setDate(pastDateLimit.getDate() - recordingLimit);
  if (!data || data.length === 0) {
    $("#recurringRecordingsTableBody").html('<tr><td colspan="3" class="text-center py-5" style="font-size: 16px;font-weight: 700;">No recordings found</td></tr>');
    return;
  }
  const titles = {
    "shared_screen_with_speaker_view.mp4": "Shared Screen with Speaker View",
    "active_speaker.mp4": "Active Speaker",
    "shared_screen_with_gallery_view.mp4": "Shared Screen With Gallery View",
    "gallery_view.mp4": "Gallery View",
    "shared_screen.mp4": "Shared Screen",
    "shared_screen_with_speaker_view_CC.mp4": "Shared Screen With Speaker View CC",
    "-1.1.mp4": "Recording",
    "-1.2.mp4": "Recording 2",
    "audio_only": "Audio File",
  };

  let recordingsHtml =
   data.map((session, index) => {
    var sessionDate = new Date(session.startTime);
    var showRecordingButton = sessionDate >= pastDateLimit || USER_ROLE == "DIRECTOR";
    return`
      <tr colspan="3" style="height:3px;"></tr>
      <tr>
        <td class="py-3 pl-4" style="font-weight: 700; background-color:#fff; border-top-left-radius: 10px;border-bottom-left-radius: 10px;">${convertUTCToTimezoneAs(session.startTime, DATETIME_FORMATTER, USER_TIMEZONE).format('MMM DD, YYYY hh:mm:ss a')}</td>
        <td class="py-3 pl-4" style="font-weight: 700; background-color:#fff;">${session.meetingId}</td>
        <td class="py-3 pr-5" style="background-color:#fff;border-top-right-radius: 10px;border-bottom-right-radius: 10px;">
          ${showRecordingButton ?
            `<button class="accordion-btn d-flex justify-content-between align-items-center border-0" onclick="toggleRecording(${index})">
              <span>Recording list</span>
              <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </button>`
          :
            ""
          }
          <div class="recording-list" id="recording-${index}" style="display: none;">
            <div>
              ${session.recordings.map((recording, i) => {
                let title = "Unknown Recording";
                for (const key in titles) {
                  if (recording.includes(key)) {
                    title = titles[key];
                    break;
                  }
                }

                return `
                <div class="recording-item py-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom:1px solid #eee;">
                  <h4 style="font-size:13px;font-weight:700;">${i + 1}. ${title}</h4>
                  <button class="btn btn-sm rounded" style="background-color: #027FFF; border: 1px solid #027FFF;" onclick="playRecording('${recording}', '${title}')">Play</button>
                </div>`;
              }).join('')}

              ${session.recordings.length > 0 ? (() => {
                const transcriptUrl = session.recordings[session.recordings.length - 1];
                return transcriptUrl
                  ? `
                  <div class="recording-item py-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom:1px solid #eee;">
                    <h4 style="font-size:13px;font-weight:700;">${session.recordings.length + 1}. Transcript</h4>
                    <button class="btn btn-sm bg-white rounded" style="border: 1px solid #000; color: #000;" onclick="showVTTFile('${transcriptUrl}', 'Transcript')">Read</button>
                  </div>`
                  : "";
              })() : ""}
            </div>
          </div>
        </td>
      </tr>
      <tr colspan="3" style="height:3px;"></tr>
    `})
    .join("");

  $("#recurringRecordingsTableBody").html(recordingsHtml);
}