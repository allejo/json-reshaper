import { faCheck, faPencil, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useContext, useId, useState } from 'react';

import { DocumentContext } from '../contexts.ts';
import { ButtonType } from '../contracts.ts';
import { useFieldWithState } from '../hooks.ts';
import { Button } from './Button.tsx';

export const DocumentName = () => {
	const { document, setDocument } = useContext(DocumentContext);
	const manifestNameID = useId();
	const [editMode, setEditMode] = useState(false);
	const [draftName, setDraftName] = useState(document.name ?? '');
	const handleManifestNameChange = useFieldWithState(setDraftName);

	const handleEnableEdit = useCallback(() => {
		setEditMode(true);
		setDraftName(document.name ?? '');
	}, [document.name]);
	const handleCancelEdit = useCallback(() => {
		setEditMode(false);
	}, []);
	const handleSaveEdit = useCallback(() => {
		setEditMode(false);

		if (draftName.trim().length > 0) {
			setDocument((draft) => {
				draft.name = draftName;
			});
		}
	}, [draftName, setDocument]);

	if (!editMode) {
		return (
			<div className="flex">
				<h1 className="mr-2 text-2xl">
					{document.name || <em>Untitled Document</em>}
				</h1>
				<Button
					type={ButtonType.Plain}
					icon={faPencil}
					iconOnly
					rounded
					onClick={handleEnableEdit}
				>
					Edit
				</Button>
			</div>
		);
	}

	return (
		<div className="flex gap-1">
			<div>
				<label htmlFor={manifestNameID} className="sr-only">
					Document Name
				</label>
				<input
					type="text"
					id={manifestNameID}
					className="h-8"
					onChange={handleManifestNameChange}
					placeholder="Document Name"
					value={draftName}
				/>
			</div>
			<Button
				type={ButtonType.Danger}
				icon={faTimes}
				iconOnly
				rounded
				onClick={handleCancelEdit}
			>
				Cancel Edit
			</Button>
			<Button
				type={ButtonType.Action}
				icon={faCheck}
				iconOnly
				rounded
				onClick={handleSaveEdit}
			>
				Save
			</Button>
		</div>
	);
};
