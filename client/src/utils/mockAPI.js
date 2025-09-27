// Mock API for GitHub Pages deployment
class MockAPI {
  constructor() {
    this.users = [
      { id: 1, username: 'admin', password: 'admin', role: 'admin' },
      { id: 2, username: 'iraq', password: 'iraq', role: 'superuser' },
      { id: 3, username: 'mani', password: 'mani', role: 'user' }
    ];

    this.imports = [
      {
        _id: 'imp_1',
        productName: 'القمح المستورد',
        price: 15000,
        notes: 'استيراد من أوكرانيا',
        createdAt: '2024-09-01',
        createdTime: '09:30'
      },
      {
        _id: 'imp_2',
        productName: 'الأرز البسمتي',
        price: 8500,
        notes: 'استيراد من الهند',
        createdAt: '2024-09-10',
        createdTime: '14:15'
      }
    ];

    this.exports = [
      {
        _id: 'exp_1',
        productName: 'التمر العراقي',
        price: 12000,
        notes: 'تصدير إلى دول الخليج',
        createdAt: '2024-09-05',
        createdTime: '11:00'
      },
      {
        _id: 'exp_2',
        productName: 'السمسم الطبيعي',
        price: 9500,
        notes: 'تصدير إلى تركيا',
        createdAt: '2024-09-12',
        createdTime: '16:30'
      }
    ];

    this.employees = [
      {
        _id: 'emp_1',
        name: 'أحمد محمد علي',
        jobTitle: 'مدير العمليات',
        monthlySalary: 5000,
        startDate: '2024-01-15',
        startTime: '08:00',
        active: true
      },
      {
        _id: 'emp_2',
        name: 'فاطمة حسن',
        jobTitle: 'محاسبة',
        monthlySalary: 3500,
        startDate: '2024-03-01',
        startTime: '09:00',
        active: true
      }
    ];

    this.notes = [
      {
        _id: 'note_1',
        title: 'اجتماع مع العملاء',
        content: 'مراجعة العقود الجديدة وشروط التوريد',
        category: 'important',
        priority: 'high',
        createdDate: '2024-09-27',
        createdTime: '10:30'
      },
      {
        _id: 'note_2',
        title: 'متابعة الشحنات',
        content: 'تأكد من وصول الشحنة الجديدة من الهند',
        category: 'task',
        priority: 'medium',
        createdDate: '2024-09-26',
        createdTime: '15:45'
      }
    ];

    this.currentId = 10;
  }

  // Authentication
  login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
          resolve({
            data: {
              message: 'Login successful',
              token: 'mock-jwt-token',
              user: {
                id: user.id,
                username: user.username,
                role: user.role
              }
            }
          });
        } else {
          reject({ response: { status: 401, data: { message: 'Invalid credentials' } } });
        }
      }, 500);
    });
  }

  getMe() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: {
              id: 1,
              username: 'admin',
              role: 'admin'
            }
          }
        });
      }, 200);
    });
  }

  // Imports
  getImports() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalAmount = this.imports.reduce((sum, item) => sum + item.price, 0);
        resolve({
          data: {
            imports: this.imports,
            pagination: { current: 1, pages: 1, total: this.imports.length },
            totalAmount: totalAmount
          }
        });
      }, 300);
    });
  }

  createImport(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newImport = {
          _id: `imp_${this.currentId++}`,
          ...data,
          price: Number(data.price),
          createdAt: data.createdAt || new Date().toISOString().split('T')[0],
          createdTime: data.createdTime || new Date().toTimeString().slice(0, 5)
        };
        this.imports.push(newImport);
        resolve({ data: newImport });
      }, 300);
    });
  }

  updateImport(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.imports.findIndex(item => item._id === id);
        if (index !== -1) {
          this.imports[index] = { ...this.imports[index], ...data, price: Number(data.price) };
          resolve({ data: this.imports[index] });
        } else {
          reject({ response: { status: 404, data: { message: 'Import not found' } } });
        }
      }, 300);
    });
  }

  deleteImport(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.imports.findIndex(item => item._id === id);
        if (index !== -1) {
          this.imports.splice(index, 1);
          resolve({ data: { message: 'Import deleted successfully' } });
        } else {
          reject({ response: { status: 404, data: { message: 'Import not found' } } });
        }
      }, 300);
    });
  }

  // Exports  
  getExports() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalAmount = this.exports.reduce((sum, item) => sum + item.price, 0);
        resolve({
          data: {
            exports: this.exports,
            pagination: { current: 1, pages: 1, total: this.exports.length },
            totalAmount: totalAmount
          }
        });
      }, 300);
    });
  }

  createExport(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newExport = {
          _id: `exp_${this.currentId++}`,
          ...data,
          price: Number(data.price),
          createdAt: data.createdAt || new Date().toISOString().split('T')[0],
          createdTime: data.createdTime || new Date().toTimeString().slice(0, 5)
        };
        this.exports.push(newExport);
        resolve({ data: newExport });
      }, 300);
    });
  }

  updateExport(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.exports.findIndex(item => item._id === id);
        if (index !== -1) {
          this.exports[index] = { ...this.exports[index], ...data, price: Number(data.price) };
          resolve({ data: this.exports[index] });
        } else {
          reject({ response: { status: 404, data: { message: 'Export not found' } } });
        }
      }, 300);
    });
  }

  deleteExport(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.exports.findIndex(item => item._id === id);
        if (index !== -1) {
          this.exports.splice(index, 1);
          resolve({ data: { message: 'Export deleted successfully' } });
        } else {
          reject({ response: { status: 404, data: { message: 'Export not found' } } });
        }
      }, 300);
    });
  }

  // Employees
  getEmployees() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalSalary = this.employees.reduce((sum, emp) => sum + emp.monthlySalary, 0);
        resolve({
          data: {
            employees: this.employees,
            pagination: { current: 1, pages: 1, total: this.employees.length },
            totalSalary: totalSalary
          }
        });
      }, 300);
    });
  }

  createEmployee(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEmployee = {
          _id: `emp_${this.currentId++}`,
          ...data,
          monthlySalary: Number(data.monthlySalary),
          active: data.active !== undefined ? data.active : true,
          startDate: data.startDate || new Date().toISOString().split('T')[0],
          startTime: data.startTime || new Date().toTimeString().slice(0, 5)
        };
        this.employees.push(newEmployee);
        resolve({ data: newEmployee });
      }, 300);
    });
  }

  updateEmployee(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.employees.findIndex(emp => emp._id === id);
        if (index !== -1) {
          this.employees[index] = { 
            ...this.employees[index], 
            ...data, 
            monthlySalary: Number(data.monthlySalary) 
          };
          resolve({ data: this.employees[index] });
        } else {
          reject({ response: { status: 404, data: { message: 'Employee not found' } } });
        }
      }, 300);
    });
  }

  deleteEmployee(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.employees.findIndex(emp => emp._id === id);
        if (index !== -1) {
          this.employees.splice(index, 1);
          resolve({ data: { message: 'Employee deleted successfully' } });
        } else {
          reject({ response: { status: 404, data: { message: 'Employee not found' } } });
        }
      }, 300);
    });
  }

  // Notes
  getNotes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            notes: this.notes,
            pagination: { current: 1, pages: 1, total: this.notes.length }
          }
        });
      }, 300);
    });
  }

  createNote(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNote = {
          _id: `note_${this.currentId++}`,
          ...data,
          createdDate: data.createdDate || new Date().toISOString().split('T')[0],
          createdTime: data.createdTime || new Date().toTimeString().slice(0, 5)
        };
        this.notes.push(newNote);
        resolve({ data: newNote });
      }, 300);
    });
  }

  updateNote(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.notes.findIndex(note => note._id === id);
        if (index !== -1) {
          this.notes[index] = { ...this.notes[index], ...data };
          resolve({ data: this.notes[index] });
        } else {
          reject({ response: { status: 404, data: { message: 'Note not found' } } });
        }
      }, 300);
    });
  }

  deleteNote(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.notes.findIndex(note => note._id === id);
        if (index !== -1) {
          this.notes.splice(index, 1);
          resolve({ data: { message: 'Note deleted successfully' } });
        } else {
          reject({ response: { status: 404, data: { message: 'Note not found' } } });
        }
      }, 300);
    });
  }

  // Users
  getUsers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const usersWithoutPasswords = this.users.map(user => ({
          id: user.id,
          username: user.username,
          role: user.role
        }));
        resolve({
          data: {
            users: usersWithoutPasswords,
            pagination: { current: 1, pages: 1, total: this.users.length }
          }
        });
      }, 300);
    });
  }

  createUser(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: this.currentId++,
          ...data
        };
        this.users.push(newUser);
        const userWithoutPassword = {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role
        };
        resolve({ data: userWithoutPassword });
      }, 300);
    });
  }

  updateUser(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.users.findIndex(user => user.id === parseInt(id));
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...data };
          const userWithoutPassword = {
            id: this.users[index].id,
            username: this.users[index].username,
            role: this.users[index].role
          };
          resolve({ data: userWithoutPassword });
        } else {
          reject({ response: { status: 404, data: { message: 'User not found' } } });
        }
      }, 300);
    });
  }

  deleteUser(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.users.findIndex(user => user.id === parseInt(id));
        if (index !== -1) {
          this.users.splice(index, 1);
          resolve({ data: { message: 'User deleted successfully' } });
        } else {
          reject({ response: { status: 404, data: { message: 'User not found' } } });
        }
      }, 300);
    });
  }
}

export default MockAPI;