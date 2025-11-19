import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Cursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const mouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === "A" || e.target.tagName === "BUTTON" || e.target.closest("a") || e.target.closest("button")) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    return (
        <motion.div
            className="custom-cursor"
            animate={{
                x: mousePosition.x - (isHovering ? 20 : 10),
                y: mousePosition.y - (isHovering ? 20 : 10),
                width: isHovering ? 40 : 20,
                height: isHovering ? 40 : 20,
                backgroundColor: isHovering ? "white" : "black",
                mixBlendMode: isHovering ? "difference" : "normal",
            }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
                mass: 0.5,
            }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                borderRadius: "50%",
                pointerEvents: "none",
                zIndex: 9999,
                mixBlendMode: "difference",
                backgroundColor: "white"
            }}
        />
    );
};
