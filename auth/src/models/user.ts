import mongoose from "mongoose";
import { Password } from "../services/password";

//interface that describes the properties to create a new user 

interface UserAttrs{
          email: string;
          password: string;
}

// An interface that describes the properties a userModel has (a collection)
interface UserModel extends mongoose.Model<UserDoc>{
build(attrs:UserAttrs):UserDoc;
}


// An interface that describes what properties a single user has

interface UserDoc extends mongoose.Document{
          email: string;
          password: string;
          updatedAt: string;
          createdAt: string;
}
const userSchema = new mongoose.Schema({
          email:{
                    type: String,
                    required: true
          },
          password: {
                    type: String,
                    required: true
          }

},{
          toJSON:{
                transform(doc,ret){
                    ret.id = ret._id;  
                    delete ret._id; 
                    delete ret.password; 
                    delete ret.__v;
                }    
          }
}
)

userSchema.pre('save',async function (done){
          if(this.isModified('password'))
          {
                    const hashed = await Password.ToHash(this.get('password'))
                    this.set('password',hashed)
          }
          done()
})
userSchema.statics.build = (attrs:UserAttrs)=>{
          return new User(attrs)
}

const User = mongoose.model<UserDoc,UserModel>('User',userSchema)



export {User}