let signInBtn = document.getElementById("sign");
signInBtn.addEventListener('click', ()=>{
    window.location.assign("../html/user-page.html");
});
let cancelBtn = document.getElementById("cancel");
cancelBtn.addEventListener('click', () =>{
    window.location.assign("../index.html");
});