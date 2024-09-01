import express from "express";
import { createComment, deleteComment, editComment, getcomments, getPostComment, likeComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken, createComment)
router.get('/getpostcomments/:postId', getPostComment)
router.put('/likecomment/:commentId', verifyToken, likeComment)
router.put('/editcomment/:commentId', verifyToken, editComment)
router.delete('/deletecomment/:commentId', verifyToken, deleteComment)
router.get('/getcomments', verifyToken, getcomments);

export default router