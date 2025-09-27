// Initialize default data if not exists
function initializeDefaultData() {
    // Default imports
    if (!localStorage.getItem('maniverdi_imports')) {
        const imports = [
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
        localStorage.setItem('maniverdi_imports', JSON.stringify(imports));
    }

    // Default exports
    if (!localStorage.getItem('maniverdi_exports')) {
        const exports = [
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
        localStorage.setItem('maniverdi_exports', JSON.stringify(exports));
    }

    // Default employees
    if (!localStorage.getItem('maniverdi_employees')) {
        const employees = [
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
        localStorage.setItem('maniverdi_employees', JSON.stringify(employees));
    }

    // Default notes
    if (!localStorage.getItem('maniverdi_notes')) {
        const notes = [
            {
                _id: 'note_1',
                title: 'اجتماع مع العملاء',
                content: 'مراجعة العقود الجديدة وشروط التوريد',
                category: 'مهم',
                priority: 'عالي',
                createdDate: '2024-09-27',
                createdTime: '10:30'
            },
            {
                _id: 'note_2',
                title: 'متابعة الشحنات',
                content: 'تأكد من وصول الشحنة الجديدة من الهند',
                category: 'مهمة',
                priority: 'متوسط',
                createdDate: '2024-09-26',
                createdTime: '15:45'
            }
        ];
        localStorage.setItem('maniverdi_notes', JSON.stringify(notes));
    }

    // Default users
    if (!localStorage.getItem('maniverdi_users')) {
        const users = [
            { id: 2, username: 'iraq', password: 'iraq', role: 'superuser' },
            { id: 3, username: 'mani', password: 'mani', role: 'user' }
        ];
        localStorage.setItem('maniverdi_users', JSON.stringify(users));
    }
}

// Call initialization
initializeDefaultData();