
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { works } from './works';
import './WorkDetail.css';

function WorkDetail() {
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
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
          <picture>
            <source media="(max-width: 768px)" srcSet={work.imageUrl_sp} />
            <img
              src={work.imageUrl}
              alt={work.title}
              className={`work-detail-image${work.imageVariant === "icon" ? " work-detail-image--icon" : ""}`}
            />
          </picture>
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
    </div>
  );
}

export default WorkDetail;
