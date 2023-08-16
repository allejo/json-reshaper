import { Dispatch, SetStateAction } from 'react';

export type UUIDv4 = ReturnType<typeof crypto.randomUUID>;

export enum ColumnType {
	Date = 'date',
	String = 'string',
}

interface BaseColumn {
	uuid: UUIDv4;
	name: string;
	query: string;
}

export interface DateColumn extends BaseColumn {
	type: ColumnType.Date;
	fromFormat: string;
	toFormat: string;
}

export interface StringColumn extends BaseColumn {
	type: ColumnType.String;
}

export type ColumnDefinition = DateColumn | StringColumn;
export type TransformManifest = Record<UUIDv4, ColumnDefinition>;

export type DataTransformerFxn = () => string;
export type TransformerMountFxn = (transformer: DataTransformerFxn) => void;

export interface IOutputComponentProps {
	filteredJson: FilteredJson;
	onTransformerMount: TransformerMountFxn;
	transformManifest: TransformManifest;
}

/**
 * Any type that is not a function.
 */
export type NotFunction<T = any> = T extends Function ? never : T; // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types

export type JsonObject<T = never> = Record<symbol, NotFunction<T>>;
export type FilteredJson = JsonObject[];

export type StateSetter<T> = Dispatch<SetStateAction<T>>;
export type FormFieldType =
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLTextAreaElement;
