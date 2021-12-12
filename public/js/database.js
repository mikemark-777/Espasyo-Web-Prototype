function isDatabaseNull() {
    if (database != null) {
        window.alert("Database Not Null");
    } else {
        window.alert("Database Null");
    }
}

//for saving data of newly created admin to firestore
function saveUserDataToDatabase(newAdmin) {

    // const admin = new Admin();
    // admin = newAdmin;

    if (newAdmin === null) {
        window.alert("newAdmin null");
    } else {
        window.alert("newAdmin not null "  + newAdmin.adminID);
    }

    // var userID = newAdmin.adminID;
    // var email = newAdmin.email;
    // var password = newAdmin.password;
    // var userRole = newAdmin.userRole;

    //create a user object
    //var newUser = new User(userID, email, password, userRole);

    // window.alert("userrole: " + admin.userRole);

    //var adminDocRef = database.collection("admins").doc(newAdminID);
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
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            userRole: user.userRole
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new User(data.userID, data.firstName, data.lastName, data.email, data.pasword, data.userRole);
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

// const Admin = {
//     adminID: 'abcd-1234', 
//     firstName: 'Juan',
//     lastName: 'Dela Cruz',
//     email: 'juan@gmail.com',
//     password: '123456',
//     userRole: 0
//   };

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