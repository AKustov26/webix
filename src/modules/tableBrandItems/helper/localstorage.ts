export default {
    /**
     * Записывает данные в localstorage
     * @param key - ключ под которым будут записаны данные
     * @param data - данные
     */
    setLocalStorage<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    },
    /**
     * Возвращает данные из localstorage
     * @param key - ключ по которому необходимо вернуть данные
     */
    getLocalStorage<T>(key: string): T | [] {
        const storage: string | null = localStorage.getItem(key);
        if (storage) {
            let storageParseValue: [] = [];
            try {
                storageParseValue = JSON.parse(storage);
            } catch (e) {
                console.log("Не удалось прочитать данные из локального хранилища", e);
            }
            return storageParseValue;
        }
        return [];
    }
};