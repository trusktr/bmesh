import { Empty, type AnyConstructor } from './constructor.js'

/** Linked list node mixin class. */
export function Link<T extends AnyConstructor = typeof Empty>(BaseClass: T = Empty as T) {
	//
	return class Link extends BaseClass {
		next: Link | null = null
		prev: Link | null = null

		// /** The first link in the linked list. */
		// start: Link = this

		/**
		 * Set this to true if the linked list is circular.
		 */
		circular: boolean = false

		// ... emit an event (or come up with some pattern) on links when they
		// or their siblings are modified connected/disconnected, so we can
		// update external code to have correct references in case a link they
		// reference gets deleted (for example, next/prev state in a UI) ...

		insertAfter(link: Link) {
			link.unlink() // remove from previous list if any
			const next = this.next
			this.next = link
			link.prev = this
			link.next = next
			if (next) next.prev = link
		}

		insertBefore(link: Link) {
			link.unlink() // remove from previous list if any
			const prev = this.prev
			this.prev = link
			link.next = this
			link.prev = prev
			if (prev) prev.next = link
		}

		/**
		 * Remove this Link from the linked list.
		 */
		unlink() {
			const nextLink = this.next
			const prevLink = this.prev
			this.next = this.circular ? this : null
			this.prev = this.circular ? this : null
			// this.next = null
			// this.prev = null
			if (prevLink) prevLink.next = nextLink // if circular, and pointing to itself again, that's fine, it'll be GC'd
			if (nextLink) nextLink.prev = prevLink
		}

		/**
		 * Returns an iterator for iterating over all Links in th linked list.
		 *
		 * @param forward - True to iterate forward, false to iterate backward.
		 *
		 * @param check - True to check for circularity (throws if not
		 * circular), false to skip. Skipping is useful when the list is in
		 * process of being constructed.
		 */
		*links(forward = true, check = true): Generator<[loop: NonNullable<this['next']>, index: number], void, void> {
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			let link: Link | null = this

			let next: Link | null
			let prev: Link | null
			// let nextPrev: EdgeLink | null
			// let prevNext: EdgeLink | null

			let i = 0

			// This handles several cases:
			// - circular linked list (throw if not circular)
			// - circular linked list but check is false (skip check, don't throw)
			// - non-circular linked list (stop at null)
			do {
				if (!link) throw new NonCircularError()

				// TODO handle deleting during iteration
				next = link.next
				prev = link.prev
				// nextPrev = next?.prev
				// prevNext = prev?.next

				yield [link, i++]
			} while ((link = forward ? next : prev) != this && (this.circular ? check || (!check && link) : link))
		}

		*linksReverse(check = true): Generator<[loop: NonNullable<this['prev']>, index: number], void, void> {
			yield* this.links(false, check)
		}

		/**
		 * This integrates linked list iteration with built-in syntax. For example:
		 *
		 * ```ts
		 * class MyLink extends Link() {...}
		 *
		 * const link = new MyLink()
		 *
		 * // ... attach any number of links together ...
		 *
		 * // Iterate over them using for-of syntax:
		 * for (const [l, i] of link) {
		 *   doSomething(l, i)
		 * }
		 *
		 * // Spread into an array:
		 * const array = [...link]
		 *
		 * // Log them all:
		 * console.log(...link)
		 * ```
		 */
		[Symbol.iterator] = this.links
	}
}

/** Use this to refer to any Link in general. F.e. `const someLink: AnyLink = someLink` */
export type AnyLink = InstanceType<ReturnType<typeof Link>>

export class NonCircularError extends Error {
	constructor() {
		super('Expected linked list to be circular.')
	}
}
