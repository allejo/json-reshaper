import { Draft } from 'immer';
import { SyntheticEvent, useCallback } from 'react';

import { IDocumentContext, ReShaperDocument } from './contexts.ts';
import { FormFieldType, StateSetter } from './contracts.ts';

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
	recipe: (value: string, draft: Draft<ReShaperDocument>) => void,
) {
	return useCallback((event: SyntheticEvent<T>) => {
		const newValue = event.currentTarget.value;

		context.setDocument((draft) => {
			recipe(newValue, draft);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}
