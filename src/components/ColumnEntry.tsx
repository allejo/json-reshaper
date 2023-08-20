import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { kebabCase } from 'lodash';
import { ChangeEvent, useCallback } from 'react';
import { KeyboardEvent } from 'react';

import {
	ColumnDefinition,
	ColumnType,
	FormFieldType,
	UUIDv4,
} from '../contracts.ts';

interface Props {
	uuid: UUIDv4;
	column: ColumnDefinition;
	onChange: (uuid: UUIDv4, name: string, value: string) => void;
	onDelete: (uuid: UUIDv4) => void;
	onEnter: () => void;
}

export const ColumnEntry = ({
	column,
	uuid,
	onChange,
	onDelete,
	onEnter,
}: Props) => {
	const slugifyInputId = useCallback(
		(columnName: string) => `${kebabCase(columnName)}-${uuid}`,
		[uuid],
	);
	const handleOnChange = useCallback(
		(key: string) => (e: ChangeEvent<FormFieldType>) => {
			onChange(uuid, key, e.currentTarget.value);
		},
		[onChange, uuid],
	);
	const handleOnDelete = useCallback(() => {
		onDelete(uuid);
	}, [onDelete, uuid]);

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
					value={column.name}
					onKeyDown={handleKeyPress}
				/>
			</td>
			<td className="align-top text-center">
				<label htmlFor={colTypeId} className="sr-only">
					Column Type
				</label>
				<select
					id={colTypeId}
					onChange={handleOnChange('type')}
					value={column.type}
				>
					{Object.values(ColumnType).map((type) => (
						<option key={type}>{type}</option>
					))}
				</select>
			</td>
			<td>
				<label htmlFor={colQueryId} className="sr-only">
					JMESPath Query
				</label>
				<input
					type="text"
					id={colQueryId}
					onChange={handleOnChange('query')}
					value={column.query}
					onKeyDown={handleKeyPress}
				/>
				{column.type === ColumnType.Date && (
					<div className="flex gap-2 mt-4 pl-4">
						<div>
							<label htmlFor={colDateFrom} className="text-sm font-bold">
								Date Format From
							</label>
							<input
								type="text"
								id={colDateFrom}
								placeholder="e.g. 'unix'"
								onChange={handleOnChange('fromFormat')}
								value={column.fromFormat}
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
								onChange={handleOnChange('toFormat')}
								value={column.toFormat}
							/>
						</div>
					</div>
				)}
			</td>
		</tr>
	);
};
