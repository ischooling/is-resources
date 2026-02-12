function renderClubsCommonPage(title){
    $('#dashboardContentInHTML').html(getClubsCommonCard(title));
}

function getClubsCommonCard(title){
    var clubImages = {
        "Spanish Club": "spanish.png",
        "French Club": "French.png",
        "German Club": "german.png",
        "English Club": "English.png",
        "Chinese Club": "chinese.png",

        "Team Building Club": "Team_Building.png",
        "Cultural Exchange Club": "Cultural_Exchange.png",
        "Leadership Skills Club": "Leadership_Skills.png",
        "Debate Club": "Debate_Club.png",
        "Drama & Expression Club": "Drama_Expression.png",
        "Public Speaking Club": "Public_speaking.png",

        "Focus & Reaction Training Club": "Focus_Reaction_Training.png",
        "Skill Development Club": "Skill_Development.png",
        "Team Communication Club": "Team_Communication.png",
        "Online Tournaments Club": "Online_Tournaments.png",
        "Strategy Games Club": "Strategy_Games.png",
        "Competitive Gaming Club": "Competitive_Gaming.png",
        "Global Competitions Club": "Global_Competitions.png",
        "Game Strategy & Analysis Club": "Game_Strategy_Analysis.png",
    };
    const imageName = clubImages[title]
    var html=
        `<div class="card mx-auto mt-4 rounded-10" style="max-width: 768px;">
            <div class="card-body">
                <div class="d-flex justify-content-center align-items-center flex-column">
                    <img src="${PATH_FOLDER_IMAGE2}clubs/${imageName}" class="rounded-10" style="max-width: 65%;">
                    <h4 class="mt-3 font-weight-bold text-dark">Be part of our ${title}!</h4>
                    <p class="rounded-20 py-2 px-4 mt-3 font-weight-semi-bold" style="color:#C2410C; background-color:#FFEDD5;"><i class="fa fa-rocket" aria-hidden="true"></i> Sign up today.</p>
                    <a href="javascript:void(0);" onclick="applyForClub('${title}')" class="btn text-white font-18 mt-4 rounded-10" style="background: linear-gradient(90deg, #027FFE 0%, #02B9CB 100%);">Register Now</a>
                </div>
            </div>
        </div>`
    return html;
}

function getClubRegistrationSuccessModal(){
    var html=
        `<div class="modal fade" id="clubRegistrationSuccessModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered no-shadow" style="max-width: 500px;" role="document">
                <div class="modal-content">
                    <button type="button" class="close ml-auto mr-2 mt-2" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="modal-body text-center">
                        <div class="">
                            <img src="${PATH_FOLDER_IMAGE2}Awesome_Success_Check_Animation.gif" alt="check-gif" class="" style="max-width: 100px;">
                        </div>
                        <h2 class="font-weight-semi-bold">You're all Set!</h2>
                        <p class="font-16">
                            Registration received.<br>
                            We’ll keep you updated.
                        </p>
                    </div>

                </div>
            </div>
        </div>`
    return html;
}