This is my (Joe Pea's) attempt at porting Blender BMesh to JavaScript. It is an
alternative to https://github.com/sketchpunklabs/bmesh for research, learning,
and comparison.

Differences and similarities between Blender's `BMesh` and the `BMesh.ts`:

- Memory Structure:
  - The memory structure of the vertices/edges/faces is essentially the same.
    The exact same traversal algos as in Blender can be implemented over this
    `BMesh` JavaScript data structure.
  - Blender `BMesh` references verts, edges, faces, and loops, whereas my
    version of `BMesh` references only verts, edges, and faces, and all loops can
    currently be accessed by accessed any of those first three.
  - Blender's has an object pool, while mine does not. I made mine with
    simplicity in mind, and we can decide to add that optimization later if/when
    we need it.
  - I skipped calculating face or vertex normals. We can add those later if/when
    needed.
  - My version does not need explicit reference clean up except to remove items
    from the top level collections in `BMesh`, instead relying on invariants that
    enforce garbage collection (more on invariants below).
  - There are differences in how to access the various linked lists. I
    implemented a generic `Link` class that contains linked list operations
    (insert, delete, and iterate), and re-use this pattern for all linked lists
    and their list operations for consistency and code DRYness.
    - In contrast, Blender's BMesh uses more than one arbitrary linked list
      format (rather than a re-usable pattern), and hard codes all the operations
      in repetitively, duplicating logic in multiple code locations. Blender's
      iteration methods are inconsistent (one linked list needs to be traversed in
      a different way than the other), making code less easy to understand.
    - With my version, traversal is always like this:
      - `edge.diskLinkA.next.next.next.edge`
      - `face.loop.next.next.next`
      - or `face.loop.radialLink.next.next.next.loop`
    - In Blender, traversal differs without any formalized linked list pattern:
      - `edge.v1_disk_link.next.v1_disk_link.next.v1_disk_link.next`
      - `face.l_first.next.next.next`
      - or `face.l_first.radial_next.radial_next.radial_next`
    - Because my version contains them all in the `Link` class, iteration if any linked list can be done the same way at the syntax level. For example:
      - for-of loops:
        - `for (const loop of face.loop) {...}`
        - `for (const diskLink of vertex.diskLink) {...}`
        - `for (const radialLink of edge.radialLink) {...}`
      - array spreads:
        - `const array = [...face.loop]`
        - `const array = [...vertex.diskLink]`
        - `const array = [...edge.radialLink]`
      - function argument spreads
        - `console.log(...face.loop)` or `console.log( ...[...face.loop].map(l => l.vertex) )`
        - `console.log(...vertex.diskLink)` or similar
        - `console.log(...edge.radialLink)` or similar
      - we can add more support as needed, f.e. `face.loop.map()`,
        `face.loop.values()`, etc, to match JS `Array`, `Set`, and `Map`.
- Code organization
  - Rather than splitting functions into separate files from the classes, each
    class (`Vertex`, `Edge`, `Face`, `Loop`) contains methods relating to the
    class.
    - A benefit of this is that private implementation details can remain
      actually-private (using JavaScript `#private` syntax), whereas Blender's
      functions are all public (they are "private" only by naming convention).
  - I didn't follow the exact same naming conventions as Blender's. Instead, I
    focused on more understandable naming, and also avoided controversial words
    like "kill".
    - For example the equivalent of `BM_edge_create(mesh, vertA, vertB)` is `new Edge(mesh, vertA, vertB)` in my version.
    - For example the equivalent of `BM_edge_kill(mesh, edge)` is
      `edge.remove()` in my version.
    - For example the equivalent of `bmesh_disk_edge_remove(edge, vertA)` which
      is supposed to be private due to its lowercase naming, is
      `this.#removeEdgeLink(this.diskLinkA, this.vertexA)` which is actually
      private in my version.
  - My method of code organization enforces invariants that Blender's does not,
    making my TypeScript version have a better level of type safety than
    Blender's C version.
    - For example actual #privacy as mentioned above.
    - For example, in Blender's implementation, objects can be created with
      `nullptr`s without type checking, but in my version certain things can be
      created with non-null references only, and those refs can never be `null`.
      - For example, calling `new Edge(mesh, vertex1, vertex2)` ensures that an
        edge _always_ has two vertices as soon as it is directly instantiated, and
        its `.vertexA` and `.vertexB` properties are `readonly` for public users.
        - (Note that if we ever need object pooling as an optimization, we can
          allow our internal code to modify properties while still keeping the
          properties as `readonly` for public users).
