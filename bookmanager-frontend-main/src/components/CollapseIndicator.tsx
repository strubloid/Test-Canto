import React from "react";
import "./CollapseIndicator.css";

type CollapseIndicatorProps = {
    isOpen: boolean;
};

const CollapseIndicator = ({ isOpen }: CollapseIndicatorProps) => (
    <span className={`collapse-indicator ${isOpen ? "is-open" : ""}`} aria-hidden="true">
        <span className="collapse-indicator-bar" />
        <span className="collapse-indicator-bar" />
    </span>
);

export default CollapseIndicator;
