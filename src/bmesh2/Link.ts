import { Empty, type AnyConstructor } from './constructor.js'

/** Linked list node mixin class. */
export function Link<T extends AnyConstructor = typeof Empty>(BaseClass: T = Empty as T) {
	//
	return class Link extends BaseClass {
		next: Link | null = null
		prev: Link | null = null

		// /** The first link in the linked list. */
		// start: Link | null = null

		// /** True if the linked list is circular. */
		// circular: boolean = false

		// ... emit an event (or come up with some pattern) on links when they
		// or their siblings are modified connected/disconnected, so we can
		// update external code to have correct references in case a link they
		// reference gets deleted (for example, next/prev state in a UI) ...

		constructor(...args: any[]) {
			super(...args)
		}
	}
}

/** Use this to refer to any Link in general. F.e. `const someLink: TLink = anyLink` */
export type AnyLink = InstanceType<ReturnType<typeof Link>>
