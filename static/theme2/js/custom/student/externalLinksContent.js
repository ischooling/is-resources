var schoolSettingsLinks;
var schoolSettingsTechnical;
async function getExternalLinkCotent(pageRequest){
    schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
    schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
    var html=
        `<div class="app-container body-tabs-shadow fixed-header fixed-sidebar">`
            +getHeaderContent()
            +getContent(pageRequest)
            +getFooterContent()
        html+=`</div>`;
    return html;
}
function getHeaderContent(){
    var html=
        `<div class="sticky-header bg-white">
            <div class="app-header header-shadow">
                <div class="app-header__logo" style="order:0">
                    <a href="${schoolSettingsLinks.schoolWebsite}" target="blank"	class="logo-src" style="background:url(${schoolSettingsLinks.logoUrl}${SCRIPT_VERSION});"></a>
                </div>
            </div>
        </div>`;
    return html;
}

function getContent(pageRequest){
    var html=
        `<div class="app-main">
            <div class="col-xl-7 col-lg-8 col-md-10 col-sm-12 mx-auto">
                <div class="app-main__inner app-theme-white m-auto p-4 card zoomIn animated br-4">`;
                    if(MAINTENANCEDOWNTIME != ''){
                        html+=
                        `<div class="full">
                            <marquee id="marqueeDiv" direction="left" class="full text-danger">${MAINTENANCEDOWNTIME}</marquee>
                        </div>`;
                    }
                    if(pageRequest == "terms-of-use"){
                        if(SCHOOL_ID == 6){
                            html+=
                            `<div class="full text-dark">
                                <div>
                                    <h2 class="full text-center font-weight-bold">Terms of Use</h2>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">1. Introduction</h5>
                                    <p>Welcome to La Senda Global Academy These Terms of Use binding agreement between you (“you” or “your,” referring to both parents/guardians and students) and La Senda Global Academy (“we,” “us,” or “our”). By accessing and using our online learning platform, you agree to comply with these terms. Please review these terms carefully before using our services.</p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">2. Acceptable Use</h5>
                                    <p>Our online platform is designed to provide a safe and effective learning environment for K-12 education. By using our platform, you agree to the following:</p>
                                    <ul class="pl-4">
                                        <li style="list-style:disc"><b>Respectful Communication:</b> Users (students and parents) must use respectful, appropriate language when communicating with teachers, peers, and administration.</li>
                                        <li style="list-style:disc"><b>Prohibited Content:</b> Students and parents are prohibited from sharing or uploading harmful, illegal,violent, obscene, or otherwise inappropriate content on the platform.</li>
                                        <li style="list-style:disc"><b>Academic Integrity:</b> Students must submit original work and avoid plagiarism, cheating, or the use of unauthorized assistance.</li>
                                        <li style="list-style:disc"><b>Fair Use of Resources:</b> Misuse of school resources (e.g., servers or tools) for non-educational purposes is not allowed.</li>
                                    </ul>
                                    <p>Failure to follow these expectations may result in disciplinary action, including suspension or loss of access to our platform.</p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">3. Privacy</h5>
                                    <p>We are committed to protecting your data and privacy. We will only collect, use, and store information that is necessary to provide quality educational services.</p>
                                    <ul class="pl-4">
                                        <li style="list-style:disc"><b>Student Information:</b> Information such as names, grades, and assignments will only be used for educational purposes and will not be shared with third parties without consent, except as required by law.</li>
                                        <li style="list-style:disc"><b>Parental Responsibility:</b> Parents are encouraged to help their children maintain strong online safety habits and ensure their personal information is not shared with others. For more details, please review our full Privacy Policy.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">4. Intellectual Property</h5>
                                    <p>All content provided by La Senda Global Academy and its partners, including lessons, videos, assignments, and other materials, is the intellectual property of La Senda Global Academy and its partners.</p>
                                    <ul class="pl-4">
                                        <li style="list-style:disc">Downloading, reproducing, or sharing these materials without prior written consent is prohibited.</li>
                                        <li style="list-style:disc">Students are encouraged to use these materials for personal, educational purposes only.</li>
                                        <li style="list-style:disc">Any misuse of intellectual property may result in account termination and legal consequences.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">5. Account Security</h5>
                                    <p>To access our online platform, each user must create an account and maintain the confidentiality of their login credentials.</p>
                                    <ul class="pl-4">
                                        <li style="list-style:disc"><b>Student Responsibility:</b> Students must not share their passwords with others or allow unauthorized persons to access their accounts.</li>
                                        <li style="list-style:disc"><b>Parental Oversight:</b> Parents should monitor their child’s use of the account to ensure compliance with school policies.</li>
                                        <li style="list-style:disc">Parents and students must notify us immediately if there are any unauthorized logins, security breaches, or suspicious activities on their accounts.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">6. Payment Policies</h5>
                                    <ul class="pl-4">
                                        <li style="list-style:disc"><b>Tuition Fees:</b> Enrollment in La Senda Global Academy requires the payment of tuition, which must be made on or before the due date. Specific details about tuition fees, payment methods, and deadlines will be provided upon registration.</li>
                                        <li style="list-style:disc"><b>Refunds:</b> Refunds, if applicable, will be issued as outlined in the La Senda Global Academy Refund Policy. Failure to make payments on time may result in penalties, suspension, or termination of access to the platform.</li>
                                    </ul>
                                    <p>For further payment-related questions, please contact our billing department.</p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">7. Consequences for Violations</h5>
                                    <p>If a student or parent violates these Terms of Use, action may include, but is not limited to:</p>
                                    <ul class="pl-4">
                                        <li style="list-style:disc">Temporary or permanent suspension of platform access.</li>
                                        <li style="list-style:disc">Parental notification.</li>
                                        <li style="list-style:disc">Legal action if applicable.</li>
                                    </ul>
                                    <p>We will review all cases, and decisions will be based on the severity of the violation.</p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">8. School-Specific Policies</h5>
                                    <p>Students and parents are also required to adhere to the specific school policies outlined in the Student Handbook or Parent Guide. These include attendance requirements, grading policies, and behavior expectations specific to La Senda Global Academy.</p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">8. Disclaimer and Limitation of Liability</h5>
                                    <p>While we strive to provide uninterrupted, high-quality access to our online platform, we do not guarantee its uninterrupted availability due to maintenance, upgrades, or technical issues. </p>
                                    <p>We are not responsible for:</p>
                                    <ul class="pl-4">
                                        <li style="list-style:disc">Technical issues with your internet connection or devices.</li>
                                        <li style="list-style:disc">Third-party services connected to our platform.</li>
                                    </ul>
                                    <p>Our maximum liability for claims arising from your use of our platform will not exceed the cost of one semester’s tuition of courses affected.</p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">10. Changes to Terms</h5>
                                    <p>La Senda Global Academy reserves the right to update or modify these Terms of Use at any time. Any changes will be communicated through email or an announcement on our platform. Continued use of the platform after such changes constitutes acceptance of the updated terms.</p>
                                    <p>If you have questions or concerns about these Terms of Use, please contact us at <br><a href="mailto:admin@lasendaglobalacademy.com." class="text-primary">admin@lasendaglobalacademy.com.</a></p>
                                </div>
                            </div>`;
                        }
                    }else if(pageRequest == "privacy-policy"){
                        if(SCHOOL_ID == 6){
                            html+=
                            `<div class="full text-dark">
                                <div>
                                    <h2 class="full text-center font-weight-bold">Privacy Policy</h2>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">1. Introduction</h5>
                                    <p>
                                        At La Senda Global Academy, we take the safety of our students seriously and are
                                        deeply committed to safeguarding their privacy. Protecting the personal information and
                                        records of our global community of students, parents, and staff is a vital part of our
                                        mission. This Privacy Policy outlines how we collect, use, and protect information
                                        associated with our school services. By using our services, you agree to the practices
                                        described in this policy.
                                    </p>
                                    <p>includes:</p>
                                    <ul class="pl-4">
                                        <li style="list-style:disc">Student, parent, and staff details provided during registration</li>
                                        <li style="list-style:disc">Academic records, progress reports, and other educational information</li>
                                        <li style="list-style:disc">Communications and content shared on our platforms</li>
                                        <li style="list-style:disc">Technical data, such as device and usage information, to support system functionality</li>
                                    </ul>
                                    <p>We limit the collection of sensitive information to what is strictly necessary for the operation of our services.</p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">Our Commitment to Safety and Privacy</h5>
                                    <p>
                                        We are dedicated to creating a secure virtual environment where students can thrive
                                        academically and personally. Respecting and protecting the privacy of our community is
                                        a fundamental value. All student records and personal information are kept confidential
                                        and managed with safety in mind. Access to such information is limited to authorized
                                        personnel who need it to fulfill their roles in providing education and support.
                                    </p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">How We Use Information</h5>
                                    <p>The information we collect is used for the following purposes:</p>
                                    <ul class="pl-4">
                                        <li style="list-style:disc">Delivering personalized education and academic support</li>
                                        <li style="list-style:disc">Communicating with students, parents, and staff</li>
                                        <li style="list-style:disc">Managing student records and progress tracking</li>
                                        <li style="list-style:disc">Maintaining a safe and functional online learning environment</li>
                                        <li style="list-style:disc">Improving and troubleshooting our platforms</li>
                                    </ul>
                                    <p>We never sell or rent personal information to third parties. Every effort is made to ensure that all data is handled responsibly and only used for the purposes outlined above.</p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">Data Protection Measures</h5>
                                    <p>To safeguard the privacy and safety of our students, we use robust security measures, which include:</p>
                                    <ul class="pl-4">
                                        <li style="list-style:disc">Encryption of data during both storage and transmission</li>
                                        <li style="list-style:disc">Secure access controls to limit unauthorized access</li>
                                        <li style="list-style:disc">Routine security testing and system updates</li>
                                        <li style="list-style:disc">Staff training to ensure responsible data management</li>
                                    </ul>
                                    <p>While we strive to uphold the highest standards of data security, no system is entirely immune to risks. By using our services, you acknowledge and accept this inherent risk.</p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">Data Sharing and Third-Party Platforms</h5>
                                    <p>The sharing of information is strictly limited to instances where it is necessary and handled with care. Data may be shared under the following circumstances:</p>
                                    <ol class="pl-4">
                                        <li>Within La Senda School Community Information may be shared with educators, staff members, and authorized personnel who require it to support students' learning and development.</li>
                                        <li>With Trusted Third-Party Service Providers<br/>We use third-party platforms, such as learning management systems (LMS) and video conferencing tools, to enhance online learning. These providers are bound by contractual obligations to handle data responsibly and securely.</li>
                                        <li>To Meet Legal or Safety Requirements<br/>We may disclose information when necessary to comply with applicable regulations or to protect the safety and security of our students and staff.</li>
                                    </ol>
                                    <p>We always prioritize confidentiality and ensure that data sharing occurs only on a "need-to-know" basis to minimize any potential risks.</p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">Your Rights and Privacy Choices</h5>
                                    <p>We respect the rights of students, parents, and staff to have control over their personal information. We are a global community and operate worldwide. Depending on your location and applicable policies, you may have the ability to:</p>
                                    <ul class="pl-4">
                                        <li style="list-style:disc">Request access to personal records</li>
                                        <li style="list-style:disc">Correct or update any inaccurate information</li>
                                        <li style="list-style:disc">Request deletion of certain personal information, where permitted</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">Retention of Information</h5>
                                    <p><b>Lifetime Academic Verification and Enrollment Support</b></p>
                                    <p>La Senda Global Academy offers lifetime academic verification to ensure students can pursue further education opportunities.</p>
                                    <p>Additionally, we offer proof and verification proof of enrollment for citizenship, immigration, or other official purposes.</p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">Changes to the Privacy Policy</h5>
                                    <p>This Privacy Policy may be updated from time to time to reflect changes in our practices or services. Any significant updates will be communicated through our website or via email. Please refer to the "Effective Date" at the beginning of this document for the most recent update.</p>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold">Contact Us</h5>
                                    <p>If you have any questions, concerns, or requests regarding our Privacy Policy, please contact us:</p>
                                    <p>La Senda Global Academy<br><a href="mailto:admin@lasendaglobalacademy.com." class="text-primary">admin@lasendaglobalacademy.com.</a></p>
                                </div>
                            </div>`;
                        }
                    }
                html+=`</div>    
            </div>
        </div>`;
    return html;
}

function getFooterContent(){
    var html=
        `<div class="app-wrapper-footer mt-sm-4">
            <div class="app-footer mt-sm-4">
                <div class="app-footer__inner">
                <p style="margin: 0">${schoolSettingsTechnical.copyrightYear} © ${schoolSettingsTechnical.copyrightUrl}</p>
                </div>
            </div>
        </div>`;
    return html;
}