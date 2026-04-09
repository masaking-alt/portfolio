import { motion as Motion, useScroll } from "framer-motion";
import "./SideDecor.css";

export const SideDecor = () => {
    const { scrollYProgress } = useScroll();

    return (
        <>
            <div className="side-decor-left">
                <div className="side-text">
                    <span>MASAKING PORTFOLIO</span>
                    <span className="separator">///</span>
                    <span>AI-Native Full-Stack Developer</span>
                </div>
            </div>
            <div className="side-decor-right">
                <Motion.div
                    className="scroll-progress"
                    style={{ scaleY: scrollYProgress }}
                />
            </div>
        </>
    );
};
