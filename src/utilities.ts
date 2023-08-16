import * as dayjs from 'dayjs';
import { search } from 'jmespath';
import { JsonObject, JsonValue } from 'type-fest';

import { ColumnDefinition, ColumnType, FilteredJson } from './contracts.ts';

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
	columnDefinitions: ColumnDefinition[],
	collectionFactory: () => T,
	callback: (collection: T, value: R, colDef: ColumnDefinition) => void,
): T[] {
	const result: T[] = [];

	for (const jsonElement of json) {
		const collection = collectionFactory();

		for (const columnDefinition of columnDefinitions) {
			const { name, query, type } = columnDefinition;

			if (name.trim() === '' && query.trim() === '') {
				continue;
			}

			let value: R = '' as R;

			try {
				const pathResult = applyJMESPath(jsonElement, query);

				if (pathResult === null) {
					value = 'null' as R;
				} else if (type === ColumnType.Date) {
					let date: dayjs.Dayjs;

					if (columnDefinition.fromFormat === 'unix') {
						date = dayjs.unix(Number(pathResult));
					} else {
						date = dayjs(String(pathResult), columnDefinition.fromFormat);
					}

					if (date.isValid()) {
						if (columnDefinition.toFormat === 'unix') {
							value = String(date.unix()) as R;
						} else {
							value = date.format(columnDefinition.toFormat) as R;
						}
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
	columnDefinitions: ColumnDefinition[],
) {
	return applyReshapeTransformation(
		json,
		columnDefinitions,
		() => [],
		(c, v) => c.push(v),
	);
}
