import { randomUUID } from 'crypto';
import { JsonObject } from 'type-fest';

import { ColumnDefinition, ColumnType } from './contracts.ts';
import { applyReshapeTransformationArray } from './utilities.ts';

describe('Utilities > applyReshapeTransformation', () => {
	it('should reshape Unix timestamps into the given format with the special directive "unix"', () => {
		const sampleJSON: JsonObject[] = [
			{
				name: 'Acme Corp',
				timestamp: 1690852591,
			},
			{
				name: 'Vertigo',
				timestamp: 1692232618,
			},
		];

		const uuid = randomUUID();
		const manifest: ColumnDefinition[] = [
			{
				uuid,
				type: ColumnType.Date,
				fromFormat: 'unix',
				toFormat: 'YYYY-MM-DD',
				name: 'Date',
				query: 'timestamp',
			},
		];

		const actual = applyReshapeTransformationArray(sampleJSON, manifest);

		expect(actual).toEqual([['2023-07-31'], ['2023-08-16']]);
	});
});
