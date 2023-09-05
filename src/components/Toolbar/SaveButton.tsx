import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useContext } from 'react';
import { toast } from 'react-hot-toast';

import { DocumentContext } from '../../contexts.ts';
import { ButtonType } from '../../contracts.ts';
import { serializeReShaperDocument } from '../../utilities.ts';
import { Button } from '../Button.tsx';

export const SaveButton = () => {
	const docContext = useContext(DocumentContext);

	const handleOnClick = useCallback(() => {
		const serialized = serializeReShaperDocument(docContext.document);
		const qParams = new URLSearchParams({
			v: '1',
			d: serialized,
		});

		window.location.hash = qParams.toString();
		toast.success('Bookmark or share the updated URL');
	}, [docContext.document]);

	return (
		<Button
			type={ButtonType.Action}
			icon={faSave}
			onClick={handleOnClick}
			rounded
		>
			Save
		</Button>
	);
};
