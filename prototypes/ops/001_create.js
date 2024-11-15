//#region IMPORTS
import useThreeWebGL2, { useDarkScene, useVisualDebug } from '../_lib/useThreeWebGL2.js';

import { BMesh } from 'bmesh';
/** @import { Face, Vertex } from 'bmesh' */
//#endregion

//#region MAIN
let App   = useDarkScene( useThreeWebGL2() );
let Ref   = {};
let Debug;

window.addEventListener( 'load', async _=>{
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Setup
    Debug = await useVisualDebug( App );
    App.sphericalLook( 0, 20, 6 );
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const mesh  = new BMesh();
    const v0    = mesh.addVertex( [-1,0,-1] );
    const v1    = mesh.addVertex( [1,0,-1] );
    const v2    = mesh.addVertex( [1,0,1] );

    // const e1    = mesh.addEdge( v0, v1 );
    // const e2    = mesh.addEdge( v1, v2 );

    const f     = mesh.addFace( [ v0, v1, v2 ] );

    // drawFace( mesh.faces[0] );
    drawFaceIter( mesh.faces[0] );

    // for( const v of mesh.vertices ) Debug.pnt.add( v.pos, 0x00ff00, 3 );
    // for( const e of mesh.edges )    Debug.ln.add( e.v1.pos, e.v2.pos, 0x00ffff );
    // iterVertEdges( v1 );
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    App.renderLoop();
    // App.createRenderLoop( onPreRender ).start();
});

function iterVertEdges( /**@type {Vertex}*/ v ){
    let iter = v.edge;
    if( !iter ){
        console.log( 'NoStarting Edge' );
        return;
    }


    for( let i=0; i < 100; i++ ){
        console.log( 'x', i, iter );
        iter = iter.diskEdgeNext( v );
        if( iter === v.edge ) break;
    }
}

function drawFace( /**@type {Face}*/ f ){
    let iter = f.loop;
    do{

        Debug.pnt.add( iter.vert.pos, 0x00ff00, 3 );
        Debug.ln.add( iter.edge.v1.pos, iter.edge.v2.pos, 0x00ffff );
        
    } while( ( iter = iter.next ) != f.loop );
}

function drawFaceIter( /**@type {Face}*/ f ){
    for( const l of f.loop.loop() ){
        console.log( l );
        Debug.pnt.add( l.vert.pos, 0x00ff00, 3 );
        Debug.ln.add( l.edge.v1.pos, l.edge.v2.pos, 0x00ffff );
    }
}

// function onPreRender( dt, et ){}
//#endregion