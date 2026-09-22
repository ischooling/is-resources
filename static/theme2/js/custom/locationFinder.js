var defaultLocation='{"as":"AS10029 SHYAM SPECTRA PVT LTD","city":"New Delhi","country":"India","countryCode":"IN","isp":"Shyam Spectra Pvt Ltd","lat":28.6331,"lon":77.2207,"org":"Shyam Spectra Pvt Ltd","query":"125.63.99.243","region":"DL","regionName":"National Capital Territory of Delhi","status":"success","timezone":"Asia/Kolkata","zip":"110055"}';
// ---------------------------------------------------------------------------
// Standalone intl-tel-input helper fallbacks.
//
// locationFinder.js is loaded on MANY light pages (evaluation form, PPC,
// request-demo, common signup, etc.) that do NOT load masterContent.js, where
// the full versions of these helpers live. Without this block those pages throw
// "initPhoneInputV29 is not defined". We define minimal, self-contained versions
// here ONLY when they are not already defined, so masterContent's richer
// versions always win when it is loaded.
// ---------------------------------------------------------------------------
if (typeof window.getIntlTelInputCtor !== "function") {
	window.getIntlTelInputCtor = function () {
		if (typeof window.intlTelInputV29 === "function") { return window.intlTelInputV29; }
		if (typeof window.intlTelInput === "function") { return window.intlTelInput; }
		return null;
	};
}
if (typeof window.itiGetCountry !== "function") {
	window.itiGetCountry = function (iti) {
		if (!iti) { return null; }
		try {
			if (typeof iti.getSelectedCountryData === "function") { return iti.getSelectedCountryData(); }
			if (typeof iti.getSelectedCountry === "function") { return iti.getSelectedCountry(); }
		} catch (e) {}
		return null;
	};
}
if (typeof window.itiSetCountry !== "function") {
	window.itiSetCountry = function (iti, iso2) {
		if (!iti || !iso2) { return; }
		try {
			if (typeof iti.setCountry === "function") { iti.setCountry(iso2); }
			else if (typeof iti.setSelectedCountry === "function") { iti.setSelectedCountry(iso2); }
		} catch (e) {}
	};
}
if (typeof window.itiIsValidNumber !== "function") {
	window.itiIsValidNumber = function (iti) {
		if (!iti) { return null; }
		try {
			if (typeof iti.isValidNumberPrecise === "function") { return iti.isValidNumberPrecise(); }
			if (typeof iti.isValidNumber === "function") { return iti.isValidNumber(); }
		} catch (e) {}
		return null;
	};
}
// URL of the libphonenumber utils bundle. Needed for precise per-country format
// validation (e.g. Singapore numbers must start with 3/6/8/9). Light pages that
// only load locationFinder.js otherwise have NO validation at all.
if (typeof window.INTL_TEL_UTILS_SCRIPT_URL === "undefined") {
	window.INTL_TEL_UTILS_SCRIPT_URL = "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.1.0/js/utils.js";
}
// Loads utils.js once (idempotent) and runs the callback when ready.
if (typeof window.ensureIntlUtilsLoaded !== "function") {
	window.__INTL_UTILS_LOADING = false;
	window.__INTL_UTILS_CBS = [];
	window.ensureIntlUtilsLoaded = function (cb) {
		try {
			var ctor = window.getIntlTelInputCtor();
			// Already available?
			if (ctor && ((ctor.utils) || (window.intlTelInputUtils))) {
				if (typeof cb === "function") { cb(); }
				return;
			}
			if (typeof cb === "function") { window.__INTL_UTILS_CBS.push(cb); }
			if (window.__INTL_UTILS_LOADING) { return; }
			window.__INTL_UTILS_LOADING = true;
			var s = document.createElement("script");
			s.src = window.INTL_TEL_UTILS_SCRIPT_URL;
			s.async = true;
			s.onload = function () {
				window.__INTL_UTILS_LOADING = false;
				var cbs = window.__INTL_UTILS_CBS.slice();
				window.__INTL_UTILS_CBS = [];
				for (var i = 0; i < cbs.length; i++) { try { cbs[i](); } catch (e) {} }
			};
			document.head.appendChild(s);
		} catch (e) {}
	};
}
// True when libphonenumber metadata is loaded (so precise validation works).
if (typeof window.itiUtilsAvailable !== "function") {
	window.itiUtilsAvailable = function () {
		try {
			var ctor = window.getIntlTelInputCtor();
			if (ctor && ctor.utils) { return true; }
			if (window.intlTelInputUtils) { return true; }
		} catch (e) {}
		return false;
	};
}
// Light-page phone-validation toggle. If masterContent's richer version isn't
// present, default to ENABLED (validate). Reads a global flag if the page sets one.
if (typeof window.isPhoneValidationEnabled !== "function") {
	window.isPhoneValidationEnabled = function () {
		try {
			if (typeof PHONE_VALIDATION_ENABLED !== "undefined") {
				return PHONE_VALIDATION_ENABLED === true || PHONE_VALIDATION_ENABLED === "true";
			}
		} catch (e) {}
		return true;
	};
}
// Full country list { name, iso2, dialCode } (version-agnostic).
if (typeof window.itiGetCountryList !== "function") {
	window.itiGetCountryList = function () {
		try {
			var ctor = window.getIntlTelInputCtor();
			if (ctor && typeof ctor.getCountryData === "function") { return ctor.getCountryData(); }
			if (window.intlTelInputGlobals && typeof window.intlTelInputGlobals.getCountryData === "function") {
				return window.intlTelInputGlobals.getCountryData();
			}
		} catch (e) {}
		return [];
	};
}
// Find the country whose dial code a digits-only number starts with (longest match).
if (typeof window.matchCountryByDialCode !== "function") {
	window.matchCountryByDialCode = function (digitsAll) {
		try {
			digitsAll = (digitsAll || "").replace(/\D/g, "");
			if (!digitsAll) { return null; }
			var list = window.itiGetCountryList() || [];
			var best = null, bestLen = 0;
			for (var i = 0; i < list.length; i++) {
				var dc = (list[i].dialCode || "").replace(/\D/g, "");
				if (dc && digitsAll.indexOf(dc) === 0 && dc.length > bestLen) {
					best = list[i]; bestLen = dc.length;
				}
			}
			return best;
		} catch (e) {}
		return null;
	};
}
// Pure phone check (length + format via utils). Mirrors masterContent's version
// with a minimal, self-contained implementation for light pages.
// Returns { valid:true } | { valid:false, reason:'empty'|'length'|'invalid', expectedDigits, enteredDigits, countryName }.
if (typeof window.checkPhoneNumberLength !== "function") {
	window.checkPhoneNumberLength = function (inputEl, iti, isMandatory) {
		if (!inputEl || !iti) { return { valid: true }; }
		if (!window.isPhoneValidationEnabled()) { return { valid: true }; }
		var rawValue = ($(inputEl).val() || "").trim();
		if (rawValue === "") { return isMandatory ? { valid: false, reason: 'empty' } : { valid: true }; }
		var countryData = window.itiGetCountry(iti);
		var countryName = (countryData && countryData.name) ? countryData.name : "the selected country";
		var enteredDigits = rawValue.replace(/\D/g, "");
		// Format + length validation when utils are loaded (validates the number
		// PATTERN, e.g. Singapore must start with 3/6/8/9 — not just the length).
		if (window.itiUtilsAvailable()) {
			var validRes = window.itiIsValidNumber(iti);
			if (validRes === true) { return { valid: true }; }
			if (validRes === false) {
				return { valid: false, reason: 'invalid', enteredDigits: enteredDigits.length, countryName: countryName };
			}
		}
		return { valid: true };
	};
}
if (typeof window.initPhoneInputV29 !== "function") {
	window.initPhoneInputV29 = function (inputElOrId, opts) {
		opts = opts || {};
		var inputEl = (typeof inputElOrId === "string") ? document.getElementById(inputElOrId) : inputElOrId;
		if (!inputEl) { return null; }
		var ctor = window.getIntlTelInputCtor();
		if (!ctor) { return null; }
		// Guard against double initialization. If this input was already inited
		// (e.g. an inline JSP init followed by callLocationAndSelectCountryNew1),
		// destroy the old instance and unwrap the stray .iti container so we don't
		// stack wrappers / show duplicate flags.
		try {
			if (inputEl.intlTelInputInstance) {
				try { inputEl.intlTelInputInstance.destroy(); } catch (e) {}
				inputEl.intlTelInputInstance = null;
			}
			if (window.jQuery) {
				var $existing = window.jQuery(inputEl).closest(".iti");
				if ($existing.length > 0) {
					$existing.find(".iti__flag-container, .iti__country-container").remove();
					window.jQuery(inputEl).unwrap();
				}
			}
		} catch (e) {}
		// Remove any stale maxlength before the library reads the value, so a
		// prefilled "+<dialCode> <national>" string isn't clipped by an old
		// country-based maxlength before normalization. attachPhoneLengthLimit
		// re-applies the correct maxlength afterward.
		try {
			inputEl.removeAttribute("maxlength");
			inputEl.removeAttribute("data-max-digits");
		} catch (e) {}
		var options = {
			classNames: { container: opts.containerClass || "iti-v29" },
			separateDialCode: false,
			// Keep v29 in NATIONAL mode so it never auto-switches the country from
			// the typed number (e.g. Canada -> US). Country changes only via the
			// dropdown.
			numberDisplayFormat: "NATIONAL",
			formatAsYouType: false,
			// strictMode OFF: preserve a leading 0 the user types (v29 strictMode
			// strips it as a trunk prefix). Length capping is handled elsewhere.
			strictMode: false,
			countrySearch: true,
			// Load libphonenumber utils so precise per-country format validation
			// works on light pages (e.g. Singapore must start with 3/6/8/9).
			utilsScript: window.INTL_TEL_UTILS_SCRIPT_URL
		};
		if (opts.allowedNumberTypes) { options.allowedNumberTypes = opts.allowedNumberTypes; }
		var iti = ctor(inputEl, options);
		// Also load utils via our loader as a safety net (in case utilsScript is
		// ignored by the loaded version).
		if (typeof window.ensureIntlUtilsLoaded === "function") { window.ensureIntlUtilsLoaded(); }
		// v16 back-compat shims so existing .setCountry()/.getSelectedCountryData()
		// calls keep working on a v29 instance.
		if (iti && typeof iti.setCountry !== "function" && typeof iti.setSelectedCountry === "function") {
			iti.setCountry = function (iso2) { return iti.setSelectedCountry(iso2); };
		}
		if (iti && typeof iti.getSelectedCountryData !== "function" && typeof iti.getSelectedCountry === "function") {
			iti.getSelectedCountryData = function () { return iti.getSelectedCountry(); };
		}
		var initial = (typeof opts.initialCountry === "undefined") ? "us" : opts.initialCountry;
		// Country selection + value normalization. If the prefilled value carries
		// an explicit "+<dialCode>" prefix, that number's own dial code wins
		// (a saved "+91 8533990022" is India even if initialCountry says UZ).
		// Otherwise the passed initialCountry is the source of truth.
		try {
			var raw = (inputEl.value || "").trim();
			if (raw.charAt(0) === "+") {
				var digitsAll = raw.replace(/\D/g, "");
				var detected = window.itiGetCountry(iti) || {};
				var detDial = (detected.dialCode || "").replace(/\D/g, "");
				if (!detDial || digitsAll.indexOf(detDial) !== 0) {
					var best = window.matchCountryByDialCode(digitsAll);
					if (best) {
						window.itiSetCountry(iti, best.iso2);
						detected = window.itiGetCountry(iti) || best;
						detDial = (detected.dialCode || "").replace(/\D/g, "");
					}
				}
				var national = digitsAll;
				if (detDial && digitsAll.indexOf(detDial) === 0 && digitsAll.length > detDial.length) {
					national = digitsAll.substring(detDial.length);
				}
				if (inputEl.value !== national) { inputEl.value = national; }
			} else {
				if (initial) { window.itiSetCountry(iti, initial); }
				var digitsOnly = raw.replace(/\D/g, "");
				if (raw && inputEl.value !== digitsOnly) { inputEl.value = digitsOnly; }
			}
		} catch (e) {}
		if (typeof window.attachPhoneLengthLimit === "function") {
			window.attachPhoneLengthLimit(inputEl, iti);
		}
		// RE-ASSERT the caller's requested country for shared dial codes (+1:
		// US/CA/...). v29 can default an ambiguous +1 number to US even when we
		// asked for "ca"; force it back to what was requested if they share a
		// dial code (trusts the saved country as-is, no area-code guessing).
		try {
			var _wantIsoLF = (initial || "").toString().toLowerCase();
			if (_wantIsoLF) {
				var _curCcLF = window.itiGetCountry(iti) || {};
				var _curIsoLF = (_curCcLF.iso2 || "").toLowerCase();
				if (_curIsoLF && _curIsoLF !== _wantIsoLF) {
					var _wantDialLF = null, _curDialLF = (_curCcLF.dialCode || "").replace(/\D/g, "");
					var _listLF = window.itiGetCountryList() || [];
					for (var _k = 0; _k < _listLF.length; _k++) {
						if ((_listLF[_k].iso2 || "").toLowerCase() === _wantIsoLF) {
							_wantDialLF = (_listLF[_k].dialCode || "").replace(/\D/g, "");
							break;
						}
					}
					if (_wantDialLF && _wantDialLF === _curDialLF) {
						window.itiSetCountry(iti, _wantIsoLF);
					}
				}
			}
		} catch (e) {}
		if (typeof opts.onCountryChange === "function") {
			var fireSync = function () { opts.onCountryChange(window.itiGetCountry(iti), iti); };
			fireSync();
			inputEl.addEventListener("countrychange", fireSync);
		}
		// Cache the instance on the DOM element so the double-init guard above can
		// find & destroy it on a later re-init.
		try { inputEl.intlTelInputInstance = iti; } catch (e) {}
		return iti;
	};
}

function callLocationDetailsFill(formId, data){
	if(data!=undefined && data !=''){
		if($("#"+formId+" #countryTimezoneId").length){
			$("#countryTimezoneId").val(data.timezone)
		}
		if($("#"+formId+"Alternet #countryTimezoneId").length){
			$("#"+formId+"Alternet #countryTimezoneId").val(data.timezone)
		}
		if($("#"+formId+" #chooseDate").length){
			$("#"+formId+" #chooseDate").datepicker().datepicker("setDate", new Date());
		}
		chooseValueByElement('isdCodeMobileNo', data.country);
		chooseValueByElement('isdCodeWhatsupNo', data.country);
		$("#"+formId+" #location").val(JSON.stringify(data));
		if($("#"+formId+"Alternet #location").length){
			$("#"+formId+"Alternet #location").val($("#"+formId+" #location").val());
		}
	}
}
function callLocationDetails(formId){
	if(LOCATION_SERVICE_BYPASS=='true'){
		callLocationDetailsFill(formId, JSON.parse(DEFAULT_LOCATION))
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			success : function(data) {
				callLocationDetailsFill(formId, data)
			},
			error: function(e){
				if (checkonlineOfflineStatus()) {
					return;
				}
			}
		});
	}
}

function callLocationAndSelectCountry(formId){
	return true;
}
function callLocationAndSelectCountryNewFill(formId, data){
	if($('#'+formId+' #countryTimezoneId').length){
		$('#'+formId+' #countryTimezoneId').select2();
	}
	if(data!=undefined && data !=''){
		if($("#"+formId+" #countryTimezoneId").length){
			$('#countryTimezoneId').val(data.timezone).trigger('change')
		}
		if($("#"+formId+" #chooseDate").length){
			$("#"+formId+" #chooseDate").datepicker().datepicker("setDate", new Date());
		}
		chooseValueByElement('isdCodeMobileNo', data.country);
		chooseValueByElement('isdCodeWhatsupNo', data.country);
		chooseCountryElement('countryId', data.country);
		setTimeout(function(){
			$('#countryId').trigger('change');
		},500)
		$("#"+formId+" #location").val(JSON.stringify(data));
		if($("#"+formId+"Alternet #location").length){
			$("#"+formId+"Alternet #location").val($("#"+formId+" #location").val());
		}
//		if($('#email').is(":disabled") && $('#confirmEmail').is(":disabled")){
//		}else if(SCHOOL_ID ==1 && $("#signupMode").length>0 && ($("#signupMode").val()=='SCHOLARSHIP' || $("#signupMode").val()=='ONE_TO_ONE')){
//		}
		// if(SCHOOL_ID ==1 && moduleId=='STUDENT'){
		// 	checkRequestIsEligibleForEnrollment(formId, moduleId, $("#signupMode").val().trim(), SCHOOL_ID, data.timezone, data.country, $("#email").val());
		// }
	}
}

function callLocationAndSelectCountryNew(formId){
	if(LOCATION_SERVICE_BYPASS=='true'){
		callLocationAndSelectCountryNewFill(formId, JSON.parse(DEFAULT_LOCATION))
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			success : function(data) {
				callLocationAndSelectCountryNewFill(formId, data)
			},
			error: function(e){
				if (checkonlineOfflineStatus()) {
					return;
				}
			}
		});
	}
}

function callLocationAndSelectCountryNew1Fill(formId, type, data,flag,countryCode, countryCodeW){
	createSelect2Element(formId, 'countryTimezoneId');
	var schoolId= $("#schoolId").val();
	if(data!=undefined && data !=''){
		if("admin"==type){
			inputContact = document.querySelector("#userphone");
			itiContcat = initPhoneInputV29(inputContact, {
				initialCountry: ($("#isdCodeMobileNoIcon").val()==null || $("#isdCodeMobileNoIcon").val()=='') ? data.countryCode : $("#isdCodeMobileNoIcon").val(),
				onCountryChange: function (country) {
					$('#isdCodeMobileNoIcon').val(country ? country.iso2 : '');
					$('#isdCodeMobileNo').val(country ? country.dialCode : '');
				}
			});
			clearContactNumberOnCountryChange(inputContact);

			inputContact1 = document.querySelector("#wtspNumber");
			itiContcat1 = initPhoneInputV29(inputContact1, {
				initialCountry: ($('#isdCodeWhatsupNoIcon').val()==null || $('#isdCodeWhatsupNoIcon').val()=='') ? data.countryCode : $("#isdCodeWhatsupNoIcon").val(),
				onCountryChange: function (country) {
					$('#isdCodeWhatsupNoIcon').val(country ? country.iso2 : '');
					$('#isdCodeWhatsupNo').val(country ? country.dialCode : '');
				}
			});
			clearContactNumberOnCountryChange(inputContact1);
			$('#newDateslected').val($('#newDateslected option:first-child').val()).trigger('change');
		}else if("evaluation"==type){
			// Always initialize the phone widgets (regardless of `flag`). `flag`
			// only controls whether we auto-select country/state from geo-IP for a
			// NEW form; a returning user (flag=false, opened via UUID link) still
			// needs the phone widget rendered and validated. The initialCountry
			// expression already prefers a saved isdCode over the geo-IP fallback.
			if(schoolId!=undefined && schoolId==1){
				inputContact = document.querySelector("#studentContactNo");
				if(inputContact){
					itiContcat = initPhoneInputV29(inputContact, {
						initialCountry: ($("#isdCodeStudentIcon").val()==null || $("#isdCodeStudentIcon").val()=='') ? data.countryCode : $("#isdCodeStudentIcon").val(),
						onCountryChange: function (country) {
							$('#isdCodeStudentIcon').val(country ? country.iso2 : '');
							$('#isdCodeStudent').val(country ? country.dialCode : '');
						}
					});
					clearContactNumberOnCountryChange(inputContact);
				}
				inputContact2 = document.querySelector("#wtspNumber");
				if(inputContact2){
					itiContcat2 = initPhoneInputV29(inputContact2, {
						initialCountry: ($('#isdCodeWtspIcon').val()==null || $('#isdCodeWtspIcon').val()=='') ? data.countryCode : $("#isdCodeWtspIcon").val(),
						onCountryChange: function (country) {
							$('#isdCodeWtspIcon').val(country ? country.iso2 : '');
							$('#isdCodeWtsp').val(country ? country.dialCode : '');
						}
					});
					clearContactNumberOnCountryChange(inputContact2);
				}
			}else{
				inputContact = document.querySelector("#studentContactNo");
				if(inputContact){
					itiContcat = initPhoneInputV29(inputContact, {
						initialCountry: ($("#autoDialCode").val()!=null && $("#autoDialCode").val()!='') ? $("#autoDialCode").val() : (($("#isdCodeStudentIcon").val()==null || $("#isdCodeStudentIcon").val()=='') ? data.countryCode : $("#isdCodeStudentIcon").val()),
						onCountryChange: function (country) {
							$('#isdCodeStudentIcon').val(country ? country.iso2 : '');
							$('#isdCodeStudent').val(country ? country.dialCode : '');
						}
					});
					clearContactNumberOnCountryChange(inputContact);
				}
				inputContact2 = document.querySelector("#wtspNumber");
				if(inputContact2){
					itiContcat2 = initPhoneInputV29(inputContact2, {
						initialCountry: ($("#autoDialCode").val()!=null && $("#autoDialCode").val()!='') ? $("#autoDialCode").val() : (($('#isdCodeWtspIcon').val()==null || $('#isdCodeWtspIcon').val()=='') ? data.countryCode : $("#isdCodeWtspIcon").val()),
						onCountryChange: function (country) {
							$('#isdCodeWtspIcon').val(country ? country.iso2 : '');
							$('#isdCodeWtsp').val(country ? country.dialCode : '');
						}
					});
					clearContactNumberOnCountryChange(inputContact2);
				}
			}
		}else{
			if(flag){
				chooseValueByElement('isdCodeMobileNo', data.country);
				chooseValueByElement('isdCodeWhatsupNo', data.country);
			}
		}
		if(flag){
			if($('#countryId').length>0){
				//chooseCountryElement('countryId', data.country);
				if($("#countryId").length){
					if($('#countryId').val()==null || $('#countryId').val()==''){
						$('#countryId').val(data.country).trigger('change')
					}
				}
			}
		}
		if(flag){
			if($('#stateId').length>0){
				//chooseCountryElement('stateId', data.country);
				$('#stateId').val(data.country).trigger('change')
			}
		}
		if("evaluation"==type && schoolId!=undefined && schoolId!=1){
			if($("#autoCountryTimeZoneId").val()!=null && $("#autoCountryTimeZoneId").val()!=''){
				$('#countryTimezoneId').val($("#autoCountryTimeZoneId").val()).trigger('change')
			}
		}else{
			$('#countryTimezoneId').val(data.timezone).trigger('change')
		}
		
		if($("#"+formId+" #chooseDate").length){
			$("#"+formId+" #chooseDate").datepicker().datepicker("setDate", new Date());
			freeslotsList(formId,true,type);
		}
		$("#"+formId+" #location").val(JSON.stringify(data));
		if($("#"+formId+"Alternet #location").length){
			$("#"+formId+"Alternet #location").val($("#"+formId+" #location").val());
		}
	}else{
		defaultIsdCodePopulation(formId, type, countryCode, countryCodeW);
	}
}
function defaultIsdCodePopulation(formId, type, countryCode, countryCodeW){
	if("admin"==type){
	}else if("evaluation"==type){
		inputContact = document.querySelector("#studentContactNo");
		itiContcat = initPhoneInputV29(inputContact, {
			initialCountry: countryCode,
			onCountryChange: function (country) {
				$('#isdCodeStudentIcon').val(country ? country.iso2 : '');
				$('#isdCodeStudent').val(country ? country.dialCode : '');
			}
		});
		clearContactNumberOnCountryChange(inputContact);

		inputContact2 = document.querySelector("#wtspNumber");
		itiContcat2 = initPhoneInputV29(inputContact2, {
			initialCountry: countryCodeW,
			onCountryChange: function (country) {
				$('#isdCodeWtspIcon').val(country ? country.iso2 : '');
				$('#isdCodeWtsp').val(country ? country.dialCode : '');
			}
		});
		clearContactNumberOnCountryChange(inputContact2);
		if("evaluation"==type && schoolId!=undefined && schoolId!=1){
			if($("#autoCountryTimeZoneId").val()!=null && $("#autoCountryTimeZoneId").val()!=''){
				$('#countryTimezoneId').val($("#autoCountryTimeZoneId").val()).trigger('change')
			}
		}
	}else{
		
	}
}
function callLocationAndSelectCountryNew1(formId, type, flag,countryCode, countryCodeW){
	if(countryCode==''){
		countryCode='US';
		if($("#" + formId + " #isdCodeStudent").length>0){
			$("#" + formId + " #isdCodeStudent").val(1);
			$("#" + formId + " #isdCodeStudentIcon").val(countryCode)
		}
	}
	if(countryCodeW==''){
		countryCodeW='US';
		if($("#" + formId + " #isdCodeWtsp").length>0){
			$("#" + formId + " #isdCodeWtsp").val(1);
			$("#" + formId + " #isdCodeWtspIcon").val(countryCodeW)	
		}
	}
	if(LOCATION_SERVICE_BYPASS=='true'){
		callLocationAndSelectCountryNew1Fill(formId, type, JSON.parse(DEFAULT_LOCATION),flag,countryCode, countryCodeW)
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			success : function(data) {
				callLocationAndSelectCountryNew1Fill(formId, type, data,flag,countryCode, countryCodeW)
			},
			error: function(e){
				if (checkonlineOfflineStatus()) {
					return;
				}	
			}
		});
	}
}

// function callLocationAndSelectTimeZoneFillSession(formId, data){
// 	console.log('callLocationAndSelectTimeZoneFillSession data :'+JSON.stringify(data))
// 	if($("#"+formId+" #countryTimezoneId").length){
// 		$("#"+formId+" #countryTimezoneId").select2({});
// 	}
// 	if(data!=undefined && data !=''){
// 		$("#"+formId+" #countryTimezoneId").val(data.timezone).trigger('change')
// 		$("#"+formId+" #location").val(JSON.stringify(data));
// 	}
// }
// function callLocationAndSelectTimeZoneSession(formId){
// 	if(LOCATION_SERVICE_BYPASS=='true'){
// 		callLocationAndSelectTimeZoneFillSession(formId, JSON.parse(DEFAULT_LOCATION))
// 	}else{
// 		$.ajax({
// 			global: false,
// 			type : "GET",
// 			url : PRO_IP_API_URL,
// 			success : function(data) {
// 				callLocationAndSelectTimeZoneFillSession(formId, data)
// 			}
// 		});
// 	}
// }

function callLocationAndSelectTimeZoneFill(formId, data){
	if($("#"+formId+" #countryTimezoneId").length){
		$("#"+formId+" #countryTimezoneId").select2({
			theme: "bootstrap4",
			dropdownParent: "#"+formId,
		});
	}
	if(data!=undefined && data !=''){
		//console.log('callLocationAndSelectTimeZoneFill data :'+JSON.stringify(data))
		$("#"+formId+" #countryTimezoneId").val(data.timezone).trigger('change')
		$("#"+formId+" #location").val(JSON.stringify(data));
	}
}

function callLocationAndSelectTimeZone(formId){
	if(LOCATION_SERVICE_BYPASS=='true'){
		callLocationAndSelectTimeZoneFill(formId, JSON.parse(DEFAULT_LOCATION))
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			success : function(data) {
				callLocationAndSelectTimeZoneFill(formId, data)
			},
			error: function(e){
				if (checkonlineOfflineStatus()) {
					return;
				}
			}
		});
	}
}

function callLocationAndSelectCountryStateCity(formId, type, countryId, stateId, cityId){
	if(LOCATION_SERVICE_BYPASS=='true'){
		callLocationAndSelectCountryStateCityFill(formId, type, JSON.parse(DEFAULT_LOCATION), countryId, stateId, cityId)
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			success : function(data) {
				callLocationAndSelectCountryStateCityFill(formId, type, data, countryId, stateId, cityId)
			},
			error: function(e){
				if (checkonlineOfflineStatus()) {
					return;
				}
			}
		});
	}
}

function callLocationAndSelectCountryStateCityFill(formId, type, data, countryId, stateId, cityId){
	if(data!=undefined && data !=''){
		if("evaluation"==type){
			if($('#'+countryId).length){
				autoSelectElementByValue('countryId', data.country);
				//$('#'+countryId).trigger('change');
				callStates(formId, $('#'+countryId).val(),'' );
				
			}
			if($('#'+stateId).length){
				autoSelectElementByValue('stateId', data.country);
			}
		}
	}
}

function autoSelectElementByValue(elementId, value){
	if($('#'+elementId).length){
		$('#'+elementId+' option').map(function () {
			var currentValue = $(this).text();
			if (currentValue === value){
				return this;
			}
		}).attr('selected', 'selected');
	}
}

function callLocationForPayment(formId){
	if(LOCATION_SERVICE_BYPASS=='true'){
		callLocationForPaymentFill(JSON.parse(DEFAULT_LOCATION))
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			success : function(data) {
				callLocationForPaymentFill(data, formId)
			},
			error: function(e){
				if (checkonlineOfflineStatus()) {
					return;
				}
			}
		});
	}
}
async function callLocationForPaymentFill(data, formId){
	if(data!=undefined && data !=''){
		if(formId != undefined){
			$("#" + formId + " #location").val(JSON.stringify(data));
		}else{
			$("#location").val(JSON.stringify(data));
		}
	}
}

async function callLocationForPaymentPromise() {
    if (LOCATION_SERVICE_BYPASS == 'true') {
        await callLocationForPaymentFill(JSON.parse(DEFAULT_LOCATION));
    } else {
        try {
            const data = await new Promise((resolve, reject) => {
                $.ajax({
                    global: false,
                    type: "GET",
                    url: PRO_IP_API_URL,
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (e) {
                        if (checkonlineOfflineStatus()) {
                            return reject('Offline');
                        }
                        reject(e);
                    }
                });
            });
            await callLocationForPaymentFill(data);
        } catch (e) {
            console.error(e);
        }
    }
}

function getCountryISOCode(){
	var localeISO_Code = navigator.language || navigator.userLanguage; 
	var countryISO = localeISO_Code.split("-")[1]; 
	// console.log("Country ISO:", countryISO.toLowerCase());
	return countryISO.toLowerCase();
}