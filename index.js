const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./Routes/userRoutes');
const affiliateRoutes = require('./Routes/affiliateRoutes');
const socketHandler = require('./sockets/socketHandler');
const errorHandler = require("./Middleware/errorMiddleware");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();

const chatRoutes = require('./Routes/ChatRoutes')
const categories = require('./Routes/Category')
const Product = require('./Routes/Products')
const upload = require('./Routes/imageUploadRoutes')
const Slider = require('./Routes/Slider')
const PathaoRoutes = require('./Routes/PathaoRoutes')
const ecourierRoutes = require('./Routes/ecourierRoutes')
const DivisionDistrictsRoutes = require('./Routes/DivisionDistrictsRoutes')
const Services = require('./Routes/ServiceRoutes')
const serviceCategoryRoutes = require('./Routes/serviceCategoryRoutes');
const seller = require('./Routes/SellerRoutes');
const installation = require('./Routes/InstallRoutes');

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI);

app.use('/api', userRoutes(io));
app.use('/api', affiliateRoutes(io));
app.use('/api/chat', chatRoutes(io));
app.use('/api', categories);
app.use('/api', Product);
app.use('/api', upload);
app.use('/api', Slider);
app.use('/api', PathaoRoutes);
app.use('/api', ecourierRoutes);
app.use('/api', DivisionDistrictsRoutes);
app.use('/api', Services);
app.use('/api', serviceCategoryRoutes);
app.use('/api', seller(io));
app.use('/api',installation);

app.use(errorHandler);
io.on('connection', socketHandler);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
