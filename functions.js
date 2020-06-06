var room = 'publicchat'; // room is the current room the user is in
var uniquerooms;

function signout(){
  // this function literally just signs out
  firebase.auth().signOut();
}

function gather_roomlist(newroom = undefined){
// will populate the list elements with rooms that the user is a part of
  var user = firebase.auth().currentUser;
  if(!user){
    alert("Not signed in. Sign in to continue");
    return false;
  }
  document.getElementById("roomsopen").innerHTML = '';
  var roomlist = new Set();
  const location = firebase.database().ref();
  location.once("value", (snapshot) => {
    snapshot.forEach( collection => {
      collection.forEach( chatloghash => {
        chatloghash.forEach( chat => {
          if(chat.key == "sender" && chat.node_.value_ === user.email){
            // Add to set otherwise we'll get duplicates
            roomlist.add(collection.key);
          }
        });
      });      
    });
    if(newroom !== undefined){
      roomlist.add(newroom);
    }
    uniquerooms = Array.from(roomlist);
    uniquerooms.forEach( room => {
      var ul = document.getElementById("roomsopen");
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(room));
      ul.appendChild(li);
    });
  });
}

function changeroom(){
  // changeroom allows the user to change rooms
  var user = firebase.auth().currentUser;
  if(!user){
    alert("Not signed in. Sign in to continue");
    return false;
  }
  room = prompt("Enter new room name");
  if(room === null){
    return 4444;
  }
  gather_roomlist(room);
  document.getElementById("chatoutput").innerHTML = '';
  document.getElementById("roomname").innerHTML = room;
  
  // when we change rooms successfully, update the chat box to show all msgs-- this is
  // the chat log
  firebase.database().ref(room).on("child_added", (snapshot) => {
    if(snapshot){
      var chat = "";
      chat += "<li>";
      chat += snapshot.val().sender + ": " + snapshot.val().message;
      chat += "</li>";
  
      document.getElementById("chatoutput").innerHTML += chat;
      var box = document.getElementById('chatoutput');
      box.scrollTop = box.scrollHeight;
    }
  });  
}

function sendMessage(){
  // sendMessage sends a message and populates the chat box for all users  
  // in the room to see.
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
  firebase.database().ref(room).push({
      "sender": username,
      "message": message
  });
  document.getElementById("user-message").value = '';
  return false;
}

var uiConfig = {
  // This variable handles sign in
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      gather_roomlist(); // we populate the roomlist once the user is signed in
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

function deleteroom(){
  // deletes a room
  var user = firebase.auth().currentUser;
  if(!user){
    alert("Not signed in. Sign in to continue");
    return false;
  }
  room = prompt("Enter room name to delete. This will delete all chat logs for the room!");
  if(room === 'publicchat'){
    alert("Invalid name");
    return;
  }
  var del = 0;
  uniquerooms.forEach(i => {
    if(i === room){
      firebase.database().ref(room).remove();
      alert(`${room} deleted`);
      gather_roomlist();
      del = 1;
      return;
    }
  });
  if(del === 0){
    alert(`${room} not found.`);
  }
  
}

//Below is what controls how messages are displayed
firebase.database().ref(room).on("child_added", (snapshot) => {
  document.getElementById("roomname").innerHTML = room;
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