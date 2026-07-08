async function getUserShortProfile(userId){
	// var responseData = await  getDesiredObject('profile'+userId);
	// if(typeof responseData =='object'){
	// 	if(!responseData.ntc){
	// 		return responseData;
	// 	}
	// }
	var data={};
	var responseData;
	if(typeof isDemoUser !== "undefined" && (isDemoUser === true || isDemoUser === "true")){
		const [type, entityId, counselorUserId] = DEMO_DASHBOARD_USER.split("|");
		data['entityId']=entityId;
		data['type']=type;
		data['counselorUserId']=counselorUserId;
		responseData = await getDataBasedUrlAndPayload('get-demo-dashboard-user-details', data);
		if(responseData && responseData.profileName){
			window.DEMO_DASHBOARD_PROFILE_NAME = responseData.profileName;
		}
		window.DEMO_DASHBOARD_USER_DETAILS = responseData;
		if(typeof window.updateDemoDashboardProfile === "function"){
			window.updateDemoDashboardProfile(responseData);
		}
		return responseData;
	}
	data['userId']=userId;
	responseData = await getDataBasedUrlAndPayload('get-user-short-profile', data);
	localStorage.setItem('profile'+userId,JSON.stringify(responseData));
	return responseData;
}
window.getUserShortProfile = getUserShortProfile;

async function getOfflineSchoolList(userId){
	// var responseData = await  getDesiredObject('profile'+userId);
	// if(typeof responseData =='object'){
	// 	if(!responseData.ntc){
	// 		return responseData;
	// 	}
	// }
	var data={};
	data['userId']=userId;
	var responseData = await getDataBasedUrlAndPayload('school-list', data);
	//localStorage.setItem('profile'+userId,JSON.stringify(responseData));
	return responseData;
}
window.getOfflineSchoolList = getOfflineSchoolList;
