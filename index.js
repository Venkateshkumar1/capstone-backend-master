const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const mongoose = require("mongoose");
const User = require("./models/user");
const Teacher = require("./models/teacher");
const Query = require("./models/query");

// app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type']
}));

// Connecting DB 
const dbURI = "mongodb://0.0.0.0:27017/queryResolving"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(PORT, () => {
        console.log(`Node server started on port ${PORT}`);});
        console.log("Mongo DB queryResolving connected.." + result);
    })
    .catch((err) => console.log("Error connecting DB.." + err))
    ;


app.post("/createUser", async (req, res) => {
    console.log("createUser function execution..");
    const user = new User({
        userName: req.body.userName,
        password: req.body.password,
        name: req.body.name,
        mobile: req.body.mobile
    });
    user.save()
        .then((result) => res.send(result))
        .catch((err) => console.log(err))
        ;
});

app.post("/createTeacher", async (req, res) => {
    console.log("createTeacher function execution..");
    const teacher = new Teacher({
        userName: req.body.userName,
        password: req.body.password,
        name: req.body.name,
        mobile: req.body.mobile
    });
    teacher.save()
        .then((result) => res.send(result))
        .catch((err) => console.log(err))
        ;
});

app.post("/studentLogin", async (request, responce) => {
    console.log("req: " + request.toString());
    const { userName, password } = request.body;
    console.log("UserName:" + userName);
    console.log("Password:" + password);

    if (!userName || !password) {
        return responce.status(400).send('Username and password are required');
    }

    try {
        const user = await User.findOne({ userName });
        console.log("User Info: " + user);
        if (!user) {
            return responce.status(404).send('User not found');
        }
        if (password !== user.password) {
            return responce.status(401).send('Incorrect password');
        }

        return responce.status(200).json(user);
    } catch (err) {
        return responce.status(500).send(err); // Return an error response
    }
});

app.post("/tracherLogin", async (req, res) => {
    const { userName, password } = req.body;
    console.log("UserName:" + userName);
    console.log("Password:" + password);

    if (!userName || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const teacher = await Teacher.findOne({ userName });
        console.log("Teacher Info: " + teacher);
        if (!teacher) {
            return res.status(404).send('User not found');
        }
        if (password !== teacher.password) {
            return res.status(401).send('Incorrect password');
        }

        return res.status(200).json(teacher);
    } catch (err) {
        console.log("Error: " + err);
        return res.status(500).send(err); // Return an error response
    }
});

app.post("/createQuery", async (req, res) => {
    console.log("createQuery function execution..");
    const query = new Query({
        userId: req.body.userId,
        userName: req.body.userName,
        issue: req.body.issue
    });
    query.save()
        .then((result) => res.send(result))
        .catch((err) => console.log(err))
        ;
});

// Create a GET route to filter the columns having empty values
app.get('/getQueryData', async (req, res) => {
    try {
        // Find the data with empty values using $or operator
        const data = await Query.find({ $or: [{ solution: null }] });

        // Check if the data exists
        if (!data) {
            return res.status(404).send('Data not found');
        }

        // Return a success response with the filtered data
        return res.status(200).json(data);
    } catch (err) {
        // Return an error response
        return res.status(500).send(err);
    }
});

app.get('/getAllData', async (req, res) => {
    try {
        const userId = req.query.userId;
        const data = await Query.find({ userId: { $regex: userId, $options: 'i' }});

        // Check if the data exists
        if (!data) {
            return res.status(404).send('Data not found');
        }

        // Return a success response with the filtered data
        console.log("Student Query: " + data);
        return res.status(200).json(data);
    } catch (err) {
        // Return an error response
        return res.status(500).send(err);
    }
});

app.put('/updateQuery/:objectId', (req, res) => {
    const { objectId } = req.params;

    // find the document to update
    Query.findOne({ _id: objectId })
        .then(doc => {
            if (doc) {
                console.log("DOC: " + doc);
                const { solution, resolverId, resolverName } = req.body;
                // update the document
                doc.solution = solution;
                doc.resolverId = resolverId;
                doc.resolverName = resolverName;
                return doc.save();
            } else {
                throw new Error('Document not found');
            }
        })
        .then(updatedDoc => {
            console.log('Document updated:', updatedDoc);
            return res.status(200).json(updatedDoc);
        })
        .catch(err => {
            console.error(err);
        });
});