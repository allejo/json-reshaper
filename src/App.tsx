import { useState } from 'react';

import './App.css';
import { JsonInput } from './components/JsonInput.tsx';

function App() {
	const [filteredJson, setFilteredJson] = useState<Record<symbol, unknown>>({});

	return (
		<div className="container mx-auto">
			<div className="grid grid-cols-2 gap-4">
				<JsonInput
					filteredJson={filteredJson}
					onJsonFiltered={setFilteredJson}
				/>
				<div className=""></div>
			</div>
		</div>
	);
}

export default App;
