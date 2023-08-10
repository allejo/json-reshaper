import { useState } from 'react';

import './App.css';
import { ColumnDefinition, ColumnEditor } from './components/ColumnEditor.tsx';
import { JsonInput } from './components/JsonInput.tsx';
import { OutputPreview } from './components/OutputPreview.tsx';

function App() {
	const [filteredJson, setFilteredJson] = useState<Record<symbol, unknown>[]>(
		[],
	);
	const [columnQueries, setColumnQueries] = useState<ColumnDefinition[]>([
		{ name: 'Company', query: 'company.name', type: 'string' },
		{ name: 'Position', query: 'job_posting.title', type: 'string' },
	]);

	return (
		<div className="container mx-auto">
			<div className="grid grid-cols-2 gap-4">
				<JsonInput
					filteredJson={filteredJson}
					onJsonFiltered={setFilteredJson}
				/>
				<div className="window-height grid-rows-2">
					<ColumnEditor
						columns={columnQueries}
						onColumnsChange={setColumnQueries}
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
