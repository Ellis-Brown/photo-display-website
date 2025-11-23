
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const LoadProgress = () => {
  const router = useRouter();

  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedData = JSON.parse(e.target.result as string);
        if (!loadedData.occasionId || !loadedData.droppedPhotos || !loadedData.selectedPhotos) {
          alert("Invalid save file.");
          return;
        }

        // Store the loaded data in sessionStorage to be retrieved by the occasion page
        sessionStorage.setItem('progressData', JSON.stringify(loadedData));

        // Redirect to the occasion page
        router.push(`/events/${loadedData.occasionId}`);

      } catch (error) {
        console.error("Failed to load or parse file:", error);
        alert("Failed to load save file. It might be corrupted.");
      }
    };
    reader.readAsText(file);
    // Reset file input so the same file can be loaded again
    event.target.value = null;
  };

  return (
    <label className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
      Load Progress
      <input type="file" accept=".txt" onChange={handleLoad} style={{ display: 'none' }} />
    </label>
  );
};

export default LoadProgress;
