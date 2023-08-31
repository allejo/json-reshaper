import { createContext } from 'react';
import { Updater } from 'use-immer';

import { OutputFormat, TransformManifest } from './contracts.ts';

export interface ReShaperDocument {
	name: string;
	outputFormat: OutputFormat;
	manifest: TransformManifest;
}

export interface IDocumentContext {
	document: ReShaperDocument;
	setDocument: Updater<ReShaperDocument>;
}

export function createReShaperDocument(): ReShaperDocument {
	return {
		name: '',
		outputFormat: OutputFormat.CSV,
		manifest: {},
	};
}

export const DocumentContext = createContext<IDocumentContext>({
	document: createReShaperDocument(),
	setDocument: () => {
		throw new Error('setDocument has yet to be implemented');
	},
});
