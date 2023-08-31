import { useContext } from 'react';

import { DocumentContext } from '../contexts.ts';
import { DocumentName } from './DocumentName.tsx';

export const Toolbar = () => {
	const docContext = useContext(DocumentContext);

	return (
		<div className="border-b border-white pb-2">
			<DocumentName />
		</div>
	);
};
