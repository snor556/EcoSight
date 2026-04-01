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
// NEW: Vote on a Community Poll
const voteOnPoll = async (req, res) => {
    try {
        // The frontend will tell us which option (0, 1, 2, etc.) the user clicked
        const { optionIndex } = req.body; 
        const post = await Sighting.findById(req.params.id);

        if (!post || !post.poll || post.poll.options.length === 0) {
            return res.status(404).json({ message: "Poll not found on this post." });
        }

        // SECURITY CHECK: Did this user already vote?
        if (post.poll.votedUsers.includes(req.user._id)) {
            return res.status(400).json({ message: "You have already voted on this poll." });
        }

        // SUCCESS: Increment the vote count for that specific option
        post.poll.options[optionIndex].votes += 1;
        
        // Add the user's ID to the voted list so they can't vote again
        post.poll.votedUsers.push(req.user._id);

        await post.save();

        // Populate the username data so the React card renders correctly when we send it back
        await post.populate('user', 'username');
        if (post.comments && post.comments.length > 0) {
            await post.populate('comments.user', 'username');
        }

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error("Voting error:", error);
        res.status(500).json({ message: "Server error while processing your vote." });
    }
};

// NEW: Global Search Controller
const searchSightings = async (req, res) => {
    try {
        // Grab the search word from the URL (e.g., ?query=tiger)
        const searchQuery = req.query.query; 

        // Safety check: If they submit an empty search, just return an empty array
        if (!searchQuery || searchQuery.trim() === '') {
            return res.status(200).json({ success: true, data: [] });
        }

        // Compile the search word into a Case-Insensitive Regex pattern
        const searchRegex = new RegExp(searchQuery, 'i');

        // The Core Engine: Find ANY post where the species, title, OR description matches
        const results = await Sighting.find({
            $or: [
                { species: { $regex: searchRegex } },
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } }
            ]
        })
        .populate('user', 'username') // We need the username so the DiscussionCard doesn't crash!
        .populate('comments.user', 'username')
        .sort({ createdAt: -1 }); // Show the newest matching posts first

        res.status(200).json({ success: true, data: results });

    } catch (error) {
        console.error("Global search error:", error);
        res.status(500).json({ message: "Server error while searching the database." });
    }
};

module.exports = {getUserSightings , getAllSightings , upvotePost, addComment, voteOnPoll , searchSightings}