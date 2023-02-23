const argon2=require('argon2')
class UserService {
    constructor(client) {
        this.User = client.db().collection("users")
    }
     async extractConactData(payload) {
        const hand= await argon2.hash(payload.password)
        const user = { 
            username: payload.username, 
            password: hand, 
           } 
           Object.keys(user).forEach( 
               (key) => user[key] === undefined && delete user[key] 
           )
           return user;
           
       } 
       async register(payload){
        const user= await this.extractConactData(payload)
        const result= await this.User.insertOne(
            user,
        )
       return result.value
       
       }
       async finduser(username){
            return await this.User.findOne({username:username})
          
       }
       async findpass(username,password){
           const user=await  this.finduser(username)
           if(user){
            return await argon2.verify(user.password,password)
           }
       }
}
module.exports=UserService