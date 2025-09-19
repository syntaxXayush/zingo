import React from "react";

export function Button({ children, variant = "default", size = "md", className = "", ...props }) {
	const variantClasses = {
		default: "bg-primary text-primary-foreground hover:brightness-95",
		outline: "border border-primary text-primary bg-transparent hover:bg-primary/10",
		ghost: "bg-transparent text-foreground hover:bg-foreground/5",
		secondary: "bg-secondary text-secondary-foreground hover:brightness-95",
	};
	const sizeClasses = {
		sm: "px-2 py-1 text-sm",
		md: "px-6 py-3 text-base",
		lg: "px-8 py-4 text-lg",
		icon: "h-10 w-10 p-0 flex items-center justify-center",
	};
	return (
		<button
			{...props}
			className={`${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.md} rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${className}`.trim()}
		>
			{children}
		</button>
	);
}
