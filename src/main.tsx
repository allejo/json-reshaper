import * as dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';

dayjs.extend(CustomParseFormat);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
