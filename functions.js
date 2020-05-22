function signout(){
  firebase.auth().signOut();
}

function sendMessage(){
  // Before sending a message, ensure that the user is signed in
  var user = firebase.auth().currentUser;
  if(user){
    username = user.email;
  }
  else{
    alert("Not signed in. Sign in to continue");
    return false;
  }

  // Send the 'user-message' field to the chat collection
  var message = document.getElementById("user-message").value;
  firebase.database().ref("chat").push({
      "sender": username,
      "message": message
  });
  document.getElementById("user-message").value = '';
  return false;
}

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      user = firebase.auth().currentUser;
      return false;
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

firebase.database().ref("chat").on("child_added", (snapshot) => {
  if(snapshot){
    let chat = "";
    chat += "<li>";
    chat += snapshot.val().sender + ": " + snapshot.val().message;
    chat += "</li>";

    document.getElementById("chatoutput").innerHTML += chat;
    var box = document.getElementById('chatoutput');
    box.scrollTop = box.scrollHeight;
  }
});

