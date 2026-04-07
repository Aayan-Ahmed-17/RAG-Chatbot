import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

function App() {
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);

  return (
    <div className="layout">
      <Sidebar onUploadSuccess={() => setIsPdfUploaded(true)} />
      <ChatWindow isPdfUploaded={isPdfUploaded} />
    </div>
  );
}

export default App;
