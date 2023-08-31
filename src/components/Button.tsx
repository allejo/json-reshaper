import {
	FontAwesomeIcon,
	FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import { HTMLAttributes } from 'react';

import { ButtonType } from '../contracts.ts';
import { classList } from '../utilities.ts';

interface Props extends HTMLAttributes<HTMLButtonElement> {
	children: string;
	icon?: FontAwesomeIconProps['icon'];
	iconOnly?: boolean;
	rounded?: boolean;
	type: ButtonType;
}

const baseStyles = 'px-1';
const TypeStyles: Record<ButtonType, string> = {
	[ButtonType.None]: '',
	[ButtonType.Plain]: 'border border-slate-400',
	[ButtonType.Action]: 'bg-blue-600 text-white',
	[ButtonType.Danger]: 'bg-red-600 text-white',
} as const;

export const Button = ({
	children,
	className,
	icon,
	iconOnly = false,
	rounded = false,
	type,
	...props
}: Props) => {
	return (
		<button
			{...props}
			className={classList([
				baseStyles,
				TypeStyles[type],
				['rounded', rounded],
				className,
			])}
		>
			{icon && <FontAwesomeIcon icon={icon} fixedWidth />}
			{iconOnly ? <span className="sr-only">{children}</span> : children}
		</button>
	);
};
