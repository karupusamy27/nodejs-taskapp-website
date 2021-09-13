const mongodb = require('mongodb');
const mongoClient=mongodb.MongoClient;
const ObjectId=mongodb.ObjectId;

const mongoURL = 'mongodb://127.0.0.1:27017';
const database = 'task-manager';

/*
const id=new ObjectId();
console.log(id.id);
console.log(id.getTimestamp());
*/

//Inserting Document
/*
mongoClient.connect(mongoURL, {useNewUrlParser:true},
    (error,client)=>{
        if(error){
            return console.log('Unable to connect');
        }

        const db = client.db('task-manager');
        db.collection('employee').insertMany([
            {
                name : 'Bhavya',
                age : 23
            },
            {
                name : 'Varun',
                age : 26
            }
        ],
        (error,result)=>{
            if(error){
                return console.log('Unable to insert the ducuments');
            }
        })
    })
*/

/*
//Reading Document:
    mongoClient.connect(mongoURL,{useNewUrlParser:true},
        (error,client)=>{
            if(error){
                return console.log('Unable to connect MongoDB server');
            }
            
            const db=client.db('task-manager');
            db.collection('employee').find({name:'Varun'}).toArray(
                (error,result)=>{
                    console.log(result)
                }
            )
            db.collection('employee').find({name:'Varun'}).count(
                (error,result)=>{
                    console.log(result)
                }
            )
        })
*/

/*
//Updating document:
mongoClient.connect(mongoURL,{useNewUrlParser:true},
    (error,client)=>{
        if(error){
            return console.log(error);
        }
        const db = client.db(database);
        db.collection('employee').updateOne(
            {
                name : 'Karupu'
            },
            {
                $unset:{
                    age:25
                }
            }
        ).then((result)=>{
            console.log(result);
        }).catch((error)=>{
            console.log(error);
        })
    })
*/

//Deleting Document

mongoClient.connect(mongoURL, {useNewUrlParser: true},
    (error,client)=>{
        if(error){
            return console.log(error);
        }
        const db = client.db(database);
        db.collection('employee').deleteMany(
            {
                age : 28
            }
        ).then((result)=>{
            console.log(result);
        }).catch((error)=>{
            console.log(error);
        })
    })