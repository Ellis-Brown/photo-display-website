'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PhotoModal from '../../components/PhotoModal';
import PhotoComparisonModal from '../../components/PhotoComparisonModal'; // Import
import { getImageViewingPath } from '../../utils/utilities';
import ImageWithFallback from '../../components/ImageWithFallback';

type Photo = {
  src: string;
  alt: string;
};

type EventData = {
  photos: Photo[];
  name: string;
};

type Data = {
  events: {
    [eventUrl: string]: EventData;
  };
};

function useEventData(occasionId: string | string[] | undefined) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!occasionId) return;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const data: Data = await response.json();
        setEvent(data.events[occasionId as string] || null);
      } catch (err) {
        setError('Failed to load event data.' + err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [occasionId]);

  return { event, loading, error };
}

/**
 * This is the Occasion Page (Dynamic Route)
 */
export default function OccasionPage() {
  const params = useParams();
  const occasionId = params.occasion;
  const { event, loading, error } = useEventData(occasionId);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [secondaryIndex, setSecondaryIndex] = useState(0); // New state
  const [inSelectionMode, setInSelectionMode] = useState(false);

  // --- Modal Handlers ---
  const handlePhotoClick = (photo, index) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
    if (inSelectionMode) {
        setSecondaryIndex((index + 1) % event.photos.length);
    }
  };
  const handleCloseModal = () => {
    setSelectedPhoto(null);
    setSelectedIndex(-1);
  };

  // --- Keyboard Navigation ---
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedPhoto || !event) return;

    if (inSelectionMode) {
      if (e.key === "ArrowRight") {
        setSecondaryIndex((prev) => (prev + 1) % event.photos.length);
      } else if (e.key === "ArrowLeft") {
        setSecondaryIndex((prev) => (prev - 1 + event.photos.length) % event.photos.length);
      }
    } else {
      let newIndex;
      if (e.key === "ArrowRight") {
        newIndex = (selectedIndex + 1) % event.photos.length;
      } else if (e.key === "ArrowLeft") {
        newIndex = (selectedIndex - 1 + event.photos.length) % event.photos.length;
      }
      if (newIndex !== undefined) {
        setSelectedIndex(newIndex);
        setSelectedPhoto(event.photos[newIndex]);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, selectedPhoto, inSelectionMode, event]);


  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  // Handle cases where the occasion doesn't exist
  if (!event) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-red-600">Occasion not found.</h1>
        <a href="/" className="text-blue-600 hover:underline">
          &larr; Back to all occasions
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-white">
      {/* --- Header with Back Button --- */}
      <div className="flex items-center mb-6 gap-6">
        <div>
          <Link
            href="/"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            &larr; Back to Occasions
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 ml-6">
            {event.name}
          </h1>
        </div>
      </div>
      <div>
        {/* Add a button to toggle on comparison mode */}
        <button
          className={`mb-4 px-4 py-2 rounded-lg transition-colors ${
            inSelectionMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setInSelectionMode(!inSelectionMode)}
        >
          {inSelectionMode ? 'Exit Comparison Mode' : 'Enter Comparison Mode'}
        </button>
      </div>

      {/* --- Photo Collage --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {event.photos.map((image, index) => (
          <div
            key={image.src}
            className="rounded-lg shadow-md overflow-hidden"
          >
            <ImageWithFallback
              src={getImageViewingPath(image.src)}
              alt={image.alt}
              width={900}
              height={900}
              onClick={() => handlePhotoClick(image, index)}
              className="w-full h-auto object-cover cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
              fallbackSrc={'https://placehold.co/600x400/CCAABB/white?text=Image+Not+Found'}
            />
          </div>
        ))}
      </div>

      {/* --- Render the Modals --- */}
      {selectedPhoto && !inSelectionMode && (
        <PhotoModal photo={selectedPhoto} onClose={handleCloseModal} />
      )}
      {selectedPhoto && inSelectionMode && (
        <PhotoComparisonModal
          photo={selectedPhoto}
          photos={event.photos}
          index={selectedIndex}
          secondaryIndex={secondaryIndex}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}