import { ColumnDefinition } from './components/ColumnEditor.tsx';

export interface IOutputComponentProps {
	columnQueries: ColumnDefinition[];
	filteredJson: Record<symbol, unknown>[];
	onCopyOutput: (output: string) => void;
}

export type JsonObject = Record<symbol, unknown>;
export type FilteredJson = JsonObject[];
