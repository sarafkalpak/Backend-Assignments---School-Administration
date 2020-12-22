const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const studentArray = require( "./InitialData" );

const localStudentArray = [...studentArray];
let maxId = localStudentArray.length;

app.use( express.urlencoded() );


// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get( "/api/student", ( request, response ) => {
    response.send( localStudentArray );
} )

app.get( "/api/student/:id", ( request, response ) => {
    const idToSearch = request.params.id;
    const matched = localStudentArray.filter(
        ( student ) => student.id === Number( idToSearch )
    );
    if( matched.length === 0 ) {
        response.sendStatus( 404 );
    } else {
        response.send( matched[0] );
    }
} )

const isNullOrUndefined = ( val ) => val === null || val === undefined;

app.post( "/api/student", ( request, response ) => {
    const newStudent = request.body;
    const { name, currentClass, division } = newStudent;
    if(
        isNullOrUndefined( name ) || isNullOrUndefined(currentClass) || isNullOrUndefined(division)
    ) {
        response.sendStatus( 400 ); 
    } else {
        const newId = maxId + 1;
        maxId = newId;
        newStudent.id = newId;
        newStudent.currentClass = Number( currentClass );
        localStudentArray.push( newStudent );
        response.send( { id:newId } );
    }
} )

app.put( "/api/student/:id", ( request, response ) => {
    const idToSearch = request.params.id;
    const update = request.body;
    const { name, currentClass, division } = update;
    const matchedIdx = localStudentArray.findIndex(
        ( student ) => student.id === Number( idToSearch )
    );
    if( matchedIdx === -1 ) {
        response.sendStatus( 400 );
    } else {
        if( isNullOrUndefined( name ) && isNullOrUndefined( currentClass ) && isNullOrUndefined( division ) ) {
            response.sendStatus( 400 );
        } else {
            if( !isNullOrUndefined( name ) ) {
                localStudentArray[matchedIdx].name = name;
                //response.sendStatus( 200 );
            } if( !isNullOrUndefined( currentClass ) ) {
                localStudentArray[matchedIdx].currentClass = Number( currentClass );
                //response.sendStatus( 200 );
            } if( !isNullOrUndefined( division ) ) {
                localStudentArray[matchedIdx].division = division;
                //response.sendStatus( 200 );
            }
            response.sendStatus( 200 );
        }
    }
} );

app.delete( "/api/student/:id", ( request, response ) => {
    const idToSearch = request.params.id;
    const matchedIdx = localStudentArray.findIndex(
        ( student ) => student.id === Number( idToSearch )
    );
    if( matchedIdx === -1 ) {
        response.sendStatus( 404 );
    } else {
        localStudentArray.splice( matchedIdx, 1 );
        response.sendStatus( 200 );
    }
} );

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app; 