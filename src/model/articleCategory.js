import mongoose from 'mongoose';


const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  
    trim: true,
    minlength: 3,  
  },
  listed:{
    type: Boolean,
    default: true
  }

});

// Create the model for the Category schema
const Category = mongoose.model('Category', categorySchema);

export default Category;
