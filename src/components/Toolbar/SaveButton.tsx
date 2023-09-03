import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useContext } from 'react';

import { ReShaperDocument } from '../../ReShaperDocument.js';
import { DocumentContext } from '../../contexts.ts';
import { ButtonType } from '../../contracts.ts';
import { bufferToBase64 } from '../../utilities.ts';
import { Button } from '../Button.tsx';

export const SaveButton = () => {
	const docContext = useContext(DocumentContext);

	const handleOnClick = useCallback(() => {
		const message = ReShaperDocument.create(docContext.document);
		const buffer = ReShaperDocument.encode(message).finish();
		const base64 = bufferToBase64(buffer);

		const qParams = new URLSearchParams();
		qParams.set('v', '1');
		qParams.set('d', base64);

		window.location.hash = qParams.toString();
	}, [docContext.document]);

	return (
		<Button
			type={ButtonType.None}
			icon={faSave}
			iconOnly
			onClick={handleOnClick}
		>
			Save
		</Button>
	);
};
