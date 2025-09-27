// نظام Firebase المحسن لمشاركة البيانات الفورية - مناي ڤيردي
class FirebaseRealTimeManager {
    constructor() {
        // إعدادات Firebase Realtime Database
        this.config = {
            databaseURL: "https://maniverdi-7f8a9-default-rtdb.firebaseio.com/"
        };
        
        this.baseUrl = this.config.databaseURL;
        this.dataPath = "maniverdi-data";
        this.isOnline = navigator.onLine;
        
        // تهيئة النظام
        this.init();
        
        console.log("🔥 Firebase Real-time Manager initialized for Mani Verdi");
    }

    init() {
        // مراقبة حالة الإنترنت
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncPendingData();
            console.log("📡 Back online - syncing data");
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log("📴 Offline mode activated");
        });
        
        // إعداد المستمعين للتحديثات الفورية
        this.setupRealTimeListeners();
        
        // تهيئة البيانات الافتراضية
        this.initializeDefaultData();
    }

    // حفظ البيانات في Firebase
    async saveData(type, data) {
        try {
            console.log(`💾 Saving ${type} to Firebase:`, data);
            
            if (!this.isOnline) {
                // حفظ محلي في حالة عدم الاتصال
                this.saveLocally(type, data);
                console.log("💿 Saved locally - will sync when online");
                return true;
            }

            // حفظ في Firebase
            const url = `${this.baseUrl}${this.dataPath}/${type}.json`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: data,
                    lastUpdated: new Date().toISOString(),
                    device: this.getDeviceId()
                })
            });

            if (response.ok) {
                // حفظ نسخة احتياطية محلية
                this.saveLocally(type, data);
                
                // إشعار بالتحديث
                this.notifyDataChange(type, data);
                
                console.log(`✅ ${type} saved successfully to Firebase`);
                return true;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error(`❌ Error saving ${type}:`, error);
            
            // الرجوع للحفظ المحلي
            this.saveLocally(type, data);
            return true;
        }
    }

    // تحميل البيانات من Firebase
    async loadData(type) {
        try {
            if (!this.isOnline) {
                // تحميل من المحفوظات المحلية
                return this.loadLocally(type);
            }

            const url = `${this.baseUrl}${this.dataPath}/${type}.json`;
            const response = await fetch(url);
            
            if (response.ok) {
                const result = await response.json();
                
                if (result && result.data) {
                    // حفظ نسخة احتياطية محلية
                    this.saveLocally(type, result.data);
                    console.log(`📥 Loaded ${type} from Firebase:`, result.data);
                    return result.data;
                } else {
                    // إرجاع البيانات الافتراضية إذا لم توجد
                    const defaultData = this.getDefaultData(type);
                    await this.saveData(type, defaultData);
                    return defaultData;
                }
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
            
        } catch (error) {
            console.error(`❌ Error loading ${type}:`, error);
            
            // الرجوع للبيانات المحلية
            const localData = this.loadLocally(type);
            if (localData.length > 0) {
                return localData;
            }
            
            // إرجاع البيانات الافتراضية
            return this.getDefaultData(type);
        }
    }

    // حفظ محلي
    saveLocally(type, data) {
        try {
            localStorage.setItem(`maniverdi_${type}`, JSON.stringify(data));
            localStorage.setItem(`maniverdi_${type}_timestamp`, new Date().toISOString());
        } catch (error) {
            console.error('Error saving locally:', error);
        }
    }

    // تحميل محلي
    loadLocally(type) {
        try {
            const data = localStorage.getItem(`maniverdi_${type}`);
            return data ? JSON.parse(data) : this.getDefaultData(type);
        } catch (error) {
            console.error('Error loading locally:', error);
            return this.getDefaultData(type);
        }
    }

    // إعداد المستمعين للتحديثات الفورية
    setupRealTimeListeners() {
        const types = ['imports', 'exports', 'notes', 'employees'];
        
        types.forEach(type => {
            this.listenToChanges(type);
        });
    }

    // الاستماع للتغييرات في نوع معين من البيانات
    listenToChanges(type) {
        if (!this.isOnline) return;
        
        try {
            const url = `${this.baseUrl}${this.dataPath}/${type}.json`;
            const eventSource = new EventSource(url);
            
            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data && data.data && data.device !== this.getDeviceId()) {
                        console.log(`🔄 Real-time update for ${type}:`, data.data);
                        this.saveLocally(type, data.data);
                        this.notifyDataChange(type, data.data);
                    }
                } catch (error) {
                    console.error('Error parsing real-time data:', error);
                }
            };
            
            eventSource.onerror = (error) => {
                console.log(`Connection lost for ${type}, will retry...`);
                eventSource.close();
                
                // إعادة المحاولة بعد 5 ثوان
                setTimeout(() => {
                    this.listenToChanges(type);
                }, 5000);
            };
            
        } catch (error) {
            console.error(`Error setting up listener for ${type}:`, error);
        }
    }

    // إشعار بتغيير البيانات
    notifyDataChange(type, data) {
        // إشعار للنوافذ الأخرى
        window.dispatchEvent(new CustomEvent('firebaseDataChanged', {
            detail: { type, data }
        }));
        
        // BroadcastChannel للتبديل بين التابات
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('maniverdi-updates');
            channel.postMessage({ type, data, timestamp: new Date().toISOString() });
        }
    }

    // مزامنة البيانات المعلقة عند العودة للإنترنت
    async syncPendingData() {
        const types = ['imports', 'exports', 'notes', 'employees'];
        
        for (const type of types) {
            const localData = this.loadLocally(type);
            const localTimestamp = localStorage.getItem(`maniverdi_${type}_timestamp`);
            
            try {
                const url = `${this.baseUrl}${this.dataPath}/${type}.json`;
                const response = await fetch(url);
                
                if (response.ok) {
                    const firebaseData = await response.json();
                    
                    if (!firebaseData || !firebaseData.lastUpdated || 
                        new Date(localTimestamp) > new Date(firebaseData.lastUpdated)) {
                        // البيانات المحلية أحدث - رفعها لـ Firebase
                        await this.saveData(type, localData);
                    }
                }
            } catch (error) {
                console.error(`Error syncing ${type}:`, error);
            }
        }
    }

    // تهيئة البيانات الافتراضية
    async initializeDefaultData() {
        const types = ['imports', 'exports', 'notes', 'employees'];
        
        for (const type of types) {
            try {
                const data = await this.loadData(type);
                if (!data || data.length === 0) {
                    const defaultData = this.getDefaultData(type);
                    await this.saveData(type, defaultData);
                }
            } catch (error) {
                console.error(`Error initializing ${type}:`, error);
            }
        }
    }

    // الحصول على البيانات الافتراضية
    getDefaultData(type) {
        const defaults = {
            imports: [
                {
                    id: Date.now(),
                    productName: "مثال على منتج مستورد",
                    price: "1500",
                    currency: "EUR",
                    notes: "مثال للتجربة",
                    date: new Date().toLocaleDateString('ar'),
                    time: new Date().toLocaleTimeString('ar')
                }
            ],
            exports: [
                {
                    id: Date.now() + 1,
                    productName: "مثال على منتج مُصدر", 
                    price: "2000",
                    currency: "EUR",
                    notes: "مثال للتجربة",
                    date: new Date().toLocaleDateString('ar'),
                    time: new Date().toLocaleTimeString('ar')
                }
            ],
            notes: [
                {
                    id: Date.now() + 2,
                    title: "ملاحظة تجريبية",
                    content: "هذه ملاحظة للتجربة - يمكنك حذفها",
                    date: new Date().toLocaleDateString('ar'),
                    time: new Date().toLocaleTimeString('ar')
                }
            ],
            employees: [
                {
                    id: Date.now() + 3,
                    name: "موظف تجريبي",
                    position: "منصب تجريبي",
                    salary: "1000",
                    currency: "EUR",
                    date: new Date().toLocaleDateString('ar'),
                    time: new Date().toLocaleTimeString('ar')
                }
            ]
        };
        
        return defaults[type] || [];
    }

    // الحصول على معرف الجهاز
    getDeviceId() {
        let deviceId = localStorage.getItem('maniverdi_device_id');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('maniverdi_device_id', deviceId);
        }
        return deviceId;
    }

    // الحصول على معلومات الاتصال
    getConnectionInfo() {
        return {
            isOnline: this.isOnline,
            mode: 'firebase',
            database: 'Firebase Realtime Database',
            deviceId: this.getDeviceId(),
            status: this.isOnline ? 'متصل' : 'غير متصل'
        };
    }
}

// تهيئة النظام العالمي
if (typeof window !== 'undefined') {
    window.firebaseManager = new FirebaseRealTimeManager();
    
    // إضافة مستمع للتحديثات
    window.addEventListener('firebaseDataChanged', (event) => {
        console.log('🔄 Firebase data changed:', event.detail);
        
        // إعادة تحميل البيانات في الواجهة
        if (typeof loadDashboardData === 'function') {
            loadDashboardData();
        }
    });
    
    console.log('🚀 Firebase Real-time system ready for Mani Verdi!');
}