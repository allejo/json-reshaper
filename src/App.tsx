import './App.css';
import { JsonInput } from './components/JsonInput.tsx';

function App() {
	return (
		<div className="container-fluid">
			<div className="row vh-100">
				<div className="col-6">
					<JsonInput />
				</div>
				<div className="col-6"></div>
			</div>
		</div>
	);
}

export default App;
