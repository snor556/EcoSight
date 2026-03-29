// NEW: Fetch only the logged-in user's sightings
const Sighting = require("../models/Sighting.js")
const getUserSightings = async (req, res) => {
    try {
        // Remember our Bouncer (authMiddleware)? 
        // If a request makes it to this function, the Bouncer already verified the token 
        // and attached the user's secure ID to "req.user._id".
        
        // We tell MongoDB: "Find all sightings where the 'user' field matches this ID"
        // .sort({ createdAt: -1 }) guarantees the newest sightings appear first!
        const sightings = await Sighting.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: sightings.length,
            data: sightings
        });

    } catch (error) {
        console.error("Error fetching user sightings:", error);
        res.status(500).json({ message: "Server error while fetching your journal." });
    }
};
// NEW: Fetch the global community feed
const getAllSightings = async (req, res) => {
    try {
        // Notice the .populate() at the end! 
        // We tell it to look at the 'user' field, and only bring back the 'username'
        const sightings = await Sighting.find()
            .sort({ createdAt: -1 })
            .populate('user', 'username');

        res.status(200).json({
            success: true,
            count: sightings.length,
            data: sightings
        });

    } catch (error) {
        console.error("Error fetching community feed:", error);
        res.status(500).json({ message: "Server error while fetching community feed." });
    }
};
// NEW: Upvote a post
const upvotePost = async (req, res) => {
    try {
        // Find the post by the ID in the URL, and increment ($inc) the upvotes by 1
        const post = await Sighting.findByIdAndUpdate(
            req.params.id, 
            { $inc: { upvotes: 1 } }, 
            { new: true }
        );
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error("Upvote error:", error);
        res.status(500).json({ message: "Server error while upvoting." });
    }
};

// NEW: Add a comment to a post
const addComment = async (req, res) => {
    try {
        const post = await Sighting.findById(req.params.id);
        
        // Create the new comment object using the logged-in user's ID
        const newComment = {
            user: req.user._id,
            text: req.body.text
        };

        // Push it into the array and save
        post.comments.push(newComment);
        await post.save();

        // Populate the username so the frontend knows who just commented
        await post.populate('comments.user', 'username');

        res.status(201).json({ success: true, data: post });
    } catch (error) {
        console.error("Comment error:", error);
        res.status(500).json({ message: "Server error while commenting." });
    }
};

module.exports = {getUserSightings , getAllSightings , upvotePost, addComment}