import PropTypes from "prop-types";

export const Container = ({ children, className }) => {
  return (
    <div className={`min-h-screen bg-background_1 px-4 py-4 md:px-10 md:py-10 lg:px-20 lg:py-10 ${className}`}>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
