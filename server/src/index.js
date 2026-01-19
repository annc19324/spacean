const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const appRoutes = require('./routes/apps');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/apps', appRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('SpaceAn API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
