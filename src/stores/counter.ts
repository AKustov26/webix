import { defineStore } from 'pinia'
import localstorage from "@/modules/tableBrandItems/helper/localstorage";

interface IFavoriteItem {
    productWbId: string, // артикул
    isFavorite: boolean, // избранное
}

export const useFavoriteStore = defineStore({
    id: 'favorite_items',
    state: () => ({
        favoriteItems: localstorage.getLocalStorage('favoriteProducts') ? localstorage.getLocalStorage('favoriteProducts') : [] as string[],
    }),
    getters: {
        finishedFavoriteItems(state) {
            return state.favoriteItems
        },
    },
    actions: {
        addFavoriteItem(item: string) {
            this.favoriteItems.push(item);
            localstorage.setLocalStorage("favoriteProducts", this.favoriteItems);
        },
        removeFavoriteItem(item: string) {
            //ToDO вынести функцию в helper, разобраться с TypeScript, try catch
            // const findIndexObject = (): number => {
            //     try {
            //         let i
            //         for (i = 0; i < this.favoriteItems.length; i++) {
            //             if (this.favoriteItems[i].productWbId === item.productWbId) {
            //                 return i;
            //             }
            //         }
            //         return -1;
            //     } catch (e) {
            //         console.log("Не удалось удалить товар из избранного", e);
            //         return -1;
            //     }
            // }
            // const index = findIndexObject();
            const i = this.favoriteItems.lastIndexOf(item)
            if (i > -1) {
                this.favoriteItems.splice(i, 1)
                localstorage.setLocalStorage("favoriteProducts", this.favoriteItems);
            }
        },
    },
})
