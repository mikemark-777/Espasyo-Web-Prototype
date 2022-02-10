//for saving data of newly created admin to firestore
function saveUserDataToDatabase(newAdmin) {

    //extract data for user object
    var userID = newAdmin.adminID;
    var email = newAdmin.email;
    var password = newAdmin.password;
    var userRole = newAdmin.userRole;

    const userObj = new User(userID, email, password, userRole);
    var userDocRef = database.collection("users").doc(userID);
    var adminDocRef = database.collection("admins").doc(userID);

    userDocRef.withConverter(userConverter)
        .set(userObj)
        .then(function() {
            adminDocRef.withConverter(adminConverter)
                .set(newAdmin)
                .then(function() {
                    window.alert("New Admin has been created!");
                    window.location.reload();
                })
                .catch(function(error) {
                    var error_code = error.code;
                    var error_message = error.message;

                    window.alert(error_code);
                });
        })
        .catch(function(error) {
            var error_code = error.code;
            var error_message = error.message;

            window.alert(error_code);
        });

}

//getting data from firebase

function fetchListOfAdminToDatabase() {
    var admins = [];

    var adminCollectionRef = database.collection("admins");

    adminCollectionRef.withConverter(adminConverter)
        .get().then((querySnapshot) => {
            if (querySnapshot) {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    var adminObj = doc.data();
                    admins.push(adminObj);
                });
                renderAllAdminsToTable(admins);
            } else {
                console.log("No such document!");
            }

        })
        .catch(function(error) {
            var error_code = error.code;
            var error_message = error.message;

            window.alert(error_code);
        });
}

var tbody = document.getElementById('property-list-body');

function renderAdminToTable(adminID, firstName, lastName, email, password) {

    let trow = document.createElement("tr");
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let passwordBox = document.createElement('input');
    let eyelash = document.createElement('i');
    let td5 = document.createElement('td');
    let btnEditAdmin = document.createElement("button");
    let btnDeleteAdmin = document.createElement("button");


    td1.innerHTML = firstName;
    td2.innerHTML = lastName;
    td3.innerHTML = email;
    //configure passwordbox which will contain the password
    passwordBox.type = "password";
    passwordBox.value = password;
    passwordBox.disabled = true;
    passwordBox.className += "passwordBox";
    eyelash.className += "bi-eye-slash";
    eyelash.id = "togglePassword";
    eyelash.innerHTML = "show";
    td4.appendChild(passwordBox);
    td4.appendChild(eyelash);


    //configure the buttons for managing admin accounts
    btnEditAdmin.innerHTML = "Edit";
    btnDeleteAdmin.innerHTML = "Delete"
    btnEditAdmin.className += "btnEditAdmin";
    btnDeleteAdmin.className += "btnDeleteAdmin";
    td5.appendChild(btnEditAdmin);
    td5.appendChild(btnDeleteAdmin);

    eyelash.onclick = function() {
        // toggle the type attribute
        const type = passwordBox.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordBox.setAttribute('type', type);
        // toggle the eye / eye slash icon
        if (eyelash.innerText == "show") {
            eyelash.innerHTML = "hide";
        } else {
            eyelash.innerHTML = "show";
        }

    }

    btnEditAdmin.onclick = function() {
        showEditPopup(adminID, firstName, lastName, email, password);
    }

    btnDeleteAdmin.onclick = function() {
        gotoDeleteAdminPage(adminID);
    }

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    tbody.append(trow);

}

function renderAllAdminsToTable(admins) {
    tbody.innerHTML = "";
    admins.forEach(admin => {
        renderAdminToTable(admin.adminID, admin.firstName, admin.lastName, admin.email, admin.password);
    })
}

// ============= custom javascript objects and converters =====================//

class User {
    constructor(userID, email, password, userRole) {
        this.userID = userID;
        this.email = email;
        this.password = password;
        this.userRole = userRole;
    }
}

const userConverter = {
    toFirestore: function(user) {
        return {
            userID: user.userID,
            email: user.email,
            password: user.password,
            userRole: user.userRole
        };
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new User(data.userID, data.email, data.password, data.userRole);
    }
}

class Admin {
    constructor(adminID, firstName, lastName, email, password, userRole) {
        this.adminID = adminID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.userRole = userRole;
    }
}


const adminConverter = {
    toFirestore: function(admin) {
        return {
            adminID: admin.adminID,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            password: admin.password,
            userRole: admin.userRole
        };
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new Admin(data.adminID, data.firstName, data.lastName, data.email, data.password, data.userRole);
    }
}


function showEditPopup(adminID, firstName, lastName, email, password) {
    firstNameTextboxEdit = document.getElementById('firstNameEdit');
    lastNameTextboxEdit = document.getElementById('lastNameEdit');
    document.querySelector(".popup").classList.add("active");

    firstNameTextboxEdit.value = firstName;
    lastNameTextboxEdit.value = lastName;

    var btnSaveEdit = document.getElementById("saveEdit");
    var btnCancelEdit = document.getElementById("cancelEdit");
    var linkToChangeEmail = document.getElementById("link-edit-email");
    var linkToChangePassword = document.getElementById("link-edit-password");

    btnSaveEdit.onclick = function() {

        firstNameEdit = firstNameTextboxEdit.value;
        lastNameEdit = lastNameTextboxEdit.value;

        isChangeMadeIn(firstName, lastName, firstNameEdit, lastNameEdit, adminID);
    };

    btnCancelEdit.onclick = function() {
        hideEditPopup();
    };

    linkToChangeEmail.onclick = function() {
        gotoChangeAdminEmailPage(adminID);
    };

    linkToChangePassword.onclick = function() {
        // gotoChangeAdminPasswordPage(adminID);
        gotoChangeAdminPasswordPage(adminID);
    };

}

function hideEditPopup() {
    document.querySelector(".popup").classList.remove("active");
}

function isChangeMadeIn(firstName, lastName, firstNameEdit, lastNameEdit, adminID) {
    var isFNChanged = firstName != firstNameEdit;
    var isLNChanged = lastName != lastNameEdit;

    if (isFNChanged == true || isLNChanged == true) {
        editAdmin(firstNameEdit, lastNameEdit, adminID);
    } else {
        window.alert("Nothing is changed")
    }
    document.querySelector(".popup").classList.remove("active");
}

function editAdmin(firstName, lastName, adminID) {
    var adminDocRef = database.collection("admins").doc(adminID);

    adminDocRef.update({
            firstName: firstName,
            lastName: lastName
        })
        .then(() => {
            window.alert("Admin successfully edited");
            location.reload();
        })
        .catch((error) => {
            window.alert(error);
        });
}

// FOR UPDATING ADMIN EMAIL ====================================================

//will display the data of the admin whose email will be changed
function fetchAndDisplayAdminData_updateEmail() {
    var adminID = getAdminIDToUpdateEmail();
    var adminCollectionRef = database.collection("admins").doc(adminID);
    adminCollectionRef.get().then((doc) => {
            if (doc.exists) {
                adminObject = doc.data();
                var firstName = adminObject.firstName;
                var lastName = adminObject.lastName;
                var email = adminObject.email;
                var password = adminObject.password;

                var displayFN = document.getElementById("adminFN");
                var displayLN = document.getElementById("adminLN");
                var displayEmail = document.getElementById("adminEmail");

                displayFN.innerText = firstName;
                displayLN.innerText = lastName;
                displayEmail.innerText = email;
                loginAdminForChanges(email, password);

            } else {
                window.alert("doc dont exists");
            }
        })
        .catch((error) => {
            window.alert(error);
        });
}

function changeEmailInDatabase(adminID, newEmail) {
    var adminCollectionRef = database.collection("admins").doc(adminID);
    var usersCollectionRef = database.collection("users").doc(adminID);

    adminCollectionRef.update({
            email: newEmail
        })
        .then(() => {
            usersCollectionRef.update({
                    email: newEmail
                })
                .then(() => {
                    //email is changed in both admins and users collection in the database
                    logoutAdminForChanges();
                    window.alert("Email has been changed");
                    window.location.assign("manage-admin.html");
                })
                .catch((error) => {
                    window.alert(error.message);
                });
        })
        .catch((error) => {
            window.alert(error.message);
        });
}

// FOR UPDATING ADMIN PASSWORD ====================================================

//will display the data of the admin whose email will be changed
function fetchAndDisplayAdminData_updatePassword() {
    var adminID = getAdminIDToUpdatePassword();
    var adminCollectionRef = database.collection("admins").doc(adminID);
    adminCollectionRef.get().then((doc) => {
            if (doc.exists) {
                adminObject = doc.data();
                var firstName = adminObject.firstName;
                var lastName = adminObject.lastName;
                var email = adminObject.email;
                var password = adminObject.password;

                var displayFN = document.getElementById("adminFN");
                var displayLN = document.getElementById("adminLN");
                var displayEmail = document.getElementById("adminEmail");

                displayFN.innerText = firstName;
                displayLN.innerText = lastName;
                displayEmail.innerText = email;
                loginAdminForChanges(email, password);

            } else {
                window.alert("doc dont exists");
            }
        })
        .catch((error) => {
            window.alert(error);
        });
}

// FOR DELETING ADMIN ====================================================

//will display the admin data to be deleted
function fetchAndDisplayAdminData_deleteAdmin() {
    var adminID = getAdminIDToDelete();
    var adminCollectionRef = database.collection("admins").doc(adminID);
    adminCollectionRef.get().then((doc) => {
            if (doc.exists) {
                adminObject = doc.data();
                var firstName = adminObject.firstName;
                var lastName = adminObject.lastName;
                var email = adminObject.email;
                var password = adminObject.password;

                var displayFN = document.getElementById("adminFN");
                var displayLN = document.getElementById("adminLN");
                var displayEmail = document.getElementById("adminEmail");

                displayFN.innerText = firstName;
                displayLN.innerText = lastName;
                displayEmail.innerText = email;

                loginAdminForChanges(email, password);

            } else {
                window.alert("doc dont exists");
            }
        })
        .catch((error) => {
            window.alert(error);
        });
}

function deleteAdminData() {
    //delete document in admins and users collection
    var id = getAdminIDToDelete();
    var usersDocRef = database.collection("users").doc(id);
    var adminDocRef = database.collection("admins").doc(id);
    usersDocRef.delete()
        .then(() => {
            adminDocRef.delete()
                .then(() => {
                    removeAdminIDToDelete();
                    window.alert("Admin account deleted in database.js");
                    window.location.assign("manage-admin.html");
                })
                .catch((error) => {
                    window.alert(error);
                });
        })
        .catch((error) => {
            window.alert(error);
        });
}