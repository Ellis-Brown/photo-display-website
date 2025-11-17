import { promises as fs } from 'fs';
import path from 'path';

type Photo = {
  src: string;
  alt: string;
};

type Data = {
  events: {
    [eventName: string]: Photo[];
  };
};

export default async function MyDataPage() {
  let data: Data | null = null;
  try {
    const filePath = path.join(process.cwd(), 'app', 'data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    data = JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading or parsing file:', error);
  }  
  return (
    <div>
      <h1>Data from File:</h1>
      {data?.events && Object.entries(data.events).map(([eventName, photos]) => (
        <div key={eventName}>
          <h2>{eventName}</h2>
          <div>
            {photos.map((photo, index) => (
              <img key={index} src={photo.src} alt={photo.alt} width={200} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
