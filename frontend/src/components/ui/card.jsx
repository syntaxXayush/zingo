import React from "react";

export function Card({ className = "", children, ...props }) {
	return (
		<div
			className={
				"rounded-2xl border bg-card text-card-foreground shadow-sm " + className
			}
			{...props}
		>
			{children}
		</div>
	);
}

export function CardHeader({ className = "", children, ...props }) {
	return (
		<div className={"p-6 pb-0 " + className} {...props}>
			{children}
		</div>
	);
}

export function CardTitle({ className = "", children, ...props }) {
	return (
		<h3 className={"text-xl font-semibold leading-none tracking-tight " + className} {...props}>
			{children}
		</h3>
	);
}

export function CardContent({ className = "", children, ...props }) {
	return (
		<div className={"p-6 pt-0 " + className} {...props}>
			{children}
		</div>
	);
}
