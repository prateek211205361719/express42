class Users{
    constructor(){
        this.users = [];
    }
    addUser(id, name, room){
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeuser(id){
        var user = this.getUser(id);
        if(user){
           this.users = this.users.filter((user1) => {
                 return user1.id !== id;
            });
        }
        return user[0];
    }
    getUser(id){
        var user = this.users.filter((user) => {
            return user.id === id;
        });
        return user
        
    }
    getUserList(room){
        var users = this.users.filter((user) => {
             return user.room === room;
        });

        var nameMap = users.map((user) => {
            return user.name;
        });
        return nameMap;
    }
}

module.exports = { Users }