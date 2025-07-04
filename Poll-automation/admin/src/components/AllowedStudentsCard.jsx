import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, TextField, Button, Stack, Box, Divider, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Tabs, Tab } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import GroupIcon from '@mui/icons-material/Group';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import TableViewIcon from '@mui/icons-material/TableView';
import * as XLSX from 'xlsx';
import axios from '../utils/axios';

const tabOptions = [
  { label: 'Single Add', value: 'single' },
  { label: 'Bulk Add', value: 'bulk' },
  { label: 'Excel/CSV Import', value: 'excel' },
];

const AllowedStudentsCard = () => {
  const [emails, setEmails] = useState([]);
  const [input, setInput] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showList, setShowList] = useState(false);
  const [tab, setTab] = useState('single');
  const fileInputRef = useRef();

  useEffect(() => {
    fetchAllowedStudents();
  }, []);

  const fetchAllowedStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/admin/auth/allowed-students');
      setEmails(res.data.allowedStudents || []);
    } catch (err) {
      setError('Failed to fetch allowed students');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const email = input.trim().toLowerCase();
    if (!email || emails.includes(email)) return;
    const updated = [...emails, email];
    setEmails(updated);
    setInput('');
    setError('');
    setSuccess('');
    try {
      await updateAllowedStudents(updated, true);
    } catch (err) {
      setEmails(emails);
      setError('Failed to add student');
    }
  };

  const handleBulkAdd = async () => {
    const newEmails = bulkInput
      .split(/[\n,;]/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e && !emails.includes(e));
    if (newEmails.length === 0) return;
    const updated = [...emails, ...newEmails];
    setEmails(updated);
    setBulkInput('');
    setError('');
    setSuccess('');
    try {
      await updateAllowedStudents(updated, true);
    } catch (err) {
      setEmails(emails);
      setError('Failed to add students');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const fileEmails = rows.flat().map(e => String(e).trim().toLowerCase()).filter(e => e && !emails.includes(e));
      if (fileEmails.length > 0) {
        const updated = [...emails, ...fileEmails];
        setEmails(updated);
        try {
          await updateAllowedStudents(updated, true);
        } catch (err) {
          setEmails(emails);
          setError('Failed to import students');
        }
      }
    } catch (err) {
      setError('Failed to parse file');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (emailToDelete) => {
    const updated = emails.filter(e => e !== emailToDelete);
    setEmails(updated);
    setError('');
    setSuccess('');
    try {
      await updateAllowedStudents(updated, true);
    } catch (err) {
      setEmails(emails);
      setError('Failed to remove student');
    }
  };

  const updateAllowedStudents = async (updated, skipSetEmails) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/admin/auth/allowed-students', { allowedStudents: updated });
      if (!skipSetEmails) setEmails(updated);
      setSuccess('Updated successfully');
    } catch (err) {
      setError('Failed to update allowed students');
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  return (
    <Paper elevation={4} sx={{
      p: { xs: 1.5, sm: 4 },
      maxWidth: { xs: '100%', sm: 700 },
      minWidth: 0,
      width: { xs: '100%', sm: '100%' },
      borderRadius: 2,
      minHeight: 420,
      bgcolor: theme => theme.palette.mode === 'dark' ? theme.palette.background.paper : '#f8fafc',
      color: theme => theme.palette.text.primary,
      boxShadow: theme => theme.palette.mode === 'dark' ? undefined : '0 2px 8px 0 #e0e7ef',
      border: theme => theme.palette.mode === 'dark' ? undefined : '1.5px solid #e0e7ff',
      mb: '20px',
      transition: 'box-shadow 0.2s, border-color 0.2s',
      boxSizing: 'border-box',
      '&:hover': {
        borderColor: theme => theme.palette.primary.main,
        boxShadow: theme => theme.palette.mode === 'dark'
          ? '0 4px 24px 0 rgba(99,102,241,0.18)'
          : '0 4px 24px 0 #b6c6f9',
      },
      '@media (max-width:600px)': {
        p: 1.5,
        borderRadius: 2,
        minWidth: 0,
        maxWidth: '100%',
        width: '100%',
        marginLeft: 0,
        marginRight: 0,
        boxSizing: 'border-box',
        mb: '10px',
        fontSize: '0.8rem',
      },
    }}>
      <Box display="flex" alignItems="center" gap={1} mb={1} sx={{ '@media (max-width:600px)': { gap: 0.3 } }}>
        <GroupIcon color="primary" sx={{ fontSize: { xs: 18, sm: 32 } }} />
        <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' } }}>
          Allowed Students
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" mb={2} sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
        Only these students will be able to access your quizzes. Add individually, in bulk, or import from Excel/CSV.
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {/* Tabs for add method */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 2, outline: 'none', boxShadow: 'none', border: 'none', '&:focus': { outline: 'none', boxShadow: 'none', border: 'none' }, minHeight: { xs: 24, sm: 48 }, fontSize: { xs: '0.8rem', sm: '1rem' } }}
        TabIndicatorProps={{ sx: { height: 3, borderRadius: 2 } }}
      >
        {tabOptions.map(opt => (
          <Tab
            key={opt.value}
            label={opt.label}
            value={opt.value}
            sx={{
              fontWeight: 600,
              outline: 'none',
              boxShadow: 'none',
              border: 'none',
              fontSize: { xs: '0.8rem', sm: '1rem' },
              minHeight: { xs: 24, sm: 48 },
              '&:focus': { outline: 'none', boxShadow: 'none', border: 'none' },
              '&.Mui-selected': {
                background: theme => theme.palette.action.selected,
                color: theme => theme.palette.primary.main,
              },
              '&:hover': {
                background: theme => theme.palette.action.hover,
                color: theme => theme.palette.primary.main,
              },
            }}
            disableRipple
          />
        ))}
      </Tabs>
      {/* Single Add */}
      {tab === 'single' && (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, px: { xs: 1, sm: 0 } }}>
          <TextField
            label="Add student email"
            size="small"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            disabled={loading}
            sx={{ width: { xs: '100%', sm: 'auto' }, boxSizing: 'border-box', '@media (max-width:600px)': { fontSize: '0.9rem', minHeight: 32 } }}
            InputProps={{ sx: { outline: 'none', boxShadow: 'none', border: 'none', '&:focus': { outline: 'none', boxShadow: 'none', border: 'none' } } }}
          />
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAdd}
            disabled={loading || !input.trim() || emails.includes(input.trim().toLowerCase())}
            sx={{ width: { xs: '100%', sm: 'auto' }, boxSizing: 'border-box', '@media (max-width:600px)': { fontSize: '0.9rem', minHeight: 32 } }}
            disableRipple
          >
            Add
          </Button>
        </Stack>
      )}
      {/* Bulk Add */}
      {tab === 'bulk' && (
        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2, px: { xs: 1, sm: 0 } }}>
          <TextField
            label="Bulk add (comma, semicolon, or newline separated)"
            size="small"
            multiline
            minRows={2}
            value={bulkInput}
            onChange={e => setBulkInput(e.target.value)}
            disabled={loading}
            sx={{ width: { xs: '100%', sm: 'auto' }, boxSizing: 'border-box', '@media (max-width:600px)': { fontSize: '0.9rem', minHeight: 32 } }}
            InputProps={{ sx: { outline: 'none', boxShadow: 'none', border: 'none', '&:focus': { outline: 'none', boxShadow: 'none', border: 'none' } } }}
          />
          <Button
            variant="outlined"
            onClick={handleBulkAdd}
            disabled={loading || !bulkInput.trim()}
            sx={{ width: { xs: '100%', sm: 'auto' }, boxSizing: 'border-box', '@media (max-width:600px)': { fontSize: '0.9rem', minHeight: 32 } }}
            disableRipple
          >
            Bulk Add
          </Button>
        </Stack>
      )}
      {/* Excel/CSV Import */}
      {tab === 'excel' && (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, px: { xs: 1, sm: 0 } }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            disabled={loading}
            sx={{ width: { xs: '100%', sm: 'auto' }, boxSizing: 'border-box', '@media (max-width:600px)': { fontSize: '0.9rem', minHeight: 32 } }}
            disableRipple
          >
            Import Excel/CSV
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              hidden
              onChange={handleFileUpload}
              ref={fileInputRef}
            />
          </Button>
        </Stack>
      )}
      <Divider sx={{ my: 2 }} />
      {/* Toggle student list */}
      <Button
        variant="outlined"
        startIcon={<TableViewIcon />}
        onClick={() => setShowList(v => !v)}
        sx={{ width: { xs: '100%', sm: 'auto' }, boxSizing: 'border-box', '@media (max-width:600px)': { fontSize: '0.9rem', minHeight: 32 } }}
        disabled={emails.length === 0}
        disableRipple
      >
        {showList ? 'Hide Students' : 'Show Students'}
      </Button>
      <Collapse in={showList}>
        <TableContainer sx={{ mt: 2, '@media (max-width:600px)': { maxWidth: '100%', width: '100%', overflowX: 'auto', boxSizing: 'border-box', fontSize: '0.8rem', p: 0 } }}>
          <Table size="small" stickyHeader sx={{ '@media (max-width:600px)': { fontSize: '0.8rem' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ '@media (max-width:600px)': { fontSize: '0.8rem', p: '4px 6px' } }}>#</TableCell>
                <TableCell sx={{ '@media (max-width:600px)': { fontSize: '0.8rem', p: '4px 6px' } }}>Email</TableCell>
                <TableCell align="right" sx={{ '@media (max-width:600px)': { fontSize: '0.8rem', p: '4px 6px' } }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emails.map((email, idx) => (
                <TableRow key={email} hover>
                  <TableCell sx={{ '@media (max-width:600px)': { fontSize: '0.8rem', p: '4px 6px' } }}>{idx + 1}</TableCell>
                  <TableCell sx={{ '@media (max-width:600px)': { fontSize: '0.8rem', p: '4px 6px' } }}>{email}</TableCell>
                  <TableCell align="right" sx={{ '@media (max-width:600px)': { fontSize: '0.8rem', p: '4px 6px' } }}>
                    <Tooltip title="Remove">
                      <span>
                        <IconButton
                          onClick={() => handleDelete(email)}
                          disabled={loading}
                          size="small"
                          color="error"
                          sx={{
                            outline: 'none',
                            boxShadow: 'none',
                            border: 'none',
                            '&:focus': { outline: 'none', boxShadow: 'none', border: 'none' },
                            '&:hover': {
                              background: theme => theme.palette.action.hover,
                              color: theme => theme.palette.error.main,
                            },
                          }}
                          disableRipple
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
      {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
      {success && <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>{success}</Typography>}
    </Paper>
  );
};

export default AllowedStudentsCard; 