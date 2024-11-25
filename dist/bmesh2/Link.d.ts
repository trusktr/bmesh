export declare class Link {
    next: Link | null;
    prev: Link | null;
    /** The first link in the linked list. */
    start: Link | null;
    /** True if the linked list is circular. */
    circular: boolean;
}
