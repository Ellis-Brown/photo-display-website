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

export default async function HomePage() {
  const data = await getData();

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          ellis's photos
        </h1>
        {data?.events && (
          <div className="flex flex-col space-y-4">
            {Object.entries(data.events).map(([eventUrl, eventData]) => (
              <Link
                key={eventUrl}
                href={`/events/${eventUrl}`}
                className="block w-full text-left p-6rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out group hover:bg-blue-50"
              >
                <h2 className="text-2xl font-semibold group-hover:text-blue-600">
                  {eventData.name}
                </h2>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}