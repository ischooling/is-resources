function getMeetingManagementContent() {
  $("<style>")
    .prop("type", "text/css")
    .html(`
      
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
              <button id='resetDeleteErrorWarningNo' type="button" class="rounded btn btn-danger  " data-dismiss="modal" style="font-weight: 700;" >No</button>
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
    <div class="main-card mb-3">
      <div class="card mt-4" style="box-shadow: 0px 0px;">
        <div id="card-body" class="card-body mx-md-5 mx-0">`
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
    <h2 class="mb-2 font-weight-bold font-24">Meetings</h2>
    <form id="filterMeeting" class="mb-3" autocomplete="off">
      <div class="form-row w-100">
        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12 mb-xl-0 mb-2">
          <div id="filterHostUserIdDiv">
            <select id="filterHostUserId" name="filterHostUserId" class="form-control">
              <!-- Dynamically loaded -->
            </select>
          </div>
        </div>
        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12 mb-xl-0 mb-2">
          <div id="filterGeneralMeetingTypeDiv">
            <select id="filterGeneralMeetingType" name="filterGeneralMeetingType" class="form-control">
              <!-- Dynamically loaded -->
            </select>
          </div>
        </div>
        <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 pr-0">
          <div class="form-row">
            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-4 col-12 ms-0 mb-2">
              <select onchange="setFilterDatesAccordingly(this, '#filterMeetingStartDate', '#filterMeetingEndDate')" id="filterDateDuration" name="filterDateDuration" class="form-control font-14" >
                <option value="Today" selected>Today</option>  
                <option value="Week">Week</option>
                <option value="Month">Month</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div class="col-xl-5 col-lg-6 col-md-6 col-sm-8 col-12 ms-0 mb-2">
              <div class="form-row">
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 ms-0 mb-2">
                      <input onchange="getDatepickerChangeVal(this)" type="text" id="filterMeetingStartDate" class="form-control" placeholder="Start Date" autocomplete="off" />
                  </div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <input onchange="getDatepickerChangeVal(this)" type="text" id="filterMeetingEndDate" class="form-control" placeholder="End Date" autocomplete="off" />
                  </div>
              </div>
            </div>
            <div class="ml-auto">
              <button id="filterSearchButton" type="submit" onclick="applyFilters();" class="btn btn-lg btn-success  ml-auto"><i class="fa fa-search"></i>&nbsp;Search</button>
              <button id="filterResetButton" type="button" onclick="resetFilter();" class="btn btn-lg btn-danger  ml-auto"><i class="fa fa-undo"></i>&nbsp;Reset</button>
            </div>
          </div>
        </div>
      </div>
      ${/*
        <div class="d-flex w-100 align-items-center my-4" style="gap: 8px;">
          <div class="d-none hidden">
            <label class="text-dark" for="filterTitle">Title</label>
            <input type="text" id="filterTitle" class="" placeholder="Enter meeting title" />
          </div>

          <div id="filterHostUserIdDiv" style="width: 20%;">
            <select id="filterHostUserId" name="filterHostUserId" class="form-control">
              <!-- Dynamically loaded -->
            </select>
          </div>

          <div id="filterGeneralMeetingTypeDiv" style="width: 20%;">
            <select id="filterGeneralMeetingType" name="filterGeneralMeetingType" class="form-control">
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
            <input onchange="getDatepickerChangeVal(this)" type="text" id="filterMeetingStartDate" class="form-control" placeholder="Select Start Date" autocomplete="off" />
          </div>
          <div class="">
            <input onchange="getDatepickerChangeVal(this)" type="text" id="filterMeetingEndDate" class="form-control" placeholder="Select End Date" autocomplete="off" />
          </div>

          <div class="d-none hidden">
            <label class="text-dark" for="limit">Limit</label>
            <input type="number" min="1" id="limit" class="" value="" placeholder="Enter Limit" />
          </div>
        </div>  

        <div class="text-right d-flex" style="gap: 6px;">
          <button id="filterSearchButton" type="submit" onclick="applyFilters();" class="btn btn-primary  ml-auto">Search</button>
          <button id="filterResetButton" type="button" onclick="resetFilter();" class="btn btn-danger  ml-auto">Reset</button>
        </div>
      */''}
      
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
      <div class="d-flex w-100 flex-wrap">
      <!-- Main meeting form on the left -->
        <div class="main-card mb-3 col-xl-9 col-lg-11 col-md-12 col-sm-12 col-12 p-0">
          <div class="card" style="box-shadow: 0px 0px;">
            <div class="card-body mx-md-5 mx-0 p-0">
              <button id="backFromForm" class="bg-transparent mb-4 border-0 text-primary cursor">
                <i class="fa fa-chevron-left mr-2"></i> Back to Meeting
              </button>
              <h2 class="mb-3 font-weight-bold">Schedule Meeting</h2>
              <form id="meetingForm" autocomplete="off">
                <div class="form-row mb-3">
                  <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <label for="generalMeetingType" class="font-16">Meeting Type</label>
                  </div>
                  <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                    <select id="generalMeetingType" name="generalMeetingType" class="form-control" required autocomplete="off">
                      <!-- Dynamically loaded -->
                    </select>
                  </div>
                </div>
                <div class="form-row mb-3">
                  <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <label for="topic" class="font-16">Topic</label>
                  </div>
                  <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                    <input type="text" id="topic" class="form-control" placeholder="Enter topic" autocomplete="off" required />
                  </div>
                </div>
                <div class="form-row mb-3" id="meetingTypeContainer">
                  <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <label for="meetingType" class="font-16">Type of Meeting</label>
                  </div>
                  <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
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
                </div>
                <div class="form-row mb-3">
                  <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <label for="host" class="font-16">Host</label>
                  </div>
                  <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                    <select onchange="onChangeHost(this);checkAndFetchMeetings();updateNewDateInCalender();" id="host" name="host" class="form-control" required autocomplete="off">
                      <!-- Dynamically loaded -->
                    </select>
                  </div>
                </div>
                <div class="form-row mb-3" id="attendeesContainer" style="display: none;">
                  <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <label for="attendees" class="font-16">Attendees</label>
                  </div>
                  <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                    <div class="d-flex flex-column w-100">
                      <div class="d-flex flex-column w-100 position-relative" style="gap:2px;">
                        <input id="attendees" class="form-control" placeholder="Search by name & email" oninput="getAttendeesList();">
                        <ul id="dynamic-attendees-list" class="rounded m-0 px-2 position-absolute" style="background-color: #eee; list-style: none; max-height: 150px;z-index: 10;overflow-y: auto;width: 100%;top: 42px; display: none;"></ul>
                      </div>
                      <!-- List of selected attendees -->
                      <div id="selected-attendees-list" class="mt-2 d-flex flex-wrap rounded" style="background-color: #EDF6FF;"></div>
                    </div>
                  </div>
                </div>
                <div class="form-row mb-3" id="whenContainer" style="display: none;">
                  <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <label for="when" class="form-label font-16">When</label>
                  </div>
                  <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                    <div class="d-flex w-100" style="gap: 16px;">
                      <input
                        onchange="checkAndFetchMeetings();getDatepickerChangeVal(this);"
                        type="text"
                        id="when"
                        name="when"
                        placeholder="Select Date"
                        class="form-control datepicker"
                        autocomplete="off"
                        required
                        readonly
                        onkeydown="return false"
                      >
                      <select
                        onchange="checkAndFetchMeetings();"
                        id="hour"
                        name="hour"
                        class="form-control"
                        required
                        autocomplete="off"
                      >
                        <option value="" disabled selected>HH:MM</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="form-row mb-3" id="durationContainer" style="display: none;">
                  <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <label for="durationHour" class="form-label font-16">Duration</label>
                  </div>
                  <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                    <div class="form-row w-100">
                      <div class="d-flex align-items-center col-xl-3 col-lg-3 col-md-5 col-sm-4 col-6">
                        <select
                          id="durationHour"
                          name="durationHour"
                          class="form-control"
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
                        <p class="m-0 ml-1">Hr</p>
                      </div>

                      <div class="d-flex align-items-center col-xl-3 col-lg-3 col-md-5 col-sm-4 col-6">
                        <select
                          id="durationMinute"
                          name="durationMinute"
                          class="form-control"
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
                        <p class="m-0 ml-1">Min</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row mb-3">
                  <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <label for="timezone" class="font-16">Time Zone</label>
                  </div>
                  <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                    <select id="timezone" name="timezone" class="form-control" disabled required autocomplete="off">
                      <!-- Add more timezones as needed -->
                    </select>
                  </div>
                </div>
                <div class="full pt-2 text-right">
                  <button type="button" class="btn btn-danger " onclick="resetRequiredFormData('#host');"><i class="fa fa-undo"></i>&nbsp;Reset</button>
                  <button type="submit" class="btn btn-success ">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <!-- Schedule section on the right -->
        <div id="scheduleAndMeetingContainer" class="col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12 p-0 border-left" style="display: none;">
          <div id="meetingSection" class="main-card w-100 mb-3" style="display: none;">
            <div class="card mt-2 mb-0" style="box-shadow: 0px 0px;">
              <div class="card-body ">
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
    <div class="w-100" id="savedMeetingLinkHtml" style="display: none;">  
      <div class="d-flex w-100">
        <div class="main-card mb-3 col-xl-9 col-lg-11 col-md-12 col-sm-12 col-12 p-0">
          <div class="card" style="box-shadow: 0px 0px;">
            <div class="card-body mx-md-5 mx-0 p-0">
              <div class="d-flex align-items-center mb-4" style="gap: 10px;">
                <button id="backFromSaved" class="bg-transparent border-0 font-16 text-primary">
                  Back to Meeting
                </button>
                <i class="fa fa-chevron-right mr-1"></i>
                <p id="formDataTitle" class="m-0 font-16"></p>
              </div>
              <div  class="meeting-container">
                  <h2 class="mb-3 font-weight-bold">Meeting Details</h2>
                  <div class="form-row mb-3">
                    <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                      <div><strong>General Meeting Type</strong></div>
                    </div>
                    <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                      <div id="generalMeetingTypeTitle" class="font-weight-semi-bold"></div>
                    </div>
                  </div>
                  <div class="form-row mb-3">
                    <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                      <div><strong>Topic</strong></div>
                    </div>
                    <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                      <div id="formDataTitle1" class="font-weight-semi-bold"></div>
                    </div>
                  </div>
                  <div class="form-row mb-3">
                    <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                      <div><strong>Host Details</strong></div>
                    </div>
                    <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                      <div id="hostDetailsExtra" class="font-weight-semi-bold"></div>
                    </div>
                  </div>
                  <div class="w-100" id="meetingTypeDiv"></div>
                  <div class="form-row mb-3">
                    <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                      <div><strong>Type of Meeting</strong></div>
                    </div>
                    <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                      <div id="meetingTypeName" class="font-weight-semi-bold"></div>
                    </div>
                  </div>
                  <div class="form-row mb-3">
                    <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                      <div><strong>Time Zone</strong></div>
                    </div>
                    <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                      <div id="timezoneDetailsExtraAndTimezoneDetailsValue" class="font-weight-semi-bold"></div>
                    </div>
                  </div>
                  <div class="form-row mb-3">
                    <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                      <div><strong>Invite Link</strong></div>
                    </div>
                    <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                      <div id="joinUrl" class="font-weight-semi-bold text-primary"></div>
                    </div>
                  </div>
                  <div class="action-buttons full text-right">
                    <button id="startLensUrlBtn" class="btn btn-primary ">Start</button>
                    <button id="copyJoinUrlBtn" class="btn btn-success ">
                      <i class="fa fa-clone mr-2"></i>
                      Copy Invitation
                    </button>
                    <button id="deleteMeetingBtn" class="btn btn-danger ">Delete</button>
                  </div>
              </div>
            </div>
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
            <input onchange="getDatepickerChangeVal(this);" type="text" id="filterRecurringMeetingStartDate" value="${startOfWeek}" class="form-control"  placeholder="Select start date">
            <input onchange="getDatepickerChangeVal(this);" type="text" id="filterRecurringMeetingEndDate" value="${endOfWeek}" class="form-control" placeholder="Select end date">
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