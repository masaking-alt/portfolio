import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';
import { works } from './works';
import WorkDetail from './WorkDetail';
import Layout from './Layout';
import { Reveal } from './Reveal';
import { ParallaxText } from './ParallaxText';


function Home() {
  return (
    <div className="main-wrapper">
      <section id="hero" className="fullscreen-section">
        <div className="bg-text-wrapper">
          <ParallaxText baseVelocity={-2}>PORTFOLIO</ParallaxText>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ display: "block" }}
            >
              Hello,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ display: "block" }}
            >
              I'm Masaking.
            </motion.span>
          </h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Vibe Coding & <br />
            Frontend Developer
          </motion.p>
        </div>
      </section>

      <section id="works">
        <div className="bg-text-wrapper">
          <ParallaxText baseVelocity={2}>WORKS</ParallaxText>
        </div>
        <div className="works-container">
          {works.map((work, index) => (
            <Reveal key={work.id} width="100%" delay={index % 2 === 0 ? 0.2 : 0.4}>
              <div className={`work-item work-item-${index + 1}`}>
                <Link to={`/work/${work.id}`} className="work-link">
                  <div className={`work-image${work.imageVariant === "icon" ? " work-image--icon" : ""}`}>
                    <picture>
                      <source media="(max-width: 768px)" srcSet={work.imageUrl_sp} />
                      <img src={work.imageUrl} alt={work.title} />
                    </picture>
                  </div>
                  <div className="work-info">
                    <span className="work-number">{(index + 1).toString().padStart(2, '0')}</span>
                    <h3>{work.title}</h3>
                    <span className="view-project">View Project &rarr;</span>
                  </div>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="about">
        <div className="bg-text-wrapper">
          <ParallaxText baseVelocity={-2}>ABOUT</ParallaxText>
        </div>
        <div className="about-content">
          <Reveal width="100%">
            <div className="about-top">
              <div className="about-profile-container">
                <img src="/profile.jpg" alt="プロフィール写真" className="about-profile-image" />
              </div>
              <p className="about-lead">
                高知大学で情報科学を専攻。<br />
                バイブコーディングに没頭する日々。
              </p>
            </div>
          </Reveal>
          <div className="about-text">
            <Reveal delay={0.3}>
              <p>昔からプログラミングに興味があり、AIを利用することでそのハードルが下がったため、web制作に挑戦しています。ユーザーにとって魅力的で使いやすいサイトを作れるようになりたいです。</p>
            </Reveal>
            <Reveal delay={0.4}>
              <p>好きなゲームはモンハンで、特に3DSのシリーズが好きです。好きなアーティストはVaundy。アニメ、マンガ、映画を見るのも好きです。</p>
            </Reveal>
          </div>
          <Reveal delay={0.5}>
            <div className="technologies-header">
              <h3>Built with</h3>
              <p>このサイトは以下の技術を使用して制作しました</p>
            </div>
            <div className="technologies">
              {[
                "HTML", "CSS", "JavaScript (React)", "Vite",
                "React Router", "ESLint", "Node.js", "npm",
              ].map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="contact">
        <div className="bg-text-wrapper">
          <ParallaxText baseVelocity={2}>CONTACT</ParallaxText>
        </div>
        <div className="contact-content">
          <Reveal width="100%">
            <p>Let's create something together.</p>
            <a href="mailto:banbenjianggui@gmail.com" className="email-link">banbenjianggui@gmail.com</a>
            <div className="social-links">
              <a href="https://www.instagram.com/masa.ki8904?igsh=b3hqMjd6aHdnazJ5" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://x.com/KZOzame1?s=09" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
              <a href="https://bere.al/masaki9876" target="_blank" rel="noopener noreferrer">BeReal</a>
            </div>
          </Reveal>
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
