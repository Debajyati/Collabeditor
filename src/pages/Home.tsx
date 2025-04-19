import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-8">Collaborative Editor</h1>
      <div className="flex gap-4">
        <Button
          onClick={() => navigate('/rich-text')}
          className="px-6 py-3 text-lg"
        >
          Rich Text Editor
        </Button>
        <Button
          onClick={() => navigate('/code')}
          className="px-6 py-3 text-lg"
        >
          Code Editor
        </Button>
      </div>
    </div>
  );
};

export default Home; 