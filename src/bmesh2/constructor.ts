export class Empty {}

/* eslint-disable */

/**
 * Type to represent any class constructor. Makes it easy to define
 * "class-factory mixins".
 *
 * Borrowed from https://github.com/trusktr/lowclass/blob/c182595253ee79f45e4770c97d1c55702e351866/src/Constructor.ts
 */
export type AnyConstructor<T = object, A extends any[] = any[], Static = {}> =
	| Constructor<T, A, Static>
	| AbstractConstructor<T, A, Static>
// prettier-ignore
export type Constructor<        T = object, A extends any[] = any[], Static = {}> = (         new (...a: A) => T) & Static
// prettier-ignore
export type AbstractConstructor<T = object, A extends any[] = any[], Static = {}> = (abstract new (...a: A) => T) & Static

/* eslint-enable */
