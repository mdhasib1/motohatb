const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const passport = require('passport');
const userRoutes = require('./Routes/userRoutes');
const affiliateRoutes = require('./Routes/affiliateRoutes');
const socketHandler = require('./socket/socketHandler');
const errorHandler = require("./middlewares/errorMiddleware");
require('dotenv').config();
const cors = require("cors");
const app = express();
const path = require('path');
const cookieSession = require('cookie-session');
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
const locationRoutes = require('./Routes/locationRoutes');
const blog = require('./Routes/BlogRoutes');
const coupon = require('./Routes/couponRoutes');
const categoriessection = require('./Routes/categorySectionRoutes');
const authentication = require('./Routes/authRoutes')
const authService = require('./services/authService');
authService(passport);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.10.35:3000"],
    credentials: true,
  })
);
app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());


const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.10.35:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.use(bodyParser.json());


app.use('/api', userRoutes(io));
app.use('/api', affiliateRoutes(io));
app.use('/api', chatRoutes);
app.use('/api/categories', categories);
app.use('/api', categoriessection);
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
app.use('/api', locationRoutes);
app.use('/api', blog);
app.use('/api', coupon);
app.use('/api', authentication);

connectDB();


const reactAppBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
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
