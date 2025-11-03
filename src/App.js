import { Routes, Route } from 'react-router-dom'
import { BrowserRouter } from "react-router-dom";
import Home from './pages/Home'
import Teams from './pages/Teams'
import Schedule from './pages/Schedule'
import News from './pages/News'
import Favorites from './pages/Favorites'
import Contact from './pages/Contact';
import Layout from './layouts/SiteLayout';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/news" element={<News />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Route>
          
      </Routes>
    </BrowserRouter>
  );
}

export default App;
