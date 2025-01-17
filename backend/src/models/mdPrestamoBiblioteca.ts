import mongoose,{Schema,Document,Types} from "mongoose";


interface IPrestamoBiblioteca extends Document{
    libro:Types.ObjectId;
    usuario:Types.ObjectId;
    fechaPrestamo:Date;
    fechaEntrega?:Date;
    estado:boolean;
    creadoAct: Date;
}

const PrestamoBibliotecaSchema:Schema = new Schema({
    libro:{
        type:Schema.Types.ObjectId,
        ref:"Libro",
        required:true
    }
    ,usuario:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true

    }
    ,fechaPrestamo:{
        type:Date,
        required:true
    },
    fechaEntrega:{
        type:Date,
        required:false
    },
    estado:{
        type:Boolean,
        default:true
    },
    creadoAct:{
        type:Date,
        default:Date.now()
    }
    
});

export default mongoose.model<IPrestamoBiblioteca>("PrestamoBiblioteca",PrestamoBibliotecaSchema);