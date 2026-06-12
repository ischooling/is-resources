function getScheduleEventContent(data, clickFrom, currentPageNo, boxSearchCondition){
	$("#scheduleEventContent").html(cardContent(data,clickFrom, currentPageNo, boxSearchCondition));
	$("#search-button").on("click", function () {
		$("#scheduleEventsSearchForm").stop().slideToggle();
	});
	getAllCounselorList('scheduleEventsSearchForm','counselorName');
	var userId = $('#userId').val();
	if(userId==undefined || userId==null || userId==''){
		userId=USER_ID;
	}
	$('#scheduleEventsSearchForm #counselorName').val(userId);
	getAllEventList('scheduleEventsSearchForm','eventType');
	getAllEventList('scheduleEventsSearchForm','searchBy');
	getAllCountryList('scheduleEventsSearchForm','countryId');
	getAllGrade(SCHOOL_ID, true);
	$("#counselorName").select2({
		theme:"bootstrap4"
	});
	$("#eventType").select2({
		theme:"bootstrap4",
		minimumResultsForSearch: Infinity
	});
	$("#searchBy").select2({
		theme:"bootstrap4",
		minimumResultsForSearch: Infinity
	});
	// $("#eventType option").each(function(){
	// 	if($(this).val() != 5){
	// 		$(this).prop("disabled",true);
	// 	}else{
	// 		$("#eventType").val("5").trigger("change");
	// 	}
	// });
	$("#meetingStatus").select2({
		theme:"bootstrap4",
		minimumResultsForSearch: Infinity
	});
	$("#countryId").select2({
		theme:"bootstrap4"
	});
	$("#learningProgram").select2({
		theme:"bootstrap4"
	});
	$("#gradeId").select2({
		theme:"bootstrap4"
	});
	$("#sortBy").select2({
		theme:"bootstrap4",
		minimumResultsForSearch: Infinity
	});
	$("#withRecordings").select2({
		theme:"bootstrap4",
		minimumResultsForSearch: Infinity
	});
	$("#searchByDate").datepicker({
		format:"M d, yyyy"
	});
	$("#startDate").datepicker({
		format:"M d, yyyy"
	});
	$("#endDate").datepicker({
		format:"M d, yyyy"
	});
	if(typeof refreshCustomFieldState === 'function'){
		refreshCustomFieldState($("#scheduleEventsSearchForm"));
		setTimeout(function(){
			refreshCustomFieldState($("#scheduleEventsSearchForm"));
		}, 0);
	}

	$("#saveFollowup").unbind().bind("click", function(){
		console.log("saveFollowup");
		submitLeadFollowupSave('followupSaveForm','0', 'time-available', true, 'leadFollowupForm');
	});
	
	$("#saveB2BFollowup").unbind().bind("click", function(){
		//console.log("saveB2BFollowup");
		submitLeadFollowupSave('followupB2BSaveForm','0', 'time-available', true,'leadFollowupB2BForm','','');
	});


	$('.tentative_date').css( "display", "none" );
	
	

}


function cardContent(data,clickFrom,currentPageNo,boxSearchCondition){
	var html =
		'<div class="card-header">'
			+'<h5 class="m-0 text-dark font-weight-bold text-capitalize">Scheduled Events</h5>'
			+'<div class="btn-actions-pane-right text-capitalize">'
				+'<button id="search-button" class="btn btn-primary mr-2">'
					+'<i class="fa fa-search mr-2"></i><span class="font-weight-semi-bold text-white fsize-1">Advance Search</span>'
				+'</button>'
				// +'<button id="search-button" class="btn btn-danger " onclick="$(\'#moveEventModal\').modal(\'show\')">'
				// 	+'<span class="font-weight-semi-bold text-white fsize-1">Move</span>'
				// +'</button>'
			+'</div>'
		+'</div>'
		+'<div class="card-body p-2">'
			+studentEnrollmentFilterForm()
			+'<div class="full" id="scheduleEventThumbAndTableDate">'
			+'</div>'
			// +scheduleEventthumb(data)
			// +scheduleEventListDetails(data.eventDetails,clickFrom,currentPageNo, boxSearchCondition)
			// +moveEventModal()
			+'<div class="full" id="updateModalWrapper">'
			+'</div>'
			+'<div class="full" id="confirmeUpdateModalWrapper">'
			+'</div>'
		+'</div>';
	return html;
}

function studentEnrollmentFilterForm(data){
	$("#scheduleEventPageCustomFieldCss").remove();
	if($("#scheduleEventPageCustomFieldCss").length < 1){
		$("<style id='scheduleEventPageCustomFieldCss'>")
		.prop("type", "text/css")
		.html(`
		  /* ============================================================
		     PAGE-SCOPED FLOATING-LABEL DESIGN for Schedule Events page.
		     Scoped to this page's form + its modals only.
		     Does NOT touch other pages.
		  ============================================================ */
		  #scheduleEventsSearchForm .custom-field,
		  #updateSystemTraningModal .custom-field,
		  #confirmeUpdateSystemTraningModal .custom-field,
		  #moveEventModal .custom-field,
		  #moveCounselorInScheduleEventModal .custom-field{
			position:relative;
			width:100%;
			margin-bottom:18px;
			padding:0 !important;
			display:block;
			overflow:visible;
		  }

		  /* Inputs / selects / textareas base */
		  #scheduleEventsSearchForm .custom-field > input.form-control,
		  #scheduleEventsSearchForm .custom-field > input.form-control-sm,
		  #scheduleEventsSearchForm .custom-field > select.form-control,
		  #scheduleEventsSearchForm .custom-field > select.form-control-sm,
		  #scheduleEventsSearchForm .custom-field > textarea.form-control,
		  #updateSystemTraningModal .custom-field > input.form-control,
		  #updateSystemTraningModal .custom-field > select.form-control,
		  #updateSystemTraningModal .custom-field > textarea.form-control,
		  #moveEventModal .custom-field > select.form-control,
		  #moveCounselorInScheduleEventModal .custom-field > select.form-control{
			width:100% !important;
			height:44px !important;
			padding:5px 16px !important;
			border:2px solid #cfd4dc !important;
			border-radius:6px !important;
			background-color:#fff !important;
			color:#4b5563 !important;
			font-size:14px !important;
			outline:none !important;
			transition:all .25s ease;
			box-shadow:none !important;
		  }
		  #scheduleEventsSearchForm .custom-field > input.form-control::placeholder,
		  #scheduleEventsSearchForm .custom-field > input.form-control-sm::placeholder,
		  #updateSystemTraningModal .custom-field > input.form-control::placeholder{
			color:transparent !important;
		  }

		  /* Date-range pair inside one custom-field */
		  #scheduleEventsSearchForm .custom-field > .d-flex > input.form-control,
		  #scheduleEventsSearchForm .custom-field > .d-flex > input.form-control-sm{
			width:100% !important;
			height:44px !important;
			padding:5px 12px !important;
			border:2px solid #cfd4dc !important;
			border-radius:6px !important;
			background-color:#fff !important;
			color:#4b5563 !important;
			font-size:14px !important;
			outline:none !important;
		  }
		  #scheduleEventsSearchForm .custom-field > .d-flex > input.form-control::placeholder,
		  #scheduleEventsSearchForm .custom-field > .d-flex > input.form-control-sm::placeholder{
			color:transparent !important;
		  }

		  /* Hide native arrow on the underlying <select> that select2 wraps */
		  #scheduleEventsSearchForm .custom-field > select.form-control,
		  #scheduleEventsSearchForm .custom-field > select.form-control-sm,
		  #updateSystemTraningModal .custom-field > select.form-control,
		  #moveEventModal .custom-field > select.form-control,
		  #moveCounselorInScheduleEventModal .custom-field > select.form-control{
			-webkit-appearance:none;
			-moz-appearance:none;
			appearance:none;
			background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 16 16'%3E%3Cpath d='M3 6l5 5 5-5' stroke='%239ca3af' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
			background-repeat:no-repeat;
			background-position:right 14px center;
			padding-right:40px !important;
		  }

		  /* Select2 container width */
		  #scheduleEventsSearchForm .custom-field .select2-container,
		  #updateSystemTraningModal .custom-field .select2-container,
		  #moveEventModal .custom-field .select2-container,
		  #moveCounselorInScheduleEventModal .custom-field .select2-container{
			width:100% !important;
			min-height:44px;
			height:auto !important;
			position:relative;
			z-index:1;
		  }

		  /* Select2 SINGLE — bulletproof vertical centering */
		  #scheduleEventsSearchForm .custom-field .select2-container .select2-selection--single,
		  #updateSystemTraningModal .custom-field .select2-container .select2-selection--single,
		  #moveEventModal .custom-field .select2-container .select2-selection--single,
		  #moveCounselorInScheduleEventModal .custom-field .select2-container .select2-selection--single{
			height:44px !important;
			min-height:44px !important;
			border:2px solid #cfd4dc !important;
			border-radius:6px !important;
			background-color:#fff !important;
			padding:0 !important;
			margin:0 !important;
			display:flex !important;
			align-items:center !important;
			box-sizing:border-box !important;
			outline:none !important;
			transition:all .25s ease;
		  }
		  #scheduleEventsSearchForm .custom-field .select2-selection--single .select2-selection__rendered,
		  #updateSystemTraningModal .custom-field .select2-selection--single .select2-selection__rendered,
		  #moveEventModal .custom-field .select2-selection--single .select2-selection__rendered,
		  #moveCounselorInScheduleEventModal .custom-field .select2-selection--single .select2-selection__rendered{
			color:#4b5563 !important;
			font-size:14px !important;
			line-height:40px !important;
			padding:0 40px 0 14px !important;
			margin:0 !important;
			display:block !important;
			flex:1 1 auto !important;
			height:40px !important;
			width:100% !important;
			white-space:nowrap !important;
			overflow:hidden !important;
			text-overflow:ellipsis !important;
			box-sizing:border-box !important;
		  }
		  #scheduleEventsSearchForm .custom-field .select2-selection--single .select2-selection__placeholder,
		  #updateSystemTraningModal .custom-field .select2-selection--single .select2-selection__placeholder,
		  #moveEventModal .custom-field .select2-selection--single .select2-selection__placeholder,
		  #moveCounselorInScheduleEventModal .custom-field .select2-selection--single .select2-selection__placeholder{
			color:transparent !important;
		  }
		  #scheduleEventsSearchForm .custom-field .select2-selection--single .select2-selection__arrow,
		  #updateSystemTraningModal .custom-field .select2-selection--single .select2-selection__arrow,
		  #moveEventModal .custom-field .select2-selection--single .select2-selection__arrow,
		  #moveCounselorInScheduleEventModal .custom-field .select2-selection--single .select2-selection__arrow{
			height:42px !important;
			width:30px !important;
			top:0 !important;
			right:0 !important;
			position:absolute !important;
			pointer-events:none;
		  }

		  /* Select2 MULTI */
		  #scheduleEventsSearchForm .custom-field .select2-container .select2-selection--multiple{
			min-height:44px !important;
			border:2px solid #cfd4dc !important;
			border-radius:6px !important;
			background-color:#fff !important;
			padding:3px 8px !important;
			cursor:text;
		  }
		  #scheduleEventsSearchForm .custom-field .select2-selection--multiple .select2-selection__rendered{
			display:flex !important;
			flex-wrap:wrap !important;
			align-items:center !important;
			gap:4px !important;
			padding:0 !important;
			margin:0 !important;
			line-height:normal !important;
			color:#4b5563 !important;
			width:100% !important;
			list-style:none !important;
			min-height:34px !important;
		  }
		  #scheduleEventsSearchForm .custom-field .select2-selection--multiple .select2-selection__choice{
			border:1px solid #bfdbfe !important;
			border-radius:999px !important;
			background:#eff6ff !important;
			color:#1d4ed8 !important;
			padding:1px 10px 1px 24px !important;
			margin:2px 0 !important;
			font-size:12px !important;
			line-height:20px !important;
			position:relative !important;
			max-width:100%;
		  }
		  #scheduleEventsSearchForm .custom-field .select2-selection--multiple .select2-selection__choice__remove{
			color:#1d4ed8 !important;
			font-size:14px !important;
			font-weight:bold !important;
			position:absolute !important;
			left:8px !important;
			top:50% !important;
			transform:translateY(-50%) !important;
			border:0 !important;
			background:transparent !important;
			padding:0 !important;
			margin:0 !important;
			line-height:1 !important;
		  }
		  #scheduleEventsSearchForm .custom-field .select2-selection--multiple .select2-search--inline,
		  #scheduleEventsSearchForm .custom-field .select2-selection--multiple .select2-search{
			display:inline-flex !important;
			align-items:center !important;
			margin:0 !important;
			padding:0 !important;
			flex:1 1 60px !important;
			min-width:60px !important;
		  }
		  #scheduleEventsSearchForm .custom-field .select2-selection--multiple .select2-search__field{
			width:100% !important;
			min-height:28px !important;
			height:28px !important;
			line-height:28px !important;
			margin:0 !important;
			padding:0 4px !important;
			color:#4b5563 !important;
			font-size:14px !important;
			box-shadow:none !important;
			border:0 !important;
			background:transparent !important;
		  }
		  #scheduleEventsSearchForm .custom-field .select2-selection--multiple .select2-search__field::placeholder{
			color:transparent !important;
		  }

		  /* Dropdown options always visible (override transparent inheritance) */
		  #scheduleEventsSearchForm .custom-field select option,
		  #scheduleEventsSearchForm .custom-field select optgroup,
		  #updateSystemTraningModal .custom-field select option,
		  #moveEventModal .custom-field select option,
		  #moveCounselorInScheduleEventModal .custom-field select option{
			color:#4b5563 !important;
			background-color:#fff !important;
		  }

		  /* ===== Label: default CENTERED (placeholder mode) ===== */
		  #scheduleEventsSearchForm .custom-field > label,
		  #updateSystemTraningModal .custom-field > label,
		  #confirmeUpdateSystemTraningModal .custom-field > label,
		  #moveEventModal .custom-field > label,
		  #moveCounselorInScheduleEventModal .custom-field > label{
			position:absolute !important;
			left:10px !important;
			top:50% !important;
			transform:translateY(-50%) !important;
			margin:0 !important;
			padding:0 6px !important;
			background:#fff !important;
			color:#9ca3af !important;
			font-size:14px !important;
			font-weight:normal !important;
			line-height:1.2 !important;
			pointer-events:none !important;
			transition:all .2s ease !important;
			z-index:2 !important;
			max-width:calc(100% - 30px);
			white-space:nowrap;
			overflow:hidden;
			text-overflow:ellipsis;
		  }

		  /* ===== Label FLOATED — classic outlined Material design (label sits ON the top
		     border, half above / half below, white background creating the notch).
		     z-index stays LOW (3) so an open select2 dropdown panel always sits above it.
		     The JSP at TimeAvailability.jsp sets .select2-container--open to z-index:999999,
		     and the dropdown panel defaults to ~1051 — both are way above our label. */
		  #scheduleEventsSearchForm .custom-field:has(> input:focus) > label,
		  #scheduleEventsSearchForm .custom-field:has(> input:not(:placeholder-shown)) > label,
		  #scheduleEventsSearchForm .custom-field:has(> input[value]:not([value=""])) > label,
		  #scheduleEventsSearchForm .custom-field:has(> select:focus) > label,
		  #scheduleEventsSearchForm .custom-field:has(> select > option:checked:not([value=""])) > label,
		  #scheduleEventsSearchForm .custom-field:has(.select2-container--focus) > label,
		  #scheduleEventsSearchForm .custom-field:has(.select2-container--open) > label,
		  #scheduleEventsSearchForm .custom-field:has(.select2-selection--multiple .select2-selection__choice) > label,
		  #scheduleEventsSearchForm .custom-field:has(> .d-flex > input:focus) > label,
		  #scheduleEventsSearchForm .custom-field:has(> .d-flex > input:not(:placeholder-shown)) > label,
		  #scheduleEventsSearchForm .custom-field:has(> .d-flex > input[value]:not([value=""])) > label,
		  #scheduleEventsSearchForm .custom-field.has-value > label,
		  #updateSystemTraningModal .custom-field:has(> input:focus) > label,
		  #updateSystemTraningModal .custom-field:has(> input:not(:placeholder-shown)) > label,
		  #updateSystemTraningModal .custom-field:has(> input[value]:not([value=""])) > label,
		  #updateSystemTraningModal .custom-field:has(> select:focus) > label,
		  #updateSystemTraningModal .custom-field:has(> select > option:checked:not([value=""])) > label,
		  #updateSystemTraningModal .custom-field:has(.select2-container--focus) > label,
		  #updateSystemTraningModal .custom-field:has(.select2-container--open) > label,
		  #updateSystemTraningModal .custom-field.has-value > label,
		  #moveEventModal .custom-field:has(> select:focus) > label,
		  #moveEventModal .custom-field:has(> select > option:checked:not([value=""])) > label,
		  #moveEventModal .custom-field:has(.select2-container--focus) > label,
		  #moveEventModal .custom-field:has(.select2-container--open) > label,
		  #moveEventModal .custom-field.has-value > label,
		  #moveCounselorInScheduleEventModal .custom-field:has(> select:focus) > label,
		  #moveCounselorInScheduleEventModal .custom-field:has(> select > option:checked:not([value=""])) > label,
		  #moveCounselorInScheduleEventModal .custom-field:has(.select2-container--focus) > label,
		  #moveCounselorInScheduleEventModal .custom-field:has(.select2-container--open) > label,
		  #moveCounselorInScheduleEventModal .custom-field.has-value > label{
			top:0 !important;
			transform:translateY(-50%) !important;
			font-size:11px !important;
			font-weight:600 !important;
			color:#007bff !important;
			line-height:1 !important;
			padding:0 6px !important;
			background:#fff !important;
			z-index:3 !important;
		  }

		  /* ============================================================
		     Force overflow:visible on the wrapping containers so the floated
		     label (which extends ~6px above the field's top border) is not
		     clipped by Bootstrap's .card { overflow:hidden } or any other
		     ancestor on this page. Scoped only to the containers that wrap
		     our specific form (#scheduleEventsSearchForm) or its modals.
		  ============================================================ */
		  .card:has(#scheduleEventsSearchForm),
		  .card:has(#scheduleEventsSearchForm) > .card-body,
		  .card:has(#scheduleEventsSearchForm) .tab-content,
		  .card:has(#scheduleEventsSearchForm) .tab-pane,
		  .main-card:has(#scheduleEventContent),
		  .main-card:has(#scheduleEventContent) > .card-body,
		  .main-card:has(#scheduleEventContent) .tab-content,
		  .main-card:has(#scheduleEventContent) .tab-pane,
		  #scheduleEventContent,
		  #scheduleEventContent > .card-body,
		  #updateSystemTraningModal .modal-content,
		  #updateSystemTraningModal .modal-body,
		  #moveEventModal .modal-content,
		  #moveEventModal .modal-body,
		  #moveCounselorInScheduleEventModal .modal-content,
		  #moveCounselorInScheduleEventModal .modal-body{
			overflow:visible !important;
		  }

		  /* Same low z-index for the un-floated (centered placeholder) label too */
		  #scheduleEventsSearchForm .custom-field > label,
		  #updateSystemTraningModal .custom-field > label,
		  #confirmeUpdateSystemTraningModal .custom-field > label,
		  #moveEventModal .custom-field > label,
		  #moveCounselorInScheduleEventModal .custom-field > label{
			z-index:2 !important;
		  }

		  /* Z-INDEX STACKING — explained:
		     • Default labels:                z-index 3  (low; any dropdown panel can sit above)
		     • When this field's own select2 is OPEN, the JSP forces the container
		       (.select2-container--open) to 999999 — that closed box would cover
		       the BOTTOM HALF of our label (the part inside the field) and the
		       notch effect breaks. So when THIS field is open, bump THIS label
		       to 1000000 — JUST above the container. Other fields' labels stay
		       at 3, untouched.
		     • Dropdown PANEL (.select2-dropdown, appended to <body>) is forced to
		       1000001 so it always sits above any label, including the bumped-open
		       one. This prevents another field's open dropdown from being punched
		       through by a neighboring field's label. */
		  /* Open-state label bump — covers BOTH the empty-open case AND the
		     has-value-open case (when user re-opens after selecting). The
		     .has-value + :has(.select2-container--open) combo gets an even more
		     specific rule (3 classes) to definitively beat the floated-state
		     rule which has 2 classes (.custom-field.has-value). MAX z-index. */
		  #scheduleEventsSearchForm .custom-field:has(.select2-container--open) label,
		  #scheduleEventsSearchForm .custom-field.has-value:has(.select2-container--open) label,
		  #scheduleEventsSearchForm .custom-field.has-value:has(.select2-container--open) > label,
		  #scheduleEventsSearchForm .input-group.custom-field:has(.select2-container--open) label,
		  #scheduleEventsSearchForm .input-group.custom-field.has-value:has(.select2-container--open) label,
		  #updateSystemTraningModal .custom-field:has(.select2-container--open) label,
		  #updateSystemTraningModal .custom-field.has-value:has(.select2-container--open) label,
		  #updateSystemTraningModal .custom-field.has-value:has(.select2-container--open) > label,
		  #moveEventModal .custom-field:has(.select2-container--open) label,
		  #moveEventModal .custom-field.has-value:has(.select2-container--open) label,
		  #moveEventModal .custom-field.has-value:has(.select2-container--open) > label,
		  #moveCounselorInScheduleEventModal .custom-field:has(.select2-container--open) label,
		  #moveCounselorInScheduleEventModal .custom-field.has-value:has(.select2-container--open) label,
		  #moveCounselorInScheduleEventModal .custom-field.has-value:has(.select2-container--open) > label{
			z-index:2147483646 !important;
			position:absolute !important;
		  }
		  /* ONLY the dropdown PANEL gets the super-high z-index, just above the label.
		     DO NOT bump .select2-container--open itself — its closed field box
		     would cover the label's bottom half and break the notch effect. */
		  .select2-dropdown,
		  .select2-container .select2-dropdown,
		  body > .select2-container--open .select2-dropdown,
		  .select2-container--bootstrap4 .select2-dropdown{
			z-index:2147483647 !important;
		  }

		  /* Active blue border when focused / has value / open */
		  #scheduleEventsSearchForm .custom-field:has(> input:focus) > input,
		  #scheduleEventsSearchForm .custom-field:has(> input:not(:placeholder-shown)) > input,
		  #scheduleEventsSearchForm .custom-field:has(> input[value]:not([value=""])) > input,
		  #scheduleEventsSearchForm .custom-field:has(> select:focus) > select,
		  #scheduleEventsSearchForm .custom-field:has(> select > option:checked:not([value=""])) > select,
		  #scheduleEventsSearchForm .custom-field:has(.select2-container--focus) .select2-selection,
		  #scheduleEventsSearchForm .custom-field:has(.select2-container--open) .select2-selection,
		  #scheduleEventsSearchForm .custom-field:has(.select2-selection--multiple .select2-selection__choice) .select2-selection,
		  #scheduleEventsSearchForm .custom-field.has-value > input,
		  #scheduleEventsSearchForm .custom-field.has-value > select,
		  #scheduleEventsSearchForm .custom-field.has-value .select2-selection,
		  #scheduleEventsSearchForm .custom-field:has(> .d-flex > input:focus) > .d-flex > input,
		  #scheduleEventsSearchForm .custom-field:has(> .d-flex > input:not(:placeholder-shown)) > .d-flex > input,
		  #scheduleEventsSearchForm .custom-field:has(> .d-flex > input[value]:not([value=""])) > .d-flex > input,
		  #updateSystemTraningModal .custom-field:has(> input:focus) > input,
		  #updateSystemTraningModal .custom-field:has(> input:not(:placeholder-shown)) > input,
		  #updateSystemTraningModal .custom-field:has(> select:focus) > select,
		  #updateSystemTraningModal .custom-field:has(> select > option:checked:not([value=""])) > select,
		  #updateSystemTraningModal .custom-field:has(.select2-container--focus) .select2-selection,
		  #updateSystemTraningModal .custom-field:has(.select2-container--open) .select2-selection,
		  #updateSystemTraningModal .custom-field.has-value .select2-selection,
		  #moveEventModal .custom-field:has(> select:focus) > select,
		  #moveEventModal .custom-field:has(> select > option:checked:not([value=""])) > select,
		  #moveEventModal .custom-field:has(.select2-container--focus) .select2-selection,
		  #moveEventModal .custom-field:has(.select2-container--open) .select2-selection,
		  #moveCounselorInScheduleEventModal .custom-field:has(.select2-container--focus) .select2-selection,
		  #moveCounselorInScheduleEventModal .custom-field:has(.select2-container--open) .select2-selection{
			border-color:#007bff !important;
		  }

		  /* Hide rendered text when placeholder option is selected (no double text) */
		  #scheduleEventsSearchForm .custom-field:has(> select > option:checked[value=""]) .select2-selection__rendered,
		  #updateSystemTraningModal .custom-field:has(> select > option:checked[value=""]) .select2-selection__rendered,
		  #moveEventModal .custom-field:has(> select > option:checked[value=""]) .select2-selection__rendered,
		  #moveCounselorInScheduleEventModal .custom-field:has(> select > option:checked[value=""]) .select2-selection__rendered{
			color:transparent !important;
		  }

		  /* Reset Bootstrap input-group quirks inside our custom-field on this page */
		  #scheduleEventsSearchForm .input-group.custom-field{
			flex-wrap:nowrap;
			display:block !important;
		  }
		`)
		.appendTo("head");
	}

	var html =
			'<form id="scheduleEventsSearchForm" class="custom-field-scope" style="display:none">'
				+'<div class="border rounded-10 pb-1 pt-4 px-4  mb-4 custom-field-scope" style="border-color: #ABA8A8;">'
					+'<div class="row custom-field-scope">'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
								+'<select class="form-control select-first-value" name="counselorName" id="counselorName"></select>'
								+'<label for="counselorName" class="font-weight-semi-bold">Select Counselor</label>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
								+'<select class="form-control select-first-value" name="eventType" id="eventType"></select>'
								+'<label for="eventType" class="font-weight-semi-bold">Select Event Type</label>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
								+'<select class="form-control" name="meetingStatus" id="meetingStatus">'
									+'<option value="">Select Status</option>'
									+'<option value="PENDING">Pending</option>'
									+'<option value="COMPLETED">Completed</option>'
									+'<option value="RESCHEDULE">Reschedule</option>'
									+'<option value="CANCELLED">Cancelled</option>'
									+'<option value="NOTATTENDED">Did not attend Meeting</option>'
								+'</select>'
								+'<label for="meetingStatus" class="font-weight-semi-bold">Meeting Status</label>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
								+'<input class="form-control-sm form-control" type="text" name="inviteeName" id="inviteeName" placeholder=" ">'
								+'<label for="inviteeName" class="font-weight-semi-bold">Invitee Name</label>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
								+'<input class="form-control-sm form-control" type="text" name="inviteePhoneNo" id="inviteePhoneNo" placeholder=" ">'
								+'<label for="inviteePhoneNo" class="font-weight-semi-bold">Invitee Phone No.</label>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
								+'<input class="form-control-sm form-control" type="email"  name="inviteeEmail" id="inviteeEmail" placeholder=" ">'
								+'<label for="inviteeEmail" class="font-weight-semi-bold">Invitee Email</label>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
								+'<select class="form-control-sm form-control" name="Id" id="countryId">'
								+'</select>'
								+'<label for="countryId" class="font-weight-semi-bold">Select Country</label>'
							+'</div>'
						+'</div>'
						// +'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
						// 	+'<label class="font-weight-semi-bold">Learning Program</label>'
						// 	+'<select class="form-control-sm form-control" name="learningProgram" id="learningProgram">'
						// 		+getLearningProgramContent(SCHOOL_ID)
						// 	+'</select>'
						// +'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
								+'<select class="form-control" name="gradeId" id="gradeId"></select>'
								+'<label for="gradeId" class="font-weight-semi-bold">Grade</label>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
							// +'<input class="form-control datepicker" type="text"  name="searchByDate" id="searchByDate">'
								+'<select class="form-control" name="searchBy" id="searchBy">'
								+'</select>'
								+'<label for="searchBy" class="font-weight-semi-bold">Search by</label>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
								+'<div class="d-flex" style="gap: 8px;">'
									+'<input class="form-control-sm form-control datepicker" type="text" name="startDate" id="startDate" readonly onkeydown="return false" placeholder=" ">'
									+'<input class="form-control-sm form-control datepicker" type="text" name="endDate" id="endDate" readonly onkeydown="return false" placeholder=" ">'
								+'</div>'
								+'<label class="font-weight-semi-bold">Date Range</label>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
								+'<select class="form-control" name="sortBy" id="sortBy">'
									+'<option value="">Select Option</option>'
									+'<option value="ASC">Ascending</option>'
									+'<option value="DESC">Descending</option>'
								+'</select>'
								+'<label for="sortBy" class="font-weight-semi-bold">Sort By</label>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
								+'<select class="form-control" name="withRecordings" id="withRecordings">'
									+'<option value="">Select Option</option>'
									+'<option value="Y">Yes</option>'
									+'<option value="N">No</option>'
								+'</select>'
								+'<label for="withRecordings" class="font-weight-semi-bold">With Recordings</label>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
								+'<input class="form-control-sm form-control" type="text" name="pageSize" id="pageSize" value="10" placeholder=" ">'
								+'<label for="pageSize" class="font-weight-semi-bold">Page Size</label>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2 ml-auto">'
							+'<label class="full">&nbsp;</label>'
							+'<div class="d-flex" style="gap: 10px;">'
								+'<a href="javascript:void(0)" class="btn btn-success w-100 py-2" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\',\'advance-search\',1,\'ADV\',\'demoCountTotal\');">'
									+'<i class="fa fa-search"></i>&nbsp;Search'
								+'</a>'
								+'<a href="javascript:void(0)" class="btn btn-danger w-100" onclick="scheduleEventFormReset(\'scheduleEventsSearchForm\');">'
									+'<i class="fa fa-undo"></i>&nbsp;'
									+'<span class="ml-1">Reset</span>'
								+'</a>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</form>';
		return html;
}

function scheduleEventthumb(data){
	var html =
		'<div class="col-12">'
			+'<div class="row mt-2">'
				+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 px-1">'
					+'<div class="full p-2 bg-light-orange border border-orange rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm text-orange">'
						+'<span class="line-left bg-orange d-inline-block position-absolute rounded-10"></span>'
						+'<p class="m-0 font-12"><b>Today'+"'s"+' Meeting</b></p>'
						+'<p class="m-0">'
							+'<b>';
								if(data.demoCountToday == 0){
									html+='<span>'+(data.demoCountToday != null? data.demoCountToday:(data.demoCountToday != undefined? data.demoCountToday:"&nbsp;"))+'</span>'
								}else{
									html+='<a href="javascript:void(0)" class="text-orange" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\',\'advance-search\',1,\'CD\', \'demoCountToday\');">'+(data.demoCountToday != null? data.demoCountToday:(data.demoCountToday != undefined? data.demoCountToday:"&nbsp;"))+'</a>'
								}
							html+='</b>'	
						+'</p>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 px-1">'
					+'<div class="full p-2 bg-light-success border border-success rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm text-success">'
						+'<span class="line-left bg-success d-inline-block position-absolute rounded-10"></span>'
						+'<p class="m-0 font-12"><b>Total Meeting</b></p>'
						+'<p class="m-0">'
							+'<b>';
							if(data.demoCountTotal == 0){
								html+='<span>'+(data.demoCountTotal != null? data.demoCountTotal:(data.demoCountTotal != undefined? data.demoCountTotal:"&nbsp;"))+'</span>'
							}else{
								html+='<a href="javascript:void(0)" class="text-success" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\',\'advance-search\',1,\'TD\',\'demoCountTotal\');">'+(data.demoCountTotal != null? data.demoCountTotal:(data.demoCountTotal != undefined? data.demoCountTotal:"&nbsp;"))+'</a>'
							}
						html+='</b>'
						+'</p>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 px-1">'
					+'<div class="full p-2 bg-light-pink border border-pink rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm text-pink">'
						+'<span class="line-left bg-pink d-inline-block position-absolute rounded-10"></span>'
						+'<p class="m-0 font-12"><b>Meeting Pending</b></p>'
						+'<p class="m-0">'
							+'<b>';
								if(data.demoCountPending == 0){
									html+='<span>'+(data.demoCountPending != null? data.demoCountPending:(data.demoCountPending != undefined? data.demoCountPending:"&nbsp;"))+'</span>'
								}else{
									html+='<a href="javascript:void(0)" class="text-pink" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\',\'advance-search\',1,\'DP\',\'demoCountPending\');">'+(data.demoCountPending != null? data.demoCountPending:(data.demoCountPending != undefined? data.demoCountPending:"&nbsp;"))+'</a>'
								}
							html+='</b>'
						+'</p>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 px-1">'
					+'<div class="full p-2 bg-light-alternate border border-alternate rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm text-alternate">'
						+'<span class="line-left bg-alternate d-inline-block position-absolute rounded-10"></span>'
						+'<p class="m-0 font-12"><b>Meeting Completed</b></p>'
						+'<p class="m-0">'
							+'<b>';
								if(data.demoCountCompleted == 0){
									html+='<span>'+(data.demoCountCompleted != null? data.demoCountCompleted:(data.demoCountCompleted != undefined? data.demoCountCompleted:"&nbsp;"))+'</span>'
								}else{
									html+='<a href="javascript:void(0)" class="text-alternate" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\',\'advance-search\',1,\'DC\',\'demoCountCompleted\');">'+(data.demoCountCompleted != null? data.demoCountCompleted:(data.demoCountCompleted != undefined? data.demoCountCompleted:"&nbsp;"))+'</a>'
								}
							html+='</b>'
						+'</p>'
					+'</div>'
				+'</div>'
				
			+'</div>'
		+'</div>';
	return html;
}
function scheduleEventListDetails(data, clickFrom, currentPage, boxSearchCondition, showPagination, countType,remarkMendatory,minRemarkCount){
	var getRecordingLimit = getSettingsByTypeAndKey("CONFIGURATION", "SHOW_RECORDINGS_LIMIT");
    getRecordingLimit = JSON.parse(getRecordingLimit);
    var recordingLimit = getRecordingLimit.data.metaValue;
    var pastDateLimit = new Date();
    pastDateLimit.setDate(pastDateLimit.getDate() - recordingLimit);
	var html = 
			'<div class="full overflow-auto" id="">';
				if(data != null && data != undefined && data != ""){
					$.each(data, function(key, item){
						var meetingStartDateTime = new Date(item.meetingDate + " " + item.meetingStartTime);
						
						html+='<table class="table table-bordered font-12 border-radius-table" style="min-width:1380px;width:100%" id="scheduleEventTable'+key+'">'
							+'<thead>'
								+'<tr>'
									+'<th style="width:5%" class="bg-primary text-white bold rounded-top-left-10 border-bottom-0 border-primary vertical-align-middle" style="border-top-color:transparent;border-right-color:#fff !important"><input type="checkbox" class="position-relative" id="" name="" style="top:2px"/>&nbsp;'+item.srNo+'</th>'
									+'<th style="width:15%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">'
											+'<span class="bg-'+item.bgColor+' text-white py-1 px-2 d-inline-block border border-white rounded text-center">'+item.meetingFor+'</span><br/>'
											+'Counselor Meeting Date | Time'
									+'</th>'
									+'<th style="width:10%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">Invitee Meeting<br/>Date | Time</th>'
									+'<th style="width:25%" class="bg-primary text-white bold border-bottom-0 text-left vertical-align-middle">Invitee Details</th>'
									+'<th style="width:10%" class="bg-primary text-white bold border-bottom-0 text-left vertical-align-middle">Status/Meeting Link<br/>Status/Update</th>'
									+'<th style="width:25%" class="bg-primary text-white bold border-bottom-0 text-left vertical-align-middle">Remark</th>'
									+'<th style="width:10%;border-top-color:transparent;border-right-color:transparent" class="bg-primary text-white bold border-bottom-0 rounded-top-right-10 vertical-align-middle text-center" style="border-top-color:transparent;border-right-color:transparent">Action</th>'
								+'</tr>'
							+'</thead>'
							+'<tbody class="lead-table-css">'
								+(item.leadStatus === 'Red Flag' ? '<tr class=" red-flag-lead" style="pointer-events:none;">' : '<tr class="">')
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="rounded-bottom-left-10"></td>'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="vertical-align-top">'
										+''+item.name+''
										+'<br/>'
										+''+item.meetingDate+''
										+'<br/>';
										if(item.meetingDate==item.meetingEndDate){
											html+=''+item.meetingStartTime+' - '+item.meetingEndTime+'';
										}else{
											html+=''+item.meetingStartTime+' - '+item.meetingEndDate+' '+item.meetingEndTime+'';
										}
										html+='<br/>'
										+''+item.counselorTimeZone+''
									+'</td>'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="vertical-align-top">'
										+''+item.inviteeMeetingDate+''
										+'<br/>';
										if(item.inviteeMeetingDate==item.inviteeMeetingEndDate){
											html+=''+item.inviteeStartTime+' - '+item.inviteeEndTime+'';
										}else{
											html+=''+item.inviteeStartTime+' - '+item.inviteeMeetingEndDate+' '+item.inviteeEndTime+'';
										}
										html+='<br/>'
										+''+item.inviteeTimezone+''
									+'</td>'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="vertical-align-top">'
										+'<table class="w-100">'
											+'<tbody>';
												if(item.leadNo != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Lead No:</th>'
														+'<td class="border-0 p-1" style="word-break:break-word">'+item.leadNo+'</td>'
													+'</tr>';
												}
												if(item.standardName != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Grade:</th>'
														+'<td class="border-0 p-1" style="word-break:break-word">'+item.standardName+'</td>'
													+'</tr>';
												}
												if(item.inviteeName != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Name:</th>'
														+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+item.inviteeName+'</td>'
													+'</tr>';
												}
												
												if(item.inviteeEmail != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Email:</th>'
														+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+item.inviteeEmail+'</td>'
													+'</tr>';
												}
												if(item.isdCode != '' || item.phoneNo != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Phone No.:</th>'
														+'<td class="border-0 p-1" style="word-break:break-word">';
															var isdCodeValue = item.isdCode.replace(/\s/g, '').split("");
															if(isdCodeValue[0] == "+"){
																html+=item.isdCode;
															}else{
																html+='+'+item.isdCode.replace(/\s/g, '');
															}
															html+='&nbsp;'+item.phoneNo+'</td>'
													+'</tr>';
												}
												if(item.countryName != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Country:</th>'
														+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+item.countryName+'</td>'
													+'</tr>';
												}else{
													if(item.inviteeCountry != ''){
														html+='<tr>'
															+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Country:</th>'
															+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+item.inviteeCountry+'</td>'
														+'</tr>';
													}
												}
												if(item.leadAssignName != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Lead Owner Name:</th>'
														+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+item.leadAssignName+'</td>'
													+'</tr>';
												}
											html+='</tbody>'
										+'</table>'
									+'</td>'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="vertical-align-top">'
										+'<span id="meetingStatus_'+item.meetingId+'">'+item.meetingStatus+'</span>'
										+'<br/>';
										if(item.meetingStatus != 'Cancelled' && item.meetingStatus != 'Reschedule'){
											html+='<a href="'+item.startMeetingUrl+'" target="_blank" class="text-primary font-weight-semi-bold">Start Meeting</a>'
											+'<br/>';
										}
										html+='<a href="'+item.rescheduleUrl+'" target="_blank" class="text-primary font-weight-semi-bold">Reschedule Meeting</a>'
										+'<br/>';
										if(item.leadId>0){
											if(item.meetingFor == 'School Demo'){
												html+='<a href="javascript:void(0)" class="text-primary font-weight-semi-bold" onclick="openUpdateStatusModal(\''+item.meetingId+'\',\''+item.leadId+'\',\''+item.meetingFor+'\',\''+item.name+'\',\''+item.meetingStartTime+'\',\''+item.meetingEndTime+'\',\''+item.meetingDate+'\',\''+item.meetingEndDate+'\',\''+item.counselorTimeZone+'\',\''+item.inviteeStartTime+'\',\''+item.inviteeEndTime+'\',\''+item.inviteeMeetingDate+'\',\''+item.inviteeMeetingEndDate+'\',\''+item.inviteeTimezone+'\',\''+item.standardName+'\',\''+item.inviteeName+'\',\''+item.inviteeEmail+'\',\''+item.isdCode+'\',\''+item.phoneNo+'\',\''+item.countryName+'\', \''+item.inviteeCountry+'\','+remarkMendatory+','+minRemarkCount+')">Update</a>';
											}else{
												html+='<a href="javascript:void(0)" class="text-primary font-weight-semi-bold" onclick="openUpdateStatusModal(\''+item.meetingId+'\',\''+item.leadId+'\',\''+item.meetingFor+'\',\''+item.name+'\',\''+item.meetingStartTime+'\',\''+item.meetingEndTime+'\',\''+item.meetingDate+'\',\''+item.meetingEndDate+'\',\''+item.counselorTimeZone+'\',\''+item.inviteeStartTime+'\',\''+item.inviteeEndTime+'\',\''+item.inviteeMeetingDate+'\',\''+item.inviteeMeetingEndDate+'\',\''+item.inviteeTimezone+'\',\''+item.standardName+'\',\''+item.inviteeName+'\',\''+item.inviteeEmail+'\',\''+item.isdCode+'\',\''+item.phoneNo+'\',\''+item.countryName+'\', \''+item.inviteeCountry+'\')">Update</a>';
											}
										}else{
											if(item.meetingFor == 'Initial-Interview'){
												html+='<a href="javascript:void(0)" class="text-primary font-weight-semi-bold" onclick="openUpdateStatusModal(\''+item.meetingId+'\',\'0\',\'Initial-Interview\',\''+item.appliedUserRole+'\', \'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\','+remarkMendatory+',\'25\')">Update</a>';
											}else if(item.meetingFor == 'Interview'){
												html+='<a href="javascript:void(0)" class="text-primary font-weight-semi-bold" onclick="openUpdateStatusModal(\''+item.meetingId+'\',\'0\',\'Interview\',\''+item.appliedUserRole+'\', \'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\','+remarkMendatory+',\'25\')">Update</a>';
											}else{
												html+='<a href="javascript:void(0)" class="text-primary font-weight-semi-bold" onclick="openUpdateStatusModal(\''+item.meetingId+'\',\'0\')">Update</a>';
											}
										}
										if(item.meetingStatus != 'Cancelled' && item.meetingStatus != 'Reschedule'){
											html+='<br/>'
											+'<input class="tinyUrl" style="display: none;" type="text" id="copyURL'+key+'" value="'+item.copyLinkUrl+'">'
											+'<b class="copy-msg-'+key+'"></b>'
											+'<button id="copyURL'+key+'" onclick="copyURL(\'copyURL'+key+'\',\'copy-msg-'+key+'\')" class="btn btn-primary btn-sm mt-2">User joining link</button>';
										}
										
										if((item.meetingFor == "Initial-Interview" || item.meetingFor == "Interview") && (item.meetingStatus != 'Cancelled' && item.meetingStatus != 'Reschedule')){
											html+='<br/>'
											+'<a href="javascript:void(0);" onclick="moveCounselorInScheduleEvents(\''+item.meetingId+'\');" class="btn btn-sm btn-secondary mt-1">Move</a>';
										}
									html+='</td>'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="vertical-align-top" id="meetingComments_'+item.meetingId+'">'+item.meetingComments+'</td>'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="vertical-align-top text-center rounded-bottom-right-10 ">'
										+'<a href="javascript:void(0)" class="text-primary font-weight-semi-bold" onclick="sendMailToInviteeForDemo(\''+item.meetingId+'\')">Send Mail</a>'
										if(item.recordingCount != 0 && (USER_ROLE == "DIRECTOR" || meetingStartDateTime > pastDateLimit)){
											html+='<br>'
											+'<a href="javascript:void(0)" class="text-primary font-weight-semi-bold" onclick="openRecordingModal(\''+item.meetingId+'\',\'MEETINGS\',\''+item.inviteeName+'\',\''+item.meetingFor+'\',\''+item.meetingDate+'\',\''+item.meetingStartTime+'\',\''+item.name+'\',\''+item.meetingDateSingapore+'\',\''+item.meetingStartTimeSingapore+'\', \'SCHEDULE_EVENTS\')">Recording <i class="fa fa-eye mt-2"><i/></a>'
										}
									html+='</td>'
								+'</tr>'
							+'</tbody>'
						+'</table>';
					});
					if(!showPagination){
						html+=pagination(clickFrom, boxSearchCondition, countType);
					}
									}
				else{
					html+='<table class="table table-bordered font-12 border-radius-table" style="min-width:1380px;width:100%">'
							+'<thead>'
								+'<tr>'
									+'<th style="width:5%" class="bg-primary text-white bold rounded-top-left-10 border-bottom-0 border-primary vertical-align-middle" style="border-top-color:transparent;border-right-color:#fff !important">&nbsp;1</th>'
									+'<th style="width:15%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">'
											+'Counselor Meeting Date | Time'
									+'</th>'
									+'<th style="width:10%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">Invitee Meeting<br/>Date | Time</th>'
									+'<th style="width:25%" class="bg-primary text-white bold border-bottom-0 text-left vertical-align-middle">Invitee Details</th>'
									+'<th style="width:10%" class="bg-primary text-white bold border-bottom-0 text-left vertical-align-middle">Status/Meeting Link<br/>Status/Update</th>'
									+'<th style="width:25%" class="bg-primary text-white bold border-bottom-0 text-left vertical-align-middle">Remark</th>'
									+'<th style="width:10%;border-top-color:transparent;border-right-color:transparent" class="bg-primary text-white bold border-bottom-0 rounded-top-right-10 vertical-align-middle text-center" style="border-top-color:transparent;border-right-color:transparent">Action</th>'
								+'</tr>'
							+'</thead>'
							+'<tbody class="lead-table-css">'
								+'<tr class="">'
									+'<td colspan="7" style="border-top-width:5px;border-top-style:solid;border-top-color:orange" class="rounded-bottom-left-10 rounded-bottom-right-10 text-center font-size-lg">No record found based on advanced search</td>'
								+'</tr>'
							+'</tbody>'
						+'</table>';
				}	
			html+='</div>'
		return html;
}	

function updateSystemTraningModal(meetingId, leadId,remarkMendatory,minRemarkCount, eventName,appliedUserRole){
	const isRemarkMandatory = remarkMendatory && Number(minRemarkCount) > 0;	
	const statusLabel = (eventName == 'Initial-Interview' || eventName == 'Interview') ? 'Interview Status' : 'Status';
	const statusOptions = (eventName == 'Initial-Interview' || eventName == 'Interview')
		? '<option value="COMPLETED">Completed</option>'
			+'<option value="CANCELLED">Cancelled</option>'
			+'<option value="RESCHEDULE">Reschedule</option>'
			+'<option value="NOTATTENDED">No Show</option>'
		: '<option value="COMPLETED">Completed</option>'
			+'<option value="COMPLETED-ON-CALL">Completed on Call</option>'
			+'<option value="NOTATTENDED">No Show</option>'
			+'<option value="CANCELLED">Cancelled</option>'
			+'<option value="RESCHEDULE">Reschedule</option>'
			+'<option value="Demo Confirmed">Demo Confirmed</option>'
			+'<option value="Demo Not Confirmed">Demo Not Confirmed</option>'
			+'<option value="Not Interested">Not Interested</option>'
			+'<option value="Positive to enrollment">Positive to enrollment</option>'
			+'<option value="Red Flag">Red Flag</option>';
	const applicationStatusBlock = (eventName == 'Initial-Interview' || eventName == 'Interview')
		? `<div id="applicationStatusDiv" class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12" style="display: none;">
				<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
					<select name="applicationStatus" id="applicationStatus" class="form-control" onchange="showAndHideDuration('scheduleEventMeetingStatus');">
						<option value="">Select Application Status</option>
						<option value="Another Round of Interview">Another Round of Interview</option>
						${appliedUserRole == 'Teacher' ? '<option value="Approved for Selection Process">Approved for Selection Process</option>' : '<option value="Accepted for Contract">Accepted for Contract</option>'}
						<option value="On Hold">On Hold</option>
						<option value="Reject">Reject</option>
					</select>
					<label>Application Status</label>
				</div>
			</div>
			<div id="assignedToInterviewDiv" class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12" style="display: none;">
				<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
					<select id="assignedToInterview" class="form-control"></select>
					<label>Assigned To</label>
				</div>
			</div>
			<div id="durationDiv" class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12" style="display: none;">
				<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
					<select name="duration" id="duration" class="form-control">
						<option value="15">15 Min</option>
						<option value="30">30 Min</option>
					</select>
					<label>Duration</label>
				</div>
			</div>
			<div id="interviewValidDateDiv" style="display: none;" class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
				<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
					<input type="text" class="form-control" id="interviewValidDate" readonly onkeydown="return false" disabled placeholder=" " />
					<label for="interviewValidDate" class="control-label">Interview link is valid till</label>
				</div>
			</div>
			<div id="finalInterviewSlotsWrapper" class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-2" style="display: none;"></div>`
		: '';
	const tentativeDateBlock = `<div class="col-xl-3 col-lg-5 col-md-5 col-sm-12 col-12 tentative_date" style="display:none">
				<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
					<input type="text" name="tentativeDate" id="tentativeDate" value="" class="form-control tentativeDate" maxlength="50" autocomplete="off" readonly onkeydown="return false" placeholder=" " />
					<label class="mb-0">Tentative Date</label>
				</div>
			</div>`;
	const leadSourceBlock = `<div class="col-xl-3 col-lg-5 col-md-5 col-sm-12 col-12 leadSourceHide">
				<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
					<select name="leadSource" id="leadSource" class="form-control"><option value="">Select Source</option></select>
					<label class="mb-0">Source</label>
				</div>
			</div>`;
	const remarksAttributes = isRemarkMandatory ? `class="form-control schedule_remarks remarks" isRemarkMendatory="true" minlength="${minRemarkCount}" required` : 'class="form-control"';
	const remarksCounter = isRemarkMandatory ? `<small id="scheduleRemarksCounter" class="text-muted">0 / ${minRemarkCount}</small>` : '';
	var html =
			`<div id="updateSystemTraningModal" class="modal fade fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-md modal-dialog-centered box-shadow-none">
					<div class="modal-content border-0">
						<div class="modal-header py-2 bg-primary text-white">
							<h5 class="modal-title">Update Status</h5>
							<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<form action="javascript:void(0);" id="scheduleEventMeetingStatus" name="scheduleEventMeetingStatus" autocomplete="off" class="custom-field-scope">
								<input type="hidden" name="meetingType" id="meetingType" value="" />
								<div class="row custom-field-scope">
									<div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
										<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
											<select name="status" id="status" class="form-control" onchange="showHideApplicationStatus(this);">
												<option value="">Select Status</option>
												${statusOptions}
											</select>
											<label>${statusLabel}</label>
										</div>
									</div>
									${applicationStatusBlock}
									${tentativeDateBlock}
									${leadSourceBlock}
									<div class="col-xl-12 col-lg-7 col-md-7 col-sm-12 col-12">
										<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
											<input type="text" name="remarks" id="remarks" ${remarksAttributes} placeholder=" " />
											<label>Remarks</label>
										</div>
										${remarksCounter}
									</div>
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-danger  float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>
							<button type="button" class="btn btn-success  float-right pr-4 pl-4" onclick="updateMeetingStatus('${meetingId}','${leadId}')">Save</button>
						</div>
					</div>
				</div>
			</div>`;
	setTimeout(function () {
		refreshCustomFieldState($("#updateSystemTraningModal"));
	}, 0);
	return html;
}

function confirmeUpdateSystemTraningModal(meetingId, leadId, eventName, name, meetingStartTime, meetingEndTime, meetingDate, meetingEndDate, counselorTimeZone, inviteeStartTime, inviteeEndTime, inviteeMeetingDate, inviteeMeetingEndDate, inviteeTimezone, standardName, inviteeName, inviteeEmail, isdCode, phoneNo, countryName, inviteeCountry){
	var html =
			'<div id="confirmeUpdateSystemTraningModal" class="modal fade fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
				+'<div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none">'
					+'<div class="modal-content border-0">'
						+'<div class="modal-header py-2 bg-primary text-white">'
							+'<h5 class="modal-title">Are you sure you want to cancel '+eventName+'?</h5>'
						+'</div>'
						+'<div class="modal-body">'
							+'<div class="table-responsive full">'
								+'<table class="table table-bordered font-12 border-radius-table" style="min-width:500px;width:100%">'
									+'<thead>'
										+'<tr>'
											+'<th style="width:20%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">Invitee Details</th>'
											+'<th style="width:15%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">'
													+'Invitee Meeting Date | Time'
											+'</th>'
											+'<th style="width:10%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">Counselor Meeting<br/>Date | Time</th>'
										+'</tr>'
									+'</thead>'
									+'<tbody class="lead-table-css">'
										+'<tr class="">'
											+'<td class="vertical-align-top">'
												+'<table class="w-100">'
													+'<tbody>';
														if(standardName != ''){
															html+='<tr>'
																+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Grade:</th>'
																+'<td class="border-0 p-1" style="word-break:break-word">'+standardName+'</td>'
															+'</tr>';
														}
														if(inviteeName != ''){
															html+='<tr>'
																+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Name:</th>'
																+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+inviteeName+'</td>'
															+'</tr>';
														}
														
														if(inviteeEmail != ''){
															html+='<tr>'
																+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Email:</th>'
																+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+inviteeEmail+'</td>'
															+'</tr>';
														}
														if(isdCode != '' || phoneNo != ''){
															html+='<tr>'
																+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Phone No.:</th>'
																+'<td class="border-0 p-1" style="word-break:break-word">';
																	if(isdCode!=undefined){
																		var isdCodeValue = isdCode.replace(/\s/g, '').split("");
																		if(isdCodeValue[0] == "+"){
																			html+=isdCode;
																		}else{
																		
																				html+='+'+isdCode.replace(/\s/g, '');
																			
																		}
																	}
																	html+='&nbsp;'+phoneNo+'</td>'
															+'</tr>';
														}
														if(countryName != ''){
															html+='<tr>'
																+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Country:</th>'
																+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+countryName+'</td>'
															+'</tr>';
														}else{
															if(inviteeCountry != ''){
																html+='<tr>'
																	+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Country:</th>'
																	+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+inviteeCountry+'</td>'
																+'</tr>';
															}
														}
													html+='</tbody>'
												+'</table>'
											+'</td>'
											+'<td class="vertical-align-top">'
												+''+inviteeMeetingDate+''
												+'<br/>';
												if(inviteeMeetingDate==inviteeMeetingEndDate){
													html+=''+inviteeStartTime+' - '+inviteeEndTime+'';
												}else{
													html+=''+inviteeStartTime+' - '+inviteeMeetingEndDate+' '+inviteeEndTime+'';
												}
												html+='<br/>'
												+''+inviteeTimezone+''
											+'</td>'
											+'<td class="vertical-align-top">'
												+''+name+''
												+'<br/>'
												+''+meetingDate+''
												+'<br/>';
												if(meetingDate==meetingEndDate){
													html+=''+meetingStartTime+' - '+meetingEndTime+'';
												}else{
													html+=''+meetingStartTime+' - '+meetingEndDate+' '+meetingEndTime+'';
												}
												html+='<br/>'
												+''+counselorTimeZone+''
											+'</td>'
											
										+'</tr>'
									+'</tbody>'
								+'</table>'	
							+'</div>'						
						+'</div>'
						+'<div class="modal-footer">'
							+'<button type="button" class="btn btn-primary  float-right pr-4 pl-4 ml-2" onclick="comfirmeupdateMeetingStatus(0,0,\'No\')">No</button>'
							+'<button type="button" class="btn btn-success  float-right pr-4 pl-4" onclick="comfirmeupdateMeetingStatus(\''+meetingId+'\',\''+leadId+'\',\'Yes\')">Yes</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>';
		return html;
}

function moveEventModal(){
	var html =
			`<div id="moveEventModal" class="modal fade fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-md modal-dialog-centered box-shadow-none">
					<div class="modal-content border-0">
						<div class="modal-header py-2 bg-primary text-white">
							<h5 class="modal-title">Move CTI</h5>
							<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body custom-field-scope">
							<div class="full">
								<table class="table border rounded-10" style="border-collapse:separate">
									<tbody>
										<tr>
											<td class="border-0" style="width:135px"><strong>Event Name:</strong></td>
											<td class="border-0">CTI</td>
										</tr>
										<tr>
											<td class="border-0" style="width:135px"><strong>Counselor Name:</strong></td>
											<td class="border-0">Alwin Sabu</td>
										</tr>
										<tr>
											<td class="border-0" style="width:135px"><strong>Invitee Name:</strong></td>
											<td class="border-0">Demo Student</td>
										</tr>
										<tr>
											<td class="border-0" style="width:135px"><strong>Date | Time:</strong></td>
											<td class="border-0">Mar 21, 2024 9:00 to 9:50 PM ${BASE_TIMEZONE}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="full">
								<form action="javascript:void(0);" id="" name="" autocomplete="off" class="custom-field-scope">
									<div class="row">
										<div class="col-12">
											<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
												<select name="moveTo" id="moveTo" class="form-control">
													<option value="">Pooja</option>
													<option value="">Alwin</option>
												</select>
												<label class="font-weight-bold">Move To:</label>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-danger  float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>
							<button type="button" class="btn btn-success  float-right pr-4 pl-4">Save</button>
						</div>
					</div>
				</div>
			</div>`;
	setTimeout(function () {
		refreshCustomFieldState($("#moveEventModal"));
	}, 0);
	return html;
}
function pagination(clickFrom, boxSearchCondition, countType){
	var html = 
        '<ul class="pagination">';
            if(currentPage != 1){
                html+='<li class="page-item">'
                    +'<a class="page-link" href="javascript:void(0);" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\',\''+clickFrom+'\',\''+(currentPage-1)+'\',\''+boxSearchCondition+'\',\''+countType+'\');">Previous</a>'
                +'</li>';
            }
            for(var i =1; i<=noOfPages;i++){
                if(i <= startPageLimit || i > (noOfPages -1) || (i>=leftLimit && i<rightLimit)){
                    if(i > (noOfPages -1) || (i<leftLimit && i>rightLimit)){
                        html+='...'
                    }
                    html+='<li class="page-item">'
                        +'<a href="javascript:void(0);" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\', \''+clickFrom+'\',\''+i+'\',\''+boxSearchCondition+'\',\''+countType+'\');" class="page-link '+(i==currentPage?'page-link-active':'')+'">'+i+'</a>'
                    +'</li>';
                }
            }
            if(currentPage < noOfPages){
                html+='<li class="page-item">'
                    +'<a class="page-link" href="javascript:void(0);" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\', \''+clickFrom+'\',\''+(currentPage+1)+'\',\''+boxSearchCondition+'\',\''+countType+'\');">Next</a>'
                +'</li>';
            }
		html+='</ul>';
        return html;
}

function moveCounselorInScheduleEventModal(meetingId){
	var html=
		`<div class="modal fade" id="moveCounselorInScheduleEventModal">
			<div class="modal-dialog modal-md" role="document">
				<div class="modal-content">
					<div class="modal-header p-2 bg-primary text-white">
						<h5 class="m-0">Move Event</h5>
					</div>
					<form action="javascript:void(0);" id="moveCounselorInScheduleEventForm" name="moveCounselorInScheduleEventForm" autocomplete='off' class="custom-field-scope">
						<div class="modal-body delete-modal custom-field-scope">
							<div class="full">
								<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
									<select	name="assigneeMove" id="assigneeMove" class="form-control" >
										<option value="0">Select Assignee</option>
									</select>
									<label class="mb-0">Move interview</label> 
								</div>
							</div>
							<div class="full mt-1">
								<button type="button" class="btn btn-success  float-right pr-4 pl-4" onclick="moveInterviewData(${meetingId});">Move</button>
								<button type="button" class="btn btn-info  float-right pr-4 pl-4 mr-2" data-dismiss="modal">Close</button>
							</div>
						</div>
					</form>
				</div>
				</div>
			</div>`
	setTimeout(function () {
		refreshCustomFieldState($("#moveCounselorInScheduleEventModal"));
	}, 0);
		return html;
	}
