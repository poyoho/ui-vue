export interface TypedEventEmitter<T extends { [event: string]: (...args: any) => any }> {
	addListener<K extends keyof T>(event: K, listener: T[K]): this;
	emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): boolean;
	eventNames(): Array<keyof T>;
	getMaxListeners(): number;
	listenerCount(type: keyof T): number;
	listeners<K extends keyof T>(event: K): Array<T[K]>;
	off<K extends keyof T>(event: K, listener: T[K]): this;
	on<K extends keyof T>(event: K, listener: T[K]): this;
	once<K extends keyof T>(event: K, listener: T[K]): this;
	prependListener<K extends keyof T>(event: K, listener: T[K]): this;
	prependOnceListener<K extends keyof T>(event: K, listener: T[K]): this;
	rawListeners<K extends keyof T>(event: K): Array<T[K]>;
	removeAllListeners<K extends keyof T>(event?: K): this;
	removeListener<K extends keyof T>(event: K, listener: T[K]): this;
	setMaxListeners(n: number): this;
}

export type WatchEventEmitter = TypedEventEmitter<{ change: (id: string, change: { event: 'create' | 'update' | 'delete' }) => void }>
