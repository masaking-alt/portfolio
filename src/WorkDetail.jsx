
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { works } from './works';
import './WorkDetail.css';

function WorkDetail() {
  const { id } = useParams();
  useEffect(() => {
    // Force scroll to top using Lenis if available, otherwise use native scroll
    const scrollToTop = () => {
      if (window.lenis) {
        // Use Lenis scrollTo for smooth scroll library compatibility
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        // Fallback to native scroll
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    };

    // Execute immediately and also after a short delay to handle any layout shifts
    scrollToTop();
    const timeoutId = setTimeout(scrollToTop, 10);

    return () => clearTimeout(timeoutId);
  }, [id]);
  const currentWorkIndex = works.findIndex(work => work.id === parseInt(id));
  const work = works[currentWorkIndex];

  if (!work) {
    return <div>Work not found</div>;
  }

  const prevWork = currentWorkIndex > 0 ? works[currentWorkIndex - 1] : null;
  const nextWork = currentWorkIndex < works.length - 1 ? works[currentWorkIndex + 1] : null;

  return (
    <div className="work-detail-container">
      <div className="work-content">
        <a href={work.externalUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={work.imageUrl}
            alt={work.title}
            className="work-detail-image"
          />
        </a>
        <a href={work.externalUrl} target="_blank" rel="noopener noreferrer" className="title-link">
          <h1>{work.title}</h1>
        </a>
        <p>{work.description}</p>

        <h3>使用技術</h3>
        <div className="technologies">
          {work.technologies && work.technologies.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>

      {prevWork && (
        <Link to={`/work/${prevWork.id}`} className="nav-area nav-area-prev" aria-label="前の作品">
          <span className="nav-arrow">←</span>
        </Link>
      )}

      {nextWork && (
        <Link to={`/work/${nextWork.id}`} className="nav-area nav-area-next" aria-label="次の作品">
          <span className="nav-arrow">→</span>
        </Link>
      )}

      <div className="mobile-nav-bar">
        {prevWork ? (
          <Link to={`/work/${prevWork.id}`} className="mobile-nav-item">
            ← PREV
          </Link>
        ) : (
          <span className="mobile-nav-item disabled">← PREV</span>
        )}
        <div className="mobile-nav-divider"></div>
        {nextWork ? (
          <Link to={`/work/${nextWork.id}`} className="mobile-nav-item">
            NEXT →
          </Link>
        ) : (
          <span className="mobile-nav-item disabled">NEXT →</span>
        )}
      </div>
    </div>
  );
}

export default WorkDetail;
