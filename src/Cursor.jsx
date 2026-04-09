import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { useMediaQuery } from "./hooks/useMediaQuery";

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

    const variants = {
        default: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            height: 32,
            width: 32,
            backgroundColor: "transparent",
            border: "1px solid white",
        },
        hover: {
            x: mousePosition.x - 24,
            y: mousePosition.y - 24,
            height: 48,
            width: 48,
            backgroundColor: "white",
            border: "1px solid white",
        }
    };

    const dotVariants = {
        default: {
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            opacity: 1,
        },
        hover: {
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            opacity: 0,
        }
    };

    const isMobile = useMediaQuery("(max-width: 768px)");

    if (isMobile) return null;

    return (
        <>
            {/* Main Dot */}
            <Motion.div
                className="cursor-dot"
                variants={dotVariants}
                animate={isHovering ? "hover" : "default"}
                transition={{
                    type: "tween",
                    ease: "backOut",
                    duration: 0.1
                }}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 8,
                    height: 8,
                    backgroundColor: "white",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 9999,
                    mixBlendMode: "difference",
                }}
            />

            {/* Trailing Ring */}
            <Motion.div
                className="cursor-ring"
                variants={variants}
                animate={isHovering ? "hover" : "default"}
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
                    zIndex: 9998,
                    mixBlendMode: "difference",
                }}
            />
        </>
    );
};
