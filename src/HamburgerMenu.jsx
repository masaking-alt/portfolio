import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './HamburgerMenu.css';

export const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuVariants = {
        closed: {
            opacity: 0,
            x: "100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        }
    };

    const linkVariants = {
        closed: { opacity: 0, y: 20 },
        open: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1 + 0.2,
                duration: 0.5
            }
        })
    };

    return (
        <>
            <button
                className={`hamburger-button ${isOpen ? 'open' : ''}`}
                onClick={toggleMenu}
                aria-label="Menu"
            >
                <span className="bar"></span>
                <span className="bar"></span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="mobile-menu-overlay"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <nav className="mobile-nav">
                            {['Top', 'Works', 'About', 'Contact'].map((item, i) => (
                                <motion.div
                                    key={item}
                                    custom={i}
                                    variants={linkVariants}
                                >
                                    <Link
                                        to={`/#${item.toLowerCase() === 'top' ? 'hero' : item.toLowerCase()}`}
                                        onClick={toggleMenu}
                                        className="mobile-nav-link"
                                    >
                                        {item}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
