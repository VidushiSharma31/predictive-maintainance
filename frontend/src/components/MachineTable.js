import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import { ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { getMachines } from '../api';

const MachineTable = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const data = await getMachines();
      
      // Filter machines based on user role
      const filteredData = filterMachinesByRole(data, userRole);
      setMachines(filteredData);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Function to filter machines based on user role
  const filterMachinesByRole = (machines, role) => {
    switch (role) {
      case 'admin':
        return machines; // Admin sees all machines
      case 'opH':
        return machines.filter(machine => 
          machine['Type'] === 'H' || machine.type === 'H'
        );
      case 'opM':
        return machines.filter(machine => 
          machine['Type'] === 'M' || machine.type === 'M'
        );
      case 'opL':
        return machines.filter(machine => 
          machine['Type'] === 'L' || machine.type === 'L'
        );
      default:
        return [];
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'opH': return 'Operator H (High Type)';
      case 'opM': return 'Operator M (Medium Type)';
      case 'opL': return 'Operator L (Low Type)';
      default: return role;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Predictive Maintenance Dashboard
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mr: 2, 
              backgroundColor: 'primary.light',
              padding: '4px 12px',
              borderRadius: '16px',
              color: 'primary.dark'
            }}
          >
            {getRoleLabel(userRole)}
          </Typography>
          <IconButton onClick={handleLogout} color="inherit" title="Logout">
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Total Machines: {machines.length}
      </Typography>

      {machines.length === 0 ? (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          No machines available for your role.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Air Temperature (K)</TableCell>
                <TableCell>Process Temperature (K)</TableCell>
                <TableCell>Rotational Speed (rpm)</TableCell>
                <TableCell>Torque (Nm)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {machines.map((machine, index) => (
                <TableRow 
                  key={index} 
                  hover
                  sx={{
                    backgroundColor: 
                      machine['Type'] === 'H' ? '#fff3e0' :
                      machine['Type'] === 'M' ? '#e8f5e9' :
                      machine['Type'] === 'L' ? '#e3f2fd' :
                      'inherit'
                  }}
                >
                  <TableCell>{machine['Product ID'] || machine.productId}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: 
                          machine['Type'] === 'H' ? '#ffebee' :
                          machine['Type'] === 'M' ? '#e8f5e9' :
                          machine['Type'] === 'L' ? '#e3f2fd' :
                          'inherit',
                        color:
                          machine['Type'] === 'H' ? '#c62828' :
                          machine['Type'] === 'M' ? '#2e7d32' :
                          machine['Type'] === 'L' ? '#1565c0' :
                          'inherit'
                      }}
                    >
                      {machine['Type'] || machine.type}
                    </Box>
                  </TableCell>
                  <TableCell>{machine['Air temperature [K]'] || machine.airTemp}</TableCell>
                  <TableCell>{machine['Process temperature [K]'] || machine.processTemp}</TableCell>
                  <TableCell>{machine['Rotational speed [rpm]'] || machine.rotationalSpeed}</TableCell>
                  <TableCell>{machine['Torque [Nm]'] || machine.torque}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MachineTable;