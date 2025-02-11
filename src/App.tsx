import "./App.css";
import AnimalSpawner from './components/AnimalSpawner.tsx';


function App() {
  return (
    <div className="animal-page">
      <button>Add Animal</button>

      <div className="animal-wrapper">
        <AnimalSpawner />
      </div>
    </div>
  );
}

export default App;
