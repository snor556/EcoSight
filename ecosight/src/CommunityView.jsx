import React, { useState } from 'react';
import { 
  MessageSquare, ArrowBigUp, ArrowBigDown, Share2, 
  Flame, Clock, TrendingUp, Plus, MoreHorizontal, Send,
  ArrowLeft, Image as ImageIcon, X, AlertCircle
} from 'lucide-react';

export default function CommunityView() {
  const [activeFilter, setActiveFilter] = useState('new');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // We moved posts to state so we can add new ones dynamically!
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "BirderBob",
      avatar: "BB",
      timeAgo: "2 hours ago",
      tag: "Identification Help",
      title: "Found this strange looking moth on my porch in Ohio. Any ideas?",
      content: "It's about the size of my hand and has these bright eye-spots on the lower wings. Never seen anything like it around here before.",
      image: "https://images.unsplash.com/photo-1550236520-7050fce0e58f?auto=format&fit=crop&w=800&q=80",
      upvotes: 245,
      comments: [
        { id: 101, user: "EntoGeek", timeAgo: "1 hour ago", text: "That looks like a Luna Moth (Actias luna)! Beautiful find." },
      ]
    },
    {
      id: 2,
      user: "SarahShutter",
      avatar: "SS",
      timeAgo: "5 hours ago",
      tag: "Photography",
      title: "Finally got a clear shot of a Kingfisher diving!",
      content: "Took me 3 weeks of waiting in a blind at the local wetlands, but it finally paid off.",
      image: "https://images.unsplash.com/photo-1555505019-8c3f1c4aba5f?auto=format&fit=crop&w=800&q=80", 
      upvotes: 1204,
      comments: []
    }
  ]);

  const toggleComments = (id) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  // Function to handle adding the new post to the feed
  const handleSubmitPost = (newPostData) => {
    const newPost = {
      id: Date.now(), // Create a unique ID
      user: "AlexExplorer", // The logged-in user's name
      avatar: "AE",
      timeAgo: "Just now",
      tag: newPostData.tag,
      title: newPostData.title,
      content: newPostData.content,
      image: newPostData.image,
      upvotes: 1,
      comments: []
    };
    
    // Add the new post to the top of the array
    setPosts([newPost, ...posts]);
    setIsCreatingPost(false); // Close the form
    setActiveFilter('new'); // Switch to 'new' so they see their post immediately
  };

  // --- RENDER CREATE POST FORM ---
  if (isCreatingPost) {
    return (
      <CreatePostForm 
        onCancel={() => setIsCreatingPost(false)} 
        onSubmit={handleSubmitPost} 
      />
    );
  }

  // --- RENDER COMMUNITY FEED ---
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

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex items-center gap-2 mb-6 overflow-x-auto">
        <FilterButton icon={<Flame size={18}/>} label="Hot" active={activeFilter === 'hot'} onClick={() => setActiveFilter('hot')} />
        <FilterButton icon={<Clock size={18}/>} label="New" active={activeFilter === 'new'} onClick={() => setActiveFilter('new')} />
        <FilterButton icon={<TrendingUp size={18}/>} label="Top" active={activeFilter === 'top'} onClick={() => setActiveFilter('top')} />
      </div>

      {/* Post Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors">
            
            <div className="flex flex-col sm:flex-row">
              {/* Voting Column */}
              <div className="hidden sm:flex flex-col items-center p-4 bg-gray-50/50 border-r border-gray-50 w-16 shrink-0">
                <button className="text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 p-1 rounded-md transition-colors"><ArrowBigUp size={24} /></button>
                <span className="font-bold text-gray-700 my-1">{post.upvotes}</span>
                <button className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded-md transition-colors"><ArrowBigDown size={24} /></button>
              </div>

              {/* Content Column */}
              <div className="flex-1 p-5 sm:p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {post.avatar}
                    </div>
                    <span className="font-bold text-gray-900">u/{post.user}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{post.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
                      {post.tag}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20}/></button>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

                {post.image && (
                  <div className="rounded-2xl overflow-hidden mb-4 bg-gray-100 max-h-[400px]">
                    <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center gap-2 sm:gap-6 text-gray-500 font-medium text-sm mt-2">
                  <div className="flex sm:hidden items-center gap-1 bg-gray-50 rounded-full px-2 py-1">
                     <button className="hover:text-emerald-500 p-1"><ArrowBigUp size={20} /></button>
                     <span className="font-bold text-gray-700">{post.upvotes}</span>
                     <button className="hover:text-rose-500 p-1"><ArrowBigDown size={20} /></button>
                  </div>

                  <button 
                    onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors ${expandedPostId === post.id ? 'bg-gray-50 text-emerald-600' : ''}`}
                  >
                    <MessageSquare size={18} /> {post.comments.length} Comments
                  </button>
                  <button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors">
                    <Share2 size={18} /> Share
                  </button>
                </div>
              </div>
            </div>

            {/* EXPANDED COMMENTS SECTION */}
            {expandedPostId === post.id && (
              <div className="bg-gray-50 border-t border-gray-100 p-5 sm:p-6 sm:pl-20 animate-in slide-in-from-top-2 duration-200">
                <div className="flex gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">AE</div>
                  <div className="flex-1 relative">
                    <input type="text" placeholder="Add a comment..." className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                    <button className="absolute right-2 top-1.5 p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Send size={16} /></button>
                  </div>
                </div>
                <div className="space-y-5">
                  {post.comments.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No comments yet. Be the first to start the discussion!</p>
                  ) : (
                    post.comments.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs shrink-0">{comment.user.substring(0,2).toUpperCase()}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 text-sm">{comment.user}</span>
                            <span className="text-gray-400 text-xs">{comment.timeAgo}</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- NEW COMPONENT: THE POST CREATOR FORM ---
function CreatePostForm({ onCancel, onSubmit }) {
  const [tag, setTag] = useState('Discussion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Tags available for posting
  const POST_TAGS = ['Discussion', 'Identification Help', 'Photography', 'Location Tip'];

  // Simulate uploading an image
  const handleImageUpload = () => {
    // In a real app, this would open a file picker. Here we mock it with an Unsplash image.
    setImagePreview("https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80"); // A cool lion image
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return; // Don't submit empty posts
    
    onSubmit({ tag, title, content, image: imagePreview });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-300 pb-20">
      
      {/* Top Bar */}
      <button 
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Community
      </button>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-900">Create a Post</h2>
          <p className="text-gray-500">Share your wildlife questions, stories, or photos with the network.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
          
          {/* Post Tag Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">What kind of post is this?</label>
            <div className="flex flex-wrap gap-2">
              {POST_TAGS.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    tag === t 
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500' 
                    : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Post Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Best spots for birdwatching in Central Park?" 
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 font-medium"
            />
          </div>

          {/* Text Content */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Body</label>
            <textarea 
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts here..." 
              className="w-full min-h-[150px] bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 resize-y"
            ></textarea>
          </div>

          {/* Optional Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Attach an Image (Optional)</label>
            
            {!imagePreview ? (
              <div 
                onClick={handleImageUpload}
                className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer transition-colors group"
              >
                <ImageIcon size={32} className="text-gray-400 group-hover:text-emerald-500 mb-3 transition-colors" />
                <span className="text-gray-600 font-medium">Click to upload a photo</span>
                <span className="text-gray-400 text-xs mt-1">JPG, PNG up to 10MB</span>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 inline-block">
                <img src={imagePreview} alt="Preview" className="h-48 w-auto object-cover" />
                <button 
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!title || !content}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
            >
              <Send size={18} /> Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Filter Button Sub-component
function FilterButton({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm shrink-0 ${
        active 
        ? 'bg-gray-100 text-gray-900' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
      }`}
    >
      {React.cloneElement(icon, { className: active ? 'text-emerald-500' : 'text-gray-400' })}
      {label}
    </button>
  );
}