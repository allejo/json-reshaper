import { search } from 'jmespath';

import { FilteredJson, JsonObject } from './contracts.ts';

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
export function applyJMESPath(json: JsonObject, query: string): FilteredJson {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return search(json, query);
}
