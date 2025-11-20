import { motion, useScroll } from "framer-motion";
import "./SideDecor.css";

export const SideDecor = () => {
    const { scrollYProgress } = useScroll();

    return (
        <>
            <div className="side-decor-left">
                <div className="side-text">
                    <span>MASAKING PORTFOLIO</span>
                    <span className="separator">///</span>
                    <span>VIBE CODING , FRONTEND &  EXTENSIONS</span>
                </div>
            </div>
            <div className="side-decor-right">
                <motion.div
                    className="scroll-progress"
                    style={{ scaleY: scrollYProgress }}
                />
            </div>
        </>
    );
};
