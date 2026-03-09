import { Link } from 'react-router-dom';
import { works } from './works';
import { Reveal } from './Reveal';
import './WorksSection.css';

function WorksSection() {
  return (
    <div className="works-grid">
      {works.map((work, index) => (
        <Reveal key={work.id} width="100%" delay={0.08 + (index % 4) * 0.05}>
          <article className="works-card">
            <Link to={`/work/${work.id}`} className="works-card-link">
              <div className="works-card-image-wrap">
                <img src={work.imageUrl} alt={work.title} className="works-card-image" />
              </div>

              <div className="works-card-body">
                <h3>{work.title}</h3>
                <div className="works-card-meta">
                  <span className="works-card-category">{work.category}</span>
                  <span className="works-card-stack">{work.technologies[0]}</span>
                </div>
              </div>
            </Link>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export default WorksSection;
