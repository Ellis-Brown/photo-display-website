// import Link from 'next/link'; // Removed to fix preview error

import Link from "next/link";

// --- Type Definitions ---
interface OccasionData {
  title: string;
  // In a real app, you would also have: images: { id: string; src: string; alt: string }[];
}

type PhotoData = Record<string, OccasionData>;

// --- Mock Data ---
// In a real Next.js app, you'd fetch this from a database or CMS.
// We define it here so we can generate the list of occasions.
const photoData: PhotoData = {
  'november-5th': {
    title: 'November 5th Photo Day',
  },
  'christmas-2024': {
    title: 'Christmas 2024',
  },
  'summer-vacation': {
    title: 'Summer Vacation',
  },
};

// Generate a list of occasions from the data
const occasions = (Object.keys(photoData) as Array<keyof typeof photoData>).map(id => ({
  id: id,
  title: photoData[id].title,
}));

/**
 * This is the Home Page for your Next.js application.
 * It corresponds to the route "/"
 */
export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        ellis's photos
      </h1>
      <div className="flex flex-col space-y-4">
        {occasions.map((occasion) => (
          // In a REAL Next.js app, this should be the <Link> component.
          // We are using <a> here only to make the preview work,
          // as this environment doesn't run the full Next.js framework.
          <Link
            key={occasion.id}
            href={`/events/${occasion.id}`} // This creates links like /november-5th
            className="block w-full text-left p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out group hover:bg-blue-50"
            // Prevent default since we're in a simulation
            // onClick={(e) => e.preventDefault()} 
          >
            <h2 className="text-2xl font-semibold text-gray-700 group-hover:text-blue-600">
              {occasion.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}