
import { useParams, Link } from 'react-router-dom';
import { works } from './works';
import './WorkDetail.css';

function WorkDetail() {
  const { id } = useParams();
  const currentWorkIndex = works.findIndex(work => work.id === parseInt(id));
  const work = works[currentWorkIndex];

  if (!work) {
    return <div>Work not found</div>;
  }

  const prevWork = currentWorkIndex > 0 ? works[currentWorkIndex - 1] : null;
  const nextWork = currentWorkIndex < works.length - 1 ? works[currentWorkIndex + 1] : null;

  return (
    <div className="work-detail-container">
      <a href={work.externalUrl} target="_blank" rel="noopener noreferrer">
        <img src={work.imageUrl} alt={work.title} className="work-detail-image" />
      </a>
      <a href={work.externalUrl} target="_blank" rel="noopener noreferrer" className="title-link">
        <h1>{work.title}</h1>
      </a>
      <p>{work.description}</p>

      <div className="navigation-buttons">
        {prevWork && <Link to={`/work/${prevWork.id}`} className="nav-link">前へ</Link>}
        {nextWork && <Link to={`/work/${nextWork.id}`} className="nav-link">次へ</Link>}
      </div>
    </div>
  );
}

export default WorkDetail;
