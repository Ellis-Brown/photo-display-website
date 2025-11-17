import { promises as fs } from 'fs';

export default async function MyDataPage() {
  let data = {};
  try {
    const filePath = process.cwd() + '/app/data.json'; // Assuming data.json is in the 'app' directory
    const fileContents = await fs.readFile(filePath, 'utf8');
    data = JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading or parsing file:', error);
  }

  return (
    <div>
      <h1>Data from File:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}