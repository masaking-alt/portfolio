
import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

function Layout() {
  const location = useLocation();

  useEffect(() => {
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
  }, [location]);

  return (
    <div className="container">
      <header className="header">
        <h1 className="name"><Link to="/">まさきんぐ_masaking</Link></h1>
        <nav className="nav">
          <Link to="/#works">Works</Link>
          <Link to="/#about">About</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2025 masaking</p>
      </footer>
    </div>
  );
}

export default Layout;
