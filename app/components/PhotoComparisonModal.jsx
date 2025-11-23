'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageViewingPath } from '../utils/utilities';

export default function PhotoComparisonModal({ photos, index, onClose, setIndex }) {
  const [displayIndex, setDisplayIndex] = useState(index);

  // Update the display photo and current index when the initial photo prop changes
  useEffect(() => {
    setDisplayIndex(index);
  }, [index]);

  // Define the four corner photos for comparison
  const cornerPhotos = {
    topLeft: photos[(index + 0) % photos.length],
    topRight: photos[(index + 1) % photos.length],
    bottomLeft: photos[(index + 2) % photos.length],
    bottomRight: photos[(index + 3) % photos.length],
  };

  const displayPhoto = photos[displayIndex];

  // Handle keyboard events for navigation and closing the modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        // Go to the previous photo
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        // Go to the next photo
        handleNext();
      } else if (event.key === '1') {
        setDisplayIndex((index + 0) % photos.length);
      } else if (event.key === '2') {
        setDisplayIndex((index + 1) % photos.length);
      } else if (event.key === '3') {
        setDisplayIndex((index + 2) % photos.length);
      } else if (event.key === '4') {
        setDisplayIndex((index + 3) % photos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, index, photos]);

  // Function to go to the previous photo
  const handlePrev = () => {
    setIndex((index - 1 + photos.length) % photos.length);
  };

  // Function to go to the next photo
  const handleNext = () => {
    setIndex((index + 1) % photos.length);
  };

  if (!photos || photos.length === 0) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center"
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

        {/* Corner Click Handlers with Number Overlays */}
        <div
          className="absolute top-0 left-0 w-1/4 h-1/4 cursor-pointer group"
          onClick={() => setDisplayIndex((index + 0) % photos.length)}
        >
          <div className="w-16 h-16 border-t-4 border-l-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4 relative">
            <span className="absolute -top-4 -left-4 text-white text-xl font-bold p-2 opacity-50 group-hover:opacity-100">1</span>
          </div>
        </div>
        <div
          className="absolute top-0 right-0 w-1/4 h-1/4 cursor-pointer group flex justify-end"
          onClick={() => setDisplayIndex((index + 1) % photos.length)}
        >
          <div className="w-16 h-16 border-t-4 border-r-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4 relative">
            <span className="absolute -top-4 -right-4 text-white text-xl font-bold p-2 opacity-50 group-hover:opacity-100">2</span>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 w-1/4 h-1/4 cursor-pointer group flex items-end"
          onClick={() => setDisplayIndex((index + 2) % photos.length)}
        >
          <div className="w-16 h-16 border-b-4 border-l-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4 relative">
            <span className="absolute -bottom-4 -left-4 text-white text-xl font-bold p-2 opacity-50 group-hover:opacity-100">3</span>
          </div>
        </div>
        <div
          className="absolute bottom-0 right-0 w-1/4 h-1/4 cursor-pointer group flex justify-end items-end"
          onClick={() => setDisplayIndex((index + 3) % photos.length)}
        >
          <div className="w-16 h-16 border-b-4 border-r-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4 relative">
            <span className="absolute -bottom-4 -right-4 text-white text-xl font-bold p-2 opacity-50 group-hover:opacity-100">4</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-4 p-4">
        <button onClick={handlePrev} className="text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded">
          Prev
        </button>
        <a
          href={getImageViewingPath(displayPhoto.src || displayPhoto.url)}
          download
          className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
        >
          Download
        </a>
        <button onClick={handleNext} className="text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded">
          Next
        </button>
      </div>
    </div>
  );
}