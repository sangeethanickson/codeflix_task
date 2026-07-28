const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Leave = require('./models/Leave');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'super_secret_hr_key';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tr3_hr_db')
  .then(() => console.log('HR Database Connected'))
  .catch(err => console.error(err));


app.put('/api/leave/approve', async (req, res) => {
  try {
    const { leaveId, isAdmin } = req.body;

    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status: 'Approved' },
      { new: true }
    );

    res.json({ message: 'Leave request approved successfully', updatedLeave });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/leave/all', async (req, res) => {
  try {
    
    const allLeaves = await Leave.find(); 
    
    console.log(`[DB ALERT] Fetched ${allLeaves.length} records into Node.js heap memory!`);
    res.json(allLeaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/login', (req, res) => {
  const token = jwt.sign({ userId: 'EMP_101', role: 'Employee' }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`HR Backend running on port ${PORT}`));