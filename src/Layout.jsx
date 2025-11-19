import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Cursor } from './Cursor';
import { SideDecor } from './SideDecor';

function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Lenis Initialization
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Existing Smooth Scroll Logic for Hash Links
    const smoothScrollTo = (element, duration) => {
      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      requestAnimationFrame(animation);
    };

    if (location.hash) {
      const targetElement = document.getElementById(location.hash.substring(1));
      if (targetElement) {
        setTimeout(() => smoothScrollTo(targetElement, 800), 100);
      }
    }

    return () => {
      lenis.destroy();
    };
  }, [location]);

  return (
    <div className="container">
      <Cursor />
      <SideDecor />
      <header className="header">
        <h1 className="name"><Link to="/">まさきんぐ_masaking</Link></h1>
        <nav className="nav">
          <Link to="/#hero">Top</Link>
          <Link to="/#works">Works</Link>
          <Link to="/#about">About</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; masaking</p>
      </footer>
    </div>
  );
}

export default Layout;
