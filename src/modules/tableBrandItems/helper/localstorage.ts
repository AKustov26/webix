export default {
    setLocalStorage<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    },
    getLocalStorage<T>(key: string): T | [] {
        const storage: string | null = localStorage.getItem(key);
        if (storage) {
            let storageParseValue: [] = [];
            try {
                storageParseValue = JSON.parse(storage)
            } catch (e) {
                console.log("Не удалось прочитать данные из локального хранилища", e)
            }
            return storageParseValue;
        }
        return [];
    }
}