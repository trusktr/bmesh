//#region IMPORTS
import useThreeWebGL2, { useDarkScene, useVisualDebug } from '../_lib/useThreeWebGL2.js';

import { BMesh, BMesh2, vec3 } from 'bmesh';
/** @import { Face } from 'bmesh' */
//#endregion

//#region MAIN
const App   = useDarkScene( useThreeWebGL2() );

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup
const Debug = await useVisualDebug( App );
App.sphericalLook( 0, 20, 6 );
App.camera.position.x = 5
App.camCtrl.update()

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const bmesh  = new BMesh();
const v0    = bmesh.addVertex( [-2,0,-1] );
const v1    = bmesh.addVertex( [ 0,0,-1] );
const v2    = bmesh.addVertex( [ 2,0,-1] );
const v3    = bmesh.addVertex( [-2,0, 1] );
const v4    = bmesh.addVertex( [ 0,0, 1] );
const v5    = bmesh.addVertex( [ 2,0, 1] );

const v6    = bmesh.addVertex( [ 0,1, -1] );
const v7    = bmesh.addVertex( [ 0,1, 1] );

const f1    = bmesh.addFace( [ v1, v4, v5, v2 ] );
const f0    = bmesh.addFace( [ v0, v3, v4, v1 ] );
const f2    = bmesh.addFace( [ v1, v6, v7, v4 ] );

console.log( bmesh );

let loop = bmesh.faces[ 0 ].loop.prev;
// const loop = bmesh.faces[ bmesh.faces.length-1 ].loop;

render();


// for( const v of bmesh.vertices ) Debug.pnt.addPoint( v.pos, 0x00ff00, 3 );
// for( const e of bmesh.edges )    Debug.ln.addPoint( e.v1.pos, e.v2.pos, 0x00ffff );
// iterVertEdges( v1 );

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
initUI();
App.renderLoop();
// App.createRenderLoop( onPreRender ).start();

function initUI(){
    document.getElementById( 'btnPrev' ).addEventListener( 'click', loopPrev );
    document.getElementById( 'btnNext' ).addEventListener( 'click', loopNext );

    document.getElementById( 'btnRPrev' ).addEventListener( 'click', loopRPrev );
    document.getElementById( 'btnRNext' ).addEventListener( 'click', loopRNext );
}

function render(){
    Debug.pnt.reset();
    Debug.ln.reset();

    drawMesh( bmesh )

    const a = loop.vert.pos.slice(); // loop.edge.v1.pos.slice();
    const b = ( loop.vert === loop.edge.v1 )
                    ? loop.edge.v2.pos.slice()
                    : loop.edge.v1.pos.slice();

    const n = loop.face.norm.slice();
    vec3.scale( n, 0.2, n );
    vec3.add( a, n, a );
    vec3.add( b, n, b );

    const cssPointSize = 5 * devicePixelRatio
    Debug.pnt.addPoint( a, 0xffff00, cssPointSize );
    Debug.ln.addPoint( a, b, 0xffff00 );

    renderFace();
}

function renderFace(){
    const avg = vec3.avg(...[...loop.loop()].map(l => l.vert.pos))
    const cssPointSize = 7 * devicePixelRatio
    Debug.pnt.addPoint( avg, 0xffff00, cssPointSize, 2 );
}

function loopNext(){
    loop = loop.next;
    render();
}

function loopPrev(){
    loop = loop.prev;
    render();
}

function loopRPrev(){
    loop = loop.radial_prev;
    render();
}

function loopRNext(){
    loop = loop.radial_next;
    render();
}

function drawFace( /**@type {Face}*/ f ){
    for( const l of f.loop.loop() ){
        console.log( l );
        const cssPointSize = 5 * devicePixelRatio
        Debug.pnt.addPoint( l.vert.pos, 0x00ff00, cssPointSize );
        Debug.ln.addPoint( l.edge.v1.pos, l.edge.v2.pos, 0x00ffff );
    }
}

function drawMesh( /**@type {BMesh}*/ bmesh ){
    // This duplicates the rendering of shared edges and vertices.
    // for (const f of bmesh.faces) drawFace( f )

    // This does not duplicate edges/vertices, and it covers non-faces too (f.e. standalone edges)
    const cssPointSize = 5 * devicePixelRatio
    for( const v of bmesh.vertices ) Debug.pnt.addPoint( v.pos, 0x00ff00, cssPointSize );
    for( const e of bmesh.edges )    Debug.ln.addPoint( e.v1.pos, e.v2.pos, 0x00ffff );
}

// function onPreRender( dt, et ){}
//#endregion