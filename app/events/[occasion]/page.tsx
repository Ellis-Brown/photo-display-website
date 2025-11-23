'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PhotoModal from '../../components/PhotoModal';
import PhotoComparisonModal from '../../components/PhotoComparisonModal'; // Import
import { getImageViewingPath, getImageDownloadPath, getImageDownloadUrl } from '../../utils/utilities';
import ImageWithFallback from '../../components/ImageWithFallback';
import SaveProgress from '../../components/SaveProgress';

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
  const [inSelectionMode, setInSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);
  const [comparisonPhotos, setComparisonPhotos] = useState<Photo[]>([]);
  const [droppedPhotos, setDroppedPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (event) {
      const savedProgress = sessionStorage.getItem('progressData');
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        if (progressData.occasionId === occasionId) {
          const loadedDroppedPhotos = event.photos.filter(p => progressData.droppedPhotos.includes(p.src));
          const loadedSelectedPhotos = event.photos.filter(p => progressData.selectedPhotos.includes(p.src));
          setDroppedPhotos(loadedDroppedPhotos);
          setSelectedPhotos(loadedSelectedPhotos);
          setInSelectionMode(true);
        }
        sessionStorage.removeItem('progressData');
      }
    }
  }, [event, occasionId]);

  const handleComparisonEnd = (newlyDroppedPhotos: Photo[]) => {
    setDroppedPhotos([...droppedPhotos, ...newlyDroppedPhotos]);
    setSelectedPhotos(selectedPhotos.filter(p => !newlyDroppedPhotos.some(dp => dp.src === p.src)));
  };

  // --- Modal Handlers ---
  const handlePhotoClick = (photo: Photo, index: number) => {
    const isDropped = droppedPhotos.find((p) => p.src === photo.src);

    if (inSelectionMode) {
      if (isDropped) {
        // If it's dropped, un-drop it. Then proceed to select it.
        setDroppedPhotos(droppedPhotos.filter((p) => p.src !== photo.src));
      }

      // Toggle selection
      if (selectedPhotos.find((p) => p.src === photo.src)) {
        setSelectedPhotos(selectedPhotos.filter((p) => p.src !== photo.src));
      } else {
        setSelectedPhotos([...selectedPhotos, photo]);
      }
    } else {
      if (isDropped) {
        // If not in selection mode, clicking a dropped photo should enter selection mode and select it.
        setInSelectionMode(true);
        setDroppedPhotos(droppedPhotos.filter((p) => p.src !== photo.src));
        setSelectedPhotos([photo]);
      } else {
        // Original behavior: open modal for a single photo
        setSelectedPhoto(photo);
        setSelectedIndex(index);
        setComparisonPhotos(event?.photos || []);
      }
    }
  };
  const handleCloseModal = () => {
    setSelectedPhoto(null);
    setSelectedIndex(-1);
  };

  // --- Keyboard Navigation ---
  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedIndex === -1 || !event) return;

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
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, event]);


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
      <SaveProgress
        occasionId={occasionId}
        droppedPhotos={droppedPhotos}
        selectedPhotos={selectedPhotos}
      />
      {/* --- Header with Back Button --- */}
      <div className="flex items-center mb-6 gap-6">
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
          {inSelectionMode ? 'Exit Select & Compare Mode' : 'Enter Select & Compare Mode'}
        </button>
        {inSelectionMode && (
          <div className="flex gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPhotos.length > 1
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              onClick={() => {
                if (selectedPhotos.length > 1) {
                  setComparisonPhotos(selectedPhotos);
                  setSelectedIndex(0);
                  setSelectedPhoto(selectedPhotos[0]);
                }
              }}
              disabled={selectedPhotos.length < 2}
            >
              Begin Comparison ({selectedPhotos.length})
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                setSelectedPhotos([]);
              }}
            >
              Clear Selection
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => setSelectedPhotos(event?.photos || [])}
            >
              Select All
            </button>
            {selectedPhotos.length > 0 && (
                <button
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => {
                    const downloadUrls = selectedPhotos.map(p => `<a href="${getImageDownloadUrl(p.src)}">${getImageDownloadUrl(p.src)}</a>`).join('<br />');
                    const previewUrls =  selectedPhotos.map(p => `<a href="${getImageViewingPath(p.src)}">${getImageViewingPath(p.src)}</a>`).join('<br />');
                    const imagesHtml = selectedPhotos.map(p => `<img src="${getImageViewingPath(p.src)}" style="max-width: 100px; max-height: 100px; display: inline-block; margin: 5px;" />`).join('');

                    const newWindow = window.open();
                    if (newWindow) {
                      const newPageContent = `
                        <html>
                          <head><title>Selected Photos</title></head>
                          <body>
                            <h1>Download URLs</h1>
                            <div id="download-urls">${downloadUrls}</div>
                            <h1>Preview URLs</h1>
                            <div>${previewUrls}</div>
                            <h1>Image Previews</h1>
                            <div>${imagesHtml}</div>
                            <hr />
                            <script>
                              function downloadPage() {
                                const htmlContent = document.documentElement.outerHTML;
                                const blob = new Blob([htmlContent], { type: 'text/html' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = '${occasionId || 'event'}.html';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                              }

                              function downloadAllSelected() {
                                const urls = Array.from(document.getElementById('download-urls').getElementsByTagName('a')).map(a => a.href);
                                urls.forEach((url, index) => {
                                  if (url) {
                                    setTimeout(() => {
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.target = '_blank';
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                    }, index * 1000);
                                  }
                                });
                              }
                            </script>
                            <button onclick="downloadPage()">Download This HTML page and share</button>
                            <button onclick="downloadAllSelected()">Download large image files</button>
                          </body>
                        </html>
                      `;
                      newWindow.document.write(newPageContent);
                      newWindow.document.close();
                    }
                  }}
                >
                  Export Selected URLs
                </button>
            )}
          </div>
        )}
      </div>
      
        <div className="bg-blue-100 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <p>
            Use <strong>left</strong>, <strong>right</strong>, and number keys (<strong>1-9</strong>) for image selection. Press <strong>escape</strong> to leave.
          </p>
        </div>
      

      {/* --- Photo Collage --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {event.photos.map((image, index) => {
          const isDropped = droppedPhotos.find((p) => p.src === image.src);
          const isSelected = selectedPhotos.find((p) => p.src === image.src);

          return (
            <div
              key={image.src}
              className={`rounded-lg shadow-md overflow-hidden transition-all duration-200 ${
                inSelectionMode && isSelected ? 'ring-4 ring-blue-500 scale-95' : ''
              } ${inSelectionMode && isDropped ? 'filter grayscale cursor-not-allowed' : ''}`}
            >
              <ImageWithFallback
                src={getImageViewingPath(image.src)}
                alt={image.alt}
                width={900}
                height={900}
                onClick={() => handlePhotoClick(image, index)}
                className={`w-full h-auto object-cover ${
                  isDropped ? '' : 'cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out'
                }`}
                fallbackSrc={'https://placehold.co/600x400/CCAABB/white?text=Image+Not+Found'}
              />
            </div>
          );
        })}
      </div>

      {selectedPhoto && (
        <PhotoComparisonModal
          photos={comparisonPhotos}
          index={selectedIndex}
          setIndex={setSelectedIndex}
          onClose={handleCloseModal}
          selectedComparison={inSelectionMode}
          onComparisonEnd={handleComparisonEnd}
        />
      )}
    </div>
  );
}