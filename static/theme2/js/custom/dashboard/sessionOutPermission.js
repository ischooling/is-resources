async function getUserShortProfile(userId){
	// var responseData = await  getDesiredObject('profile'+userId);
	// if(typeof responseData =='object'){
	// 	if(!responseData.ntc){
	// 		return responseData;
	// 	}
	// }
	var data={};
	data['userId']=userId;
	var responseData = await getDataBasedUrlAndPayload('get-user-short-profile', data);
	localStorage.setItem('profile'+userId,JSON.stringify(responseData));
	return responseData;
}