var  PARTNER_SCHOOL_IMAGES = [];
function base64ImageFileAsURL(f, fileType, elemId, uploadType, expectedWidth, expectedHeight) {
    const reader = new FileReader();
    reader.onload = function (e) {
        var binaryData = reader.result.substr(reader.result.indexOf(',') + 1);
        var acceptFileTypes = /^image\/(png|jpe?g)$/i;
        var uploadFlag = true;

        if (!acceptFileTypes.test(f.type)) {
            showMessageTheme2(0, 'Only JPG, JPEG or PNG files are allowed.');
			$(`#fileupload${elemId}`).val('');
            return false;
        }

        if (f.size > 1024 * 1024) {
            showMessageTheme2(0, 'File size should not exceed 1 MB.');
			$(`#fileupload${elemId}`).val('');
            return false;
        }

        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
            if (img.width !== expectedWidth || img.height !== expectedHeight) {
                showMessageTheme2(0, `Image must be ${expectedWidth}×${expectedHeight} px.`);
				$(`#fileupload${elemId}`).val('');
                return false;
            }

            const obj = {
                fileName: f.name,
                fileType: parseInt(fileType),
                fileContent: binaryData,
                previewUrl: e.target.result
            };

            const index = PARTNER_SCHOOL_IMAGES.findIndex(item => item.fileType === parseInt(fileType));
            if (index !== -1) PARTNER_SCHOOL_IMAGES.splice(index, 1);
            PARTNER_SCHOOL_IMAGES.push(obj);

            $(`#uploadSection${elemId}`).hide();
            $(`#fileDisplaySection${elemId}`).show();
            $(`#fileNameDisplay${elemId}`).text(f.name);
        };
    };

    reader.readAsDataURL(f);
}
function uploadDocsFun(src, uploadType, expectedWidth, expectedHeight) {
    const fileType = $(src).attr('fileType');
    const elemId = $(src).attr('elem-id');
    const file = src.files[0];
    if (file) {
        base64ImageFileAsURL(file, fileType, elemId, uploadType, expectedWidth, expectedHeight);
    }
}

function updateColorPreview() {
    const primaryColor = $('#primaryColor').val();
    const secondaryColor = $('#secondaryColor').val();
	const thirdColor = $('#thirdColor').val();
    const fourthColor = $('#fourthColor').val();
    
    const primaryLight = lightenColor(primaryColor, 85);
    const secondaryLight = lightenColor(secondaryColor, 85);
	const thirdLight = lightenColor(thirdColor, 85);
    const fourthLight = lightenColor(fourthColor, 85);
    const primaryGradient = generateGradient(primaryColor);
    $('#primaryGradientPreview').css('background', primaryGradient);
}

function generateGradient(primaryColor) {
    const darkerPrimary = darkenColor(primaryColor, 20);
    return `linear-gradient(90deg, ${primaryColor} 0%, ${darkerPrimary} 100%)`;
    `radial-gradient(140.04% 140.04% at 101% 97%, rgba(11, 101, 255, 0.80) 32.81%, rgba(102, 178, 255, 0.80) 100%)`
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    
    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
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

function resetToDefaultColors() {
    $('#primaryColor').val('#007fff');
    $('#secondaryColor').val('#001b47');
    $('#thirdColor').val('#000000');
    $('#fourthColor').val('#2862C5');
    updateColorPreview();
}

function prefillColorData(parentColor) {
	const colorVars = {};
	const regex = /--([a-z-]+):([^;]+);/g;
	let match;
	
	while ((match = regex.exec(parentColor)) !== null) {
		colorVars[match[1]] = match[2].trim();
	}
	if (colorVars['pc']) {
		$('#primaryColor').val(colorVars['pc']);
	}
	if (colorVars['sc']) {
		$('#secondaryColor').val(colorVars['sc']);
	}
	updateColorPreview();
}

async function savePartnerSchoolImages(schoolLetterSetup, schoolLogoSetup, colorThemeSetup, modalId){
    var requiredFileTypes=[];
    var schoolLetterSetupTypes=[
        53, // TEACHER_CONTRACT_LETTER_HEAD
        54, // TEACHER_CONTRACT_AUTHORIZED_SIGNATURE
        55, // TRANSCRIPT_SIGNATURE
        56, // LOGIN_BACKGROUND_IMAGE
        57, // TEACHER_SIGNATURE_IMAGE
        58, // SCHOOL_STAMP
    ];
    var schoolLogoSetupTypes=[
        53, // TEACHER_CONTRACT_LETTER_HEAD
        54, // TEACHER_CONTRACT_AUTHORIZED_SIGNATURE
        55, // TRANSCRIPT_SIGNATURE
        56, // LOGIN_BACKGROUND_IMAGE
        57, // TEACHER_SIGNATURE_IMAGE
        58, // SCHOOL_STAMP
    ];
    if(schoolLetterSetup){
        requiredFileTypes.push(...schoolLetterSetupTypes);
    }
	
    if(schoolLogoSetup){
       requiredFileTypes.push(...schoolLogoSetupTypes)
    }
	if(schoolLetterSetup || schoolLogoSetup){
        var missingFields = [];
        requiredFileTypes.forEach((type) => {
            const exists = PARTNER_SCHOOL_IMAGES.some((file) => file.fileType == type);
            if (!exists) {
                missingFields.push(type);
            }
        });
        if (missingFields.length > 0) {
            showMessageTheme2(0, "Please upload all mandatory files before saving.");
            return;
        }
    }
    if(colorThemeSetup){
        var primaryColor = $('#primaryColor').val();
        var secondaryColor = $('#secondaryColor').val();
        var thirdColor = $('#thirdColor').val();
        var fourthColor = $('#fourthColor').val();
        
        var primaryLight = lightenColor(primaryColor, 85);
        var secondaryLight = lightenColor(secondaryColor, 85);
        var thirdLight = lightenColor(thirdColor, 85);
        var fourthLight = lightenColor(fourthColor, 85);
        var primaryGradient = generateGradient(primaryColor);
        var parentColor = `:root{--pc:${primaryColor};--plc:${primaryLight};--sc:${secondaryColor};--slc:${secondaryLight};--pgc:${primaryGradient};--tc:${thirdColor};--tlc:${thirdLight};--fc:${fourthColor};--flc:${fourthLight};--login-bg-color:${primaryColor};}`;
    }
	
	var body = {
		attachments: PARTNER_SCHOOL_IMAGES,
		rawLeadId: $("#partnerUserB2BSaveForm #rawLeadId").val(),
		schoolId: $("#pSchoolId").val(),
		parentColor: parentColor
	}
    var schoolSetupFlag = await getSchoolSettingsOffice($("#pSchoolId").val());
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/upload-school-attachments',
		data : JSON.stringify(body),
		dataType : 'json',
		success : async function(data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'], '', false);
				}
			}else{
                if(modalId != null && modalId != undefined && modalId != ''){
                    $("#"+modalId).modal("hide");
                }
                if(schoolSetupFlag.isSchoolSetupComplete != "C"){
                    if($("#schoolSetupCongratulationsModal").length == 1){
                        $("#schoolSetupCongratulationsModal").remove();
                    }
                    $("body").append(getSchoolSetupCongratulationsModalContent());
                    setTimeout(() => {
                        $("#schoolSetupCongratulationsModal").modal("show");
                        $('#schoolSetupCongratulationsModal').on('shown.bs.modal', function () {
                            callConfetti('confettiCanvas');
                        });
                    }, 1000);
                }else{
                    showMessageTheme2(1, data['message'], '', false);
                }
                updatePartnerProgressBar();
			}
		}
	});
}

function getPartnerSchoolImages(formId, rawLeadId){
	var body = {
		rawLeadId: $("#"+formId+" #"+rawLeadId).val()
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/get-school-attachments',
		data : JSON.stringify(body),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'], '', false);
				}
			}else{
				data.attachmentsList.forEach(item => {
					const fileType = parseInt(item.fileType);
					const inputElem = $(`input[fileType=${fileType}]`);
					const elemId = inputElem.attr('elem-id');

					if (!elemId) return;

					const obj = {
						fileName: item.name,
						fileType: fileType,
						fileContent: '',
						previewUrl: item.url
					};
					
					const index = PARTNER_SCHOOL_IMAGES.findIndex(img => img.fileType === fileType);
					if (index !== -1) PARTNER_SCHOOL_IMAGES.splice(index, 1);
					PARTNER_SCHOOL_IMAGES.push(obj);
					$(`#uploadSection${elemId}`).hide();
					$(`#fileDisplaySection${elemId}`).show();
					$(`#fileNameDisplay${elemId}`).text(item.name);
				});
				if (data.parentColor) {
					prefillColorData(data.parentColor);
				}else{
					updateColorPreview();
				}
                if($("#schoolSetupCongratulationsModal").length>0){
                    $("#schoolSetupCongratulationsModal").remove();
                }
                // $("body").append(getSchoolSetupCongratulationsModalContent());
			}
		}
	});
}

function deleteFile(fileType, elemId) {
    const index = PARTNER_SCHOOL_IMAGES.findIndex(item => item.fileType === parseInt(fileType));
    if (index !== -1) PARTNER_SCHOOL_IMAGES.splice(index, 1);

	$(`#fileupload${elemId}`).val('');
    $(`#uploadSection${elemId}`).show();
    $(`#fileDisplaySection${elemId}`).hide();
    $(`#fileNameDisplay${elemId}`).text('');
}

function viewFile(fileType, title) {
    const file = PARTNER_SCHOOL_IMAGES.find(item => item.fileType === parseInt(fileType));
    if (file) {
        const modalHtml = `
            <div id="imageModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
				<div class="modal-dialog modal-lg" role="document">
					<div class="modal-content">
						<div class="modal-header bg-primary">
							<h5 class="modal-title text-white font-weight-bold" id="modalLabel">${title}</h5>
							<button onclick="closeImageModal();" type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body mx-auto">
							<img src="${file.previewUrl}" style="width:100%; max-width:400px;" />
						</div>
					</div>
				</div>
            </div>`;
        $('body').append(modalHtml);
		$("#imageModal").modal("show");
    }
}

function clearPartnerSchoolImages(){
	PARTNER_SCHOOL_IMAGES = [];
	activeLearningProgramStatusMap = {};
}



function callConfetti(elementId) {
    var confettiSrc = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";
    var existingScript = $("head script[src='" + confettiSrc + "']");
    
    if (existingScript.length === 0) {
        var script = document.createElement("script");
        script.src = confettiSrc;
        script.onload = function() {
            executeConfetti(elementId);
        };
        document.head.appendChild(script);
    } else {
        executeConfetti(elementId);
    }
}

function executeConfetti(elementId) {
    const canvas = document.getElementById(elementId);
    if (!canvas) return;
    
    const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });

    // fire some confetti inside the modal
    myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 }
    });

    // optional: repeat bursts for a short celebration
    let count = 0;
    const interval = setInterval(() => {
        myConfetti({
            particleCount: 30,
            spread: 80,
            origin: { x: Math.random(), y: Math.random() * 0.6 + 0.2 }
        });
        count++;
        if (count > 5) clearInterval(interval); // stop after a few bursts
    }, 1200);
}