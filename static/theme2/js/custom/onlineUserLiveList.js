/* Server-side chunked loading: fetch the live users 25 rows per request (parallel chunks),
   matching the 25-row convention used across the student/lead/enrollment modules.
   Filtering is done server-side; every Apply/Reset pulls fresh data from the server. */
var ONLINE_USER_CHUNK_SIZE = 25;

var onlineUserFullList = [];   // rows currently loaded (already server-filtered)
var onlineUserTotal = 0;       // server-reported total for the active filter set
var onlineUserLiveTable = null;

/* Initial load: render master filters once, bind controls, fetch all (unfiltered). */
function getOnlineLiveUserList(formId, moduleId) {
	populateOnlineUserFilters();
	bindOnlineUserControls();
	fetchOnlineUsersChunked(null, renderOnlineUsersAfterFetch);
}

function getRequestForOnlineLiveUserList(filters, page, pageSize){
	var body = { userId: USER_ID, page: page, pageSize: pageSize };
	if (filters) {
		if (filters.role) { body.role = filters.role; }
		if (filters.country) { body.country = filters.country; }
		if (filters.grade) { body.grade = filters.grade; }
		if (filters.timezone) { body.timezone = filters.timezone; }
		if (filters.hourStart !== null && filters.hourStart !== undefined) { body.hourStart = filters.hourStart; }
		if (filters.hourEnd !== null && filters.hourEnd !== undefined) { body.hourEnd = filters.hourEnd; }
	}
	return body;
}

/* One 25-row chunk request; returns the jQuery ajax promise. */
function ouFetchChunk(filters, page, pageSize){
	return $.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','online-live-user-list'),
		data : JSON.stringify(getRequestForOnlineLiveUserList(filters, page, pageSize)),
		dataType : 'json',
		cache : false,
		timeout : 600000
	});
}

/* Fetch the full filtered set from the server in parallel 25-row chunks, then invoke onDone. */
function fetchOnlineUsersChunked(filters, onDone){
	if(!getSession()){
		redirectLoginPage();
		return false;
	}
	hideMessageTheme2('');
	ouFetchChunk(filters, 0, ONLINE_USER_CHUNK_SIZE).done(function(data){
		if (data['status'] == '0' || data['status'] == '2') {
			showMessageTheme2(0, data['message'],'',true);
			return;
		}
		onlineUserTotal = data.totalRows || 0;
		var chunks = { 0: (data.onlineUserList || []) };
		var offsets = [];
		for (var off = ONLINE_USER_CHUNK_SIZE; off < onlineUserTotal; off += ONLINE_USER_CHUNK_SIZE) {
			offsets.push(off);
		}
		if (offsets.length === 0) {
			onlineUserFullList = (chunks[0] || []).slice();
			if (typeof onDone === 'function') { onDone(); }
			return;
		}
		// Fire the remaining chunks in parallel.
		var reqs = offsets.map(function(off){
			return ouFetchChunk(filters, off, ONLINE_USER_CHUNK_SIZE).done(function(d){
				chunks[off] = (d && d.onlineUserList) ? d.onlineUserList : [];
			});
		});
		$.when.apply($, reqs).always(function(){
			var merged = (chunks[0] || []).slice();
			offsets.forEach(function(off){ merged = merged.concat(chunks[off] || []); });
			onlineUserFullList = merged;
			if (typeof onDone === 'function') { onDone(); }
		});
	});
}

function renderOnlineUsersAfterFetch(){
	renderOnlineUserTable(onlineUserFullList);
	updateOnlineUserResultCount();
}

/* ---------- Table rendering (4 composite columns) ---------- */
function renderOnlineUserTable(userList){
	if ($.fn.DataTable.isDataTable('#onlineUserLiveListTable')) {
		onlineUserLiveTable.destroy();
	}
	$("#onlineUserLiveListbody").html(getOnlineLiveUserListHtml(userList));
	onlineUserLiveTable = $('#onlineUserLiveListTable').DataTable({"pagingType":"full"});
	$('#onlineUserLiveListTable').off('page.dt').on('page.dt',function(){
		if (onlineUserLiveTable.responsive) { onlineUserLiveTable.responsive.recalc(); }
	});
}

function getOnlineLiveUserListHtml(userList){
	var html='';
	if(userList.length>0){
		for (let iu = 0; iu < userList.length; iu++) {
			const u = userList[iu];
			html+=`<tr>
            <td style="text-align:center;">${iu+1}</td>
            <td>${ouUserDetailsCell(u)}</td>
            <td>${ouLocationCell(u)}</td>
            <td>${ouLoggedInCell(u)}</td>
         </tr>`;
		}
	}
	return html;
}

/* Column 1: Profile icon + Name + Role + live status */
function ouUserDetailsCell(u){
	var name = (u.userName || '').trim() || 'N/A';
	var isLive = u.activeUser == 1;
	var dot = isLive ? '<span class="ou-live-dot"></span>' : '<span class="ou-off-dot"></span>';
	var statusTxt = isLive ? '<span class="ou-live-txt">Online</span>' : '<span class="ou-off-txt">Offline</span>';
	return `<div class="ou-stu-cell">
		<div class="ou-stu-avatar">${ouAvatarInner(u)}</div>
		<div>
			<div class="ou-stu-name">${name} ${dot} <span>${statusTxt}</span></div>
			<div class="ou-stu-role">${u.userRole || 'N/A'}${u.userStringId && u.userStringId !== 'N/A' ? ' &middot; ' + ouEsc(u.userStringId) : ''}</div>
		
		</div>
	</div>`;
}

/* Column 2: Country + Timezone */
function ouLocationCell(u){
	var country = (u.country && u.country !== '') ? ouEsc(u.country) : '<span class="ou-muted">N/A</span>';
	var tz = (u.timezone && u.timezone !== '') ? ouEsc(u.timezone) : '<span class="ou-muted">N/A</span>';
	return `<div>
		<div class="ou-loc-country">${country}</div>
		<div class="ou-loc-tz"><i class="fa fa-clock-o"></i> ${tz}</div>
	</div>`;
}

/* Column 3: Login time + duration since login */
function ouLoggedInCell(u){
	var loginTime = (u.loginTime && u.loginTime !== '') ? ouEsc(u.loginTime) : '<span class="ou-muted">N/A</span>';
	var dur = ouFormatDuration(u.loginDurationMinutes);
	return `<div>
		<div class="ou-login-time">${loginTime}</div>
		<div class="ou-login-dur">${dur ? 'Online for ' + dur : ''}</div>
	</div>`;
}

function ouFormatDuration(mins){
	if (mins === null || typeof mins === 'undefined' || isNaN(mins) || mins < 0) { return ''; }
	mins = Math.floor(mins);
	var d = Math.floor(mins / 1440);
	var h = Math.floor((mins % 1440) / 60);
	var m = mins % 60;
	var parts = [];
	if (d > 0) { parts.push(d + 'd'); }
	if (h > 0) { parts.push(h + 'h'); }
	if (m > 0 || parts.length === 0) { parts.push(m + 'm'); }
	return parts.join(' ');
}

/* ---------- Avatar (photo with initials fallback) ---------- */
function ouAvatarInner(u){
	var name = (u.userName || '').trim();
	var initials = ouInitials(name);
	if (u.profileImage && u.profileImage !== '') {
		return `<img src="${ouEsc(u.profileImage)}" alt="" data-initials="${ouEsc(initials)}" onerror="ouAvatarFallback(this)"/>`;
	}
	return initials;
}

function ouAvatarFallback(img){
	var parent = img.parentNode;
	if (parent) { parent.textContent = img.getAttribute('data-initials') || '?'; }
}

function ouEsc(s){
	return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function ouInitials(name){
	if (!name) { return '?'; }
	var parts = name.split(/\s+/).filter(Boolean);
	if (parts.length === 0) { return '?'; }
	if (parts.length === 1) { return parts[0].charAt(0).toUpperCase(); }
	return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/* ---------- Filters ----------
   Role / Grade / Country / Timezone dropdowns are rendered from the shared master helpers
   in masterContent.js so they always show the full masters, independent of who is online. */
function populateOnlineUserFilters(){
	if (typeof getAllGrade === 'function') {
		getAllGrade(typeof SCHOOL_ID !== 'undefined' ? SCHOOL_ID : 0, false, 'ouFilterGrade');
	}
	if (typeof getAllCountryList === 'function') {
		getAllCountryList('ouFilterForm', 'ouFilterCountry');
	}
	if (typeof getAllTimezoneList === 'function') {
		getAllTimezoneList('ouFilterForm', 'ouFilterTimezone');
	}
	// Role options are now hardcoded in the content HTML (All Roles, Student, Teacher, Parent, Admin)
}

/* Label of the currently selected option (empty when the "All ..." placeholder is chosen). */
function ouSelectedLabel(sel){
	var $s = $(sel);
	if (!$s.val()) { return ''; }
	return $.trim($s.find('option:selected').text());
}

function ouNumOrNull(v){
	if (v === '' || v === null || typeof v === 'undefined') { return null; }
	var n = Number(v);
	return isNaN(n) ? null : n;
}

/* Current filter selections sent to the server. */
function ouCurrentFilters(){
	return {
		role: $('#ouFilterRole').val() || '',
		country: ouSelectedLabel('#ouFilterCountry'),
		grade: ouSelectedLabel('#ouFilterGrade'),
		timezone: ouSelectedLabel('#ouFilterTimezone'),
		hourStart: ouNumOrNull($('#ouFilterHourStart').val()),
		hourEnd: ouNumOrNull($('#ouFilterHourEnd').val())
	};
}

/* Apply Filters — always pulls fresh, server-filtered data in 25-row chunks. */
function applyOnlineUserFilters(){
	fetchOnlineUsersChunked(ouCurrentFilters(), renderOnlineUsersAfterFetch);
}

function resetOnlineUserFilters(){
	$('#ouFilterRole,#ouFilterCountry,#ouFilterGrade,#ouFilterTimezone').val('');
	$('#ouFilterHourStart,#ouFilterHourEnd').val('');
	fetchOnlineUsersChunked(null, renderOnlineUsersAfterFetch);
}

function updateOnlineUserResultCount(){
	$('#ouResultCount').text('Showing ' + onlineUserFullList.length + ' of ' + onlineUserTotal + ' online users');
}

function bindOnlineUserControls(){
	$('#ouFilterApply').off('click').on('click', applyOnlineUserFilters);
	$('#ouFilterReset').off('click').on('click', resetOnlineUserFilters);
}
