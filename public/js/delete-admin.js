//navigate from manage-admin page to delete admin page
function gotoDeleteAdminPage(adminID) {
    window.location.assign("delete-admin.html");
    setAdminIDToDelete(adminID);
}

//setting adminID for deleting admin account
function setAdminIDToDelete(adminID) {
    localStorage.setItem("adminID", adminID);
}

var btnDeleteAccount = document.getElementById("button-delete-account");
btnDeleteAccount.onclick = function() {
    const adminToDelete = secondAppAuth.currentUser;
    adminToDelete.delete()
        .then(() => {
            deleteAdminData();
        })
        .catch((error) => {
            window.alert(error);
        });
};

var btnCancelDeleteAccount = document.getElementById("button-cancel-delete");
btnCancelDeleteAccount.onclick = function() {
    secondAppAuth.signOut().then(() => {
        removeAdminID();
        window.location.replace("manage-admin.html");
    });
}

function checkIfHasAdminToDelete() {
    if (getAdminIDToDelete() == null) {
        window.location.assign("manage-admin.html");
    }
}

//getting the setted adminID
function getAdminIDToDelete() {
    return localStorage.getItem("adminID");
}

//removing the setted adminID
function removeAdminID() {
    localStorage.removeItem("adminID");
}