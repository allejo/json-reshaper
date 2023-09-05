import { createContext } from 'react';
import { Updater } from 'use-immer';

import { IReShaperDocument, OutputFormat } from './ReShaperDocument.js';

export interface IDocumentContext {
	document: IReShaperDocument;
	setDocument: Updater<IReShaperDocument>;
}

export function createReShaperDocument(): IReShaperDocument {
	return {
		name: '',
		format: OutputFormat.CSV,
		query: '',
		manifest: [],
	};
}

export const DocumentContext = createContext<IDocumentContext>({
	document: createReShaperDocument(),
	setDocument: () => {
		throw new Error('setDocument has yet to be implemented');
	},
});
