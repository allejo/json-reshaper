import { useEffect, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useImmer } from 'use-immer';

import { ColumnEditor } from './components/ColumnEditor.tsx';
import { Footer } from './components/Footer.tsx';
import { JsonInput } from './components/JsonInput.tsx';
import { OutputPreview } from './components/OutputPreview.tsx';
import { Toolbar } from './components/Toolbar.tsx';
import {
	DocumentContext,
	createReShaperDocument,
	IDocumentContext,
} from './contexts.ts';
import { FilteredJson } from './contracts.ts';
import { deserializeReShaperDocument } from './utilities.ts';

import './App.css';

function getQueryParams() {
	return new URLSearchParams(window.location.hash.substring(1));
}

function App() {
	const [document, setDocument] = useImmer(createReShaperDocument());
	const docContext = useMemo<IDocumentContext>(
		() => ({
			document,
			setDocument,
		}),
		[document, setDocument],
	);

	const [filteredJson, setFilteredJson] = useState<FilteredJson>([]);

	useEffect(() => {
		const params = getQueryParams();

		if (params.get('v') === '1') {
			const document = params.get('d');

			if (document !== null) {
				docContext.setDocument(deserializeReShaperDocument(document));
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<DocumentContext.Provider value={docContext}>
			<div className="container h-screen max-h-screen mx-auto">
				<Toaster />
				<div className="grid grid-rows-[min-content_minmax(0,_1fr)_min-content] gap-4 p-4 h-full">
					<Toolbar />
					<div className="grid grid-cols-2 gap-4">
						<JsonInput
							filteredJson={filteredJson}
							onJsonFiltered={setFilteredJson}
						/>
						<div className="screen-half grid-rows-2">
							<ColumnEditor />
							<OutputPreview filteredJson={filteredJson} />
						</div>
					</div>
					<Footer />
				</div>
			</div>
		</DocumentContext.Provider>
	);
}

export default App;
