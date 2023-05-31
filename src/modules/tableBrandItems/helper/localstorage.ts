interface IFavoriteItem {
    productWbId: string, // артикул
    isFavorite: boolean, // избранное
}
export default {
    setLocalStorage(key: string, data: string[]): void {
        localStorage.setItem(key, JSON.stringify(data));
    },
    getLocalStorage(key: string): string[] {
        const storage_value: string | null = localStorage.getItem(key);

        if (storage_value) {
            return JSON.parse(storage_value);
        }
        return [""];
        // if (storage_value) {
        //     let
        // }
    }
}