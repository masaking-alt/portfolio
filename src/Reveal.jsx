import { useEffect, useRef } from "react";
import { motion as Motion, useInView, useAnimation } from "framer-motion";

export const Reveal = ({ children, width = "fit-content", delay = 0.25, style = {} }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    return (
        <div ref={ref} style={{ position: "relative", width, overflow: "hidden", ...style }}>
            <Motion.div
                variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.5, delay: delay }}
            >
                {children}
            </Motion.div>
        </div>
    );
};
