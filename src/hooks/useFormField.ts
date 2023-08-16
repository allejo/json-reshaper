import { ChangeEvent, useCallback } from 'react';

import { FormFieldType, StateSetter } from '../contracts.ts';

export const useFormField = (onChange: StateSetter<string>) => {
	const callback = useCallback(
		(event: ChangeEvent<FormFieldType>) => {
			onChange(event.target.value);
		},
		[onChange],
	);

	return [callback];
};
