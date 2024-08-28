import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;
        // Validate input
        if (!content || !postId || !userId) {
            return next(errorHandler(400, 'All fields are required.'));
        }

        // Ensure the userId matches the authenticated user
        if (userId !== req.user.id) {
            return next(errorHandler(403, 'You are NOT allowed to create this comment.'));
        }

        // Create and save the new comment
        const newComment = new Comment({
            content,
            postId,
            userId
        });
        await newComment.save();
        return res.status(200).json(newComment);
    } catch (err) {
        next(err);
    }
};