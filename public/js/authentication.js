// This is for the authentication of users (signup, login, logout, sending email verifications)

var isLoggingIn = false;
function signUp() {
  //get all input from user
  firstName = document.getElementById('firstNameInput').value;
  lastName = document.getElementById('firstNameInput').value;
  email = document.getElementById('emailInput').value;
  password = document.getElementById('passwordInput').value;

  //check if inputs are empty
  if (validateInput(firstName) == false || validateInput(lastName) == false || validateInput(email) == false || validateInput(password) == false) {
    window.alert("Please fillout everything");
    return;
  }

  //check email if is in correct format
  if (validateEmail(email) == false) {
    window.alert("Email has an incorrect format");
    return;
  }

  //check password if greater than 6 (firebaseauth accepts >= 6 password)
  if (validatePassword(password) == false) {
    window.alert("Password must be greater than 6");
    return;
  }

  //creates user with email and password using the secondaryAppAuth
  secondAppAuth.createUserWithEmailAndPassword(email, password)
    .then(function () {
      var newAdmin = secondAppAuth.currentUser;
      window.alert("New Admin has been created!");
      secondAppAuth.signOut().then(() => {
        window.alert("newly created user signed out");
        window.location.reload();
      });
      saveUserDataToDatabase(newAdmin);

      //sendEmailVerification();
      //reload to refresh list of landlords

    })
    .catch(function (error) {
      var error_code = error.code;
      var error_message = error.message;

      window.alert(error_code);
    });
}


function login() {
  email = document.getElementById('email_field').value;
  password = document.getElementById('password_field').value;

  if (validateInput(email) == false || validateInput(password) == false) {
    window.alert("Please fillout everything");
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      var user = auth.currentUser;

      window.alert("up here");
      isLoggingIn = true;
      var adminDocRef = database.collection("users").doc(user.uid);
      window.alert("middle here");
      adminDocRef.get().then((doc) => {
        window.alert("inside here");
        if (doc.exists) {
          window.alert("Userrole: " + doc.data().userRole);
          var userRole = doc.data().userRole
          if (userRole == 0) {
            //go to super admin
            window.alert("Welcome Super Admin!");
            window.location.assign("home.html");
            setIsSuperAdmin(true);
            loggedSuperAdmin = user;
          } else if (userRole == 1) {
            //go to admin
            window.alert("Welcome Admin!");
            setIsSuperAdmin(false);
            window.location.assign("home.html"); s
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

      window.alert("bottom here");
    })
    .catch(function (error) {
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

auth.onAuthStateChanged(function (user) {
  if (user != null) {
    if (isLoggingIn == false) {
      if (window.location.pathname == "/public/index.html") {
        //window.location.replace("/public/home.html");
        window.history.back();
      }
    } else {
      window.alert("logging in");
    }
  } else {
    if (window.location.pathname != "/public/index.html") {
      window.location.replace("/public/index.html");
    }
  }
});

function setIsSuperAdmin(isSuperAdmin) {
  window.alert("setting Super Admin " + isSuperAdmin);
  sessionStorage.setItem("isSuperAdmin", isSuperAdmin);
}

function getIsSuperAdmin() {
  return sessionStorage.getItem("isSuperAdmin");
}

function removeIsSuperAdmin() {
  sessionStorage.removeItem("isSuperAdmin");
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

