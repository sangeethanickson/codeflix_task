const express = require('express');
const authRoutes = require('./authRoutes');
const leaveRoutes = require('./leaveRoutes');

const router = express.Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/', authRoutes);
router.use('/leave', leaveRoutes);

module.exports = router;
