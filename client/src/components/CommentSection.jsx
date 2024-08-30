import { Alert, Button, Textarea, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([])
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
            setCommentError('Comment exceeds the maximum length of 200 characters.');
            return;
        }
        setLoading(true);
        setCommentError(null);
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, content: comment, userId: currentUser._id }),
            });
            const data = await res.json();
            if (res.ok) {
                setComment('');
                setCommentError(null)
                setComments([data, ...comments])
            } else {
                setCommentError(data.message || 'Failed to post comment.');
            }
        } catch (err) {
            setCommentError('An error occurred while posting your comment.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getpostcomments/${postId}`)
                if (res.ok) {
                    const data = await res.json()
                    setComments(data);
                }
            } catch (err) {
                console.log(err.message)
            }
        }
        getComments();
    }, [postId])
    //console.log(comments)
    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in')
                return;
            }
            const res = await fetch(`/api/comment/likecomment/${commentId}`, {
                method: 'PUT'
            })
            // console.log(res.json())
            if (res.ok) {
                const data = await res.json();
                setComments(
                    comments.map((comment) =>
                        comment._id === commentId
                            ? {
                                ...comment,
                                likes: data.likes,
                                numberOfLikes: data.numberOfLikes
                            }
                            : comment
                    )
                );
            } else {
                console.log('Failed to like the comment');
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        <div className="max-w-2xl mx-auto w-full p-3">
            {currentUser ? (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>Signed in as:</p>
                    <img
                        src={currentUser.profilePicture}
                        className="h-5 w-5 object-cover rounded"
                        alt="Profile"
                    />
                    <Link
                        to="/dashboard?tab=profile"
                        className="text-xs text-cyan-600 hover:underline"
                    >
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div className="text-sm text-teal-500 my-5 flex gap-1">
                    You must be signed in to comment
                    <Link
                        to="/sign-in"
                        className="text-blue-500 hover:underline"
                    >
                        Sign In
                    </Link>
                </div>
            )}
            {currentUser && (
                <form
                    className="border border-teal-500 rounded-md p-3"
                    onSubmit={handleSubmit}
                >
                    <Textarea
                        placeholder="Add a comment"
                        rows="3"
                        maxLength="200"
                        onChange={(e) => {
                            setComment(e.target.value);
                            setCommentError(null);
                        }}
                        value={comment}
                        aria-invalid={!!commentError}
                    />
                    <div className="flex justify-between items-center mt-5">
                        <p className="text-gray-500 text-xs">
                            {200 - comment.length} characters remaining
                        </p>
                        <Button
                            outline
                            gradientDuoTone="purpleToBlue"
                            type="submit"
                            disabled={loading || comment.length > 200}
                        >
                            {loading ? <Spinner size="sm" /> : 'Comment'}
                        </Button>
                    </div>
                    {commentError && (
                        <Alert
                            color="failure"
                            className="mt-5"
                            aria-live="assertive"
                        >
                            {commentError}
                        </Alert>
                    )}
                </form>
            )}
            {
                comments.length === 0 ?
                    (
                        <p className="text-sm my-5">No comments yet</p>
                    )
                    :
                    (
                        <>
                            <div className="text-sm my-5 flex items-center gap-1">
                                <p>Comments</p>
                                <div className="border border-gray-400 py-1 px-2 rounded-sm">
                                    <p>{comments.length}</p>

                                </div>
                            </div>
                            {
                                comments.map((comment) => (
                                    <Comment
                                        key={comment._id}
                                        comment={comment}
                                        onLike={handleLike}
                                    />
                                ))
                            }
                        </>
                    )
            }
        </div>
    );
}
