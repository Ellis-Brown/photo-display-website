'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageDownloadPath, getImageViewingPath } from '../utils/utilities';

export default function PhotoComparisonModal({ photos, index, onClose, setIndex, selectedComparison, onComparisonEnd }) {
  const [displayIndex, setDisplayIndex] = useState(index);
  const [comparisonPhotos, setComparisonPhotos] = useState(photos);
  const [droppedPhotos, setDroppedPhotos] = useState([]);

  // Update the display photo and current index when the initial photo prop changes
  useEffect(() => {
    setDisplayIndex(index);
  }, [index]);

  const handleClose = () => {
    if (onComparisonEnd) {
      onComparisonEnd(droppedPhotos.map(p => p.photo));
    }
    onClose();
  };

  const handleDrop = () => {
    if (comparisonPhotos.length <= 1) {
      handleClose(); // or show a message
      return;
    }

    const droppedPhoto = {
      photo: comparisonPhotos[displayIndex],
      originalIndex: displayIndex,
    };
    setDroppedPhotos([...droppedPhotos, droppedPhoto]);

    const newPhotos = comparisonPhotos.filter((_, i) => i !== displayIndex);
    setComparisonPhotos(newPhotos);

    // Adjust index to show the next photo, or the previous one if it was the last
    const newIndex = displayIndex >= newPhotos.length ? newPhotos.length - 1 : displayIndex;
    setIndex(newIndex)
    setDisplayIndex(newIndex);
  };

  const handleUndo = () => {
    if (droppedPhotos.length === 0) return;

    const lastDropped = droppedPhotos[droppedPhotos.length - 1];
    const newDroppedPhotos = droppedPhotos.slice(0, -1);

    const newPhotos = [
      ...comparisonPhotos.slice(0, lastDropped.originalIndex),
      lastDropped.photo,
      ...comparisonPhotos.slice(lastDropped.originalIndex),
    ];

    setComparisonPhotos(newPhotos);
    setDroppedPhotos(newDroppedPhotos);
    setIndex(lastDropped.originalIndex)
    setDisplayIndex(lastDropped.originalIndex);
  };


  const displayPhoto = comparisonPhotos[displayIndex];
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
        handleClose();
      } else if (event.key === 'ArrowLeft') {
        // Go to the previous photo
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        // Go to the next photo
        handleNext();
      } else if (event.key === '1') {
        setDisplayIndex((displayIndex + 1) % comparisonPhotos.length);
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
  }, [displayIndex, comparisonPhotos, handleNext, handlePrev]);

  
  if (!comparisonPhotos || comparisonPhotos.length === 0) return <h1>No photos to display.</h1>;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center h-screen"
      // onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white text-5xl font-bold z-50"
      >
        &times;
      </button>

      {/* Image container that stops click propagation */}
      <div
        className="relative w-full flex justify-center items-center"
        style={{ height: '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-[90vw] h-full">
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

      {/* --- Controls Container --- */}
      <div className="flex flex-col items-center pt-2">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-4 p-2">
          <button onClick={handlePrev} className="text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded">
            Prev
          </button>
          <button onClick={downloadImage} className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">
            Download
          </button>
          <button onClick={handleClose} className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">
            Exit
          </button>
          <button onClick={handleNext} className="text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded">
            Next
          </button>
        </div>

        {/* --- Selected Comparison UI --- */}
        {selectedComparison && (
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDrop}
                className="text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
              >
                Drop This Image
              </button>
              <button
                onClick={handleUndo}
                className={`px-4 py-2 rounded ${
                  droppedPhotos.length > 0
                    ? 'text-white bg-yellow-500 hover:bg-yellow-400'
                    : 'text-gray-400 bg-gray-600 cursor-not-allowed'
                }`}
                disabled={droppedPhotos.length === 0}
              >
                Undo Drop
              </button>
            </div>
            {/* Rolling 10-photo preview */}
            <div className="flex justify-center items-center mt-2 space-x-2">
              {(() => {
                const totalPhotos = comparisonPhotos.length;
                if (totalPhotos <= 1) return null;

                const previewCount = Math.min(10, totalPhotos);
                let start = Math.max(0, index - Math.floor(previewCount / 2));
                let end = start + previewCount;

                if (end > totalPhotos) {
                  end = totalPhotos;
                  start = Math.max(0, end - previewCount);
                }
                
                let photosForPreview = comparisonPhotos.slice(start, end);
                
                // When at the end, the preview window might be smaller than 10.
                // This is to ensure we always try to show 10 if possible.
                if (photosForPreview.length < previewCount) {
                  photosForPreview = comparisonPhotos.slice(Math.max(0, totalPhotos - previewCount));
                }

                return photosForPreview.map((photo, i) => {
                  const actualIndex = comparisonPhotos.indexOf(photo);
                  const isCurrent = actualIndex === index;
                  const photoIndexInPreview = photosForPreview.indexOf(photo);

                  // The key jumps are relative to the current photo
                  const numberOverlay = photoIndexInPreview < 6 ? photoIndexInPreview : -1;
                  
                  return (
                    <div
                      key={photo.src || i}
                      className={`w-12 h-12 relative rounded-md cursor-pointer ${isCurrent ? 'border-2 border-green-500' : ''}`}
                      onClick={() => setIndex(actualIndex)}
                    >
                      <Image
                        src={getImageViewingPath(photo.src || photo.url)}
                        alt={photo.alt}
                        fill
                        className="object-cover rounded-md"
                        onError={(e) => { e.target.src = 'https://placehold.co/100x100/CCCCCC/white?text=...'; }}
                      />
                      {numberOverlay !== -1 && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center rounded-md">
                          <span className="text-white font-bold text-lg bg-black/70 rounded-full h-6 w-6 flex items-center justify-center">
                            {numberOverlay}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}