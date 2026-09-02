import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const ManageOffers = () => {
  const [heroes, setHeroes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Video source options: file upload or direct URL link
  const [videoMode, setVideoMode] = useState('url');
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  // Cards array files (up to 3)
  const [cardFiles, setCardFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/hero');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setHeroes(json.data);
      }
    } catch (err) {
      console.error('Error fetching heroes:', err);
    }
  };

  const handleAddHero = async (e) => {
    e.preventDefault();
    if (!title || !description || cardFiles.length === 0) {
      toast.error('Please fill out title, description, and upload card images.');
      return;
    }
    if (videoMode === 'file' && !videoFile) {
      toast.error('Please select a video file.');
      return;
    }
    if (videoMode === 'url' && !videoUrl) {
      toast.error('Please enter a video URL.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    
    if (videoMode === 'file') {
      formData.append('video', videoFile);
    } else {
      formData.append('videoUrl', videoUrl);
    }

    // Append card image files matching the 'cards' field array
    for (let i = 0; i < cardFiles.length; i++) {
      formData.append('cards', cardFiles[i]);
    }

    const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('userInfo'))?.token;

    try {
      const res = await fetch('http://localhost:5000/api/hero', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();

      if (res.ok && json.success) {
        toast.success('New destination slide added successfully!');
        setHeroes([...heroes, json.data]);
        setTitle('');
        setDescription('');
        setVideoFile(null);
        setVideoUrl('');
        setCardFiles([]);
      } else {
        toast.error(json.message || 'Failed to add slide.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHero = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;

    const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('userInfo'))?.token;

    try {
      const res = await fetch(`http://localhost:5000/api/hero/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (res.ok && json.success) {
        toast.success('Slide deleted successfully!');
        setHeroes(heroes.filter((hero) => hero._id !== id));
      } else {
        toast.error(json.message || 'Failed to delete slide.');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('An error occurred while deleting.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md my-10 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Hero Slides</h2>

      <form onSubmit={handleAddHero} className="space-y-6 bg-gray-50 p-6 rounded-lg border mb-8">
        <h3 className="text-lg font-semibold text-gray-700">Add New Destination Slide</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white"
            placeholder="e.g. Thailand"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full p-3 border rounded-lg bg-white"
            required
          />
        </div>

        {/* Video Input Mode Switcher */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Video Source</label>
          <div className="flex space-x-4 mb-2">
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input 
                type="radio" 
                name="videoMode" 
                checked={videoMode === 'url'} 
                onChange={() => setVideoMode('url')} 
              />
              <span>Video URL Link</span>
            </label>
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input 
                type="radio" 
                name="videoMode" 
                checked={videoMode === 'file'} 
                onChange={() => setVideoMode('file')} 
              />
              <span>Upload Video File</span>
            </label>
          </div>

          {videoMode === 'url' ? (
            <input
              type="url"
              placeholder="Paste video link (e.g., https://...)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white text-sm"
            />
          ) : (
            <input
              type="file"
              accept="video/mp4"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full p-2 border rounded-lg text-sm bg-white"
            />
          )}
        </div>

        {/* 3 Card Images Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Images (Select up to 3)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setCardFiles(e.target.files)}
            className="w-full p-2 border rounded-lg text-sm bg-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Adding Slide...' : 'Add Destination Slide'}
        </button>
      </form>

      {/* Existing Slides List with Delete Feature */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Existing Slides ({heroes.length})</h3>
        {heroes.length === 0 ? (
          <p className="text-sm text-gray-500">No slides found in database.</p>
        ) : (
          heroes.map((hero) => (
            <div key={hero._id} className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-800">{hero.title}</h4>
                <p className="text-xs text-gray-500 truncate max-w-md">{hero.description}</p>
              </div>
              <button
                onClick={() => handleDeleteHero(hero._id)}
                className="bg-red-50 text-red-600 p-2.5 rounded-lg hover:bg-red-100 transition cursor-pointer"
                title="Delete Slide"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageOffers;