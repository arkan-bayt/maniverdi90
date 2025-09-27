// Cloud Storage Manager for Mani Verdi
class CloudStorageManager {
    constructor() {
        this.isSharedMode = localStorage.getItem('storage_mode') === 'shared';
        this.storageId = localStorage.getItem('shared_storage_id');
        this.apiKey = 'your-jsonbin-api-key'; // Replace with actual key
        this.baseUrl = 'https://api.jsonbin.io/v3/b/';
        
        // Fallback to localStorage simulation for demo
        this.useLocalFallback = true;
    }

    async saveData(type, data) {
        if (!this.isSharedMode) {
            // Local storage mode
            localStorage.setItem(`maniverdi_${type}`, JSON.stringify(data));
            return true;
        }

        try {
            if (this.useLocalFallback) {
                // Simulated cloud storage using localStorage
                const allData = this.getAllDataLocal();
                allData[type] = data;
                allData.lastUpdated = new Date().toISOString();
                allData.version = (allData.version || 0) + 1;
                
                localStorage.setItem(`shared_data_${this.storageId}`, JSON.stringify(allData));
                
                // Broadcast change to other tabs/windows
                window.dispatchEvent(new CustomEvent('dataChanged', {
                    detail: { type, data, storageId: this.storageId }
                }));
                
                return true;
            } else {
                // Real cloud storage implementation
                const response = await fetch(`${this.baseUrl}${this.storageId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': this.apiKey
                    },
                    body: JSON.stringify({
                        [type]: data,
                        lastUpdated: new Date().toISOString()
                    })
                });
                
                return response.ok;
            }
        } catch (error) {
            console.error('Error saving to cloud:', error);
            return false;
        }
    }

    async loadData(type) {
        if (!this.isSharedMode) {
            // Local storage mode
            return JSON.parse(localStorage.getItem(`maniverdi_${type}`) || '[]');
        }

        try {
            if (this.useLocalFallback) {
                // Simulated cloud storage
                const allData = this.getAllDataLocal();
                return allData[type] || [];
            } else {
                // Real cloud storage
                const response = await fetch(`${this.baseUrl}${this.storageId}/latest`, {
                    headers: {
                        'X-Master-Key': this.apiKey
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return data.record[type] || [];
                }
                return [];
            }
        } catch (error) {
            console.error('Error loading from cloud:', error);
            return [];
        }
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