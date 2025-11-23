'use client';
import { useState, useEffect } from 'react';

type Photo = {
  src: string;
  alt: string;
};

type EventData = {
  photos: Photo[];
  name: string;
};

type AllEventsData = {
  events: {
    [eventUrl: string]: EventData;
  };
};

export function useEventData(occasion: string) {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (!occasion) return;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const allData: AllEventsData = await response.json();
        if (allData.events && allData.events[occasion]) {
          setPhotos(allData.events[occasion].photos);
        } else {
          // Handle case where occasion is not found
          setPhotos([]);
        }
      } catch (error) {
        console.error("Failed to load event photos:", error);
        setPhotos([]);
      }
    };

    fetchData();
  }, [occasion]);

  return photos;
}
