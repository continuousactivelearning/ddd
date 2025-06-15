import React, { useState } from 'react';

const CourseUpload = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    category: '',
    thumbnail: '',
    videoUrl: '',
    totalDuration: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New Course:', courseData);
    // ✅ Send courseData to your backend here.
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Upload a New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" type="text" placeholder="Course Title" value={courseData.title} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="category" type="text" placeholder="Category" value={courseData.category} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="thumbnail" type="text" placeholder="Thumbnail URL" value={courseData.thumbnail} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="videoUrl" type="text" placeholder="YouTube Video URL" value={courseData.videoUrl} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="totalDuration" type="text" placeholder="Total Duration (e.g. 20m)" value={courseData.totalDuration} onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">Submit Course</button>
      </form>
    </div>
  );
};

export default CourseUpload;
