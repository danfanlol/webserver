export enum Availability {
	All,
	Open,
	Closed,
}

export type SessionFilters = {
	subjects: string[],
	availability: Availability,
	taughtByYou: boolean,
};

export const sameLocalDay = (date0: Date, date1: Date) =>
		date0.getFullYear() === date1.getFullYear()
		&& date0.getMonth() === date1.getMonth()
		&& date0.getDate() === date1.getDate();

export const nowGreatest15Minutes = (startDate: Date=new Date()) => {
	const date = new Date();
	date.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
	date.setMinutes(Math.floor(date.getMinutes() / 15) * 15, 0, 0);
	return date;
};