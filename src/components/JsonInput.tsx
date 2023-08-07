import {
	Form,
	FormError,
	FormInput,
	FormLabel,
	useFormStore,
} from '@ariakit/react';
import { ClipboardEvent, useCallback } from 'react';

import { DisableGrammarlyProps } from '../utilities.ts';

function tryParseJson(json: string): Record<symbol, unknown> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const parsed = JSON.parse(json);

	if (parsed && typeof parsed === 'object') {
		return parsed as Record<symbol, unknown>;
	}

	throw new SyntaxError('Invalid JSON');
}

interface FormState {
	rawJson: string;
	mainJqFilter: string;
}

export const JsonInput = () => {
	const form = useFormStore<FormState>({
		defaultValues: {
			rawJson: '',
			mainJqFilter: '',
		},
	});
	const handleOnPaste = useCallback(
		(event: ClipboardEvent<HTMLTextAreaElement>) => {
			try {
				const clipboardData = event.clipboardData.getData('text');
				const parsedData = tryParseJson(clipboardData);

				event.preventDefault();

				const formatted = JSON.stringify(parsedData, null, '\t');
				form.setValue(form.names.rawJson, formatted);
			} catch (error) {
				const errorMessage =
					error instanceof SyntaxError
						? error.message
						: 'Invalid JSON pasted in';

				form.setError(form.names.rawJson, errorMessage);
			}
		},
		[form],
	);
	form.useValidate(() => {
		try {
			tryParseJson(form.getValue(form.names.rawJson));
		} catch (e) {
			if (e instanceof Error) {
				form.setError(form.names.rawJson, e.message);
			}
		}
	});

	return (
		<div className="d-flex flex-column h-100">
			<Form
				store={form}
				className="d-flex flex-column gap-3 h-50"
				spellCheck={false}
			>
				<div className="d-flex flex-column h-100">
					<FormLabel name={form.names.rawJson} className="form-label">
						From JSON
					</FormLabel>
					<FormInput
						{...DisableGrammarlyProps}
						name={form.names.rawJson}
						render={<textarea onPasteCapture={handleOnPaste} />}
						className={`form-control flex-grow-1`}
					/>
					<FormError name={form.names.rawJson} className="invalid-feedback" />
				</div>
				<div>
					<FormLabel name={form.names.mainJqFilter} className="form-label">
						<code>jq</code> filter
					</FormLabel>
					<FormInput name={form.names.mainJqFilter} className="form-control" />
					<FormError
						name={form.names.mainJqFilter}
						className="invalid-feedback"
					/>
				</div>
			</Form>
		</div>
	);
};
