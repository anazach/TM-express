import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../style/Navbar.css'
import { FaBars, FaTimes } from 'react-icons/fa'
import { IconContext } from 'react-icons/lib'
import tangyLogo from '../assets/tangyLogo.png'
import SignOutBtn from './SignOutBtn'

function Navbar() {
  const [click, setClick] = useState(false)
  const [button, setButton] = useState(true)
  const handleClick = () => setClick(!click)
  const closeMobileMenu = () => setClick(false)

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false)
    } else {
      setButton(true)
    }
  }

  useEffect(() => {
    showButton()
  }, [])
  window.addEventListener('resize', showButton)

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <nav className='navbar'>
          <div className='navbar-container container'>
            <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
              <img
                src={tangyLogo}
                className='tangy-logo'
                alt='Logo'
              />
              TM Admin Express
            </Link>
            <div className='menu-icon' onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className='nav-item'>
                <Link
                  to='/'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  to='/addasset'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Add asset
                </Link>
              </li>
              <li className='nav-item'>
                <SignOutBtn />
              </li>
            </ul>
          </div>
        </nav>
      </IconContext.Provider>
    </>
  )
}

export default Navbar
