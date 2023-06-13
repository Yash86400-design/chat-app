const mongoose = require('mongoose');
const adapterImport = require('@socket.io/mongo-emitter')

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('Database connected'.cyan))
//   .catch(err => console.error('Database connection error'.red, err));

const connectDB = async (app, io) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database connected'.cyan);

    // // Create the MongoDB adapter for Socket.IO
    // const adapter = adapterImport({
    //   host: process.env.MONGODB_HOST,
    //   port: process.env.MONGODB_PORT,
    //   user: process.env.MONGODB_USER,
    //   password: process.env.MONGODB_PASSWORD,
    //   db: process.env.MONGODB_DATABASE
    // });

    // // Set up the Socket.IO adapter
    // io.adapter(adapter);

    // console.log('Socekt.IO MongoDB adapter initialized'.bgMagenta);

    // Open a Change Stream on the "message" collection
    const Message = require('../models/message/Message');
    const changeStream = Message.watch();

    // Set up a listener when change events are emitted
    changeStream.on('change', (next) => {
      // Process any change event
      switch (next.operationType) {
        case 'insert':
          // New message inserted
          const newMessage = next.fullDocument;
          // Emit an event to the client with the new message
          io.emit('newMessage', newMessage);
          break;
        case 'update':
          // Message updated 
          const updatedMessage = next.updateDescription.updatedFields.content;
          // Emit an event to the client with the updated message
          io.emit('updatedMessage', updatedMessage);
          break;
        case 'delete':
          // Message deleted
          const deletedMessage = next.documentKey._id;
          // Emit an event to the client with the deleted message ID
          io.emit('deletedMessage', deletedMessage);
          break;
        default:
          break;
      }
    });

  } catch (err) {
    console.error('Database connection error'.red, err);
    process.exit(1);
  }
};

module.exports = connectDB;

