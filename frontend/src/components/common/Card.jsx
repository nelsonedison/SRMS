const Card = ({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  headerClassName = '', 
  bodyClassName = '',
  shadow = 'md',
  padding = 'md'
}) => {
  const shadows = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${shadows[shadow]} ${className}`}>
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 ${paddings[padding]} ${headerClassName}`}>
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className={`${paddings[padding]} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;