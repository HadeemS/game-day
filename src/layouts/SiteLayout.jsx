import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom';

export default function Layout(){
  return (
    <div className="site">
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />
      <Outlet />
      <Footer />
    </div>
  )
}
