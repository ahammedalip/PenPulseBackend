import Admin from "../../model/admin.js"
import jwt from 'jsonwebtoken'
import Category from "../../model/articleCategory.js"

export const login = async (req, res) => {
    console.log('coming hree')
    const { username, password } = req.body

    try {
        const isAdmin = await Admin.findOne({ username })
        console.log(`is admin ${isAdmin}`)
        if (!isAdmin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        if (isAdmin && isAdmin.password != password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: isAdmin._id.toString(), role: 'Admin', username: isAdmin.username }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        res.status(200).json({ success: true, message: 'Admin logged in successfully', token: token });
    } catch (error) {
        console.log(`Error at admin login ${error}`)
    }



}


export const preferences = async (req, res) => {
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    const categoryName = category.trim().toLowerCase(); // Convert to lowercase and trim whitespace

    try {
        // Check if the category already exists
        const existingCategory = await Category.findOne({ name: categoryName });

        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        // Create and save the new category
        const newCategory = new Category({
            name: categoryName,
        });

        await newCategory.save();

        return res.status(201).json({ success: true, message: 'Category added successfully', category: newCategory });
    } catch (error) {
        console.error('Error handling category:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getPreference = async (req, res) => {
    try {
        const categories = await Category.find({});
        console.log(categories)
        res.status(200).json({ success: true, categories: categories });
    } catch (error) {
        console.error('Error fetching categories:', error);

        // Send error response in case of failure
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

export const editPreference = async (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        // Check if the new name is already in use
        const existingCategory = await Category.findOne({ name: name.trim().toLowerCase() });
        if (existingCategory && existingCategory._id.toString() !== categoryId) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        }

        // Update the category
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name: name.trim().toLowerCase() },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ success: true, message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Server error' });
    }
}