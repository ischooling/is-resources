var RESOURCE_PATH = PATH_FOLDER_JS2+RESOURCES_FROM_MIN_LOCATION;
// function loadScript(srcArray) {
//     $.each(srcArray, function(index, value){
//         $.each(value.fileName, function(index, fileName){
//             loadScriptCall(value.role, fileName)
//         })
//     });
// }



// function loadScriptCall(role, src){
//     if(src!=''){
//         var id = src.split(".");
//         id = id[0]+"JS";
//         if(role == "js"){
//             var cacheBustedSrc = RESOURCE_PATH+src + "?t=" + new Date().getTime();
//         }else{
//             var cacheBustedSrc = RESOURCE_PATH+"custom/"+src + "?t=" + new Date().getTime();
//         }
//         if($('head #'+ id).length <1){
//             if($("#" + src).length === 0 && $("#"+id).length<1) {  // Check if the script is already added
//                 var script = $("<script>")
//                     .attr("type", "text/javascript")
//                     .attr("src", cacheBustedSrc)
//                     .attr("id", id)  // Add a unique ID to each script without .js
//                     .on("load", function() {  // Execute callback when script is loaded
//                         console.log(`Script ${cacheBustedSrc} loaded.`);
//                     })
//                     .on("error", function() {  // Handle script load error
//                         console.error(`Failed to load script: ${src}`);
//                     });
//                 $("head").append(script);
//             } else {
//                 console.log(`Script ${cacheBustedSrc} already loaded.`);
//             }
//         }
//     }
// }

async function loadScript(files) {
    var promises = [];

    for (var i = 0; i < files.length; i++) {
        var role = files[i].role;
        var fileNames = files[i].fileName;

        for (var j = 0; j < fileNames.length; j++) {
            if (fileNames[j]) {
                promises.push(loadScriptCall(role, fileNames[j]));
            }
        }
    }

    await Promise.all(promises); // wait till ALL scripts are loaded
}


var _scriptPromiseCache = {};

function loadScriptCall(role, src) {
    if (!src) return Promise.resolve();

    var id = src.split(".")[0] + "JS";

    // Return cached promise if script is already loading or loaded
    if (_scriptPromiseCache[id]) {
        return _scriptPromiseCache[id];
    }

    var cacheBustedSrc = role === "js"
        ? RESOURCE_PATH + src + "?t=" + Date.now()
        : RESOURCE_PATH + "custom/" + src + "?t=" + Date.now();

    _scriptPromiseCache[id] = new Promise((resolve, reject) => {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = cacheBustedSrc;
        script.id = id;
        script.onload = () => {
            console.log(`Script loaded: ${src}`);
            resolve();
        };
        script.onerror = () => {
            console.error(`Failed to load script: ${src}`);
            delete _scriptPromiseCache[id]; // allow retry on error
            reject(`Failed to load script: ${src}`);
        };
        document.head.appendChild(script);
    });

    return _scriptPromiseCache[id];
}


function callForDashboardData(formId, actionUrl, replaceDiv) {
	return new Promise((resolve, reject) => {
		if (!validateRequestForDashboardData(formId)) {
			reject("Validation failed");
			return;
		}

		let flag = replaceDiv !== 'section-linebox';
		customLoader(true);

		$.ajax({
			global: flag,
			type: "POST",
			contentType: APPLICATION_JSON_VALUE,
			url: getURLForHTML('dashboard', actionUrl.split('?')[0]),
			data: JSON.stringify(parseUrlToJson(actionUrl)),
			dataType: 'html',
			async: true,
			success: function (htmlContent) {
				customLoader(false);

				if (!htmlContent) {
					reject("Empty response");
					return;
				}

				const stringMessage = htmlContent.split("|");

				// Handle known response types
				if (["FAILED", "EXCEPTION", "SESSIONOUT"].includes(stringMessage[0])) {
					if (stringMessage[0] === "SESSIONOUT") {
						redirectLoginPage();
					} else {
						showMessageTheme2(0, stringMessage[1]);
					}
					reject(stringMessage[1]);
					return;
				}

				if (stringMessage[0] === "SUCCESS") {
					showMessageTheme2(0, stringMessage[1]);
					if (stringMessage[1].includes("Counselor")) {
						callDashboardPageSchool('mc30');
					}
					resolve(stringMessage[1]);
					return;
				}
                // Otherwise, update the HTML content dynamically
				if (!replaceDiv) {
					$('#dashboardContentInHTML').html(htmlContent);
				} else {
					switch (replaceDiv) {
						case 'section-linebox':
							$('#teacherAgreementModal').modal('show');
							break;
						case 'subject-plan':
							$('#bookSessionPaymentModal').modal('show');
							break;
						case 'changePasswordContent':
							$('#changePasswordModal').modal({ backdrop: 'static', keyboard: false });
							break;
						case 'select-parent-student-id':
							window.location.reload();
							break;
					}
					$('#' + replaceDiv).html(htmlContent);
				}

				resolve(htmlContent);
			},
			error: function (xhr, status, error) {
				customLoader(false);
				showMessageTheme2(0, "An error occurred: " + error);
				reject(error);
			}
		});
	});
}


async function callForDashboardJsonData(formId, actionUrl, replaceDiv) {
    return new Promise(function(resolve, reject){
        try{
            customLoader(true);
            if (!validateRequestForDashboardData(formId)) {
                customLoader(false);
                return resolve(false); // Resolve with false if validation fails
            }
            var flag = true;
            if (replaceDiv == 'section-linebox') {
                flag = false;
            }
           // responseData = await getDashboardDataBasedUrlAndPayload(false, false, 'parent/select-student-by-parent', payload);
            $.ajax({
                global: flag,
                type: "POST",
                contentType: "application/json",
                url: getURLForHTML('dashboard', actionUrl.split('?')[0]),
                data: JSON.stringify(parseUrlToJson(actionUrl)),
                dataType: 'json',
                async: true,
                success: function (data) {
                    if (data.status == '0' || data.status == '2' || data.status == '3') {
                        if(data.status == '3'){
                            redirectLoginPage();
                        }else{
                            showMessageTheme2(0, data.message, '', true);
                        }
                    }else{
                        customLoader(false);
                        return resolve(data); // Resolve with true on other cases
                    }
                },
                error: function (e) {
                    customLoader(false);
                    return reject(e); // Reject the Promise on error
                }
            });
        } catch (e) {
            customLoader(false);
            return reject(e); // Reject the Promise on exception
        }
    });
}

function getCurrentTimeOnlyFromDate(date){
    // FORMAT = MM/DD/YYYY
    var currentDate = new Date();
    if(date!=undefined  && date!=null && date!=''){
        currentDate = new Date(date);
    }
    return currentDate.getHours()+":"+currentDate.getMinutes()+":"+currentDate.getSeconds();
}


function queryStringToObject (queryString)
{
    let obj = {}
    if(queryString) {
        queryString.slice(1).split('&').map((item) => {
        const [ k, v ] = item.split('=')
        v ? obj[k] = v : null
        })
    }
    return obj
}

function getDataTablePageLength(totalCounts){
    var lengthArray = [10, 25, 50, 100];
    if(totalCounts > 100){
        lengthArray.push(totalCounts);
    }
    return lengthArray;
}

function backToMianPage(){
    $('#dashboardContentInHTML').show();
    $('#dashboardContentInHTMLAdditional').hide();
}