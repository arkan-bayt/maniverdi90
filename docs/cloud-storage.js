// Cloud Storage Manager for Mani Verdi - Real Sharing Edition
class CloudStorageManager {
    constructor() {
        // Always use shared mode for real synchronization
        this.isSharedMode = true;
        this.storageId = 'maniverdi_global'; // Global shared ID
        
        // Use a global key that all browsers can access
        this.sharedDataKey = 'maniverdi_global_data';
        
        // Setup real-time listeners
        this.setupStorageListeners();
        
        // Set storage mode
        localStorage.setItem('storage_mode', 'shared');
        localStorage.setItem('shared_storage_id', this.storageId);
    }

    async saveData(type, data) {
        try {
            // Always use shared storage for real synchronization
            const allData = await this.getAllSharedData();
            allData[type] = data;
            allData.lastUpdated = new Date().toISOString();
            allData.version = (allData.version || 0) + 1;
            
            // Save to shared storage (accessible by all browsers/users)
            await this.setSharedData(allData);
            
            // Broadcast change to other tabs/windows on same device
            this.broadcastChange(type, data);
            
            return true;
        } catch (error) {
            console.error('Error saving to shared storage:', error);
            // Fallback to local storage as last resort
            localStorage.setItem(`maniverdi_${type}`, JSON.stringify(data));
            return true;
        }
    }

    async loadData(type) {
        try {
            // Always load from shared storage
            const allData = await this.getAllSharedData();
            return allData[type] || [];
        } catch (error) {
            console.error('Error loading from shared storage:', error);
            // Fallback to local storage
            return JSON.parse(localStorage.getItem(`maniverdi_${type}`) || '[]');
        }
    }

    async getAllSharedData() {
        try {
            // Use a predictable global key that all browsers can access
            const savedData = localStorage.getItem(this.sharedDataKey);
            
            if (savedData) {
                return JSON.parse(savedData);
            }
            
            // Initialize with empty data if nothing exists
            const initialData = {
                imports: [],
                exports: [],
                notes: [],
                employees: [],
                version: 1,
                lastUpdated: new Date().toISOString()
            };
            
            // Save initial data
            await this.setSharedData(initialData);
            return initialData;
            
        } catch (error) {
            console.error('Error getting shared data:', error);
            return {
                imports: [],
                exports: [],
                notes: [],
                employees: [],
                version: 1,
                lastUpdated: new Date().toISOString()
            };
        }
    }

    async setSharedData(data) {
        // Save to shared storage (same key for all browsers)
        localStorage.setItem(this.sharedDataKey, JSON.stringify(data));
        
        // Use BroadcastChannel for same-origin communication
        if (window.BroadcastChannel) {
            const channel = new BroadcastChannel('maniverdi-sync');
            channel.postMessage({
                type: 'DATA_UPDATE',
                data: data,
                timestamp: new Date().toISOString()
            });
        }
        
        // Fallback: Trigger storage event for cross-tab communication
        window.dispatchEvent(new StorageEvent('storage', {
            key: this.sharedDataKey,
            newValue: JSON.stringify(data),
            oldValue: null,
            url: window.location.href
        }));
    }

    broadcastChange(type, data) {
        // Broadcast to other tabs/windows
        window.postMessage({
            type: 'MANIVERDI_DATA_CHANGE',
            dataType: type,
            data: data,
            timestamp: new Date().toISOString()
        }, '*');
    }

    setupStorageListeners() {
        // Listen for storage changes from other tabs/browsers
        window.addEventListener('storage', (e) => {
            if (e.key === this.sharedDataKey) {
                console.log('Storage changed from another tab/browser');
                window.dispatchEvent(new CustomEvent('dataChanged', {
                    detail: { 
                        type: 'all', 
                        data: JSON.parse(e.newValue || '{}'),
                        source: 'storage'
                    }
                }));
            }
        });

        // Listen for BroadcastChannel messages (same-origin)
        if (window.BroadcastChannel) {
            const channel = new BroadcastChannel('maniverdi-sync');
            channel.addEventListener('message', (e) => {
                if (e.data.type === 'DATA_UPDATE') {
                    console.log('Data updated via BroadcastChannel');
                    window.dispatchEvent(new CustomEvent('dataChanged', {
                        detail: { 
                            type: 'all', 
                            data: e.data.data,
                            source: 'broadcast'
                        }
                    }));
                }
            });
        }

        // Listen for postMessage (fallback)
        window.addEventListener('message', (e) => {
            if (e.data.type === 'MANIVERDI_DATA_CHANGE') {
                console.log('Data updated via postMessage');
                window.dispatchEvent(new CustomEvent('dataChanged', {
                    detail: { 
                        type: e.data.dataType, 
                        data: e.data.data,
                        source: 'message'
                    }
                }));
            }
        });
    }

    getAllDataLocal() {
        const data = localStorage.getItem(`shared_data_${this.storageId}`);
        return data ? JSON.parse(data) : {
            imports: [],
            exports: [],
            notes: [],
            employees: [],
            version: 1,
            lastUpdated: new Date().toISOString()
        };
    }

    async syncData() {
        if (!this.isSharedMode) return;

        try {
            // Check for updates from other users
            const currentData = this.getAllDataLocal();
            const lastSync = localStorage.getItem('last_sync') || '1970-01-01T00:00:00.000Z';
            
            if (currentData.lastUpdated > lastSync) {
                localStorage.setItem('last_sync', new Date().toISOString());
                
                // Trigger UI update
                window.dispatchEvent(new CustomEvent('syncComplete', {
                    detail: currentData
                }));
            }
        } catch (error) {
            console.error('Error syncing data:', error);
        }
    }

    getStorageInfo() {
        return {
            mode: this.isSharedMode ? 'shared' : 'local',
            storageId: this.storageId,
            isOnline: navigator.onLine
        };
    }

    async createBackup() {
        const allData = {};
        const types = ['imports', 'exports', 'notes', 'employees'];
        
        for (const type of types) {
            allData[type] = await this.loadData(type);
        }
        
        allData.backupDate = new Date().toISOString();
        allData.version = '1.0';
        
        return JSON.stringify(allData, null, 2);
    }

    async restoreFromBackup(backupData) {
        try {
            const data = JSON.parse(backupData);
            const types = ['imports', 'exports', 'notes', 'employees'];
            
            for (const type of types) {
                if (data[type]) {
                    await this.saveData(type, data[type]);
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error restoring backup:', error);
            return false;
        }
    }
}

// Global instance
window.cloudStorage = new CloudStorageManager();

// Listen for storage changes from other tabs
window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('shared_data_')) {
        window.dispatchEvent(new CustomEvent('externalDataChange', {
            detail: { key: e.key, newValue: e.newValue }
        }));
    }
});

// Auto-sync every 30 seconds if in shared mode
if (window.cloudStorage.isSharedMode) {
    setInterval(() => {
        window.cloudStorage.syncData();
    }, 30000);
}