function gotoChangeAdminEmailPage(adminID, email, password) {
    window.location.assign("change-admin-email.html");
    setAdminIDToChangeEmail(adminID);
}

//setting adminID for changing admin email
function setAdminIDToChangeEmail(adminID) {
    localStorage.setItem("adminID", adminID);
}

var btnChangeEmail = document.getElementById("button-change-email");
btnChangeEmail.onclick = function() {
    window.alert("change email button clicked");
}

var btnCancelChangeEmail = document.getElementById("samplecancel");
btnCancelChangeEmail.onclick = function() {
    window.alert("cancel change email button clicked");
}