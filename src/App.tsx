import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { ColumnEditor } from './components/ColumnEditor.tsx';
import { Footer } from './components/Footer.tsx';
import { JsonInput } from './components/JsonInput.tsx';
import { OutputPreview } from './components/OutputPreview.tsx';
import { FilteredJson, TransformManifest } from './contracts.ts';

import './App.css';

export const ToasterProvider = () => {
	return <Toaster />;
};

function App() {
	const [filteredJson, setFilteredJson] = useState<FilteredJson>([]);
	const [columnQueries, setColumnQueries] = useState<TransformManifest>({});

	return (
		<div className="container h-screen max-h-screen mx-auto">
			<ToasterProvider />
			<div className="grid grid-rows-[min-content_minmax(0,_1fr)_min-content] gap-4 p-4 h-full">
				<div />
				<div className="grid grid-cols-2 gap-4">
					<JsonInput
						filteredJson={filteredJson}
						onJsonFiltered={setFilteredJson}
					/>
					<div className="screen-half grid-rows-2">
						<ColumnEditor
							transformManifest={columnQueries}
							onManifestChange={setColumnQueries}
						/>
						<OutputPreview
							columnQueries={columnQueries}
							filteredJson={filteredJson}
						/>
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
}

export default App;
