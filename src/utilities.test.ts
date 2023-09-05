import dayjs from 'dayjs';
import { JsonObject } from 'type-fest';
import { describe, expect, it } from 'vitest';

import {
	ColumnType,
	IColumnDefinition,
	IReShaperDocument,
	OutputFormat,
} from './ReShaperDocument.js';
import {
	applyReshapeTransformationArray,
	deserializeReShaperDocument,
	serializeReShaperDocument,
} from './utilities.ts';

describe('Utilities', () => {
	describe('Reshape Transformations', () => {
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

			const manifest: IColumnDefinition[] = [
				{
					uuid: 'abcdef',
					type: ColumnType.Date,
					dateConversion: {
						from: 'unix',
						to: 'YYYY-MM-DD',
					},
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

	describe('ReShaperDocument (De)Serialization', () => {
		it('should serialize and deserialize successfully', () => {
			const document: IReShaperDocument = {
				name: 'My Document',
				format: OutputFormat.CSV,
				query: 'data.items',
				manifest: [
					{
						uuid: 'abcdef',
						type: ColumnType.String,
						name: 'Name',
						query: 'first_name',
					},
					{
						uuid: 'ghijkl',
						type: ColumnType.Date,
						name: 'Date',
						query: 'timestamp',
						dateConversion: {
							from: 'unix',
							to: 'YYYY-MM-DD',
						},
					},
				],
			};

			const serialized = serializeReShaperDocument(document);
			const deserialized = deserializeReShaperDocument(serialized);

			expect(deserialized).toEqual(document);
		});
	});
});
