export type DatastoreRow = string | number | null;
export type DatastoreData = DatastoreRow[][];

export type Datastore = {
    updated?: number,
    created?: number,

    id?: string,
    name: string,
    date?: string,
    version?: string,
    description?: string,

    tags?: string[],
    link_uid?: string,
    workspace: string,
    data: DatastoreData,
}