
module.exports = function (io){
   var allUsers =[];
    var allClient = [];
    io.sockets.on("connection", socket=>{
        console.log("have a new user connected");
        //listen user
        socket.on("adduser",fullname=>{
            // save
            allUsers.push(fullname);
            allClient.push(socket);
            socket.fullname = fullname;
            // notify to this user
            var data = {
                sender:"SERVER",
                message:"You have join chat room",
                time: getTime(),
            };
            socket.emit("update_noti",data);
            socket.emit("update_list_user",allUsers);
            // notyfy to another user
            var data = {
                sender:"SERVER",
                message: fullname + " have join chat room",
                time: getTime(),
            };
            socket.broadcast.emit("update_noti",data);
            socket.broadcast.emit("update_list_user",allUsers);
        })
        // disconect
        socket.on('disconnect', function() {
            var data = {
                sender:"SERVER",
                message: socket.fullname + " have left chat room",
                time: getTime(),
            };
            socket.broadcast.emit("update_noti",data);
            //
            var i = allClient.indexOf(socket);
            allClient.splice(i, 1);
            allUsers.splice(allUsers.indexOf(socket.fullname),1);
            socket.broadcast.emit("update_list_user",allUsers);
         });
         // user send chat
        socket.on("client_send_mess_to_server",message=>{
            // noti another
            var data = {
                sender: socket.fullname,
                content: message,
                time: getTime()
            }
            socket.broadcast.emit("update_log_chat_from_people",data);
            socket.emit("update_log_chat_from_yourself",data);
        })
        
    });
    
}
function getTime(){
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    return time;
}