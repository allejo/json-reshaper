import { Dispatch, SetStateAction } from 'react';
import { JsonObject } from 'type-fest';

/**
 * @see https://stackoverflow.com/a/50159864
 */
export type Enum<E extends object = object> = Record<
	keyof E,
	number | string
> & {
	[k: number]: string;
};

export type DataTransformerFxn = () => string;
export type TransformerMountFxn = (transformer: DataTransformerFxn) => void;

export interface IOutputComponentProps {
	filteredJson: FilteredJson;
	onTransformerMount: TransformerMountFxn;
}

export type FilteredJson = JsonObject[];

export type StateSetter<T> = Dispatch<SetStateAction<T>>;
export type FormFieldType =
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLTextAreaElement;

export enum ButtonType {
	None,
	Plain,
	Action,
	Danger,
}
