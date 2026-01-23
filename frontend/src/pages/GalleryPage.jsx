import React from 'react';
import Gallery from '../components/Gallery';

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="pt-20">
        <Gallery />
      </div>
    </div>
  );
};

export default GalleryPage;
