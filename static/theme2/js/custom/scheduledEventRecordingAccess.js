// Access control helper for the Scheduled Event recordings feature.
// A user listed in the CONFIGURATION / SCHEDULED_EVENT_RECORDINGS_ACCESS_USERS
// setting is treated as NOT allowed. Used to lock down the Lead Assign Form page
// and to show only the Scheduled Events tab on the Time Availability page.
function isScheduledEventRecordingUserNotAllowed(){
	var settingResponse = getSettingsByTypeAndKey('CONFIGURATION','SCHEDULED_EVENT_RECORDINGS_ACCESS_USERS');
	var setting = JSON.parse(settingResponse);
	var metaValue = (setting && setting.data && setting.data.metaValue) ? setting.data.metaValue : '';
	if(metaValue == ''){
		return false;
	}
	var notAllowedUserIds = metaValue.split(',').map(function(id){ return $.trim(id); });
	var isNotAllowed = false;
	$.each(notAllowedUserIds, function(k,v){
		if(v == USER_ID){
			isNotAllowed = true;
		}
	});
	return isNotAllowed;
}
