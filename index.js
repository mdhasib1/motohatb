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
const path = require('path');

const chatRoutes = require('./Routes/ChatRoutes')
const categories = require('./Routes/Category')
const Subcategory = require('./Routes/SubCategory')
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
const Protect = require('./Routes/ProtectRoutes');
const chargeRoutes = require('./Routes/chargeRoutes');
const deliveryChargeRoutes = require('./Routes/deliveryChargeRoutes');
const notificationRoutes = require('./Routes/notificationRoutes');
const guestUserRoutes = require('./Routes/guestUserRoutes');

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});


app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI);

app.use('/api', userRoutes(io));
app.use('/api', affiliateRoutes(io));
app.use('/api', chatRoutes);
app.use('/api', categories);
app.use('/api', Subcategory);
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
app.use('/api',Protect);
app.use('/api',chargeRoutes);
app.use('/api',deliveryChargeRoutes);
app.use('/api',notificationRoutes);
app.use('/api/guest', guestUserRoutes);

const reactAppBuildPath = path.join(__dirname, '..', 'frontend', 'motohat');
app.use(express.static(reactAppBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(reactAppBuildPath, 'index.html'));
});

app.use(errorHandler);
io.on('connection', socketHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
