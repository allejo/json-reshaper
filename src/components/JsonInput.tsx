import { search as applyJMESPath } from 'jmespath';
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
	filteredJson: Record<symbol, unknown>;
	onJsonFiltered: (filteredJson: Record<symbol, unknown>) => void;
}

export const JsonInput = ({ filteredJson, onJsonFiltered }: Props) => {
	const [rawJson, setRawJson] = useState('');
	const [rawJsonError, setRawJsonError] = useState<string | null>(null);
	const [parsedJson, setParsedJson] = useState<Record<symbol, unknown>>({});
	const [jmesPath, setJmesPath] = useState('');
	const [jmesPathError, setJmesPathError] = useState<string | null>(null);

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
	const handleJmesPathOnChange = useCallback(
		(event: SyntheticEvent<HTMLInputElement>) => {
			setJmesPath(event.currentTarget.value);
		},
		[],
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

	useEffect(() => {
		setJmesPathError(null);

		if (jmesPath.trim() === '') {
			onJsonFiltered(parsedJson);
			return;
		}

		try {
			onJsonFiltered(applyJMESPath(parsedJson, jmesPath));
		} catch (e) {
			if (e instanceof Error) {
				setJmesPathError(e.message);
			}
		}
	}, [parsedJson, jmesPath]);

	return (
		<form className="window-height grid-rows-left-sidebar" spellCheck={false}>
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
					<a href="https://jmespath.org/tutorial.html">JMESPath</a>
				</label>
				<input type="text" id="jq-filter" onChange={handleJmesPathOnChange} />
				{jmesPathError && <p className="text-red-800">{jmesPathError}</p>}
			</div>
			<div className="flex flex-col gap-1">
				<p className="font-bold">Filtered JSON</p>
				<div className="bg-slate-700 grow overflow-auto rounded">
					<pre className="h-full m-0 p-3 text-white max-w-0">
						{JSON.stringify(filteredJson, null, '\t')}
					</pre>
				</div>
			</div>
		</form>
	);
};
