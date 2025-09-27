const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const users = [
  { id: 1, username: 'admin', password: 'admin', role: 'admin' },
  { id: 2, username: 'iraq', password: 'iraq', role: 'superuser' },
  { id: 3, username: 'mani', password: 'mani', role: 'user' }
];

// Mock data with sample entries
let imports = [
  {
    _id: 'imp_1',
    productName: 'القمح المستورد',
    price: 15000,
    notes: 'استيراد من أوكرانيا',
    createdAt: new Date('2024-09-01'),
    createdTime: '09:30'
  },
  {
    _id: 'imp_2', 
    productName: 'الأرز البسمتي',
    price: 8500,
    notes: 'استيراد من الهند',
    createdAt: new Date('2024-09-10'),
    createdTime: '14:20'
  }
];

let exportItems = [
  {
    _id: 'exp_1',
    productName: 'التمور العراقية',
    price: 12000,
    notes: 'تصدير إلى ألمانيا',
    createdAt: new Date('2024-09-05'),
    createdTime: '11:15'
  },
  {
    _id: 'exp_2',
    productName: 'السمسم العراقي', 
    price: 6000,
    notes: 'تصدير إلى تركيا',
    createdAt: new Date('2024-09-15'),
    createdTime: '16:45'
  }
];

let employees = [
  {
    _id: 'emp_1',
    name: 'أحمد محمد علي',
    jobTitle: 'مدير المبيعات',
    monthlySalary: 5000,
    startDate: '2024-01-15',
    startTime: '08:00',
    active: true
  },
  {
    _id: 'emp_2',
    name: 'فاطمة حسن محمود',
    jobTitle: 'محاسبة',
    monthlySalary: 3500,
    startDate: '2024-03-10',
    startTime: '09:00',
    active: true
  }
];

let notes = [
  {
    _id: 'note_1',
    title: 'اجتماع مع العملاء',
    content: 'اجتماع مهم مع العملاء الجدد لمناقشة العقود القادمة',
    category: 'important',
    priority: 'high',
    createdDate: '2024-09-27',
    createdTime: '10:30'
  },
  {
    _id: 'note_2',
    title: 'مراجعة المخزون',
    content: 'يجب مراجعة المخزون الشهري وتحديث الكميات',
    category: 'task',
    priority: 'medium',
    createdDate: '2024-09-25',
    createdTime: '14:00'
  }
];

let currentId = 100;

app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    console.log('Login successful for user:', user.username);
    res.json({
      message: 'Login successful',
      token: 'mock-jwt-token',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } else {
    console.log('Login failed - invalid credentials');
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token === 'mock-jwt-token') {
    res.json({
      user: {
        id: 1,
        username: 'admin',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.get('/api/imports', (req, res) => {
  const totalAmount = imports.reduce((sum, item) => sum + item.price, 0);
  res.json({ 
    imports: imports, 
    pagination: { current: 1, pages: 1, total: imports.length }, 
    totalAmount: totalAmount 
  });
});

app.post('/api/imports', (req, res) => {
  const { productName, price, notes, createdAt, createdTime } = req.body;
  const newImport = {
    _id: `imp_${currentId}`,
    productName,
    price: Number(price),
    notes,
    createdAt: createdAt || new Date().toISOString().split('T')[0],
    createdTime: createdTime || new Date().toTimeString().slice(0,5)
  };
  imports.push(newImport);
  currentId++;
  res.status(201).json(newImport);
});

app.put('/api/imports/:id', (req, res) => {
  const { id } = req.params;
  const { productName, price, notes, createdAt, createdTime } = req.body;
  const importIndex = imports.findIndex(item => item._id === id);
  
  if (importIndex === -1) {
    return res.status(404).json({ message: 'Import not found' });
  }
  
  imports[importIndex] = {
    ...imports[importIndex],
    productName,
    price: Number(price),
    notes,
    createdAt: createdAt || imports[importIndex].createdAt,
    createdTime: createdTime || imports[importIndex].createdTime
  };
  
  res.json(imports[importIndex]);
});

app.delete('/api/imports/:id', (req, res) => {
  const { id } = req.params;
  const importIndex = imports.findIndex(item => item._id === id);
  
  if (importIndex === -1) {
    return res.status(404).json({ message: 'Import not found' });
  }
  
  imports.splice(importIndex, 1);
  res.json({ message: 'Import deleted successfully' });
});

app.get('/api/exports', (req, res) => {
  const totalAmount = exportItems.reduce((sum, item) => sum + item.price, 0);
  res.json({ 
    exports: exportItems, 
    pagination: { current: 1, pages: 1, total: exportItems.length }, 
    totalAmount: totalAmount 
  });
});

app.post('/api/exports', (req, res) => {
  const { productName, price, notes, createdAt, createdTime } = req.body;
  const newExport = {
    _id: `exp_${currentId}`,
    productName,
    price: Number(price),
    notes,
    createdAt: createdAt || new Date().toISOString().split('T')[0],
    createdTime: createdTime || new Date().toTimeString().slice(0,5)
  };
  exportItems.push(newExport);
  currentId++;
  res.status(201).json(newExport);
});

app.put('/api/exports/:id', (req, res) => {
  const { id } = req.params;
  const { productName, price, notes, createdAt, createdTime } = req.body;
  const exportIndex = exportItems.findIndex(item => item._id === id);
  
  if (exportIndex === -1) {
    return res.status(404).json({ message: 'Export not found' });
  }
  
  exportItems[exportIndex] = {
    ...exportItems[exportIndex],
    productName,
    price: Number(price),
    notes,
    createdAt: createdAt || exportItems[exportIndex].createdAt,
    createdTime: createdTime || exportItems[exportIndex].createdTime
  };
  
  res.json(exportItems[exportIndex]);
});

app.delete('/api/exports/:id', (req, res) => {
  const { id } = req.params;
  const exportIndex = exportItems.findIndex(item => item._id === id);
  
  if (exportIndex === -1) {
    return res.status(404).json({ message: 'Export not found' });
  }
  
  exportItems.splice(exportIndex, 1);
  res.json({ message: 'Export deleted successfully' });
});

app.get('/api/employees', (req, res) => {
  const totalSalary = employees.reduce((sum, emp) => sum + emp.monthlySalary, 0);
  res.json({ 
    employees: employees, 
    pagination: { current: 1, pages: 1, total: employees.length }, 
    totalSalary: totalSalary 
  });
});

app.post('/api/employees', (req, res) => {
  const { name, jobTitle, monthlySalary, startDate, startTime, active } = req.body;
  const newEmployee = {
    _id: `emp_${currentId}`,
    name,
    jobTitle,
    monthlySalary: Number(monthlySalary),
    startDate,
    startTime: startTime || '09:00',
    active: active !== undefined ? active : true
  };
  employees.push(newEmployee);
  currentId++;
  res.status(201).json(newEmployee);
});

app.put('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, jobTitle, monthlySalary, startDate, startTime, active } = req.body;
  const empIndex = employees.findIndex(emp => emp._id === id);
  
  if (empIndex === -1) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  
  employees[empIndex] = {
    ...employees[empIndex],
    name,
    jobTitle,
    monthlySalary: Number(monthlySalary),
    startDate,
    startTime: startTime || employees[empIndex].startTime,
    active: active !== undefined ? active : employees[empIndex].active
  };
  
  res.json(employees[empIndex]);
});

app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const empIndex = employees.findIndex(emp => emp._id === id);
  
  if (empIndex === -1) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  
  employees.splice(empIndex, 1);
  res.json({ message: 'Employee deleted successfully' });
});

app.get('/api/notes', (req, res) => {
  res.json({ 
    notes: notes, 
    pagination: { current: 1, pages: 1, total: notes.length } 
  });
});

app.post('/api/notes', (req, res) => {
  const { title, content, category, priority, createdDate, createdTime } = req.body;
  const newNote = {
    _id: `note_${currentId}`,
    title,
    content,
    category: category || 'general',
    priority: priority || 'medium',
    createdDate: createdDate || new Date().toISOString().split('T')[0],
    createdTime: createdTime || new Date().toTimeString().slice(0,5)
  };
  notes.push(newNote);
  currentId++;
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, category, priority, createdDate, createdTime } = req.body;
  const noteIndex = notes.findIndex(note => note._id === id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }
  
  notes[noteIndex] = {
    ...notes[noteIndex],
    title,
    content,
    category: category || notes[noteIndex].category,
    priority: priority || notes[noteIndex].priority,
    createdDate: createdDate || notes[noteIndex].createdDate,
    createdTime: createdTime || notes[noteIndex].createdTime
  };
  
  res.json(notes[noteIndex]);
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex(note => note._id === id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }
  
  notes.splice(noteIndex, 1);
  res.json({ message: 'Note deleted successfully' });
});

app.get('/api/users', (req, res) => {
  const usersWithoutPasswords = users.map(user => ({
    id: user.id,
    username: user.username,
    role: user.role
  }));
  res.json({ users: usersWithoutPasswords, pagination: { current: 1, pages: 1, total: users.length } });
});

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
  console.log('Available credentials:');
  console.log('- admin / admin');
  console.log('- iraq / iraq');  
  console.log('- mani / mani');
});

module.exports = app;
