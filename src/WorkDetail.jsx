
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { works } from './works';
import './WorkDetail.css';

function WorkDetail() {
  const { id } = useParams();

  useEffect(() => {
    const scrollToTop = () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    };

    scrollToTop();
    const timeoutId = setTimeout(scrollToTop, 10);

    return () => clearTimeout(timeoutId);
  }, [id]);

  const currentWorkIndex = works.findIndex((work) => work.id === id);
  const work = works[currentWorkIndex];

  if (!work) {
    return <div>Work not found</div>;
  }

  const prevWork = currentWorkIndex > 0 ? works[currentWorkIndex - 1] : null;
  const nextWork = currentWorkIndex < works.length - 1 ? works[currentWorkIndex + 1] : null;
  const hasExternalUrl = Boolean(work.externalUrl);

  const imageElement = (
    <img
      src={work.imageUrl}
      alt={work.title}
      className="work-detail-image"
    />
  );

  const titleElement = <h1>{work.title}</h1>;

  return (
    <div className="work-detail-container">
      <div className="work-content">
        {hasExternalUrl ? (
          <a href={work.externalUrl} target="_blank" rel="noopener noreferrer">
            {imageElement}
          </a>
        ) : (
          imageElement
        )}
        {hasExternalUrl ? (
          <a href={work.externalUrl} target="_blank" rel="noopener noreferrer" className="title-link">
            {titleElement}
          </a>
        ) : (
          titleElement
        )}
        <p>{work.description}</p>

        <h3>使用技術等</h3>
        <div className="technologies">
          {work.technologies && work.technologies.map((tech) => (
            <span key={tech} className="tech-tag">{tech}</span>
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
