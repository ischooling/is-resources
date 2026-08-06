function renderClubsCommonPage(title){
    $('#dashboardContentInHTML').html(getClubsCommonCard(title));
}

function getClubsCommonCard(title){
    var clubImages = {
        "Spanish Club": "spanish.webp",
        "French Club": "French.webp",
        "German Club": "german.webp",
        "English Club": "English.webp",
        "Chinese Club": "chinese.webp",

        "Team Building Club": "Team_Building.webp",
        "Cultural Exchange Club": "Cultural_Exchange.webp",
        "Leadership Skills Club": "Leadership_Skills.webp",
        "Debate Club": "Debate_Club.webp",
        "Drama & Expression Club": "Drama_Expression.webp",
        "Public Speaking Club": "Public_speaking.webp",

        "Focus & Reaction Training Club": "Focus_Reaction_Training.webp",
        "Skill Development Club": "Skill_Development.webp",
        "Team Communication Club": "Team_Communication.webp",
        "Online Tournaments Club": "Online_Tournaments.webp",
        "Strategy Games Club": "Strategy_Games.webp",
        "Competitive Gaming Club": "Competitive_Gaming.webp",
        "Global Competitions Club": "Global_Competitions.webp",
        "Game Strategy & Analysis Club": "Game_Strategy_Analysis.webp",

        "Student Council": "Leadership_Skills.webp",
        "The Debate Club": "Debate_Club.webp",
        "The Book Club": "book.webp",
        "The Art Club": "art_club.webp",
        "The STEM Club": "stem.webp",
        "The Gaming Club": "gd.webp",
        "The Law Club": "investigation.webp",
        "The Global Exchange Club": "language.webp",
        "The Wellness Club": "music.webp",
        "The Newsletter": "og.webp",
        "The Entrepreneurship Club": "entrepreneurship.webp",
    };
    var clubSubtitles = {
        "The Debate Club": "International Diplomat and Orator's Society (IDOS)",
        "The Book Club": "International Literary Society (ILS)",
        "The Art Club": "Viva De Lunaria",
        "The STEM Club": "Aurelian",
        "The Gaming Club": "Link Club",
        "The Law Club": "Lex Orbis Legal Society",
        "The Global Exchange Club": "Nexus",
        "The Wellness Club": "Radiant Mind",
        "The Newsletter": "The Horizons",
    };
    const imageName = clubImages[title]
    const subtitle = clubSubtitles[title]
    const subtitleHtml = subtitle ? ` &ndash; ${subtitle}` : ""
    var html=
        `<div class="card mx-auto mt-4 rounded-10" style="max-width: 980px;">
            <div class="card-body">
                <div class="d-flex justify-content-center align-items-center flex-column">
                    <img src="${PATH_FOLDER_IMAGE2}clubs/${imageName}" class="rounded-10" style="max-width: 65%;">
                    <h4 class="mt-3 font-weight-bold text-dark" style="max-width: 100%;">Be part of our ${title}!${subtitleHtml}</h4>
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