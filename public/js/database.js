function isDatabaseNull() {
    if (database != null) {
        window.alert("Database Not Null");
    } else {
        window.alert("Database Null");
    }
}

//for saving data of newly created admin to firestore
function saveUserDataToDatabase(newAdmin) {

    // if (newAdmin === null) {
    //     window.alert("newAdmin null");
    // } else {
    //     window.alert(newAdmin.adminID);
    //     window.alert(newAdmin.firstName);
    //     window.alert(newAdmin.lastName);
    //     window.alert(newAdmin.email);
    //     window.alert(newAdmin.password);
    //     window.alert(newAdmin.userRole);
    // }

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
        .then(function () {
            adminDocRef.withConverter(adminConverter)
                .set(newAdmin)
                .then(function () {
                    window.alert("New Admin has been created!");
                    window.location.reload();
                })
                .catch(function (error) {
                    var error_code = error.code;
                    var error_message = error.message;
        
                    window.alert(error_code);
                });
        })
        .catch(function (error) {
            var error_code = error.code;
            var error_message = error.message;

            window.alert(error_code);
        });

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
    toFirestore: function (user) {
        return {
            userID: user.userID,
            email: user.email,
            password: user.password,
            userRole: user.userRole
        };
    },
    fromFirestore: function (snapshot, options) {
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
    toFirestore: function (admin) {
        return {
            adminID: admin.adminID,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            password: admin.password,
            userRole: admin.userRole
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new Admin(data.adminID, data.firstName, data.lastName, data.email, data.pasword, data.userRole);
    }
}