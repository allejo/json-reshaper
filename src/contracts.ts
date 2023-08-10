import { Dispatch, SetStateAction } from 'react';

export type UUIDv4 = ReturnType<typeof crypto.randomUUID>;

export interface ColumnDefinition {
	uuid: UUIDv4;
	name: string;
	type: string;
	query: string;
}

export type TransformManifest = Record<UUIDv4, ColumnDefinition>;

export type DataTransformerFxn = (transformer: () => string) => void;

export interface IOutputComponentProps {
	transformManifest: TransformManifest;
	filteredJson: Record<symbol, unknown>[];
	onTransformerMount: DataTransformerFxn;
}

export type JsonObject = Record<symbol, unknown>;
export type FilteredJson = JsonObject[];

export type StateSetter<T> = Dispatch<SetStateAction<T>>;
