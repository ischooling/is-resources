var CLUBS = [
    {
        name: "International Language Club",
        category: "The Language Club",
        description:
            "Explore global languages and cultures through interactive sessions, conversations, and cultural exchanges.",
        img: "clubs/language.webp",
        link: "",
        languages: [
            "Spanish",
            "French",
            "German",
            "English",
            "Chinese"
        ]
    },
    {
        name: "International Diplomats & Orators Society",
        category: "The Debate & MUN Club",
        description:
            "Sharpen your speaking and leadership skills through debates, MUNs, and global discussions.",
        img: "clubs/gd.webp",
        link: "/clubs/debate",
    },
    {
        name: "International Literary Society",
        category: "The Book Club",
        description:
            "Dive into books, share ideas, write creatively, and connect through a love for reading.",
        img: "clubs/book.webp",
        link: "/clubs/book",
    },
    {
        name: "Viva de Lunaria Club",
        category: "The Art Club",
        description:
            "Express yourself through painting, sketching, and artistic challenges with fellow creatives.",
        img: "clubs/art_club.webp",
        link: "/clubs/art",
    },
    {
        name: "Ridmond Criminology Club",
        category: "The Criminology Club",
        description:
            "Uncover mysteries and explore real-world cases through critical thinking and analysis.",
        img: "clubs/investigation.webp",
        link: "/clubs/criminology",
    },
    {
        name: "Music Club",
        category: "The Music Club",
        description:
            "Discover your sound—play, sing, or compose in a creative space built for music lovers.",
        img: "clubs/music.webp",
        link: "/clubs/music",
    },
    {
        name: "The Aurelian Club",
        category: "The STEM Club",
        description:
            "Explore science, tech, engineering, and math through fun projects and team innovations.",
        img: "clubs/stem.webp",
        link: "/clubs/stem",
    },
    {
        name: "Student Council",
        category: "Student Council",
        description:
            "Represent your peers, lead school initiatives, and build leadership skills through student government.",
        img: "clubs/Leadership_Skills.webp",
        link: "",
    },
    {
        name: "The Gaming Club",
        category: "The Gaming Club",
        description:
            "Compete, strategize, and connect with fellow gamers through casual and competitive gaming sessions.",
        img: "clubs/gd.webp",
        link: "",
    },
    {
        name: "The Global Exchange Club",
        category: "The Global Exchange Club",
        description:
            "Connect with students worldwide and celebrate diverse cultures through global exchange activities.",
        img: "clubs/language.webp",
        link: "",
    },
    {
        name: "The Newsletter",
        category: "The Newsletter",
        description:
            "Write, edit, and publish school news, stories, and creative pieces for the community.",
        img: "clubs/og.webp",
        link: "",
    },
    {
        name: "The Entrepreneurship Club",
        category: "The Entrepreneurship Club",
        description:
            "Build business ideas, pitch projects, and develop entrepreneurial skills with fellow innovators.",
        img: "clubs/entrepreneurship.webp",
        link: "",
    },
]
function clubsOnLoad(){
    bindClubs();
}

function bindClubs(){
    $('#clubsRow').empty();
    $.each(CLUBS, function(index, club){
        var cardHtml = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border" style="border-radius:16px; overflow:hidden;">
                    <img src="${PATH_FOLDER_IMAGE2}${club.img}" class="card-img-top" alt="${club.name}" style="height:200px; object-fit:cover;">
                    
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title font-weight-bold">
                            ${club.name}
                        </h5>

                        <span class="badge badge-primary mb-2" style="width:fit-content;">
                            ${club.category}
                        </span>

                        <p class="card-text text-muted">
                            ${club.description}
                        </p>`

                        if(club.languages && club.languages.length > 0){
                            cardHtml+=
                            `<p class="card-text text-muted mb-2">
                                <b>Languages:</b> ${club.languages.join(", ")}
                            </p>`
                        }

                        cardHtml+=`<div class="d-flex justify-content-between align-items-center mt-auto">`
                            if(club.link != ""){
                                cardHtml+=
                                ` <a href="https://internationalschooling.org${club.link}" target="_blank" class="btn btn-outline-secondary mt-auto">
                                    View Club
                                </a>`
                            }
                            cardHtml+=`<a href="javascript:void(0);" onclick="applyForClub('${club.category}')" class="btn btn-primary mt-auto scale-animate ${club.link != '' ? '' : 'ml-auto'}">
                                Register Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('#clubsRow').append(cardHtml);
    });
}

async function applyForClub(clubName){
    var payload = {
        userId: USER_ID,
        clubName: clubName
    };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/save-club-request",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        showMessageTheme2(1, "Registered Successfully");
    }else{
        showMessageTheme2(0, responseData.message);
    }
}