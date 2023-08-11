import { Dispatch, SetStateAction } from 'react';

export type UUIDv4 = ReturnType<typeof crypto.randomUUID>;

export interface ColumnDefinition {
	uuid: UUIDv4;
	name: string;
	type: string;
	query: string;
}

export type TransformManifest = Record<UUIDv4, ColumnDefinition>;

export type DataTransformerFxn = () => string;
export type TransformerMountFxn = (transformer: DataTransformerFxn) => void;

export interface IOutputComponentProps {
	transformManifest: TransformManifest;
	filteredJson: FilteredJson;
	onTransformerMount: TransformerMountFxn;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export type NotFunction<T = any> = T extends Function ? never : T;
type ArrayLike<T> = T | T[];

export type JsonObject<T = never> = Record<symbol, NotFunction<T>>;
export type FilteredJson<T = never> = ArrayLike<NotFunction<T>>;

export type StateSetter<T> = Dispatch<SetStateAction<T>>;
