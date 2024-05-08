import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { kebabCase } from 'lodash';
import { ChangeEvent, KeyboardEvent, useCallback } from 'react';

import { FormFieldType } from '../contracts.ts';
import { ColumnType, IColumnDefinition } from '../ReShaperDocument.js';
import { assertNotNull } from '../utilities.ts';
import { EnumSelect } from './EnumSelect.tsx';

interface Props {
	index: number;
	column: IColumnDefinition;
	onChange: (index: number, name: string, value: number | string) => void;
	onDelete: (index: number) => void;
	onEnter: () => void;
}

export const ColumnEntry = ({
	column,
	index,
	onChange,
	onDelete,
	onEnter,
}: Props) => {
	const columnType = column.type;
	assertNotNull(
		columnType,
		'columnType is not defined; this should never happen',
	);

	const slugifyInputId = useCallback(
		(columnName: string) => `${kebabCase(columnName)}-${index}`,
		[index],
	);
	const handleOnChange = useCallback(
		(key: string) => (e: ChangeEvent<FormFieldType>) => {
			let value: string | number = e.currentTarget.value;

			if (['type'].includes(key)) {
				value = +value;
			}

			onChange(index, key, value);
		},
		[onChange, index],
	);
	const handleOnDelete = useCallback(() => {
		onDelete(index);
	}, [onDelete, index]);

	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			onEnter();
		}
	};

	const colNameId = slugifyInputId('Column Name');
	const colTypeId = slugifyInputId('Column Type');
	const colQueryId = slugifyInputId('Column JMESPath Query');
	const colDateFrom = slugifyInputId('Date From Format');
	const colDateTo = slugifyInputId('Date To Format');

	return (
		<tr>
			<td>
				<button onClick={handleOnDelete}>
					<FontAwesomeIcon icon={faTrash} />
					<span className="sr-only">Delete</span>
				</button>
			</td>
			<td className="align-top">
				<label className="sr-only" htmlFor={colNameId}>
					Column Name
				</label>
				<input
					type="text"
					id={colNameId}
					onChange={handleOnChange('name')}
					value={column.name!}
					onKeyDown={handleKeyPress}
				/>
			</td>
			<td className="align-top text-center">
				<label htmlFor={colTypeId} className="sr-only">
					Column Type
				</label>
				<EnumSelect
					enum_={ColumnType}
					exclude={[ColumnType.UNKNOWN_TYPE]}
					onChange={handleOnChange('type')}
					value={columnType}
				/>
			</td>
			<td>
				<label htmlFor={colQueryId} className="sr-only">
					JMESPath Query
				</label>
				<input
					type="text"
					id={colQueryId}
					onChange={handleOnChange('query')}
					value={column.query!}
					onKeyDown={handleKeyPress}
				/>
				{column.type == ColumnType.Date && (
					<div className="flex gap-2 mt-4 pl-4">
						<div>
							<label htmlFor={colDateFrom} className="text-sm font-bold">
								Date Format From
							</label>
							<input
								type="text"
								id={colDateFrom}
								placeholder="e.g. 'unix'"
								onChange={handleOnChange('dateConversion.from')}
								value={column.dateConversion!.from!}
							/>
						</div>
						<div>
							<label htmlFor={colDateTo} className="text-sm font-bold">
								Date Format To
							</label>
							<input
								type="text"
								id={colDateTo}
								placeholder="e.g. YYYY-MM-DD"
								onChange={handleOnChange('dateConversion.to')}
								value={column.dateConversion!.to!}
							/>
						</div>
					</div>
				)}
			</td>
		</tr>
	);
};
