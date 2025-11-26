import './App.css'
import Home from './features/Home/Home.jsx'
import Subreddits from './features/Subreddits/Subreddits.jsx'

function App() {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
      <div>
        <Home />
      </div>
      <div style={{ flex: 1, maxWidth: '260px'}}>
        <Subreddits />
      </div>
    </div>
  );
}

export default App
