'use client';

import { useState, useEffect, useCallback } from 'react';
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
    if (index !== displayIndex) {
      if (window.confirm("You are previewing a different image. Click OK to return to your main selection before dropping.")) {
        setDisplayIndex(index);
      }
      return; // Stop the drop action
    }

    if (comparisonPhotos.length <= 1) {
      handleClose(); // or show a message
      return;
    }

    const droppedPhoto = {
      photo: comparisonPhotos[index],
      originalIndex: index,
    };
    setDroppedPhotos([...droppedPhotos, droppedPhoto]);

    const newPhotos = comparisonPhotos.filter((_, i) => i !== index);
    setComparisonPhotos(newPhotos);

    // Adjust index to show the next photo, or the previous one if it was the last
    const newIndex = index >= newPhotos.length ? newPhotos.length - 1 : index;
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
  const handlePrev = useCallback(() => {
    if (comparisonPhotos.length === 0) return;
    const prevI = (index - 1 + comparisonPhotos.length) % comparisonPhotos.length;
    setIndex(prevI);
    setDisplayIndex(prevI);
  }, [comparisonPhotos, index, setIndex]);

  // Function to go to the next photo
  const handleNext = useCallback(() => {
    if (comparisonPhotos.length === 0) return;
    const nextI = (index + 1) % comparisonPhotos.length;
    setIndex(nextI);
    setDisplayIndex(nextI);
  }, [comparisonPhotos, index, setIndex]);

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
      } else if (event.key >= '0' && event.key <= '9') {
        const jump = parseInt(event.key, 10);
        setDisplayIndex((index + jump) % comparisonPhotos.length);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key >= '0' && event.key <= '9') {
        setDisplayIndex(index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [index, displayIndex, comparisonPhotos, handleNext, handlePrev]);

  
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
          onMouseDown={() => setDisplayIndex((index + 1) % comparisonPhotos.length)}
          onMouseUp={() => setDisplayIndex(index)}
        >
          <div className="w-16 h-16 border-t-4 border-l-4 
          border-white opacity-50 group-hover:opacity-100 transition-opacity m-4 relative">
            <span className="absolute top-1 left-1 text-white text-xl font-bold p-2 opacity-50 group-hover:opacity-100">1</span>
          </div>
        </div>
        <div
          className="absolute top-0 right-0 w-1/2 h-1/2 cursor-pointer group flex justify-end"
          onMouseDown={() => setDisplayIndex((index + 2) % comparisonPhotos.length)}
          onMouseUp={() => setDisplayIndex(index)}
        >
          <div className="w-16 h-16 border-t-4 border-r-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4 relative">
            <span className="absolute top-5 right-5 text-white text-xl font-bold p-2 opacity-90 group-hover:opacity-100">2</span>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 w-1/2 h-1/2 cursor-pointer group flex items-end"
          onMouseDown={() => setDisplayIndex((index + 3) % comparisonPhotos.length)}
          onMouseUp={() => setDisplayIndex(index)}
        >
          <div className="w-16 h-16 border-b-4 border-l-4 border-white opacity-50 group-hover:opacity-100 transition-opacity m-4 relative">
            <span className="absolute bottom-1 left-1 text-white text-xl font-bold p-2 opacity-90 group-hover:opacity-100">3</span>
          </div>
        </div>
        <div
          className="absolute bottom-0 right-0 w-1/2 h-1/2 cursor-pointer group flex justify-end items-end"
          onMouseDown={() => setDisplayIndex((index + 4) % comparisonPhotos.length)}
          onMouseUp={() => setDisplayIndex(index)}
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
            {/* Rolling 20-photo preview */}
            <div className="flex justify-center items-center mt-2 space-x-2">
              {(() => {
                const totalPhotos = comparisonPhotos.length;
                if (totalPhotos <= 1) return null;

                const previewCount = Math.min(20, totalPhotos);
                let start = Math.max(0, index - Math.floor(previewCount / 2));
                let end = start + previewCount;

                if (end > totalPhotos) {
                  end = totalPhotos;
                  start = Math.max(0, end - previewCount);
                }
                
                let photosForPreview = comparisonPhotos.slice(start, end);
                
                // When at the end, the preview window might be smaller than 20.
                // This is to ensure we always try to show  20 if possible.
                if (photosForPreview.length < previewCount) {
                  photosForPreview = comparisonPhotos.slice(Math.max(0, totalPhotos - previewCount));
                }

                return photosForPreview.map((photo, i) => {
                  const actualIndex = comparisonPhotos.indexOf(photo);
                  const isCurrent = actualIndex === index;
                  // const photoIndexInPreview = photosForPreview.indexOf(photo);

                  // The key jumps are relative to the current photo
                  const numberOverlay = actualIndex - index;
                
                  
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
                      {numberOverlay >= 0 && numberOverlay < 10 && ( 
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center rounded-md">
                          <span className="text-white font-bold text-lg bg-bl ack/70 rounded-full h-6 w-6 flex items-center justify-center">
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