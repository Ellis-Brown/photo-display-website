'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageViewingPath } from '../utils/utilities';

export default function PhotoComparisonModal({ photo, photos, index, secondaryIndex, onClose }) {
  const [displayPhoto, setDisplayPhoto] = useState(photo);

  // Update displayPhoto if the initial photo prop changes
  useEffect(() => {
    setDisplayPhoto(photo);
  }, [photo]);

  // Define the four corner photos
  const cornerPhotos = {
    topLeft: photo,
    topRight: photos[secondaryIndex],
    bottomLeft: photos[(index + 1) % photos.length],
    bottomRight: photos[(index - 1 + photos.length) % photos.length],
  };

  // Handle keyboard events for closing the modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-5xl font-bold z-50"
      >
        &times;
      </button>

      {/* Image container that stops click propagation */}
      <div
        className="relative w-full h-full flex justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-[90vw] h-[90vh]">
          <Image
            src={getImageViewingPath(displayPhoto.src || displayPhoto.url)}
            alt={displayPhoto.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            onError={(e) => { e.target.src = 'https://placehold.co/600x400/CCCCCC/white?text=Image+Not+Found'; }}
          />
        </div>

        {/* Corner Click Handlers */}
        <div
          className="absolute top-0 left-0 w-1/4 h-1/4 cursor-pointer group"
          onClick={() => setDisplayPhoto(cornerPhotos.topLeft)}
        >
          <div className="w-16 h-16 border-t-4 border-l-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4"></div>
        </div>
        <div
          className="absolute top-0 right-0 w-1/4 h-1/4 cursor-pointer group flex justify-end"
          onClick={() => setDisplayPhoto(cornerPhotos.topRight)}
        >
          <div className="w-16 h-16 border-t-4 border-r-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4"></div>
        </div>
        <div
          className="absolute bottom-0 left-0 w-1/4 h-1/4 cursor-pointer group flex items-end"
          onClick={() => setDisplayPhoto(cornerPhotos.bottomLeft)}
        >
          <div className="w-16 h-16 border-b-4 border-l-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4"></div>
        </div>
        <div
          className="absolute bottom-0 right-0 w-1/4 h-1/4 cursor-pointer group flex justify-end items-end"
          onClick={() => setDisplayPhoto(cornerPhotos.bottomRight)}
        >
          <div className="w-16 h-16 border-b-4 border-r-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4"></div>
        </div>
      </div>
    </div>
  );
}