import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { works } from './works';
import WorkDetail from './WorkDetail';
import Layout from './Layout';


function Home() {
  return (
    <div>
      <section id="hero">
        <h2>はじめまして！</h2>
        <div className="hero-content">
          <img src="/profile.jpg" alt="プロフィール写真" className="profile-image" />
          <p>ほとんどバイブコーディングでやってます。Webデザインとフロントエンド開発に興味があります。ユーザーにとって魅力的で使いやすいサイトを作れるようになりたいです。よろしくお願いします！</p>
        </div>
      </section>

      <section id="works">
        <h2>Works</h2>
        <div className="works-grid">
          {works.map(work => (
            <div className="work-item" key={work.id}>
              <Link to={`/work/${work.id}`}>
                <img src={work.imageUrl} alt={work.title} />
                {/* <h3>{work.title}</h3> */}
              </Link>
              {/* <p>{work.description}</p> */}
            </div>
          ))}
        </div>
      </section>

      <section id="about">
        <h2>About</h2>
        <p>こんにちは、まさきんぐです。高知大学で情報科学を専攻している大学生です。 バイブコーディングにハマっていて、日々学んだことを形にしています。昔からプログラミングに興味があり、AIを利用することでそのハードルが下がったため、web制作に挑戦しています。JavaScriptでサイトに動きを与えるのが楽しいです。また、このサイトは以下の技術を使って製作しました。</p>
        <ul>
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript (React)</li>
          <li>Vite</li>
          <li>React Router</li>
          <li>ESLint</li>
          <li>Node.js</li>
          <li>npm</li>
        </ul>
        <p>好きなゲームはモンハンで、特に3DSのシリーズが好きです。好きなアーティストはVaundy。アニメ、マンガ、映画を見るのも好きです。</p>
        <p>インスタで日常を上げています。気軽に覗いてみてください。</p>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <p>お問い合わせは、以下のメールアドレスまでお願いします。</p>
        <a href="mailto:banbenjianggui@gmail.com">banbenjianggui@gmail.com</a>
        <div className="social-links">
          <a href="https://www.instagram.com/masa.ki8904?igsh=b3hqMjd6aHdnazJ5" target="_blank" rel="noopener noreferrer"><img width="50" height="50" src="https://img.icons8.com/ios/50/instagram-new--v1.png" alt="instagram-new--v1"/></a>
          <a href="https://x.com/KZOzame1?s=09" target="_blank" rel="noopener noreferrer"><img width="50" height="50" src="https://img.icons8.com/ios/50/twitterx--v1.png" alt="twitterx--v1"/></a>
          <a href="https://bere.al/masaki9876" target="_blank" rel="noopener noreferrer"><img width="50" height="50" src="https://img.icons8.com/ios/50/bereal.png" alt="bereal"/></a>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="work/:id" element={<WorkDetail />} />
      </Route>
    </Routes>
  );
}

export default App;