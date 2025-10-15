
import './App.css';
import profileImage from './assets/profile.jpg';

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="name">Sakura Suzuki</h1>
        <nav className="nav">
          <a href="#works">Works</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section id="hero">
          <div className="hero-content">
            <img src={profileImage} alt="プロフィール写真" className="profile-image" />
            <div className="hero-text">
              <h2>はじめまして！</h2>
              <p>Webデザインとフロントエンド開発に興味があります。ユーザーにとって魅力的で使いやすいサイトを作れるようになりたいです。よろしくお願いします！</p>
            </div>
          </div>
        </section>

        <section id="works">
          <h2>Works</h2>
          <div className="works-grid">
            <div className="work-item">
              <img src="https://source.unsplash.com/random/800x600?sig=1" alt="作品1" />
              <h3>プロジェクト 1</h3>
              <p>これはプロジェクトの説明です。</p>
            </div>
            <div className="work-item">
              <img src="https://source.unsplash.com/random/800x600?sig=2" alt="作品2" />
              <h3>プロジェクト 2</h3>
              <p>これはプロジェクトの説明です。</p>
            </div>
            <div className="work-item">
              <img src="https://source.unsplash.com/random/800x600?sig=3" alt="作品3" />
              <h3>プロジェクト 3</h3>
              <p>これはプロジェクトの説明です。</p>
            </div>
            <div className="work-item">
              <img src="https://source.unsplash.com/random/800x600?sig=4" alt="作品4" />
              <h3>プロジェクト 4</h3>
              <p>これはプロジェクトの説明です。</p>
            </div>
          </div>
        </section>

        <section id="about">
          <h2>About</h2>
          <p>ここに自己紹介や経歴などを記述します。</p>
        </section>

        <section id="contact">
          <h2>Contact</h2>
          <p>お問い合わせは、以下のメールアドレスまでお願いします。</p>
          <a href="mailto:example@example.com">example@example.com</a>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Sakura Suzuki</p>
      </footer>
    </div>
  );
}

export default App;
