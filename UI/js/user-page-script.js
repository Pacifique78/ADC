let viewMentorsBtn = document.getElementById("view-mentors");
viewMentorsBtn.addEventListener('click', ()=>{
    let boxContent = document.getElementById("content-dispay");
    boxContent.innerHTML = '<div class="new-mentor"><div class="description"><img src="../images/profile.jpg" ><h4>Prof Chris Smith</h4><h4>Professor at College</h4><h4>20 years of experience</h4></div><p>Prof Chris Smith is a professor with a highest degree in computer science and have that will to help young people to progress by giving helpful advice.<br><button class="create-session">CREATE A SESSION</button><br><span>&#10004Session request submited successfully</span></p></div><div class="new-mentor"><div class="description"><img src="../images/user-profile1.jpg"><h4>Anna Magret</h4><h4>Software developer</h4><h4>5 years of experience</h4></div><p>Anna Magret is a software developer willing to help young people to progress by giving helpful advice.<br><button class="create-session">CREATE A SESSION</button></p></div><div class="new-mentor"><div class="description"><img src="../images/user-profile2.jpg"><h4>Clerk Muyunde</h4><h4>Analyst</h4><h4>3 years of experience</h4></div><p>Clerk Muyunde is an analyst willing to help young people to progress by giving helpful advice.<br><button class="create-session">CREATE A SESSION</button></p></div>';
    document.getElementById("back").style.visibility = "visible";
    let choices = document.getElementsByClassName("new-mentor");
    for(let choice of choices){
        choice.addEventListener('mouseover', ()=>{
            let createSessionBtn = document.getElementsByClassName("create-session");
            for(let btn of createSessionBtn){
                btn.style.visibility = "visible";
                btn.addEventListener('click', ()=>{
                    btn.style.display = "none";
                    let spans = document.getElementsByTagName("span");
                    for(let span of spans){
                        span.style.visibility = "visible";
                        span.style.color = "green";
                        span.style.fontWeight = "bold";
                    }
                });
            }
        });
    }
});
let backBtn = document.getElementById("back");
backBtn.addEventListener('click', ()=>{
    window.location.assign("../html/user-page.html");
});
