import Link from "next/link";

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

async function getData(): Promise<Data | null> {
  try {
    const res = await fetch('http://localhost:3000/api/data', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

const EventIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default async function HomePage() {
  const data = await getData();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
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
