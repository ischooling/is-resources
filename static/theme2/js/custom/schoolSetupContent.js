function getSchoolSetupContent(schoolLetterSetup, schoolLogoSetup, colorThemeSetup){
	var html = 
		`<div class="px-2 py-1">`
            if(schoolLetterSetup){
                html+=getSchoolImageContent();
            }
            if(schoolLogoSetup){
               html+=getSchoolLogoContent();
            }
            if(colorThemeSetup){
                html+=getColorThemeContent();
            }
            // html+=`<button type="button" class="btn btn-primary btn-shadow w-max ml-auto pr-4 pl-4 my-3 d-flex" id="savePartnerSchoolImages" onclick="savePartnerSchoolImages(${schoolLetterSetup}, ${schoolLogoSetup}, ${colorThemeSetup}, \'leadPartnerUserB2B\')">Save</button>`
            html+=`<button type="button" class="btn btn-primary btn-shadow w-max ml-auto pr-4 pl-4 my-3 d-flex" id="savePartnerSchoolImages">Save</button>`
        html+=`</div>`;
	return html;
}

function getSchoolImageContent(){
	var html = 
		`<p class="text-danger my-2">Note: Please upload files in following format (jpg, jpeg, or png) with maximum size of 1 MB</p>
		<h3>School Images</h3>
		<div class="row">
			<!-- Teacher Contract Letter Head -->
			<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">
				<label>Teacher Contract Letter Head<sup class="text-danger">*</sup></label>
				<div class="d-flex align-items-center border rounded px-3 py-2 bg-white" id="uploadSection1">
					<i class="fas fa-file-upload text-primary mr-2"></i>
					<label class="text-primary font-weight-bold mb-0 mt-1 w-100">
						Click Here to upload your file
						<input type="file" id="fileupload1" name="fileupload1" class="d-none" elem-id="1" fileType="53"
							onchange="uploadDocsFun(this, 'teacherContractLetterHead', 2482, 3508)" />
					</label>
				</div>
				<div class="d-none align-items-center border rounded px-3 py-2 bg-white" id="fileDisplaySection1">
					<i class="fas fa-file-upload text-primary mr-2"></i>
					<span class="flex-grow-1 text-dark font-weight-bold text-truncate" id="fileNameDisplay1">Filename.jpg</span>
					<i class="fa fa-trash text-danger mt-1" id="deleteFileBtn1" title="Delete" onclick="deleteFile(53, 1)"></i>
					<i class="fa fa-eye text-primary mr-3 mt-1" id="viewFileBtn1" title="View" onclick="viewFile(53, 'Teacher Contract Letter Head')"></i>
				</div>
				<p class="text-warning font-12">Recommended dimensions: A4 (2482×3508 px)</p>
			</div>

			<!-- Teacher Contract Authorized Signatory -->
			<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">
				<label>Teacher Contract Authorized Signatory<sup class="text-danger">*</sup></label>
				<div class="d-flex align-items-center border rounded px-3 py-2 bg-white" id="uploadSection2">
					<i class="fas fa-file-upload text-primary mr-2"></i>
					<label class="text-primary font-weight-bold mb-0 mt-1 w-100">
						Click Here to upload your file
						<input type="file" id="fileupload2" name="fileupload2" class="d-none" elem-id="2" fileType="54"
							onchange="uploadDocsFun(this, 'teacherContractAuthorizedSignatory', 400, 200)" />
					</label>
				</div>
				<div class="d-none align-items-center border rounded px-3 py-2 bg-white" id="fileDisplaySection2">
					<i class="fas fa-file-upload text-primary mr-2"></i>
					<span class="flex-grow-1 text-dark font-weight-bold text-truncate" id="fileNameDisplay2">Filename.jpg</span>
					<i class="fa fa-trash text-danger mt-1" id="deleteFileBtn2" title="Delete" onclick="deleteFile(54, 2)"></i>
					<i class="fa fa-eye text-primary mr-3 mt-1" id="viewFileBtn2" title="View" onclick="viewFile(54, 'Teacher Contract Authorized Signatory')"></i>
				</div>
				<p class="text-warning font-12">Recommended dimensions: 400×200 px</p>
			</div>

			<!-- Transcript Signature -->
			<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">
				<label>Transcript Signature<sup class="text-danger">*</sup></label>
				<div class="d-flex align-items-center border rounded px-3 py-2 bg-white" id="uploadSection3">
					<i class="fas fa-file-upload text-primary mr-2"></i>
					<label class="text-primary font-weight-bold mb-0 mt-1 w-100">
						Click Here to upload your file
						<input type="file" id="fileupload3" name="fileupload3" class="d-none" elem-id="3" fileType="55"
							onchange="uploadDocsFun(this, 'transcriptSignature', 400, 200)" />
					</label>
				</div>
				<div class="d-none align-items-center border rounded px-3 py-2 bg-white" id="fileDisplaySection3">
					<i class="fas fa-file-upload text-primary mr-2"></i>
					<span class="flex-grow-1 text-dark font-weight-bold text-truncate" id="fileNameDisplay3">Filename.jpg</span>
					<i class="fa fa-trash text-danger mt-1" id="deleteFileBtn3" title="Delete" onclick="deleteFile(55, 3)"></i>
					<i class="fa fa-eye text-primary mr-3 mt-1" id="viewFileBtn3" title="View" onclick="viewFile(55, 'Transcript Signature')"></i>
				</div>
				<p class="text-warning font-12">Recommended dimensions: 400×200 px</p>
			</div>

			<!-- Login Background Image -->
			<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">
				<label>Login Background Image<sup class="text-danger">*</sup></label>
				<div class="d-flex align-items-center border rounded px-3 py-2 bg-white" id="uploadSection4">
					<i class="fas fa-file-upload text-primary mr-2"></i>
					<label class="text-primary font-weight-bold mb-0 mt-1 w-100">
						Click Here to upload your file
						<input type="file" id="fileupload4" name="fileupload4" class="d-none" elem-id="4" fileType="56"
							onchange="uploadDocsFun(this, 'loginBackgroundImage', 1920, 1080)" />
					</label>
				</div>
				<div class="d-none align-items-center border rounded px-3 py-2 bg-white" id="fileDisplaySection4">
					<i class="fas fa-file-upload text-primary mr-2"></i>
					<span class="flex-grow-1 text-dark font-weight-bold text-truncate" id="fileNameDisplay4">Filename.jpg</span>
					<i class="fa fa-trash text-danger mt-1" id="deleteFileBtn4" title="Delete" onclick="deleteFile(56, 4)"></i>
					<i class="fa fa-eye text-primary mr-3 mt-1" id="viewFileBtn4" title="View" onclick="viewFile(56, 'Login Background Image')"></i>
				</div>
				<p class="text-warning font-12">Recommended dimensions: 1920×1080 px</p>
			</div>

			<!-- Teacher Registration Image -->
			<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">
				<label>Teacher Registration Image<sup class="text-danger">*</sup></label>
				<div class="d-flex align-items-center border rounded px-3 py-2 bg-white" id="uploadSection5">
					<i class="fas fa-file-upload text-primary mr-2"></i>
					<label class="text-primary font-weight-bold mb-0 mt-1 w-100">
						Click Here to upload your file
						<input type="file" id="fileupload5" name="fileupload5" class="d-none" elem-id="5" fileType="57"
							onchange="uploadDocsFun(this, 'teacherRegistrationImage', 500, 500)" />
					</label>
				</div>
				<div class="d-none align-items-center border rounded px-3 py-2 bg-white" id="fileDisplaySection5">
				<i class="fas fa-file-upload text-primary mr-2"></i>
					<span class="flex-grow-1 text-dark font-weight-bold text-truncate" id="fileNameDisplay5">Filename.jpg</span>
					<i class="fa fa-trash text-danger mt-1" id="deleteFileBtn5" title="Delete" onclick="deleteFile(57, 5)"></i>
					<i class="fa fa-eye text-primary mr-3 mt-1" id="viewFileBtn5" title="View" onclick="viewFile(57, 'Teacher Registration Image')"></i>
				</div>
				<p class="text-warning font-12">Recommended dimensions: 500×500 px</p>
			</div>

			<!-- School Stamp -->
			<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">
				<label>School Stamp<sup class="text-danger">*</sup></label>
				<div class="d-flex align-items-center border rounded px-3 py-2 bg-white" id="uploadSection6">
					<i class="fas fa-file-upload text-primary mr-2"></i>
					<label class="text-primary font-weight-bold mb-0 mt-1 w-100">
						Click Here to upload your file
						<input type="file" id="fileupload6" name="fileupload6" class="d-none" elem-id="6" fileType="58"
							onchange="uploadDocsFun(this, 'schoolStamp', 300, 300)" />
					</label>
				</div>
				<div class="d-none align-items-center border rounded px-3 py-2 bg-white" id="fileDisplaySection6">
					<i class="fas fa-file-upload text-primary mr-2"></i>
					<span class="flex-grow-1 text-dark font-weight-bold text-truncate" id="fileNameDisplay6">Filename.jpg</span>
					<i class="fa fa-trash text-danger mt-1" id="deleteFileBtn6" title="Delete" onclick="deleteFile(58, 6)"></i>
					<i class="fa fa-eye text-primary mr-3 mt-1" id="viewFileBtn6" title="View" onclick="viewFile(58, 'School Stamp')"></i>
				</div>
				<p class="text-warning font-12">Recommended dimensions: 300×300 px</p>
			</div>
		</div>`;
	return html;
}

function getSchoolLogoContent(){
	var html = 
		`<h3 class="mt-3">School Logo</h3>
			<div class="row">
				<!-- School Logo -->
				<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">
					<label>School Logo<sup class="text-danger">*</sup></label>
					<div class="d-flex align-items-center border rounded px-3 py-2 bg-white" id="uploadSection7">
						<i class="fas fa-file-upload text-primary mr-2"></i>
						<label class="text-primary font-weight-bold mb-0 mt-1 w-100">
							Click Here to upload your file
							<input type="file" id="fileupload7" name="fileupload7" class="d-none" elem-id="7" fileType="51"
								onchange="uploadDocsFun(this, 'schoolLogo', 600, 300)" />
						</label>
					</div>
					<div class="d-none align-items-center border rounded px-3 py-2 bg-white" id="fileDisplaySection7">
						<i class="fas fa-file-upload text-primary mr-2"></i>
						<span class="flex-grow-1 text-dark font-weight-bold text-truncate" id="fileNameDisplay7">Filename.jpg</span>
						<i class="fa fa-trash text-danger mt-1" id="deleteFileBtn7" title="Delete" onclick="deleteFile(51, 7)"></i>
						<i class="fa fa-eye text-primary mr-3 mt-1" id="viewFileBtn7" title="View" onclick="viewFile(51, 'School Logo')"></i>
					</div>
					<p class="text-warning font-12">Recommended dimensions: 600×300 px</p>
				</div>

				<!-- School Email Logo -->
				<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">
					<label>School Email Logo<sup class="text-danger">*</sup></label>
					<div class="d-flex align-items-center border rounded px-3 py-2 bg-white" id="uploadSection8">
						<i class="fas fa-file-upload text-primary mr-2"></i>
						<label class="text-primary font-weight-bold mb-0 mt-1 w-100">
							Click Here to upload your file
							<input type="file" id="fileupload8" name="fileupload8" class="d-none" elem-id="8" fileType="59"
								onchange="uploadDocsFun(this, 'schoolEmailLogo', 300, 100)" />
						</label>
					</div>
					<div class="d-none align-items-center border rounded px-3 py-2 bg-white" id="fileDisplaySection8">
						<i class="fas fa-file-upload text-primary mr-2"></i>
						<span class="flex-grow-1 text-dark font-weight-bold text-truncate" id="fileNameDisplay8">Filename.jpg</span>
						<i class="fa fa-trash text-danger mt-1" id="deleteFileBtn8" title="Delete" onclick="deleteFile(59, 8)"></i>
						<i class="fa fa-eye text-primary mr-3 mt-1" id="viewFileBtn8" title="View" onclick="viewFile(59, 'School Email Logo')"></i>
					</div>
					<p class="text-warning font-12">Recommended dimensions: 300×100 px</p>
				</div>

				<!-- School Fav Icon -->
				<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">
					<label>School Fav Icon<sup class="text-danger">*</sup></label>
					<div class="d-flex align-items-center border rounded px-3 py-2 bg-white" id="uploadSection9">
						<i class="fas fa-file-upload text-primary mr-2"></i>
						<label class="text-primary font-weight-bold mb-0 mt-1 w-100">
							Click Here to upload your file
							<input type="file" id="fileupload9" name="fileupload9" class="d-none" elem-id="9" fileType="60"
								onchange="uploadDocsFun(this, 'schoolFavIcon', 96, 96)" />
						</label>
					</div>
					<div class="d-none align-items-center border rounded px-3 py-2 bg-white" id="fileDisplaySection9">
						<i class="fas fa-file-upload text-primary mr-2"></i>
						<span class="flex-grow-1 text-dark font-weight-bold text-truncate" id="fileNameDisplay9">Filename.jpg</span>
						<i class="fa fa-trash text-danger mt-1" id="deleteFileBtn9" title="Delete" onclick="deleteFile(60, 9)"></i>
						<i class="fa fa-eye text-primary mr-3 mt-1" id="viewFileBtn9" title="View" onclick="viewFile(60, 'School Fav Icon')"></i>
					</div>
					<p class="text-warning font-12">Recommended dimensions: 96×96 px</p>
				</div>

				<!-- School White Logo -->
				<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">
					<label>School White Logo<sup class="text-danger">*</sup></label>
					<div class="d-flex align-items-center border rounded px-3 py-2 bg-white" id="uploadSection10">
						<i class="fas fa-file-upload text-primary mr-2"></i>
						<label class="text-primary font-weight-bold mb-0 mt-1 w-100">
							Click Here to upload your file
							<input type="file" id="fileupload10" name="fileupload10" class="d-none" elem-id="10" fileType="61"
								onchange="uploadDocsFun(this, 'schoolWhiteLogo', 600, 300)" />
						</label>
					</div>
					<div class="d-none align-items-center border rounded px-3 py-2 bg-white" id="fileDisplaySection10">
						<i class="fas fa-file-upload text-primary mr-2"></i>
						<span class="flex-grow-1 text-dark font-weight-bold text-truncate" id="fileNameDisplay10">Filename.jpg</span>
						<i class="fa fa-trash text-danger mt-1" id="deleteFileBtn10" title="Delete" onclick="deleteFile(61, 10)"></i>
						<i class="fa fa-eye text-primary mr-3 mt-1" id="viewFileBtn10" title="View" onclick="viewFile(61, 'School White Logo')"></i>
					</div>
					<p class="text-warning font-12">Recommended dimensions: 600×300 px</p>
				</div>
			</div>`;
	return html;
}

function getColorThemeContent(){
	var html=
		`<h3 class="mt-3">Theme Color</h3>
		<div class="row">
			<div class="col-12">
				<div class="d-flex align-items-start flex-wrap mb-4">
					<div class="mr-5 mb-4">
						<label class="d-block font-weight-bold mb-2">Primary Color</label>
						<input type="color" id="primaryColor" value="${getCssVariableValue(ROOTCSS, 'pc')}" class="color-preview" onchange="updateColorPreview()">
						<div class="gradient-preview" id="primaryGradientPreview"></div>
						<small class="text-muted d-block mt-1">Primary Gradient</small>
					</div>
					
					<div class="mr-5 mb-4">
						<label class="d-block font-weight-bold mb-2">Secondary Color</label>
						<input type="color" id="secondaryColor" value="${getCssVariableValue(ROOTCSS, 'sc')}" class="color-preview" onchange="updateColorPreview()">
					</div>

					<div class="mr-5 mb-4">
						<label class="d-block font-weight-bold mb-2">Third Color</label>
						<input type="color" id="thirdColor" value="${getCssVariableValue(ROOTCSS, 'tc')}" class="color-preview" onchange="updateColorPreview()">
					</div>

					<div class="mr-5 mb-4">
						<label class="d-block font-weight-bold mb-2">Fourth Color</label>
						<input type="color" id="fourthColor" value="${getCssVariableValue(ROOTCSS, 'fc')}" class="color-preview" onchange="updateColorPreview()">
					</div>
					
					<div class="mb-4">
						<button type="button" class="btn btn-outline-secondary mt-4" onclick="resetToDefaultColors()">
							<i class="fa fa-refresh mr-2"></i>Default Colors
						</button>
					</div>
				</div>
			</div>
		</div>`
	return html;
}

function getSchoolSetupCongratulationsModalContent(){
	var html=
	`<div class="modal fade" id="schoolSetupCongratulationsModal" tabindex="-1" role="dialog" aria-labelledby="celebrateModalLabel" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="celebrateModalLabel">🎊 Congratulations!</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body text-center position-relative overflow-hidden" style="max-height:250px">
					<span class="success-icon mb-3" style="font-size:65px">🏫</span>
					<h4 class="font-weight-bold text-success mb-3">School Setup Completed Successfully!</h4>
					<h5 class="text-dark mb-0">
						Your school configuration has been saved and is now ready for use.
					</h5>
					<canvas class="modalConfettiCanvas" id="confettiCanvas"></canvas>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}