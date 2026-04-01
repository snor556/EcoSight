import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageSquare, ArrowBigUp, ArrowBigDown, Share2, 
  Flame, Clock, TrendingUp, Plus, Send,
  ArrowLeft, Image as ImageIcon, X, MapPin, Award,
  BarChart2 // NEW: Imported the Poll icon
} from 'lucide-react';

export default function CommunityView() {
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Get the logged-in user so we know who is voting
  const currentUserString = localStorage.getItem('ecoSightUser');
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

  const fetchCommunityFeed = async () => {
    try {
      const token = localStorage.getItem('ecoSightToken');
      const response = await axios.get('http://localhost:3000/api/sightings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeed(response.data.data);
    } catch (err) {
      console.error("Failed to fetch community feed", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityFeed();
  }, []);

  // --- RENDER CREATE POST FORM ---
  if (isCreatingPost) {
    return (
      <CreatePostForm 
        onCancel={() => setIsCreatingPost(false)} 
        onSuccess={() => {
          setIsCreatingPost(false);
          fetchCommunityFeed(); 
        }} 
      />
    );
  }

  // --- RENDER COMMUNITY FEED ---
  if (isLoading) return <div className="p-10 text-center text-gray-500 animate-pulse">Loading global discoveries...</div>;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500 pb-20">
      
      {/* Header & Create Post Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Community</h1>
          <p className="text-gray-500">Discuss sightings, ask for help, and share tips.</p>
        </div>
        <button 
          onClick={() => setIsCreatingPost(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus size={20} /> Create Post
        </button>
      </div>

      {/* Post Feed */}
      <div className="space-y-6">
        {feed.map((item) => {
          const isDiscussionPost = !!item.title;

          if (isDiscussionPost) {
            // NEW: Passing currentUser down to the card
            return <DiscussionCard key={item._id} post={item} currentUser={currentUser} onVoteComplete={fetchCommunityFeed} />;
          } else {
            return <AchievementStrip key={item._id} sighting={item} />;
          }
        })}
        
        {feed.length === 0 && (
          <div className="text-center p-10 text-gray-500 bg-white rounded-3xl border border-gray-100">
            No sightings or posts yet. Be the first to start the discussion!
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// UI: The Horizontal Achievement Strip
// -----------------------------------------------------------------
export function AchievementStrip({ sighting }) {
  const username = sighting.user?.username || "A Naturalist";
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 shadow-sm border border-emerald-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-emerald-200 text-emerald-800 rounded-full flex items-center justify-center font-bold uppercase shrink-0">
        {username.charAt(0)}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <Award size={16} className="text-amber-500" />
          <span className="text-sm text-gray-600">Achievement Unlocked</span>
        </div>
        <p className="text-gray-900">
          <span className="font-bold capitalize">{username}</span> successfully identified a <span className="font-bold text-emerald-700 capitalize">{sighting.species}</span>!
        </p>
      </div>

      {sighting.imageUrl && (
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
          <img src={sighting.imageUrl} alt={sighting.species} className="w-full h-full object-cover hover:scale-110 transition-transform" />
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// UI: The Vertical Discussion Card (NOW WITH POLLS!)
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// UI: The Vertical Discussion Card (UPGRADED POLL UI)
// -----------------------------------------------------------------
export function DiscussionCard({ post, currentUser, onVoteComplete }) {
  const username = post.user?.username || "Anonymous";
  
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // POLL STATE LOGIC
  const [pollData, setPollData] = useState(post.poll);
  const [isVoting, setIsVoting] = useState(false);
  const [myVoteIndex, setMyVoteIndex] = useState(null); // NEW: Tracks which option they just clicked!

  // BULLETPROOF ID CHECK (Handles both ._id and .id)
  const currentUserId = currentUser?._id || currentUser?.id;
  const hasPoll = pollData && pollData.options && pollData.options.length > 0;
  
  // They have voted if their ID is in the database OR if they just clicked a button right now
  const hasVoted = (hasPoll && currentUserId && pollData.votedUsers.some(id => id === currentUserId)) || myVoteIndex !== null;
  const totalVotes = hasPoll ? pollData.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;

  const handleUpvote = async () => {
    setUpvotes(prev => prev + 1);
    try {
      const token = localStorage.getItem('ecoSightToken');
      await axios.put(`http://localhost:3000/api/sightings/${post._id}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      setUpvotes(prev => prev - 1);
      console.error("Failed to upvote", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('ecoSightToken');
      const response = await axios.post(`http://localhost:3000/api/sightings/${post._id}/comment`, 
        { text: commentText }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(response.data.data.comments);
      setCommentText("");
    } catch (error) {
      console.error("Failed to post comment", error);
      alert("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteClick = async (optionIndex) => {
    if (isVoting || hasVoted) return;
    
    setIsVoting(true);
    setMyVoteIndex(optionIndex); // instantly highlights their choice!

    try {
      const token = localStorage.getItem('ecoSightToken');
      const response = await axios.post(`http://localhost:3000/api/sightings/${post._id}/vote`, 
        { optionIndex },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedPost = response.data.data;
      setPollData(updatedPost.poll);
      
      if (onVoteComplete) onVoteComplete(updatedPost); 
    } catch (error) {
      console.error("Error voting:", error);
      setMyVoteIndex(null); // Revert the color change if the server fails
      alert(error.response?.data?.message || "Failed to submit vote.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors">
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs uppercase">
              {username.charAt(0)}
            </div>
            <span className="font-bold text-gray-900 capitalize">{username}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
            {post.tag || "Discussion"}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed whitespace-pre-wrap">{post.description}</p>

        {post.imageUrl && (
          <div className="rounded-2xl overflow-hidden mb-4 bg-gray-100 max-h-[400px]">
            <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" />
          </div>
        )}

        {/* ========================================== */}
        {/* THE UPGRADED POLL UI */}
        {/* ========================================== */}
        {hasPoll && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
            <p className="font-bold text-gray-800 mb-4 text-sm">Community Poll</p>
            <div className="space-y-3">
              {pollData.options.map((option, index) => {
                const percent = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                
                // Check if this is the specific option the user just clicked
                const isMyChoice = myVoteIndex === index;

                if (hasVoted) {
                  // RESULTS VIEW (Shows Numbers and Highlights Choice)
                  return (
                    <div key={index} className={`relative w-full border ${isMyChoice ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200'} bg-white rounded-lg overflow-hidden p-3 z-0`}>
                      <div 
                        className={`absolute top-0 left-0 h-full -z-10 transition-all duration-1000 ease-out ${isMyChoice ? 'bg-emerald-200' : 'bg-emerald-100'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className={isMyChoice ? "text-emerald-900 font-bold" : "text-gray-800"}>{option.text}</span>
                        <span className={isMyChoice ? "text-emerald-900 font-bold" : "text-emerald-800"}>{percent}% ({option.votes})</span>
                      </div>
                    </div>
                  );
                } else {
                  // VOTING VIEW (Unclicked Buttons)
                  return (
                    <button 
                      key={index}
                      onClick={() => handleVoteClick(index)}
                      disabled={isVoting}
                      className="w-full text-left p-3 border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium text-emerald-800 disabled:opacity-50"
                    >
                      {option.text}
                    </button>
                  );
                }
              })}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-right">{totalVotes} total votes</p>
          </div>
        )}

        <div className="flex items-center gap-4 text-gray-500 font-medium text-sm mt-4 pt-4 border-t border-gray-50">
          <button onClick={handleUpvote} className="flex items-center gap-1 hover:text-emerald-500 transition-colors bg-gray-50 hover:bg-emerald-50 px-3 py-1.5 rounded-xl">
            <ArrowBigUp size={20} /> {upvotes}
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors ${isExpanded ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-50 hover:text-emerald-500'}`}>
            <MessageSquare size={18} /> {comments.length} Comments
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-50 border-t border-gray-100 p-5 sm:p-6 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..." 
                className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                disabled={isSubmitting}
              />
              <button type="submit" disabled={isSubmitting || !commentText.trim()} className="absolute right-2 top-1.5 p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50">
                <Send size={16} />
              </button>
            </div>
          </form>

          <div className="space-y-4 pl-2 border-l-2 border-gray-200 ml-4">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-sm py-2">No comments yet. Be the first!</p>
            ) : (
              comments.map((comment, idx) => (
                <div key={comment._id || idx} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 text-sm capitalize">
                      {comment.user?.username || "User"}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// UI: The Post Creator Form (NOW WITH POLL INPUTS!)
// -----------------------------------------------------------------
function CreatePostForm({ onCancel, onSuccess }) {
  const [tag, setTag] = useState('Discussion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: Poll Creation State
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']); 

  const POST_TAGS = ['Discussion', 'Identification Help', 'Photography', 'Location Tip'];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  // NEW: Poll Input Handlers
  const handleAddOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    const newOptions = pollOptions.filter((_, i) => i !== index);
    setPollOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content); // Note: Your schema calls this 'description', ensure backend matches!
    formData.append("tag", tag);
    if (file) formData.append("file", file);

    // NEW: Package the poll logic
    const validOptions = pollOptions.filter(opt => opt.trim() !== '');
    if (showPoll && validOptions.length > 1) {
      // Stringify the poll object because FormData only accepts strings/files
      formData.append("poll", JSON.stringify({
        options: validOptions.map(opt => ({ text: opt, votes: 0 }))
      }));
    }

    try {
      const token = localStorage.getItem('ecoSightToken');
      await axios.post("http://localhost:3000/api/sightings/discussion", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });
      onSuccess(); 
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to post to the community.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-300 pb-20">
      <button onClick={onCancel} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Community
      </button>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-900">Create a Post</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Tag</label>
            <div className="flex flex-wrap gap-2">
              {POST_TAGS.map(t => (
                <button
                  key={t} 
                  type="button" onClick={() => setTag(t)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    tag === t ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500' : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 font-medium"/>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Body</label>
            <textarea required value={content} onChange={(e) => setContent(e.target.value)} className="w-full min-h-[150px] bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 resize-y"></textarea>
          </div>

          {/* NEW: POLL TOGGLE & INPUTS */}
          {!showPoll ? (
            <button 
              type="button" 
              onClick={() => setShowPoll(true)}
              className="flex items-center gap-2 text-emerald-600 font-bold text-sm hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors w-max"
            >
              <BarChart2 size={18} /> Add a Poll
            </button>
          ) : (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-700 text-sm">Poll Options</span>
                <button type="button" onClick={() => setShowPoll(false)} className="text-gray-400 hover:text-red-500">
                  <X size={18} />
                </button>
              </div>
              
              {pollOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input 
                    type="text" 
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  {pollOptions.length > 2 && (
                    <button type="button" onClick={() => handleRemoveOption(index)} className="text-gray-400 hover:text-red-500 p-2">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}

              {pollOptions.length < 4 && (
                <button 
                  type="button" 
                  onClick={handleAddOption}
                  className="text-sm text-emerald-600 font-medium flex items-center gap-1 mt-2"
                >
                  <Plus size={16} /> Add Option
                </button>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Attach an Image (Optional)</label>
            {!imagePreview ? (
              <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer transition-colors group">
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <ImageIcon size={32} className="text-gray-400 group-hover:text-emerald-500 mb-3 transition-colors" />
                <span className="text-gray-600 font-medium">Click to upload a photo</span>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 inline-block">
                <img src={imagePreview} alt="Preview" className="h-48 w-auto object-cover" />
                <button type="button" onClick={() => { setImagePreview(null); setFile(null); }} className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={!title || !content || isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
              {isSubmitting ? "Posting..." : <><Send size={18} /> Post</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}