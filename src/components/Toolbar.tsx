import { DocumentName } from './DocumentName.tsx';
import { SaveButton } from './Toolbar/SaveButton.tsx';

export const Toolbar = () => {
	return (
		<div className="border-b border-white flex items-center pb-2">
			<DocumentName />
			<div className="ml-auto">
				<SaveButton />
			</div>
		</div>
	);
};
