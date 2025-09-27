// Initialize default data if not exists using cloud storage
async function initializeDefaultData() {
    // Wait for cloudStorage to be available
    if (!window.cloudStorage) {
        setTimeout(initializeDefaultData, 100);
        return;
    }
    
    try {
        // Check if we already have data
        const imports = await window.cloudStorage.loadData('imports');
        if (imports.length > 0) return; // Already initialized
        
        // Default imports
        const defaultImports = [
            {
                _id: 'imp_1',
                productName: 'القمح المستورد',
                price: 15000,
                notes: 'استيراد من أوكرانيا',
                createdAt: '2024-09-01',
                createdDateTime: '2024-09-01T09:30'
            },
            {
                _id: 'imp_2',
                productName: 'الأرز البسمتي',
                price: 8500,
                notes: 'استيراد من الهند',
                createdAt: '2024-09-10',
                createdDateTime: '2024-09-10T14:15'
            }
        ];
        await window.cloudStorage.saveData('imports', defaultImports);
        
        // Default exports
        const defaultExports = [
            {
                _id: 'exp_1',
                productName: 'التمر العراقي',
                price: 12000,
                notes: 'تصدير إلى دول الخليج',
                createdAt: '2024-09-05',
                createdDateTime: '2024-09-05T11:00'
            },
            {
                _id: 'exp_2',
                productName: 'السمسم الطبيعي',
                price: 9500,
                notes: 'تصدير إلى تركيا',
                createdAt: '2024-09-12',
                createdDateTime: '2024-09-12T16:30'
            }
        ];
        await window.cloudStorage.saveData('exports', defaultExports);
        
        // Default employees
        const defaultEmployees = [
            {
                _id: 'emp_1',
                name: 'أحمد محمد علي',
                jobTitle: 'مدير العمليات',
                monthlySalary: 500000,
                startDate: '2024-01-15',
                active: true
            },
            {
                _id: 'emp_2',
                name: 'فاطمة حسن',
                jobTitle: 'محاسبة',
                monthlySalary: 350000,
                startDate: '2024-03-01',
                active: true
            }
        ];
        await window.cloudStorage.saveData('employees', defaultEmployees);
        
        // Default notes
        const defaultNotes = [
            {
                _id: 'note_1',
                title: 'اجتماع مع العملاء',
                content: 'مراجعة العقود الجديدة وشروط التوريد',
                category: 'مهم',
                priority: 'عالي',
                createdDate: '2024-09-27'
            },
            {
                _id: 'note_2',
                title: 'متابعة الشحنات',
                content: 'تأكد من وصول الشحنة الجديدة من الهند',
                category: 'مهمة',
                priority: 'متوسط',
                createdDate: '2024-09-26'
            }
        ];
        await window.cloudStorage.saveData('notes', defaultNotes);
        
        console.log('Default data initialized successfully with cloud storage');
    } catch (error) {
        console.error('Error initializing default data:', error);
        // Fallback to empty data if error
        await window.cloudStorage.saveData('imports', []);
        await window.cloudStorage.saveData('exports', []);
        await window.cloudStorage.saveData('employees', []);
        await window.cloudStorage.saveData('notes', []);
    }
}

// Auto-initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDefaultData);
} else {
    initializeDefaultData();
}