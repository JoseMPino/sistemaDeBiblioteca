import mongoose, { Schema, Document,Types } from "mongoose";

const generarISBN = (): string => {
    const preFijo = "978-";
    const numeroRandom = Math.floor(1000000000 + Math.random() * 9000000000);
    return `${preFijo}${numeroRandom}`;
};

export interface ILibro extends Document {
    img: string;
    titulo: string;
    autor: string;
    editorial: string;
    categoria: string;
    isbn?: string;
    estado: boolean;
    creadoAct: Date;
}

const LibroSchema: Schema = new Schema({
    img: {
        type: String,
        required: true,
    },
    titulo: {
        type: String,
        required: true,
    },
    autor: {
        type: String,
        required: true,
    },
    editorial: {
        type: String,
        required: true,
    },
    categoria: {
        type: String,
        enum: [
            'Terror', 'Ciencia Ficcion', 'Romance', 'Aventura', 'Fantasia',
            'Historia', 'Biografia', 'Cuento', 'Poesia', 'Drama', 
            'Comedia', 'Infantil', 'Juvenil', 'Adulto'
        ],
        required: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            return generarISBN();
        },
    },
    estado: {
        type: Boolean,
        default: true,
    },
    creadoAct: {
        type: Date,
        default: Date.now,
    },
});

LibroSchema.pre<ILibro>("save", async function (next) {
    if (!this.isbn) {
        let nuevoISBN;
        let existe;
        do {
            nuevoISBN = generarISBN();
            existe = await mongoose.models.Libro.findOne({ isbn: nuevoISBN });
        } while (existe);

        this.isbn = nuevoISBN;
    }
    next();
});

export default mongoose.model<ILibro>("Libro", LibroSchema);
