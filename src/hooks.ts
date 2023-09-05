import { Draft } from 'immer';
import { invert } from 'lodash';
import { SyntheticEvent, useCallback, useMemo } from 'react';

import { IDocumentContext } from './contexts.ts';
import { FormFieldType, StateSetter } from './contracts.ts';
import { IReShaperDocument } from './ReShaperDocument.js';

export function useEnumByName(enum_: object) {
	return useMemo(() => invert(enum_), [enum_]);
}

export function useFieldWithState<T extends FormFieldType>(
	setter: StateSetter<string>,
) {
	return useCallback((event: SyntheticEvent<T>) => {
		setter(event.currentTarget.value);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}

export function useFieldWithContext<T extends FormFieldType>(
	context: IDocumentContext,
	recipe: (value: string, draft: Draft<IReShaperDocument>) => void,
) {
	return useCallback((event: SyntheticEvent<T>) => {
		const newValue = event.currentTarget.value;

		context.setDocument((draft) => {
			recipe(newValue, draft);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}
