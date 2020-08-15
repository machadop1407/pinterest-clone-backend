import { ApolloCache } from '../../core';
export declare type ReactiveVar<T> = (newValue?: T) => T;
export declare const cacheSlot: {
    readonly id: string;
    hasValue(): boolean;
    getValue(): ApolloCache<any> | undefined;
    withValue<TResult, TArgs extends any[], TThis = any>(value: ApolloCache<any>, callback: (this: TThis, ...args: TArgs) => TResult, args?: TArgs | undefined, thisArg?: TThis | undefined): TResult;
};
export declare function makeVar<T>(value: T): ReactiveVar<T>;
//# sourceMappingURL=reactiveVars.d.ts.map