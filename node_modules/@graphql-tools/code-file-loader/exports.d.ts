import { DocumentNode, GraphQLSchema } from 'graphql';
/**
 * @internal
 */
export declare function pickExportFromModule({ module, filepath }: {
    module: any;
    filepath: string;
}): Promise<DocumentNode | GraphQLSchema>;
/**
 * @internal
 */
export declare function pickExportFromModuleSync({ module, filepath }: {
    module: any;
    filepath: string;
}): DocumentNode | GraphQLSchema;
