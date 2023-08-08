import { json as applyJqFilter } from 'jq-web';
import {
	ClipboardEvent,
	SyntheticEvent,
	useCallback,
	useEffect,
	useState,
} from 'react';

import { DisableGrammarlyProps } from '../utilities.ts';

function tryParseJson(json: string): Record<symbol, unknown> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const parsed = JSON.parse(json);

	if (parsed && typeof parsed === 'object') {
		return parsed as Record<symbol, unknown>;
	}

	throw new SyntaxError('Invalid JSON');
}

interface Props {
	onJsonFiltered: (filteredJson: Record<symbol, unknown>) => void;
}

export const JsonInput = ({ onJsonFiltered }: Props) => {
	const [rawJson, setRawJson] = useState('');
	const [rawJsonError, setRawJsonError] = useState<string | null>(null);
	const [parsedJson, setParsedJson] = useState<Record<symbol, unknown>>({});
	const [jqFilter, setJqFilter] = useState('');
	const [jqFilterError, setJqFilterError] = useState<string | null>(null);

	const handleFromJsonOnChange = useCallback(
		(event: SyntheticEvent<HTMLTextAreaElement>) => {
			setRawJson(event.currentTarget.value);
		},
		[],
	);
	const handleFromJsonOnPaste = useCallback(
		(event: ClipboardEvent<HTMLTextAreaElement>) => {
			try {
				const clipboardData = event.clipboardData.getData('text');
				const parsedData = tryParseJson(clipboardData);

				event.preventDefault();

				const formatted = JSON.stringify(parsedData, null, '\t');
				setRawJson(formatted);
			} catch (error) {
				const errorMessage =
					error instanceof SyntaxError
						? error.message
						: 'Invalid JSON pasted in';

				setRawJsonError(errorMessage);
			}
		},
		[],
	);
	const handleJqFilterOnChange = useCallback(
		(event: SyntheticEvent<HTMLInputElement>) => {
			setJqFilter(event.currentTarget.value);
			const filteredJson = applyJqFilter(parsedJson, jqFilter);

			onJsonFiltered(filteredJson);
		},
		[parsedJson, jqFilter, onJsonFiltered],
	);

	useEffect(() => {
		try {
			if (rawJson.trim() !== '') {
				setParsedJson(tryParseJson(rawJson));
				setRawJsonError(null);
			}
		} catch (e) {
			if (e instanceof Error) {
				setRawJsonError(e.message);
				setParsedJson({});
			}
		}
	}, [rawJson]);

	return (
		<form
			className="grid grid-rows-left-sidebar gap-4 h-screen max-h-screen max-w-full"
			spellCheck={false}
		>
			<div className="flex flex-col gap-1">
				<label className="font-bold" htmlFor="from-json">
					From JSON
				</label>
				<textarea
					{...DisableGrammarlyProps}
					id="from-json"
					className="grow resize-none"
					onChange={handleFromJsonOnChange}
					onPasteCapture={handleFromJsonOnPaste}
					value={rawJson}
				/>
				{rawJsonError && <p className="text-red-800">{rawJsonError}</p>}
			</div>
			<div className="flex flex-col gap-1">
				<label className="font-bold" htmlFor="jq-filter">
					<code>jq</code> filter
				</label>
				<input type="text" id="jq-filter" onChange={handleJqFilterOnChange} />
				{jqFilterError && <p className="text-red-800">{jqFilterError}</p>}
			</div>
			<div className="flex flex-col gap-1">
				<p className="font-bold">Filtered JSON</p>
				<div className="bg-slate-700 grow overflow-auto rounded">
					<pre className="h-full m-0 p-3 text-white max-w-0">
						{JSON.stringify(parsedJson, null, '\t')}
					</pre>
				</div>
			</div>
		</form>
	);
};
