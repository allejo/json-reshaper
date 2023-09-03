import { ChangeEvent, useCallback, useContext, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useCopyToClipboard } from 'usehooks-ts';

import { OutputFormat } from '../ReShaperDocument.js';
import { DocumentContext } from '../contexts.ts';
import {
	DataTransformerFxn,
	FilteredJson,
	TransformerMountFxn,
} from '../contracts.ts';
import { useEnumByName } from '../hooks.ts';
import { assertNotNull } from '../utilities.ts';
import { EnumSelect } from './EnumSelect.tsx';
import { TransformDelimiterSeparatedValues } from './TransformDelimiterSeparatedValues.tsx';

interface Props {
	filteredJson: FilteredJson;
}
const MimeType: Record<OutputFormat, string | undefined> = {
	[OutputFormat.UNKNOWN_FMT]: undefined,
	[OutputFormat.CSV]: 'text/csv',
	[OutputFormat.TSV]: 'text/tab-seprated-values',
};

export const OutputPreview = ({ filteredJson }: Props) => {
	const { document, setDocument } = useContext(DocumentContext);
	const outFmt = useEnumByName(OutputFormat);
	const format = document.format;

	assertNotNull(format, 'Unexpected output format is null or undefined');

	const [, copy] = useCopyToClipboard();
	const [fileLink, setFileLink] = useState<string>('');
	const [showButtons, setShowButtons] = useState<boolean>(false);
	const getTransformedAsText = useRef<DataTransformerFxn>(() => {
		throw new Error('Transformer not mounted');
	});

	const handleFormatOnChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			const newFormat = +e.currentTarget.value;

			setDocument((draft) => {
				draft.format = newFormat as OutputFormat;
			});
		},
		[setDocument],
	);
	const handleTransformerMount = useCallback<TransformerMountFxn>(
		(transformer) => {
			getTransformedAsText.current = transformer;
		},
		[],
	);
	const handleCopyEvent = useCallback(() => {
		const transformedText = getTransformedAsText.current();

		copy(transformedText)
			.then(() => {
				toast.success('Copied to clipboard');
			})
			.catch((err: { message: string }) => {
				toast.error(err.message);
			});
	}, [copy]);

	const handleDownload = useCallback(() => {
		const transformedText = getTransformedAsText.current();
		const format = document.format ?? OutputFormat.UNKNOWN_FMT;
		const data = new Blob([transformedText], { type: MimeType[format] });
		const url = window.URL.createObjectURL(data);

		setFileLink(url);
	}, [document.format]);

	return (
		<section className="flex flex-col min-w-0">
			<p className="font-bold mb-2">Output Preview</p>
			<div className="bg-white border flex rounded mb-4 p-3">
				<div className="flex items-center">
					<label className="inline-block font-bold mr-3 my-0" htmlFor="format">
						Format
					</label>

					<EnumSelect
						enum_={OutputFormat}
						exclude={[OutputFormat.UNKNOWN_FMT]}
						id="format"
						className="w-auto mb-0"
						value={format}
						onChange={handleFormatOnChange}
					/>
				</div>
				{showButtons && (
					<div className="ml-auto flex gap-2">
						<button className="border py-1 px-2" onClick={handleCopyEvent}>
							Copy as {outFmt[format]}
						</button>
						<a
							download={`json-reshaper.${outFmt[document.format!]}`}
							href={fileLink}
							className="border py-1 px-2"
							onClick={handleDownload}
						>
							Download {outFmt[format]}
						</a>
					</div>
				)}
			</div>
			<div className="bg-white grow p-3 rounded overflow-hidden h-0">
				<div className="max-h-full h-full overflow-auto">
					{[OutputFormat.CSV, OutputFormat.TSV].includes(document.format!) && (
						<TransformDelimiterSeparatedValues
							delimiter={document.format === OutputFormat.CSV ? ',' : '\t'}
							filteredJson={filteredJson}
							onTransformerMount={handleTransformerMount}
							setShowButtons={setShowButtons}
						/>
					)}
				</div>
			</div>
		</section>
	);
};
