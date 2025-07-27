const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: [true, "Tweet content is required."],
            trim: true,
            maxLength: [280, "The tweet can't be longer than 280 characters."],
            validate: {
                validator: (c) => c.trim().length > 0,
                message: "The tweet can't be empty.",
            },
        },
        author: {
            type: ObjectId,
            ref: "User",
            required: [true, "Author is required."],
        },
        media: [
            {
                url: { type: String, required: true },
                mediaType: {
                    type: String,
                    required: true,
                    enum: ["image", "gif"],
                    message: "Invalid media type.",
                },
                width: { type: Number, required: true }, // corrected
                height: { type: Number, required: true } // corrected
            },
        ],
        mentions: {
            type: [String],
            default: [],
            set: (mentions) => mentions.map((m) => m.toLowerCase().replace("@", "")),
        },
        hashtags: {
            type: [String],
            default: [],
            set: (hashtags) => hashtags.map((h) => h.toLowerCase().replace("#", "")),
        },
        replyTo: {
            type: ObjectId,
            ref: "Tweet",
            default: null,
        },
        quoteTo: {
            type: ObjectId,
            ref: "Tweet",
            default: null,
        },
        repliesCount: {
            type: Number,
            default: 0,
        },
        likes: {
            type: [ObjectId],
            ref: "User",
            default: [],
        },
        retweets: {
            type: [ObjectId],
            ref: "User",
            default: [],
        },
    },
    { timestamps: true }
);

tweetSchema.methods.updateRepliesCount = async function () {
    this.repliesCount = await mongoose.model("Tweet").countDocuments({
        replyTo: this._id,
    });
    await this.save(); // corrected
};

tweetSchema.methods.addRetweet = function (userId) {
    const isRetweeted = this.retweets.some((id) => id.equals(userId)); // corrected
    if (!isRetweeted) {
        this.retweets.push(userId);
        return this.save();
    }
    return Promise.resolve(this);
};

tweetSchema.methods.deleteRetweet = function (userId) {
    const isRetweeted = this.retweets.some((id) => id.equals(userId));
    if (isRetweeted) {
        this.retweets.pull(userId); // corrected
        return this.save();
    }
    return Promise.resolve(this);
};

tweetSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    const Tweet = this.model('Tweet');
    const User = this.model('User');
    const Bookmark = this.model('Bookmark');

    const tweetId = this._id;

    await Tweet.deleteMany({
                $or: [
            { replyTo: tweetId },
            { quoteTo: tweetId }
        ]
    });

    await Bookmark.deleteMany({ tweet: tweetId });

    await User.updateMany(
        { retweets: tweetId },
        { $pull: { retweets: tweetId } }
    );

    next();
});

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
