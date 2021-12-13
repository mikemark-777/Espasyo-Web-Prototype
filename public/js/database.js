function isDatabaseNull() {
    if (database != null) {
        window.alert("Database Not Null");
    } else {
        window.alert("Database Null");
    }
}

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

function renderAdminToTable(firstName, lastName, email) {

    let trow = document.createElement("tr");
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let editButton = document.createElement("button");


    td1.innerHTML = firstName;
    td2.innerHTML = lastName;
    td3.innerHTML = email;
    editButton.innerHTML = "Edit";

    editButton.onclick = function() {
        window.alert(email);
    }


    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(editButton);
    tbody.append(trow);

}

function renderAllAdminsToTable(admins) {
    tbody.innerHTML = "";
    admins.forEach(admin => {
        renderAdminToTable(admin.firstName, admin.lastName, admin.email);
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
        return new Admin(data.adminID, data.firstName, data.lastName, data.email, data.pasword, data.userRole);
    }
}