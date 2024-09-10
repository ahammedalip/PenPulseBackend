import Category from "../../model/articleCategory.js"
import Article from "../../model/articles.js"
import User from "../../model/user.js"


export const getPreference = async (req, res) => {
    try {
        const preference = await Category.find({ listed: true })
        if (preference) {
            console.log(preference)
            return res.status(200).json({ success: true, preference })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Erorr getting preferences' })
    }
}

export const createArticles = async (req, res) => {

    const { author, title, description, imageUrl, preferences } = req.body
    try {
        // Create a new article instance
        const newArticle = new Article({
            author,
            title,
            description,
            tags: preferences,
            imageUrl
        });

        await newArticle.save();

        res.status(201).json({
            success: true,
            message: 'Article created successfully',
            article: newArticle
        });
    } catch (error) {
        console.error('Error creating article:', error);

        // Send error response
        res.status(500).json({
            success: false,
            message: 'Error creating article'
        });
    }
}

export const getUserArticles = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch the user's preferences
        const user = await User.findById(userId).populate('preferences'); // Ensure preferences are populated if they are references

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        console.log(user);
        // Find articles that match the user's preferences (tags)
        const articles = await Article.find({ tags: { $in: user.preferences } }).populate('author');
        console.log( 'articles are -------', articles);
        res.status(200).json({
            success: true,
            articles, user
        });
    } catch (error) {
        console.error('Error fetching user articles:', error);

        res.status(500).json({
            success: false,
            message: 'Error fetching articles'
        });
    }
};