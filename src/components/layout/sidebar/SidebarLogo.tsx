import Image from "next/image";
import React from "react";
import { NAVIGATION } from "../../../constants";
import { sidebarStyles } from "../../../styles/components";

interface SidebarLogoProps {
  isCollapsed: boolean;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ isCollapsed }) => {
  return (
    <div className="flex items-center justify-center">
      {!isCollapsed ? (
        <div className="flex items-center space-x-3">
          <Image
            src={NAVIGATION.LOGO_PATH}
            alt={NAVIGATION.LOGO_ALT}
            width={sidebarStyles.logo.size}
            height={sidebarStyles.logo.size}
            className="object-contain"
            priority
          />
          <span className="font-semibold text-black-800 dark:text-amber-300 logo-text truncate text-2xl leading-12 font-pacifico">
            {NAVIGATION.APP_NAME}
          </span>
        </div>
      ) : (
        <Image
          src={NAVIGATION.LOGO_PATH}
          alt={NAVIGATION.LOGO_ALT}
          width={sidebarStyles.logo.size}
          height={sidebarStyles.logo.size}
          className="object-contain"
          priority
        />
      )}
    </div>
  );
};

export default SidebarLogo;
