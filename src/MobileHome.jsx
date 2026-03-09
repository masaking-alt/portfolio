import { motion } from 'framer-motion';
import { Reveal } from './Reveal';
import { ParallaxText } from './ParallaxText';
import WorksSection from './WorksSection';
import './MobileHome.css';

function MobileHome() {
    return (
        <div className="mobile-wrapper">
            <section id="hero" className="mobile-hero">
                <div className="bg-text-wrapper">
                    <ParallaxText baseVelocity={-1}>PORTFOLIO</ParallaxText>
                </div>
                <div className="mobile-hero-content">
                    <h1 className="mobile-hero-title">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            style={{ display: "block" }}
                        >
                            Hello,
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            style={{ display: "block" }}
                        >
                            I'm Masaking.
                        </motion.span>
                    </h1>
                    <motion.p
                        className="mobile-hero-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        Vibe Coding & <br />
                        Frontend Developer
                    </motion.p>
                </div>
            </section>

            <section id="works" className="mobile-section">
                <div className="bg-text-wrapper">
                    <ParallaxText baseVelocity={1}>WORKS</ParallaxText>
                </div>
                <WorksSection />
            </section>

            <section id="about" className="mobile-section">
                <div className="bg-text-wrapper">
                    <ParallaxText baseVelocity={-1}>ABOUT</ParallaxText>
                </div>
                <div className="mobile-about-content">
                    <Reveal width="100%">
                        <div className="mobile-about-top">
                            <div className="mobile-about-profile-container">
                                <img src="/profile.jpg" alt="プロフィール写真" className="mobile-about-profile-image" />
                            </div>
                            <p className="mobile-about-lead">
                                高知大学で<br />情報科学を専攻。<br />
                                バイブコーディングに<br />没頭する日々。
                            </p>
                        </div>
                    </Reveal>
                    <div className="mobile-about-text">
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

            <section id="contact" className="mobile-section">
                <div className="bg-text-wrapper">
                    <ParallaxText baseVelocity={1}>CONTACT</ParallaxText>
                </div>
                <div className="mobile-contact-content">
                    <Reveal width="100%">
                        <p>Let's create something together.</p>
                        <a href="mailto:banbenjianggui@gmail.com" className="mobile-email-link">banbenjianggui@gmail.com</a>
                        <div className="mobile-social-links">
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

export default MobileHome;
