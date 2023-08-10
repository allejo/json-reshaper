import { useState } from 'react';

import './App.css';
import { ColumnEditor } from './components/ColumnEditor.tsx';
import { JsonInput } from './components/JsonInput.tsx';
import { OutputPreview } from './components/OutputPreview.tsx';
import { TransformManifest } from './contracts.ts';

function App() {
	const [filteredJson, setFilteredJson] = useState<Record<symbol, unknown>[]>(
		[],
	);
	const [columnQueries, setColumnQueries] = useState<TransformManifest>({});

	return (
		<div className="container mx-auto">
			<div className="grid grid-cols-2 gap-4">
				<JsonInput
					filteredJson={filteredJson}
					onJsonFiltered={setFilteredJson}
				/>
				<div className="window-height grid-rows-2">
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
