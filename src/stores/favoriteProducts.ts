import { defineStore } from 'pinia'
import localstorage from "@/modules/tableBrandItems/helper/localstorage";
// ToDo нет необходимости в pinia для избранного
export const useFavoriteStore = defineStore({
    id: 'favoriteProducts',
    state: () => ({
        favoriteProducts: localstorage.getLocalStorage<string[]>('favoriteProducts') ? localstorage.getLocalStorage<string[]>('favoriteProducts') : [] as string[],
    }),
    getters: {
        finishedFavoriteItems(state) {
            return state.favoriteProducts
        },
    },
    actions: {
        addFavoriteItem(item: string): void {
            this.favoriteProducts.push(item);
            localstorage.setLocalStorage<string[]>("favoriteProducts", this.favoriteProducts);
        },
        removeFavoriteItem(item: string): void {
            const i = this.favoriteProducts.lastIndexOf(item)
            if (i > -1) {
                this.favoriteProducts.splice(i, 1)
                localstorage.setLocalStorage<string[]>("favoriteProducts", this.favoriteProducts);
            }
        },
    },
})
