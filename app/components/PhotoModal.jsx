
'use client'; // This component uses click handlers, so it's a client component

import React, { useEffect } from 'react';
import Image from 'next/image';
import {getImageDownloadPath} from '../utils/utilities';

/**
 * Renders a full-screen modal to preview a single photo.
 * This component is self-contained and manages no state of its own.
 *
 * @param {object} props
 * @param {object | null} props.photo - The photo object to display. If null, the modal is not rendered.
 * @param {string} props.photo.src - The URL of the photo.
 * @param {string} props.photo.alt - The alt text for the photo.
 * @param {Function} props.onClose - The function to call when the modal should be closed.
 */
export default function PhotoModal({ photo, onClose }) {


  const handleDownloadLarge = (path) => {
      const downloadPath = getImageDownloadPath(path);
      if (downloadPath) {
      window.location.href = downloadPath;
      }
      else {
        alert("Download not supported for this image source. Please let ellis know of the error and what you were doing.");
        console.log("Download not supported for this image source." + path );
    }
  }

  // Effect to handle keyboard events for closing the modal
  useEffect(() => {
    // Handler to check for the 'Escape' key
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
// Add event listener when the modal is open
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener when the modal is closed
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]); // Re-run the effect if onClose changes

  // If no photo is selected, don't render anything
  if (!photo) return null;

  return (
    // Full-screen overlay
    // `onClick={onClose}` allows closing the modal by clicking the background
    <div
      className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      {/* Close Button (Top Right) */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-8xl font-bold z-50"
      >
        &times;
      </button>

      {/* Modal Content (Image + Buttons)
        `onClick={(e) => e.stopPropagation()}` is crucial. 
        It stops clicks inside the modal from "bubbling up" 
        to the background overlay and closing the modal.
      */}
      <div
        className="flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Preview */}
        <div className="relative w-[90vw] h-[80vh] mb-4">
          <Image
            // src={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain rounded-lg shadow-2xl"
            onError={(e) => { e.target.src = 'https://placehold.co/600x400/CCCCCC/white?text=Image+Not+Found'; }}
          />
        </div>

        {/* Download Buttons */}
        <div className="bg-white text-gray-800 rounded-lg p-4 flex items-center justify-between shadow-lg w-full max-w-md">
          <span className="text-lg">Right-click the image to save a small version, or download the full resolution file.</span> <br />
          <button
            onClick={() => handleDownloadLarge(photo.src)}
            className="bg-green-600 text-white m-2 px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors mt-4"
          >
            Download Large
          </button>
        </div>
      </div>
    </div>
  );
}