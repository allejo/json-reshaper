import { randomUUID } from 'crypto';
import * as dayjs from 'dayjs';
import { JsonObject } from 'type-fest';

import { ColumnDefinition, ColumnType } from './contracts.ts';
import { applyReshapeTransformationArray } from './utilities.ts';

describe('Utilities > applyReshapeTransformation', () => {
	it('should reshape Unix timestamps into the given format with the special directive "unix"', () => {
		const dayOne = dayjs('2023-07-31');
		const dayTwo = dayjs('2023-08-16');

		const sampleJSON: JsonObject[] = [
			{
				name: 'Acme Corp',
				timestamp: dayOne.unix(),
			},
			{
				name: 'Vertigo',
				timestamp: dayTwo.unix(),
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

		expect(actual).toEqual([
			[dayOne.format('YYYY-MM-DD')],
			[dayTwo.format('YYYY-MM-DD')],
		]);
	});
});
