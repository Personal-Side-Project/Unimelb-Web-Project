const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express'); 
const cors = require('cors');
const path = require('path'); 
const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); require('./models');
// Bodyparser Middleware
app.use(bodyParser.json());

// Update the information immediately 
const server = require('http').createServer(app);
const io = require("socket.io")(server);

io.of("/api/socket").on("connection", (socket) => {
    console.log("socket.io: User connected: ", socket.id);
    socket.on("disconnect", () => {
        console.log("socket.io: User disconnected: ", socket.id);
    });
});

// Set up routes
const customer = require('./routes/customerRouter');
const vendor = require('./routes/vendorRouter');
const order = require('./routes/orderRouter');

//Database config
const db = require('./config/keys.js').mongoURL;

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Setting change streams");
    const orderChangeStream = connection.collection("orders").watch();
    
    orderChangeStream.on("change", (change) => {
        switch (change.operationType) {
            case "insert":
                console.log("insertion detected at backend");
                const order = {
                    _id: change.fullDocument._id,
                    customer: change.fullDocument.customer,
                    vendor: change.fullDocument.vendor,
                    snacks: change.fullDocument.snacks,
                    createdAt: change.fullDocument.createdAt
                }
                io.of("/api/socket").emit("newOrder", order);
                break;
            case "update":
                console.log("update detected at backend");
                io.of("/api/socket").emit("updateOrder", change.documentKey._id);
                break;
            case "delete":
                console.log("deletion detected at backend")
                io.of("/api/socket").emit("deleteOrder", change.documentKey._id);
                break;
        }
    })  
})

// Handle routes requests
app.use('/customer', customer); 
app.use('/vendor', vendor);
app.use('/order', order);

if(process.env.NODE_ENV === 'production') {
    // Serve static files from the React app
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) => { res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')); });
}

server.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) })