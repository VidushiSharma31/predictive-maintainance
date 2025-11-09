const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Role-based credentials
const ROLE_CREDENTIALS = {
  admin: { password: 'admin123', access: 'full' },
  opH: { password: 'opH123', access: 'high' },
  opM: { password: 'opM123', access: 'medium' },
  opL: { password: 'opL123', access: 'low' }
};

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log('Auth Route Request:', {
    method: req.method,
    path: req.path,
    body: req.body
  });
  next();
});

router.post('/login', (req, res) => {
  try {
    const { role, password } = req.body;
    console.log('Login attempt:', { role, password }); // Debug log

    // Validate input
    if (!role || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Role and password are required' });
    }

    if (!ROLE_CREDENTIALS[role]) {
      console.log('Invalid role:', role);
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (ROLE_CREDENTIALS[role].password !== password) {
      console.log('Invalid password for role:', role);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { role, access: ROLE_CREDENTIALS[role].access },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '8h' }
    );

    console.log('Login successful for role:', role);
    res.json({
      token,
      role,
      access: ROLE_CREDENTIALS[role].access
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;