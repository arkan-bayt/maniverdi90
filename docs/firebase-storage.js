// Real-time Firebase Database for Mani Verdi
class RealTimeDataManager {
    constructor() {
        // Firebase config for free tier
        this.firebaseConfig = {
            databaseURL: "https://maniverdi-default-rtdb.firebaseio.com/"
        };
        
        this.baseUrl = this.firebaseConfig.databaseURL;
        this.dataPath = "maniverdi-data";
        
        // Setup real-time listeners
        this.setupEventSource();
        
        console.log("Real-time data manager initialized");
    }

    async saveData(type, data) {
        try {
            console.log(`Saving ${type}:`, data);
            
            // Save to Firebase
            const response = await fetch(`${this.baseUrl}${this.dataPath}/${type}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log(`${type} saved successfully to Firebase`);
                
                // Also save locally as backup
                localStorage.setItem(`maniverdi_${type}`, JSON.stringify(data));
                
                // Trigger update event
                this.triggerDataUpdate(type, data);
                return true;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error saving ${type}:`, error);
            
            // Fallback to localStorage
            localStorage.setItem(`maniverdi_${type}`, JSON.stringify(data));
            this.triggerDataUpdate(type, data);
            return true;
        }
    }

    async loadData(type) {
        try {
            console.log(`Loading ${type} from Firebase`);
            
            const response = await fetch(`${this.baseUrl}${this.dataPath}/${type}.json`);
            
            if (response.ok) {
                const data = await response.json();
                const result = data || [];
                
                console.log(`${type} loaded from Firebase:`, result);
                
                // Save to localStorage as backup
                localStorage.setItem(`maniverdi_${type}`, JSON.stringify(result));
                
                return result;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error loading ${type} from Firebase:`, error);
            
            // Fallback to localStorage
            const fallback = JSON.parse(localStorage.getItem(`maniverdi_${type}`) || '[]');
            console.log(`Using localStorage fallback for ${type}:`, fallback);
            return fallback;
        }
    }

    setupEventSource() {
        // Listen for Firebase changes using Server-Sent Events
        try {
            const eventSource = new EventSource(`${this.baseUrl}${this.dataPath}.json?sse=true`);
            
            eventSource.onmessage = (event) => {
                if (event.data && event.data !== 'null') {
                    const data = JSON.parse(event.data);
                    console.log("Firebase data changed:", data);
                    
                    // Trigger update for all data types
                    Object.keys(data).forEach(type => {
                        if (data[type]) {
                            localStorage.setItem(`maniverdi_${type}`, JSON.stringify(data[type]));
                            this.triggerDataUpdate(type, data[type]);
                        }
                    });
                }
            };

            eventSource.onerror = (error) => {
                console.log("EventSource error:", error);
                // Fallback to periodic polling
                this.startPolling();
            };

        } catch (error) {
            console.log("EventSource not supported, using polling");
            this.startPolling();
        }
    }

    startPolling() {
        // Poll every 3 seconds for changes
        setInterval(async () => {
            try {
                const types = ['imports', 'exports', 'notes', 'employees'];
                
                for (const type of types) {
                    const currentData = JSON.parse(localStorage.getItem(`maniverdi_${type}`) || '[]');
                    const newData = await this.loadData(type);
                    
                    // Check if data changed
                    if (JSON.stringify(currentData) !== JSON.stringify(newData)) {
                        console.log(`${type} data changed, updating UI`);
                        this.triggerDataUpdate(type, newData);
                    }
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 3000);
    }

    triggerDataUpdate(type, data) {
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('dataChanged', {
            detail: { 
                type: type, 
                data: data,
                source: 'firebase',
                timestamp: new Date().toISOString()
            }
        }));
    }

    async initializeDefaultData() {
        console.log("Checking for default data initialization");
        
        try {
            const imports = await this.loadData('imports');
            
            if (!imports || imports.length === 0) {
                console.log("No data found, initializing defaults");
                
                // Default data
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

                const defaultExports = [
                    {
                        _id: 'exp_1',
                        productName: 'زيت الزيتون العراقي',
                        price: 25000,
                        notes: 'تصدير إلى تركيا',
                        createdAt: '2024-09-05',
                        createdDateTime: '2024-09-05T11:20'
                    }
                ];

                const defaultEmployees = [
                    {
                        _id: 'emp_1',
                        name: 'أحمد محمد علي',
                        jobTitle: 'مدير المبيعات',
                        monthlySalary: 800000,
                        startDate: '2024-01-15',
                        active: true
                    }
                ];

                const defaultNotes = [
                    {
                        _id: 'note_1',
                        title: 'اجتماع مع المورد',
                        content: 'مناقشة تفاصيل الشحنة الجديدة والأسعار',
                        category: 'اجتماعات',
                        priority: 'عالية',
                        createdDate: '2024-09-26'
                    }
                ];

                // Save all defaults
                await this.saveData('imports', defaultImports);
                await this.saveData('exports', defaultExports);
                await this.saveData('employees', defaultEmployees);
                await this.saveData('notes', defaultNotes);

                console.log("Default data initialized successfully");
            }
        } catch (error) {
            console.error("Error initializing default data:", error);
        }
    }

    getStorageInfo() {
        return {
            mode: 'firebase',
            service: 'Firebase Realtime Database',
            isOnline: navigator.onLine
        };
    }
}

// Global instance - replace the old CloudStorageManager
window.cloudStorage = new RealTimeDataManager();

console.log("Firebase Real-time Data Manager loaded");