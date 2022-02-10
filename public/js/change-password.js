function gotoChangeAdminPasswordPage(adminID) {
    window.location.assign("change-admin-password.html");
    setAdminIDToChangePassword(adminID);
}

//setting adminID for changing admin email
function setAdminIDToChangePassword(adminID) {
    localStorage.setItem("adminID-changePassword", adminID);
}

//getting the setted adminID for changing admin email
function getAdminIDToUpdatePassword() {
    return localStorage.getItem("adminID-changePassword");
}

//removing the setted adminID for changing admin email
function removeAdminIDToChangePassword() {
    localStorage.removeItem("adminID-changePassword");
}