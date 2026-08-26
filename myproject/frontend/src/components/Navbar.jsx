import './Navbar.css';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar(){
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return(
    <header className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={()=> setMenuOpen(false)}>
          <div className="logo-icon">AI</div>
          <div className="logo-text">
            <h2>InterviewPro</h2>
            <p>AI-Powered Preparation</p>
          </div>
        </Link>

        {/* Links - Desktop + Mobile */}
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className={({isActive})=> isActive ? 'active' : ''} onClick={()=> setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/practice" className={({isActive})=> isActive ? 'active' : ''} onClick={()=> setMenuOpen(false)}>Practice</NavLink>
          <NavLink to="/mock-interview" className={({isActive})=> isActive ? 'active' : ''} onClick={()=> setMenuOpen(false)}>Mock Interview</NavLink>
          <NavLink to="/blog" className={({isActive})=> isActive ? 'active' : ''} onClick={()=> setMenuOpen(false)}>Blog</NavLink>
          
          {/* Mobile only buttons */}
          <div className="mobile-actions">
            <Link to="/login" className="btn-login" onClick={()=> setMenuOpen(false)}>Login</Link>
          <Link to="/register" className="btn-signup" onClick={()=> setMenuOpen(false)}>Sign Up</Link>
          </div>
        </nav>

        {/* Right Side */}
        <div className="nav-actions">
          <Link to="/login" className="btn-login hide-mobile">Login</Link>
          <Link to="/register" className="btn-signup hide-mobile">Sign Up</Link>
          <button className="hamburger" onClick={()=> setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}