export class Link {
	next: Link | null = null
	prev: Link | null = null

	/** The first link in the linked list. */
	start: Link | null = null

	/** True if the linked list is circular. */
	circular: boolean = false

	// ... emit an event (or something) on links when they or their siblings are
	// modified connected/disconnected, basically we need external code to have
	// correct references in case a link they reference was deleted ...
}
