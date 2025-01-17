import mongoose,{Schema,Document} from "mongoose";

export interface IUser extends Document{
    nombres:string;
    apellidos:string;
    documento:string;
    email:string;
    tipo:string;
    password:string;
    creadoAct: Date;

}

const UserSchema:Schema = new Schema({
    nombres:{
        type:String,
        required:true
    }
    ,apellidos:{
        type:String,
        required:true,

    }
    ,documento:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    tipo:{
        type:String,
        enum:['Administrador','Usuario'],
        default:'Usuario'
    },
    password:{
        type:String,
        required:true
    },
    creadoAct:{
        type:Date,
        default:Date.now()
    }
});

const User = mongoose.model<IUser>("User",UserSchema);
export default User;