// This is for the authentication of users (signup, login, logout, sending email verifications)

var isLoggingIn = false;

function signUp() {
    //get all input from user

    firstNameTextbox = document.getElementById('firstNameInput');
    lastNameTextbox = document.getElementById('lastNameInput');
    emailTextbox = document.getElementById('emailInput');
    passwordTextbox = document.getElementById('passwordInput');

    var firstName = firstNameTextbox.value;
    var lastName = lastNameTextbox.value;
    var email = emailTextbox.value;
    var password = passwordTextbox.value;

    firstNameTextbox.style.border = '1px solid #777';
    lastNameTextbox.style.border = '1px solid #777';
    emailTextbox.style.border = '1px solid #777';
    passwordTextbox.style.border = '1px solid #777';

    //check if inputs are empty
    if (validateInput(firstName) == false || validateInput(lastName) == false || validateInput(email) == false || validateInput(password) == false) {
        firstNameTextbox.style.border = '1px solid rgb(235, 72, 72)';
        lastNameTextbox.style.border = '1px solid rgb(235, 72, 72)';
        emailTextbox.style.border = '1px solid rgb(235, 72, 72)';
        passwordTextbox.style.border = '1px solid rgb(235, 72, 72)';
        window.alert("Please fillout everything");
        return;
    }

    //check email if is in correct format
    if (validateEmail(email) == false) {
        emailTextbox.style.border = '1px solid rgb(235, 72, 72)';
        window.alert("Email has an incorrect format");
        return;
    }

    //check password if greater than 6 (firebaseauth accepts >= 6 password)
    if (validatePassword(password) == false) {
        passwordTextbox.focus();
        passwordTextbox.style.border = '1px solid rgb(235, 72, 72)';
        window.alert("Password must be greater than 6");
        return;
    }

    //will check first if the email provided already exists
    secondAppAuth.fetchSignInMethodsForEmail(email)
        .then(function(signInMethods) {
            if (signInMethods.length < 1) {
                confirm
                //if email is existing
                var isEmailConfirmed = confirmEmail(email);
                if (isEmailConfirmed === true) {
                    //creates user with email and password using the secondaryAppAuth
                    secondAppAuth.createUserWithEmailAndPassword(email, password)
                        .then(function() {
                            var newAdmin = secondAppAuth.currentUser;
                            var newAdminID = newAdmin.uid;

                            //create a new admin object and will save the user to the firestore database
                            const adminObj = new Admin(newAdminID, firstName, lastName, email, password, 1);
                            saveUserDataToDatabase(adminObj);

                            //this will send an email verification to the email of the admin and then logout it here
                            secondAppAuth.currentUser.sendEmailVerification()
                                .then(() => {
                                    secondAppAuth.signOut().then(() => {
                                            window.alert("An email verification has been sent to " + email + ". Please check your email and click the link provided to complete setting up the admin account.\n\nThank you!");
                                            //for reload of admin list
                                            window.location.reload();
                                        })
                                        .catch(error => {
                                            var error_code = error.code;
                                            var error_message = error.message;

                                            window.alert(error_code);
                                        });
                                })
                                .catch(error => {
                                    var error_code = error.code;
                                    var error_message = error.message;

                                    window.alert(error_code);
                                });


                        })
                        .catch(function(error) {
                            var error_code = error.code;
                            var error_message = error.message;

                            if (error_code == "auth/email-already-in-use") {
                                window.alert("Email already exists");
                            }
                        });
                } else {
                    // focus on email textbox
                    emailTextbox.focus();
                    emailTextbox.style.border = '1px solid rgb(235, 72, 72)';
                    window.alert("email has been denied");
                }
            } else {
                // focus on email textbox
                emailTextbox.focus();
                emailTextbox.style.border = '1px solid rgb(235, 72, 72)';
                window.alert("Email already exists");
            }
        })
        .catch(function(error) {
            var error_code = error.code;
            var error_message = error.message;

            if (error_code == "auth/email-already-in-use") {
                window.alert("Email already exists");
            }
        });


}


function login() {
    email = document.getElementById('email_field').value;
    password = document.getElementById('password_field').value;

    if (validateInput(email) == false || validateInput(password) == false) {
        window.alert("Please fillout everything");
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(function() {
            var user = auth.currentUser;
            window.alert("UserID: " + user.emailVerified);
            isLoggingIn = true;
            var adminDocRef = database.collection("users").doc(user.uid);
            adminDocRef.get().then((doc) => {
                if (doc.exists) {
                    var userRole = doc.data().userRole
                    if (userRole == 0) {
                        //go to super admin
                        window.alert("Welcome Super Admin!");
                        window.location.assign("home.html");
                        setIsSuperAdmin(true);
                        loggedSuperAdmin = user;
                    } else if (userRole == 1) {
                        //go to admin
                        if (user.emailVerified === true) {
                            window.alert("Welcome Admin!");
                            setIsSuperAdmin(false);
                            window.location.assign("home.html");
                        } else {
                            window.alert("Your email is not yet verified. We have sent an email verification to " + email + " Please check your email and click the link provided to complete setting up your account\n\nThank you");
                            logout();
                        }

                    } else {
                        //invalid access to other users with other codes
                        window.alert("There is no admin with such credentials");
                    }

                } else {
                    window.alert("No such document!");
                    //console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
            s
        })
        .catch(function(error) {
            var error_code = error.code;
            var error_message = error.message;

            if (error_code == "auth/invalid-email") {
                window.alert("Invalid Email");
            } else if (error_code == "auth/wrong-password") {
                window.alert("Incorrect Password");
            } else if (error_code == "auth/user-not-found") {
                window.alert("There is no user with such credentials");
            }

        });
}

function logout() {
    auth.signOut().then(() => {
        setIsSuperAdmin(false);
        removeIsSuperAdmin();
        window.location.replace("index.html");
    });
}

function sendEmailVerification() {
    // code for send email verification to newly created email of landlord
    auth.currentUser.sendEmailVerification()
        .then(() => {
            window.alert("Verification has been sent to email: " + user.email);
        })
        .catch(error => {

        });
}

function confirmEmail(email) {
    var answer = window.confirm("We will send an email verification to the email you have provided. Make sure that the email is existing.\n\nAre you sure you will use the email " + email + " for this new admin account?");
    return answer;
}

function validateEmail(email) {
    var validRegex = /^[^@]+@\w+(\.\w+)+\w$/;
    if (validRegex.test(email)) {
        return true;
    } else {
        return false;
    }
}

function validatePassword(password) {
    if (password.length < 6) {
        return false;
    } else {
        return true;
    }
}

function validateInput(input) {
    if (input == null) {
        return false;
    }

    if (input.length <= 0) {
        return false;
    } else {
        return true;
    }
}

auth.onAuthStateChanged(function(user) {
    if (user != null) {
        if (isLoggingIn == false) {
            if (window.location.pathname == "/public/index.html") {
                //window.location.replace("/public/home.html");
                if (user != null) {
                    window.location.replace("/public/home.html");
                } else {
                    window.history.back();
                }

            }
            // if (window.location.pathname == "/index.html") {
            //     window.history.back();
            // }
        } else {
            window.alert("logging in");
        }
    } else {
        // if (window.location.pathname != "/index.html") {
        //     window.location.replace("/index.html");
        // }
        if (window.location.pathname != "/public/index.html") {
            window.location.replace("/public/index.html");
        }
    }
});

function setIsSuperAdmin(isSuperAdmin) {
    window.alert("setting Super Admin " + isSuperAdmin);
    localStorage.setItem("isSuperAdmin", isSuperAdmin);
}

function getIsSuperAdmin() {
    return localStorage.getItem("isSuperAdmin");
}

function removeIsSuperAdmin() {
    localStorage.removeItem("isSuperAdmin");
}



//for testing==================


function isUserLoggedIn() {
    var user = auth.currentUser;
    if (user != null) {
        window.alert("user is not null :" + user.uid);
    } else {
        window.alert("user is null");
    }
}

function whoIsUser() {
    var user = auth.currentUser;
    if (user == null) {
        window.alert("user is: null " + loggedSuperAdmin);
    } else {
        window.alert("user is: " + user.uid);
    }
}

function isAuth1EqualsAuth2() {
    if (auth == secondAppAuth) {
        window.alert("same auth");
    } else {
        window.alert("not same auth");
    }
}