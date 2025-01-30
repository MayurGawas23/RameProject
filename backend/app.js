
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
app.use(cookieParser());
const cors = require('cors')
const connectDb = require('./db/db')
const path = require('path')
app.use(express.static(path.join(__dirname, "public")));
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const articleRoutes = require("./routes/articleRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use(cors({
   origin: '*', // Allow requests from your frontend React app
   methods: 'GET,POST,PUT,DELETE', // Allow the methods you use
   allowedHeaders: 'Content-Type,Authorization', // Allow necessary headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
const  AdminRoutes  = require('./routes/editorRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
app.use(errorMiddleware)
const nodemailer = require('nodemailer')
const journalRoutes = require('./routes/journalRoutes')
const axios = require('axios')
const upload = require('./utils/fileUpload')



connectDb();





app.get('/', (req, res) => { 
   res.send("html");
 });

app.use('/users', userRoutes);
app.use('/form', contactRoutes);
app.use('/admin', AdminRoutes)
app.use('/api', journalRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/reviews", reviewRoutes);







module.exports = app;