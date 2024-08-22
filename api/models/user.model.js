import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://cdn.vectorstock.com/i/500p/01/28/profile-photo-logo-sign-outline-vector-51950128.jpg"
    },
}, { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;