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

function changeroom(useremail, changeTo){
  var roomlistforUser = ['room1', 'room2', 'room3'];
  // changeroom allows the user to change rooms
  var user = useremail;
  if(!user){
    return 4; // If user is not logged in, they should not be allowed to join rooms
  }
  room = changeTo;
  if(room === null){
    return 4; // This signifies that the user canceled out of the alert prompt. End the function.
  }
  //gather_roomlist(room); repopulate the openroomlist but add in the new room
  roomlistforUser.push(room);
  return roomlistforUser; // Should now include the changeTo room
}

function deleteroom(useremail, toDelete){
  var roomlistforUser = ['room1', 'room2', 'room3'];
  // deletes a room
  var user = useremail;
  if(!user){
    return 4;
  }
  room = toDelete;
  if(room === 'publicchat' || !room){

    return 4;
  }
  var new_roomlist = roomlistforUser.filter(rooms => {
    if(rooms !== room){return true;}
    return false;
  });
  return new_roomlist; 
}

/*
  BELOW THIS BLOCK CONTAINS ALL OF THE TESTS FOR CS300IM. NOTE THAT THE FUNCTIONS USED IN THIS TEST FILE ARE SIMILAR NOT BUT EXACT TO THE FUNCTIONS USED BY THE
  ACTUAL PROGRAM. 
*/
// gatherroomlist()
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

// changeroom()
it("Tests changeroom(). The user email and the room name they want to change to are passed in. If user email is not specified, this means they are not logged in and \n  \
 and the function should terminate (return 4). If email is valid and room name is given, this function should add the room to their roomlist. For this test, every user has the roomlist: \
 ['room1', 'room2', 'room3']:", function(){
  var ret = changeroom('user3@gmail.com', 'testroom');
  test.value(ret).is(['room1', 'room2', 'room3', 'testroom']);
});
it("Tests changeroom(). Invalid user should terminate and return 4:", function(){
  var ret = changeroom(null, 'testroom');
  test.value(ret).is(4);
});
it("Tests changeroom(). Likewise, an invalid room name should terminate and return 4:", function(){
  var ret = changeroom('user3@gmail.com', null);
  test.value(ret).is(4);
});
it("Tests deleteroom(). Invalid user should return 4:", function(){
  var ret = deleteroom(null, 'testroom');
  test.value(ret).is(4);
});
it("Tests deleteroom(). Specifying 'publicchat' should return 4:", function(){
  var ret = deleteroom('user3@gmail.com', 'publicchat');
  test.value(ret).is(4);
});
it("Tests deleteroom(). Specifying 'room3' should return ['room1', 'room2']:", function(){
  var ret = deleteroom('user3@gmail.com', 'room3');
  test.value(ret).is(['room1', 'room2']);
});
it("Tests deleteroom(). Specifying a room that doesnt exist should return the unchanged list:", function(){
  var ret = deleteroom('user3@gmail.com', 'room5');
  test.value(ret).is(['room1', 'room2', 'room3']);
});
it("Tests deleteroom(). Invalid room should return 4:", function(){
  var ret = deleteroom('user3@gmail.com', null);
  test.value(ret).is(4);
});