import './App.css'
import AnimalSpawner from './components/AnimalSpawner.tsx'
import { Subscribe } from '@react-rxjs/core'

function App() {
    return (
        <div className="animal-page">
            <Subscribe>
                <div className="animal-wrapper">
                    <AnimalSpawner />
                </div>
            </Subscribe>
        </div>
    )
}

export default App
