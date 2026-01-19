const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const appRoutes = require('./routes/apps');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');
const socialLinkRoutes = require('./routes/socialLinks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/apps', appRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/social-links', socialLinkRoutes);

app.get('/', (req, res) => {
    res.send('SpaceAn API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
