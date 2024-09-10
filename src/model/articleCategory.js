import mongoose from 'mongoose';

// Define the schema for a Category
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // Ensure category names are unique
    trim: true,
    minlength: 3,  // Adjust the minimum length as needed
  },
  list:{
    type: Boolean,
    default: true
  }

});

// Create the model for the Category schema
const Category = mongoose.model('Category', categorySchema);

export default Category;
