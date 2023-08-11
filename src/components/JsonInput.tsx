import {
	ClipboardEvent,
	SyntheticEvent,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useDebounce } from 'usehooks-ts';

import { FilteredJson, JsonObject } from '../contracts.ts';
import { applyJMESPath, DisableGrammarlyProps } from '../utilities.ts';

function tryParseJson(json: string): JsonObject {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const parsed = JSON.parse(json);

	if (parsed && (typeof parsed === 'object' || Array.isArray(parsed))) {
		return parsed as JsonObject;
	}

	throw new SyntaxError('Invalid JSON');
}

interface Props {
	filteredJson: FilteredJson;
	onJsonFiltered: (filteredJson: FilteredJson) => void;
}

export const JsonInput = ({ filteredJson, onJsonFiltered }: Props) => {
	const [rawJson, setRawJson] = useState('');
	const [rawJsonError, setRawJsonError] = useState<string | null>(null);
	const [parsedJson, setParsedJson] = useState<JsonObject>({});
	const [jmesPath, setJmesPath] = useState('');
	const [jmesPathError, setJmesPathError] = useState<string | null>(null);

	const debouncedRawJson = useDebounce(rawJson, 1000);
	const debouncedJmesPath = useDebounce(jmesPath, 500);

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
			if (debouncedRawJson.trim() !== '') {
				setParsedJson(tryParseJson(debouncedRawJson));
				setRawJsonError(null);
			}
		} catch (e) {
			if (e instanceof Error) {
				setRawJsonError(e.message);
				setParsedJson({});
			}
		}
	}, [debouncedRawJson]);

	useEffect(() => {
		setJmesPathError(null);

		if (debouncedJmesPath.trim() === '') {
			return;
		}

		try {
			const filtered = applyJMESPath(parsedJson, debouncedJmesPath);

			if (Array.isArray(filtered)) {
				onJsonFiltered(filtered);
			}
		} catch (e) {
			if (e instanceof Error) {
				setJmesPathError(e.message);
			}
		}
	}, [debouncedJmesPath, onJsonFiltered, parsedJson]);

	return (
		<form className="screen-half grid-rows-left-sidebar" spellCheck={false}>
			<div className="flex flex-col">
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
			<div className="flex flex-col">
				<label className="font-bold" htmlFor="jq-filter">
					<a href="https://jmespath.org/tutorial.html">JMESPath</a>
				</label>
				<input type="text" id="jq-filter" onChange={handleJmesPathOnChange} />
				{jmesPathError && <p className="text-red-800">{jmesPathError}</p>}
			</div>
			<div className="flex flex-col">
				<p className="font-bold mb-2">Filtered JSON</p>
				<div className="bg-slate-700 grow overflow-auto rounded">
					<pre className="h-full m-0 p-3 text-white max-w-0">
						{JSON.stringify(filteredJson, null, '\t')}
					</pre>
				</div>
			</div>
		</form>
	);
};
