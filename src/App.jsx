import './App.css'
import Header from './features/Header/Header.jsx'
import Home from './features/Home/Home.jsx'
import Subreddits from './features/Subreddits/Subreddits.jsx'

function App() {
  return (
    <div>
      <Header />
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', justifyContent: 'center'}}>
        <div>
          <Home />
        </div>
        <div style={{ flex: 1, maxWidth: '260px'}}>
          <Subreddits />
        </div>
      </div>
    </div>
  );
}

export default App
