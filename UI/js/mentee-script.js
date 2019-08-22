let signInBtn = document.getElementById("sign");
signInBtn.addEventListener('click', function(){
    window.location.assign("../html/user-page.html");
});
let cancelBtn = document.getElementById("cancel");
cancelBtn.addEventListener('click', function(){
    window.location.assign("../html/index.html");
});