import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the category schema
        required: true,
    }],
    imageUrl: {
        type: String,
        required: true,
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    private:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);

export default Article;
