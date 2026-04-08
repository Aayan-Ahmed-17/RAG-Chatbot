import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

function App() {
  const [uploadedPdfs, setUploadedPdfs] = useState<string[]>([]);

  const handleUploadSuccess = (filename: string) => {
    setUploadedPdfs(prev => [...prev, filename]);
  };

  const handleRemoveSuccess = (filename: string) => {
    setUploadedPdfs(prev => prev.filter(name => name !== filename));
  };

  return (
    <div className="layout">
      <Sidebar 
        uploadedPdfs={uploadedPdfs} 
        onUploadSuccess={handleUploadSuccess} 
        onRemoveSuccess={handleRemoveSuccess}
      />
      <ChatWindow isPdfUploaded={uploadedPdfs.length > 0} />
    </div>
  );
}

export default App;
