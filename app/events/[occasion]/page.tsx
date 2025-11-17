'use client';

// import Link from 'next/link';
import React, { useState } from 'react';
import PhotoModal from '../../components/PhotoModal';
import ImageWithFallback from '../../components/ImageWithFallback';
import Image from 'next/image';

// 1. IMPORT the hook from next/navigation
import { useParams } from 'next/navigation';
import Link from 'next/link';

// --- Mock Data ---
// (Mock data remains the same)
const photoData = {
  'november-5th': {
    title: 'November 5th Photo Day',
    images: [
      {  src: 'https://lh3.googleusercontent.com/d/1N1a33GB8EHWgftnhw2FQ6pIIp-LpKRTS', alt : 'LINDA'},
      { src: 'https://lh3.googleusercontent.com/d/17JdcizTnqmbKlAges1zosp-6dAcXEz5K', alt: 'Alison for testing'},
      {  src: 'https://placehold.co/something', alt: 'A tall portrait' },
      // ... other images
    ],
  },
  'christmas-2024': {
    title: 'Christmas 2024',
    images: [
      { id: 'c1', src: 'https://placehold.co/600x400/E74C3C/white?text=Christmas+1', alt: 'Family by the tree' },
      // ... other images
    ],
  },
  'summer-vacation': {
    title: 'Summer Vacation',
    images: [
      { id: 's1', src: 'https://placehold.co/800x400/1ABC9C/white?text=Beach+1', alt: 'Beach sunset' },
      // ... other images
    ],
  },
};

/**
 * This is the Occasion Page (Dynamic Route)
 */
// 2. REMOVE the `params` prop from the function signature
export default function OccasionPage() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // 3. CALL the hook to get the params object
  const params = useParams();

  // Get the occasion ID from the URL params
  // This line now works correctly
  const occasionId = params.occasion;
  const occasion = photoData[occasionId];

  // --- Modal Handlers ---
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };


  // ... (the rest of your component's JSX remains exactly the same)
  
  // Handle cases where the occasion doesn't exist
  if (!occasion) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-red-600">Occasion not found.</h1>
        <a href="/" className="text-blue-600 hover:underline" onClick={(e) => e.preventDefault()}>
          &larr; Back to all occasions
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* --- Header with Back Button --- */}
      <div className="flex items-center mb-6">
        <Link
          href="/"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          // onClick={(e) => e.preventDefault()}
        >
          &larr; Back to Occasions
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 ml-6">
          {occasion.title}
        </h1>
      </div>

      {/* --- Photo Collage --- */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {occasion.images.map((image) => (
          <div
            key={image.src}
            className="mb-4 break-inside-avoid rounded-lg shadow-md overflow-hidden"
            
          >
            <ImageWithFallback
              src={image.src}
              alt={image.alt}
              width={900}
              height={900}
              onClick={() => handlePhotoClick(image)}
              className="w-full h-auto object-cover cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
              fallbackSrc={'https://placehold.co/600x400/CCAABB/white?text=Image+Not+Found'}
            />
          </div>
        ))}
      </div>

      {/* --- Render the Modal --- */}
      <PhotoModal photo={selectedPhoto} onClose={handleCloseModal} />
    </div>
  );
}