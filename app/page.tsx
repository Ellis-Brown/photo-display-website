'use client';
import Link from "next/link";
import React, { useState, useEffect } from 'react';

type Photo = {
  src: string;
  alt: string;
};

type Data = {
  events: {
    [eventUrl: string]: {
      photos: Photo[];
      name: string;
    };
  };
};

function useEventsData() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const jsonData: Data = await response.json();
        setData(jsonData);
      } catch (err) {
        setError('Failed to load event data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  return { data, loading, error };
}


const EventIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default function HomePage() {
  const { data, loading, error } = useEventsData();
  
  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Ellis's photography events and photos
        </h1>
        {data?.events && (
          <div className="flex flex-col space-y-4">
            {Object.entries(data.events).map(([eventUrl, eventData]) => (
              <Link
                key={eventUrl}
                href={`/events/${eventUrl}`}
                className="block w-full text-left p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out group hover:bg-blue-100 bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <EventIcon />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-700 group-hover:text-blue-600">
                      {eventData.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
