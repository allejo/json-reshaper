import * as dayjs from 'dayjs';
import { search } from 'jmespath';
import { util } from 'protobufjs';
import { JsonObject, JsonValue } from 'type-fest';

import { ColumnType, IColumnDefinition } from './ReShaperDocument.js';
import { FilteredJson } from './contracts.ts';

/**
 * @see https://stackoverflow.com/a/46777787
 */
export const DisableGrammarlyProps = {
	'data-gramm': false,
	'data-gramm_editor': false,
	'data-enable-grammarly': false,
} as const;

// Literally a wrapper around JMESPath.search, so I don't have to exclude
// the eslint rule every single time. And I don't want to disable this rule
// entirely either.
export function applyJMESPath(json: JsonObject, query: string): JsonValue {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return search(json, query);
}

export function applyReshapeTransformation<
	T extends Record<symbol, R> | Array<R>,
	R = never,
>(
	json: FilteredJson,
	columnDefinitions: IColumnDefinition[],
	collectionFactory: () => T,
	callback: (collection: T, value: R, colDef: IColumnDefinition) => void,
): T[] {
	const result: T[] = [];

	for (const jsonElement of json) {
		const collection = collectionFactory();

		for (const columnDefinition of columnDefinitions) {
			const { name, query, type } = columnDefinition;

			assertNotNull(name, 'No "name" property in this column definition');
			assertNotNull(query, 'No "query" property in this column definition');
			assertNotNull(type, 'No "type" property in this column definition');

			if (name.trim() === '' && query.trim() === '') {
				continue;
			}

			let value: R = '' as R;

			try {
				const pathResult = applyJMESPath(jsonElement, query);

				if (pathResult === null) {
					value = 'null' as R;
				} else if (type === ColumnType.Date) {
					const fromFmt = columnDefinition.dateConversion?.from;
					const toFmt = columnDefinition.dateConversion?.to;
					let date: dayjs.Dayjs;

					assertNotNull(fromFmt, 'No "from" property in this dateConversion');
					assertNotNull(toFmt, 'No "to" property in this dateConversion');

					if (fromFmt === 'unix' && typeof pathResult === 'number') {
						date = dayjs.unix(pathResult);
					} else {
						date = dayjs(String(pathResult), fromFmt);
					}

					if (date.isValid()) {
						if (toFmt === 'unix') {
							value = String(date.unix()) as R;
						} else {
							value = date.format(toFmt) as R;
						}
					} else {
						value = pathResult as R;
					}
				} else if (type === ColumnType.String) {
					value = pathResult as R;
				} else {
					value = String(pathResult) as R;
				}
			} catch {
				// Intentionally left blank.
			}

			callback(collection, value, columnDefinition);
		}

		const isNonEmptyArray = Array.isArray(collection) && collection.length > 0;
		const isNonEmptyObject =
			typeof collection === 'object' && Object.keys(collection).length > 0;

		if (isNonEmptyArray || isNonEmptyObject) {
			result.push(collection);
		}
	}

	return result;
}

export function applyReshapeTransformationArray(
	json: FilteredJson,
	columnDefinitions: IColumnDefinition[],
) {
	return applyReshapeTransformation(
		json,
		columnDefinitions,
		() => [],
		(c, v) => c.push(v),
	);
}

/**
 * Accepted data types for the `classList` function.
 *
 * @see classList
 */
export type ClassList = ([string, boolean] | boolean | string | undefined)[];

/**
 * Build a list CSS classes that is acceptable to `className`.
 *
 * @param {ClassList} classes A list of CSS classes
 *
 * @return {string}
 */
export function classList(classes: ClassList): string {
	return classes
		.map((value) => {
			if (Array.isArray(value)) {
				const [cls, shouldRender] = value;

				return shouldRender ? cls : '';
			}

			if (value === true || value === false) {
				return '';
			}

			return value;
		})
		.join(' ')
		.replace(/\s{2,}/g, ' ')
		.trim();
}

export function assertNotNull<T>(
	value: T,
	message: string,
): asserts value is NonNullable<T> {
	if (value == null) {
		throw new Error(message);
	}
}

export function base64ToBuffer(b64: string): Uint8Array {
	const buffer = util.newBuffer(util.base64.length(b64));
	util.base64.decode(b64, buffer, 0);

	return buffer;
}

export function bufferToBase64(buffer: Uint8Array) {
	return util.base64.encode(buffer, 0, buffer.length);
}
