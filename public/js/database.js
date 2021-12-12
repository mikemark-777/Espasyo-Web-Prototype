function isDatabaseNull() {
    if (database != null) {
        window.alert("Database Not Null");
    } else {
        window.alert("Database Null");
    }
}

function saveUserDataToDatabase(newAdmin) {
    var newAdminID = newAdmin.uid;

    window.alert(newAdminID);

    //var adminDocRef = database.collection("admins").doc(newAdminID);
}

// ============= custom javascript objects and converters =====================//

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