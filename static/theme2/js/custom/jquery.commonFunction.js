var APPLICATION_JSON_VALUE = "application/json";
var BASE_TIMEZONE = "Asia/Singapore";
var API_VERSION = CONTEXT_PATH + SCHOOL_UUID + "/" + "api/v1/";
var API_VERSION_WITHOUT_UNIQUEID = CONTEXT_PATH + "api/v1/";
var GLOBAL_EMAIL = "";
var GRADE_CAL_RULE = {};
// var CDN_VERSION;
var SCRIPTVERSIONCHECKINTERVAL = null;

// ── Version Checker localStorage keys ──────────────────────────────────────
var VC_KEY_NEXT_AT      = 'versionCheck_nextAt';     // epoch ms of next scheduled check
var VC_KEY_POST_RELOAD  = 'versionCheck_postReload'; // set before reload via Refresh button
var VC_KEY_LAST_RAN     = 'versionCheck_lastRanAt';  // multi-tab guard: epoch ms of last run
// ───────────────────────────────────────────────────────────────────────────
var DEFAULT_SEARCH_STATE = true;
var editor1;
var editor2;
var editor3;
var editor4;
var IGNORECOUNTRYARRAY = [
  "AQ",
  "BV",
  "HM",
  "TF",
  "UM",
  "aq",
  "bv",
  "hm",
  "tf",
  "um",
];
var ACTIVITY_CLASS_START_TIME=[];
var globalEntityId = "";
var reviewDone = false;
var submitted = false;
var courseCategoryType = [];
var gradesTaught = [];
var gradesChanged = false;
var elementary_subjects = [];
var middleSchool_subjects = [];
var highSchool_subjects = [];
var uploadDone = false;
var FULL_NAME = "";
var LEAVE_DATES = "";
var TECHNICAL_GLITCH =
  "Sorry for inconvenience, system has encountered technical glitch.";
var SERVICE_UNAVAILABLE = "Temporarily Ticket Service is not available!";
var MAX_SIZE_LIMIT = "Please upload maximum 5MB file in size.";
var MAX_SIZE_LIMIT_FOR_TEACHER = "Please upload maximum 10 MB file in size.";
var pattern = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z]).{8,20}$/;
var sumUnseen;
var AJAXREQUESTCOUNT=0;
var date = new Date();
var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
var end = new Date(date.getFullYear(), date.getMonth(), date.getDate());
var CHAT_BOT_OPEN_FLAG = true;
function copyToClipboardText(originalValue) {
  var $tempInput = $("<input>");
  $("body").append($tempInput);
  $tempInput.val(originalValue).select();
  document.execCommand("copy");
  $tempInput.remove();
}
window.addEventListener("offline", (event) => {
  if (tt == "theme1") {
    showMessageTheme2(
      true,
      "Your device is offline, please check your internet connection."
    );
  } else {
    showMessageTheme2(
      0,
      "Your device is offline, please check your internet connection.",
      "",
      true
    );
  }
});

window.addEventListener("online", (event) => {
  if (tt == "theme1") {
    showMessageTheme2(false, "You are back online");
  } else {
    showMessageTheme2(1, "You are back online", "", true);
  }
});
var serverMessageTimer=100;
var serverMessageInterval = null;
function redirectLoginPage() {
  if (signupPage > 0) {
    window.setTimeout(function () {
      window.location = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/common/login";
    }, 1000);
  } else {
    if ($("#continueSessionForm").length > 0) {
      callLocationAndSelectCountryNew("continueSessionForm");
      $("#password").val("");
      $("#captcha").val("");
      $("#sessionOutPermission").modal({ backdrop: "static", keyboard: false });
      refreshCaptcha("captchaImage");
      $("#continueSession").click(function (event) {
        event.preventDefault();
        callUserLogin("continueSessionForm", "", "CONTINUE");
      });
    } else {
      window.setTimeout(function () {
        window.location =
          BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/common/login";
      }, 1000);
    }
  }
}
function refreshCaptcha(id) {
  var primaryColor = ROOTCSS.split(":#")[1].split(";")[0];
  if (id != undefined && id != "" && $("#" + id).length > 0) {
    document.images[id].src =
      BASE_URL +
      API_VERSION +
      "common/captcha.jpg?payload=" +
      primaryColor +
      "&v=" +
      new Date().getTime();
  }
}
function getURLForHTML(apiType, suffixUrl) {
  if(apiType == "" || apiType == undefined){
    return (
      BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/" + suffixUrl
    );
  }else{
    return (
      BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/" + apiType + "/" + suffixUrl
    );
  }

}
function getURLForHTMLWithPayload(apiType, suffixUrl) {
  let url = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/" + apiType + "/" + suffixUrl;
  const urlParams = new URLSearchParams(window.location.search);
  let payload = urlParams.get("payload");

  if (payload) {
    url += "?payload=" + encodeURIComponent(payload);
  }

  return url;
}
function getURLFor(apiType, suffixUrl) {
	if(suffixUrl!=''){
		suffixUrl= "/" + suffixUrl;
	}
	return BASE_URL + API_VERSION + apiType + suffixUrl;
}
function getURLForCommon(suffixUrl) {
  return BASE_URL + API_VERSION + "common" + "/" + suffixUrl;
}
function getURLForMeeting(suffixUrl) {
  return BASE_URL + API_VERSION + "meetings" + "/" + suffixUrl;
}

function getURLForWithoutUnique(apiType, suffixUrl) {
  return BASE_URL + API_VERSION_WITHOUT_UNIQUEID + apiType + "/" + suffixUrl;
}

function getURLForWithoutApiTypeAndUnique(apiType, suffixUrl) {
  return BASE_URL + CONTEXT_PATH + apiType + "/" + suffixUrl;
}

function getURLForAdmissionCycle(apiType, suffixUrl, session) {
  return (
    BASE_URL +
    CONTEXT_PATH +
    SCHOOL_UUID +
    "/" +
    apiType +
    "/" +
    suffixUrl +
    "/" +
    session
  );
}
function logout(suffix) {
  localStorage.clear();
  sessionStorage.clear();
  var url =
    BASE_URL +
    CONTEXT_PATH +
    SCHOOL_UUID +
    "/" +
    "common/logout/" +
    (UNIQUEUUID || "111");
  if (suffix) {
    url += suffix;
  }
  goAheadGet(url, "");
}

function getURLForSignup(suffixUrl, module) {
  var apiType = "common";
  if (module == undefined || module == null) {
    if (moduleId == "STUDENT") {
      apiType = "student";
    } else if (moduleId == "TEACHER") {
      apiType = "teacher";
    } else if (moduleId == "SCHOOL" || moduleId == "SCHOOL_B2B") {
      apiType = "school";
    } else if (moduleId == "COMMON") {
      apiType = "common";
    }
  } else {
    apiType = module.toLowerCase();
  }
  return API_VERSION + apiType + "/" + suffixUrl;
}
function getCustomFieldCss() {
  var customFieldActiveColor = typeof SCHOOL_ID != "undefined" && Number(SCHOOL_ID) > 0 ? "var(--pc)" : "var(--primary)";
  return `
  :root {
	--custom-field-default: var(--light);
	--custom-field-default-text: var(--gray);
	--custom-field-active: var(--primary);
	--custom-field-value: var(--gray-dark);
	--custom-field-bg: var(--white);
	--custom-field-focus-shadow: color-mix(in srgb, var(--custom-field-active) 15%, transparent);
}
.custom-field-scope .custom-field{
position:relative;
    margin-bottom:30px;
    width:100%;
    --custom-field-default:var(--light);
    --custom-field-default-text:var(--gray);
    --custom-field-active:${customFieldActiveColor};
    --custom-field-value:var(--gray-dark);
    --custom-field-bg:var(--white);
    --custom-field-focus-shadow:color-mix(in srgb, var(--custom-field-active) 15%, transparent);
}

.custom-field-scope .custom-field input,
.custom-field-scope .custom-field select,
.custom-field-scope .custom-field textarea{width:100%;height:44px;padding:5px 16px 5px;
    border:2px solid var(--custom-field-default);
    border-radius:6px !important;
    background-color:var(--custom-field-bg);
    color:var(--custom-field-value);
    font-size:16px;
    outline:none;
    transition:all .3s ease;
    appearance:none;
}

.custom-field-scope .custom-field input::placeholder,
.custom-field-scope .custom-field textarea::placeholder{
    color:transparent !important;
}

.custom-field-scope .custom-field input:-webkit-autofill,
.custom-field-scope .custom-field input:-webkit-autofill:hover,
.custom-field-scope .custom-field input:-webkit-autofill:focus,
.custom-field-scope .custom-field textarea:-webkit-autofill,
.custom-field-scope .custom-field textarea:-webkit-autofill:hover,
.custom-field-scope .custom-field textarea:-webkit-autofill:focus,
.custom-field-scope .custom-field select:-webkit-autofill,
.custom-field-scope .custom-field select:-webkit-autofill:hover,
.custom-field-scope .custom-field select:-webkit-autofill:focus{
    -webkit-box-shadow:0 0 0 1000px var(--custom-field-bg) inset !important;
    box-shadow:0 0 0 1000px var(--custom-field-bg) inset !important;
    -webkit-text-fill-color:var(--custom-field-value) !important;
    caret-color:var(--custom-field-value) !important;
    background-color:var(--custom-field-bg) !important;
    background-clip:padding-box !important;
}

.custom-field-scope .custom-field .iti{
    width:100%;
    height:44px;
}

/* Plain iti variant (no separateDialCode): the flag dropdown is ~52px wide.
   Match iti library's own default so the typed number starts immediately
   after the flag, with no dead gap. The separate-dial-code override below
   widens this for that variant. */
.custom-field-scope .custom-field .iti input{
    height:44px;
    padding-left:52px !important;
    padding-top:6px;
    padding-bottom:0;
    border-radius:6px !important;
}

.custom-field-scope .custom-field .iti .iti__flag-container{
    height:44px;
    top:0;
    bottom:0;
}

.custom-field-scope .custom-field .iti .iti__selected-flag{
    height:44px;
    align-items:center;
    padding:0 8px 0 10px;
}

.custom-field-scope .custom-field:has(.iti) label:not(.error-msg){
    left:55px;
}

.custom-field-scope .custom-field.has-value:has(.iti) label:not(.error-msg),
.custom-field-scope .custom-field.is-filled:has(.iti) label:not(.error-msg),
.custom-field-scope .custom-field.active:has(.iti) label:not(.error-msg),
.custom-field-scope .custom-field:has(.iti input:focus) label:not(.error-msg){
    left:12px;
}

.custom-field-scope .custom-field .select2-container{
    width:100% !important;
    min-height:44px;
    height:auto !important;
    position:relative;
    z-index:1;
}

.custom-field-scope .custom-field .select2-container .select2-selection--single{
    height:44px !important;
    min-height:44px !important;
    border:2px solid var(--custom-field-default);
    border-radius:6px !important;
    background-color:var(--custom-field-bg);
    outline:none;
    transition:all .3s ease;
    display:flex !important;
    align-items:center !important;
    padding:0 !important;
    margin:0 !important;
    box-sizing:border-box !important;
    position:relative;
}

.custom-field-scope .custom-field .select2-container .select2-selection--single .select2-selection__placeholder{
    color:transparent !important;
}

.custom-field-scope .custom-field .select2-container .select2-selection--single .select2-selection__rendered{
    color:var(--custom-field-value);
    font-size:16px;
    line-height:40px !important;
    padding:0 40px 0 16px !important;
    margin:0 !important;
    display:block !important;
    flex:1 1 auto !important;
    min-width:0 !important;
    align-self:center !important;
    height:40px !important;
    width:100% !important;
    white-space:nowrap !important;
    overflow:hidden !important;
    text-overflow:ellipsis !important;
    box-sizing:border-box !important;
    position:static !important;
    top:auto !important;
    transform:none !important;
}

.custom-field-scope .custom-field .select2-container .select2-selection--single .select2-selection__rendered > *{
    line-height:inherit !important;
    vertical-align:middle !important;
}

.custom-field-scope .custom-field .select2-container .select2-selection--single .select2-selection__arrow{
    height:44px !important;
    width:30px !important;
    top:0 !important;
    right:0 !important;
    position:absolute !important;
    pointer-events:none;
    z-index:1;
}

.custom-field-scope .custom-field .select2-container .select2-selection--multiple{
    min-height:44px !important;
    border:2px solid var(--custom-field-default);
    border-radius:6px !important;
    background-color:var(--custom-field-bg);
    padding:3px 8px;
    outline:none;
    transition:all .3s ease;
    cursor:text;
}

.custom-field-scope .custom-field .select2-container .select2-selection--multiple .select2-selection__rendered{
    display:flex;
    flex-wrap:wrap;
    align-items:center;
    gap:4px;
    padding:0 !important;
    margin:0 !important;
    line-height:normal;
    color:var(--custom-field-value);
    width:100%;
    list-style:none;
    min-height:34px;
}

.custom-field-scope .custom-field .select2-container .select2-selection--multiple .select2-selection__choice{
    border:1px solid #bfdbfe;
    border-radius:999px;
    background:#eff6ff;
    color:#1d4ed8;
    padding:1px 10px 1px 24px;
    margin:2px 0 !important;
    font-size:12px;
    line-height:20px;
    display:inline-flex;
    align-items:center;
    position:relative;
    max-width:100%;
}

.custom-field-scope .custom-field .select2-container .select2-selection--multiple .select2-selection__choice__display{
    padding:0;
    line-height:20px;
}
.custom-field-scope .custom-field .select2-container .select2-selection--multiple .select2-selection__choice__remove{
    color:#1d4ed8;
    font-size:14px;
    font-weight:bold;
    position:absolute;
    left:8px;
    top:50%;
    transform:translateY(-50%);
    border:0;
    background:transparent;
    padding:0;
    margin:0;
    line-height:1;
}

.custom-field-scope .custom-field .select2-container .select2-selection--multiple .select2-selection__choice__remove:hover,
.custom-field-scope .custom-field .select2-container .select2-selection--multiple .select2-selection__choice__remove:focus{
    color:#dc2626;
    background:transparent;
}

.custom-field-scope .custom-field .select2-container .select2-selection--multiple .select2-search--inline,
.custom-field-scope .custom-field .select2-container .select2-selection--multiple .select2-search{
    display:inline-flex;
    align-items:center;
    margin:0 !important;
    padding:0 !important;
    flex:1 1 60px;
    min-width:60px;
}

.custom-field-scope .custom-field .select2-container .select2-selection--multiple .select2-search__field{
    width:100% !important;
    min-height:28px;
    height:28px;
    line-height:28px;
    margin:0 !important;
    padding:0 4px !important;
    color:var(--custom-field-value);
    font-size:14px;
    box-shadow:none !important;
    border:0 !important;
    background:transparent !important;
}

.custom-field-scope .custom-field .select2-container .select2-selection--multiple .select2-search__field::placeholder{
    color:transparent !important;
}

.custom-field-scope .custom-field .select2-container--focus .select2-selection--multiple,
.custom-field-scope .custom-field:has(.select2-container--open) .select2-selection--multiple,
.custom-field-scope .custom-field:has(.select2-selection--multiple .select2-selection__choice) .select2-selection--multiple{
    border-color:var(--custom-field-active);
}

.custom-field-scope .custom-field .select2-container--focus .select2-selection--multiple,
.custom-field-scope .custom-field:has(.select2-container--open) .select2-selection--multiple{
    box-shadow:0 0 0 3px rgba(37,99,235,.15);
}

.custom-field-scope .custom-field:not(:has(.select2-container)):not(.has-value):not(.is-filled):not(.active) select,
.custom-field-scope .custom-field:not(:has(.select2-container)):has(select option:checked[value=""]) select{
    color:transparent !important;
}

.custom-field-scope .custom-field select option,
.custom-field-scope .custom-field select optgroup{
    color:var(--custom-field-value) !important;
    background-color:var(--custom-field-bg) !important;
}

.custom-field-scope .custom-field:has(.select2-container):not(.has-value):not(.is-filled):not(.active) .select2-selection__rendered,
.custom-field-scope .custom-field:has(.select2-container):has(select option:checked[value=""]) .select2-selection__rendered{
    color:transparent !important;
}

.custom-field-scope .custom-field textarea{
    min-height:88px;
    resize:vertical;
}

.custom-field-scope .custom-field label:not(.error-msg){
    position:absolute;
    left:12px;
    top:48%;
    transform:translateY(-50%);
    color:var(--custom-field-default-text);
    background:var(--custom-field-bg);
    padding:0 8px;
    font-size:16px;
    pointer-events:none;
    transition:all .25s ease;
    z-index:2;
}

/* FLOAT EFFECT */
.custom-field-scope .custom-field input:focus + label:not(.error-msg),
.custom-field-scope .custom-field input:not(:placeholder-shown) + label:not(.error-msg),
.custom-field-scope .custom-field select:focus + label:not(.error-msg),
.custom-field-scope .custom-field textarea:focus + label:not(.error-msg),
.custom-field-scope .custom-field textarea:not(:placeholder-shown) + label:not(.error-msg),
.custom-field-scope .custom-field:has(.iti input:focus) label:not(.error-msg),
.custom-field-scope .custom-field:has(.iti input:not(:placeholder-shown)) label:not(.error-msg),
.custom-field-scope .custom-field:has(.twitter-typeahead input:focus) label:not(.error-msg),
.custom-field-scope .custom-field:has(.twitter-typeahead input:not(:placeholder-shown)) label:not(.error-msg),
.custom-field-scope .custom-field:has(.twitter-typeahead .tt-input:focus) label:not(.error-msg),
.custom-field-scope .custom-field:has(.twitter-typeahead .tt-input:not(:placeholder-shown)) label:not(.error-msg),
.custom-field-scope .custom-field:has(.select2-container--focus) label:not(.error-msg),
.custom-field-scope .custom-field:has(.select2-container--open) label:not(.error-msg),
.custom-field-scope .custom-field:has(.select2-selection--multiple .select2-selection__choice) label:not(.error-msg),
.custom-field-scope .custom-field.has-value label:not(.error-msg),
.custom-field-scope .custom-field.is-filled label:not(.error-msg),
.custom-field-scope .custom-field.active label:not(.error-msg),
.custom-field-scope .custom-field:has(textarea:not(:placeholder-shown)) label:not(.error-msg) {
    top: 0;
    transform: translateY(-46%);
    font-size: 12px;
    font-weight: 500;
    z-index: 5;
}

/* ACTIVE / FILLED EFFECT */
.custom-field-scope .custom-field input:focus,
.custom-field-scope .custom-field input:not(:placeholder-shown),
.custom-field-scope .custom-field select:focus,
.custom-field-scope .custom-field textarea:focus,
.custom-field-scope .custom-field textarea:not(:placeholder-shown),
.custom-field-scope .custom-field:has(.iti input:focus) input,
.custom-field-scope .custom-field:has(.iti input:not(:placeholder-shown)) input,
.custom-field-scope .custom-field:has(.twitter-typeahead input:focus) input,
.custom-field-scope .custom-field:has(.twitter-typeahead input:not(:placeholder-shown)) input,
.custom-field-scope .custom-field:has(.twitter-typeahead .tt-input:focus) input,
.custom-field-scope .custom-field:has(.twitter-typeahead .tt-input:not(:placeholder-shown)) input,
.custom-field-scope .custom-field:has(.select2-container--focus) .select2-selection--single,
.custom-field-scope .custom-field:has(.select2-container--open) .select2-selection--single,
.custom-field-scope .custom-field.has-value input,
.custom-field-scope .custom-field.has-value select,
.custom-field-scope .custom-field.has-value textarea,
.custom-field-scope .custom-field.has-value .select2-selection--single,
.custom-field-scope .custom-field.has-value .select2-selection--multiple,
.custom-field-scope .custom-field.is-filled input,
.custom-field-scope .custom-field.is-filled select,
.custom-field-scope .custom-field.is-filled textarea,
.custom-field-scope .custom-field.is-filled .select2-selection--single,
.custom-field-scope .custom-field.is-filled .select2-selection--multiple,
.custom-field-scope .custom-field.active input,
.custom-field-scope .custom-field.active select,
.custom-field-scope .custom-field.active textarea,
.custom-field-scope .custom-field.active .select2-selection--single,
.custom-field-scope .custom-field.active .select2-selection--multiple,
.custom-field-scope .custom-field:has(textarea:not(:placeholder-shown)) textarea {
    border-color: var(--custom-field-active);
}

.custom-field-scope .custom-field input:focus + label:not(.error-msg),
.custom-field-scope .custom-field input:not(:placeholder-shown) + label:not(.error-msg),
.custom-field-scope .custom-field select:focus + label:not(.error-msg),
.custom-field-scope .custom-field textarea:focus + label:not(.error-msg),
.custom-field-scope .custom-field textarea:not(:placeholder-shown) + label:not(.error-msg),
.custom-field-scope .custom-field:has(.iti input:focus) label:not(.error-msg),
.custom-field-scope .custom-field:has(.iti input:not(:placeholder-shown)) label:not(.error-msg),
.custom-field-scope .custom-field:has(.twitter-typeahead input:focus) label:not(.error-msg),
.custom-field-scope .custom-field:has(.twitter-typeahead input:not(:placeholder-shown)) label:not(.error-msg),
.custom-field-scope .custom-field:has(.twitter-typeahead .tt-input:focus) label:not(.error-msg),
.custom-field-scope .custom-field:has(.twitter-typeahead .tt-input:not(:placeholder-shown)) label:not(.error-msg),
.custom-field-scope .custom-field:has(.select2-container--focus) label:not(.error-msg),
.custom-field-scope .custom-field:has(.select2-container--open) label:not(.error-msg),
.custom-field-scope .custom-field:has(.select2-selection--multiple .select2-selection__choice) label:not(.error-msg),
.custom-field-scope .custom-field.has-value label:not(.error-msg),
.custom-field-scope .custom-field.is-filled label:not(.error-msg),
.custom-field-scope .custom-field.active label:not(.error-msg),
.custom-field-scope .custom-field:has(input:not(:placeholder-shown)) label:not(.error-msg),
.custom-field-scope .custom-field:has(textarea:not(:placeholder-shown)) label:not(.error-msg) {
    color: var(--custom-field-active);
}

/* FOCUS EFFECT */
.custom-field-scope .custom-field input:focus,
.custom-field-scope .custom-field select:focus,
.custom-field-scope .custom-field textarea:focus{
    box-shadow:0 0 0 3px rgba(37,99,235,.15);
}

/* CUSTOM SELECT ARROW */
.custom-field-scope .custom-field select{
    padding-right:40px;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 16 16'%3E%3Cpath d='M3 6l5 5 5-5' stroke='%239ca3af' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat:no-repeat;
    background-position:right 14px center;
}

.custom-field-scope .custom-field select:focus,
.custom-field-scope .custom-field.has-value select,
.custom-field-scope .custom-field.is-filled select,
.custom-field-scope .custom-field.active select,
.custom-field-scope .custom-field.has-value select{
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 16 16'%3E%3Cpath d='M3 6l5 5 5-5' stroke='%23007bff' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* REMOVE DEFAULT ARROW */
.custom-field-scope .custom-field select::-ms-expand{
    display:none;
}
.custom-field-scope .custom-field:not(.has-value):not(.is-filled):not(.active):not(:focus-within):not(:has(.select2-container--open)):not(:has(.select2-selection--multiple .select2-selection__choice)):not(:has(input[value]:not([value=""]))):not(:has(input:not(:placeholder-shown))):not(:has(textarea:not(:placeholder-shown))) label:not(.error-msg){
    top:48% !important;
    transform:translateY(-50%) !important;
    font-size:16px !important;
    font-weight:normal !important;
    color:var(--custom-field-default-text) !important;
    z-index:2 !important;
}

/* DEFENSIVE: matching un-active border for the empty inactive case */
.custom-field-scope .custom-field:not(.has-value):not(.is-filled):not(.active):not(:focus-within):not(:has(.select2-container--open)):not(:has(.select2-selection--multiple .select2-selection__choice)):not(:has(input[value]:not([value=""]))):not(:has(input:not(:placeholder-shown))):not(:has(textarea:not(:placeholder-shown))) input,
.custom-field-scope .custom-field:not(.has-value):not(.is-filled):not(.active):not(:focus-within):not(:has(.select2-container--open)):not(:has(.select2-selection--multiple .select2-selection__choice)):not(:has(input[value]:not([value=""]))):not(:has(input:not(:placeholder-shown))):not(:has(textarea:not(:placeholder-shown))) select,
.custom-field-scope .custom-field:not(.has-value):not(.is-filled):not(.active):not(:focus-within):not(:has(.select2-container--open)):not(:has(.select2-selection--multiple .select2-selection__choice)):not(:has(input[value]:not([value=""]))):not(:has(input:not(:placeholder-shown))):not(:has(textarea:not(:placeholder-shown))) textarea,
.custom-field-scope .custom-field:not(.has-value):not(.is-filled):not(.active):not(:focus-within):not(:has(.select2-container--open)):not(:has(.select2-selection--multiple .select2-selection__choice)):not(:has(input[value]:not([value=""]))):not(:has(input:not(:placeholder-shown))):not(:has(textarea:not(:placeholder-shown))) .select2-selection--single,
.custom-field-scope .custom-field:not(.has-value):not(.is-filled):not(.active):not(:focus-within):not(:has(.select2-container--open)):not(:has(.select2-selection--multiple .select2-selection__choice)):not(:has(input[value]:not([value=""]))):not(:has(input:not(:placeholder-shown))):not(:has(textarea:not(:placeholder-shown))) .select2-selection--multiple{
    border-color:var(--custom-field-default) !important;
}

.custom-field-scope .custom-field:has(.select2-container--open) label:not(.error-msg){
    z-index:1000000 !important;
}
.select2-dropdown,
.select2-container .select2-dropdown,
body > .select2-container--open .select2-dropdown,
.select2-container--bootstrap4 .select2-dropdown{
    z-index:1000001 !important;
}

.custom-field-scope .custom-field .iti--separate-dial-code .iti__selected-flag{
    background-color:transparent !important;
    border-right:1px solid var(--custom-field-default);
    border-radius:6px 0 0 6px !important;
    padding:0 8px 0 14px;
}
.custom-field-scope .custom-field .iti--separate-dial-code > input{
    padding-left:105px !important;
}
.custom-field-scope .custom-field:has(.iti--separate-dial-code input:focus) .iti__selected-flag,
.custom-field-scope .custom-field.has-value:has(.iti--separate-dial-code) .iti__selected-flag,
.custom-field-scope .custom-field.is-filled:has(.iti--separate-dial-code) .iti__selected-flag,
.custom-field-scope .custom-field.active:has(.iti--separate-dial-code) .iti__selected-flag{
    border-right-color:var(--custom-field-active);
}
.custom-field-scope .custom-field:has(.iti--separate-dial-code) label:not(.error-msg){
    left:105px;
}
.custom-field-scope .custom-field.has-value:has(.iti--separate-dial-code) label:not(.error-msg),
.custom-field-scope .custom-field.is-filled:has(.iti--separate-dial-code) label:not(.error-msg),
.custom-field-scope .custom-field.active:has(.iti--separate-dial-code) label:not(.error-msg),
.custom-field-scope .custom-field:has(.iti--separate-dial-code input:focus) label:not(.error-msg){
    left:12px;
}

/* Tight cluster of related custom-fields rendered inside flex-grow-1 wrappers
   in a nested .row (e.g., Date+HH+MM+AM/PM in the follow-up popup). Two
   issues to fix:
     1. Each custom-field <select> gets padding-right:40px to clear the
        custom dropdown arrow, so 4 small selects + a date input overflow a
        col-lg-4 container and AM/PM wraps to a new line.
     2. The flex children's intrinsic min-content (input size=20 default,
        select option padding) blocks shrinking — they wrap before they
        compress.
   Opt-in via .cf-row-tight on the inner .row: disable wrap, let children
   shrink past min-content, and tighten the arrow padding. */
.custom-field-scope .row.cf-row-tight{
    flex-wrap:nowrap;
}
.custom-field-scope .row.cf-row-tight > *{
    min-width:0;
}
.custom-field-scope .row.cf-row-tight .custom-field select{
    padding-right:24px;
    background-position:right 6px center;
}

/* COUNTER (e.g., "0 / 20") rendered as a <small> inside .custom-field must not
   contribute to the field's intrinsic height — otherwise the centered placeholder
   label (top:48%) drifts below the input's vertical midpoint and visually
   misaligns with sibling fields (e.g., Update vs Remarks in lead/demo modals). */
.custom-field-scope .custom-field > small{
    position:absolute;
    top:calc(100% + 2px);
    left:0;
    font-size:11px;
    line-height:1;
    z-index:2;
    pointer-events:none;
}
`;
}
function isPlaceholderOptionText(text) {
  if (!text) return false;
  var t = text.toString().trim();
  if (t === "") return true;
  return /^(?:select|choose|please|pick)\b/i.test(t) || /^(?:--|—|–)/.test(t);
}
function refreshCustomFieldState(context) {
  var parent = context == undefined || context == null ? $(document) : $(context);
  var fields = parent.filter(".custom-field").add(parent.find(".custom-field"));
  fields.filter(function () {
    return $(this).closest(".custom-field-scope").length > 0;
  }).each(function () {
    var customField = $(this);
    customField.find("input, textarea").each(function () {
      var $el = $(this);
      var tag = ($el.prop("tagName") || "").toLowerCase();
      var type = ($el.attr("type") || "").toLowerCase();
      if (tag === "textarea" || (tag === "input" && type !== "hidden" && type !== "checkbox" && type !== "radio" && type !== "submit" && type !== "button" && type !== "reset" && type !== "file" && type !== "image")) {
        if (typeof $el.attr("placeholder") === "undefined") {
          $el.attr("placeholder", " ");
        }
      }
    });
    var field = customField.find("input, select, textarea").first();
    var value = field.length > 0 ? field.val() : "";
    if ($.isArray(value)) {
      value = value.filter(function (v) { return v !== null && v !== undefined && v.toString().trim() !== ""; }).join("");
    }
    value = value == undefined || value == null ? "" : value.toString().trim();
    var hasValue = value !== "";
    if (hasValue && field.is("select") && !field.prop("multiple")) {
      var $selected = field.find("option:selected").first();
      if ($selected.length && $selected.prop("disabled")) {
        hasValue = false;
      } else if ($selected.length && isPlaceholderOptionText($selected.text())) {
        hasValue = false;
      }
    }
    customField.toggleClass("has-value", hasValue);
  });
}
$(document).ready(function () {
  var stickyHeaderHeight = $('.sticky-header').height();
  $('.app-container').css({ "margin-top": stickyHeaderHeight - 59 });
  $('.close-message').click(function () {
    $(this).parent().hide().promise().done(function () {
      var stickyHeaderHeight = $('.sticky-header').height();
      $('.app-container').css({ "margin-top": stickyHeaderHeight - 59 });
    });
  });
  $("head").append(`<style id="customFieldCss">${getCustomFieldCss()}</style>`);
  refreshCustomFieldState();
  setTimeout(function () {
    refreshCustomFieldState();
  }, 300);
  $(document).on("input change blur changeDate countrychange", ".custom-field-scope .custom-field input, .custom-field-scope .custom-field select, .custom-field-scope .custom-field textarea", function () {
    refreshCustomFieldState($(this).closest(".custom-field"));
  });
  $(document).on("select2:select select2:clear change", ".custom-field-scope .custom-field select", function () {
    refreshCustomFieldState($(this).closest(".custom-field"));
  });
  if (window.MutationObserver) {
    var customFieldRefreshTimer = null;
    var scheduleCustomFieldRefresh = function (root) {
      if (customFieldRefreshTimer) {
        clearTimeout(customFieldRefreshTimer);
      }
      customFieldRefreshTimer = setTimeout(function () {
        refreshCustomFieldState(root || null);
        customFieldRefreshTimer = null;
      }, 50);
    };
    var customFieldObserver = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (!node || node.nodeType !== 1) continue;
          if ((node.classList && node.classList.contains("custom-field")) ||
              (node.querySelector && node.querySelector(".custom-field"))) {
            scheduleCustomFieldRefresh();
            return;
          }
        }
      }
    });
    customFieldObserver.observe(document.body, { childList: true, subtree: true });
  }
  if($("#themeColor").length<1){
    $("head").append(`<style id="themeColor">${ROOTCSS}</style>`);
  }
  if($("#commonloaderId").length<1 && $("#commonloaderIdNewLoader").length<1){
    $("body").append(getLoaderContent());
    $("head").append(`<style>.loader-style.hide-loader{display: none !important;}</style>`)
  }
  //$('[data-toggle="tooltip"]').tooltip();
  $('.daterange').on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    });

    $('.daterange').on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
    });

    // Block all manual input methods
    $('.daterange').on('keydown paste drop cut', function(e) {
      e.preventDefault();
    });
    // var getCDN_version = getSettingsByTypeAndKey("CONFIGURATION", "RESOURCES_CDN_URL");
    // getCDN_version = JSON.parse(getCDN_version);
    // if(getCDN_version != ""){
    //   var CDN_V = getCDN_version.data.metaValue; 
    //   CDN_VERSION= CDN_V.split("@")[1];
    //   localStorage.setItem("CDN_VERSION", CDN_VERSION); 
    // }
    // FOR SMS ERROR LOG AJAX BELOW LINE
    if (typeof SMSErrorLogger !== 'undefined') {
        $.ajaxSetup({ error: SMSErrorLogger.ajaxErrorHandler });
    }
});
function setPagePosition(position) {
  signupPage = position;
}
function increasePosition() {
  signupPage = signupPage + 1;
}
function tabActiveStatus(tabPosition) {
  signupPage = tabPosition;
  if (tabPosition == 2) {
    tabPosition = 0;
  } else if (tabPosition == 3 || tabPosition == 4) {
    tabPosition = 1;
  } else if (tabPosition == 5) {
    tabPosition = 2;
  } else if (tabPosition == 6) {
    tabPosition = 3;
  }
  $("#formSteps div").steps("setStep", tabPosition);
}

function setActiveTab(signupPage) {
  var activetab = 0;
  if (signupPage == 2) {
    activetab = 0;
  } else if (signupPage == 3) {
    activetab = 1;
  } else if (signupPage == 4) {
    activetab = 2;
    submitted = true;
  } else if (signupPage == 5) {
    activetab = 3;
    reviewDone = true;
  } else if (signupPage == 6) {
    activetab = 4;
    reviewDone = true;
  }
  if (USER_ROLE == "TEACHER") {
    if (activetab == 2) {
      $("#formSteps div").steps("setStep", 2);
    } else {
      $("#formSteps div").steps("setStep", activetab);
    }
  }
  if (activetab == 2) {
    showPendingApprovalPopup(4);
  }
}

function showPendingApprovalPopup() {
  $("#submitInterviewSlotModal").modal("hide");
  $("#inReviewForTeacherDetailsModal").modal({
    backdrop: "static",
    keyboard: false,
  });
  $("#inReviewForTeacherDetailsModal").modal("show");
}
//messageType=0 ERROR
//messageType=1 SUCCESS
//messageType=2 INFORMATION
function showModalMessage(messageType, message, id) {
  // hideModalMessage(id);
  // $('.messageModalDiv1').removeClass('error');
  // $('.messageModalDiv1').removeClass('success');
  // $('.messageModalDiv1').removeClass('notification');
  // if (messageType==0) {
  // 	$('.messageModalDiv1').addClass('error')
  // 	$('.messageModalDiv1').html('<i class="fa fa-times"></i>'+message);
  // 	$('.messageModalDiv').removeClass('hide');
  // }else if (messageType==1) {
  // 	$('.messageModalDiv1').addClass('success')
  // 	$('.messageModalDiv1').html('<i class="fa fa-check"></i>'+message);
  // 	$('.messageModalDiv').removeClass('hide');
  // }else if (messageType==2) {
  // 	$('.messageModalDiv1').addClass('notification')
  // 	$('.messageModalDiv1').html('<i class="fa fa-info"></i>'+message);
  // 	$('.messageModalDiv').removeClass('hide');
  // }
  // $('.messageModalDiv').show();

  // $('#studentPaymentModal .modal-body').animate({scrollTop: "0px"
  // }, 'slow');

  // $('#callPaymentStudentModal .modal-body').animate({scrollTop: "0px"
  // }, 'slow');
  showMessageTheme2(messageType, message, id, false);
}
function hideModalMessage(signupError, id) {
  if (!signupError) {
    $(".messageModalDiv").addClass("hide");
    $(".messageModalDiv1").html("");
    $(".messageModalDiv").hide();
  }
}
function showMessageTheme2BankDetails(isWarnig, message, id) {
  if (isWarnig) {
    $("#errorHeading").html("Error! Be focus on work");
    $("#statusMessageBD").addClass("danger-color");
    $("#statusMessageBD").removeClass("success-color");
  } else {
    $("#errorHeading").html("Information!");
    $("#statusMessageBD").removeClass("danger-color");
    $("#statusMessageBD").addClass("success-color");
  }
  $("#statusMessageBD").html(message);
  $("#modalMessageBD").show();
  $("#withdrawnRequestBankForm .modal-body").animate({ scrollTop: 0 }, "slow");
  setTimeout(function () {
    $("#modalMessageBD").hide();
  }, 5000);
}
// function showMessageTheme2(messageType, message, id, msgHide) {
//   if (message == "") {
//     return false;
//   } else {
//     $("#messageDiv1").removeClass("error");
//     $("#messageDiv1").removeClass("success");
//     $("#messageDiv1").removeClass("notification");
//     $("#messageDiv").show();
//     if (messageType == 0 || messageType == false) {
//       $("#messageDiv1").addClass("error");
//       $("#messageDiv1").html(
//         '<i class="fa fa-times-circle"></i>&nbsp;' + message
//       );
//     } else if (messageType == 1 || messageType == true) {
//       $("#messageDiv1").addClass("success");
//       $("#messageDiv1").html(
//         // '<i class="fa fa-check-circle"></i>&nbsp;' +
//         message
//       );
//     } else if (messageType == 2) {
//       $("#messageDiv1").addClass("notification");
//       $("#messageDiv1").html(
//         '<i class="fa fa-info-circle"></i>&nbsp;' + message
//       );
//     }
//     $(".server-error-message").addClass("show");
//     setTimeout(function () {
//       if ($(".server-error-message").hasClass("show")) {
//         $(".server-error-message").removeClass("show");
//       }
//     }, 5000);

//     if (msgHide) {
//       setTimeout(function () {
//         $(".server-error-message").removeClass("show");
//       }, 3000);
//     }
//   }
// }

function showMessage(messageType, message, id, msgHide) {
  if (message == "") {
    return false;
  } else {
    $("#messageDiv1").removeClass("error");
    $("#messageDiv1").removeClass("success");
    $("#messageDiv1").removeClass("notification");
    $("#messageDiv").show();
    if (messageType == 0 || messageType == false) {
      $("#messageDiv1").addClass("error");
      $("#messageDiv1").html(
        '<i class="fa fa-times-circle"></i> ' + message
      );
    } else if (messageType == 1 || messageType == true) {
      $("#messageDiv1").addClass("success");
      $("#messageDiv1").html(
        // '<i class="fa fa-check-circle"></i> ' +
        message
      );
    } else if (messageType == 2) {
      $("#messageDiv1").addClass("notification");
      $("#messageDiv1").html(
        '<i class="fa fa-info-circle"></i> ' + message
      );
    }
    $(".server-error-message").addClass("show");
    setTimeout(function () {
      if ($(".server-error-message").hasClass("show")) {
        $(".server-error-message").removeClass("show");
      }
    }, 5000);

    if (msgHide) {
      setTimeout(function () {
        $(".server-error-message").removeClass("show");
      }, 3000);
    }
  }
}

function hideMessage(signupError, id) {
  if (!signupError) {
    $("#messageDiv1").html("");
    $("#messageDiv").hide();
  }
}

function hideMessageTheme2(){
	clearInterval(serverMessageInterval);
	$('.server-message').removeClass('show');
	$('.message-hide-bar').css({'width':'100%',});
}

function showMessageTheme2(messageType, message, id, msgHide, timer) {
  $(document).on("click", ".server-message", function () {
      $(this).removeClass("show");
  });

  // .msg pe click - event bubble stop
  $(document).on("click", ".server-message .msg", function (e) {
      e.stopPropagation();
  });
  if (timer == undefined || timer == null || timer == "") {
    timer = 6000;
  }
  if (message == "") {
    return false;
  } else {
    hideMessageTheme2(id);
    $("#msgTheme2").removeClass("error");
    $("#msgTheme2").removeClass("success");
    $("#msgTheme2").removeClass("notification");
    if (messageType == 0) {
      $("#msgTheme2").addClass("error");
      $("#msgTheme2").html(
        '&nbsp;' + message
      );
    } else if (messageType == 1) {
      $("#msgTheme2").addClass("success");
      $("#msgTheme2").html('<i class="fa fa-check"></i>&nbsp;' + message);
    } else if (messageType == 2) {
      $("#msgTheme2").addClass("notification");
      $("#msgTheme2").html('<i class="fa fa-info"></i>&nbsp;' + message);
    }
    $(".server-message").addClass("show");
    setTimeout(function () {
      $(".server-message").removeClass("show");
    }, timer);
    if (msgHide) {
      setTimeout(function () {
        $("#msgTheme2").html("");
        $(".server-message").removeClass("show");
      }, timer);
    }
  }
}
$("#msgTheme2").click(function () { $('.server-message').removeClass('show'); })
function hideMessageTheme2(id) {
  $("#msgTheme2").html("");
  $(".server-message").removeClass("show");
  //$('.server-message').hide();
}
function showHideDiv(isHide, divId) {
  if (isHide) {
    $("#" + divId).removeClass("show");
    $("#" + divId).addClass("hide");
  } else {
    $("#" + divId).removeClass("hide");
    $("#" + divId).addClass("show");
  }
}
function getHash() {
  return Math.random().toString(36).substring(2);
}
function showMessageTheme2RequestDemoPage(isWarnig, message, id, fid) {
  //	$('#'+id).parent().removeClass('error-message-hide');
  $("#" + id)
    .parent()
    .addClass("show-message");
  if (fid.length > 0) {
    $("#" + fid).addClass("highlight-field");
    $("#" + fid)
      .next()
      .find(".select2-selection__rendered")
      .addClass("highlight-field");
  }
  $("#" + id).html(message);
}
function hideMessageRequestDemoPage(id, fid) {
  $("#" + id)
    .parent()
    .removeClass("show-message");
  if (fid.length > 0) {
    $("#" + fid).removeClass("highlight-field");
    $("#" + fid)
      .next()
      .find(".select2-selection__rendered")
      .removeClass("highlight-field");
  }
  //	$('#'+id).parent().addClass('error-message-hide');
  $("#" + id).html("");
}
function showMessageTheme2ErrorNew(isWarnig, message, id) {
  if (!isWarnig) {
    $("#" + id).addClass("success-msg");
  }
  $("#" + id).addClass("show-errow-msg");
  $("#" + id).html(message);
}
function hideMessageErrorNew(id) {
  $("#" + id).removeClass("success-msg");
  $("#" + id).removeClass("show-errow-msg");
  $("#" + id).html("");
}
function buildDropdown(result, dropdown, emptyMessage) {
  dropdown.html("");
  if (result != "") {
    dropdown.append('<option value="">' + emptyMessage + "</option>");
    //	dropdown.append('<option disabled selected> </option>');
    $.each(result, function (k, v) {
      if (v.extra != null && v.extra1 != null) {
        dropdown.append(
          '<option value="' +
            v.key +
            '">' +
            v.extra +
            " - " +
            v.extra1 +
            "</option>"
        );
      } else if (v.extra != null) {
        if (v.extra == "selected") {
          dropdown.append(
            '<option disabled selected value="' +
              v.key +
              '">' +
              v.value +
              "</option>"
          );
        } else if (v.extra == "non-selected") {
          dropdown.append(
            '<option value="' + v.key + '"> ' + v.value + "</option>"
          );
        } else {
          dropdown.append(
            '<option value="' + v.key + '"> ' + v.value + "</option>"
          );
        }
      } else {
        dropdown.append(
          '<option value="' + v.key + '">' + v.value + "</option>"
        );
      }
    });
  } else {
    dropdown.append('<option value="0">' + emptyMessage + "</option>");
  }
}

function resetDropdown(dropdown, emptyMessage) {
  dropdown.html("");
  //	dropdown.append('<option disabled selected> </option>');
}
$(document).ajaxStart(function (e) {
  
  AJAXREQUESTCOUNT++;
  // console.log("AJAX call started:");
  customLoader(true);
});
$(document).ajaxStop(function () {
  AJAXREQUESTCOUNT--;
   if (AJAXREQUESTCOUNT <= 0) {
     AJAXREQUESTCOUNT = 0; // just to be safe, avoid negative counts
     // console.log("All AJAX calls completed");

    customLoader(false);

   }
});

$(document).ajaxSend(function () {
  ++AJAXREQUESTCOUNT;
  //console.log("AJAX call started, active count:", AJAXREQUESTCOUNT);
  customLoader(true);
});

$(document).ajaxComplete(function () {
  --AJAXREQUESTCOUNT;
  if(AJAXREQUESTCOUNT <= 1) {
    AJAXREQUESTCOUNT = 0; // prevent negative values
    customLoader(false);
  }
});
function customLoader(needToShow) {
  if(needToShow){
    $("#commonloaderIdNewLoader").removeClass("hide-loader");
  }else{
    setTimeout(function () {
        if(AJAXREQUESTCOUNT <= 0){
        $("#commonloaderIdNewLoader").addClass("hide-loader");
        $("#commonloaderId").hide();
        $("#commonloaderBody").hide();
        }
      }, 200);
      $(".dt-responsive tbody tr td:first-child").addClass("dtr-control");
  }
}
function customLoaderExternalPage(needToShow) {
  if (needToShow) {
    $("#newThemeloader").modal({ backdrop: "static", keyboard: false });
  } else {
    setTimeout(function () {
      $("#newThemeloader").modal("hide");
    }, 800);
  }
}
$.ajaxSetup({
  beforeSend: function (xhr, settings) {
    if (settings.data != undefined) {
      if (settings.contentType == APPLICATION_JSON_VALUE) {
        // var KEUS = getSecreteKey();
        // AesUtil(KEUS.KEYSIZE, KEUS.ITERATIONS);
        var payload = {};
        // payload['payload']=AesUtil.prototype.encrypt(KEUS.SALT, KEUS.IV, KEUS.PASSPHRASE, settings.data);
        // console.log('settings.data '+settings.data)
        payload["payload"] = encode(settings.data);
        settings.data = JSON.stringify(payload);
      }
    }
    xhr.setRequestHeader("UNIQUEUUID", UNIQUEUUID);
    // Store settings on XHR so ajaxErrorHandler can log the failed URL and method
    xhr._smsSettings = { url: settings.url, type: settings.type, method: settings.method, data: settings.data };
  },
});

//$( document ).ajaxSend(function() {
//	customLoader(true);
//});
//$( document ).ajaxSuccess(function() {
//	customLoader(false);
//});
$(document).ajaxError(function (event, jqxhr, settings, exception) {
  console.log(
    "event is" +
      event +
      "jqxhr is" +
      jqxhr +
      "settings" +
      settings +
      "exception is" +
      exception
  );
  console.log("exception ajax request URL:", settings.url);
  customLoader(false);
  if (checkonlineOfflineStatus()) {
    return;
  }
  if (!navigator.onLine) {
    if (tt == "theme1") {
      showMessageTheme2(
        0,
        "Your device is offline, please check your internet connection."
      );
    } else {
      showMessageTheme2(
        0,
        "Your device is offline, please check your internet connection.",
        "",
        true
      );
    }
    return;
  }

  if (isJson(jqxhr.responseText)) {
    var parseResponse = JSON.parse(jqxhr.responseText);
    console.log("parse Response is:" + jqxhr.status);
    var hasProperty = parseResponse.hasOwnProperty("message");
    if (hasProperty) {
      showMessageTheme2(0, parseResponse.message);
      showModalMessage(0, TECHNICAL_GLITCH);
    } else {
      showMessageTheme2(0, TECHNICAL_GLITCH);
      showModalMessage(0, TECHNICAL_GLITCH);
    }
  } else {
    showMessageTheme2(0, TECHNICAL_GLITCH);
    showModalMessage(0, TECHNICAL_GLITCH);
  }
});

function checkonlineOfflineStatus() {
  if (!navigator.onLine) {
    if (tt == "theme1") {
      showMessageTheme2(
        true,
        "Your device is offline, please check your internet connection."
      );
    } else {
      showMessageTheme2(
        0,
        "Your device is offline, please check your internet connection.",
        "",
        true
      );
    }
    return true;
  }
  return false;
}


function goAheadGet(url, hash) {
  // A GET form submission discards the query string in the action URL and
  // rebuilds it from the form fields. Split off any query params from the URL
  // and carry them as hidden inputs so they are preserved.
  var actionUrl = url;
  var queryInputs = "";
  var queryIndex = url.indexOf("?");
  if (queryIndex !== -1) {
    actionUrl = url.substring(0, queryIndex);
    var queryString = url.substring(queryIndex + 1);
    if (queryString !== "") {
      var pairs = queryString.split("&");
      for (var i = 0; i < pairs.length; i++) {
        if (pairs[i] === "") {
          continue;
        }
        var eqIndex = pairs[i].indexOf("=");
        var name =
          eqIndex === -1 ? pairs[i] : pairs[i].substring(0, eqIndex);
        var value = eqIndex === -1 ? "" : pairs[i].substring(eqIndex + 1);
        queryInputs +=
          '<input type="hidden" name="' +
          decodeURIComponent(name) +
          '" value="' +
          decodeURIComponent(value) +
          '" />';
      }
    }
  }
  var hashInput =
    hash !== undefined && hash !== null && hash !== ""
      ? '<input type="hidden" name="hash" id="hash" value="' + hash + '" />'
      : "";
  var form = $(
    '<form action="' +
      actionUrl +
      '" method="GET">' +
      queryInputs +
      hashInput +
      "</form>"
  );
  $("body").append(form);
  $(form).submit();
}
function goAhead(url, hash) {
  var hashInput =
    hash !== undefined && hash !== null && hash !== ""
      ? '<input type="hidden" name="hash" id="hash" value="' + hash + '" />'
      : "";
  var form = $(
    '<form action="' + url + '" method="POST">' + hashInput + "</form>"
  );
  $("body").append(form);
  $(form).target = "_blank";
  $(form).submit();
}

function callEmailCheck(formId, moduleId) {
  hideMessage("");
  $(".error-msg").html("");
  if (
    !$("#" + formId + " #email")
      .val()
      .trim()
  ) {
    return true;
  }
  // if (!validateRequestForEmailCheck(formId)) {
  // 	return false;
  // }
  $("#email").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("is-user-available"),
    data: JSON.stringify(getRequestForEmailCheck(formId, moduleId)),
    dataType: "json",
    success: function (data) {
      if (!data.emailVerified && data.status == "1") {
        $("#emailValidatorEle").text($("#email").val());
        $(".emailValidatorModal").addClass("show");
        $(".emailValidatorModal").addClass("animate__fadeInUpBig");
        $(".emailValidatorModal").removeClass("animate__fadeOutUpBig");
        $(".blur-overlary").show();
      } else {
        validEndInvalidField(true, "email");
      }
      $("#allReadyEmailFooter").hide();
      if (data["status"] == "0" || data["status"] == "2") {
        // if (data['statusCode'] == '0043') {
        // 	showWrapper(true);
        // 	hideStep1Div()
        // 	$('#emailNotVerify').show();
        // 	$('#allReadyEmailFooter').show();
        // } else
        if (data["statusCode"] == "0044" || data["statusCode"] == "0043") {
          showWrapper(true, data["fr"], data["extra1"]);
          hideStep1Div();
          $("#emailVerify").show();
        } else if (data["statusCode"] == "02") {
          showWrapper(true, data["fr"], data["extra1"]);
          hideStep1Div();
          $("#userDeclined").show();
        } else {
          showMessageTheme2(1, data["message"]);
        }
      }
      $("#" + formId + " #email").prop("disabled", false);
      return false;
    }
  });
}

function validateRequestForEmailCheck(formId) {
  if (
    !validateEmail(
      $("#" + formId + " #email")
        .val()
        .trim()
    )
  ) {
    $("#" + formId + " #email").css("color", "#a9a9a9");
    validEndInvalidField(false, "email");
    showMessageTheme2(false, "email", "Student email is either empty or invalid.");
    return false;
  }
  validEndInvalidField(true, "email");
  return true;
}

function getRequestForEmailCheck(formId, moduleId) {
  var request = {};
  var authentication = {};
  var data = {};
  data["requestKey"] = "EMAIL-AVAILABLE";
  data["email"] = $("#" + formId + " #email")
    .val()
    .trim();
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  request["authentication"] = authentication;
  request["data"] = data;
  return request;
}

function emailCheck(emailId, moduleId) {
  var result = "";
  hideMessage("");
  if (!validateEmail(emailId)) {
    showMessageTheme2(0, "Email is either empty or invalid");
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("is-user-available"),
    data: JSON.stringify(getCallRequestForEmailCheck(emailId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      //console.log('data=> '+JSON.stringify(data));
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(0, "Email already exist");
        result = false;
      } else {
        result = true;
      }
    }
  });
  return result;
}

function getCallRequestForEmailCheck(emailId, module, userRole) {
  var request = {};
  var authentication = {};
  var data = {};
  data["requestKey"] = "EMAIL-AVAILABLE";
  data["email"] = emailId;
  data["requestExtra1"] = userRole;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = module;
  request["authentication"] = authentication;
  request["data"] = data;
  return request;
}

function callCities(formId, value, stateId, cityId) {
  var flag = false;
  hideMessage("");
  if (cityId == undefined) {
    cityId = "cityId";
  }
  if (!validateRequestForMaster(formId, stateId)) {
    resetDropdown($("#" + formId + " #" + cityId), "Select City*");
    if ($("#" + formId + " #" + cityId).val()) {
      $("#" + formId + " #" + cityId)
        .val(0)
        .trigger("change");
    }
    return false;
  }
  $("#" + formId + " #" + cityId).prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("formId", "CITIES-LIST", value)),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["cities"],
          $("#" + formId + " #" + cityId),
          "Select City*"
        );
      }
      $("#" + formId + " #" + cityId).prop("disabled", false);
      flag = true;
    }
  });
  return flag;
}

function callCitiesNew(formId, value, elementId, bindElementId) {
  var flag = false;
  hideMessage("");
  if (!validateRequestForMaster(formId, elementId)) {
    $("#" + formId + " #" + bindElementId).val(0);
    resetDropdown($("#" + formId + " #" + bindElementId), "Select city*");
    return false;
  }
  $("#" + formId + " #" + bindElementId).prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("formId", "CITIES-LIST", value)),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["cities"],
          $("#" + formId + " #" + bindElementId),
          "Select city*"
        );
      }
      $("#" + formId + " #" + bindElementId).prop("disabled", false);
      flag = true;
    }
  });
  return flag;
}
// function getAllCountryTimezone(formId, value, elementId) {
//   hideMessage("");
//   $.ajax({
//     type: "POST",
//     contentType: "application/json",
//     url: getURLForCommon("masters"),
//     data: JSON.stringify(getRequestForMaster(formId, "TIMEZONE-LIST", value)),
//     dataType: "json",
//     cache: false,
//     timeout: 600000,
//     success: function (data) {
//       if (data["status"] == "0" || data["status"] == "2") {
//         showMessageTheme2(1, data["message"]);
//       } else {
//         $.each(data["mastersData"]["countryTimeZones"], function (k, v) {
//           $("#" + formId + " #" + elementId).append(
//             '<option custom_timezone_id="' +
//               v.key +
//               '" value="' +
//               v.value +
//               '">(' +
//               v.extra +
//               ") - " +
//               v.extra1 +
//               "/" +
//               v.extra3 +
//               "</option>"
//           );
//         });
//         if ($("#" + formId + "Alternet #" + elementId).length) {
//           $("#" + formId + "Alternet #" + elementId).html(
//             $("#" + formId + " #" + elementId).html()
//           );
//         }
//       }
//     },
//   });
// }
function getAllCountryTimezone(formId, value, elementId) {
  hideMessage("");

  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      contentType: APPLICATION_JSON_VALUE,
      url: getURLForCommon("masters"),
      data: JSON.stringify(getRequestForMaster(formId, "TIMEZONE-LIST", value)),
      dataType: "json",
      cache: false,
      timeout: 600000,
      success: function (data) {
        if (data["status"] == "0" || data["status"] == "2") {
          showMessageTheme2(1, data["message"]);
          reject(new Error(data["message"]));
        } else {
          const optionsHtml = data["mastersData"]["countryTimeZones"]
            .map((v) =>
              `<option custom_timezone_id="${v.key}" value="${v.value}">(${v.extra}) - ${v.extra1}/${v.extra3}</option>`
            )
            .join("");

          $("#" + formId + " #" + elementId).html(optionsHtml);

          if ($("#" + formId + "Alternet #" + elementId).length) {
            $("#" + formId + "Alternet #" + elementId).html(optionsHtml);
          }

          resolve(data);
        }
      }
    });
  });
}
function callISDCode(formId, value, elementId) {
  $("#" + formId + " #" + elementId).html(
    '<option value="">Select ISD code</option>'
  );
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster(formId, "COUNTRIES-LIST", value)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(1, data["message"]);
      } else {
        $.each(data["mastersData"]["countries"], function (k, v) {
          $("#" + formId + " #" + elementId).append(
            '<option value="' +
              v.extra1 +
              '">' +
              v.extra1 +
              " " +
              v.value +
              "</option>"
          );
        });
      }
      if ($("#" + formId + "Alternet #" + elementId).length) {
        $("#" + formId + "Alternet #" + elementId).html(
          $("#" + formId + " #" + elementId).html()
        );
      }
      callLocationAndSelectCountryNew(formId);
    },
  });
}
function callCountries(formId, value, elementId, eventBinder) {
  $("#" + formId + " #" + elementId).html(
    '<option value="">Select country*</option>'
  );
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster(formId, "COUNTRIES-LIST", value)),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(1, data["message"]);
      } else {
        $.each(data["mastersData"]["countries"], function (k, v) {
          $("#" + formId + " #" + elementId).append(
            '<li class="option ' +
              eventBinder +
              '" value="' +
              v.key +
              '">' +
              v.value +
              "</li>"
          );
        });
      }
      if ($("#" + formId + "Alternet #" + elementId).length) {
        $("#" + formId + "Alternet #" + elementId).html(
          $("#" + formId + " #" + elementId).html()
        );
      }
    },
  });
  return true;
}
// function callCountriesOption(formId, value, elementId, preSelected, msg) {
//   $("#" + formId + " #" + elementId).html(
//     '<option value="">Select country*</option>'
//   );
//   $.ajax({
//     type: "POST",
//     contentType: APPLICATION_JSON_VALUE,
//     url: getURLForCommon("masters"),
//     data: JSON.stringify(getRequestForMaster(formId, "COUNTRIES-LIST", value)),
//     dataType: "json",
//     async: false,
//     success: function (data) {
//       if (data["status"] == "0" || data["status"] == "2") {
//         showMessageTheme2(1, data["message"]);
//       } else {
//         if(msg == undefined || msg == ""){
//           msg = "Select Country";
//         }
//         buildDropdownCountry(
//           data["mastersData"]["countries"],
//           $("#" + formId + " #" + elementId),
//           msg
//         );
//         // var html='';
//         // html += '<option value="" disabled selected>Select Country</option>';
//         // $.each(data['mastersData']['countries'], function(k, v) {
//         // 	html+='<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="'+v.key+'" '+(preSelected==v.key?'selected':'')+'>'+v.value+'</option>'
//         // 	//html+='<option value="'+v.key+'" '+(preSelected==v.key?'selected':'')+' >'+v.value+'</option>';
//         // });
//         // $("#"+elementId).html(html);
//       }
//     },
//   });
// }

function callCountriesOption(formId, value, elementId, preSelected, msg) {
  return new Promise((resolve, reject) => {
    const $element = $("#" + formId + " #" + elementId);

    $element.html('<option value="">Select country*</option>');

    $.ajax({
      type: "POST",
      contentType: APPLICATION_JSON_VALUE,
      url: getURLForCommon("masters"),
      data: JSON.stringify(
        getRequestForMaster(formId, "COUNTRIES-LIST", value)
      ),
      dataType: "json",
      success: function (data) {
        if (data["status"] === "0" || data["status"] === "2") {
          showMessageTheme2(1, data["message"]);
          reject(data["message"]);
        } else {
          if (!msg) {
            msg = "Select Country";
          }

          buildDropdownCountry(
            data["mastersData"]["countries"],
            $element,
            msg
          );

          resolve(data);
        }
      },
      error: function (xhr, status, error) {
        reject(error);
      }
    });
  });
}

function buildDropdownCountry(result, dropdown, emptyMessage) {
    dropdown.html('');
	if (result != '') {
		dropdown.append('<option value>' + emptyMessage + '</option>');
		$.each(result, function (k, v) {
            if (v.extra != null && v.extra1 != null) {
				dropdown.append('<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="' + v.key + '"> ' + v.value + '</option>');
			} else if (v.extra != null) {
				if (v.extra == 'selected') {
					dropdown.append('<option disabled selected value="' + v.key + '">' + v.value + '</option>');
				} else if (v.extra == 'non-selected') {
					dropdown.append('<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="' + v.key + '"> ' + v.value + '</option>');
				} else {
					dropdown.append('<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="' + v.key + '"> ' + v.value + '</option>');
				}

			} else {
				dropdown.append('<option value="' + v.key + '">' + v.value + '</option>');
			}
		});
	} else {
		dropdown.append('<option value="0">' + emptyMessage + '</option>');
	}
}


function callStates(formId, value, countryId, stateId, cityId) {
  hideMessage("");
  if (stateId == undefined) {
    stateId = "stateId";
  }
  if (cityId == undefined) {
    cityId = "cityId";
  }
  if (!validateRequestForMaster(formId, countryId)) {
    resetDropdown($("#" + formId + " #" + stateId), "Select State/Province*");
    $("#" + formId + " #" + stateId)
      .val(0)
      .trigger("change");
    resetDropdown($("#" + formId + " #" + cityId), "Select City*");
    $("#" + formId + " #" + cityId)
      .val(0)
      .trigger("change");
    return false;
  }
  $("#" + stateId).prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "STATES-LIST",
        value == "" ? $("#" + countryId).val() : value
      )
    ),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["states"],
          $("#" + formId + " #" + stateId),
          "Select State/Province*"
        );
      }
      $("#" + formId + " #" + stateId).prop("disabled", false);
    }
  });
  return true;
}

function validateRequestForMaster(formId, elementId) {
  if ($("#" + formId + " #" + elementId).val() == null) {
    return false;
  }
  if(
    $("#" + formId + " #" + elementId).val().trim() == "" ||
    $("#" + formId + " #" + elementId).val().trim() == 0
  ){
    return false;
  }
  return true;
}

function callStatesNew(formId, value, elementId, bindElementId) {
  hideMessage("");
  if (!validateRequestForMaster(formId, elementId)) {
    $("#" + formId + " #" + bindElementId).val(0);
    resetDropdown($("#" + formId + " #stateId"), "Select State/Province*");
    $("#" + formId + " #cityId").val(0);
    resetDropdown($("#" + formId + " #cityId"), "Select City*");
    return false;
  }
  $("#stateId").prop("disabled", true);

  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster(formId, "STATES-LIST", value)),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["states"],
          $("#" + formId + " #" + bindElementId),
          "Select State/Province*"
        );
      }
      $("#" + formId + " #" + bindElementId).prop("disabled", false);
    }
  });
  return true;
}

// function validateRequestForMaster(formId, elementId) {
//   if (
//     $("#" + formId + " #" + elementId).val() == "" ||
//     $("#" + formId + " #" + elementId).val() <= 0
//   ) {
//     return false;
//   }
//   return true;
// }

function callForResetPassword(formId, moduleId) {
  hideMessage("");
  if (
    $("#password").val().trim() == "" &&
    $("#confirmPassword").val().trim() == ""
  ) {
    showMessageTheme2(false, "Fields are not valid", "", false);
    return false;
  } else if (
    $("#password").val().trim() != $("#confirmPassword").val().trim()
  ) {
    showMessageTheme2(false, "Password does not match.", "", false);
    return false;
  }
  if (
    !checkPasswordStrength(
      $("#" + formId + " #password").get(0),
      formId,
      "password",
      "P"
    )
  ) {
    showMessageTheme2(
      false,
      " New password must match all requirements",
      "",
      false
    );
    return false;
  }
  if (
    !checkPasswordStrength(
      $("#" + formId + " #confirmPassword").get(0),
      formId,
      "confirmPassword",
      "CP",
      "password"
    )
  ) {
    showMessageTheme2(
      false,
      " Confirm password must match all requirements",
      "",
      false
    );
    return false;
  }
  $.ajax({
    type: "POST",
    url: getURLForCommon("reset-password"),
    contentType: APPLICATION_JSON_VALUE,
    data: JSON.stringify(getRequestForReset(formId, moduleId)),
    dataType: "json",
    success: function (data) {
      if (
        data["status"] == "0" ||
        data["status"] == "2" ||
        data["status"] == "3"
      ) {
        if (data["status"] == "3") {
          redirectLoginPage();
        } else {
          showMessageTheme2(0, data["message"], "", true);
        }
      } else {
        if (data["statusCode"] == "S001") {
          showMessageTheme2(true, data["message"]);
          setTimeout(function () {
            logout();
          }, 1500);
        } else {
          showMessageTheme2(true, data["message"]);
        }
      }
      return false;
    },
  });
}

function getRequestForReset(formId, moduleId) {
  var request = {};
  var authentication = {};
  var data = {};
  data["password"] = encode(
    $("#" + formId + " #password")
      .val()
      .trim()
  );
  data["confirmPassword"] = encode(
    $("#" + formId + " #confirmPassword")
      .val()
      .trim()
  );
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId")
    .val()
    .trim();
  request["authentication"] = authentication;
  request["data"] = data;
  return request;
}

function callForEmailForgot(formId, moduleId) {
  hideMessage("");
  if (!validateForEmailForgot(formId)) {
    return false;
  }
  //$("#resendEmail").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("forgot-password"),
    data: JSON.stringify(getRequestForForgot(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        //showMessageTheme2(1, data['message']);
        if (data["statusCode"] == "0047") {
          showWrapper(true);
          $("#emailNotVerify").html(data["message"]);
          $("#emailNotVerify").show();
          $("#allReadyEmailFooter").show();
          $("#emailVerify").hide();
          $("#userDeclined").hide();
        } else {
          showMessageTheme2(1, data["message"]);
        }
      } else {
        $("#forgotPassword #emailid").val().trim("");
        $("#forgotPassword").modal("hide");
        showMessageTheme2(0, data["message"]);
      }
      //$("#resendEmail").prop("disabled", false);
      return false;
    }
  });
}

function validateForEmailForgot(formId) {
  //GLOBAL_EMAIL
  if (
    !validateEmail(
      $("#" + formId + " #emailid")
        .val()
        .trim()
    )
  ) {
    $("#" + formId + " #emailid").css("color", "#a9a9a9");
    showMessageTheme2(0, "Please enter a valid email.");
    return false;
  }
  return true;
}

function getRequestForForgot(formId, moduleId) {
  var request = {};
  var authentication = {};
  var data = {};
  data["requestKey"] = "FORGOT-PASSWORD";
  data["requestValue"] = $("#" + formId + " #emailid")
    .val()
    .trim();
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  request["authentication"] = authentication;
  request["data"] = data;
  return request;
}


function callForEmailResend(emailId, moduleId, sendStatus) {
  hideMessage("");
  if (!validateForEmailResend(emailId)) {
    return false;
  }
  $("#resendEmail").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("resend-email-verification"),
    data: JSON.stringify(
      getRequestForEmailResend(emailId, moduleId, sendStatus)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        if (data["statusCode"] == "0022") {
          showMessageTheme2(0, data["message"],'',true);

        } else {
          showMessageTheme2(0, data["message"],'',true);
        }
      } else {
        showMessageTheme2(1, data["message"],'',true);
      }
      $("#resendEmail").prop("disabled", false);
      return false;
    }
  });
}

function validateForEmailResend(emailId) {
  //GLOBAL_EMAIL
  if (!validateEmail(emailId)) {
    showMessageTheme2(0, "Email is either empty or invalid");
    return false;
  }
  return true;
}

function getRequestForEmailResend(emailId, moduleId, sendStatus) {
  var request = {};
  var authentication = {};
  var data = {};
  data["requestKey"] = "EMAIL-RESEND";
  data["email"] = emailId;
  data["sendStatus"] = sendStatus;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  request["authentication"] = authentication;
  request["data"] = data;
  return request;
}

function validateRequestForContact(formId) {
  if (
    $("#" + formId + " #countryId")
      .val()
      .trim() == 0 ||
    $("#" + formId + " #countryId").val() == null
  ) {
    showMessageTheme2(1, "Country is required");
    return false;
  }
  if (
    $("#" + formId + " #stateId")
      .val()
      .trim() == 0 ||
    $("#" + formId + " #stateId").val() == null
  ) {
    showMessageTheme2(1, "State is required");
    return false;
  }
  if (
    $("#" + formId + " #cityId")
      .val()
      .trim() == 0 ||
    $("#" + formId + " #cityId").val() == null
  ) {
    showMessageTheme2(1, "City is required");
    return false;
  }
  if (
    $("#" + formId + " #name")
      .val()
      .trim() == ""
  ) {
    showMessageTheme2(1, "Name is required");
    return false;
  }

  if (
    !validateEmail(
      $("#" + formId + " #email")
        .val()
        .trim()
    )
  ) {
    showMessageTheme2(0, "Email is either empty or invalid");
    return false;
  }
  if (
    $("#" + formId + " #countryCode")
      .val()
      .trim() == 0
  ) {
    showMessageTheme2(1, "Country Code is required");
    return false;
  }

  if (
    $("#" + formId + " #contactNumber")
      .val()
      .trim() == 0
  ) {
    showMessageTheme2(1, "Contact Number is required");
    return false;
  }
  if (
    $("#" + formId + " #contactDescription")
      .val()
      .trim() == 0
  ) {
    showMessageTheme2(1, "Contact Description is required");
    return false;
  }

  if (
    !validateCaptcha(
      $("#" + formId + " #captcha")
        .val()
        .trim()
    )
  ) {
    showMessageTheme2(0, "Either captcha is empty or invalid");
    return false;
  }
  return true;
}

function getRequestForContact(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var contactUsDTO = {};
  contactUsDTO["countryId"] = $("#" + formId + " #countryId")
    .val()
    .trim();
  contactUsDTO["stateId"] = $("#" + formId + " #stateId")
    .val()
    .trim();
  contactUsDTO["cityId"] = $("#" + formId + " #cityId")
    .val()
    .trim();
  contactUsDTO["name"] = $("#" + formId + " #name")
    .val()
    .trim();
  contactUsDTO["email"] = $("#" + formId + " #email")
    .val()
    .trim();
  contactUsDTO["isdCode"] = $("#" + formId + " #countryCode")
    .val()
    .trim();
  contactUsDTO["contactNumber"] = $("#" + formId + " #contactNumber")
    .val()
    .trim();
  contactUsDTO["contactDescription"] = $("#" + formId + " #contactDescription")
    .val()
    .trim();
  contactUsDTO["captcha"] = $("#" + formId + " #captcha")
    .val()
    .trim();
  requestData["contactUsDTO"] = contactUsDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  // console.log("request " + request);
  return request;
}

function callUserContact(formId, moduleId) {
  hideMessage("");
  if (!validateRequestForContact(formId)) {
    return false;
  }
  $("#login").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("contact"),
    data: JSON.stringify(getRequestForContact(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        refreshCaptcha("captchaImage");
        showMessageTheme2(1, data["message"]);
      } else {
        //customLoader(true);
        showMessageTheme2(0, data["message"]);
        // LOGIC TO DISPLAY DASHBOARD
        // LOGIC TO DISPLAY SIGN-PROCESS
      }
      $("#login").prop("disabled", false);
      return false;
    }
  });
}

//disable back button
window.onload = function () {
  if (typeof history.pushState === "function") {
    history.pushState("jibberish", null, null);
    window.onpopstate = function () {
      history.pushState("newjibberish", null, null);
    };
  } else {
    var ignoreHashChange = true;
    window.onhashchange = function () {
      if (!ignoreHashChange) {
        ignoreHashChange = true;
        window.location.hash = Math.random();
      } else {
        ignoreHashChange = false;
      }
    };
  }
};

//upload document function
function getFinalValue(data) {
  // var KEUS = getSecreteKey();
  // AesUtil(KEUS.KEYSIZE, KEUS.ITERATIONS);
  var payload = {};
  // payload['payload']=AesUtil.prototype.encrypt(KEUS.SALT, KEUS.IV, KEUS.PASSPHRASE, data);
  payload["payload"] = encode(JSON.stringify(data));
  // console.log("getFinalValue 2" + JSON.stringify(payload));
  return payload;
}
function bindFileUpload(uploadIndex, uploadCategoryId, uploadUserId) {
  var data = {};
  data["uploadCategory"] = uploadCategoryId;
  data["uploadUserId"] = uploadUserId;
  $("#fileupload" + uploadIndex)
    .fileupload({
      formData: { payload: JSON.stringify(getFinalValue(data)) },
      url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/upload/" + UNIQUEUUID,
      dataType: "json",
      type: "POST",
      enctype: "multipart/form-data",
      global: false,
      add: function (e, data) {
        var uploadErrors = [];
        var acceptFileTypes = /^image\/(png|jpe?g)$/i;
        var acceptFileTypesPDF = /^application\/pdf$/i;
        var isError = false;
        if (
          data.originalFiles[0]["type"].length &&
          (acceptFileTypes.test(data.originalFiles[0]["type"]) ||
            acceptFileTypesPDF.test(data.originalFiles[0]["type"]))
        ) {
        } else {
          isError = true;
        }
        //            else{
        //
        //	            	if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
        //	            		isError = true;
        //	            	}
        //            }
        if (isError) {
          uploadErrors.push(
            "Please upload files in following formats (jpg, jpeg, pdf or png)."
          );
        }
        if (
          data.originalFiles.length &&
          data.originalFiles[0]["size"] > 5242880
        ) {
          uploadErrors.push(MAX_SIZE_LIMIT);
          isError = true;
        }
        if (uploadErrors.length > 0) {
          showMessageTheme2(0, uploadErrors.join("\n"));
          return false;
        }
        data.process().done(function () {
          data.submit();
        });
      },
      start: function (e) {
        customLoader(true);
        //			console.log(uploadIndex+' start '+e);
        $("#fileupload" + uploadIndex + "Span").html("");
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          0 + "%"
        );
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("progress-bar-success")
          .removeClass("progress-bar-danger");
      },
      send: function (e, data) {
        //			console.log(uploadIndex+' send '+e+" = "+data);
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          5 + "%"
        );
      },
      done: function (e, data) {
        customLoader(false);
        //			console.log(uploadIndex+' done '+e+" = "+data);
        if (data.result.status == 0 || data.result.status == 3) {
          //				$('#fileupload'+uploadIndex+'Progress .progress-bar').css('width', 100 + '%');
          //DISPLAY MESSAGE FORM SERVER SIDE data.resutl.message
          $("#fileupload" + uploadIndex + "ProgressStatus")
            .removeClass("progress-bar-success")
            .addClass("progress-bar-danger");
          if (
            data.result.message.includes("Your session has been timed out") ||
            data.result.status == 3
          ) {
            redirectLoginPage();
          }
        } else {
          $.each(data.result.uploadFiles, function (index, file) {
            //console.log(uploadIndex+' done'+index+" = "+file+' == '+file.fileName);
            if (file.status == 1) {
              var removeClassName = "";
              if (uploadIndex == 1) {
                removeClassName = "fa fa-user";
              } else if (uploadIndex == 2) {
                removeClassName = "fa fa-calendar";
              } else if (uploadIndex == 3) {
                removeClassName = "fa fa-home";
              } else if (uploadIndex == 4) {
                removeClassName = "fa fa-image";
              } else if (uploadIndex == 5) {
                removeClassName = "fa fa-graduation-cap";
              }
              $("#fileupload" + uploadIndex + "Response").removeClass(
                removeClassName
              );
              $("#fileupload" + uploadIndex + "Response")
                .removeClass("label-error")
                .addClass("fa fa-check-circle green");
              if ($("#fileupload" + uploadIndex + "Span").html() == "") {
                $("#fileupload" + uploadIndex + "Span").html(file.fileName);
              } else {
                $("#fileupload" + uploadIndex + "Span").html(
                  $("#fileupload" + uploadIndex + "Span").html() +
                    "," +
                    file.fileName
                );
              }
              if (uploadIndex == 1) {
                $(".profile-pic").attr("src", FILE_UPLOAD_PATH + file.fileName);
              }
            }
          });
        }
      },
      progressall: function (e, data) {
        //			console.log(uploadIndex+' progressall '+e+" = "+data);
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("label-error")
          .addClass("fa fa-check-circle green");
        //var progress = parseInt(data.loaded / data.total * 100, 10);
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          100 + "%"
        );
      },
      fail: function (e, data) {
        //			console.log(uploadIndex+' fail '+e+" = "+data);
        //				console.log(uploadIndex+' fail '+index+" = "+file+' == '+file.name);
        //$('#fileupload'+uploadIndex+'Progress .progress-bar').css('width', 100 + '%');
        $("#fileupload" + uploadIndex + "ProgressStatus").addClass(
          "label-error"
        );
        showMessageTheme2(0, MAX_SIZE_LIMIT);
      },
    })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput ? undefined : "disabled");
}
function bindFileUploadNew(uploadIndex, uploadCategoryId, uploadUserId) {
  var data = {};
  data["uploadCategory"] = uploadCategoryId;
  data["uploadUserId"] = uploadUserId;
  $("#" + uploadIndex)
    .fileupload({
      formData: { payload: JSON.stringify(getFinalValue(data)) },
      url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/upload/" + UNIQUEUUID,
      dataType: "json",
      type: "POST",
      enctype: "multipart/form-data",
      global: false,
      add: function (e, data) {
        var uploadErrors = [];
        var acceptFileTypes = /^image\/(png|jpe?g)$/i;
        var acceptFileTypesPDF = /^application\/pdf$/i;
        var isError = false;
        if (
          data.originalFiles[0]["type"].length &&
          (acceptFileTypes.test(data.originalFiles[0]["type"]) ||
            acceptFileTypesPDF.test(data.originalFiles[0]["type"]))
        ) {
        } else {
          isError = true;
        }
        //            else{
        //
        //	            	if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
        //	            		isError = true;
        //	            	}
        //            }
        if (isError) {
          uploadErrors.push(
            "Please upload files in following formats (jpg, jpeg, pdf or png)."
          );
        }
        if (
          data.originalFiles.length &&
          data.originalFiles[0]["size"] > 5242880
        ) {
          uploadErrors.push(MAX_SIZE_LIMIT);
          isError = true;
        }
        if (uploadErrors.length > 0) {
          showMessageTheme2(0, uploadErrors.join("\n"));
          return false;
        }
        data.process().done(function () {
          data.submit();
        });
      },
      start: function (e) {
        if (signupPage != 0) {
          $("#commonloaderId, #commonloaderBody").show();
        } else {
          customLoader(true);
        }

        $("#" + uploadIndex)
          .parents(".file-tab")
          .find("span.fileName")
          .text();
      },
      send: function (e, data) {
        // console.log("send");
      },
      done: function (e, data) {
        if (signupPage != 0) {
          $("#commonloaderId, #commonloaderBody").hide();
        } else {
          customLoader(false);
        }
        // console.log("done");
        if (data.result.status == 0 || data.result.status == 3) {
          //$("#"+uploadIndex).parents(".file-tab").find("span.fileName").text();
          if (
            data.result.message.includes("Your session has been timed out") ||
            data.result.status == 3
          ) {
            redirectLoginPage();
          }
        } else {
          $.each(data.result.uploadFiles, function (index, file) {
            if (file.status == 1) {
              // console.log("aya");
              console.log("file: " + file);
              $("#" + uploadIndex)
                .parents(".file-tab")
                .find("span.fileName")
                .text(file.fileName);
              // console.log(
              //   $("#" + uploadIndex)
              //     .parents(".file-tab")
              //     .find("span.fileName")
              //     .text(file.fileName)
              // );
              //console.log('type'+data.originalFiles[0]['type']);
              if (data.originalFiles[0]["type"] == "application/pdf") {
                $("#" + uploadIndex)
                  .parents(".file-tab")
                  .find("img")
                  .attr("src", PATH_FOLDER_IMAGE2 + "pdf.jpg");
              }
            }
          });
        }
      },
      progressall: function (e, data) {
        // console.log("progressall");
      },
      fail: function (e, data) {
        console.log("fail");
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          100 + "%"
        );
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("progress-bar-success")
          .addClass("progress-bar-danger");
        showMessageTheme2(0, MAX_SIZE_LIMIT);
      },
    })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput ? undefined : "disabled");
}
function bindFileUploadNew1(
  uploadIndex,
  uploadCategoryId,
  uploadUserId,
  uploadMethodType,
  skipSession
) {
   var data = {};
  data["uploadCategory"] = uploadCategoryId;
  data["uploadUserId"] = uploadUserId;
  data["skipSession"] = skipSession;
  $("#fileupload" + uploadIndex).fileupload({
      formData: { payload: JSON.stringify(getFinalValue(data)) },
      url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/upload/" + UNIQUEUUID,
      dataType: "json",
      type: "POST",
      enctype: "multipart/form-data",
      global: false,
      add: function (e, data) {
        var uploadErrors = [];
        var acceptFileTypes = /^image\/(png|jpe?g)$/i;
        var acceptFileTypesPDF = /^application\/pdf$/i;
        var isError = false;
        if (
          data.originalFiles[0]["type"].length &&
          (acceptFileTypes.test(data.originalFiles[0]["type"]) ||
            acceptFileTypesPDF.test(data.originalFiles[0]["type"]))
        ) {
        } else {
          isError = true;
        }
        if (isError) {
          uploadErrors.push(
            " Please upload files in following formats (jpg, jpeg, pdf or png)."
          );
        }
        if (SCHOOL_ID == 1) {
          if ((USER_ROLE != "TEACHER" && data.originalFiles.length && data.originalFiles[0]["size"] > 10276044.8) || (USER_ROLE == "TEACHER" && data.originalFiles.length && data.originalFiles[0]["size"] > 10276044.8)) {
            if (USER_ROLE == "TEACHER") {
              uploadErrors.push(MAX_SIZE_LIMIT_FOR_TEACHER);
            } else {
              uploadErrors.push(MAX_SIZE_LIMIT);
            }
            isError = true;
          }else{
            if((USER_ROLE != "TEACHER" && data.originalFiles.length && data.originalFiles[0]["size"] > 5767168)) {
              uploadErrors.push(MAX_SIZE_LIMIT);
              isError = true;
            }
          }
        }
        else {
          if((USER_ROLE != "TEACHER" && data.originalFiles.length && data.originalFiles[0]["size"] > 5767168) || (USER_ROLE == "TEACHER" && data.originalFiles.length && data.originalFiles[0]["size"] > 5767168)) {
            if (USER_ROLE == "TEACHER") {
              uploadErrors.push(MAX_SIZE_LIMIT);
            } else {
              uploadErrors.push(MAX_SIZE_LIMIT);
            }
            isError = true;
          }
        }
        if (uploadErrors.length > 0) {
          if (
            "34" == uploadCategoryId ||
            "35" == uploadCategoryId ||
            "36" == uploadCategoryId ||
            "37" == uploadCategoryId ||
            "38" == uploadCategoryId

          ) {
            showMessageTheme2ErrorNew(
              true,
              uploadErrors.join("\n"),
              "evaluationDocsError"
            );
            return false;
          } else {
            if (tt == "theme1") {
              showMessageTheme2(0, uploadErrors.join("\n"), "", false);
              setTimeout(function () {
                $("#fileupload" + uploadIndex + "Span").html(
                  "No file Selected"
                );
              }, 1000);
              return false;
            } else {
              showMessageTheme2(0, uploadErrors.join("\n"), "", false);
              setTimeout(function () {
                $("#fileupload" + uploadIndex + "Span").html(
                  "No file Selected"
                );
              }, 1000);
              return false;
            }
          }
        }
        data.process().done(function () {
          data.submit();
        });
      },
      start: function (e) {
        if (signupPage != 0) {
          $("#commonloaderId, #commonloaderBody").show();
        } else {
          customLoader(true);
        }
        if (uploadMethodType == 1) {
          $("#fileupload" + uploadIndex + "Span").html("");
          $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
            "width",
            0 + "%"
          );
          $("#fileupload" + uploadIndex + "ProgressStatus")
            .removeClass("progress-bar-success")
            .removeClass("progress-bar-danger");
        } else if (uploadMethodType == 2) {
          $("#fileupload" + uploadIndex)
            .parents(".file-tab")
            .find("span.fileName")
            .text();
          if (
            "34" == uploadCategoryId ||
            "35" == uploadCategoryId ||
            "36" == uploadCategoryId ||
            "37" == uploadCategoryId ||
            "38" == uploadCategoryId
          ) {
            if ("34" == uploadCategoryId) {
              hideMessageErrorNew("fileupload1Error");
              showMessageTheme2ErrorNew(false, "", "fileupload1Error");
            } else if ("35" == uploadCategoryId) {
              hideMessageErrorNew("fileupload2Error");
              showMessageTheme2ErrorNew(false, "", "fileupload2Error");
            } else if ("36" == uploadCategoryId) {
              showMessageTheme2ErrorNew(false, "", "fileupload3Error");
            } else if ("37" == uploadCategoryId) {
              showMessageTheme2ErrorNew(false, "", "fileupload4Error");
            } else if ("38" == uploadCategoryId) {
              showMessageTheme2ErrorNew(false, "", "fileupload5Error");
            }
          }
        } else if (uploadMethodType == 3) {
          $("#fileupload" + uploadIndex)
            .parents(".file-tab")
            .find("span.fileName")
            .text();
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .parent("div")
            .find("i")
            .removeClass("fa-check-circle-o");
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .parent("div")
            .find("i")
            .removeClass("fa-close");
        } else if (uploadMethodType == 4) {
        }
      },
      send: function (e, data) {
        // console.log("send");
        if (uploadMethodType == 1) {
          $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
            "width",
            5 + "%"
          );
        } else if (uploadMethodType == 2) {
        } else if (uploadMethodType == 3) {
        } else if (uploadMethodType == 4) {
        }
      },
      done: function (e, data) {
        uploadDone = true;
        if (signupPage != 0) {
          $("#commonloaderId, #commonloaderBody").hide();
        } else {
          customLoader(false);
        }
        // console.log("done");
        if (data.result.status == 0 || data.result.status == 3) {
          if (uploadMethodType == 1) {
            $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
              "width",
              100 + "%"
            );
            $("#fileupload" + uploadIndex + "ProgressStatus")
              .removeClass("progress-bar-success")
              .addClass("progress-bar-danger");
          } else if (uploadMethodType == 2) {
            $("#fileupload" + uploadIndex)
              .parents(".file-tab")
              .find("span.fileName")
              .text();
          } else if (uploadMethodType == 3) {
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .parent("div")
              .find("i")
              .removeClass("fa-check-circle-o");
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .parent("div")
              .find("i")
              .removeClass("fa-close");
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .parent("div")
              .find("i")
              .addClass("fa fa-close");
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .parent("div")
              .find("h1")
              .attr("style", "color:red");
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .parent("div")
              .find("span.fileName")
              .html("");
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .find("a.view")
              .next("a.remove")
              .attr("style", "display:none;");
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .find("a.view")
              .attr("style", "display:none;");
          } else if (uploadMethodType == 4) {
            $("#fileName" + uploadIndex).html("");
            $("#divdeleteDocument" + uploadIndex).attr(
              "style",
              "display:none;"
            );
            $("#divshowDocument" + uploadIndex).attr("style", "display:none;");
          }
          showMessageTheme2(0, data.result.message, "", true);
          if (
            data.result.message.includes("Your session has been timed out") ||
            data.result.status == 3
          ) {
            redirectLoginPage();
          }
        }
        else {
          $.each(data.result.uploadFiles, function (index, file) {
            if (file.status == 1) {
              // console.log("file: " + file);
              if (uploadMethodType == 1) {
                var removeClassName = "";
                if (uploadIndex == 1) {
                  removeClassName = "fa fa-user";
                } else if (uploadIndex == 2) {
                  removeClassName = "fa fa-calendar";
                } else if (uploadIndex == 3) {
                  removeClassName = "fa fa-home";
                } else if (uploadIndex == 4) {
                  removeClassName = "fa fa-image";
                } else if (uploadIndex == 5) {
                  removeClassName = "fa fa-graduation-cap";
                }
                $("#fileupload" + uploadIndex + "Response").removeClass(
                  removeClassName
                );
                $("#fileupload" + uploadIndex + "Response")
                  .removeClass("label-error")
                  .addClass("fa fa-check-circle green");
                if ($("#fileupload" + uploadIndex + "Span").html() == "") {
                  $("#fileupload" + uploadIndex + "Span").html(file.fileName);
                } else {
                  $("#fileupload" + uploadIndex + "Span").html(
                    $("#fileupload" + uploadIndex + "Span").html() +
                      "," +
                      file.fileName
                  );
                }
                if (uploadIndex == 1) {
                  $(".profile-pic").attr(
                    "src",
                    FILE_UPLOAD_PATH + file.fileName
                  );
                  $("#dropDownProfileImage").attr(
                    "src",
                    FILE_UPLOAD_PATH + file.fileName
                  );
                  $("#topProfileImage").attr(
                    "src",
                    FILE_UPLOAD_PATH + file.fileName
                  );
                }
              }
              else if (uploadMethodType == 2) {
                hideMessageErrorNew("evaluationDocsError");
                // console.log(
                //   $("#fileupload" + uploadIndex)
                //     .parents(".file-tab")
                //     .find("span.fileName")
                //     .text(file.fileName)
                // );
                $("#evluationATTachement" + uploadIndex).val(file.fileName);
                if (data.originalFiles[0]["type"] == "application/pdf") {
                  $("#fileupload" + uploadIndex)
                    .parents(".file-tab")
                    .find("img")
                    .attr("src", FILE_UPLOAD_PATH + file.fileName + "pdf.jpg");
                  $(".pdf" + uploadIndex + " .stu-view" + uploadIndex).attr(
                    "href",
                    FILE_UPLOAD_PATH + file.fileName
                  );
                  $(".pdf" + uploadIndex).attr("title", file.fileName);
                  $(".other-img" + uploadIndex).css({ display: "none" });
                  $(
                    ".pdf" + uploadIndex + ", .delete-upload" + uploadIndex
                  ).css({ display: "inline-block" });
                  validateElement(
                    "evalualionFormRequest",
                    "fileupload" + uploadIndex,
                    "fileupload" + uploadIndex + "Error"
                  );
                } else {
                  $("#fileupload" + uploadIndex)
                    .parents(".file-tab")
                    .find("span.fileName")
                    .text(file.fileName);
                  $(
                    ".other-img" + uploadIndex + " .stu-view" + uploadIndex
                  ).attr(
                    "href",
                    'javascript:showDocument("' +
                      FILE_UPLOAD_PATH +
                      file.fileName +
                      '");'
                  );
                  $(".other-img" + uploadIndex).attr("title", file.fileName);
                  $(".pdf" + uploadIndex).css({ display: "none" });
                  $(
                    ".other-img" +
                      uploadIndex +
                      ", .delete-upload" +
                      uploadIndex
                  ).css({ display: "inline-block" });
                  validateElement(
                    "evalualionFormRequest",
                    "fileupload" + uploadIndex,
                    "fileupload" + uploadIndex + "Error"
                  );
                }
              }
              else if (uploadMethodType == 3) {
                $("#fileupload" + uploadIndex + "img").attr(
                  "fileName",
                  file.fileName
                );
                $("#fileupload" + uploadIndex + "img").attr(
                  "href",
                  'javascript:removeDocument("' +
                    uploadIndex +
                    '","' +
                    uploadMethodType +
                    '");'
                );
                if (data.originalFiles[0]["type"] == "application/pdf") {
                  $("#fileupload" + uploadIndex + "img").addClass("full mt-1");
                  $("#fileupload" + uploadIndex + "img").attr(
                    "target",
                    "_blank"
                  );
                  $("#fileupload" + uploadIndex + "img").attr(
                    "href",
                    FILE_UPLOAD_PATH + file.fileName
                  );
                  setTimeout(function () {
                    $("#fileupload" + uploadIndex + "imgIcon").attr(
                      "src",
                      PATH_FOLDER_IMAGE2 + "pdf.jpg"
                    );
                  }, 3000);
                  // console.log("PATH_FOLDER_IMAGE2 : " + PATH_FOLDER_IMAGE2);
                } else {
                  $("#fileupload" + uploadIndex + "img").addClass("full mt-1");
                  $("#fileupload" + uploadIndex + "img").attr(
                    "target",
                    "_self"
                  );
                  $("#fileupload" + uploadIndex + "img").attr(
                    "href",
                    'javascript:showDocument("' +
                      FILE_UPLOAD_PATH +
                      file.fileName +
                      '");'
                  );
                  // $("#fileupload" + uploadIndex)
                  //   .parent("span")
                  //   .parent("p")
                  //   .find("a.view")
                  //   .next("a.remove")
                  //   .attr("style", "display:block;");
                  // $("#fileupload" + uploadIndex)
                  //   .parent("span")
                  //   .parent("p")
                  //   .find("a.view")
                  //   .attr("style", "display:block;");
                  setTimeout(function () {
                    $("#fileupload" + uploadIndex + "imgIcon").attr(
                      "src",
                      FILE_UPLOAD_PATH + file.fileName
                    );
                  }, 3000);
                }
                if (
                  "2" == uploadCategoryId ||
                  "3" == uploadCategoryId ||
                  "4" == uploadCategoryId ||
                  "14" == uploadCategoryId ||
                  "15" == uploadCategoryId ||
                  "16" == uploadCategoryId ||
                  "17" == uploadCategoryId ||
                  "75" == uploadCategoryId
                ) {
                  if (
                    data.result.userRole == "" ||
                    data.result.userRole == "STUDENT"
                  ) {
                    $("#fileupload" + uploadIndex + "div").hide();
                  }
                } else {
                  $("#fileupload" + uploadIndex + "div").hide();
                }
              }
              else if (uploadMethodType == 4) {
                $("#fileName" + uploadIndex).html(file.fileName);
                $("#fileupload" + uploadIndex + "Span").html(file.fileName);
                $("#deleteDocument" + uploadIndex).attr(
                  "href",
                  'javascript:removeDocument("' +
                    uploadIndex +
                    '","' +
                    uploadMethodType +
                    '");'
                );
                //							$('#deleteDocument'+uploadIndex).attr('style','display:block;');
                //							$('#showDocument'+uploadIndex).attr('style','display:block;');
                $("#divdeleteDocument" + uploadIndex).attr(
                  "style",
                  "display:block;"
                );
                $("#divshowDocument" + uploadIndex).attr(
                  "style",
                  "display:block;"
                );
                if (data.originalFiles[0]["type"] == "application/pdf") {
                  $("#showDocument" + uploadIndex).attr("target", "_blank");
                  $("#showDocument" + uploadIndex).attr(
                    "href",
                    FILE_UPLOAD_PATH + file.fileName
                  );
                } else {
                  $("#showDocument" + uploadIndex).attr("target", "_self");
                  $("#showDocument" + uploadIndex).attr(
                    "href",
                    'javascript:showDocument("' +
                      FILE_UPLOAD_PATH +
                      file.fileName +
                      '");'
                  );
                }
              }
              if (
                "34" == uploadCategoryId ||
                "35" == uploadCategoryId ||
                "36" == uploadCategoryId ||
                "37" == uploadCategoryId ||
                "33" == uploadCategoryId ||
                "38" == uploadCategoryId ||
                "51" == uploadCategoryId
              ) {
                setTimeout(function () {
                  if ("34" == uploadCategoryId) {
                    hideMessageErrorNew("fileupload1Error");
                    showMessageTheme2ErrorNew(
                      false,
                      " Document uploaded successfully.",
                      "fileupload1Error"
                    );
                  } else if ("35" == uploadCategoryId) {
                    hideMessageErrorNew("fileupload2Error");
                    showMessageTheme2ErrorNew(
                      false,
                      " Document uploaded successfully.",
                      "fileupload2Error"
                    );
                  } else if ("36" == uploadCategoryId) {
                    showMessageTheme2ErrorNew(
                      false,
                      " Document uploaded successfully.",
                      "fileupload3Error"
                    );
                  } else if ("37" == uploadCategoryId) {
                    showMessageTheme2ErrorNew(
                      false,
                      " Document uploaded successfully.",
                      "fileupload4Error"
                    );
                  } else if ("38" == uploadCategoryId) {
                    showMessageTheme2ErrorNew(
                      false,
                      " Document uploaded successfully.",
                      "fileupload5Error"
                    );
                  }else if ("33" == uploadCategoryId) {
                    $("#fileupload1Span").text(file.fileName)
                  }
                  else if ("51" == uploadCategoryId) {
                    $("#fileupload1Span").text(file.fileName)
                  }
                }, 500);
              } else {
                if (tt == "theme1") {
                  showMessageTheme2(1, " Document uploaded successfully.", "", true);
                } else {
                  showMessageTheme2(
                    1,
                    " Document uploaded successfully.",
                    "",
                    true
                  );
                }
              }
            }
          });
        }
      },
      progressall: function (e, data) {
        // console.log("progressall");
        if (uploadMethodType == 1) {
          $("#fileupload" + uploadIndex + "ProgressStatus")
            .removeClass("label-error")
            .addClass("fa fa-check-circle green");
          //var progress = parseInt(data.loaded / data.total * 100, 10);
          $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
            "width",
            100 + "%"
          );
        } else if (uploadMethodType == 2) {
        } else if (uploadMethodType == 3) {
        } else if (uploadMethodType == 4) {
        }
      },
      fail: function (e, data) {
        // console.log("fail");
        if (signupPage != 0) {
          $("#commonloaderId, #commonloaderBody").hide();
        } else {
          customLoader(false);
        }
        //			console.log(uploadIndex+' fail '+e+" = "+data);
        //			console.log(uploadIndex+' fail '+index+" = "+file+' == '+file.name);
        if (uploadMethodType == 1) {
          //$('#fileupload'+uploadIndex+'Progress .progress-bar').css('width', 100 + '%');
          $("#fileupload" + uploadIndex + "ProgressStatus").addClass(
            "label-error"
          );
          showMessageTheme2(0, MAX_SIZE_LIMIT, "", false);
        } else if (uploadMethodType == 2) {
          $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
            "width",
            100 + "%"
          );
          $("#fileupload" + uploadIndex + "ProgressStatus")
            .removeClass("progress-bar-success")
            .addClass("progress-bar-danger");
        } else if (uploadMethodType == 3) {
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .parent("div")
            .find("i")
            .addClass("fa fa-close");
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .parent("div")
            .find("h1")
            .attr("style", "color:red");
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .parent("div")
            .find("span.fileName")
            .html("");
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .find("a.view")
            .next("a.remove")
            .attr("style", "display:none;");
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .find("a.view")
            .attr("style", "display:none;");
        }
        if (tt == "theme2") {
          showMessageTheme2(0, MAX_SIZE_LIMIT, "", false);
        } else {
          showMessageTheme2(0, MAX_SIZE_LIMIT, "", false);
        }
        showMessageTheme2(0, MAX_SIZE_LIMIT, "", false);
      },
    })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput ? undefined : "disabled");
}
// function bindFileUploadNew1(
//   uploadIndex,
//   uploadCategoryId,
//   uploadUserId,
//   uploadMethodType,
//   skipSession
// ) {
//   var data = {};
//   data["uploadCategory"] = uploadCategoryId;
//   data["uploadUserId"] = uploadUserId;
//   data["skipSession"] = skipSession;
//   $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
//   $("#fileupload" + uploadIndex)
//     .fileupload({
//       formData: { payload: JSON.stringify(getFinalValue(data)) },
//       url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/upload/" + UNIQUEUUID,
//       dataType: "json",
//       type: "POST",
//       enctype: "multipart/form-data",
//       global: false,
//       add: function (e, data) {
//         var uploadErrors = [];
//         var acceptFileTypes = /^image\/(png|jpe?g)$/i;
//         var acceptFileTypesPDF = /^application\/pdf$/i;
//         var isError = false;
//         if (
//           data.originalFiles[0]["type"].length &&
//           (acceptFileTypes.test(data.originalFiles[0]["type"]) ||
//             acceptFileTypesPDF.test(data.originalFiles[0]["type"]))
//         ) {
//         } else {
//           isError = true;
//         }
//         if (isError) {
//           uploadErrors.push(
//             "Please upload files in following formats (jpg, jpeg, pdf or png)."
//           );
//         }
//         if (
//           (USER_ROLE != "TEACHER" &&
//             data.originalFiles.length &&
//             data.originalFiles[0]["size"] > 5242880) ||
//           (USER_ROLE == "TEACHER" &&
//             data.originalFiles.length &&
//             data.originalFiles[0]["size"] > 10485760)
//         ) {
//           if (USER_ROLE == "TEACHER") {
//             uploadErrors.push(MAX_SIZE_LIMIT_FOR_TEACHER);
//           } else {
//             uploadErrors.push(MAX_SIZE_LIMIT);
//           }
//           isError = true;
//         }
//         if (uploadErrors.length > 0) {
//           showMessage(true, uploadErrors.join("\n"));
//           return false;
//         }
//         data.process().done(function () {
//           data.submit();
//         });
//       },
//       start: function (e) {
//         customLoader(true);
//         if (uploadMethodType == 1) {
//           $("#fileupload" + uploadIndex + "Span").html("");
//           $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
//             "width",
//             0 + "%"
//           );
//           $("#fileupload" + uploadIndex + "ProgressStatus")
//             .removeClass("progress-bar-success")
//             .removeClass("progress-bar-danger");
//         } else if (uploadMethodType == 2) {
//           $("#fileupload" + uploadIndex)
//             .parents(".file-tab")
//             .find("span.fileName")
//             .text();
//         } else if (uploadMethodType == 3) {
//           $("#fileupload" + uploadIndex)
//             .parents(".file-tab")
//             .find("span.fileName")
//             .text();
//           $("#fileupload" + uploadIndex)
//             .parent("span")
//             .parent("p")
//             .parent("div")
//             .find("i")
//             .removeClass("fa-check-circle-o");
//           $("#fileupload" + uploadIndex)
//             .parent("span")
//             .parent("p")
//             .parent("div")
//             .find("i")
//             .removeClass("fa-close");
//         } else if (uploadMethodType == 4) {
//         }
//       },
//       send: function (e, data) {
//         if (uploadMethodType == 1) {
//           $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
//             "width",
//             5 + "%"
//           );
//         } else if (uploadMethodType == 2) {
//         } else if (uploadMethodType == 3) {
//         } else if (uploadMethodType == 4) {
//         }
//       },
//       done: function (e, data) {
//         customLoader(false);
//         if (data.result.status == 0 || data.result.status == 3) {
//           if (uploadMethodType == 1) {
//             $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
//               "width",
//               100 + "%"
//             );
//             $("#fileupload" + uploadIndex + "ProgressStatus")
//               .removeClass("progress-bar-success")
//               .addClass("progress-bar-danger");
//           }
//           else if (uploadMethodType == 2) {
//             $("#fileupload" + uploadIndex)
//               .parents(".file-tab")
//               .find("span.fileName")
//               .text();
//           }
//           else if (uploadMethodType == 3) {
//             $("#fileupload" + uploadIndex)
//               .parent("span")
//               .parent("p")
//               .parent("div")
//               .find("i")
//               .removeClass("fa-check-circle-o");
//             $("#fileupload" + uploadIndex)
//               .parent("span")
//               .parent("p")
//               .parent("div")
//               .find("i")
//               .removeClass("fa-close");
//             $("#fileupload" + uploadIndex)
//               .parent("span")
//               .parent("p")
//               .parent("div")
//               .find("i")
//               .addClass("fa fa-close");
//             $("#fileupload" + uploadIndex)
//               .parent("span")
//               .parent("p")
//               .parent("div")
//               .find("h1")
//               .attr("style", "color:red");
//             $("#fileupload" + uploadIndex)
//               .parent("span")
//               .parent("p")
//               .parent("div")
//               .find("span.fileName")
//               .html("");
//             $("#fileupload" + uploadIndex)
//               .parent("span")
//               .parent("p")
//               .find("a.view")
//               .next("a.remove")
//               .attr("style", "display:none;");
//             $("#fileupload" + uploadIndex)
//               .parent("span")
//               .parent("p")
//               .find("a.view")
//               .attr("style", "display:none;");
//           }
//           else if (uploadMethodType == 4) {
//             $("#fileName" + uploadIndex).html("");
//             $("#divdeleteDocument" + uploadIndex).attr(
//               "style",
//               "display:none;"
//             );
//             $("#divshowDocument" + uploadIndex).attr("style", "display:none;");
//           }
//           if (
//             data.result.message.includes("Your session has been timed out") ||
//             data.result.status == 3
//           ) {
//             redirectLoginPage();
//           }
//         } else {
//           $.each(data.result.uploadFiles, function (index, file) {
//             if (file.status == 1) {
//               console.log("file: " + file);
//               if (uploadMethodType == 1) {
//                 var removeClassName = "";
//                 if (uploadIndex == 1) {
//                   removeClassName = "fa fa-user";
//                 } else if (uploadIndex == 2) {
//                   removeClassName = "fa fa-calendar";
//                 } else if (uploadIndex == 3) {
//                   removeClassName = "fa fa-home";
//                 } else if (uploadIndex == 4) {
//                   removeClassName = "fa fa-image";
//                 } else if (uploadIndex == 5) {
//                   removeClassName = "fa fa-graduation-cap";
//                 }
//                 $("#fileupload" + uploadIndex + "Response").removeClass(
//                   removeClassName
//                 );
//                 $("#fileupload" + uploadIndex + "Response")
//                   .removeClass("label-error")
//                   .addClass("fa fa-check-circle green");
//                 if ($("#fileupload" + uploadIndex + "Span").html() == "") {
//                   $("#fileupload" + uploadIndex + "Span").html(file.fileName);
//                 } else {
//                   $("#fileupload" + uploadIndex + "Span").html(
//                     $("#fileupload" + uploadIndex + "Span").html() +
//                       "," +
//                       file.fileName
//                   );
//                 }
//                 if (uploadIndex == 1) {
//                   $(".profile-pic").attr(
//                     "src",
//                     FILE_UPLOAD_PATH + file.fileName
//                   );
//                   if (data.originalFiles[0]["type"] == "application/pdf") {
//                     showMessage(
//                       true,
//                       "Please upload files in following formats (jpg, jpeg or png)."
//                     );
//                     return false;
//                   }
//                 }
//               } else if (uploadMethodType == 2) {
//                 $("#fileupload" + uploadIndex)
//                   .parents(".file-tab")
//                   .find("span.fileName")
//                   .text(file.fileName);
//                 console.log(
//                   $("#fileupload" + uploadIndex)
//                     .parents(".file-tab")
//                     .find("span.fileName")
//                     .text(file.fileName)
//                 );
//                 if (data.originalFiles[0]["type"] == "application/pdf") {
//                   $("#fileupload" + uploadIndex)
//                     .parents(".file-tab")
//                     .find("img")
//                     .attr("src", PATH_FOLDER_IMAGE2 + "pdf.jpg");
//                 }
//                 if (uploadCategoryId == 34) {
//                   hideMessageErrorNew("fileupload1Error", "fileupload1");
//                 }
//               } else if (uploadMethodType == 3) {
//                 $("#fileupload" + uploadIndex)
//                   .parent("span")
//                   .parent("p")
//                   .parent("div")
//                   .find("i")
//                   .addClass("fa fa-check-circle-o");
//                 $("#fileupload" + uploadIndex)
//                   .parent("span")
//                   .parent("p")
//                   .parent("div")
//                   .find("h1")
//                   .attr("style", "color:green");
//                 $("#fileupload" + uploadIndex)
//                   .parent("span")
//                   .parent("p")
//                   .parent("div")
//                   .find("span.fileName")
//                   .html(file.fileName);
//                 $("#fileupload" + uploadIndex)
//                   .parent("span")
//                   .parent("p")
//                   .find("a.view")
//                   .next("a.remove")
//                   .attr(
//                     "href",
//                     'javascript:removeDocument("' +
//                       uploadIndex +
//                       '","' +
//                       uploadMethodType +
//                       '");'
//                   );
                // $("#fileupload" + uploadIndex)
                //   .parent("span")
                //   .parent("p")
                //   .find("a.view")
                //   .next("a.remove")
                //   .attr("style", "display:block;");
                // $("#fileupload" + uploadIndex)
                //   .parent("span")
                //   .parent("p")
                //   .find("a.view")
                //   .attr("style", "display:block;");
//                 if (data.originalFiles[0]["type"] == "application/pdf") {
//                   $("#fileupload" + uploadIndex)
//                     .parent("span")
//                     .parent("p")
//                     .find("a.view")
//                     .attr("target", "_blank");
//                   $("#fileupload" + uploadIndex)
//                     .parent("span")
//                     .parent("p")
//                     .find("a.view")
//                     .attr("href", FILE_UPLOAD_PATH + file.fileName);
//                 } else {
//                   $("#fileupload" + uploadIndex)
//                     .parent("span")
//                     .parent("p")
//                     .find("a.view")
//                     .attr("target", "_self");
//                   $("#fileupload" + uploadIndex)
//                     .parent("span")
//                     .parent("p")
//                     .find("a.view")
//                     .attr(
//                       "href",
//                       'javascript:showDocument("' +
//                         FILE_UPLOAD_PATH +
//                         file.fileName +
//                         '");'
//                     );
//                 }
//               } else if (uploadMethodType == 4) {
//                 $("#fileName" + uploadIndex).html(file.fileName);
//                 $("#deleteDocument" + uploadIndex).attr(
//                   "href",
//                   'javascript:removeDocument("' +
//                     uploadIndex +
//                     '","' +
//                     uploadMethodType +
//                     '");'
//                 );
//                 //							$('#deleteDocument'+uploadIndex).attr('style','display:block;');
//                 //							$('#showDocument'+uploadIndex).attr('style','display:block;');
//                 $("#divdeleteDocument" + uploadIndex).attr(
//                   "style",
//                   "display:block;"
//                 );
//                 $("#divshowDocument" + uploadIndex).attr(
//                   "style",
//                   "display:block;"
//                 );
//                 if (data.originalFiles[0]["type"] == "application/pdf") {
//                   $("#showDocument" + uploadIndex).attr("target", "_blank");
//                   $("#showDocument" + uploadIndex).attr(
//                     "href",
//                     FILE_UPLOAD_PATH + file.fileName
//                   );
//                 } else {
//                   $("#showDocument" + uploadIndex).attr("target", "_self");
//                   $("#showDocument" + uploadIndex).attr(
//                     "href",
//                     'javascript:showDocument("' +
//                       FILE_UPLOAD_PATH +
//                       file.fileName +
//                       '");'
//                   );
//                 }
//               } else if (uploadMethodType == 5) {
//                 $("#fileupload" + uploadIndex + "img").attr(
//                   "fileName",
//                   file.fileName
//                 );
//                 $("#fileupload" + uploadIndex + "img").attr(
//                   "href",
//                   'javascript:removeDocument("' +
//                     uploadIndex +
//                     '","' +
//                     uploadMethodType +
//                     '");'
//                 );
//                 if (data.originalFiles[0]["type"] == "application/pdf") {
//                   $("#fileupload" + uploadIndex + "img").addClass("full mt-1");
//                   $("#fileupload" + uploadIndex + "img").attr(
//                     "target",
//                     "_blank"
//                   );
//                   $("#fileupload" + uploadIndex + "img").attr(
//                     "href",
//                     FILE_UPLOAD_PATH + file.fileName
//                   );
//                   //								$('#fileupload'+uploadIndex+'imgIcon').attr('src',PATH_FOLDER_IMAGE2+'pdf.jpg');
//                   setTimeout(function () {
//                     $("#fileupload" + uploadIndex + "imgIcon").attr(
//                       "src",
//                       PATH_FOLDER_IMAGE2 + "pdf.jpg"
//                     );
//                   }, 3000);
//                 } else {
//                   $("#fileupload" + uploadIndex + "img").addClass("full mt-1");
//                   $("#fileupload" + uploadIndex + "img").attr(
//                     "target",
//                     "_self"
//                   );
//                   $("#fileupload" + uploadIndex + "img").attr(
//                     "href",
//                     'javascript:showDocument("' +
//                       FILE_UPLOAD_PATH +
//                       file.fileName +
//                       '");'
//                   );
//                   setTimeout(function () {
//                     $("#fileupload" + uploadIndex + "imgIcon").attr(
//                       "src",
//                       FILE_UPLOAD_PATH + file.fileName
//                     );
//                   }, 3000);
//                 }
//                 //$('#fileupload'+uploadIndex+'div').hide();
//               } else if (uploadMethodType == 6) {
//                 $("#fileupload" + uploadIndex + "Span").html(file.fileName);
//               }
//             }
//           });
//         }
//       },
//       progressall: function (e, data) {
//         console.log("progressall");
//         if (uploadMethodType == 1) {
//           $("#fileupload" + uploadIndex + "ProgressStatus")
//             .removeClass("label-error")
//             .addClass("fa fa-check-circle green");
//           //var progress = parseInt(data.loaded / data.total * 100, 10);
//           $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
//             "width",
//             100 + "%"
//           );
//         } else if (uploadMethodType == 2) {
//         } else if (uploadMethodType == 3) {
//         } else if (uploadMethodType == 4) {
//         }
//       },
//       fail: function (e, data) {
//         console.log("fail");
//         //			console.log(uploadIndex+' fail '+e+" = "+data);
//         //			console.log(uploadIndex+' fail '+index+" = "+file+' == '+file.name);
//         if (uploadMethodType == 1) {
//           //$('#fileupload'+uploadIndex+'Progress .progress-bar').css('width', 100 + '%');
//           $("#fileupload" + uploadIndex + "ProgressStatus").addClass(
//             "label-error"
//           );
//           showMessage(true, MAX_SIZE_LIMIT);
//         } else if (uploadMethodType == 2) {
//           $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
//             "width",
//             100 + "%"
//           );
//           $("#fileupload" + uploadIndex + "ProgressStatus")
//             .removeClass("progress-bar-success")
//             .addClass("progress-bar-danger");
//         } else if (uploadMethodType == 3) {
//           $("#fileupload" + uploadIndex)
//             .parent("span")
//             .parent("p")
//             .parent("div")
//             .find("i")
//             .addClass("fa fa-close");
//           $("#fileupload" + uploadIndex)
//             .parent("span")
//             .parent("p")
//             .parent("div")
//             .find("h1")
//             .attr("style", "color:red");
//           $("#fileupload" + uploadIndex)
//             .parent("span")
//             .parent("p")
//             .parent("div")
//             .find("span.fileName")
//             .html("");
//           $("#fileupload" + uploadIndex)
//             .parent("span")
//             .parent("p")
//             .find("a.view")
//             .next("a.remove")
//             .attr("style", "display:none;");
//           $("#fileupload" + uploadIndex)
//             .parent("span")
//             .parent("p")
//             .find("a.view")
//             .attr("style", "display:none;");
//         }
//         showMessage(true, MAX_SIZE_LIMIT);
//       },
//     })
//     .prop("disabled", !$.support.fileInput)
//     .parent()
//     .addClass($.support.fileInput ? undefined : "disabled");
// }
function bindFileUploadForCSV(uploadIndex, uploadStudentId, uploadStandardId) {
  var data = {};
  data["uploadStudentId"] = uploadStudentId;
  data["uploadStandardId"] = uploadStandardId;
  $("#fileupload" + uploadIndex)
    .fileupload({
      formData: { payload: JSON.stringify(getFinalValue(data)) },
      url:
        BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/upload-csv/" + UNIQUEUUID,
      dataType: "json",
      type: "POST",
      enctype: "multipart/form-data",
      global: false,
      add: function (e, data) {
        var uploadErrors = [];
        //application/vnd.ms-excel - text/csv
        var acceptFileTypesApplication = /^application\/vnd.ms-excel$/i;
        var acceptFileTypesText = /^text\/csv$/i;
        var isError = false;
        // console.log(
        //   "bindFileUploadForCSV type: " + data.originalFiles[0]["type"]
        // );
        if (
          data.originalFiles[0]["type"].length &&
          (acceptFileTypesApplication.test(data.originalFiles[0]["type"]) ||
            acceptFileTypesText.test(data.originalFiles[0]["type"]))
        ) {
        } else {
          isError = true;
        }
        if (isError) {
          uploadErrors.push("Please upload files in following formats csv.");
        }
        if (
          data.originalFiles.length &&
          data.originalFiles[0]["size"] > 10485760
        ) {
          uploadErrors.push("Please upload maximum 10MB file in size.");
          isError = true;
        }
        if (uploadErrors.length > 0) {
          showMessageTheme2(0, uploadErrors.join("\n"));
          return false;
        }
        data.process().done(function () {
          data.submit();
        });
      },
      start: function (e) {
        customLoader(false);
        $("#fileupload" + uploadIndex + "Span").html("");
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          0 + "%"
        );
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("progress-bar-success")
          .removeClass("progress-bar-danger");
      },
      send: function (e, data) {
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          5 + "%"
        );
      },
      done: function (e, data) {
        customLoader(false);
        if (data.result.status == 0) {
          $("#fileupload" + uploadIndex + "ProgressStatus")
            .removeClass("progress-bar-success")
            .addClass("progress-bar-danger");
        } else {
          $.each(data.result.uploadFiles, function (index, file) {
            if (file.status == 1) {
              var removeClassName = "";
              $("#fileupload" + uploadIndex + "ChoosenFile").html(
                file.fileName
              );
              $("#fileupload" + uploadIndex + "Hash").val(file.hash);
              fileupload1Hash;
              $("#fileupload" + uploadIndex + "Response").removeClass(
                removeClassName
              );
              $("#fileupload" + uploadIndex + "Response")
                .removeClass("label-error")
                .addClass("fa fa-check-circle green");
              if ($("#fileupload" + uploadIndex + "Span").html() == "") {
                $("#fileupload" + uploadIndex + "Span").html(file.fileName);
              } else {
                $("#fileupload" + uploadIndex + "Span").html(
                  $("#fileupload" + uploadIndex + "Span").html() +
                    "," +
                    file.fileName
                );
              }
            }
          });
        }
      },
      progressall: function (e, data) {
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("label-error")
          .addClass("fa fa-check-circle green");
        //var progress = parseInt(data.loaded / data.total * 100, 10);
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          100 + "%"
        );
      },
      fail: function (e, data) {
        $("#fileupload" + uploadIndex + "ProgressStatus").addClass(
          "label-error"
        );
        showMessageTheme2(0, MAX_SIZE_LIMIT);
      },
    })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput ? undefined : "disabled");
}
function bindFileUploadForPDF(uploadIndex, uploadUserId) {
  var data = {};
  data["uploadUserId"] = uploadUserId;
  $("#fileupload" + uploadIndex)
    .fileupload({
      formData: { payload: JSON.stringify(getFinalValue(data)) },
      url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/upload/" + UNIQUEUUID,
      dataType: "json",
      type: "POST",
      enctype: "multipart/form-data",
      global: false,
      add: function (e, data) {
        var uploadErrors = [];
        var acceptFileTypesPDF = /^application\/pdf$/i;
        var isError = false;
        if (
          data.originalFiles[0]["type"].length &&
          acceptFileTypesPDF.test(data.originalFiles[0]["type"])
        ) {
        } else {
          isError = true;
        }
        if (isError) {
          uploadErrors.push("Please upload files in pdf format.");
        }
        // console.log("originalFiles size" + data.originalFiles[0]["size"]);
        if (
          data.originalFiles.length &&
          data.originalFiles[0]["size"] > 5242880
        ) {
          uploadErrors.push(MAX_SIZE_LIMIT);
          isError = true;
        }
        if (uploadErrors.length > 0) {
          isError = true;
          showMessageTheme2(0, uploadErrors.join("\n"));
          return false;
        }
        data.process().done(function () {
          data.submit();
        });
      },
      start: function (e) {
        customLoader(true);
        $("#fileupload" + uploadIndex + "Span").html("");
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          0 + "%"
        );
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("progress-bar-success")
          .removeClass("progress-bar-danger");
      },
      send: function (e, data) {
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          5 + "%"
        );
      },
      done: function (e, data) {
        customLoader(false);
        if (data.result.status == 0 || data.result.status == 3) {
          $("#fileupload" + uploadIndex + "ProgressStatus")
            .removeClass("progress-bar-success")
            .addClass("progress-bar-danger");
          if (
            data.result.message.includes("Your session has been timed out") ||
            data.result.status == 3
          ) {
            redirectLoginPage();
          }
        } else {
          $.each(data.result.uploadFiles, function (index, file) {
            if (file.status == 1) {
              var removeClassName = "";
              $("#fileupload" + uploadIndex + "ChoosenFile").html(
                file.fileName
              );
              $("#fileupload" + uploadIndex + "Hash").val(file.hash);
              //						fileupload1Hash
              $("#fileupload" + uploadIndex + "Response").removeClass(
                removeClassName
              );
              $("#fileupload" + uploadIndex + "Response")
                .removeClass("label-error")
                .addClass("fa fa-check-circle green");
              if ($("#fileupload" + uploadIndex + "Span").html() == "") {
                $("#fileupload" + uploadIndex + "Span").html(file.fileName);
              } else {
                $("#fileupload" + uploadIndex + "Span").html(
                  $("#fileupload" + uploadIndex + "Span").html() +
                    "," +
                    file.fileName
                );
              }
            }
          });
        }
      },
      progressall: function (e, data) {
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("label-error")
          .addClass("fa fa-check-circle green");
        //var progress = parseInt(data.loaded / data.total * 100, 10);
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          100 + "%"
        );
      },
      fail: function (e, data) {
        $("#fileupload" + uploadIndex + "ProgressStatus").addClass(
          "label-error"
        );
        showMessageTheme2(0, MAX_SIZE_LIMIT);
      },
    })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput ? undefined : "disabled");
}

function removeDocument(uploadIndex, uploadMethodType) {
  // console.log(uploadIndex);
  if (uploadMethodType == 1) {
  } else if (uploadMethodType == 2) {
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("div")
      .find(".view-upload")
      .hide();
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("div")
      .find(".delete-upload")
      .hide();
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("div")
      .find(".error-msg")
      .removeClass("show-errow-msg");
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("div")
      .find(".error-msg")
      .addClass("show-errow-msg")
      .html("Document Deleted Successfuly");
    setTimeout(function () {
      $("#fileupload" + uploadIndex)
        .parent("span")
        .parent("div")
        .find(".error-msg")
        .html("");
    }, 1500);
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("div")
      .find("a.view")
      .attr("href", "javascript:void(0)");
    $("#fileupload" + uploadIndex).addClass("w100");
    // console.log(
    //   "delete docs" +
    //     $("#fileupload" + uploadIndex)
    //       .parent("span")
    //       .parent("div")
    //       .find("a.view")
    //       .attr("href", "javascript:void(0)")
    // );
  } else if (uploadMethodType == 3) {
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .find("a.view")
      .hide();
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .find("a.view")
      .next("a.remove")
      .hide();
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .parent("div")
      .find("span.fileName")
      .html("");
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .parent("div")
      .find("i")
      .removeClass("fa-check-circle-o");
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .parent("div")
      .find("i")
      .removeClass("fa-close");
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .parent("div")
      .find("h1")
      .removeAttr("style");
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .parent("div")
      .find("a.view")
      .attr("href", "");
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .parent("div")
      .find("a.remove")
      .attr("href", "");
    // console.log(
    //   "delete docs" +
    //     $("#fileupload" + uploadIndex)
    //       .parent("span")
    //       .parent("p")
    //       .parent("div")
    //       .find("a.remove")
    //       .attr("href", "")
    // );
  } else if (uploadMethodType == 4) {
    $("#fileName" + uploadIndex).html("");
    $("#divdeleteDocument" + uploadIndex).attr("style", "display:none;");
    $("#divshowDocument" + uploadIndex).attr("style", "display:none;");
  }
}
//convert serialize object to json
function getJSONRequest(formId, isMulitSelect) {
  $(".disabledFields").each(function () {
    $(this).removeAttr("disabled");
  });
  var serializedString = $("#" + formId).serialize();
  // console.log("serializedString " + serializedString);
  $(".disabledFields").each(function () {
    $(this).attr("disabled", "disabled");
  });
  serializedString = serializedString.replace(/\+/g, "%20");
  var formFieldArray = serializedString.split("&");
  var requestObj = {};
  $.each(formFieldArray, function (i, pair) {
    var nameValue = pair.split("=");
    if (nameValue[1] != "") {
      var name = nameValue[0];
      var value = escapeCharacters(nameValue[1]);
      // console.log("name " + name);
      // console.log(" value " + value);
      // console.log("original Value " + nameValue[1]);
      requestObj[name] = value;
    }
  });
  //	$.each(formFieldArray, function(i, pair) {
  //		var nameValue = pair.split("=");
  //		if(nameValue[1]!=''){
  //			var name = decodeURIComponent(nameValue[0]);
  //			var value = decodeURIComponent(nameValue[1]);
  //			requestObj[name] = value;
  //		}
  //	});
  if (isMulitSelect != undefined) {
    var name = decodeURIComponent("teacherSubjectIds");
    if (
      $("#teacherSubjectIds").val().trim() != "null" &&
      $("#teacherSubjectIds").val().trim() != null &&
      $("#teacherSubjectIds").val().trim() != ""
    ) {
      var value = decodeURIComponent($("#teacherSubjectIds").val().trim());
    }
    requestObj[name] = value;

    var name1 = decodeURIComponent("teacherPlacementSubjectIds");
    if (
      $("#teacherPlacementSubjectIds").val().trim() != "null" &&
      $("#teacherPlacementSubjectIds").val().trim() != null &&
      $("#teacherPlacementSubjectIds").val().trim() != ""
    ) {
      var value1 = decodeURIComponent(
        $("#teacherPlacementSubjectIds").val().trim()
      );
    }
    requestObj[name1] = value1;
  }
  // console.log("requestObj " + requestObj);
  return requestObj;
}
function callSubjectsByGradeId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra,
  requestExtra1,
  requestExtra2
) {
  hideMessage("");
  if (
    typeof isDummyStudentMode === "function" &&
    isDummyStudentMode() &&
    typeof getDummySubjectOptionsByGrade === "function"
  ) {
    buildDropdown(
      getDummySubjectOptionsByGrade(value),
      $("#" + formId + " #" + toElementId),
      "Select course"
    );
    return;
  }
  //	if (!validateRequestForMasterGrade(formId, elementId)) {
  //		$("#"+formId+" #"+elementId).val().trim(0);
  //		return false;
  //	}
  //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "SUBJECT-LIST-BY-GRADE",
        value,
        requestExtra,
        requestExtra1,
        requestExtra2
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["subject"],
          $("#" + formId + " #" + toElementId),
          "Select course"
        );
        //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
      }
      //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
    }
  });
}

function callSubjectsByCategoryAndGradeId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra,
  requestExtra1,
  requestExtra2
) {
  hideMessage("");
  //	if (!validateRequestForMasterGrade(formId, elementId)) {
  //		$("#"+formId+" #"+elementId).val().trim(0);
  //		return false;
  //	}
  //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "SUBJECT-LIST-BY-COURSE-CATEGORY-GRADE",
        value,
        requestExtra,
        requestExtra1,
        requestExtra2
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["subject"],
          $("#" + formId + " #" + toElementId),
          "Select course category"
        );
        //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
      }
      //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
    }
  });
}


function callCourseCategoryByGradeId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra,
  requestExtra1,
  requestExtra2
) {
  hideMessage("");
  //	if (!validateRequestForMasterGrade(formId, elementId)) {
  //		$("#"+formId+" #"+elementId).val().trim(0);
  //		return false;
  //	}
  //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "COURSE-CATEGORY-BY-GRADE",
        value,
        requestExtra,
        requestExtra1,
        requestExtra2
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["subject"],
          $("#" + formId + " #" + toElementId),
          "Select course category"
        );
        //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
      }
      //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
    }
  });
}

//function callPlacementSubjectsByGradeId(formId, value, elementId, toElementId, requestExtra) {
//	hideMessage('');
//	resetDropdown($("#"+formId+" #"+toElementId), 'Select course');
//	if (!validateRequestForMasterGrade(formId, elementId)) {
//		$("#"+formId+" #"+elementId).val(0);
//		//resetDropdown($("#"+formId+" #"+elementId), 'Select course');
//		return false;
//	}
//	$("#"+formId+" #pastTaughtSubjectId").prop("disabled", true);
//	$.ajax({
//		type : "POST",
//		contentType : "application/json",
//		url : getURLForCommon('masters'),
//		data : JSON.stringify(getRequestForMaster(formId, 'PLACEMENT-SUBJECT-LIST-BY-GRADE', value, requestExtra)),
//		dataType : 'json',
//		cache : false,
//		timeout : 600000,
//		async: false,
//		success : function(data) {
//			if (data['status'] == '0' || data['status'] == '2') {
//				showMessageTheme2(1, data['message']);
//			} else {
//				buildDropdown(data['mastersData']['subject'], $("#"+formId+" #"+toElementId), 'Select course');
//				$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
//			}
//			$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
//		},
//		error : function(e) {
//		//	showMessageTheme2(1, e.responseText);
//			$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
//		}
//	});
//}

function callBothSubjectAndPlacementSubjectsByGrade(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra1,
  requestExtra2
) {
  hideMessage("");
  resetDropdown($("#" + formId + " #" + toElementId), "Select course");
  if (!validateRequestForMasterGrade(formId, elementId)) {
    $("#" + formId + " #" + elementId)
      .val()
      .trim(0);
    //resetDropdown($("#"+formId+" #"+elementId), 'Select course');
    return false;
  }

  // console.log("Subject Id : " + requestExtra1);
  // console.log("Placement Subject Id : " + requestExtra2);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "BOTH-SUBJECT-AND-PLACEMENT-SUBJECT",
        value,
        requestExtra1,
        requestExtra2
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(1, data["message"]);
      } else {
        // console.log("Response Data  " + data);
        $("#" + formId + " #" + toElementId).html(
          '<option value="">Select Course</option>'
        );
        $.each(data["mastersData"]["subject"], function (k, v) {
          $("#" + formId + " #" + toElementId).append(
            '<option courseType="' +
              v.extra +
              '" value="' +
              v.key +
              '">' +
              v.value +
              "</option>"
          );
        });
      }
    }
  });
}

function callTeacherSubjectsByGradeId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra
) {
  hideMessage("");
  resetDropdown($("#" + formId + " #" + toElementId), "Select course");
  if (!validateRequestForMasterGrade(formId, elementId)) {
    $("#" + formId + " #" + elementId)
      .val()
      .trim(0);
    //resetDropdown($("#"+formId+" #"+elementId), 'Select course');
    return false;
  }
  $("#" + formId + " #pastTaughtSubjectId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "TEACHER_SUBJECT-LIST-BY-GRADE",
        value,
        requestExtra
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["teacherSubject"],
          $("#" + formId + " #" + toElementId),
          "Select course"
        );
        $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
      }
      $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
    }
  });
}
function callTeacherTaughtSubjects(formId, value, elementId, flag) {
  hideMessage("");
  $.ajax({
    global: flag,
    type: "POST",
    url: getURLForHTML("dashboard", "teacher-subject-List"),
    data: "value=" + value + "&elementId=" + elementId,
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          showMessageTheme2(1, stringMessage[1]);
        } else {
          $("#teacherTaughtSubjectContent").html(htmlContent);
        }
        //return false;
      }
    }
  });
}
function callTeacherPreferredSubjects(formId, value, elementId, flag) {
  hideMessage("");
  $.ajax({
    global: flag,
    type: "POST",
    url: getURLForHTML("dashboard", "teacher-preferred-subject-List"),
    data: "value=" + value + "&elementId=" + elementId,
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          showMessageTheme2(1, stringMessage[1]);
        } else {
          $("#teacherPreferredSubjectsContent").html(htmlContent);
        }
        //return false;
      }
    }
  });
}

function validateRequestForMasterGrade(formId, elementId, toElementId) {
  // console.log(
  //   "element=>" +
  //     $("#" + formId + " #" + elementId)
  //       .val()
  //       .trim()
  // );
  if (
    $("#" + formId + " #" + elementId).val() == null ||
    $("#" + formId + " #" + elementId)
      .val()
      .trim() == "" ||
    $("#" + formId + " #" + elementId)
      .val()
      .trim() == 0
  ) {
    return false;
  }
  return true;
}

function callTeacherEventSubjectsByGradeId(
  formId,
  value,
  toElementId,
  requestExtra
) {
  hideMessage("");
  resetDropdown($("#" + formId + " #" + toElementId), "Select course");
  $("#" + formId + " #pastTaughtSubjectId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "TEACHER_EVENT_SUBJECT-LIST",
        value,
        requestExtra
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["teacherEventSubject"],
          $("#" + formId + " #" + toElementId),
          "Select course"
        );
        $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
      }
      $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
    }
  });
}

function getRequestForMaster(
  formId,
  key,
  value,
  requestExtra,
  requestExtra1,
  requestExtra2,
  requestExtraRemarks,
  requestExtra4,
  requestExtra5
) {
  var request = {};
  var authentication = {};
  var requestData = {};
  requestData["requestKey"] = key;
  requestData["requestValue"] = value;
  if (requestExtra != undefined) {
    requestData["requestExtra1"] = requestExtra;
  }
  if (requestExtra1 != undefined) {
    requestData["requestExtra2"] = requestExtra1;
  }
  //New line add by mayank
  if (requestExtra2 != undefined) {
    requestData["requestExtra3"] = requestExtra2;
  }
  //New line add by mayank
  if (requestExtraRemarks != undefined || requestExtraRemarks != "") {
    if (formId == "recurringClass") {
      requestData["requestExtraTime"] = requestExtraRemarks;
    } else {
      requestData["requestExtraRemarks"] = requestExtraRemarks;
    }
  }
  if (requestExtra4 != undefined && requestExtra4 != "") {
    requestData["requestExtra4"] = requestExtra4;
  }
  if (requestExtra5 != undefined || requestExtra5 != "") {
    requestData["requestExtra"] = requestExtra5;
  }
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "COMMON";
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function customLoaderPreview(needToShow) {
  if (needToShow) {
    $("#commonloaderId1").removeClass("hide");
    $("#commonloaderBody1").addClass("loader");
    $("#commonloaderId1").addClass("loader-bg");
    $("#commonloaderId1").show();
  } else {
    $("#commonloaderBody1").removeClass("loader");
    $("#commonloaderId1").removeClass("loader-bg");
    $("#commonloaderId1").addClass("hide");
    $("#commonloaderId1").hide();
  }
}
function showDocument(imagePath) {
  customLoader(true);
  if (!imagePath) {
    customLoader(false);
    return;
  }
  var resolvedPath = String(imagePath).trim();
  // Ensure URLs with spaces/special chars load correctly.
  if (resolvedPath.indexOf("http://") === 0 || resolvedPath.indexOf("https://") === 0) {
    try {
      resolvedPath = encodeURI(resolvedPath);
    } catch (e) {
      resolvedPath = resolvedPath.replace(/ /g, "%20");
    }
  }
  $("#documentPreview").attr("src", "");
  $("#documentPreview").attr("src", resolvedPath);
  $("#documentPreviewModal").modal("show");
  window.setTimeout(function () {
    customLoader(false);
  }, 1000);
}

history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};
function showSubjectCatalog(subjectId, courseType) {
  $.ajax({
    type: "POST",
    url: getURLForHTML("student", "course-catalog"),
    data: "subjectId=" + subjectId + "&courseType=" + courseType,
    dataType: "html",
    cache: false,
    async: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION") {
          showMessageTheme2(1, stringMessage[1]);
        } else {
          //        			$('#subjectCatalogModalContent').html('');
          $("#subjectCatalogModalContent").html(htmlContent);
          $("#subjectCatalogModal").modal("show");
        }
      }
      return false;
    }
  });
}
function showWarningMessage(warningMessage, functionName) {
  // console.log(warningMessage);
  if (functionName == "") {
    $("#resetDeleteErrorWarningYes").hide();
    $("#resetDeleteErrorWarningNo").hide();
    $("#resetDeleteErrorWarningCancel*").show();
  } else {
    $("#resetDeleteErrorWarningYes").show();
    $("#resetDeleteErrorWarningNo").show();
    $("#resetDeleteErrorWarningCancel*").hide();
  }
  if (warningMessage == "Are you sure you want to avail Extension-1?") {
    $("#remarksresetDelete .modal-header")
      .removeClass("bg-danger")
      .addClass("bg-info");
    $("#statusMessage-1 i").removeClass("fa-times");
    $("#statusMessage-1 i").addClass("fa-check");
    $("#statusMessage-1 i").css({ color: "#57abff" });
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningYes")
      .removeClass("btn-outline-danger")
      .addClass("btn-outline-info");
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningNo")
      .removeClass("btn-danger")
      .addClass("btn-info");
  } else if (warningMessage == "Are you sure you want to delete?") {
    $("#remarksresetDelete .modal-header")
      .removeClass("bg-info")
      .addClass("bg-danger");

    $("#statusMessage-1 i").removeClass("fa-lock");
    $("#statusMessage-1 i").addClass("text-danger");
    $("#statusMessage-1 i").addClass("fa-times");

    $("#statusMessage-1 i").css({ color: "#57abff" });
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningYes")
      .removeClass("btn-outline-info")
      .addClass("btn-outline-danger");
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningNo")
      .removeClass("btn-info")
      .addClass("btn-danger");
  } else if (
    warningMessage.indexOf(
      "Are you sure want to lock your availability till"
    ) != -1
  ) {
    $("#remarksresetDelete .modal-header")
      .removeClass("bg-danger")
      .addClass("bg-info");
    $("#statusMessage-1 i").removeClass("fa-times");
    $("#statusMessage-1 i").removeClass("text-danger");
    $("#statusMessage-1 i").addClass("fa-lock");
    $("#statusMessage-1 i").css({ color: "#57abff" });
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningYes")
      .removeClass("btn-outline-danger")
      .addClass("btn-outline-info");
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningNo")
      .removeClass("btn-danger")
      .addClass("btn-info");
  } else if (
    warningMessage.indexOf("You have added more available times for ") != -1
  ) {
    $("#remarksresetDelete .modal-header")
      .removeClass("bg-danger")
      .addClass("bg-info");
    $("#statusMessage-1 i").removeClass("fa-times");
    $("#statusMessage-1 i").removeClass("text-danger");
    $("#statusMessage-1 i").addClass("fa-lock");
    $("#statusMessage-1 i").css({ color: "#57abff" });
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningYes")
      .removeClass("btn-outline-danger")
      .addClass("btn-outline-info");
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningNo")
      .removeClass("btn-danger")
      .addClass("btn-info");
  } else if (
    warningMessage.indexOf(
      "Are you sure you want to skip your school system training?"
    ) != -1
  ) {
    $("#statusMessage-1").html(
      '<svg xmlns="http://www.w3.org/2000/svg" width="70px" fill="#d92550" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>'
    );
  }else if(warningMessage == "Are you sure you want to send credentials email to student?"){
    $("#remarksresetDelete .modal-header")
      .removeClass("bg-danger")
      .addClass("bg-info");
    $("#statusMessage-1 i").removeClass("fa-times");
    $("#statusMessage-1 i").removeClass("text-danger");
    $("#statusMessage-1 i").addClass("fa-envelope");
    $("#statusMessage-1 i").css({ color: "#57abff" });
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningYes")
      .removeClass("btn-outline-danger")
      .addClass("btn-outline-info");
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningNo")
      .removeClass("btn-danger")
      .addClass("btn-info");
  }

  functionName = "$('#remarksresetDelete').modal('hide');" + functionName + ";";
  $("#warningMessage").html(warningMessage);
  $("#resetDeleteErrorWarningYes").attr("onclick", functionName);
  $("#remarksresetDelete").modal("show");
}
function sendAnnouncementWarning(message, functionName) {
  $("body").append(getWaringContent1());
  $("#resetDeleteErrorWarningYes1").show();
  $("#resetDeleteErrorWarningNo1").show();
  $("#resetDeleteErrorWarningCancel1").hide();
  $("#remarksresetDelete1Icon").removeAttr("class");
  $("#remarksresetDelete1Icon").attr("class", "fa fa-envelope fa-4x");
  functionName = "$('#remarksresetDelete1').modal('hide');" + functionName + ";";
  $("#warningMessage1").html(message);
  $("#resetDeleteErrorWarningYes1").attr("onclick", functionName);
  $("#remarksresetDelete1").modal("show");
}
function sendHolidayActivWarning(message, functionName) {
  $("#resetDeleteErrorWarningYes1").show();
  $("#resetDeleteErrorWarningNo1").show();
  $("#resetDeleteErrorWarningCancel1").hide();
  $("#remarksresetDelete1Icon").removeAttr("class");
  $("#remarksresetDelete1Icon").attr("class", "fa fa-ban fa-4x");
  functionName =
    "$('#remarksresetDelete1').modal('hide');" + functionName + ";";
  $("#warningMessage1").html(message);
  $("#resetDeleteErrorWarningYes1").attr("onclick", functionName);
  $("#remarksresetDelete1").modal("show");
}
function showWarningMessageShow(warningMessage1, functionName1, bodyMsg) {
  $("#remarksresetDelete1").remove();
  $("body").append(getWaringContent1());
  if (bodyMsg == "info-modal-sm") {
    if ($("#remarksresetDelete2").length < 1) {
      $("body #schoolReportContent").append(
        deleteWarning(warningMessage1, functionName1)
      );
    }

    if (functionName1 == "") {
      $("#resetDeleteErrorWarningYes2").hide();
      $("#resetDeleteErrorWarningNo2").hide();
      $("#resetDeleteErrorWarningCancel2").show();
    } else {
      $("#resetDeleteErrorWarningYes2").show();
      $("#resetDeleteErrorWarningNo2").show();
      $("#resetDeleteErrorWarningCancel2").hide();
    }
    functionName1 =
      "$('#remarksresetDelete2').modal('hide');" + functionName1 + ";";
    $("#warningMessage2").html(warningMessage1);
    if (bodyMsg !== "info-modal-sm") {
      var strText =
        "Please note that any recurring class created for this student will be deactivated after the student is withdrawn. If for any reason the class is not deactivated, kindly do the same from the Recurring Class menu";
      $("#statusMessage-2").html(strText);
    } else {
      $("#statusMessage-2").html('<i class="fas fa-sync fa-4x text-info"></i>');
    }
    $("#resetDeleteErrorWarningYes2").attr("onclick", functionName1);
    $("#remarksresetDelete2").modal("show");
  } else {
    if (functionName1 == "") {
      $("#resetDeleteErrorWarningYes1").hide();
      $("#resetDeleteErrorWarningNo1").hide();
      $("#resetDeleteErrorWarningCancel1").show();
    } else {
      $("#resetDeleteErrorWarningYes1").show();
      $("#resetDeleteErrorWarningNo1").show();
      $("#resetDeleteErrorWarningCancel1").hide();
    }
    functionName1 =
      "$('#remarksresetDelete1').modal('hide');" + functionName1 + ";";
    $("#warningMessage1").html(warningMessage1);
    if (bodyMsg) {
      var strText =
        "Please note that any recurring class created for this student will be deactivated after the student is withdrawn. If for any reason the class is not deactivated, kindly do the same from the Recurring Class menu";
      $("#statusMessage-1").html(strText);
    } else {
      $("#statusMessage-1").html(
        '<i class="fa fa-sync fa-4x" style="color:#337ab7 !important;"></i>'
      );
    }
    $("#resetDeleteErrorWarningYes1").attr("onclick", functionName1);
    $("#remarksresetDelete1").modal("show");
  }
}

function selectSubjectNew(src, flag, applicableClass, counterCheck) {
  if (flag) {
    if (!$(src).hasClass("selected-course")) {
      $(src).addClass("selected-course");
      var selSubjectd = "";
      $("." + applicableClass).each(function () {
        if ($(this).hasClass("selected-course")) {
          selSubjectd = selSubjectd + "," + $(this).attr("id");
        }
      });
      selSubjectd = selSubjectd.substr(1);
      var choosenItems = selSubjectd.split(",").length;
      if (choosenItems <= parseInt(counterCheck)) {
      } else {
        $(src).removeClass("selected-course");
        showMessageTheme2(
          0,
          " You cannot select more than " + counterCheck + " courses.",
          "",
          true
        );
      }
    } else {
      $(src).removeClass("selected-course");
    }
  }
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function getISDCodeByCityAndCountry(
  cityName,
  countryName,
  elementId1,
  elementId2
) {
  var data = {};
  data["cityName"] = cityName;
  data["countryName"] = countryName;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url:
      BASE_URL +
      CONTEXT_PATH +
      SCHOOL_UUID +
      "/get-isdcode-by-city-and-country",
    data: JSON.stringify(getFinalValue(data)),
    dataType: "json",
    async: false,
    success: function (content) {
      var finalValue = content + " " + countryName;
      //			console.log('finalValue=>'+finalValue);
      if (elementId1 != "") {
        chooseValueByElement(elementId1, finalValue);
      }
      if (elementId2 != "") {
        chooseValueByElement(elementId2, finalValue);
      }
      chooseValueByElement("countryId", countryName);
      return content;
    },
  });
}
function chooseValueByElement(elementId, value) {
  if ($("#" + elementId).length) {
    $("#" + elementId + " option")
      .map(function () {
        var currentValue = $(this).text();
        //currentValue = currentValue.substr(0,currentValue.indexOf(' ')); // returns text before space
        currentValue = currentValue.substr(currentValue.indexOf(" ") + 1); // returns text after space
        if (currentValue === value) {
          return this;
        }
      })
      .attr("selected", "selected");
  }
}
function chooseTimezoneValueByElement(elementId, value) {
  if ($("#" + elementId).length) {
    $("#" + elementId + " option")
      .map(function () {
        var currentValue = $(this).text();
        //currentValue = currentValue.substr(0,currentValue.indexOf(' ')); // returns text before space
        currentValue = currentValue.substr(currentValue.indexOf("- ") + 1); // returns text after space
        currentValue = currentValue.substr(0, currentValue.indexOf("/"));
        //console.log('1. currentValue=>'+currentValue+', value=>'+value+', conditions=>'+(currentValue === value));
        if (currentValue.trim() === value) {
          return this;
        }
      })
      .attr("selected", "selected");
  }
}
function chooseCountryElement(elementId, value) {
  if ($("#" + elementId).length) {
    $("#" + elementId + " option")
      .map(function () {
        var currentValue = $(this).text();
        if (currentValue === value) {
          return this;
        }
      })
      .attr("selected", "selected");
    $("#" + elementId).trigger("change");
  }
}
function showPassWord(elementId, iconId) {
  var x = document.getElementById(elementId);
  var y = document.getElementById(iconId);
  if (!x.disabled) {
    if (x.type === "password") {
      x.type = "text";
      // this.class = "fa fa-eye";
      y.classList.remove("fa-eye-slash");
      y.classList.add("fa-eye");
    } else {
      x.type = "password";
      // y.class = "fa-eye-slash";
      y.classList.remove("fa-eye");
      y.classList.add("fa-eye-slash");
    }
  } else {
    return false;
  }
}
function renderIsdCode(formId, elementId, defaultCountryISOCode) {
  var element = "";
  if (formId != "") {
    element = "#" + formId + " #" + elementId;
  } else {
    element = "#" + elementId;
  }
  // console.log("element " + element);
  if (document.querySelector(element) != null) {
    var phoneNo = document.querySelector(element);
    iti = intlTelInput(phoneNo, {
      // allowDropdown: false,
      // autoHideDialCode: false,
      // autoPlaceholder: "off",
      // dropdownContainer: document.body,
      // excludeCountries: ["us"],
      // formatOnDisplay: false,
      // geoIpLookup: function(callback) {
      //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
      //     var countryCode = (resp && resp.country) ? resp.country : "";
      //     callback(countryCode);
      //   });
      // },
      // hiddenInput: "full_number",
      // initialCountry: "auto",
      // localizedCountries: { 'de': 'Deutschland' },
      // nationalMode: false,
      // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
      //placeholderNumberType: "MOBILE",
      //preferredCountries: ['in'],
      // separateDialCode: true,
      // utilsScript: "js/utils.js",
    });
    iti.setCountry(defaultCountryISOCode);
  }
  return iti;
}
function createSelect2Element(formId, elementId, placeholder) {
  if ($("#" + formId + " #" + elementId).hasClass("select2-hidden-accessible") ) {
    $("#" + formId + " #" + elementId).select2("destroy");
  }
  if(placeholder != undefined){
    $("#" + formId + " #" + elementId).select2({
      placeholder:placeholder,
    });
  }else{
    $("#" + formId + " #" + elementId).select2();
  }

}

function destroySelect2Element(formId, elementId) {
  if ($("#" + formId + " #" + elementId).hasClass("select2-hidden-accessible") ) {
    $("#" + formId + " #" + elementId).select2("destroy");
  }
}

$(document).ready(function () {
  $(".chat-message").hover(
    function () {
      $(".chat-message").css({
        background: "#2ebf51",
        "border-color": "#2ebf51",
      });
    },
    function () {
      $(".chat-message").css({
        background: "#1d963a",
        "border-color": "#0f9f13",
      });
    }
  );
  var window_width = $(window).outerWidth();
  //	function mobile_menu(){
  if (window_width < 991) {
    $(".vertical-nav-menu li a").click(function () {
      $(".closed-sidebar-mobile").removeClass("sidebar-mobile-open");
      $(".mobile-toggle-nav").removeClass("is-active");
    });
  }
  //	}

  //  for header script
  // $(".mobile-toggle-header-nav").click(function () {
  //   $(this).toggleClass("active");
  //  // $(".app-header__content").toggleClass("header-mobile-open");
  // });
  $(".mobile-toggle-nav").click(function () {
    if (!$(this).hasClass("is-active")) {
      $(".app-header__content").removeClass("header-mobile-open");
      $(".mobile-toggle-header-nav").removeClass("active");
    }
  });
  $(".mobile-toggle-header-nav").click(function () {
    if (!$(this).hasClass("active")) {
      $(".closed-sidebar-mobile").removeClass("sidebar-mobile-open");
      $(".mobile-toggle-nav").removeClass("is-active");
    }
  });
});

function getDatepickerChangeVal(src) {
  var dates = $(src).val();
  var splitDates = dates.split(/(\d{4})/).filter(Boolean);
  for (let i = 1; i < splitDates.length; i += 2) {
    splitDates[i - 1] += splitDates[i];
    splitDates.splice(i, 1);
  }
  $(src).val(splitDates[0]);
}

function copyToClipboardNew(originalValue) {
  $("#hiddenForCopy").attr("disabled", false);
  var copyText = document.getElementById("hiddenForCopy");
  copyText.value = originalValue;
  $(copyText).attr("type", "text").select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  $(copyText).attr("type", "hidden");
}

function copyToClipboardNew(elementId, messageElementId) {
  $("#" + elementId).attr("disabled", false);
  var copyText = document.getElementById(elementId);
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");

  if (document.queryCommandSupported("copy")) {
    var messageElement = $("#" + messageElementId);
    messageElement.text("Copied!");
    messageElement.css("display", "inline");
    messageElement.fadeIn(300).delay(3000).fadeOut(300);
  } else {
    alert("Copying is not supported in your browser.");
  }
}
// function copyToClipboard(elementId, showmsgEle) {
//   $("#" + elementId).attr("disabled", false);
//   var copyText = document.getElementById(elementId);
//   copyText.select();
//   copyText.setSelectionRange(0, 99999);
//   document.execCommand("copy");
//   $(showmsgEle).text("Copied");
//   $(showmsgEle).removeClass("btn-primary");
//   $(showmsgEle).addClass("btn-success");
// }

function copyToClipboard(elementId, showElement) {
  $("#" + elementId).attr("disabled", false);
  var copyText = document.getElementById(elementId);
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  if (document.queryCommandSupported("copy")) {
    $("#" + showElement).show();
    showMessageTheme2(1, "Copy Successfully");
  } else {
    alert("Copying is not supported in your browser.");
  }
}

function copyURL(eleID, msgEle, msg) {
  const copyURL = $("#" + eleID).val();
  if (msg == undefined) {
    msg = "Copied!";
  }
  if (copyURL && copyURL.length > 0) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        navigator.clipboard
          .writeText(copyURL)
          .then(() => {
            showCopyMessage(msgEle, msg, true);
          })
          .catch((error) => {
            console.error("Clipboard API failed:", error);
            fallbackCopyText(copyURL, msgEle);
          });
      } catch (err) {
        console.error("Clipboard API error:", err);
        fallbackCopyText(copyURL, msgEle);
      }
    } else {
      fallbackCopyText(copyURL, msgEle);
    }
  } else {
    console.error("No valid URL found to copy.");
    showCopyMessage(msgEle, "Invalid URL", false);
  }
}

// Fallback copy method using document.execCommand
function fallbackCopyText(text, msgEle) {
  // console.log("Using fallback copy method (execCommand).");

  const tempInput = document.createElement("input");
  tempInput.type = "text";
  tempInput.value = text;
  document.body.appendChild(tempInput);

  tempInput.select();
  tempInput.setSelectionRange(0, tempInput.value.length); // For mobile

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      // console.log("Copied successfully using execCommand.");
      showCopyMessage(msgEle, "Copied!", true);
    } else {
      console.error("execCommand failed.");
      showCopyMessage(msgEle, "Copy failed", false);
    }
  } catch (error) {
    console.error("execCommand error:", error);
    showCopyMessage(msgEle, "Copy failed", false);
  }

  document.body.removeChild(tempInput);
}

// Helper function to display success or error messages
function showCopyMessage(msgEle, message, success) {
  const messageElement = $("." + msgEle);
  messageElement
    .removeClass("text-success text-danger d-none")
    .addClass(success ? "text-success" : "text-danger")
    .text(message);

  // Clear the message after 3 seconds
  setTimeout(() => {
    messageElement.text("");
    messageElement.addClass("d-none");
  }, 3000);
}

function validationOfDate(stDate, edDate) {
  stDate = stDate.split("-");
  edDate = edDate.split("-");
  startTime = new Date(stDate[2], stDate[0] - 1, stDate[1]).getTime();
  endTime = new Date(edDate[2], edDate[0] - 1, edDate[1]).getTime();

  if (startTime > endTime) {
    mesg = "Report start date must be less than Report end date.";
    return mesg;
  }
  return "";
}
function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
}

function toSentenceCase(strSentense) {
  strSentense = strSentense.split(". ");
  for (var index = 0; index < strSentense.length; index++) {
    strSentense[index] =
      strSentense[index].charAt(0).toUpperCase() + strSentense[index].slice(1);
  }
  return strSentense.join(". ");
}
//mm dd, yyyy to desiredFormat
function changeDateFormat(date, dateFormat) {
  if ("mm-dd-yyyy" == dateFormat) {
    return (
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "-" +
      date.getFullYear()
    );
  } else if ("yyyy-mm-dd" == dateFormat) {
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate())
    );
  } else if ("yyyy-mm-dd hh:mm:ss" == dateFormat) {
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      " " +
      (date.getHours() > 9 ? date.getHours() : "0" + date.getHours()) +
      ":" +
      (date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()) +
      ":" +
      (date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds())
    );
  } else if ("MMM-dd-yyyy hh:mm:ss" == dateFormat) {
    return (
      M.months[date.getMonth()] +
      " " +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      ", " +
      date.getFullYear() +
      " " +
      (date.getHours() > 9 ? date.getHours() : "0" + date.getHours()) +
      ":" +
      (date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()) +
      ":" +
      (date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds())
    );
  } else if ("MMM dd, yyyy hh:mm:ss A" == dateFormat) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return (
      M.months[date.getMonth()] +
      " " +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      ", " +
      date.getFullYear() +
      " " +
      (hours > 9 ? hours : "0" + hours) +
      ":" +
      (minutes > 9 ? minutes : "0" + minutes) +
      ":" +
      (seconds > 9 ? seconds : "0" + seconds) +
      " " +
      ampm
    );
  } else if ("MMM dd, yyyy hh:mm A" == dateFormat) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return (
      M.months[date.getMonth()] +
      " " +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      ", " +
      date.getFullYear() +
      " " +
      (hours > 9 ? hours : "0" + hours) +
      ":" +
      (minutes > 9 ? minutes : "0" + minutes) +
      " " +
      ampm
    );
  } else if ("dd-mm-yyyy" == dateFormat) {
    return (
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "-" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      date.getFullYear()
    );
  } else if ("MMM-dd-yyyy" == dateFormat) {
    return (
      M.months[date.getMonth()] +
      " " +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      ", " +
      date.getFullYear()
    );
  } else if ("mm/dd/yyyy" == dateFormat) {
    return (
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "/" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "/" +
      date.getFullYear()
    );
  } else if ("DD MMM, YYYY" == dateFormat) {
    return (
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      " " +
      M.months[date.getMonth()].substring(0, 3) +
      ", " +
      date.getFullYear()
    );
  } 
  // Added DISPLAY_DATE_ONLY format
  else if ("MMM D, YYYY" == dateFormat) {
    return (
      M.months[date.getMonth()].substring(0, 3) +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear()
    );
  } else if ("MMM DD, YYYY" == dateFormat) {
    return (
      M.months[date.getMonth()].substring(0, 3) +
      " " +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate())  +
      ", " +
      date.getFullYear()
    );
  } 
  else {
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate())
    );
  }
}
function getDateInDateFormat(dateAsString) {
  dateAsString = dateAsString.replace(",", "");
  dateAsString = dateAsString.split(" ");
  var mm = M.months.indexOf(dateAsString[0]);
  return new Date(dateAsString[2], mm > 9 ? mm : "0" + mm, dateAsString[1]);
}

function callBatchesByMulltipleGradeId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra,
  requestExtra1,
  requestExtra2,
  requestExtraRemarks
) {
  hideMessage("");
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "BATCH-NAME-LIST-BASED-ON-MULTIPLE-STANDARD",
        value,
        requestExtra,
        requestExtra1,
        requestExtra2,
        requestExtraRemarks
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(true, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["subject"],
          $("#" + formId + " #" + toElementId),
          "Select class"
        );
        //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
      }
      //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
    }
  });
}

function callStudentBatchesByGradeId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra,
  requestExtra1,
  requestExtra2,
  requestExtraRemarks,
  requestExtra4
) {
  hideMessage("");
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "MULTIPLE-STUDENT-LIST",
        value,
        requestExtra,
        requestExtra1,
        requestExtra2,
        requestExtraRemarks,
        requestExtra4
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(0, data["message"]);
      } else {
        var studentList = data["mastersData"]["studentList"];
        if (studentList.length > 0) {
          if (formId == "extraActivityForm") {
            if(requestExtra1=='teacher'){
                showMessageTheme2(1, "Teacher list fetched successfully");
            }else{
                showMessageTheme2(1, "User list fetched successfully");
            }

          }
          buildDropdown(
            data["mastersData"]["studentList"],
            $("#" + formId + " #" + toElementId),
            "Select"
          );
        } else {
          if (formId == "extraActivityForm") {
            showMessageTheme2(2, "User not found");
          }
        }

      }
    }
  });
}
function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

function validEndInvalidField(flag, ele) {
  if (flag) {
    $("#" + ele)
      .closest(".valid-field")
      .addClass("true");
    $("#" + ele)
      .closest(".valid-field")
      .removeClass("false");
    $("#" + ele + "-error").hide();
  } else if (flag == null) {
    $("#" + ele)
      .closest(".valid-field")
      .removeClass("false");
    $("#" + ele)
      .closest(".valid-field")
      .removeClass("true");
  } else {
    $("#" + ele)
      .closest(".valid-field")
      .addClass("false");
    $("#" + ele)
      .closest(".valid-field")
      .removeClass("true");
    $("#" + ele + "-error").show();
  }
}
function formValdate(formID, mandatory, nonMandatory) {
  for (var i = 0; i < mandatory.length; i++) {
    var mElementType = $("#" + formID + " " + "#" + mandatory[i]).attr("type");
    var mElementValue = $("#" + formID + " " + "#" + mandatory[i]).val();
    if (mElementValue != null && mElementValue != undefined) {
      mElementValue = mElementValue.trim();
    } else {
      mElementValue = "";
    }
    if (
      mElementValue != "" &&
      mElementType != "checkbox" &&
      mElementType != "tel"
    ) {
      validEndInvalidField(true, mandatory[i]);
    } else if (mElementType == "checkbox") {
      if ($("#" + formID + " " + "#" + mandatory[i]).is(":checked")) {
        validEndInvalidField(true, "pcModeWhatsapp");
        //return true;
      } else {
        validEndInvalidField(null, mandatory[i]);
        //return false;
      }
    } else if (mElementType == "tel") {
      if ($("#" + formID + " " + "#" + mandatory[i]).val().length == 0) {
        validEndInvalidField(null, mandatory[i]);
        //return false;
      } else if (
        $("#" + formID + " " + "#" + mandatory[i]).val().length < 3 &&
        $("#" + formID + " " + "#" + mandatory[i]).val().length > 0
      ) {
        validEndInvalidField(false, mandatory[i]);
        //return false;
      } else {
        validEndInvalidField(true, mandatory[i]);
        //return true;
      }
    } else if (mElementType == undefined) {
      validEndInvalidField(null, mandatory[i]);
    } else {
      validEndInvalidField(false, mandatory[i]);
    }
  }
  for (var j = 0; j < nonMandatory.length; j++) {
    var nElementType = $("#" + formID + " " + "#" + nonMandatory[j]).attr(
      "type"
    );
    var nElementValue = $("#" + formID + " " + "#" + nonMandatory[j]).val();
    if (nElementValue != null && nElementValue != undefined) {
      nElementValue = nElementValue.trim();
    } else {
      nElementValue = "";
    }
    if (
      nElementValue != "" &&
      nElementType != "checkbox" &&
      nElementType != "tel"
    ) {
      validEndInvalidField(true, nonMandatory[j]);
    } else if (nElementType == "checkbox") {
      if ($("#" + formID + " " + "#" + nonMandatory[j]).is(":checked")) {
        validEndInvalidField(true, nonMandatory[j]);
        //return true;
      } else {
        validEndInvalidField(null, nonMandatory[j]);
        //return false;
      }
    } else if (nElementType == "tel") {
      if ($("#" + formID + " " + "#" + nonMandatory[j]).val().length == 0) {
        validEndInvalidField(null, nonMandatory[j]);
        //return false;
      } else if (
        $("#" + formID + " " + "#" + nonMandatory[j]).val().length < 3 &&
        $("#" + formID + " " + "#" + nonMandatory[j]).val().length > 0
      ) {
        validEndInvalidField(false, nonMandatory[j]);
        //return false;
      } else {
        validEndInvalidField(true, nonMandatory[j]);
        //return true;
      }
    } else {
      validEndInvalidField(null, nonMandatory[j]);
    }
  }
}

$(".show-password").on("click", function () {
  var inputField = $("#passwordType");
  if (inputField.val() != "") {
    if (inputField.attr("type") == "password") {
      inputField.attr("type", "text");
    } else {
      inputField.attr("type", "password");
    }
    $(this).find("i").toggleClass("fa-eye fa-eye-slash");
  }
});

// -------------------------------------------------------------------------
// Stacked / nested Bootstrap 4.6.2 modal z-index management
// -------------------------------------------------------------------------
// Bootstrap gives every .modal the same z-index (1050) and every
// .modal-backdrop the same z-index (1040), so stacking two modals lets the
// second backdrop cover the first modal. On top of that, several screens
// (e.g. showBookClassConfirmationModal) call `.modal("hide")` on one modal
// and `.modal("show")` on the next in the SAME tick. Bootstrap removes the
// ".show" class from the outgoing modal synchronously, but only removes its
// backdrop ~300ms later after the fade transition. So counting ".modal.show"
// at show time under-counts and places the new modal *below* that lingering
// backdrop (the reported "modal 1050 / backdrop 1059" bug).
//
// Fix: instead of counting classes, measure the highest z-index of any modal
// still ON SCREEN (".show" OR still ":visible" while fading out) and stack the
// new modal one STEP above it. Each backdrop is then pinned exactly one below
// its own modal so the modal is always visible/clickable above its overlay,
// while that overlay still covers everything beneath it in the stack.
//
//   1st modal: 1050   1st backdrop: 1049
//   2nd modal: 1060   2nd backdrop: 1059
//   3rd modal: 1070   3rd backdrop: 1069
// -------------------------------------------------------------------------

var MODAL_BASE_ZINDEX = 1050; // Bootstrap's default .modal z-index
var MODAL_ZINDEX_STEP = 10;   // gap between stacked modals

$(document).on("show.bs.modal", ".modal", function () {

    var $modal = $(this);

    // Highest z-index among OTHER modals that are still on screen. We include
    // ":visible" modals that no longer have ".show" because an outgoing modal
    // stays display:block (and its backdrop stays in the DOM) during its fade.
    // Start one step below the base so the very first modal lands on the base.
    var highestModalZIndex = MODAL_BASE_ZINDEX - MODAL_ZINDEX_STEP;

    $(".modal").not($modal).each(function () {

        var $other = $(this);

        if ($other.hasClass("show") || $other.is(":visible")) {

            var otherZIndex = parseInt($other.css("z-index"), 10);

            if (!isNaN(otherZIndex) && otherZIndex > highestModalZIndex) {
                highestModalZIndex = otherZIndex;
            }

        }

    });

    var modalZIndex = highestModalZIndex + MODAL_ZINDEX_STEP;
    // Backdrop must always be exactly ONE below its own modal: high enough to
    // cover the modal underneath it, but never above the modal it belongs to.
    var backdropZIndex = modalZIndex - 1;

    $modal.css("z-index", modalZIndex);
    $modal.addClass("modal-zindex-adjusted"); 
    // Bootstrap injects this modal's backdrop AFTER the show.bs.modal event,
    // so defer to the next tick to grab and position it.
    setTimeout(function () {
        // Backdrops we have already positioned carry the ".modal-stack" marker.
        // Anything still un-stacked is a freshly created backdrop; the last one
        // belongs to this modal. Any earlier un-stacked backdrops are orphans
        // left by an interrupted transition, so drop them to avoid duplicates.
        var $unstacked = $(".modal-backdrop").not(".modal-stack");
        var $backdrop = $unstacked.last();

        $unstacked.not($backdrop).remove();

        if ($backdrop.length) {

            $backdrop
                .css("z-index", backdropZIndex)
                .addClass("modal-stack");

        }

    }, 0);

});


$(document).on("hidden.bs.modal", ".modal", function () {

    var $modal = $(this);

    // Release the inline z-index we assigned to the modal that just closed.
    $modal.css("z-index", "");

    // Remaining modals (the one that closed no longer has ".show").
    var $openModals = $(".modal.show");
    var openModalCount = $openModals.length;

    if (openModalCount > 0) {

        // Bootstrap 4 removes "modal-open" from <body> whenever ANY modal
        // closes, even if others remain. Re-add it so the page stays locked
        // while at least one modal is still open.
        $("body").addClass("modal-open");

        // Guard against orphan/duplicate backdrops: there must never be more
        // backdrops than open modals. Remove the oldest extras so each modal
        // lines up with exactly one backdrop.
        var $backdrops = $(".modal-backdrop");
        while ($backdrops.length > openModalCount) {
            $backdrops.first().remove();
            $backdrops = $(".modal-backdrop");
        }

        // Re-stack the survivors from bottom to top so the sequence stays
        // contiguous (1050/1049, 1060/1059, ...).
        //
        // IMPORTANT: don't reindex by DOM/document order. `.modal-backdrop`
        // elements are always appended to <body> in the order they were
        // OPENED, but `.modal` elements live wherever their markup happens
        // to sit in the page - that position has nothing to do with when
        // they were opened. Reindexing both collections by document order
        // silently pairs the wrong modal with the wrong backdrop whenever a
        // modal that isn't the topmost one in the DOM is the one that just
        // closed, landing a backdrop ABOVE a modal it doesn't belong to
        // (the modal then looks "faded"/stuck and stops receiving clicks).
        // Sorting by the z-index we ourselves assigned recovers the true
        // open order for both collections, so index N always refers to the
        // same stack position in each.
        var $sortedModals = $openModals.toArray().sort(function (a, b) {
            return (parseInt($(a).css("z-index"), 10) || 0) - (parseInt($(b).css("z-index"), 10) || 0);
        });

        var $sortedBackdrops = $backdrops.toArray().sort(function (a, b) {
            return (parseInt($(a).css("z-index"), 10) || 0) - (parseInt($(b).css("z-index"), 10) || 0);
        });

        $($sortedModals).each(function (index) {
          
          if (!$(this).hasClass("modal-zindex-adjusted")) {
            $(this).css("z-index", MODAL_BASE_ZINDEX + (index * MODAL_ZINDEX_STEP));
          }
            
        });

        $($sortedBackdrops).each(function (index) {
            if (!$(this).hasClass("modal-stack")) {
                $(this).addClass("modal-stack");
                $(this).css("z-index", (MODAL_BASE_ZINDEX - 1) + (index * MODAL_ZINDEX_STEP));
            }
            
            
            // Each backdrop sits one below its matching modal.
            
        });

    } else {

        // Nothing left open: clean up any leftover backdrop and unlock the body.
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");

    }

});



$(document).ready(function () {
  $(".hamburger").on("click", function () {
    $(".card-body, table, tbody").resize();
    // var table = $('div.dataTables_scrollBody>table').dataTable();
    //     if ( table.length > 0 ) {
    //         table.fnDestroy()
    // 		table.dataTable();
    //     }
    // if($("table tbody tr td:first").hasClass("dtr-control")){
    // 	alert("SAfd")
    // 	$("table").destroy();
    // }
  });
});

function disabledBackButton() {
  history.pushState(null, null, location.href);
  window.onpopstate = function () {
    history.go(1);
  };
}
function checkCSCValidation(value, ele, fieldName) {
  if (value == "" || value == null || value == undefined) {
    validEndInvalidField(null, ele);
    //showMessageTheme2(0, fieldName+' is required');
    return false;
  } else {
    validEndInvalidField(true, ele);
  }
}

function pCheckCSCValidation(value, ele, fieldName) {
  if (value == "" || value == null || value == undefined) {
    validEndInvalidField(null, ele);
    //showMessageTheme2(0, fieldName+' is required');
    return false;
  } else {
    validEndInvalidField(true, ele);
  }
}

function getNumberWithPrecision(number, prececision) {
  return Number.parseFloat(number).toFixed(prececision);
}
function getVauleAsNumber(elementId) {
  var value = $("#" + elementId).val();
  if (!$.isNumeric(value)) {
    return 0;
  }
  return value;
}

function validateSelectedDateWithMinandMaxDate(selectedDate,minMonthBeforeNumber,maxMonthAfterNumber) {
  var sixMonthAgoDate = new Date();
  var nextYearMaxDate = new Date();
  var selectDate = selectedDate.split("-");
  selectedDate = new Date(
    selectDate[2] + "-" + selectDate[0] + "-" + selectDate[1]
  );
  sixMonthAgoDate.setMonth(sixMonthAgoDate.getMonth() - minMonthBeforeNumber);
  nextYearMaxDate.setMonth(nextYearMaxDate.getMonth() + maxMonthAfterNumber);
  if (selectedDate >= sixMonthAgoDate && selectedDate <= nextYearMaxDate) {
    return true;
  }
  return false;
}



function getTrimmedValue(formId, elementId) {
  $("#" + formId + " " + "#" + elementId).val(
    $("#" + formId + " " + "#" + elementId)
      .val()
      .trim()
  );
}

function checkTextBox(formId) {
  var form = $("#" + formId);
  if ($("#" + formId + " input").length > 0) {
    form.find(":text").each(function () {
      getTrimmedValue(formId, this.id);
    });
    form.find("input[type='email']").each(function () {
      getTrimmedValue(formId, this.id);
    });
  }
}
function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function toSeconds(hours, minutes, seconds) {
  return hours * 3600 + minutes * 60 + seconds;
}

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + "h " : "";
  var mDisplay = m > 0 ? m + "m" : "";
  //var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay;
}

function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;
  return `${padTo2Digits(hours)}h ${padTo2Digits(minutes)}m ${padTo2Digits(
    seconds
  )}s`;
}
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}
function getSystemTimezone() {
  var timezone = "";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (err) {
    console.log("getSystemTimezone: " + err.message);
  }
  return timezone;
}

$(document).ready(function () {
  $("#captcha").keyup(function () {
    $(this).val($(this).val().toUpperCase());
  });
  $("#marqueeDiv").css({ color: "red" });
});
function hidePassWordSuggession(src) {
  $(src).parent().find(".password-sugession").hide();
}

function updateValidationUI(container, selector, isValid) {
  var element = container.find(selector);
  element.find(".ps-dot").hide();
  if (isValid) {
    element.find(".ps-valid").show();
    element.find(".ps-invalid").hide();
    element.css({ color: "green" });
  } else {
    element.find(".ps-valid").hide();
    element.find(".ps-invalid").show();
    element.css({ color: "red" });
  }
}

function resetValidationUI(container) {
  container.find(".ps-dot").show();
  container.find(".ps-valid").hide();
  container.find(".ps-invalid").hide();
  container.find(".password-sugession-type").css({ color: "inherit" });
}

function hasSequentialChars(password) {
  var value = (password || "").toLowerCase();
  var alphabets = "abcdefghijklmnopqrstuvwxyz";
  var reverseAlphabets = alphabets.split("").reverse().join("");
  var numbers = "0123456789";
  var reverseNumbers = numbers.split("").reverse().join("");
  for (var i = 0; i < value.length - 2; i++) {
    for (var size = 3; size <= 5; size++) {
      if (i + size > value.length) {
        continue;
      }
      var part = value.substring(i, i + size);
      if (
        alphabets.includes(part) ||
        reverseAlphabets.includes(part) ||
        numbers.includes(part) ||
        reverseNumbers.includes(part)
      ) {
        return true;
      }
    }
  }
  return false;
}

function hasKeyboardPattern(password) {
  var value = (password || "").toLowerCase();
  var keyboardPatterns = [
    "qwertyuiop",
    "poiuytrewq",
    "asdfghjkl",
    "lkjhgfdsa",
    "zxcvbnm",
    "mnbvcxz",
    "1234567890",
    "0987654321",
  ];
  for (var i = 0; i < keyboardPatterns.length; i++) {
    var sequence = keyboardPatterns[i];
    for (var j = 0; j <= sequence.length - 4; j++) {
      if (value.includes(sequence.substring(j, j + 4))) {
        return true;
      }
    }
  }
  return false;
}

function hasRepeatedChars(password) {
  return /(.)\1\1/.test(password || "");
}

// function checkPasswordStrength(
//   src,
//   formID,
//   elementId,
//   passwordType,
//   matchElementId
// ) {
//   var passwodSuggessionHTML =
//     '<div class="password-sugession">' +
//     '<h6 class="password-sugession-title"><b>Password must include at least:</b></h6>	' +
//     '<p class="password-sugession-type password-uppercase-letter"><span class="ps-valid"><i class="fa fa-check"></i></span><span class="ps-invalid"><i class="fa fa-times"></i></span> <span class="ps-dot">.</span> 1 uppercase letter</p>' +
//     '<p class="password-sugession-type password-lowercase-letter"><span class="ps-valid"><i class="fa fa-check"></i></span><span class="ps-invalid"><i class="fa fa-times"></i></span> <span class="ps-dot">.</span> 1 lowercase letter</p>' +
//     '<p class="password-sugession-type password-special-letter"><span class="ps-valid"><i class="fa fa-check"></i></span><span class="ps-invalid"><i class="fa fa-times"></i></span> <span class="ps-dot">.</span> 1 special character</p>' +
//     '<p class="password-sugession-type password-number"><span class="ps-valid"><i class="fa fa-check"></i></span><span class="ps-invalid"><i class="fa fa-times"></i></span> <span class="ps-dot">.</span> 1 number</p>' +
//     '<p class="password-sugession-type password-length"><span class="ps-valid"><i class="fa fa-check"></i></span><span class="ps-invalid"><i class="fa fa-times"></i></span> <span class="ps-dot">.</span> min 8 characters & max 20 characters</p>';
//   if (passwordType == "CP") {
//     passwodSuggessionHTML +=
//       '<p class="password-sugession-type comfirm-password"><span class="ps-valid"><i class="fa fa-check"></i></span><span class="ps-invalid"><i class="fa fa-times"></i></span> <span class="ps-dot">.</span> password and confirm password should be same</p>';
//   }
//   +"</div>";
//   $("#" + formID + " #" + elementId)
//     .parent()
//     .css({ position: "relative" });
//   if (
//     $("#" + formID + " #" + elementId)
//       .parent()
//       .find(".password-sugession").length < 1
//   ) {
//     $("#" + formID + " #" + elementId)
//       .parent()
//       .append(passwodSuggessionHTML);
//   }
//   $(src).parent().find(".password-sugession").show();
//   if (passwordType == "P") {
//     var password = $("#" + elementId).val();
//   } else {
//     var password = $("#" + elementId).val();
//     var comfirmPassword = $("#" + matchElementId).val();
//   }

//   // Regular expressions for password validation
//   var lowercaseRegex = /^(?=.*[a-z])/;
//   var uppercaseRegex = /^(?=.*[A-Z])/;
//   var digitRegex = /^(?=.*\d)/;
//   var specialCharRegex = /^(?=.*[@$!%*?&#])/;

//   var isLowercaseValid = lowercaseRegex.test(password);
//   var isUppercaseValid = uppercaseRegex.test(password);
//   var isDigitValid = digitRegex.test(password);
//   var isSpecialCharValid = specialCharRegex.test(password);
//   var isValid =
//     isLowercaseValid && isUppercaseValid && isDigitValid && isSpecialCharValid;
//   if (password.length == 0) {
//     $(".ps-dot").show();
//     $(".ps-valid").hide();
//     $(".ps-invalid").hide();
//     $(".password-length").css({ color: "inherit" });
//     $(".password-lowercase-letter").css({ color: "inherit" });
//     $(".password-uppercase-letter").css({ color: "inherit" });
//     $(".password-number").css({ color: "inherit" });
//     $(".password-special-letter").css({ color: "inherit" });
//   } else {
//     if (password.length < 8 && password.length <= 20) {
//       $(".password-length .ps-valid").hide();
//       $(".password-length .ps-invalid").show();
//       $(".password-length .ps-dot").hide();
//       $(".password-length").css({ color: "red" });
//     } else {
//       $(".password-length .ps-valid").show();
//       $(".password-length .ps-invalid").hide();
//       $(".password-length .ps-dot").hide();
//       $(".password-length").css({ color: "green" });
//     }
//     if (!isLowercaseValid) {
//       $(".password-lowercase-letter .ps-valid").hide();
//       $(".password-lowercase-letter .ps-invalid").show();
//       $(".password-lowercase-letter .ps-dot").hide();
//       $(".password-lowercase-letter").css({ color: "red" });
//     } else {
//       $(".password-lowercase-letter .ps-valid").show();
//       $(".password-lowercase-letter .ps-invalid").hide();
//       $(".password-lowercase-letter .ps-dot").hide();
//       $(".password-lowercase-letter").css({ color: "green" });
//     }
//     if (!isUppercaseValid) {
//       $(".password-uppercase-letter .ps-valid").hide();
//       $(".password-uppercase-letter .ps-invalid").show();
//       $(".password-uppercase-letter .ps-dot").hide();
//       $(".password-uppercase-letter").css({ color: "red" });
//     } else {
//       $(".password-uppercase-letter .ps-valid").show();
//       $(".password-uppercase-letter .ps-invalid").hide();
//       $(".password-uppercase-letter .ps-dot").hide();
//       $(".password-uppercase-letter").css({ color: "green" });
//     }

//     if (!isDigitValid) {
//       $(".password-number .ps-valid").hide();
//       $(".password-number .ps-invalid").show();
//       $(".password-number .ps-dot").hide();
//       $(".password-number").css({ color: "red" });
//     } else {
//       $(".password-number .ps-valid").show();
//       $(".password-number .ps-invalid").hide();
//       $(".password-number .ps-dot").hide();
//       $(".password-number").css({ color: "green" });
//     }
//     if (!isSpecialCharValid) {
//       $(".password-special-letter .ps-valid").hide();
//       $(".password-special-letter .ps-invalid").show();
//       $(".password-special-letter .ps-dot").hide();
//       $(".password-special-letter").css({ color: "red" });
//     } else {
//       $(".password-special-letter .ps-valid").show();
//       $(".password-special-letter .ps-invalid").hide();
//       $(".password-special-letter .ps-dot").hide();
//       $(".password-special-letter").css({ color: "green" });
//     }
//     if (password != comfirmPassword) {
//       $(".comfirm-password .ps-valid").hide();
//       $(".comfirm-password .ps-invalid").show();
//       $(".comfirm-password .ps-dot").hide();
//       $(".comfirm-password").css({ color: "red" });
//     } else {
//       $(".comfirm-password .ps-valid").show();
//       $(".comfirm-password .ps-invalid").hide();
//       $(".comfirm-password .ps-dot").hide();
//       $(".comfirm-password").css({ color: "green" });
//     }
//   }
// }
function checkPasswordStrength(
src,
formID,
elementId,
passwordType,
matchElementId
) {
var passwodSuggessionHTML =
'<div class="password-sugession">' +
'<h6 class="password-sugession-title"><b>Password must include at least:</b></h6>' +


'<p class="password-sugession-type password-uppercase-letter">' +
'<span class="ps-valid" style="display:none"><i class="fa fa-check"></i></span>' +
'<span class="ps-invalid" style="display:none"><i class="fa fa-times"></i></span>' +
'<span class="ps-dot">.</span> 1 uppercase letter</p>' +

'<p class="password-sugession-type password-lowercase-letter">' +
'<span class="ps-valid" style="display:none"><i class="fa fa-check"></i></span>' +
'<span class="ps-invalid" style="display:none"><i class="fa fa-times"></i></span>' +
'<span class="ps-dot">.</span> 1 lowercase letter</p>' +

'<p class="password-sugession-type password-special-letter">' +
'<span class="ps-valid" style="display:none"><i class="fa fa-check"></i></span>' +
'<span class="ps-invalid" style="display:none"><i class="fa fa-times"></i></span>' +
'<span class="ps-dot">.</span> 1 special character (! @ # $ % & *)</p>' +

'<p class="password-sugession-type password-number">' +
'<span class="ps-valid" style="display:none"><i class="fa fa-check"></i></span>' +
'<span class="ps-invalid" style="display:none"><i class="fa fa-times"></i></span>' +
'<span class="ps-dot">.</span> 1 number</p>' +

'<p class="password-sugession-type password-length">' +
'<span class="ps-valid" style="display:none"><i class="fa fa-check"></i></span>' +
'<span class="ps-invalid" style="display:none"><i class="fa fa-times"></i></span>' +
'<span class="ps-dot">.</span> min 8 characters & max 20 characters</p>' +

'<p class="password-sugession-type password-sequence">' +
'<span class="ps-valid" style="display:none"><i class="fa fa-check"></i></span>' +
'<span class="ps-invalid" style="display:none"><i class="fa fa-times"></i></span>' +
'<span class="ps-dot">.</span> no consecutive sequences (e.g. 123, abc, zyx)</p>' +

'<p class="password-sugession-type password-keyboard-pattern">' +
'<span class="ps-valid" style="display:none"><i class="fa fa-check"></i></span>' +
'<span class="ps-invalid" style="display:none"><i class="fa fa-times"></i></span>' +
'<span class="ps-dot">.</span> no keyboard patterns (e.g. qwerty, asdf)</p>' +

'<p class="password-sugession-type password-repeat">' +
'<span class="ps-valid" style="display:none"><i class="fa fa-check"></i></span>' +
'<span class="ps-invalid" style="display:none"><i class="fa fa-times"></i></span>' +
'<span class="ps-dot">.</span> no repeated characters (e.g. aaa, 111)</p>';


if (passwordType == "CP") {
passwodSuggessionHTML +=
'<p class="password-sugession-type comfirm-password">' +
'<span class="ps-valid" style="display:none"><i class="fa fa-check"></i></span>' +
'<span class="ps-invalid" style="display:none"><i class="fa fa-times"></i></span>' +
'<span class="ps-dot">.</span> password and confirm password should be same</p>';
}

passwodSuggessionHTML += "</div>";

var inputElement = $("#" + formID + " #" + elementId);
var parentElement = inputElement.parent();

parentElement.css({
position: "relative",
});

if (parentElement.find(".password-sugession").length < 1) {
parentElement.append(passwodSuggessionHTML);
}

var suggestionBox = parentElement.find(".password-sugession");
$(".password-sugession").not(suggestionBox).hide();

var password = inputElement.val();
var confirmPassword = matchElementId
? $("#" + formID + " #" + matchElementId).val()
: "";

// regex validations
var lowercaseRegex = /[a-z]/;
var uppercaseRegex = /[A-Z]/;
var digitRegex = /\d/;
var specialCharRegex = /[!@#$%&*]/;

var isLowercaseValid = lowercaseRegex.test(password);
var isUppercaseValid = uppercaseRegex.test(password);
var isDigitValid = digitRegex.test(password);
var isSpecialCharValid = specialCharRegex.test(password);
var isLengthValid = password.length >= 8 && password.length <= 20;

var hasSequence = hasSequentialChars(password);
var hasKeyboard = hasKeyboardPattern(password);
var hasRepeat = hasRepeatedChars(password);

if (password.length === 0) {
suggestionBox.show();
resetValidationUI(suggestionBox);
if (typeof validEndInvalidField === "function") {
validEndInvalidField(null, elementId);
}
return false;
}

updateValidationUI(
suggestionBox,
".password-lowercase-letter",
isLowercaseValid
);

updateValidationUI(
suggestionBox,
".password-uppercase-letter",
isUppercaseValid
);

updateValidationUI(
suggestionBox,
".password-number",
isDigitValid
);

updateValidationUI(
suggestionBox,
".password-special-letter",
isSpecialCharValid
);

updateValidationUI(
suggestionBox,
".password-length",
isLengthValid
);

updateValidationUI(
suggestionBox,
".password-sequence",
!hasSequence
);

updateValidationUI(
suggestionBox,
".password-keyboard-pattern",
!hasKeyboard
);

updateValidationUI(
suggestionBox,
".password-repeat",
!hasRepeat
);

if (passwordType == "CP") {
updateValidationUI(
suggestionBox,
".comfirm-password",
password === confirmPassword
);
}

var isPasswordValid =
isLowercaseValid &&
isUppercaseValid &&
isDigitValid &&
isSpecialCharValid &&
isLengthValid &&
!hasSequence &&
!hasKeyboard &&
!hasRepeat;

if (passwordType == "CP") {
isPasswordValid =
isPasswordValid &&
password === confirmPassword;
}

if (isPasswordValid) {
suggestionBox.hide();
} else {
suggestionBox.show();
}
if (typeof validEndInvalidField === "function") {
validEndInvalidField(isPasswordValid, elementId);
}

return isPasswordValid;}

function validatePasswordByField(element) {
  var input = $(element);
  var form = input.closest("form");
  if (form.length < 1 || !input.attr("id")) {
    return true;
  }
  var formId = form.attr("id");
  var fieldId = input.attr("id");
  var type = "P";
  var matchId = "";
  if (input.attr("data-match")) {
    type = "CP";
    matchId = input.attr("data-match").replace("#", "");
  } else if (
    fieldId === "confirmPassword" ||
    fieldId === "confirmpassword"
  ) {
    type = "CP";
    matchId = fieldId === "confirmpassword" ? "newpassword" : "password";
  }
  return checkPasswordStrength(
    input.get(0),
    formId,
    fieldId,
    type,
    matchId
  );
}

function validatePasswordForm(formElement) {
  var form = $(formElement);
  if (form.length < 1) {
    return true;
  }
  var isValid = true;
  var passwordFields = form.find(".password-suggession-popup");
  passwordFields.each(function () {
    if ($(this).is(":visible") && !validatePasswordByField(this)) {
      isValid = false;
    }
  });
  return isValid;
}

$(document).on(
  "input keyup change paste",
  ".password-suggession-popup",
  function () {
    var currentField = this;
    setTimeout(function () {
      validatePasswordByField(currentField);
      var form = $(currentField).closest("form");
      var confirmField = form.find("#confirmPassword, #confirmpassword");
      if (confirmField.length > 0 && confirmField.val() !== "") {
        validatePasswordByField(confirmField.get(0));
      }
    }, 0);
  }
);

$(document).on("submit", "form", function (event) {
  if (!validatePasswordForm(this)) {
    event.preventDefault();
    return false;
  }
});

$(document).on("click", "#changepassword", function (event) {
  var form = $("#passwordForm");
  if (form.length > 0 && !validatePasswordForm(form.get(0))) {
    event.preventDefault();
    return false;
  }
});


function parseUrlToJson(params) {
  var data = {};
  data["userId"] = USER_ID;
  var splittedParams = params.split("?");
  if (splittedParams.length > 1) {
    var splittedParams1 = splittedParams[1].split("&");
    for (index = 0; index < splittedParams1.length; index++) {
      var splittedParams2 = splittedParams1[index].split("=");
      data[splittedParams2[0]] = splittedParams2[1];
    }
  }
  return data;
}

function getAsPost(paramas, isSelf) {
  // console.log("getAsPost1 " + paramas);
  // var KEUS = getSecreteKey();
  // AesUtil(KEUS.KEYSIZE, KEUS.ITERATIONS);
  var payload = JSON.stringify(parseUrlToJson(paramas));
  // payload=AesUtil.prototype.encrypt(KEUS.SALT, KEUS.IV, KEUS.PASSPHRASE, payload);
  payload = encode(payload);
  // console.log("getAsPost2 " + paramas);
  var urlSend =
    BASE_URL +
    CONTEXT_PATH +
    SCHOOL_UUID +
    paramas.split("?")[0] +
    "/" +
    UNIQUEUUID +
    "?payload=" +
    payload;
  if (isSelf == undefined || isSelf == null || isSelf == "") {
    window.open(urlSend);
  } else {
    window.open(urlSend, "_self");
  }
  customLoader(false);
}

function getAsPostWithoutUniqueID(paramas) {
  // console.log('getAsPost1 '+paramas);
  // var KEUS = getSecreteKey();
  // AesUtil(KEUS.KEYSIZE, KEUS.ITERATIONS);
  // var payload=JSON.stringify(parseUrlToJson(paramas));
  // payload=AesUtil.prototype.encrypt(KEUS.SALT, KEUS.IV, KEUS.PASSPHRASE, payload);
  // payload=encode(payload);
  // console.log('getAsPost2 '+paramas);
  var urlSend = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + paramas;
  window.open(urlSend);
  customLoader(false);
}

function getAsPostWithoutUUID(paramas, isSelf) {
  // console.log("getAsPost1 " + paramas);
  // var KEUS = getSecreteKey();
  // AesUtil(KEUS.KEYSIZE, KEUS.ITERATIONS);
  var payload = JSON.stringify(parseUrlToJson(paramas));
  // payload=AesUtil.prototype.encrypt(KEUS.SALT, KEUS.IV, KEUS.PASSPHRASE, payload);
  payload = encode(payload);
  // console.log("getAsPost2 " + paramas);
  var urlSend =
    BASE_URL +
    CONTEXT_PATH +
    SCHOOL_UUID +
    paramas.split("?")[0] +
    "?payload=" +
    payload;
  if (isSelf == undefined || isSelf == null || isSelf == "") {
    window.open(urlSend);
  } else {
    window.open(urlSend, "_self");
  }
  customLoader(false);
}

function encode(payload) {
  return window.btoa(encodeURI(payload));
}

function decode(payload) {
  return window.atob(payload);
}

function encode2(payload) {
  const bytes = new TextEncoder().encode(payload);
  const bin = Array.from(bytes, b => String.fromCharCode(b)).join('');
  return window.btoa(bin);
}

function decode2(encoded) {
  const bin = atob(encoded);
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function disablePastTimes(startTimeID, endTime, currentDate) {
  var currentHour = currentDate.getHours();
  var currentMinute = currentDate.getMinutes();

  $("#" + startTimeID).timepicker({
    format: "HH:mm",
    minTime: currentHour + ":" + currentMinute,
  });
  // $("#"+endTime).trigger('click');
}

function getSettingRequest(schoolId) {
  var data = {};
  data["schoolId"] = schoolId;
  return data;
}
// function getSchoolSettingsTechnical(schoolId){
// 	var responseData={};
// 	$.ajax({
// 		type : "POST",
// 		contentType : "application/json",
// 		url : getURLFor('technical',''),
// 		data : JSON.stringify(getSettingRequest(schoolId)),
// 		dataType : 'json',
// 		async: false,
// 		global: false,
// 		success : function(data) {
// 			responseData=data
// 		},
// 		error : function(e) {
// 			if (checkonlineOfflineStatus()) {
// 				return;
// 			}else{
// 				showMessageTheme2(true, e.responseText);
// 			}
// 		}
// 	});
// 	return responseData;
// }

async function getSchoolSettingsTechnical(schoolId){
	try{
		var responseData = await  getDesiredObject('sst'+schoolId);
		if(typeof responseData =='object'){
			if(!responseData.ntc){
				return responseData;
			}
		}
		responseData = await getDataBasedUrlAndPayload('technical', getSettingRequest(schoolId));
		localStorage.setItem('sst'+schoolId,JSON.stringify(responseData));
		return responseData;
	}catch(e){
		showMessageTheme2(true, e);

	}
}

// function getSchoolSettingsLinks(schoolId){
// 	var responseData={};
// 	$.ajax({
// 		type : "POST",
// 		contentType : "application/json",
// 		url : getURLFor('links',''),
// 		data : JSON.stringify(getSettingRequest(schoolId)),
// 		dataType : 'json',
// 		async: false,
// 		global: false,
// 		success : function(data) {
// 			responseData=data
// 		},
// 		error : function(e) {
// 			if (checkonlineOfflineStatus()) {
// 				return;
// 			}else{
// 				showMessageTheme2(true, e.responseText);
// 			}
// 		}
// 	});
// 	return responseData;
// }

async function getSchoolSettingsLinks(schoolId){
	try{
		var responseData = await  getDesiredObject('sslink'+schoolId);
		if(typeof responseData =='object'){
			if(!responseData.ntc){
				return responseData;
			}
		}
		responseData = await getDataBasedUrlAndPayload('links', getSettingRequest(schoolId));
		localStorage.setItem('sslink'+schoolId,JSON.stringify(responseData));
		return responseData;
	}catch(e){
		showMessageTheme2(true, e)
	}
}

async function getSchoolSettingsOffice(schoolId){
	try{
		var responseData = await  getDesiredObject('ssoffice'+schoolId);
		if(typeof responseData =='object'){
			if(!responseData.ntc){
				return responseData;
			}
		}
		responseData = await getDataBasedUrlAndPayload('office', getSettingRequest(schoolId));
		localStorage.setItem('ssoffice'+schoolId,JSON.stringify(responseData));
		return responseData;
	}catch(e){
		showMessageTheme2(true, e)
	}
}

async function getSchoolSettingsMails(schoolId){
	try{
		var responseData = await  getDesiredObject('mails'+schoolId);
		if(typeof responseData =='object'){
			if(!responseData.ntc){
				return responseData;
			}
		}
		responseData = await getDataBasedUrlAndPayload('mails', getSettingRequest(schoolId));
		localStorage.setItem('mails'+schoolId,JSON.stringify(responseData));
		return responseData;
	}catch(e){
		showMessageTheme2(true, e)
	}
}
async function getCommonCustomScript(userId,schoolId){
	try{
		var responseData = await  getDesiredObject('commonscript'+schoolId);
		if(typeof responseData =='object'){
			if(!responseData.ntc){
				return responseData;
			}
		}
		var data={};
		data['userId']=userId;
		responseData = await getDataBasedUrlAndPayload('common-script-variables', data);
		localStorage.setItem('commonscript'+schoolId,JSON.stringify(responseData));
		return responseData;
	}catch(e){
		showMessageTheme2(true, e)
	}
}
function getSettingsByTypeAndKey(type, key, globalFlag) {
  var responseData = {};
  $.ajax({
    url:
      BASE_URL +
      CONTEXT_PATH +
      SCHOOL_UUID +
      `/api/v1/get-setting?metaType=${type}&metaKey=${key}`,
    method: "GET",
    contentType: APPLICATION_JSON_VALUE,
    async: false,
    global: globalFlag == false && typeof(globalFlag) == "boolean" ? globalFlag : true,
    success: function (response) {
      responseData = response;
    }
  });
  return responseData;
}

function getSettingMetaValue(setting) {
  if (typeof setting === "string") {
    setting = JSON.parse(setting);
  }

  return setting && setting.data ? setting.data.metaValue : setting;
}

function getPlaneFormattedPhone(phoneNumber) {
  if (phoneNumber == undefined || phoneNumber == null || phoneNumber == "") {
    return "";
  }
  return phoneNumber
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("-", "")
    .replaceAll(" ", "");
}

function convertTo24Hour(time) {
  let [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}
function convertTo12Hour(time) {
  if (!time) return "";

  // remove seconds if present
  const [h, m] = time.trim().split(":");
  let hours = parseInt(h, 10);
  const minutes = m.padStart(2, "0");

  const modifier = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  return `${hours.toString().padStart(2, "0")}:${minutes} ${modifier}`;
}


function inputNumberValidation(event) {
  event.target.value = event.target.value.replace(/\D/g, "");
}

function getTimePlusInterval(date, intervalInMinutes) {
  var currentDate = new Date(date); // Get current date and time
  // var oneHourLater = new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)); // Add 1 hour to current time
  var intervalLater = new Date(
    currentDate.getTime() + intervalInMinutes * 60 * 1000
  ); // Add the interval
  var hours = intervalLater.getHours().toString().padStart(2, "0");
  var minutes = intervalLater.getMinutes().toString().padStart(2, "0");
  var seconds = intervalLater.getSeconds().toString().padStart(2, "0");
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)
  var formattedTime =
    hours.toString().padStart(2, "0") + ":" + minutes + " " + ampm;
  return formattedTime;
  //var formattedTime = intervalLater.toLocaleTimeString();
  //return formattedTime.toString().padStart(2, '0');//intervalLater.toLocaleTimeString(); // Format the time as a string
}
function getSession() {
  var responseData = false;
  $.ajax({
    type: "GET",
    url: getURLForCommon("check-session"),
    async: false,
    global: false,
    success: function (data) {
      responseData = data;
    },
    error: function (e) {
      if (checkonlineOfflineStatus()) {
        return;
      } else {
        showMessageTheme2(true, e.responseText);
      }
    },
  });
  return responseData;
}

function callWithSession(url, isSelf) {
  if (getSession()) {
    if (isSelf) {
      if (url.includes('/show-additional-layer')) {
        window.open(url,'_self');
      }else{
        goAheadGet(url,"");
      }
    } else {
      // For Zoom join links, prefer opening in the Zoom desktop app to avoid
      // the web-client "Enter Meeting Info" (name change) screen.
      openZoomJoinInAppOrFallback(url);
    }
  } else {
    logout("?from=session-out");
  }
}

// Session-free navigation for the payment result (thank-you) pages.
// The payer is already resolved server-side from the gateway reference, so the
// success/failure result page must not gate its buttons on getSession(): mobile
// Safari can drop the app session cookie during the gateway round-trip, and the
// getSession() gate in callWithSession() would then logout()/bounce the payer to
// login. This mirrors callWithSession()'s navigation, minus the session check.
function callWithoutSession(url, isSelf) {
  if (isSelf) {
    if (url.includes('/show-additional-layer')) {
      window.open(url, '_self');
    } else {
      goAheadGet(url, "");
    }
  } else {
    openZoomJoinInAppOrFallback(url);
  }
}

function openZoomJoinInAppOrFallback(url) {
  try {
    if (!url || typeof url !== "string") {
      window.open(url);
      return;
    }
    var urlStr = url.trim();
    if (urlStr.length < 1) {
      window.open(url);
      return;
    }

    var lower = urlStr.toLowerCase();
    if (lower.indexOf("zoom.us") < 0) {
      window.open(urlStr);
      return;
    }

    var meetingId = null;
    var m = urlStr.match(/\/wc\/(\d+)\/join/i);
    if (m && m[1]) meetingId = m[1];
    if (!meetingId) {
      m = urlStr.match(/\/j\/(\d+)/i);
      if (m && m[1]) meetingId = m[1];
    }
    if (!meetingId) {
      m = urlStr.match(/\/w\/(\d+)/i);
      if (m && m[1]) meetingId = m[1];
    }

    if (!meetingId) {
      window.open(urlStr);
      return;
    }

    var pwd = null;
    var uname = null;
    try {
      var u = new URL(urlStr);
      pwd = u.searchParams.get("pwd");
      uname = u.searchParams.get("uname");
    } catch (e) {
      // ignore
    }

    var zoomMtg = "zoommtg://zoom.us/join?action=join&confno=" + encodeURIComponent(meetingId);
    if (pwd) zoomMtg += "&pwd=" + encodeURIComponent(pwd);
    if (uname) zoomMtg += "&uname=" + encodeURIComponent(uname.replace(/\+/g, " "));

    // If popup is blocked, fallback to web.
    var win = null;
    try {
      win = window.open(zoomMtg);
    } catch (e) {
      win = null;
    }
    if (!win) {
      window.open(urlStr);
    }
  } catch (e) {
    window.open(url);
  }
}
function callWithSessionWithGetAsPost(url, isSelf) {
  if (getSession()) {
    getAsPost(url, isSelf);
  } else {
    logout("?from=session-out");
  }
}
var debouncing = function (mainFun, delay) {
  var timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      mainFun(...args);
    }, delay);
  };
};

function getTimeDifference(start, end) {
  return moment.duration(
    moment(end, "HH:mm:ss a").diff(moment(start, "HH:mm:ss a"))
  );
}

function getTimeWithFormat(durationAsMilisecond) {
  // var diff = moment.duration(durationAsMilisecond);
  // return (`${diff.hours()}h ${diff.minutes()}m`);
  var totalMinutes = durationAsMilisecond / (1000 * 60);
  var hours = Math.floor(totalMinutes / 60);
  var minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function getTimeFormat(hour) {
  var hours = parseInt(hour.split(":")[0]);
  var minutes = parseInt(hour.split(":")[1]);
  return `${hours}h ${minutes}m`;
}

function getTimeFormatByMiliSecond(durationAsMilisecond) {
  // var diff = moment.duration(durationAsMilisecond);
  // return (`${diff.hours()}h ${diff.minutes()}m`);
  var totalMinutes = durationAsMilisecond / (1000 * 60);
  var hours = Math.floor(totalMinutes / 60);
  if (hours < 10) {
    hours = "0" + hours;
  }
  var minutes = totalMinutes % 60;
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return hours + ":" + Math.round(minutes);
}

function autodiposeModel(modelId) {
  window.setTimeout(function () {
    $("#" + modelId).modal("hide");
  }, 10000);
}

function getEndTimeDropdownValue(startMins, timeGap) {
  var html = "";
  for (var i = startMins; i < 24 * 60; i += timeGap) {
    var endHour = Math.floor(i / 60);
    var endMinutes = i % 60;
    var endPeriod = endHour >= 12 ? "PM" : "AM";
    if (endHour > 12) endHour -= 12;
    if (endHour === 0) endHour = 12;

    var formattedEndTime = `${endHour}:${endMinutes
      .toString()
      .padStart(2, "0")} ${endPeriod}`;
    html += `<option value="${formattedEndTime}">${formattedEndTime}</option>`;
    //$('.endTime').append("<option value="+endHour+":"+endMinutes.toString().padStart(2, '0')+"_"+endPeriod+">"+formattedEndTime+"</option>");
  }
  return html;
}

$(document).ready(function () {
  $(".mobile-toggle-header-nav").click(function () {
    $(this).toggleClass("active"),
      $(".app-header__content").toggleClass("header-mobile-open");
  });
  detectBrave();
});
function detectBrave() {
  if (navigator.brave && navigator.brave.isBrave) {
    navigator.brave.isBrave().then(function (result) {
      if (result) {
        $(".cookie-consent").hide();
      } else {
        if (isShowcookie) {
          $(".cookie-consent").show();
        }
      }
    });
  } else {
    var isBrave = false;
    if (navigator.userAgent.includes("Chrome")) {
      // Additional feature detection for Brave
      const testBrave = new Error("Test Error").stack.includes(
        "chrome-extension://"
      );
      if (testBrave) {
        isBrave = true;
        $(".cookie-consent").hide();
      } else {
        if (isShowcookie) {
          $(".cookie-consent").show();
        }
      }
    }
    //console.log(isBrave ? 'This is the Brave browser' : 'This is not the Brave browser');
  }
}

function getDashboardDataBasedUrlAndPayload(globalflag,showMessage,url,payload) {
  if(globalflag){
    customLoader(true);
  }
  if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && url === "book-a-class" && typeof getDummyBookAClassResponse === "function") {
    customLoader(false);
    return Promise.resolve(getDummyBookAClassResponse());
  }
  if (typeof isDummyStudentMode === "function" && isDummyStudentMode()) {
    var dummyHandlers = {
      "buy-extra-class": "getDummyBuyExtraClassResponse",
      "add-to-cart": "getDummyAddToCartResponse",
      "get-cart-count": "getDummyCartCountResponse",
      "get-cart-details": "getDummyCartDetailsResponse",
      "update-cart-details": "getDummyUpdateCartDetailsResponse",
      "apply-discount-on-cart": "getDummyApplyDiscountOnCartResponse",
      "cart-payment": "getDummyCartPaymentResponse"
    };
    if (dummyHandlers[url] && typeof window[dummyHandlers[url]] === "function") {
      customLoader(false);
      return Promise.resolve(window[dummyHandlers[url]](payload));
    }
  }
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "POST",
      contentType: APPLICATION_JSON_VALUE,
      url: getURLForHTML("dashboard", url),
      data: JSON.stringify(payload),
      dataType: "json",
      global: globalflag,
      success: function (data) {
        if (data.status == "0" || data.status == "2" || data.status == "3") {
          if (data.status == "3") {
            redirectLoginPage();
          } else {
            if (showMessage) {
              showMessageTheme2(0, data.message, "", true);
            }
          }
        } else {

          resolve(data);
        }
      },
      error: function (xhr, status, e) {
        if (showMessage) {
          showMessageTheme2(0, e.responseText, "", true);
        }
        reject(e);
      },
    });
  });
}

function getDashboardDataBasedUrlAndPayloadWithParentUrl(globalflag, showMessage, url, payload, parentUrl){
  return new Promise(function (resolve, reject) {
      $.ajax({
          type : "POST",
          contentType : APPLICATION_JSON_VALUE,
          url: getURLForHTML(parentUrl, url),
          data : JSON.stringify(payload),
          dataType : 'json',
          global : globalflag,
          success : function(data) {
              if (data.status == '0' || data.status == '2' || data.status == '3') {
                  if(data.status == '3'){
                      redirectLoginPage();
                  }else{
                      if(showMessage){
                        showMessageTheme2(0, data.message,'',true);
                      }else{
                        resolve(data);
                      }
                  }
              } else {
                  resolve(data);
              }
          },
          error: function (xhr, status, e) {
              if(showMessage){
                showMessageTheme2(0, e.responseText,'',true);
              }
              reject(e);
          }
      });
  });
}
function getDashboardDataBasedUrlAndPayloadWithParentUrlForContract(globalflag, showMessage, url, payload, parentUrl){
  return new Promise(function (resolve, reject) {
      $.ajax({
          type : "POST",
          contentType : APPLICATION_JSON_VALUE,
          url: getURLForHTML(parentUrl, url),
          data : JSON.stringify(payload),
          dataType : 'json',
          global : globalflag,
          success : function(data) {
              if (data.status == '0' || data.status == '2' || data.status == '3') {
                  if(data.status == '3'){
                      redirectLoginPage();
                  }else{
                      if(showMessage){
                        showMessageTheme2(0, data.message,'',true);
                      }
                  }
                  resolve(data);
              } else {
                  resolve(data);
              }
          },
          error: function (xhr, status, e) {
              if(showMessage){
                showMessageTheme2(0, e.responseText,'',true);
              }
              reject(e);
          }
      });
  });
}

function getDashboardDataBasedUrlAndPayloadWithParentUrlGET(globalflag, showMessage, url, parentUrl){
  return new Promise(function (resolve, reject) {
      $.ajax({
          type : "GET",
          contentType : APPLICATION_JSON_VALUE,
          url: getURLForHTML(parentUrl, url),
          dataType : 'json',
          global : globalflag,
          success : function(data) {
              if (data.status == '0' || data.status == '2' || data.status == '3') {
                  if(data.status == '3'){
                      redirectLoginPage();
                  }else{
                      if(showMessage){
                        showMessageTheme2(0, data.message,'',true);
                      }
                  }
                  resolve(data);
              } else {
                  resolve(data);
              }
          },
          error: function (xhr, status, e) {
              if(showMessage){
                showMessageTheme2(0, e.responseText,'',true);
              }
              reject(e);
          }
      });
  });
}

function callCommonAjax(ajaxReqDetails){
    return new Promise(function (resolve, reject) {
      $.ajax({
        type : ajaxReqDetails.method,
        contentType : APPLICATION_JSON_VALUE,
        url: ajaxReqDetails.url,
        data: JSON.stringify(ajaxReqDetails.body),
        dataType : 'json',
        global : ajaxReqDetails.global,
        success : function(data) {
          if (data.status == '0' || data.status == '2' || data.status == '3') {
            if(data.status == '3'){
              redirectLoginPage();
            }else{
              if(ajaxReqDetails.showMessage){
                showMessageTheme2(0, data.message,'',true);
              }
            }
            resolve(data);
          } else {
            resolve(data);
          }
        },
        error: function (xhr, status, e) {
          if(ajaxReqDetails.showMessage){
            showMessageTheme2(0, e.responseText,'',true);
          }
          reject(e);
        }
    });
  });
}

function getActualData(){
	var responseData={};
	if(LOCATION_SERVICE_BYPASS=='true'){
		responseData=JSON.parse(DEFAULT_LOCATION);
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			async : false,
			success : function(data) {
				responseData=data;
			}
		});
	}
	return responseData;
}
function getCurrentTimeFromDateAsString(date) {
  return getCurrentTimeFromDate(new Date(date));
}

function getCurrentTimeOnly() {
  return getCurrentTimeFromDate(new Date());
}

function getCurrentTimeFromDate(date) {
  return (
    (date.getHours() > 9 ? date.getHours() : "0" + date.getHours()) +
    ":" +
    (date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()) +
    ":" +
    (date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds())
  );
}
function getBeforeAndAfterDate(date, hours) {
  var now = new Date(date);
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

function getDataBasedUrlAndPayload(url, payload) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "POST",
      contentType: APPLICATION_JSON_VALUE,
      url: getURLFor(url, ""),
      data: JSON.stringify(payload),
      dataType: "json",
      //global: false,
      success: function (data) {
        resolve(data);
      },
      error: function (xhr, status, e) {
        reject(e);
        if (tt == "theme1") {
          showMessage(true, TECHNICAL_GLITCH);
        } else {
          showMessageTheme2(0, TECHNICAL_GLITCH, "", true);
        }
      },
    });
  });
}

function getNeedToCall() {
  const needToCall = {
    ntc: true,
  };
  return needToCall;
}
async function getFreshValue(type, key) {
  const metaValue = await getSettingsByTypeAndKey(type, key);
  const formData = {
    metaType: key,
    metaKey: metaValue,
  };
  localStorage.setItem(key, JSON.stringify(formData));
}

function getDesiredObject(type) {
  var scriptVersionType = "SCRIPT_VERSION";
  return new Promise((resolve, reject) => {
    if (localStorage.getItem(scriptVersionType) == null) {
      getFreshValue("CONFIGURATION", scriptVersionType)
        .then(() => {
          checkAndReturn(type, resolve);
        })
        .catch(reject);
    } else {
      checkAndReturn(type, resolve);
    }
  });
}

function checkAndReturn(type, resolve) {
  var scriptVersionType = "SCRIPT_VERSION";
  var svObject = JSON.parse(localStorage.getItem(scriptVersionType));
  var data = JSON.parse(svObject.metaKey);
  if (data.data.metaValue != SCRIPT_VERSION) {
    localStorage.clear();
    resolve(getNeedToCall());
  } else {
    if (localStorage.getItem(type) == null) {
      resolve(getNeedToCall());
    } else {
      resolve(JSON.parse(localStorage.getItem(type)));
    }
  }
}
function getPrimaryColor() {
  var primaryColor = ROOTCSS.split(":#")[1].split(";")[0];
  return primaryColor;
}
function showMessageTheme2Content() {
  var html = `<div class="server-message">
		<span class="msg" id="msgTheme2"></span>
	</div>`;
  return html;
}

function getWelcomeMessage() {
  var timeOfDay = new Date().getHours();
  if (timeOfDay >= 0 && timeOfDay < 12) {
    return "Good morning";
  } else if (timeOfDay >= 12 && timeOfDay < 16) {
    return "Good afternoon";
  } else if (timeOfDay >= 16 && timeOfDay < 21) {
    return "Good evening";
  } else if (timeOfDay >= 21 && timeOfDay < 24) {
    return "Good evening";
  }
}

function generateTinyUrls() {
  const isTinyUrlEnabled = getTinyUrlService();
  if (!isTinyUrlEnabled) {
    //console.log("Tiny URL service is disabled in configuration");
    return;
  }
  const $urlInputs = $(".tinyUrl");
  const uniqueUrls = {};
  const $copyElements = $("a[onclick*='copyURL'], a[onclick*='copyToClipboard'], button[onclick*='copyURL'], button[onclick*='copyToClipboard']");
  $copyElements.prop("disabled", true).css({ pointerEvents: "none", opacity: 0.6 });
  $urlInputs.each(function () {
    const url = $(this).val().trim();
    if (url) {
      uniqueUrls[url] = true;
    }
  });
  const urls = Object.keys(uniqueUrls);
  if (!urls.length) {
    $copyElements.prop("disabled", false).css({ pointerEvents: "", opacity: "" });
    return;
  }
  fetch("https://internationalschooling.org/api/create-short-urls", {
    method: "POST",
    headers: {
      "Content-Type": APPLICATION_JSON_VALUE,
    },
    body: JSON.stringify({ urls }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      const urlMap = {};
      data.urls.forEach((item) => {
        urlMap[item.original] = item.short;
      });
      $urlInputs.each(function () {
        const originalUrl = $(this).val().trim();
        if (originalUrl && urlMap[originalUrl]) {
          $(this).val(urlMap[originalUrl]);
        }
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    })
    .finally(() => {
      $copyElements.prop("disabled", false).css({ pointerEvents: "", opacity: "" });
    });
}


function showDropdownCustomView(tableID){
  $('.dropdown-toggle.btn-sm').off('click');
  $('.dropdown-toggle.btn-sm').on('click', function (e) {
      var drodownFlag = false;
      tableID = $(this).closest("table").attr("id");
      if($('.dropdown-toggle').closest("table").parent().hasClass("table-responsive")){
        $(".table-responsive table tbody tr td .dropdown-menu").each(function(i,v){
          if($(this).height()>$("#"+tableID).parent().height()){
            drodownFlag=true;
          }
        });
        if(drodownFlag){
          e.preventDefault();
          e.stopPropagation();

          // Remove any previously appended dropdown
          $('.external-dropdown-menu').remove();

          const $btn = $(this);
          const $menu = $btn.next('.dropdown-menu');
          // Clone the dropdown menu
          const $clonedMenu = $menu.clone().addClass('show external-dropdown-menu');

          // Position it relative to the button
          const offset = $btn.offset();
          const height = $btn.outerHeight();
          const tdWidth = $menu.outerWidth();
          var btnWidth = $btn.outerWidth();
          var zIndex = 1030;
          if($(".modal.show").length>0){
            $(".modal.show").each(function(){
              zIndex= parseInt($(this).css('z-index'))+1;
            });
          }
          $clonedMenu.css({
            position: 'absolute',
            top: offset.top + height,
            left: offset.left - (tdWidth),
            zIndex: zIndex,
          });
          $('body').append($clonedMenu);
          // Close dropdown on outside click
          $(document).on('click.externalDropdown', function (event) {
            if (!$(event.target).closest('.external-dropdown-menu, .action-btn').length) {
              $('.external-dropdown-menu').remove();
              $(document).off('click.externalDropdown');
              drodownFlag=false;
            }
          });
        }else{
          $('.external-dropdown-menu').remove();
        }
      }
  });
}
function checkValueValidation(value, defaultValue){
	if(value == null || value == undefined || value == ""){
		return defaultValue;
	}else{
		return value;
	}
}

function getTimezoneIdByTimeName(timeZoneName) {
  var responseData = {};
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getTimezoneIdByTimeNameRequest("GET_TIMEZONE_ID", timeZoneName)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (response) {
      responseData = response;
    },
    error: function (e) {
      console.log(e);
    },
  });
  return responseData;
}

function getTimezoneIdByTimeNameRequest(key, value){
	var request = {};
	var requestData = {};
	var authentication = {};
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'COMMON';
	requestData['requestKey'] = key;
	requestData['requestValue'] = value;
	request['requestData'] = requestData;
	request['authentication'] = authentication;
	return request;
}


function showMessageErrorNew(isWarnig, message, id) {
  if (!isWarnig) {
    $("#" + id).addClass("success-msg");
  }
  $("#" + id).addClass("show-errow-msg");
  $("#" + id).html(message);
}
function hideMessageErrorNew(id) {
  $("#" + id).removeClass("success-msg");
  $("#" + id).removeClass("show-errow-msg");
  $("#" + id).html("");
}

function getLoaderContent(){
    var html=
    '<div id="commonloaderIdNewLoader" class="loader-wrapper unique-loader d-flex justify-content-center align-items-center loader-style hide-loader">'
        if(SCHOOL_ID==1){
          html+=`<img src="`+PATH_FOLDER_IMAGE2+`loader-new.gif" alt="`+SCHOOL_NAME+` Loader" class="new-loader-2024"/>`
        }else{
          html+=
          `<div class="ball-rotate">
            <div style="background-color: rgb(247, 185, 36);"></div>
          </div>
          <p>Loading ...</p>`
        }
        html+=`</div>`;
      return html;
}

function getTimezoneIdByTimeNameRequest(key, value) {
  var request = {};
  var requestData = {};
  var authentication = {};
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "COMMON";
  requestData["requestKey"] = key;
  requestData["requestValue"] = value;
  request["requestData"] = requestData;
  request["authentication"] = authentication;
  return request;
}

function getTinyUrlService() {
  const tinyUrlService = getSettingsByTypeAndKey('CONFIGURATION', 'TINY_URL_SERVICE');
  const metaValue = JSON.parse(tinyUrlService)?.data?.metaValue;
  return String(metaValue).toLowerCase() === 'true';
}

function getIsoFromIsd(isdCode) {
  const country = window.intlTelInputGlobals.getCountryData().find(c => c.dialCode === isdCode);
  return country ? country.iso2 : "us";
}

function safeUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(b => b.toString(16).padStart(2, "0"));
    return (
      hex.slice(0, 4).join("") + "-" +
      hex.slice(4, 6).join("") + "-" +
      hex.slice(6, 8).join("") + "-" +
      hex.slice(8, 10).join("") + "-" +
      hex.slice(10, 16).join("")
    );
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function showAndHideDashboardAndAdditionalContent(type){
  if(type == "main"){
    $("#dashboardContentInHTML").show();
    $("#dashboardContentInHTMLAdditional").html("");
    $("#dashboardContentInHTMLAdditional").hide();
  }else if(type == "additional"){
    $("#dashboardContentInHTML").hide();
    $("#dashboardContentInHTMLAdditional").html("");
    $("#dashboardContentInHTMLAdditional").show();
  }
}

//Fill Browser data
function fillBrowserDetail() {
  var browserDetails = getBrowserDetail();
  if (browserDetails != undefined && browserDetails != "") {
    return JSON.stringify(browserDetails);
  }
  return "{}";
}

//Browser detail
function getBrowserDetail() {
  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browserName = navigator.appName;
  var fullVersion = "" + parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion, 10);
  var nameOffset, verOffset, ix;

  // In Opera, the true version is after "Opera" or after "Version"

  if ((verOffset = nAgt.indexOf("Opera")) != -1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset + 5);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset + 7);
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset + 8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if (
    (nameOffset = nAgt.lastIndexOf(" ") + 1) <
    (verOffset = nAgt.lastIndexOf("/"))
  ) {
    browserName = nAgt.substring(nameOffset, verOffset);
    fullVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() == browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }

  // trim the fullVersion string at semicolon/space if present

  if ((ix = fullVersion.indexOf(";")) != -1)
    fullVersion = fullVersion.substring(0, ix);
  if ((ix = fullVersion.indexOf(" ")) != -1)
    fullVersion = fullVersion.substring(0, ix);

  majorVersion = parseInt("" + fullVersion, 10);
  if (isNaN(majorVersion)) {
    fullVersion = "" + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  return {
    name: browserName,
    fullVersion: fullVersion,
    shortVersion: majorVersion,
    navAppName: navigator.appName,
    uAgentFull: navigator.userAgent,
  };
}
function getUploadInputBtn(inputId, uploadViewElementId, fileType, elem_id, btn_label_name, file_input_show_hide_flag, viewAttachmentModalId, is_attchementPDF, is_attchementUploaded, viewAttachmentFlag){
  var html =
  `<label class="label text-left full">${btn_label_name} :</label>
    <div class="upload-btn-wrapper box-shadow-none text-left d-flex flex-wrap" style="align-items: center;">`;
      if(file_input_show_hide_flag){
        html+=
        `<div id="policeVeriProfile" class="file-btn  text-left w-fit-content float-left position-relative">
          <span id="fileName8" class="fileName" style="display: none;"></span>
          <input onchange="uploadDocsFun(this, 'verify', \'${uploadViewElementId}\', true);previewPoliceVerification(event);" class="file-input" type="file" name="${inputId}" id="${inputId}" fileType="${fileType}" elem-id="${elem_id}" value="Upload ${btn_label_name}"/>
          <span class="btn primary-bg white-txt-color mt-1">Upload Police Verification</span>
        </div>`;
      }
      if(viewAttachmentFlag){
        html+=`<a id="${uploadViewElementId}" href="javascript:void(0);" target="_self" data-toggle="tooltip" title="View" class="btn btn-primary mt-1 ml-1" data-file-extension="${is_attchementPDF ? 'P':'I'}" data-attachment-url="${is_attchementUploaded != ""?is_attchementUploaded:''}" style="${is_attchementUploaded != '' ? '' : 'display:none'  }" onclick="viewAttachmentInModal(this, \'${viewAttachmentModalId}\')">
          <i class="fa fa-eye"></i>
        </a>`;
      }
    html+=`</div>`;
  return html;
}

function getDuration(startDate, endDate) {
  var diffMs = new Date(endDate).getTime() - new Date(startDate).getTime();
  if (diffMs < 0) diffMs = -diffMs;
  var totalSec = Math.floor(diffMs / 1000);
  var hours = Math.floor(totalSec / 3600);
  var minutes = Math.floor((totalSec % 3600) / 60);
  var seconds = totalSec % 60;
  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0')
  ].join(':');
}



function cleanBase64Images(htmlContent) {
  if (!htmlContent || typeof htmlContent !== "string") return htmlContent;
  return htmlContent.replace(
    /(<img[^>]+src=["']data:image\/[^;]+;base64,)([^"']+)(["'][^>]*>)/gi,
    function(match, prefix, base64Data, suffix) {
      var fixedBase64 = base64Data.replace(/[\r\n]+/g, '');
      fixedBase64 = fixedBase64.replace(/ /g, '+');
      fixedBase64 = fixedBase64.replace(/[^A-Za-z0-9+/=]/g, '');
      return prefix + fixedBase64 + suffix;
    }
  );
}

function handleRecipientSignatureUpload(input, targetId){
  var file = input.files[0];
  if(!file) return;

  var allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if(allowedTypes.indexOf(file.type) === -1){
    showMessageTheme2(2, "Only JPG or PNG images are allowed.");
    input.value = "";
    return;
  }

  if (file.size > 300 * 1024) {
    showMessageTheme2(2, "File size must be less than 300 KB.");
    input.value = "";
    return;
  }
  var reader = new FileReader();
  reader.onload = function(evt){
    var base64ImgTag = `<img src="${evt.target.result}" alt="Recipient Signature" data-name="${file.name}" style="max-width:120px;display:block;margin:auto;"/>`;
    var $editorContent = $(".jodit-workplace").length ? $(".jodit-workplace") : $("#editorData");
    var $targetBox = $editorContent.find("#" + targetId);
    if($targetBox.length){
      $targetBox.html(base64ImgTag);
    }
  };
  reader.readAsDataURL(file);
  if(targetId == "rightSignatureBox"){
    $("#rightDate").text(changeDateFormat(new Date(), "MMM-dd-yyyy"))
  }
}

function updateFileName(input){
  var fileName = input.files.length > 0 ? input.files[0].name : "Choose file...";
  $(input).next(".custom-file-label").text(fileName);
}

function handleFileInputCancel(formId, inputId, imgId, defaultLabel = "Choose file...") {
  var input = $("#" + formId + " #" + inputId);
  var label = input.next(".custom-file-label");
  input.on("change", function () {
    if (this.files && this.files.length > 0) return;
    var img = $("#" + formId + " #" + imgId + " img");
    if (img.length) {
      var originalName = img.attr("data-name") || defaultLabel;
      label.text(originalName);
    } else {
      label.text(defaultLabel);
    }
});
}

async function copyToClipboardSignedUrl(videoUrl) {
	try {
	  const signedUrlResponse = await getSignedUrlForCopyClipboard(videoUrl);
	  const parsed = JSON.parse(signedUrlResponse);
	  const finalUrl = parsed.url;
	  await navigator.clipboard.writeText(finalUrl);
	  showToast("Copied!");
	} catch (err) {
	  showToast("Failed to copy!");
	}
}

async function getSignedUrlForCopyClipboard(videoUrl) {
      const payload = JSON.stringify({ url: videoUrl });
			const encodePayload = window.btoa(unescape(encodeURIComponent(payload)));
    return new Promise((resolve, reject) => {
      $.ajax({
        url: BASE_URL + CONTEXT_PATH + "videos/signed-url?payload=" + encodePayload,
        type: "GET",
        contentType: "application/json",
        global: false,
        success: function(response) {
          resolve(response);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.visibility = "visible";
    setTimeout(() => {
    toast.style.visibility = "hidden";
    }, 2500);
}

function getOrdinalSuffix(number) {
  if (number === 1) return "1st";
  if (number === 2) return "2nd";
  if (number === 3) return "3rd";
  return number + "th";
}

function getPaymentBySchoolId(schoolId){
  var entityId, entityType;

  if (USER_ROLE == "SCHOOL_ADMIN") {
      entityId = SCHOOL_ID;
      entityType = "SCHOOL";
  } else {
      entityId = USER_ID;
      entityType = "USER_ID";
  }
  var payload = { entityId, entityType };
  var options = '';
  $.ajax({
      type: "POST",
      contentType: "application/json",
      url: BASE_URL + CONTEXT_PATH + '/' + schoolId + '/dashboard/get-partner-payment-options',
      dataType: 'json',
      data: JSON.stringify(payload),
      async: false,
      success: function (data) {
          if(data.status) {
            options += `<option value="">Select Payment Gateway</option>`;
            if(data.pgList && data.pgList.length > 0) {
              console.log(data.pgList)
              data.pgList.forEach(function (pg) {
                if(pg.active === 'Y') {
                  options +=
                  `<option value="${pg.getwayName}">
                      ${pg.getwayLabel}
                  </option>`;
                }
                if(pg.paymentGatway && pg.paymentGatway.length > 0) {
                  pg.paymentGatway.forEach(function (subPg) {
                    if(subPg.active === 'Y') {
                      options+=
                      `<option value="${subPg.getwayName}">
                          ${subPg.getwayLabel}
                      </option>`;
                    }
                  });
                }
              });
            }
          }else{
            showMessageTheme2(0, data.message);
          }
      }
  });
  return options;
}


function formatMonth(date) {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return months[date.getMonth()] + " " + date.getFullYear().toString().slice(-2);
}

function allowOnlyNumbers(el) {
	el.value = el.value
	  .replace(/[^0-9.]/g, '')
	  .replace(/^(\d*\.\d{0,2}).*$/, '$1')
	  .replace(/(\..*)\./g, '$1');
}

function restrictMaxValue(src, max) {
  let val = parseInt($(src).val(), 10);
  if (isNaN(val)) {
      $(src).val("");
  } else if (val > max) {
      $(src).val(max);
  }
}

function getCopyright(){
	return "Copyright © " + new Date().getFullYear() + " - " + SCHOOL_NAME + " - All Rights Reserved.";
}

function renderPaginationCommon(currentPage, totalPages, context = '') {
	let paginationHtml = `
	  <nav aria-label="Page navigation" class="full mt-3">
		<ul class="pagination justify-content-center">
		  <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
			<button class="page-link" onclick="goToPageCommon(${currentPage - 1}, '${context}')"><i class="fa fa-chevron-left mr-2" style="font-size: 10px;"></i>Previous</button>
		  </li>`;

	let startPage = Math.max(1, currentPage - 1);
	let endPage = Math.min(totalPages, currentPage + 1);

	if (startPage > 1) {
	  paginationHtml += `
		<li class="page-item">
		  <button class="page-link" onclick="goToPageCommon(1, '${context}')">1</button>
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
		  <button class="page-link" onclick="goToPageCommon(${i}, '${context}')">${i}</button>
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
		  <button class="page-link" onclick="goToPageCommon(${totalPages}, '${context}')">${totalPages}</button>
		</li>`;
	}

	paginationHtml += `
		  <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
			<button class="page-link" onclick="goToPageCommon(${currentPage + 1}, '${context}')">Next<i class="fa fa-chevron-right ml-2" style="font-size: 10px;"></i></button>
		  </li>
		</ul>
	  </nav>`;

	return paginationHtml;
}

function goToPageCommon(page, context) {
	switch(context) {
		case 'teacherScreening':
			CURRENT_PAGE_TEACHER_SCREENING = page;
			loadTeacherScreeningData();
			break;
		case 'partnerEnrollment':
			currentPagePartnerEnrollmentList = page;
			callStudentListByPartner("partnerEnrollFilterForm");
			break;
    case 'partnerEnrollmentList':
			currentPagePartnerEnrollmentList = page;
			callStudentListByPartnerWLP("partnerEnrollFilterForm");
			break;
		case 'paymentList':
			currentPagePaymentList = page;
			getPartnerSchoolPaymentDetails("paymentSeachForm");
			break;
		case 'recurringMeeting':
			currentPageRecurringRecording = page;
			applyRecurringRecordingFilters($("#recurringMeetingModal").data("entityId"));
			break;
		case 'meetings':
			if (currentTabId === "oneDayMeetings") {
				currentPageOneDay = page;
			} else if (currentTabId === "recurringMeetings") {
				currentPageRecurring = page;
			}
			if (typeof meetingManagementMode !== 'undefined' && meetingManagementMode === "LOGS" && typeof fetchMeetingsJoinLogs === 'function') {
				fetchMeetingsJoinLogs($('#filterHostUserId').val());
			} else {
				fetchMeetings($('#filterHostUserId').val());
			}
			break;
    case 'userApplication':
      CURRENT_PAGE_USER_APPLICATION = page;
			loadUserApplicationData();
			break;
    case 'manageClubs':
      CURRENT_PAGE_MANAGE_CLUBS = page;
      getAllClubsData();
			break;
		case 'teacherRating':
			trState.pageNo = page;
			loadTeacherRatingList(false);
			break;
		case 'contractManagement':
			tcmState.currentPage = page;
			loadTeacherContractList();
			break;
		default:
			console.warn('Unknown pagination context:', context);
	}
}

function formatLabel(str) {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim();
}
function formatTimeDisplay(timeInSeconds) {
  if (!timeInSeconds) return '0m';
  const minutes = Math.floor(timeInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  } else {
    return `${minutes}m`;
  }
}

function secondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getRemainingDays(lastAnsweringDate) {
  var today = new Date();
  var lastDate = new Date(lastAnsweringDate);
  var diffMs = lastDate - today;
  var remaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return remaining > 0 ? remaining : 0;
}
function selfModalHide(modalID){
	$("#"+modalID).modal("hide");
  if (typeof viewWatiTemplate === "function") {
	  viewWatiTemplate(false);
  }
  if (typeof viewEmailTemplate === "function") {
    viewEmailTemplate(false);
  }
}

function checkAiSummaryAvailable(entityId, entityType) {
    var isAvailable = false;

    $.ajax({
        type: "POST",
        url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/v1/leads/get-recordings-summary",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({
            entityId: entityId,
            entityType: entityType
        }),
        success: function(res) {
            if (res.summary && res.summary.summaryDetails && res.summary.summaryDetails.length > 0) {
                isAvailable = true;
            }
        },
        error: function() {
            isAvailable = false;
        }
    });

    return isAvailable;
}

function showAiSummary(entityId, entityType) {

    const requestObj = {
        entityId: entityId,
        entityType: entityType
    };

    $.ajax({
        type: "POST",
        url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/v1/leads/get-recordings-summary",
        contentType: "application/json",
        data: JSON.stringify(requestObj),

        success: function (res) {
            if (!res.summary) {
                showMessage(0, "AI Summary not available");
                return;
            }

            openAiSummaryModal(res.summary);
        },

        error: function () {
            showMessage(0, "Failed to load AI Summary");
        }
    });
}

function openAiSummaryModal(summary) {

    // $("#aiSummaryModalCustom").remove();

    //   var modalHtml = `
    //       <div class="modal fade show" id="aiSummaryModalCustom" tabindex="-1" role="dialog" style="display:block; z-index: 99999;">
    //         <div class="modal-dialog modal-lg" role="document" style="z-index:100000;">

    //           <div class="modal-content" style="border-radius:12px; overflow:hidden;">

    //             <div class="modal-header py-2 bg-primary text-white">
    //               <h5 class="modal-title">AI Summary</h5>
    //               <button type="button" class="close text-white" onclick="closeAiSummaryModal();" aria-label="Close">
    //                 <span aria-hidden="true"><i class="fa fa-times"></i></span>
    //               </button>
    //             </div>

    //             <div class="modal-body" id="ai-summary-content" style="height:70vh; overflow-y:auto; padding:20px;">
    //             </div>

    //           </div>

    //         </div>
    //       </div>

    //       <!-- Backdrop -->
    //       <div class="modal-backdrop fade show" style="z-index: 99990;"></div>
    //       `;
    // $("body").append(modalHtml);

	var html = ''
    + '<h3 style="font-size:22px;"><b>AI Summary</b></h3>'
    + '<hr>'
    + '<h4 style="font-size:20px;"><b>' + summary.summaryTitle + '</b></h4>'
    + '<p style="font-size:15px;">' + summary.summaryOverview + '</p>'
    + '<h5 style="font-size:18px; margin-top:20px;"><b>AI Summary Details</b></h5>'
    + '<hr>';

	summary.summaryDetails.forEach(function(item, i) {
		html += ''
			+ '<h4 style="font-size:17px;"><b>' + (i + 1) + '. ' + item.label + '</b></h4>'
			+ '<p style="font-size:15px;">' + item.summary + '</p>'
			+ '<hr>';
	});

    $("#ai-summary-content").html(html);
}

function closeAiSummaryModal() {
    $("#aiSummaryModalCustom").remove();
    $(".modal-backdrop").remove();
}

function generateAiSummary(meetingId, entityId, entityName) {

  $.ajax({
      type: "GET",
      url: BASE_URL + CONTEXT_PATH + "crons/backfill-meetings-summary-details",
      data: {
          meetingId: meetingId,
          pageSize: 10
      },
      success: function(response) {
          showAiSummary(entityId, entityName);
          showMessage(true, "Summary Generated: " + response);
      },
      error: function() {
          showMessage(true, "Failed to generate AI Summary");
      }
  });
}

async function previewContractPdf(callFrom){
  var payload = {};
  payload["commentData"] = editor.getEditorValue();
  if(callFrom == "B2B"){
    payload["entityId"] = parseInt($("#b2bLeadId").val());
    payload["entityType"] = "CONTRACT_DETAILS";
  }else if(callFrom == "TEACHER"){
    payload["entityId"] = parseInt($("#contractId").val());
    payload["entityType"] = "TEACHER_AGREEMENT_LOG";
  }

	var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrlForContract(true, true, "preview-contracts", payload, "");
	if (responseData.status == '0' || responseData.status == '2' || responseData.status == '3') {
		showMessageTheme2(0, responseData.message);
		return;
	}
	var byteArray = new Uint8Array(responseData.pdfData);
	var blob = new Blob([byteArray], { type: "application/pdf" });
	var pdfUrl = URL.createObjectURL(blob) + "#toolbar=0&navpanes=0&scrollbar=0";
  window.open(pdfUrl);
	// var modalHtml = `
	// 	<div class="modal fade" id="pdfPreviewModal" tabindex="-1" role="dialog">
	// 	  <div class="modal-dialog" role="document" style="max-width:60%;">
	// 		<div class="modal-content">
	// 		  <div class="modal-header p-2 bg-primary">
	// 			<h5 class="modal-title ml-2 font-weight-bold text-white">Contract Preview</h5>
	// 			<button type="button" class="close text-white mr-1" data-dismiss="modal">&times;</button>
	// 		  </div>
	// 		  <div class="modal-body" style="height:80vh;">
	// 			<iframe src="${pdfUrl}" frameborder="0" style="width:100%; height:100%;"></iframe>
	// 		  </div>
	// 		</div>
	// 	  </div>
	// 	</div>`;

	// if ($("#pdfPreviewModal").length == 1) {
	// 	$("#pdfPreviewModal").remove();
	// }
	// $("body").append(modalHtml);
	// $("#pdfPreviewModal").modal("show");
}

function convertImageToBase64(imageUrl, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(this, 0, 0);

    const base64 = canvas.toDataURL("image/png");
    callback(base64);
  };

  img.onerror = function () {
    console.error("Signature image load failed:", imageUrl);
  };
  img.src = imageUrl;
}


function formatOpenAIText(text) {
    if (!text) return "";
    return text
        .replace(/### (.*)/g, "<h5>$1</h5>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\n\n/g, "<br/><br/>")
        .replace(/\n/g, "<br/>");
}

function getUserInitialsCommon(name, fallback) {
  var defaultValue = fallback || "ST";
  var safeName = $.trim(name || "");

  if (!safeName) return defaultValue;

  var words = safeName.split(/\s+/);

  var first = words[0].charAt(0).toUpperCase();
  var last = words.length > 1 ? words[words.length - 1].charAt(0).toUpperCase() : "";

  return first + last || defaultValue;
}

function getSalutationByGender(gender) {
  if (gender == null || gender === undefined) {
    return "";
  }
  var normalizedGender = String(gender).trim().toLowerCase();
  if (normalizedGender === "male") {
    return "Mr.";
  }else if (normalizedGender === "female") {
    return "Ms.";
  }else if(normalizedGender == "DONOTWANTTOSPECIFY"){
    return "";
  }
  return "";
}

function updateThemeColorVariable(varName, newValue) {
    const $styleTag = $("#themeColor");  // simpler selector
    if($styleTag.length === 0) {
        console.warn("Style tag with id 'themeColor' not found.");
        return;
    }

    const cssText = $styleTag.html();
    // Make regex case-insensitive and allow optional spaces
    const regex = new RegExp(`(--${varName}\\s*:\\s*)([^;]+)`, "i");
    console.log(regex)
    if (regex.test(cssText)) {
        // Replace existing variable value but keep the --varName: part intact
        $styleTag.html(cssText.replace(regex, `$1${newValue}`));
    } else {
        // If variable doesn't exist, add it inside :root
        $styleTag.html(cssText.replace(regex, `$1${newValue}`));
    }
}


function requestToChangeDashboardColorTheme(headerbg, sliderbarBg, rootcss) {
  var requestData = {
    userId: USER_ID,
    colorObj: {
      rootcss: rootcss,
      HEADER_BG: headerbg,
      SIDEBAR_NEVIGATION_BG: sliderbarBg
    }
  };



  $.ajax({
    type: "POST",
    contentType: "application/json",
    url : API_VERSION + "update-theme",
    data: JSON.stringify(requestData),
    dataType: "json",
    success: function (data) {
      if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
        if (data['status'] == '3') {
          redirectLoginPage();
        } else {
          showMessageTheme2(0, data['message'], '', true);
        }
      } else {
        showMessageTheme2(1, data['message'], '', true);
      }
    }
  });
}

function lightenColor(color, percent) {
    // const num = parseInt(color.replace("#", ""), 16);
    // const amt = Math.round(2.55 * percent);
    // const R = Math.min(255, (num >> 16) + amt);
    // const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    // const B = Math.min(255, (num & 0x0000FF) + amt);

    // return "#" + (
    //     0x1000000 +
    //     (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    //     (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    //     (B < 255 ? (B < 1 ? 0 : B) : 255)
    // ).toString(16).slice(1);
    let r = parseInt(color.substring(1,3), 16);
    let g = parseInt(color.substring(3,5), 16);
    let b = parseInt(color.substring(5,7), 16);

    r = Math.round(r + (255 - r) * percent / 100);
    g = Math.round(g + (255 - g) * percent / 100);
    b = Math.round(b + (255 - b) * percent / 100);

    return "#" +
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0');

}

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);

    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}
function getPdfViewerUrl(pdfUrl) {
    return APP_BASE_URL +
        "static/pdfjs/web/viewer.html?file=" +
        encodeURIComponent(APP_BASE_URL + "pdf-proxy?url=" + encodeURIComponent(pdfUrl));
}

// ============================================================
// Script Version Checker — Production Implementation
// ============================================================
// Scheduling flow:
//
//   Login / Dashboard load
//        │
//        ├─ post-reload flag set?  ──YES──► schedule check in 30 min
//        │
//        ├─ VC_KEY_NEXT_AT exists?
//        │       ├─ remaining > 0  ──────► resume with remaining time
//        │       └─ overdue        ──────► run check immediately
//        │
//        └─ fresh login            ──────► schedule check in 5 min
//
//   _runVersionCheck()
//        │
//        ├─ same version           ──────► schedule next check in 30 min
//        │
//        └─ NEW version ───────────────► clear timer → show modal
//                                              │
//                                     user clicks Refresh
//                                              │
//                                    acceptnNewReleaseRequest()
//                                              │
//                                    set post-reload flag → reload()
//                                              │
//                                    (page reloads, flow restarts above)
// ============================================================

var VC_DELAY_FIRST  = 5 * 60 * 1000; // 5 minutes — first check after login
var VC_DELAY_REPEAT = 30 * 60 * 1000; // 30 minutes — every subsequent check
var VC_DEBOUNCE_MS  = 60 * 1000;      // 60 seconds — multi-tab duplicate-run guard

/**
 * Entry point — call this once after login succeeds and the dashboard is ready.
 * Handles fresh logins, mid-session page navigations, and post-reload continuation.
 */
function initVersionChecker() {
  // Only show the new-release notification to STUDENT, TEACHER, and PARENT roles.
  // (Gated server-side — the call to this function is wrapped in a
  // <c:if test="${USER_ROLE eq 'STUDENT' || ...}"> in Dashboard.jsp.)
  vcClearTimer();

  // ── Post-reload case: user clicked Refresh on the update modal ──
  // Schedule the next check 30 minutes from now and exit.
  if (localStorage.getItem(VC_KEY_POST_RELOAD) === 'true') {
    localStorage.removeItem(VC_KEY_POST_RELOAD);
    vcSchedule(VC_DELAY_REPEAT);
    return;
  }

  // ── Resumed session: a next-check timestamp is already stored ──
  // This keeps the schedule alive across page navigations / manual refreshes.
  var nextAt = localStorage.getItem(VC_KEY_NEXT_AT);
  if (nextAt) {
    var remaining = parseInt(nextAt, 10) - Date.now();
    if (remaining > 0) {
      vcSchedule(remaining); // resume with exact remaining time
    } else {
      vcRun();               // overdue — run the check immediately
    }
    return;
  }

  // ── Fresh login: no prior state ──
  vcSchedule(VC_DELAY_FIRST);
}

/**
 * Schedules a version check after `delayMs` milliseconds.
 * Persists the target epoch time so the schedule survives page navigations.
 */
function vcSchedule(delayMs) {
  vcClearTimer();
  localStorage.setItem(VC_KEY_NEXT_AT, Date.now() + delayMs);
  SCRIPTVERSIONCHECKINTERVAL = setTimeout(vcRun, delayMs);
}

/**
 * Clears the pending timer and removes the stored next-check timestamp.
 */
function vcClearTimer() {
  if (SCRIPTVERSIONCHECKINTERVAL) {
    clearTimeout(SCRIPTVERSIONCHECKINTERVAL);
    SCRIPTVERSIONCHECKINTERVAL = null;
  }
  localStorage.removeItem(VC_KEY_NEXT_AT);
}

/**
 * Executes the version check.
 * Multi-tab guard: if another tab ran a check within the debounce window,
 * skip this run and align the next schedule to that tab's timing.
 */
function vcRun() {
  localStorage.removeItem(VC_KEY_NEXT_AT);

  var lastRan = localStorage.getItem(VC_KEY_LAST_RAN);
  if (lastRan) {
    var elapsed = Date.now() - parseInt(lastRan, 10);
    if (elapsed < VC_DEBOUNCE_MS) {
      // Another tab checked recently — align our next check to avoid overlap.
      vcSchedule(VC_DELAY_REPEAT - elapsed);
      return;
    }
  }

  localStorage.setItem(VC_KEY_LAST_RAN, Date.now());
  startScriptVersionChecker();
}

/**
 * Fetches the latest SCRIPT_VERSION and CDN_VERSION from the server.
 *   • Same version  → schedule next check in 30 minutes.
 *   • New version   → stop all timers, show #newReleaseNotificationModal.
 */
function startScriptVersionChecker() {
  var scriptRes = getSettingsByTypeAndKey("CONFIGURATION", "SCRIPT_VERSION", false);
  if (typeof scriptRes === 'string') scriptRes = JSON.parse(scriptRes);
  var SV = scriptRes.data.metaValue;

  var cdnRes = getSettingsByTypeAndKey("CONFIGURATION", "RESOURCES_CDN_URL", false);
  if (typeof cdnRes === 'string') cdnRes = JSON.parse(cdnRes);
  var CDN_V = cdnRes.data.metaValue.split("@")[1];
  var versionObj ={"SCRIPT VERSION":SV, "CDN":CDN_V}
  console.log("Script Version Checker Called", versionObj)
  if (SCRIPT_VERSION !== SV || CDN_V !== CDN_VERSION) {
    // New version available — stop checking while modal is open.
    vcClearTimer();
    $("#newReleaseNotificationModal").modal("show");
  } else {
    // Up to date — schedule the next routine check.
    vcSchedule(VC_DELAY_REPEAT);
  }
}

/**
 * Called when the user clicks the Refresh button inside #newReleaseNotificationModal.
 * Sets a localStorage flag so initVersionChecker() (called after reload) resumes
 * with a 30-minute schedule rather than treating this as a fresh login.
 */
function acceptnNewReleaseRequest() {
  vcClearTimer();
  localStorage.setItem(VC_KEY_POST_RELOAD, 'true');
  location.reload();
}

/**
 * Called when the user clicks the Skip button inside #newReleaseNotificationModal.
 * Dismisses the modal without reloading, and resumes the periodic version check
 * so the user gets prompted again after the next interval.
 */
function skipNewReleaseRequest() {
  $("#newReleaseNotificationModal").modal("hide");
  vcSchedule(VC_DELAY_REPEAT);
}

function isEmailSearchFilterAllowed() {
  if (window.__EMAIL_SEARCH_FILTER_ALLOWED !== undefined) {
    return window.__EMAIL_SEARCH_FILTER_ALLOWED;
  }
  try {
    var response = getSettingsByTypeAndKey('CONFIGURATION', 'EMAIL_SEARCH_FILTER_RIGHTS');
    var parsed = (typeof response === 'string') ? JSON.parse(response) : response;
    var metaValue = (parsed && parsed.data && parsed.data.metaValue != null && parsed.data.metaValue !== '') ? parsed.data.metaValue : '';
    if (metaValue === '' || metaValue === null || metaValue === undefined) {
      window.__EMAIL_SEARCH_FILTER_ALLOWED = false;
      return false;
    }
    var allowedUserIds = metaValue.split(',').map(function(id){ return id.trim(); }).filter(function(id){ return id !== ''; });
    window.__EMAIL_SEARCH_FILTER_ALLOWED = allowedUserIds.length > 0 && allowedUserIds.includes(String(USER_ID));
  } catch(e) {
    window.__EMAIL_SEARCH_FILTER_ALLOWED = false;
  }
  return window.__EMAIL_SEARCH_FILTER_ALLOWED;
}

function copyInvitationText(invitationText) {
  if (!invitationText) {
    showMessageTheme2(0, "Invalid content");
    return;
  }
  copyTextToClipboard(invitationText).then(function(){
    showMessageTheme2(1, "Invitation copied successfully!");
  }).catch(function(){
    showMessageTheme2(0, "Unable to copy invitation");
  });
}

function copyMeetingInvitation(entityId, title, hostExtra) {
  let joinUrl = joinLensUrl(""+entityId);
  if (!joinUrl) {
    showMessageTheme2(0, "Url Invalid");
    return;
  }
  let invitationText = "You are invited to attend the "+title+" Meeting.\n\n"
    +"Topic: "+title+"\n"
    +"Host: "+hostExtra+"\n\n"
    +"Join Meeting: "+joinUrl+"\n\n"
    +"We look forward to your participation.";
  copyInvitationText(invitationText);
}

function copyTextToClipboard(text) {
  if (!text) {
    return Promise.reject(new Error("Text Invalid"));
  }

  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise(function(resolve, reject) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    try {
      var copied = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (copied) {
        resolve();
        return;
      }
      reject(new Error("Copy command failed"));
    } catch (error) {
      document.body.removeChild(textArea);
      reject(error);
    }
  });
}

function copyClassInvitation(subjectName, teacherName, joinUrl) {
  if (!joinUrl) {
    showMessageTheme2(0, "Url Invalid");
    return;
  }
  var invitationText = "You are invited to attend the "+subjectName+" Class Meeting.\n\n"
    +"Topic: "+subjectName+" Class\n"
    +"Host: "+teacherName+"\n\n"
    +"Join Meeting: "+joinUrl+"\n\n"
    +"We look forward to your participation.";
  copyInvitationText(invitationText);
}

function copyScheduleEventInvitation(meetingFor, inviteeMeetingDate, inviteeStartTime, inviteeEndTime, inviteeTimezone, joinUrl) {
  if (!joinUrl) {
    showMessageTheme2(0, "Url Invalid");
    return;
  }
  var invitationText = "You are invited to attend the "+meetingFor+" Meeting.\n\n"
    +"Topic: "+meetingFor+"\n"
    +"Date: "+inviteeMeetingDate+"\n"
    +"Time: "+inviteeStartTime+"\n"
    +"Time zone: "+inviteeTimezone+"\n\n"
    +"Join Meeting: "+joinUrl+"\n\n"
    +"We look forward to your participation.";
  copyInvitationText(invitationText);
}

function getCurrentDateTimeByUserTimeZone(currentTime) {
    currentTime = $.trim(currentTime);

    var parts = currentTime.match(
        /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}) (am|pm)$/i
    );

    var currentDateTimeByUserTimeZone = null;

    if (parts) {
        var year = parseInt(parts[1], 10);
        var month = parseInt(parts[2], 10) - 1;
        var day = parseInt(parts[3], 10);
        var hour = parseInt(parts[4], 10);
        var minute = parseInt(parts[5], 10);
        var second = parseInt(parts[6], 10);
        var ampm = parts[7].toLowerCase();

        if (ampm === "pm" && hour < 12) {
            hour += 12;
        }

        if (ampm === "am" && hour === 12) {
            hour = 0;
        }

        currentDateTimeByUserTimeZone = new Date(
            year,
            month,
            day,
            hour,
            minute,
            second
        );
    }

    // Fallback for the other clock format used on some pages, e.g.
    // "MMM DD, YYYY hh:mm:ss a" ("Aug 31, 2026 04:50:00 am"). Without this the
    // function returned null on those pages, causing inconsistent downstream
    // behaviour (e.g. the activity Join button showing up only sometimes).
    if (!currentDateTimeByUserTimeZone && currentTime && typeof moment === "function") {
        var m = moment(currentTime, [
            "MMM DD, YYYY hh:mm:ss a",
            "MMM DD, YYYY hh:mm a",
            "MMM D, YYYY hh:mm:ss a",
            "MMM D, YYYY hh:mm a"
        ]);
        if (m.isValid()) {
            currentDateTimeByUserTimeZone = m.toDate();
        }
    }

    return currentDateTimeByUserTimeZone;
}