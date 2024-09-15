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

// export const getUserArticles = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         // Fetch the user's preferences
//         const user = await User.findById(userId).populate('preferences'); // Ensure preferences are populated if they are references

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }
//         // console.log(user);
//         // Find articles that match the user's preferences (tags)
//         const articles = await Article.find({ tags: { $in: user.preferences } }).populate('author');
//         // console.log( 'articles are -------', articles);
//         res.status(200).json({
//             success: true,
//             articles, user
//         });
//     } catch (error) {
//         console.error('Error fetching user articles:', error);

//         res.status(500).json({
//             success: false,
//             message: 'Error fetching articles'
//         });
//     }
// };

export const getArticles = async (req, res) => {
    const { userId } = req.params;

    try {
       
        const user = await User.findById(userId).populate('preferences'); // Ensure preferences are populated if they are references

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        let articles;

        if (user.preferences.length < 1) {
            articles = await Article.find({}).populate('author').populate('tags').lean()
        } else {
            
            articles = await Article.find({ tags: { $in: user.preferences } })
                .populate('author') 
                .lean(); // Use lean() to get plain JS objects
        }

        // Add like/dislike count and user-specific flags to each article
        const articlesWithLikeDislikeInfo = articles.map(article => ({
            ...article,
            likesCount: article.likes ? article.likes.length : 0,    // Safeguard: Check if likes exist
            dislikesCount: article.dislikes ? article.dislikes.length : 0, // Safeguard: Check if dislikes exist
            isLikedByUser: article.likes?.includes(userId), // Check if user liked the article
            isDislikedByUser: article.dislikes?.includes(userId) // Check if user disliked the article
        }));

        const sortedArticles = articlesWithLikeDislikeInfo.sort((a,b)=> b.createdAt-a.createdAt)
        console.log(sortedArticles);

        res.status(200).json({
            success: true,
            articles: sortedArticles, // Send the enriched articles array
            user
        });
    } catch (error) {
        console.error('Error fetching user articles:', error);

        res.status(500).json({
            success: false,
            message: 'Error fetching articles'
        });
    }
};

export const getUserArticles = async (req, res) => {
    const userId = req.user
    // console.log(userId);
    try {
        const articles = await Article.find({ author: userId }).lean()
        console.log('articles are', articles);
        const articlesWithLikeDislikeInfo = articles.map(article => ({
            ...article,
            likesCount: article.likes ? article.likes.length : 0,    // Safeguard: Check if likes exist
            dislikesCount: article.dislikes ? article.dislikes.length : 0, // Safeguard: Check if dislikes exist
        }));
        res.status(200).json({ success: true, articles: articlesWithLikeDislikeInfo })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Error fetching articles' })
    }
}


export const likeArticle = async (req, res) => {
    const { articleId } = req.params;
    const userId = req.body.userId;

    console.log('user id is ', userId);

    try {
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        // Check if user has already liked the article
        const hasLiked = article.likes.includes(userId);
        const hasDisliked = article.dislikes.includes(userId);

        if (hasLiked) {
            // If already liked, remove the like
            article.likes = article.likes.filter((id) => id.toString() !== userId.toString());
        } else {
            // Otherwise, add the like
            article.likes.push(userId);
            // Remove dislike if user had disliked the article
            if (hasDisliked) {
                article.dislikes = article.dislikes.filter((id) => id.toString() !== userId.toString());
            }
        }

        await article.save();

        res.status(200).json({ success: true, article });
    } catch (error) {
        console.error('Error liking article:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Handle Dislike
export const dislikeArticle = async (req, res) => {
    const { articleId } = req.params;
    const userId = req.body.userId; // Assuming you are using middleware to get user info

    try {
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        // Check if user has already disliked the article
        const hasDisliked = article.dislikes.includes(userId);
        const hasLiked = article.likes.includes(userId);

        if (hasDisliked) {
            // If already disliked, remove the dislike
            article.dislikes = article.dislikes.filter((id) => id.toString() !== userId.toString());
        } else {
            // Otherwise, add the dislike
            article.dislikes.push(userId);
            // Remove like if user had liked the article
            if (hasLiked) {
                article.likes = article.likes.filter((id) => id.toString() !== userId.toString());
            }
        }

        await article.save();

        res.status(200).json({ success: true, article });
    } catch (error) {
        console.error('Error disliking article:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};