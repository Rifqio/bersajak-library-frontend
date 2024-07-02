import PropTypes from "prop-types";

export const Container = ({ children, sx }) => {
    return <div className={`min-h-screen bg-background_1 px-20 py-10 ${sx}`}>{children}</div>;
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.string,
};
