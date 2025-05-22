import React, { useState } from "react";
import { motion } from "framer-motion";
import { Grid, Search, MessageCircleQuestion, Send } from "lucide-react";
import NextworkLogo from "../../assets/images/nextwork-Leather-line-logo.svg";
import AvatarImg from "../../assets/images/avatar.jpg";
import { useBottomBar } from "../BottomBarContext";

const NAV_ITEMS = [
  {
    key: "portfolio",
    label: "Portfolio",
    icon: <Grid size={24} className="text-[#57534E]" />,
  },
  {
    key: "projects",
    label: "Projects",
    icon: <Search size={24} className="text-[#57534E]" />,
  },
  {
    key: "ask",
    label: "Ask",
    icon: <Send size={24} className="text-[#57534E]" />,
  },
];

const navStagger = (stagger: boolean) =>
  stagger
    ? {
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
        hidden: { transition: { staggerChildren: 0.08, staggerDirection: -1 } },
      }
    : {
        visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
        hidden: { transition: { staggerChildren: 0, staggerDirection: -1 } },
      };
const navItemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.98,
    transition: { duration: 0.18, ease: "easeIn" },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

interface NavigationBarProps {
  staggerNavIn?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  staggerNavIn = false,
}) => {
  const [activeNav, setActiveNav] = useState("portfolio");
  const { openAsk } = useBottomBar();
  return (
    <motion.div
      className="flex items-center justify-between w-full"
      variants={navStagger(staggerNavIn)}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Left: NextWork Logo */}
      <motion.div
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
        variants={navItemVariants}
      >
        <img
          src={NextworkLogo}
          alt="NextWork logo"
          className="w-8 h-8 object-contain"
        />
      </motion.div>
      {/* Center Navigation Items */}
      <motion.div
        className="flex items-center gap-8 flex-1 justify-center"
        variants={staggerNavIn ? undefined : navItemVariants}
      >
        {NAV_ITEMS.map((item) => (
          <motion.div key={item.key} variants={navItemVariants}>
            <NavItem
              icon={item.icon}
              label={item.label}
              active={activeNav === item.key}
              onClick={() => {
                if (item.key === "ask") {
                  openAsk("");
                } else {
                  setActiveNav(item.key);
                }
              }}
            />
          </motion.div>
        ))}
      </motion.div>
      {/* Profile Avatar (right) */}
      <motion.div
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
        variants={navItemVariants}
      >
        <img
          src={AvatarImg}
          alt="User avatar"
          className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-[0_1.1px_2.2px_-1.1px_rgba(27,25,24,0.06),0_2.2px_3.3px_-0.55px_rgba(27,25,24,0.1)]"
        />
      </motion.div>
    </motion.div>
  );
};

const NavItem = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <motion.button
    className={`flex items-center gap-3 px-2 py-2 rounded min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-black/30 transition-colors duration-150 ${
      active ? "text-black font-bold" : "text-[#57534E] font-medium"
    }`}
    aria-current={active ? "page" : undefined}
    onClick={onClick}
    tabIndex={0}
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.97 }}
  >
    {icon}
    <span className="text-base">{label}</span>
  </motion.button>
);

export default NavigationBar;
