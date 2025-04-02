const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');


//Collection for user credentials
const UserDetails = require('./models/UserDetails');
const bcrypt = require('bcrypt');

//Collection for ContactMessage
const contactmessages = require('./models/ContactMessage');


//for session
const session = require('express-session');
//for storing session in mongoDB
const MongoDBStore = require('connect-mongodb-session')(session);
// Configure MongoDBStore
const store = new MongoDBStore({
    uri: 'mongodb+srv://studysage000:studysage24052003@studysagedb.houi6gq.mongodb.net/One_For_All?retryWrites=true&w=majority&appName=StudySageDB', // MongoDB connection URI
    collection: 'sessiondatas' // Collection name for storing sessions
});
// Catch errors
store.on('error', function (error) {
    console.error('Error in MongoDBStore:', error);
});
// Define sessionDataSchema
const sessionDataSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails', // Reference to the User collection
        required: true
    },
    recentlyReadPDFs: [{
        type: String, // Assuming storing paths of PDFs
        required: true
    }],
    studyPlanDetails: {
        selectedPdfName: {
            type: String,
            required: true
        },
        pdfPath: {
            type: String,
            required: true
        },
        pdfRoute: {
            type: String,
            required: true
        },
        completionDate: {
            type: Date,
            required: true
        },
        notificationCheckbox: {
            type: Boolean,
            default: false // Assuming default value is false if not provided
        }
    }
});
// Create a model for session data
const sessiondatas = mongoose.model('sessiondatas', sessionDataSchema);

// Example data for creating a new session data document
// const newData = {
//     userID: new mongoose.Types.ObjectId(),
//     recentlyReadPDFs: ['/path/to/pdf1.pdf', '/path/to/pdf2.pdf'],
//     studyPlanDetails: {
//         selectedPdfName: 'Sample PDF',
//         pdfPath: '/path/to/sample.pdf',
//         pdfRoute: '/sample-route',
//         completionDate: new Date('2024-03-31'),
//         notificationCheckbox: true
//     }
// };
// Create a new instance of SessionData model
// const newSessionData = new sessiondatas(newData);
// Save the document to MongoDB
// newSessionData.save()
//     .then(savedData => {
//         console.log('Document saved successfully:', savedData);
//     })
//     .catch(error => {
//         console.error('Error saving document:', error);
//     });


// Set up session middleware
app.use(session({
    secret: 'KhanFaizan24052003',
    resave: false,
    saveUninitialized: false,
    store: store // Use MongoDBStore for session storage
}));


// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// line to set the MIME type for JavaScript files
app.use(express.static('public', { 'Content-Type': 'application/javascript' }));
// Serve static files from the 'icons' dire ctory
app.use('/icons', express.static(path.join(__dirname, 'icons')));
// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));
// Serve static files from node_modules
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
// to use express.json
app.use(express.json());


// connect to mongodb
const dbURI = "mongodb+srv://studysage000:studysage24052003@studysagedb.houi6gq.mongodb.net/One_For_All?retryWrites=true&w=majority&appName=StudySageDB";
mongoose.connect(dbURI)
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server by connecting to the port
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => console.error('Error connecting to MongoDB:', error));


// Route to render the aboutUs.ejs file
app.get('/about', (req, res) => {
    res.render('aboutUs', { title: 'About Us', toggleID: 'toggle-button-about' });
});
// Route to render the resourcePage.ejs file
app.get('/resource', (req, res) => {
    res.render('resourcePage', { title: 'Resources', toggleID: 'toggle-button-resource' });
});
// Route to render the Bsc IT Page.ejs file
app.get('/resource/bsc-it', (req, res) => {
    res.render('bscITResourcePage', { title: 'BSC-IT', toggleID: 'toggle-button-bscit' });
});
// Route to render the Msc IT Page.ejs file
app.get('/resource/msc-it', (req, res) => {
    res.render('mscITResourcePage', { title: 'MSC-IT', toggleID: 'toggle-button-mscit' });
});
// Route to render the Bsc CS Page.ejs file
app.get('/resource/bsc-cs', (req, res) => {
    res.render('bscCSResourcePage', { title: 'BSC-CS', toggleID: 'toggle-button-bsccs' });
});
// Route to render the MCA Page.ejs file
app.get('/resource/mca', (req, res) => {
    res.render('MCAResourcePage', { title: 'MCA', toggleID: 'toggle-button-mca' });
});
// Route to render the contactUs.ejs file
app.get('/contact', (req, res) => {
    res.render('contactUs', { title: 'Contact Us', toggleID: 'toggle-button-contact' });
});
// Route to render the studyTips.ejs file
app.get('/study-tips', (req, res) => {
    res.render('studyTips', { title: 'Study Tips, Techniques & Motivation', toggleID: 'toggle-button-studytips' });
});


// sign in and sign up
// requireAuthentication middleware
const requireAuthentication = (req, res, next) => {
    // If there is an active session (i.e., the user is authenticated), proceed to the next middleware
    if (req.session.userID) {
        next();
    } else {
        res.render('signInPage', { title: 'Sign In', toggleID: 'toggle-button-signin' });
    }
};

// Route to render the signInPage.ejs file
app.get('/sign-in', requireAuthentication, (req, res) => {
    res.redirect('/profile');
});

// Route to handle sign-in form submission
app.post('/sign-in', async (req, res) => {
    try {
        const { user_email, user_password } = req.body;

        // Find user in MongoDB by email
        const user = await UserDetails.findOne({ user_email: user_email });

        if (!user) {
            // User not found, return error
            return res.status(401).json({ message: 'No such user exists!' });
        }

        // Compare hashed password from database with password provided by the user
        const passwordsMatch = await bcrypt.compare(user_password, user.user_password);

        if (passwordsMatch) {
            //store session
            req.session.userID = user._id.toString(); // Convert ObjectId to string and store it in the session
            // Passwords match, user is authenticated
            res.status(200).json({ message: 'You have been signed in successfully!' });
        } else {
            // Passwords don't match, return error
            return res.status(401).json({ message: 'Incorrect password!' });
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to render the signUpPage.ejs file
app.get('/sign-up', (req, res) => {
    res.render('signUpPage', { title: 'Sign Up', toggleID: 'toggle-button-signup' });
});

// Route to handle sign-up form submission
app.post('/sign-up', async (req, res) => {
    try {
        // Extract user data from the request body
        const { user_name, user_email, user_password, confirmPassword } = req.body;
        if (!user_name || !user_email || !user_password || !confirmPassword) {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
        if (user_password != confirmPassword) {
            return res.status(400).json({ error: 'Password and confirm password should match' });
        }


        //user_name should contain alphabets only
        // Regular expression to match alphabetic characters only
        let alphabeticRegex = /^[a-zA-Z\s]+$/;
        // Test if the user_name consists only of alphabetic characters
        let isAlphabetic = alphabeticRegex.test(user_name);
        if (!isAlphabetic) {
            return res.status(400).json({ error: 'Name should only contain alphabets!' });
        }

        const existingUser = await UserDetails.findOne({ user_email });
        // If the email already exists, send a response indicating account already exists
        if (existingUser) {
            return res.status(400).json({ error: 'Account already exists with this email address' });
        }
        // Hash the password before saving it to the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user_password, saltRounds);
        // Create a new user instance
        const newUser = new UserDetails({
            user_name,
            user_email,
            user_password: hashedPassword //storing hashed password
        });
        // Save the user to the database
        await newUser.save();
        // Send success response
        res.status(201).json({ message: 'Your account is created successfully!' });
    } catch (error) {
        // Handle error
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to render the signOutPage.ejs file
app.get('/sign-out', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('signOutPage', { title: 'Signed Out!', toggleID: 'toggle-button-signout' });
        }
    });
});

//middle for getting users data
const getUserDataMiddleware = async (req, res, next) => {
    try {
        if (req.session.userID) {
            const user = await UserDetails.findById(req.session.userID);
            if (user) {
                req.user = user; // Attach user data to the request object
            }
        }
        next();
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Middleware to update session data
const updateSessionMiddleware = async (req, res, next) => {
    try {
        if (req.session.userID && req.pdfPath !== undefined) {
            let sessionData = await sessiondatas.findOne({ userID: req.session.userID });
            if (!sessionData) {
                // Create a new session data document if it doesn't exist
                sessionData = new sessiondatas({
                    userID: req.session.userID,
                    recentlyReadPDFs: [],
                    studyPlanDetails: {
                        completionDate: new Date(),
                        pdfRoute: 'default route', // Provide default values for required fields
                        pdfPath: 'default path',
                        selectedPdfName: 'default name'
                    }
                });
            }

            // Update the recentlyReadPDFs array
            sessionData.recentlyReadPDFs = sessionData.recentlyReadPDFs.filter(path => path !== req.pdfPath);
            sessionData.recentlyReadPDFs.unshift(req.pdfPath);
            if (sessionData.recentlyReadPDFs.length > 5) {
                sessionData.recentlyReadPDFs = sessionData.recentlyReadPDFs.slice(0, 5);
            }

            // Save the updated session data
            const updatedSessionData = await sessionData.save();

            // Log the updated session data
            console.log("Updated sessionData:", updatedSessionData);

            // Attach sessionData to req object for easy access
            req.sessionData = updatedSessionData;
        }
    } catch (error) {
        console.error('Error updating session data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    next();
};



// ----------------------------------------  BSC IT  ----------------------------------------

// ----------------------------------------  SEMESTER 1  ----------------------------------------
//route for bscit semester 1
app.get('/resource/bscit/semester1', (req, res) => {
    res.render('../semesters/bscit/semester1', { title: 'Bsc-I.T. Semester 1', toggleID: 'toggle-button-bscit-semester1' });
});

// ----------------------------------------  IMPERATIVE PROGRAMMING  ----------------------------------------
//route for semester 1 IMPERATIVE PROGRAMMING chapters
app.get('/resource/bscit/semester1/imperative-programming', (req, res) => {
    res.render('../semesters/bscit/semester 1/imperative programming/imperative programming', { title: 'Imperative Programming', toggleID: 'toggle-button-bscit-IP' });
});

//route for ip notes 1
app.get('/ip%20notes%201', (req, res) => {
    res.render('../semesters/bscit/semester 1/imperative programming/ip notes 1', { title: 'Imperative Programming | Notes', toggleID: 'toggle-button-bscit-ipnotes1' });
});

//routes for CHAPTERS IN IP NOTES 1

//CHAPTER 1 - INTRODUCTION
// route for reading the pdf and updating session for recently read pdfs
app.get('/ip%20notes%201/1-Introduction', (req, res, next) => {
    const fileName = '1-Introduction by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName);
    // Pass the PDF path to the middleware
    req.pdfPath = pdfPath;
    // Call the updateSessionMiddleware to update session data
    updateSessionMiddleware(req, res, next);
}, (req, res) => {
    // Send the PDF file
    res.sendFile(req.pdfPath);
});
//route to download the pdf file
app.get('/ip%20notes%201/1-Introduction/download', (req, res) => {
    // Construct the file path
    const fileName = '1-Introduction by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName); // Assuming the folder 'StudySage Resources' is located one level above the current directory
    // Set Content-Disposition header to attachment
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    // Set Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    // Send the PDF file
    res.sendFile(pdfPath, function (err) {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
});

//CHAPTER 2 - C FUNDAMENTALS
//route for reading the pdf and updating session for recently read pdfs
app.get('/ip%20notes%201/2-C%20Fundamentals', (req, res, next) => {
    const fileName = '2-C Fundamentals by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName);
    // Pass the PDF path to the middleware
    req.pdfPath = pdfPath;
    // Call the updateSessionMiddleware to update session data
    updateSessionMiddleware(req, res, next);
}, (req, res) => {
    // Send the PDF file
    res.sendFile(req.pdfPath);
});
//route to download the pdf file
app.get('/ip%20notes%201/2-C%20Fundamentals/download', (req, res) => {
    // Construct the file path
    const fileName = '2-C Fundamentals by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName); // Assuming the folder 'StudySage Resources' is located one level above the current directory
    // Set Content-Disposition header to attachment
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    // Set Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    // Send the PDF file
    res.sendFile(pdfPath, function (err) {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
});

//CHAPTER 3- OPERATORS AND EXPRESSION
//route for reading the pdf and updating session for recently read pdfs
app.get('/ip%20notes%201/3-Operators%20and%20Expression', (req, res, next) => {
    const fileName = '3-Operators and Expression by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName);
    // Pass the PDF path to the middleware
    req.pdfPath = pdfPath;
    // Call the updateSessionMiddleware to update session data
    updateSessionMiddleware(req, res, next);
}, (req, res) => {
    // Send the PDF file
    res.sendFile(req.pdfPath);
});
//route to download the pdf file
app.get('/ip%20notes%201/3-Operators%20and%20Expression/download', (req, res) => {
    // Construct the file path
    const fileName = '3-Operators and Expression by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName); // Assuming the folder 'StudySage Resources' is located one level above the current directory
    // Set Content-Disposition header to attachment
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    // Set Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    // Send the PDF file
    res.sendFile(pdfPath, function (err) {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
});

//CHAPTER 4- DATA INPUT AND OUTPUT
//route for reading the pdf and updating session for recently read pdfs
app.get('/ip%20notes%201/4-Data%20Input%20and%20Output', (req, res, next) => {
    const fileName = '4-Data Input and Output by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName);
    // Pass the PDF path to the middleware
    req.pdfPath = pdfPath;
    // Call the updateSessionMiddleware to update session data
    updateSessionMiddleware(req, res, next);
}, (req, res) => {
    // Send the PDF file
    res.sendFile(req.pdfPath);
});
//route to download the pdf file
app.get('/ip%20notes%201/4-Data%20Input%20and%20Output/download', (req, res) => {
    // Construct the file path
    const fileName = '4-Data Input and Output by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName); // Assuming the folder 'StudySage Resources' is located one level above the current directory
    // Set Content-Disposition header to attachment
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    // Set Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    // Send the PDF file
    res.sendFile(pdfPath, function (err) {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
});

//CHAPTER 5-Conditional Statements and Loops
//route for reading the pdf and updating session for recently read pdfs
app.get('/ip%20notes%201/5-Conditional%20Statements%20and%20Loops', (req, res, next) => {
    const fileName = '5-Conditional Statements and Loops by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName);
    // Pass the PDF path to the middleware
    req.pdfPath = pdfPath;
    // Call the updateSessionMiddleware to update session data
    updateSessionMiddleware(req, res, next);
}, (req, res) => {
    // Send the PDF file
    res.sendFile(req.pdfPath);
});
//route to download the pdf file
app.get('/ip%20notes%201/5-Conditional%20Statements%20and%20Loops/download', (req, res) => {
    // Construct the file path
    const fileName = '5-Conditional Statements and Loops by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName); // Assuming the folder 'StudySage Resources' is located one level above the current directory
    // Set Content-Disposition header to attachment
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    // Set Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    // Send the PDF file
    res.sendFile(pdfPath, function (err) {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
});

//CHAPTER 6-Functions
//route for reading the pdf and updating session for recently read pdfs
app.get('/ip%20notes%201/6-Functions', (req, res, next) => {
    const fileName = '6-Functions by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName);
    // Pass the PDF path to the middleware
    req.pdfPath = pdfPath;
    // Call the updateSessionMiddleware to update session data
    updateSessionMiddleware(req, res, next);
}, (req, res) => {
    // Send the PDF file
    res.sendFile(req.pdfPath);
});
//route to download the pdf file
app.get('/ip%20notes%201/6-Functions/download', (req, res) => {
    // Construct the file path
    const fileName = '6-Functions by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName); // Assuming the folder 'StudySage Resources' is located one level above the current directory
    // Set Content-Disposition header to attachment
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    // Set Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    // Send the PDF file
    res.sendFile(pdfPath, function (err) {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
});

//CHAPTER 7-Program Structure
//route for reading the pdf and updating session for recently read pdfs
app.get('/ip%20notes%201/7-Program%20Structure', (req, res, next) => {
    const fileName = '7-Program Structure by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName);
    // Pass the PDF path to the middleware
    req.pdfPath = pdfPath;
    // Call the updateSessionMiddleware to update session data
    updateSessionMiddleware(req, res, next);
}, (req, res) => {
    // Send the PDF file
    res.sendFile(req.pdfPath);
});
//route to download the pdf file
app.get('/ip%20notes%201/7-Program%20Structure/download', (req, res) => {
    // Construct the file path
    const fileName = '7-Program Structure by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName); // Assuming the folder 'StudySage Resources' is located one level above the current directory
    // Set Content-Disposition header to attachment
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    // Set Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    // Send the PDF file
    res.sendFile(pdfPath, function (err) {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
});

//CHAPTER 8-Arrays
//route for reading the pdf and updating session for recently read pdfs
app.get('/ip%20notes%201/8-Arrays', (req, res, next) => {
    const fileName = '8-Arrays by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName);
    // Pass the PDF path to the middleware
    req.pdfPath = pdfPath;
    // Call the updateSessionMiddleware to update session data
    updateSessionMiddleware(req, res, next);
}, (req, res) => {
    // Send the PDF file
    res.sendFile(req.pdfPath);
});
//route to download the pdf file
app.get('/ip%20notes%201/8-Arrays/download', (req, res) => {
    // Construct the file path
    const fileName = '8-Arrays by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName); // Assuming the folder 'StudySage Resources' is located one level above the current directory
    // Set Content-Disposition header to attachment
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    // Set Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    // Send the PDF file
    res.sendFile(pdfPath, function (err) {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
});

//CHAPTER 9-Pointers
//route for reading the pdf and updating session for recently read pdfs
app.get('/ip%20notes%201/9-Pointers', (req, res, next) => {
    const fileName = '9-Pointers by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName);
    // Pass the PDF path to the middleware
    req.pdfPath = pdfPath;
    // Call the updateSessionMiddleware to update session data
    updateSessionMiddleware(req, res, next);
}, (req, res) => {
    // Send the PDF file
    res.sendFile(req.pdfPath);
});
//route to download the pdf file
app.get('/ip%20notes%201/9-Pointers/download', (req, res) => {
    // Construct the file path
    const fileName = '9-Pointers by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName); // Assuming the folder 'StudySage Resources' is located one level above the current directory
    // Set Content-Disposition header to attachment
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    // Set Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    // Send the PDF file
    res.sendFile(pdfPath, function (err) {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
});

//CHAPTER 10-Structures and Unions
//route for reading the pdf and updating session for recently read pdfs
app.get('/ip%20notes%201/10-Structures%20and%20Unions', (req, res, next) => {
    const fileName = '10-Structures and Unions by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName);
    // Attach pdfPath to the request object
    req.pdfPath = pdfPath;
    // Call the next middleware
    next();
}, updateSessionMiddleware, (req, res) => {
    // Send the PDF file
    res.sendFile(req.pdfPath);
});

//route to download the pdf file
app.get('/ip%20notes%201/10-Structures%20and%20Unions/download', (req, res) => {
    // Construct the file path
    const fileName = '10-Structures and Unions by StudySage.pdf';
    const filePath = '/StudySage Resources/BSC IT/SEMESTER 1/Imperative Programming/IP Notes 1';
    const pdfPath = path.join(__dirname, filePath, fileName); // Assuming the folder 'StudySage Resources' is located one level above the current directory
    // Set Content-Disposition header to attachment
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    // Set Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    // Send the PDF file
    res.sendFile(pdfPath, function (err) {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
});



//route for ip notes 2
app.get('/resource/bscit/semester1/imperative%20programming/ip%20notes%202', (req, res) => {
    res.render('../semesters/bscit/chapters semester1/ip notes 2', { title: 'Imperative Programming | Notes', toggleID: 'toggle-button-bscit-ipnotes2' });
});



// Middleware to fetch session data
const fetchSessionDataMiddleware = async (req, res, next) => {
    try {
        if (req.session.userID) {
            const sessionData = await sessiondatas.findOne({ userID: req.session.userID });
            // Check if sessionData exists and has recentlyReadPDFs array
            if (sessionData && Array.isArray(sessionData.recentlyReadPDFs)) {
                req.recentlyReadPDFs = sessionData.recentlyReadPDFs; // Assign recentlyReadPDFs array to request object
            } else {
                req.recentlyReadPDFs = []; // Default to an empty array if sessionData or recentlyReadPDFs is not valid
            }
        } else {
            req.recentlyReadPDFs = []; // Default to an empty array if userID is missing in session
        }
        next();
    } catch (error) {
        console.error('Error fetching session data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// for mapping the route according to the pdfPath
const pdfRoutes = {
    // semester 1 > imperative programming > ip notes 1
    'D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\1-Introduction by StudySage.pdf': '/ip%20notes%201/1-Introduction',
    'D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\2-C Fundamentals by StudySage.pdf': '/ip%20notes%201/2-C%20Fundamentals',
    'D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\3-Operators and Expression by StudySage.pdf': '/ip%20notes%201/3-Operators%20and%20Expression',
    'D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\4-Data Input and Output by StudySage.pdf': '/ip%20notes%201/4-Data%20Input%20and%20Output',
    'D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\5-Conditional Statements and Loops by StudySage.pdf': '/ip%20notes%201/5-Conditional%20Statements%20and%20Loops',
    'D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\6-Functions by StudySage.pdf': '/ip%20notes%201/6-Functions',
    'D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\7-Program Structure by StudySage.pdf': '/ip%20notes%201/7-Program%20Structure',
    'D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\8-Arrays by StudySage.pdf': '/ip%20notes%201/8-Arrays',
    'D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\9-Pointers by StudySage.pdf': '/ip%20notes%201/9-Pointers',
    'D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\10-Structures and Unions by StudySage.pdf': '/ip%20notes%201/10-Structures%20and%20Unions',
};


// route for home
// Applying the middleware to routes we wanna display recentlyReadPDFs
app.get('/', getUserDataMiddleware, fetchSessionDataMiddleware, (req, res) => {
    const path = require('path');
    if (req.user) {
        const recentlyReadPDFs = req.recentlyReadPDFs.map(pdfPath => ({
            pdfName: path.basename(pdfPath),
            pdfRoute: pdfRoutes[pdfPath]
        }));

        res.render('index', {
            title: 'Home',
            toggleID: 'toggle-button-home',
            message: 'No recently read PDFs! Start Reading!',
            user: req.user,
            recentlyReadPDFs: recentlyReadPDFs
        });
    } else {
        res.render('index', {
            title: 'Home',
            toggleID: 'toggle-button-home',
            message: 'Sign-in to see recently used pdfs',
            recentlyReadPDFs: [],
            pdfRoutes: "",
            user: ""
        });
    }
});


app.get('/profile', requireAuthentication, getUserDataMiddleware, fetchSessionDataMiddleware, (req, res) => {
    // Render profile.ejs and pass recentlyReadPDFs array to the template
    if (req.user) {
        const path = require('path');
        res.render('profile', { title: 'Profile', user: req.user, toggleID: 'toggle-button-profile', path: path, recentlyReadPDFs: req.recentlyReadPDFs, pdfRoutes: pdfRoutes });
    } else {
        res.redirect('/sign-in'); // Redirect to sign-in if user is not logged in
    }
});



const pdfDetails = {
    '1-Introduction by StudySage.pdf': ['D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\1-Introduction by StudySage.pdf', '/ip%20notes%201/1-Introduction'],
    '2-C Fundamentals by StudySage.pdf': ['D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\2-C Fundamentals by StudySage.pdf', '/ip%20notes%201/2-C%20Fundamentals'],
    '3-Operators and Expression by StudySage.pdf': ['D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\3-Operators and Expression by StudySage.pdf', '/ip%20notes%201/3-Operators%20and%20Expression'],
    '4-Data Input and Output by StudySage.pdf': ['D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\4-Data Input and Output by StudySage.pdf', '/ip%20notes%201/4-Data%20Input%20and%20Output'],
    '5-Conditional Statements and Loops by StudySage.pdf': ['D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\5-Conditional Statements and Loops by StudySage.pdf', '/ip%20notes%201/5-Conditional%20Statements%20and%20Loops'],
    '6-Functions by StudySage.pdf': ['D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\6-Functions by StudySage.pdf', '/ip%20notes%201/6-Functions'],
    '7-Program Structure by StudySage.pdf': ['D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\7-Program Structure by StudySage.pdf', '/ip%20notes%201/7-Program%20Structure'],
    '8-Arrays by StudySage.pdf': ['D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\8-Arrays by StudySage.pdf', '/ip%20notes%201/8-Arrays'],
    '9-Pointers by StudySage.pdf': ['D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\9-Pointers by StudySage.pdf', '/ip%20notes%201/9-Pointers'],
    '10-Structures and Unions by StudySage.pdf': ['D:\\StudySage Project\\StudySage Resources\\BSC IT\\SEMESTER 1\\Imperative Programming\\IP Notes 1\\10-Structures and Unions by StudySage.pdf', '/ip%20notes%201/10-Structures%20and%20Unions'],
};


// Route to handle form submission
app.post('/submitStudyPlan', updateSessionMiddleware, async (req, res) => {
    try {
        // Extract form data from request body
        const formData = req.body;
        console.log('Form data:', formData);

        // Check if user is authenticated
        if (!req.session.userID) {
            // User is not authenticated, send error response
            return res.status(401).json({ error: 'User not authenticated. Please sign in first.' });
        }

        // Check if user is authenticated
        if (req.session.userID) {
            // User is authenticated, proceed with study plan submission

            // Extract selected PDF name from form data
            const selectedPdfName = formData.selectedPdf;

            // Retrieve PDF path and route from pdfDetails using selectedPdfName
            const pdfDetailsEntry = pdfDetails[selectedPdfName];
            const pdfPath = pdfDetailsEntry[0];
            const pdfRoute = pdfDetailsEntry[1];

            // Extract other form data
            const { completionDate, notificationCheckbox } = formData;

            // Create study plan details object
            const studyPlanDetails = {
                selectedPdfName,
                pdfPath,
                pdfRoute,
                completionDate,
                notificationCheckbox
            };

            // Find or create session data for the user
            let sessionData = await sessiondatas.findOne({ userID: req.session.userID });
            if (!sessionData) {
                sessionData = new sessiondatas({ userID: req.session.userID });
            }

            // Update session data with study plan details
            sessionData.studyPlanDetails = studyPlanDetails;

            // Save updated session data
            await sessionData.save();

            console.log('Session data updated:', sessionData);
            res.status(200).json({ message: 'Study plan submitted successfully.' });
        } else {
            // User is not authenticated, prompt user to sign in
            res.status(401).json({ error: 'User not authenticated. Please sign in first.' });
        }
    } catch (error) {
        console.error('Error submitting study plan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Define a route to render the studyPlan.ejs file
app.get('/study-plan', async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.session.userID) {
            return res.status(401).json({ error: 'User not authenticated. Please sign in first.' });
        }

        // Find session data for the user
        const sessionData = await sessiondatas.findOne({ userID: req.session.userID });

        if (!sessionData || !sessionData.studyPlanDetails) {
            return res.status(401).json({ error: 'Study plan details not found for the user.' });
        }

        // Extract study plan details
        const { selectedPdfName, pdfPath, pdfRoute, completionDate, notificationCheckbox } = sessionData.studyPlanDetails;

        // Pass study plan details and completion date to the client-side script
        res.render('studyPlan', {
            title: 'Study Plan', toggleID: 'toggle-button-studyplan',
            selectedPdfName,
            pdfPath,
            pdfRoute,
            completionDate,
            notificationCheckbox
        });
    } catch (error) {
        console.error('Error retrieving study plan details');
        res.status(401).json({ error: 'You need to Sign-in first!' });
    }
});


app.post('/submitContactForm', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Please provide name, email, and message.' });
        }
        //user_name should contain alphabets only
        // Regular expression to match alphabetic characters only
        let alphabeticRegex = /^[a-zA-Z\s]+$/;
        // Test if the user_name consists only of alphabetic characters
        let isAlphabetic = alphabeticRegex.test(name);
        if (!isAlphabetic) {
            return res.status(400).json({ error: 'Name should only contain alphabets!' });
        }

        const newMessage = new contactmessages({ name, email, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully!' });
        
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to submit message. Please try again.' });
    }
});
