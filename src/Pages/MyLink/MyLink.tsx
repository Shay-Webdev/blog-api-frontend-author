import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/variables.css";

type myLinkProps = {
  children: React.ReactNode;
  activeColor: string;
  inactiveColor: string;
  activeBGColor: string;
  inactiveBGColor: string;
  To: string;
};
const CustomNavLink = (props: myLinkProps) => {
  const {
    activeColor,
    inactiveColor,
    children,
    To,
    activeBGColor,
    inactiveBGColor,
  } = props;
  return (
    <NavLink
      to={To}
      style={({ isActive }) => ({
        color: isActive ? activeColor : inactiveColor,
        backgroundColor: isActive ? activeBGColor : inactiveBGColor,
        borderTopLeftRadius: "16px",
        borderTopRightRadius:'16px',
        padding: ".5em",
      })}
    >
      {children}
    </NavLink>
  );
};

const MyNavLink = (props: Pick<myLinkProps, "To" | "children">) => {
  const { children, To } = props;
  return (
    <CustomNavLink
      To={To}
      activeColor="var(--glowing-red)"
      inactiveColor="var(--cool-gray)"
      activeBGColor="var(--medium-gray)"
      inactiveBGColor="var(--dark-charcoal)"
    >
      {children}
    </CustomNavLink>
  );
};

export { MyNavLink, CustomNavLink };
