import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Avatar } from "@nextui-org/react";

import avatar from "../../assets/images.png";
import { openModal } from "../../features/logoutModal/logoutModalSlice";
import Menu from "./Menu";

const TopBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAvatarClick = () => {
    navigate("/dashboard/settings"); // Now avatar navigates to settings
  };

  return (
    <div className="w-full h-[10vh] flex justify-between items-center px-8 py-2 border-b-1 border-secondary">
      {/* Hamburger menu for small screens */}
      <div className="block xl:hidden">
        <Menu />
      </div>

      {/* Removed Contact Me section */}

      <div className="flex justify-center items-center space-x-4 ml-auto">
        {/* Avatar now acts as Settings navigation */}
        <Avatar
          src={avatar}
          name="Avatar"
          size="md"
          isBordered
          color="secondary"
          showFallback
          className="cursor-pointer"
          onClick={handleAvatarClick}
        />
      </div>
    </div>
  );
};

export default TopBar;
