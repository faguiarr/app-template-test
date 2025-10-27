type Cell = string | number | null;
type Datastore = Cell[][];

export const datastoreToObject = <T extends Record<string, Cell>>(headers: string[], data: Datastore): T[] => {
    const result: T[] = [];
    for (let i = 1; i < data?.length; i++) {
        const item: Record<string, Cell> = {};

        headers.forEach((header: string, index: number) => {
            item[header] = data[i][index];
        });

        result.push(item as T);
    }

    return result;
}

export const objectToDatastore = <T extends Record<string, Cell>>(data: T[]): Datastore => {
    const headers: Cell[] = Object.keys(data?.[0] ?? {});

    const rows: Datastore = data.map((d) =>
        headers.map<Cell>((h) => d[h as string] ?? null)
    );

    return [
        headers,
        ...rows
    ];
}