export class PaginatedResult {
    data: any[];
    meta: {
        count: number,
        page: number,
        pages: number
    }
}