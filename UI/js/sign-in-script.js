
let signBtn = document.getElementById("sign");
signBtn.addEventListener('click', () => {
    let statusInput = document.getElementById("status");
    if(statusInput.value.toLowerCase() == "admin"){
        window.location.assign("../html/admin-page.html");
    }
    else if(statusInput.value.toLowerCase() == "mentee"){
        window.location.assign("../html/user-page.html");
    }
    else if(statusInput.value.toLowerCase() == "mentor"){
        window.location.assign("../html/mentors-page.html");
    }
    else{
        alert("Unknown status");
    }
});