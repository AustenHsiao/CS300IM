const test = require("unit.js");

function gather_roomlist(useremail){
  // will populate the list elements with rooms that the user is a part of
  // In order to make testing easy, I've created an array that mimicks the database hierarchy
  // Another change to this function is that the parameter, useremail mimicks user's email credential.
  var msg1a = {message: "test", sender: "user1@gmail.com"}
  var msg2a = {message: "test1", sender: "user2@gmail.com"}
  var msg3a = {message: "test2", sender: "user3@gmail.com"}
  var msg1b= {message: "test1", sender: "user1@gmail.com"}
  var chatapp_db = [[[msg1a], [msg2a], [msg3a]], [[msg1b]]];
  
  
  var roomlist = new Set();
  //const location = firebase.database().ref();
  //location.once("value", (snapshot) => {
    chatapp_db.forEach( collection => {
      collection.forEach( msg => {
        msg.forEach( chat => {
          if(chat.sender === useremail){
            // Add to set otherwise we'll get duplicates
            roomlist.add(collection);
          }
        });
      });      
    });
    var uniquerooms = Array.from(roomlist);
    return uniquerooms;
}

function changeroom(roomname, list_of_rooms){
  var room = roomname;
  list_of_rooms.forEach(_room =>{
    if(_room === roomname){
      return -1;
    }});
  return room;
}

/*
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
  firebase.assertSucceeds(app.database().ref(room).once("value"));
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
    room = prompt("Enter room name to delete. This will delete all chat logs for the room!");
  }
  firebase.database().ref(room).on("value", (snapshot) => {
    if(!snapshot.exists()){
      firebase.database().ref(room).remove();
      alert(`${room} deleted`);
      return;
    }
    alert(`${room} not found`);
});
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
});*/
//console.log(gather_roomlist());

it("generates list of the rooms user belongs to. No input: should return empty list.\n\tThe stand-in for the database is a hardcoded list because\n\tI couldnt configure the local firebase db.", function(){
  var ret = gather_roomlist();
  test.value(ret).is([]);
});
it("Tests gather_roomlist('user5@gmail.com'). User5@gmail.com has no chat logs and should return empty list.", function(){
  var ret = gather_roomlist('user5@gmail.com');
  test.value(ret).is([]);
});
it("Tests gather_roomlist('user1@gmail.com'). Both collections should be returned.", function(){
  var ret = gather_roomlist('user1@gmail.com');
  test.value(ret).is([[[{message: "test", sender: "user1@gmail.com"}], [{message: "test1", sender: "user2@gmail.com"}], [{message: "test2", sender: "user3@gmail.com"}]], [[{message: "test1", sender: "user1@gmail.com"}]]]);
});
it("Tests gather_roomlist('user2@gmail.com'). First collection should be returned.", function(){
  var ret = gather_roomlist('user2@gmail.com');
  test.value(ret).is([[[{"message":"test","sender":"user1@gmail.com"}],[{"message":"test1","sender":"user2@gmail.com"}],[{"message":"test2","sender":"user3@gmail.com"}]]] );
});
it("Tests gather_roomlist('user3@gmail.com'). First collection should be returned.", function(){
  var ret = gather_roomlist('user3@gmail.com');
  test.value(ret).is([[[{"message":"test","sender":"user1@gmail.com"}],[{"message":"test1","sender":"user2@gmail.com"}],[{"message":"test2","sender":"user3@gmail.com"}]]] );
});