import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    // Check if the user is an admin
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'));
    }

    // Check if required fields are present
    const { title, content, category = 'uncategorized', image } = req.body;
    if (!title || !content) {
        return next(errorHandler(400, 'Please provide all required fields'));
    }

    // Generate slug from title
    const slug = title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '-')
        .replace(/^-+|-+$/g, '');

    // Create new Post object
    const newPost = new Post({
        title,
        content,
        category,
        image: image || "https://shorturl.at/pIBST",
        slug,
        userId: req.user.id
    });

    try {
        // Save the post to the database
        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);
    } catch (err) {
        // Handle duplicate key error (code 11000)
        if (err.code === 11000) {
            if (err.keyPattern?.title) {
                return next(errorHandler(409, 'Duplicate Post Title'));
            } else if (err.keyPattern?.slug) {
                return next(errorHandler(409, 'Duplicate Slug'));
            }
        }
        next(err);
    }
};

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { category: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ]
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit)

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        return res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });

    } catch (err) {
        next(err);
    }
}

export const deletepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this post'));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('The post has been deleted');
    } catch (error) {
        next(error);
    }
};