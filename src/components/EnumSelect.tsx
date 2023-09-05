import { SelectHTMLAttributes } from 'react';

import { Enum } from '../contracts.ts';
import { useEnumByName } from '../hooks.ts';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
	enum_: Enum;
	exclude: number[];
	value: number;
}

export const EnumSelect = ({ enum_, exclude, ...props }: Props) => {
	const formats = useEnumByName(enum_);

	return (
		<select {...props}>
			{Object.values(enum_).map((format) => {
				if (format in exclude) {
					return null;
				}

				return (
					<option key={format} value={format}>
						{formats[format]}
					</option>
				);
			})}
		</select>
	);
};
