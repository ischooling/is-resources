function getWatiNumbersContent() {
  $("<style>")
    .prop("type", "text/css")
    .html(`
      table {
        border-collapse: separate;
        border-spacing: 0;
        min-width: 350px;
      }

      table tr th,
      table tr td {
        border-right: 1px solid #E5E1DA;
        border-bottom: 1px solid #E5E1DA;
        padding: 5px;
      }

      table tr th:first-child,
      table tr td:first-child {
        border-left: 1px solid #E5E1DA;
      }
      table tr th {
        background: #F2EFE7;
        text-align: left;
        border-top: solid 1px #E5E1DA;
        font-weight: 700;
        padding: 10px 5px;
      }

      table tr:first-child th:first-child {
        border-top-left-radius: 6px;
      }

      table tr:first-child th:last-child {
        border-top-right-radius: 6px;
      }

      table tr:last-child td:first-child {
        border-bottom-left-radius: 6px;
      }

      table tr:last-child td:last-child {
        border-bottom-right-radius: 6px;
      }
    `)
  .appendTo("head");
  var html = `
    <div class="container mt-4 w-75">
      <div class="d-flex justify-content-between">
        <div>
          <h2 class="mb-3" style="font-weight:700">Wati Number Distribution</h2>
          <h5 class="mb-4" style="font-size: 16px;font-weight:600"">Manage Numbers with Users</h5>
        </div>
        <div>
          <button onclick="addWatiNumber();" class="border-0 rounded px-5 py-3" style="background-color:#FFB200;font-weight:600;">Add Wati Number <span><i class="fa fa-plus" aria-hidden="true"></i></span></button>
        </div>
      </div>

      <div class="filter-container mb-3 p-3">
        <div class="d-flex" style="gap:16px;">
          <div class="w-100">
            <input type="text" id="filterName" class="rounded border p-3 w-100" placeholder="Enter Name">
          </div>
          <div class="w-100">
            <input type="text" id="filterNumber" class="rounded border p-3 w-100" placeholder="Enter Number">
          </div>
          <div class="w-100">
            <select id="filterStatus" class="rounded border p-3 w-100">
              <option value="">Select Status</option>
              <option value="A">Active</option>
              <option value="I">Inactive</option>
            </select>
          </div>
          <div class="d-flex w-100" style="gap: 16px;">
            <button onclick="showFilterData();" class="border-0 rounded px-5 py-2 text-white" style="background-color:#027FFF;">Search <i class="fa fa-search"></i></button>
            <button onclick="resetField();" class="border-0 rounded px-5 py-2" style="background-color:#F1EFE7;">Reset <i class="fa fa-refresh"></i></button>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="w-100">
          <thead class="">
            <tr>
              <th>#</th>
              <th>Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="watiNumbersBody">
            <tr>
              <td colspan="4" class="text-center py-3">Loading...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  getBodyOfTable();
  return html;
}

function getBodyOfTable() {
  $.ajax({
    type: "GET",
    url: BASE_URL + CONTEXT_PATH + "wati/api/get-all-numbers",
    dataType: "json",
    success: function (response) {
      var list = response.list;
      if(list.length == 0){
        $("#watiNumbersBody").html('<tr><td colspan="4" class="text-center text-danger">No Data Found</td></tr>');
      } else {
        var tableBody = list
          .map((item, index) => {
            return `
              <tr>
                <td>${index + 1}</td>
                <td>${item.waNumber}</td>
                <td style="font-size: 14px;">
                  ${item.status === "A" 
                    ? `<span class="text-success fw-bold">Active <i class="fa fa-check-circle"></i></span>` 
                    : `<span class="text-danger fw-bold">Inactive <i class="fa fa-times-circle"></i></span>`}
                </td>
                <td style="width:30%;">
                  <button onclick="updateWati('${item.waNumber}', '${item.watiToken}', '${item.watiUrl}', '${item.status}');" class="update-btn rounded border-0 text-white px-3 py-2" style="background-color:#1F509A" data-id="${item.id}">
                    Update <i class="fa fa-pencil"></i>
                  </button>
                  <button onclick="showFilterData(true, '${item.waNumber}');" class="border-0 rounded px-3 py-2 text-white" style="background-color:#027FFF;">
                    About Number <i class="fa fa-info-circle"></i>
                  </button>
                  <button onclick="addWatiUser('${item.waNumber}');" class="border-0 rounded px-3 py-2 text-white" style="background-color:#3D8D7A;">
                    Add User <i class="fa fa-plus"></i>
                  </button>
                </td>
              </tr>`;
          })
          .join("");
        $("#watiNumbersBody").html(tableBody);
      }
    },
    error: function () {
      $("#watiNumbersBody").html(
        '<tr><td colspan="4" class="text-center text-danger">Failed to load data</td></tr>'
      );
    },
  });
}

function showFilterData(isAboutNumber = false, numberOnly = null) {
  var html = `
    <div id="filteredNumbersModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 999;">
      <div style="background: white; border-radius: 12px; overflow: hidden; width: 70%; max-height: 90vh;">
        <div class="d-flex justify-content-between align-items-center" style="padding: 50px; background: #027FFF; padding: 15px 10px;">
          <h4 style="font-size: 18px; font-weight: bold; color: white; text-align: center;">List</h4>
          <button id="closePopup" class="d-flex" style="padding: 5px 10px; border: none; background: #ef4444; color: white; border-radius: 5px; cursor: pointer;"><i class="fa fa-times" aria-hidden="true"></i></button>
        </div>
        <div class="m-3" style="max-height: 80vh;overflow: auto;">
          <table class="w-100">
            <thead style="position: sticky;top: 0;">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Number</th>
                ${/*<th>Status</th>*/''}
                <th>User Linking</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="filteredNumbersBody">
              <tr>
                <td colspan="6" class="text-center py-3">Loading...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  $('body').append(html);
  getFilteredNumbers(isAboutNumber, numberOnly)

  $('#closePopup').on('click', function () {
    $('#filteredNumbersModal').remove();
  });
}

function getFilteredNumbers(isAboutNumber, numberOnly) {
  var body = {
    name: isAboutNumber ? "" : $("#filterName").val().trim(),
    number: numberOnly || $("#filterNumber").val().trim(),
    status: isAboutNumber ? "" : $("#filterStatus").val().trim()
  };

  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + "wati/api/get-numbers-by-filter",
    data: JSON.stringify(body),
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      var list = response.data;
     if (list.length == 0) {
      $("#filteredNumbersBody").html(
        '<tr><td colspan="6" class="text-center">No Data Found For Searched Entries.</td></tr>'
      );
      } else {
        var modalBody = list
          .map((item, index) => {
            var formattedDate = changeDateFormat(new Date(item.date), "MMM-dd-yyyy");
            return `
              <tr>
                <td>${index + 1}</td>
                <td>${item.name || "N/A"}</td>
                <td>${item.number}</td>
                ${/*<td style="font-size: 14px;">
                  ${item.status === "A" 
                    ? `<span class="text-success fw-bold">Active <i class="fa fa-check-circle"></i></span>` 
                    : `<span class="text-danger fw-bold">Inactive <i class="fa fa-times-circle"></i></span>`}
                </td>*/''}
                <td class="linkingStatus" data-status="${item.userLinkingStatus}" style="font-size: 14px;">
                  ${item.userLinkingStatus === "A" 
                    ? `<span class="text-success fw-bold">Linked <i class="fa fa-check"></i></span>` 
                    : `<span class="text-danger fw-bold">Unlinked <i class="fa fa-times"></i></span>`}
                </td>
                <td>${formattedDate || "N/A"}</td>
                <td>
                  <button onclick="changeLinkingStatus(this, '${item.number}', '${item.uId}');" class="border-0 rounded px-3 py-2 text-white" style="background-color:#027FFF;">Change Linking Status</button>
                </td>
              </tr>`;
          })
          .join("");

        $("#filteredNumbersBody").html(modalBody);
      }
      $("#filteredNumbersModal").show();
    },
    error: function () {
      $("#filteredNumbersBody").html(
        '<tr><td colspan="6" class="text-center text-danger">Failed to load filtered data</td></tr>'
      );
    },
  });
}

function changeLinkingStatus(btn, number, userId) {
  var row = $(btn).closest("tr");
  var currentStatus = row.find(".linkingStatus").attr("data-status");

  var dropdownHtml = `
    <select class="rounded border p-2 w-50 linkingStatusDropdown">
      <option value="A" ${currentStatus === "A" ? "selected" : ""}>Active</option>
      <option value="I" ${currentStatus === "I" ? "selected" : ""}>Inactive</option>
    </select>
    <button class="border-0 rounded px-3 py-2 text-white saveStatusBtn" style="background-color:#027FFF;">Enter</button>
  `;

  row.find(".linkingStatus").html(dropdownHtml);

  row.find(".saveStatusBtn").on("click", function () {
    saveLinkingStatus(row, number, userId);
  });
}

function saveLinkingStatus(row, number, userId) {
  var newStatus = row.find(".linkingStatusDropdown").val();
  var body = {
    number: number,
    userId: userId,
    status: newStatus,
  };

  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + "wati/api/update-wati-user",
    data: JSON.stringify(body),
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      if (response.status === "success") {
        showMessage(true, "Status updated successfully!");
        var updatedStatusHtml = newStatus === "A"
          ? `<span class="text-success fw-bold linkingStatus" data-status="A">Linked <i class="fa fa-check"></i></span>`
          : `<span class="text-danger fw-bold linkingStatus" data-status="I">Unlinked <i class="fa fa-times"></i></span>`;

        row.find(".linkingStatus").html(updatedStatusHtml);
      } else {
        showMessage(false, response.message);
      }
    },
    error: function (e) {
      showMessage(false, e.message);
    }
  });
}

function resetField(){
  $("#filterName").val("");
  $("#filterNumber").val("");
  $("#filterStatus").val("");
}

function addWatiNumber() {
  var html = `
    <div id="addWatiNumberModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 999;">
      <div style="background: white; border-radius: 12px; overflow: hidden; width: 50%;">
        <div class="d-flex justify-content-between align-items-center" style="background: #027FFF; padding: 15px 10px;">
          <h4 style="font-size: 18px; font-weight: bold; color: white;">Add Wati Number</h4>
          <button id="closeAddWatiNumberModal" class="d-flex" style="padding: 5px 10px; border: none; background: #ef4444; color: white; border-radius: 5px; cursor: pointer;">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>

        <div class="p-4">
          <form onsubmit="submitAddNumberForm(event);" id="addWatiNumberForm">
            <div class="mb-3">
              <label for="addNumber" class="">Wati Number</label>
              <input type="text" id="addNumber" class="rounded border p-3 w-100" placeholder="Enter Wati Number" required autocomplete="off">
            </div>
            <div class="mb-3">
              <label for="addWUrl" class="">Wati URL</label>
              <input type="text" id="addWUrl" class="rounded border p-3 w-100" placeholder="Enter Wati URL" required autocomplete="off">
            </div>
            <div class="mb-3">
              <label for="addWToken" class="">Wati Token</label>
              <input type="text" id="addWToken" class="rounded border p-3 w-100" placeholder="Enter Wati Token" required autocomplete="off">
            </div>

            <div class="d-flex justify-content-end" style="gap: 10px;">
              <button type="submit" class="border-0 rounded px-5 py-2 text-white" style="background-color:#027FFF;">Add Number</button>
              <button type="button" id="closeAddWatiNumberModalBtn" class="border-0 rounded px-5 py-2" style="background-color:#F1EFE7;">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  $("body").append(html);

  $('#closeAddWatiNumberModal, #closeAddWatiNumberModalBtn').on('click', function() {
    $('#addWatiNumberModal').remove();
  });
}

function submitAddNumberForm(e){
  e.preventDefault();
  var body = {
    number: $("#addNumber").val().trim(),
    wUrl: $("#addWUrl").val().trim(),
    wToken: $("#addWToken").val().trim()
  }
  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + "wati/api/add-number",
    data: JSON.stringify(body),
    contentType: "application/json",
    dataType: "json",
    success: function(response) {
      if (response.status == "success") {
        showMessage(true,"Wati number added successfully!");
        $('#addWatiNumberModal').remove();
        getBodyOfTable();
      } else {
        showMessage(false,"Failed to add Wati number.");
      }
    },
    error: function() {
      showMessage(false,"Error in adding Wati number.");
    }
  });
}

function updateWati(number, watiToken, watiUrl, status) {
  var html = `
    <div id="updateWatiNumberModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 999;">
      <div style="background: white; border-radius: 12px; overflow: hidden; width: 50%;">
        <div class="d-flex justify-content-between align-items-center" style="background: #027FFF; padding: 15px 10px;">
          <h4 style="font-size: 18px; font-weight: bold; color: white;">Update Wati Number</h4>
          <button id="closeUpdateWatiNumberModal" class="d-flex" style="padding: 5px 10px; border: none; background: #ef4444; color: white; border-radius: 5px; cursor: pointer;">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>

        <div class="p-4">
          <form onsubmit="submitUpdateNumberForm(event, '${number}', '${watiToken}', '${watiUrl}', '${status}');" id="updateWatiNumberForm">
            <div class="mb-3">
              <label for="updateNumber">Wati Number</label>
              <input type="text" id="updateNumber" class="rounded border p-3 w-100" value="${number}" required autocomplete="off">
            </div>
            <div class="mb-3">
              <label for="updateWUrl">Wati URL</label>
              <input type="text" id="updateWUrl" class="rounded border p-3 w-100" value="${watiUrl}" required autocomplete="off">
            </div>
            <div class="mb-3">
              <label for="updateWToken">Wati Token</label>
              <input type="text" id="updateWToken" class="rounded border p-3 w-100" value="${watiToken}" required autocomplete="off">
            </div>
            <div class="mb-3">
              <label for="updateStatus">Status</label>
              <select id="updateStatus" class="rounded border p-3 w-100">
                <option value="A" ${status == "A" ? "selected" : ""}>Active</option>
                <option value="I" ${status == "I" ? "selected" : ""}>Inactive</option>
              </select>
            </div>

            <div class="d-flex justify-content-end" style="gap: 10px;">
              <button type="submit" class="border-0 rounded px-5 py-2 text-white" style="background-color:#027FFF;">Update Number</button>
              <button type="button" id="closeUpdateWatiNumberModalBtn" class="border-0 rounded px-5 py-2" style="background-color:#F1EFE7;">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  $("body").append(html);

  $('#closeUpdateWatiNumberModal, #closeUpdateWatiNumberModalBtn').on('click', function() {
    $('#updateWatiNumberModal').remove();
  });
}

function submitUpdateNumberForm(e, number, watiToken, watiUrl, status){
  e.preventDefault();
  var body = {
    number: $("#updateNumber").val().trim(),
    wUrl: $("#updateWUrl").val().trim(),
    wToken: $("#updateWToken").val().trim(),
    status: $("#updateStatus").val()
  };

  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + "wati/api/update-number",
    data: JSON.stringify(body),
    contentType: "application/json",
    dataType: "json",
    success: function(response) {
      if (response.status == "success") {
        showMessage(true, "Wati number updated successfully!");
        $('#updateWatiNumberModal').remove();
        getBodyOfTable();
      } else {
        showMessage(false, "Failed to update Wati number.");
      }
    },
    error: function() {
      showMessage(false, "Error in updating Wati number.");
    }
  });
}

var selectedUserKeys = [];
function addWatiUser(number){
  var customSelectStyle = `
    <style id="customSelectStyle">
      .select2-selection.select2-selection--single {
        border: 1px solid #a1a1a1 !important;
        border-radius: 5px !important;
      }
      .select2-container--default.select2-container--focus .select2-selection--multiple, 
      .select2-container--default .select2-selection--multiple {
        border: 1px solid #a1a1a1 !important;
        border-radius: 5px !important;
      }
      .select2-selection__rendered {
        margin-top: 5px !important;
      }
      .select2-selection__choice {
        border-radius: 5px !important;
      }
      .select2-selection__choice__remove {
        margin-right: 4px !important;
      }
      .select2-search__field {
        margin-top: 3px !important;
      }
    </style>
  `;
  var html = `
    <div id="addWatiUserModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 999;">
      <div style="background: white; border-radius: 12px; overflow: hidden; width: 50%;">
        <div class="d-flex justify-content-between align-items-center" style="background: #027FFF; padding: 15px 10px;">
          <h4 style="font-size: 18px; font-weight: bold; color: white;">Add Wati User</h4>
          <button id="closeAddWatiUserModal" class="d-flex" style="padding: 5px 10px; border: none; background: #ef4444; color: white; border-radius: 5px; cursor: pointer;">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>

        <div class="p-4">
          <form onsubmit="submitAddWatiUserForm(event, '${number}');" id="addWatiUserForm">
            <div class="mb-3">
              <label for="addWatiUserNumber">Wati Number</label>
              <input type="text" id="addWatiUserNumber" class="rounded border p-3 w-100" style="cursor:not-allowed;" value="${number}" required disabled autocomplete="off">
            </div>
            <div class="mb-3">
              <label for="addUsers">Add Users</label>
              <select id="addUsers" class="rounded border p-3 w-100" autocomplete="off"></select>
            </div>

            <div class="d-flex justify-content-end" style="gap: 10px;">
              <button type="submit" class="border-0 rounded px-5 py-2 text-white" style="background-color:#027FFF;">Update Number</button>
              <button type="button" id="closeAddWatiUserBtn" class="border-0 rounded px-5 py-2" style="background-color:#F1EFE7;">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  $("head").append(customSelectStyle);
  $("body").append(html);

  $('#closeAddWatiUserModal, #closeAddWatiUserBtn').on('click', function() {
    $('#addWatiUserModal').remove();
    $('#customSelectStyle').remove();
  });

  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + "wati/api/get-user-list",
    data: JSON.stringify({name:""}),
    contentType: "application/json",
    dataType: "json",
    success: function(response) {
      if (response && response.data.length > 0) {
        response.data.forEach(user => {
          var displayText = `${user.name} (${user.role})`;
          $("#addUsers").append(new Option(displayText, user.id));
        });
      }
      
      $("#addUsers").select2({
        placeholder: "Select Users",
        allowClear: true,
        multiple: true
      });

      $("#addUsers").on("change", function() {
        selectedUserKeys = $(this).val() || [];
      }).val(null).trigger("change");
    },
    error: function() {
      showMessage(false, "Failed to fetch users.");
    }
  });
}

function submitAddWatiUserForm(e, number){
  e.preventDefault();
  if(selectedUserKeys.length == 0){
    showMessage(0, "Select Users")
  }else{
    var body = {
      number: number,
      ids: selectedUserKeys.join(",")
    };

    $.ajax({
      type: "POST",
      url: BASE_URL + CONTEXT_PATH + "wati/api/save-wati-user",
      data: JSON.stringify(body),
      contentType: "application/json",
      dataType: "json",
      success: function(response) {
        if (response.status == "success") {
          showMessage(true, "User added successfully!");
          $('#addWatiUserModal').remove();
          getBodyOfTable();
        } else {
          showMessage(false, "Failed to add user.");
        }
      },
      error: function() {
        showMessage(false, "Error in adding users.");
      }
    });
  }
}