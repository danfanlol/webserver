export enum Availability {
	All,
	Open,
	Closed,
}

export type SessionFilters = {
	subjects: string[],
	availability: Availability,
};