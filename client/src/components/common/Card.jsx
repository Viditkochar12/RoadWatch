import React from "react";

/**
 * Compound Card Component
 * Demonstrates React Component Composition via sub-components.
 * Usage:
 *   <Card hoverable className="...">
 *     <Card.Image src="..." alt="..." />
 *     <Card.Header>Title</Card.Header>
 *     <Card.Body>Content</Card.Body>
 *     <Card.Footer>Actions</Card.Footer>
 *   </Card>
 */
export function Card({ children, className = "", hoverable = false, ...props }) {
  const hoverClasses = hoverable
    ? "hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
    : "";

  return (
    <div
      className={`bg-white/95 backdrop-blur rounded-3xl shadow-md shadow-slate-900/5 border border-slate-100 overflow-hidden ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Image = function CardImage({ src, alt = "Card image", className = "", ...props }) {
  if (!src) return null;
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-52 object-cover transition duration-500 hover:scale-105"
        {...props}
      />
    </div>
  );
};

Card.Header = function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`px-6 pt-6 pb-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = "", ...props }) {
  return (
    <div className={`px-6 py-4 text-slate-600 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`px-6 pb-6 pt-3 border-t border-slate-100/80 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
