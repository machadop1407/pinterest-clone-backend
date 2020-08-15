import { FieldPolicy, Reference } from '../../cache';
declare type KeyArgs = FieldPolicy<any>["keyArgs"];
export declare function concatPagination<T = Reference>(keyArgs?: KeyArgs): FieldPolicy<T[]>;
export declare function offsetLimitPagination<T = Reference>(keyArgs?: KeyArgs): FieldPolicy<T[]>;
declare type TInternalRelay<TNode> = Readonly<{
    edges: Array<{
        cursor: string;
        node: TNode;
    }>;
    pageInfo: Readonly<{
        hasPreviousPage: boolean;
        hasNextPage: boolean;
        startCursor: string;
        endCursor: string;
    }>;
}>;
export declare function relayStylePagination<TNode = Reference>(keyArgs?: KeyArgs): FieldPolicy<TInternalRelay<TNode>>;
export {};
//# sourceMappingURL=pagination.d.ts.map