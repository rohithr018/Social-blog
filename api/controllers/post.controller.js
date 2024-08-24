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
