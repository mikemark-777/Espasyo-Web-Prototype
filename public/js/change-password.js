function gotoChangeAdminPasswordPage(adminID) {
    window.location.assign("change-admin-password.html");
    setAdminIDToChangePassword(adminID);
}

//will display the data of the admin whose password will be changed
function displayAdminData_updatePassword() {
    //from database
    fetchAndDisplayAdminData_updatePassword();
}

var btnChangePassword = document.getElementById("button-change-password");
btnChangePassword.onclick = function() {
    window.alert("Change password clicked");
}

var btnCancelChangePassword = document.getElementById("button-cancel-change-password");
btnCancelChangePassword.onclick = function() {
    logoutAdminForChanges();
    removeAdminIDToChangePassword();
    window.location.replace("manage-admin.html");
}

//setting adminID for changing admin password
function setAdminIDToChangePassword(adminID) {
    localStorage.setItem("adminID-changePassword", adminID);
}

//getting the setted adminID for changing admin password
function getAdminIDToUpdatePassword() {
    return localStorage.getItem("adminID-changePassword");
}

//removing the setted adminID for changing admin password
function removeAdminIDToChangePassword() {
    localStorage.removeItem("adminID-changePassword");
}