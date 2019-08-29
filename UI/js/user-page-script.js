let readMoreBtn = document.getElementById("read-more");
readMoreBtn.addEventListener('click', () => {
    readMoreBtn.style.display = "none";
    document.getElementById("span").style.visibility = "visible";
})
let viewMentorsBtn = document.getElementById("view-mentors");
viewMentorsBtn.addEventListener('click', () => {
    let boxContent = document.getElementById("content-dispay");
    boxContent.innerHTML = '<div class="new-mentor"><img src="../images/profile.jpg" alt=""><h2>Prof Chris Smith</h2><p>Prof Chris Smith is a professor with a highest degree in computer science and have that will to help young people to progress by giving helpful advice.</p></div><div class="new-mentor"><img src="../images/user-profile1.jpg" alt=""><h2>Anna Magret</h2><p>Anna Magret is a software developer willing to help young people to progress by giving helpful advice.</p></div><div class="new-mentor"><img src="../images/user-profile2.jpg" alt=""><h2>Clerk Muyunde</h2><p>Clerk Muyunde is an analyst willing to help young people to progress by giving helpful advice.</p></div>';
    boxContent.style.display = "flex";
    document.getElementById("back").style.visibility = "visible";
    let choice = document.getElementsByClassName("new-mentor");
    choice.addEventListener('click', () => {

    });
});
let backBtn = document.getElementById("back");
backBtn.addEventListener('click', () => {
    window.location.assign("../html/user-page.html");
});
let viewSpecificMentorsBtn = document.getElementById("view-specific-mentor");
viewSpecificMentorsBtn.addEventListener('click', () => {
    let newMentor = document.getElementById("new-mentor");
    newMentor.innerHTML = '<input id="search" type = "text" placeholder="&#128269; Search"><button id="search-btn">Search</button><button id="back-search-btn">Back</button>';
    newMentor.style.border = "none";
    document.getElementById("button").style.display = "none";
    let backSearchBtn = document.getElementById("back-search-btn");
    backSearchBtn.addEventListener('click', () => {
        window.location.assign("../html/user-page.html");
    });
    let searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener('click', () => {
        let inputName = document.getElementById("search");
        if("Prof Chris Smith".toLowerCase().includes(inputName.value.toLowerCase())){
            let boxContent = document.getElementById("content-dispay");
            boxContent.innerHTML = '<div class="new-mentor"><img src="../images/profile.jpg" alt=""><h2>Prof Chris Smith</h2><p>Prof Chris Smith is a professor with a highest degree in computer science and have that will to help young people to progress by giving helpful advice.</p></div>';
        }
        else{
            let boxContent = document.getElementById("content-dispay");
            boxContent.innerHTML = '<p>The mentor with such name not found</p>'
        }
        document.getElementById("back").style.visibility = "visible";
    });
});
