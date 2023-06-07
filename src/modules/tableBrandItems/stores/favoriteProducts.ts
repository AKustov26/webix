import { defineStore } from "pinia";
import localstorage from "@/modules/tableBrandItems/helper/localstorage";

//!!! работа с избранным вынесена в store, т.к. вне рамках тестовой задачи, данные могут понадобиться не только в модуле tableBrandItems,

export const useFavoriteStore = defineStore({
    id: "favoriteProducts",
    state: () => ({
        favoriteProducts: localstorage.getLocalStorage<string[]>("favoriteProducts") ? localstorage.getLocalStorage<string[]>("favoriteProducts") : [] as string[],
    }),
    getters: {
        /**
         * возвращает список артикулов, которые были добавлены в избранное
         * @param state
         */
        finishedFavoriteItems(state) {
            return state.favoriteProducts;
        },
    },
    actions: {
        /**
         * Добавляет артикул в избранное
         * @param article - артикул товара
         */
        addFavoriteItem(article: string): void {
            this.favoriteProducts.push(article );
            localstorage.setLocalStorage<string[]>("favoriteProducts", this.favoriteProducts);
        },
        /**
         * Удадяет артикула из избранного
         * @param article - артикул товара
         */
        removeFavoriteItem(article: string): void {
            const i = this.favoriteProducts.lastIndexOf(article);
            if (i > -1) {
                this.favoriteProducts.splice(i, 1);
                localstorage.setLocalStorage<string[]>("favoriteProducts", this.favoriteProducts);
            }
        },
    },
});
