import { DocumentNode } from 'graphql';
import { MissingFieldError } from './common';
export declare namespace DataProxy {
    interface Query<TVariables> {
        query: DocumentNode;
        variables?: TVariables;
        id?: string;
    }
    interface Fragment<TVariables> {
        id?: string;
        fragment: DocumentNode;
        fragmentName?: string;
        variables?: TVariables;
    }
    interface WriteQueryOptions<TData, TVariables> extends Query<TVariables> {
        data: TData;
        broadcast?: boolean;
    }
    interface WriteFragmentOptions<TData, TVariables> extends Fragment<TVariables> {
        data: TData;
        broadcast?: boolean;
    }
    type DiffResult<T> = {
        result?: T;
        complete?: boolean;
        missing?: MissingFieldError[];
    };
}
export interface DataProxy {
    readQuery<QueryType, TVariables = any>(options: DataProxy.Query<TVariables>, optimistic?: boolean): QueryType | null;
    readFragment<FragmentType, TVariables = any>(options: DataProxy.Fragment<TVariables>, optimistic?: boolean): FragmentType | null;
    writeQuery<TData = any, TVariables = any>(options: DataProxy.WriteQueryOptions<TData, TVariables>): void;
    writeFragment<TData = any, TVariables = any>(options: DataProxy.WriteFragmentOptions<TData, TVariables>): void;
}
//# sourceMappingURL=DataProxy.d.ts.map