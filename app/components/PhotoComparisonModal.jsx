'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageDownloadPath, getImageViewingPath } from '../utils/utilities';

export default function PhotoComparisonModal({ photos, index, onClose, setIndex }) {
  const [displayIndex, setDisplayIndex] = useState(index);

  // Update the display photo and current index when the initial photo prop changes
  useEffect(() => {
    setDisplayIndex(index);
  }, [index]);


  const displayPhoto = photos[displayIndex];
  // Function to go to the previous photo
  const handlePrev = () => {
     const prevI = (index - 1 + photos.length) % photos.length;
     setIndex(prevI);
    setDisplayIndex(prevI);
  };

  // Function to go to the next photo
  const handleNext = () => {
    const nextI = (index + 1) % photos.length;
    setIndex(nextI);
    setDisplayIndex(nextI);
    console.log('Next photo index:', nextI);
  };

  const downloadImage = () => {
    const downloadPath = getImageDownloadPath(displayPhoto.src || displayPhoto.url);
    if (downloadPath) {
      window.location.href = downloadPath;
    }
  }


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
        setDisplayIndex((index + 1) % photos.length);
      } else if (event.key === '2') {
        setDisplayIndex((index + 2) % photos.length);
      } else if (event.key === '3') {
        setDisplayIndex((index + 3) % photos.length);
      } else if (event.key === '4') {
        setDisplayIndex((index + 4) % photos.length);
      } else if (event.key === '5') {
        setDisplayIndex((index + 5) % photos.length);
      }
      else if (event.key === '6') {
        setDisplayIndex((index + 6) % photos.length);
      }
      else if (event.key === '7') {
        setDisplayIndex((index + 7) % photos.length);
      }
      else if (event.key === '8') {
        setDisplayIndex((index + 8) % photos.length);
      }
      else if (event.key === '9') {
        setDisplayIndex((index + 9) % photos.length);
        console.log('Pressed 9');
      } else if (event.key === '0') {
        setDisplayIndex((index) % photos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, index, photos, handleNext, handlePrev]);

  
  if (!photos || photos.length === 0) return <h1>No photos to display.</h1>;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center"
      // onClick={onClose}
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
          className="absolute top-0 left-0 w-1/2 h-1/2 cursor-pointer group"
          onMouseDown={() => setDisplayIndex((index + 1) % photos.length)}
          onMouseUp={() => setDisplayIndex((index + 0) % photos.length)}
        >
          <div className="w-16 h-16 border-t-4 border-l-4 
          border-white opacity-50 group-hover:opacity-100 transition-opacity m-4 relative">
            <span className="absolute top-1 left-1 text-white text-xl font-bold p-2 opacity-50 group-hover:opacity-100">1</span>
          </div>
        </div>
        <div
          className="absolute top-0 right-0 w-1/2 h-1/2 cursor-pointer group flex justify-end"
          onMouseDown={() => setDisplayIndex((index + 2) % photos.length)}
          onMouseUp={() => setDisplayIndex((index + 0) % photos.length)}
        >
          <div className="w-16 h-16 border-t-4 border-r-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4 relative">
            <span className="absolute top-5 right-5 text-white text-xl font-bold p-2 opacity-90 group-hover:opacity-100">2</span>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 w-1/2 h-1/2 cursor-pointer group flex items-end"
          onMouseDown={() => setDisplayIndex((index + 3) % photos.length)}
          onMouseUp={() => setDisplayIndex((index + 0) % photos.length)}
        >
          <div className="w-16 h-16 border-b-4 border-l-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4 relative">
            <span className="absolute bottom-1 left-1 text-white text-xl font-bold p-2 opacity-90 group-hover:opacity-100">3</span>
          </div>
        </div>
        <div
          className="absolute bottom-0 right-0 w-1/2 h-1/2 cursor-pointer group flex justify-end items-end"
          onMouseDown={() => setDisplayIndex((index + 4) % photos.length)}
          onMouseUp={() => setDisplayIndex((index + 0) % photos.length)}
        >
          <div className="w-16 h-16 border-b-4 border-r-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4 relative">
            <span className="absolute bottom-1 right-1 text-white text-xl font-bold p-2 opacity-90 group-hover:opacity-100">4</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-4 p-4">
        <button onClick={handlePrev} className="text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded">
          Prev
        </button>
        <button onClick={downloadImage} className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">
          Download
        </button>
        <button onClick={onClose} className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">
        Exit
        </button>
        {/* <a
          href={getImageViewingPath(displayPhoto.src || displayPhoto.url)}
          download
          className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
        >
          Download
        </a> */}
        <button onClick={handleNext} className="text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded">
          Next
        </button>
      </div>
    </div>
  );
}