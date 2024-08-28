import { Alert, Button, Textarea, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [loading, setLoading] = useState(false);

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
            } else {
                setCommentError(data.message || 'Failed to post comment.');
            }
        } catch (err) {
            setCommentError('An error occurred while posting your comment.');
        } finally {
            setLoading(false);
        }
    };

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
        </div>
    );
}
