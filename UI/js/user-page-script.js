let readMoreBtn = document.getElementById("read-more");
readMoreBtn.addEventListener('click', function(){
    readMoreBtn.style.display = "none";
    document.getElementById("span").style.visibility = "visible";
})
let viewMentorsBtn = document.getElementById("view-mentors");
viewMentorsBtn.addEventListener('click', function(){
    let boxContent = document.getElementById("content-dispay");
    boxContent.innerHTML = '<div class="new-mentor"><img src="../images/profile.jpg" alt=""><h2>Prof Chris Smith</h2><p>Prof Chris Smith is a professor with a highest degree in computer science and have that will to help young people to progress by giving helpful advice.</p></div><div class="new-mentor"><img src="../images/profile.jpg" alt=""><h2>Prof Chris Smith</h2><p>Prof Chris Smith is a professor with a highest degree in computer science and have that will to help young people to progress by giving helpful advice.</p></div><div class="new-mentor"><img src="../images/profile.jpg" alt=""><h2>Prof Chris Smith</h2><p>Prof Chris Smith is a professor with a highest degree in computer science and have that will to help young people to progress by giving helpful advice.</p></div>';
   boxContent.style.display = "flex";
});