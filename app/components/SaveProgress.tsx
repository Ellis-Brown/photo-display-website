
import React from 'react';

const SaveProgress = ({ occasionId, droppedPhotos, selectedPhotos }) => {
  const handleSave = () => {
    const saveData = {
      occasionId,
      droppedPhotos: droppedPhotos.map(p => p.src),
      selectedPhotos: selectedPhotos.map(p => p.src),
    };

    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `progress-${occasionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
      <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save Progress
      </button>
    </div>
  );
};

export default SaveProgress;
