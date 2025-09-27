import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  ar: {
    translation: {
      // Common
      common: {
        login: 'تسجيل الدخول',
        logout: 'تسجيل الخروج',
        username: 'اسم المستخدم',
        password: 'كلمة المرور',
        actions: 'الإجراءات',
        edit: 'تعديل',
        delete: 'حذف',
        add: 'إضافة',
        search: 'بحث',
        cancel: 'إلغاء',
        save: 'حفظ',
        confirm: 'تأكيد',
        price: 'السعر',
        notes: 'ملاحظات',
        date: 'التاريخ',
        time: 'الوقت',
        refresh: 'تحديث',
        all: 'الجميع'
      },

      // Navigation
      nav: {
        dashboard: 'لوحة التحكم',
        imports: 'المستوردات',
        exports: 'المصدرات',
        notes: 'الملاحظات',
        employees: 'الموظفين',
        users: 'المستخدمين'
      },

      // Auth
      auth: {
        loginTitle: 'تسجيل الدخول',
        loginSubtitle: 'أدخل بياناتك للوصول إلى نظام إدارة ماني فيردي',
        welcomeBack: 'مرحباً بعودتك',
        enterCredentials: 'أدخل بيانات الدخول للمتابعة',
        loginButton: 'تسجيل الدخول',
        loginError: 'خطأ في بيانات الدخول',
        loginSuccess: 'تم تسجيل الدخول بنجاح'
      },

      // Dashboard
      dashboard: {
        welcome: 'مرحباً {{name}}',
        overview: 'نظرة عامة على النظام',
        totalImports: 'إجمالي المستوردات',
        totalExports: 'إجمالي المصدرات',
        totalNotes: 'إجمالي الملاحظات',
        totalEmployees: 'إجمالي الموظفين',
        recentActivity: 'النشاط الأخير',
        quickActions: 'الإجراءات السريعة',
        addImport: 'إضافة مستورد',
        addExport: 'إضافة مصدر',
        addNote: 'إضافة ملاحظة',
        addEmployee: 'إضافة موظف'
      },

      // Imports
      imports: {
        title: 'إدارة المستوردات',
        addImport: 'إضافة مستورد جديد',
        editImport: 'تعديل المستورد',
        productName: 'اسم المنتج',
        totalAmount: 'إجمالي المبلغ',
        importsList: 'قائمة المستوردات',
        deleteConfirm: 'هل أنت متأكد من حذف هذا المستورد؟',
        importAdded: 'تم إضافة المستورد بنجاح',
        importUpdated: 'تم تحديث المستورد بنجاح',
        importDeleted: 'تم حذف المستورد بنجاح',
        noImports: 'لا يوجد مستوردات'
      },

      // Exports
      exports: {
        title: 'إدارة المصدرات',
        addExport: 'إضافة مصدر جديد',
        editExport: 'تعديل المصدر',
        productName: 'اسم المنتج',
        totalAmount: 'إجمالي المبلغ',
        exportsList: 'قائمة المصدرات',
        deleteConfirm: 'هل أنت متأكد من حذف هذا المصدر؟',
        exportAdded: 'تم إضافة المصدر بنجاح',
        exportUpdated: 'تم تحديث المصدر بنجاح',
        exportDeleted: 'تم حذف المصدر بنجاح',
        noExports: 'لا يوجد مصدرات'
      },

      // Employees
      employees: {
        title: 'إدارة الموظفين',
        addEmployee: 'إضافة موظف جديد',
        editEmployee: 'تعديل الموظف',
        employeeName: 'اسم الموظف',
        jobTitle: 'المسمى الوظيفي',
        monthlySalary: 'الراتب الشهري',
        startDate: 'تاريخ البدء',
        startTime: 'وقت البدء',
        employeesList: 'قائمة الموظفين',
        totalSalary: 'إجمالي الرواتب',
        active: 'نشط',
        inactive: 'غير نشط',
        status: 'الحالة',
        deleteConfirm: 'هل أنت متأكد من حذف هذا الموظف؟',
        employeeAdded: 'تم إضافة الموظف بنجاح',
        employeeUpdated: 'تم تحديث الموظف بنجاح',
        employeeDeleted: 'تم حذف الموظف بنجاح',
        noEmployees: 'لا يوجد موظفين'
      },

      // Notes
      notes: {
        title: 'إدارة الملاحظات',
        addNote: 'إضافة ملاحظة جديدة',
        editNote: 'تعديل الملاحظة',
        noteTitle: 'عنوان الملاحظة',
        noteContent: 'محتوى الملاحظة',
        category: 'الفئة',
        priority: 'الأولوية',
        createdDate: 'تاريخ الإنشاء',
        createdTime: 'وقت الإنشاء',
        categories: {
          general: 'عام',
          important: 'مهم',
          reminder: 'تذكير',
          task: 'مهمة'
        },
        priorities: {
          low: 'منخفض',
          medium: 'متوسط',
          high: 'عالي'
        },
        notesList: 'قائمة الملاحظات',
        deleteConfirm: 'هل أنت متأكد من حذف هذه الملاحظة؟',
        noteAdded: 'تم إضافة الملاحظة بنجاح',
        noteUpdated: 'تم تحديث الملاحظة بنجاح',
        noteDeleted: 'تم حذف الملاحظة بنجاح',
        noNotes: 'لا يوجد ملاحظات'
      },

      // Users
      users: {
        title: 'إدارة المستخدمين',
        addUser: 'إضافة مستخدم جديد',
        editUser: 'تعديل المستخدم',
        username: 'اسم المستخدم',
        role: 'الدور',
        roles: {
          admin: 'مدير',
          superuser: 'مستخدم ممتاز',
          user: 'مستخدم'
        },
        usersList: 'قائمة المستخدمين',
        deleteConfirm: 'هل أنت متأكد من حذف هذا المستخدم؟',
        userAdded: 'تم إضافة المستخدم بنجاح',
        userUpdated: 'تم تحديث المستخدم بنجاح',
        userDeleted: 'تم حذف المستخدم بنجاح',
        noUsers: 'لا يوجد مستخدمين'
      },

      // Validation
      validation: {
        required: 'هذا الحقل مطلوب',
        minLength: 'يجب أن يكون {{min}} أحرف على الأقل',
        maxLength: 'يجب أن يكون أقل من {{max}} حرف',
        invalidEmail: 'تنسيق البريد الإلكتروني غير صحيح',
        passwordMismatch: 'كلمات المرور غير متطابقة',
        invalidNumber: 'يجب أن يكون رقماً صحيحاً',
        positiveNumber: 'يجب أن يكون رقماً موجباً'
      }
    }
  },
  
  en: {
    translation: {
      // Common
      common: {
        login: 'Login',
        logout: 'Logout',
        username: 'Username',
        password: 'Password',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        add: 'Add',
        search: 'Search',
        cancel: 'Cancel',
        save: 'Save',
        confirm: 'Confirm',
        price: 'Price',
        notes: 'Notes',
        date: 'Date',
        time: 'Time',
        refresh: 'Refresh',
        all: 'All'
      },

      // Navigation
      nav: {
        dashboard: 'Dashboard',
        imports: 'Imports',
        exports: 'Exports',
        notes: 'Notes',
        employees: 'Employees',
        users: 'Users'
      },

      // Auth
      auth: {
        loginTitle: 'Login',
        loginSubtitle: 'Enter your credentials to access Mani Verdi Management System',
        welcomeBack: 'Welcome Back',
        enterCredentials: 'Enter your login credentials to continue',
        loginButton: 'Login',
        loginError: 'Login failed',
        loginSuccess: 'Login successful'
      },

      // Dashboard
      dashboard: {
        welcome: 'Welcome {{name}}',
        overview: 'System Overview',
        totalImports: 'Total Imports',
        totalExports: 'Total Exports',
        totalNotes: 'Total Notes',
        totalEmployees: 'Total Employees',
        recentActivity: 'Recent Activity',
        quickActions: 'Quick Actions',
        addImport: 'Add Import',
        addExport: 'Add Export',
        addNote: 'Add Note',
        addEmployee: 'Add Employee'
      },

      // Imports
      imports: {
        title: 'Import Management',
        addImport: 'Add New Import',
        editImport: 'Edit Import',
        productName: 'Product Name',
        totalAmount: 'Total Amount',
        importsList: 'Imports List',
        deleteConfirm: 'Are you sure you want to delete this import?',
        importAdded: 'Import added successfully',
        importUpdated: 'Import updated successfully',
        importDeleted: 'Import deleted successfully',
        noImports: 'No imports available'
      },

      // Exports
      exports: {
        title: 'Export Management',
        addExport: 'Add New Export',
        editExport: 'Edit Export',
        productName: 'Product Name',
        totalAmount: 'Total Amount',
        exportsList: 'Exports List',
        deleteConfirm: 'Are you sure you want to delete this export?',
        exportAdded: 'Export added successfully',
        exportUpdated: 'Export updated successfully',
        exportDeleted: 'Export deleted successfully',
        noExports: 'No exports available'
      },

      // Employees
      employees: {
        title: 'Employee Management',
        addEmployee: 'Add New Employee',
        editEmployee: 'Edit Employee',
        employeeName: 'Employee Name',
        jobTitle: 'Job Title',
        monthlySalary: 'Monthly Salary',
        startDate: 'Start Date',
        startTime: 'Start Time',
        employeesList: 'Employees List',
        totalSalary: 'Total Salaries',
        active: 'Active',
        inactive: 'Inactive',
        status: 'Status',
        deleteConfirm: 'Are you sure you want to delete this employee?',
        employeeAdded: 'Employee added successfully',
        employeeUpdated: 'Employee updated successfully',
        employeeDeleted: 'Employee deleted successfully',
        noEmployees: 'No employees available'
      },

      // Notes
      notes: {
        title: 'Note Management',
        addNote: 'Add New Note',
        editNote: 'Edit Note',
        noteTitle: 'Note Title',
        noteContent: 'Note Content',
        category: 'Category',
        priority: 'Priority',
        createdDate: 'Created Date',
        createdTime: 'Created Time',
        categories: {
          general: 'General',
          important: 'Important',
          reminder: 'Reminder',
          task: 'Task'
        },
        priorities: {
          low: 'Low',
          medium: 'Medium',
          high: 'High'
        },
        notesList: 'Notes List',
        deleteConfirm: 'Are you sure you want to delete this note?',
        noteAdded: 'Note added successfully',
        noteUpdated: 'Note updated successfully',
        noteDeleted: 'Note deleted successfully',
        noNotes: 'No notes available'
      },

      // Users
      users: {
        title: 'User Management',
        addUser: 'Add New User',
        editUser: 'Edit User',
        username: 'Username',
        role: 'Role',
        roles: {
          admin: 'Admin',
          superuser: 'Superuser',
          user: 'User'
        },
        usersList: 'Users List',
        deleteConfirm: 'Are you sure you want to delete this user?',
        userAdded: 'User added successfully',
        userUpdated: 'User updated successfully',
        userDeleted: 'User deleted successfully',
        noUsers: 'No users available'
      },

      // Validation
      validation: {
        required: 'This field is required',
        minLength: 'Must be at least {{min}} characters',
        maxLength: 'Must be less than {{max}} characters',
        invalidEmail: 'Invalid email format',
        passwordMismatch: 'Passwords do not match',
        invalidNumber: 'Must be a valid number',
        positiveNumber: 'Must be a positive number'
      }
    }
  },

  it: {
    translation: {
      // Common
      common: {
        login: 'Accesso',
        logout: 'Esci',
        username: 'Nome Utente',
        password: 'Password',
        actions: 'Azioni',
        edit: 'Modifica',
        delete: 'Elimina',
        add: 'Aggiungi',
        search: 'Ricerca',
        cancel: 'Annulla',
        save: 'Salva',
        confirm: 'Conferma',
        price: 'Prezzo',
        notes: 'Note',
        date: 'Data',
        time: 'Ora',
        refresh: 'Aggiorna',
        all: 'Tutti'
      },

      // Navigation
      nav: {
        dashboard: 'Dashboard',
        imports: 'Importazioni',
        exports: 'Esportazioni',
        notes: 'Note',
        employees: 'Dipendenti',
        users: 'Utenti'
      },

      // Auth
      auth: {
        loginTitle: 'Accesso',
        loginSubtitle: 'Inserisci le tue credenziali per accedere al Sistema di Gestione Mani Verdi',
        welcomeBack: 'Bentornato',
        enterCredentials: 'Inserisci le tue credenziali di accesso per continuare',
        loginButton: 'Accedi',
        loginError: 'Accesso fallito',
        loginSuccess: 'Accesso riuscito'
      },

      // Dashboard
      dashboard: {
        welcome: 'Benvenuto {{name}}',
        overview: 'Panoramica Sistema',
        totalImports: 'Totale Importazioni',
        totalExports: 'Totale Esportazioni',
        totalNotes: 'Totale Note',
        totalEmployees: 'Totale Dipendenti',
        recentActivity: 'Attività Recente',
        quickActions: 'Azioni Rapide',
        addImport: 'Aggiungi Importazione',
        addExport: 'Aggiungi Esportazione',
        addNote: 'Aggiungi Nota',
        addEmployee: 'Aggiungi Dipendente'
      },

      // Imports
      imports: {
        title: 'Gestione Importazioni',
        addImport: 'Aggiungi Nuova Importazione',
        editImport: 'Modifica Importazione',
        productName: 'Nome Prodotto',
        totalAmount: 'Importo Totale',
        importsList: 'Lista Importazioni',
        deleteConfirm: 'Sei sicuro di voler eliminare questa importazione?',
        importAdded: 'Importazione aggiunta con successo',
        importUpdated: 'Importazione aggiornata con successo',
        importDeleted: 'Importazione eliminata con successo',
        noImports: 'Nessuna importazione disponibile'
      },

      // Exports
      exports: {
        title: 'Gestione Esportazioni',
        addExport: 'Aggiungi Nuova Esportazione',
        editExport: 'Modifica Esportazione',
        productName: 'Nome Prodotto',
        totalAmount: 'Importo Totale',
        exportsList: 'Lista Esportazioni',
        deleteConfirm: 'Sei sicuro di voler eliminare questa esportazione?',
        exportAdded: 'Esportazione aggiunta con successo',
        exportUpdated: 'Esportazione aggiornata con successo',
        exportDeleted: 'Esportazione eliminata con successo',
        noExports: 'Nessuna esportazione disponibile'
      },

      // Employees
      employees: {
        title: 'Gestione Dipendenti',
        addEmployee: 'Aggiungi Nuovo Dipendente',
        editEmployee: 'Modifica Dipendente',
        employeeName: 'Nome Dipendente',
        jobTitle: 'Titolo Lavoro',
        monthlySalary: 'Stipendio Mensile',
        startDate: 'Data Inizio',
        startTime: 'Ora Inizio',
        employeesList: 'Lista Dipendenti',
        totalSalary: 'Stipendi Totali',
        active: 'Attivo',
        inactive: 'Inattivo',
        status: 'Stato',
        deleteConfirm: 'Sei sicuro di voler eliminare questo dipendente?',
        employeeAdded: 'Dipendente aggiunto con successo',
        employeeUpdated: 'Dipendente aggiornato con successo',
        employeeDeleted: 'Dipendente eliminato con successo',
        noEmployees: 'Nessun dipendente disponibile'
      },

      // Notes
      notes: {
        title: 'Gestione Note',
        addNote: 'Aggiungi Nuova Nota',
        editNote: 'Modifica Nota',
        noteTitle: 'Titolo Nota',
        noteContent: 'Contenuto Nota',
        category: 'Categoria',
        priority: 'Priorità',
        createdDate: 'Data Creazione',
        createdTime: 'Ora Creazione',
        categories: {
          general: 'Generale',
          important: 'Importante',
          reminder: 'Promemoria',
          task: 'Compito'
        },
        priorities: {
          low: 'Bassa',
          medium: 'Media',
          high: 'Alta'
        },
        notesList: 'Lista Note',
        deleteConfirm: 'Sei sicuro di voler eliminare questa nota?',
        noteAdded: 'Nota aggiunta con successo',
        noteUpdated: 'Nota aggiornata con successo',
        noteDeleted: 'Nota eliminata con successo',
        noNotes: 'Nessuna nota disponibile'
      },

      // Users
      users: {
        title: 'Gestione Utenti',
        addUser: 'Aggiungi Nuovo Utente',
        editUser: 'Modifica Utente',
        username: 'Nome Utente',
        role: 'Ruolo',
        roles: {
          admin: 'Admin',
          superuser: 'Superutente',
          user: 'Utente'
        },
        usersList: 'Lista Utenti',
        deleteConfirm: 'Sei sicuro di voler eliminare questo utente?',
        userAdded: 'Utente aggiunto con successo',
        userUpdated: 'Utente aggiornato con successo',
        userDeleted: 'Utente eliminato con successo',
        noUsers: 'Nessun utente disponibile'
      },

      // Validation
      validation: {
        required: 'Questo campo è obbligatorio',
        minLength: 'Deve essere almeno {{min}} caratteri',
        maxLength: 'Deve essere meno di {{max}} caratteri',
        invalidEmail: 'Formato email non valido',
        passwordMismatch: 'Le password non corrispondono',
        invalidNumber: 'Deve essere un numero valido',
        positiveNumber: 'Deve essere un numero positivo'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;