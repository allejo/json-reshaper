import { useState } from 'react';

import './App.css';
import { ColumnEditor } from './components/ColumnEditor.tsx';
import { JsonInput } from './components/JsonInput.tsx';
import { OutputPreview } from './components/OutputPreview.tsx';
import { FilteredJson, TransformManifest } from './contracts.ts';

function App() {
	const [filteredJson, setFilteredJson] = useState<FilteredJson>([]);
	const [columnQueries, setColumnQueries] = useState<TransformManifest>({});

	return (
		<div className="container h-screen max-h-screen mx-auto">
			<div className="grid grid-cols-2 gap-4 p-4 h-full">
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
		</div>
	);
}

export default App;
