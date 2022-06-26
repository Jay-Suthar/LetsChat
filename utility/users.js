const cur_user = [];

//join user to chat
function user_join(id, username, room) 
{
    const user = { id, username, room };
    cur_user.push(user);

    return user;
}

//the cur user
function the_cur_user(id) 
{
    return cur_user.find(user => user.id === id);
}


//user leaves
function user_leave(id){
    const index = cur_user.findIndex(user=> user.id === id);

    if(index!==-1)
    {
        return cur_user.splice(index,1)[0];
    }
}


//get room users
function get_room_users(room)
{
    return cur_user.filter(user => user.room === room);
}



module.exports = {
    user_join,
    the_cur_user,
    user_leave,
    get_room_users
};