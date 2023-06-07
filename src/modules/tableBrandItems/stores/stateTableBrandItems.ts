import { defineStore } from "pinia";

//!!!!!!! для сохранения настроек состояния таблицы можно также использовать webix.storage,
//!!!!!!! отказался от такой реализации в сторону pinia, чтобы в приложении не плодить разные способы хранения данных

/**
 * Хранилище для управления состоянием настроек таблицы (видимые/невидимые столбцы)
 */
export const useStateTableStore = defineStore({
    id: "stateTable",
    state: () => ({
        settingsTable: null as object | null, // настройки таблицы
    }),
    getters: {
        /**
         * Возвращает текущие настройки таблицы из хранилища
         * @param state
         */
        getState(state) {
            return state.settingsTable;
        },
    },
    actions: {
        /**
         * Записывает настройки таблицы в хранилище
         * @param state
         */
        putStateTable(state: object): void {
            this.settingsTable = state;
        },
    },
});
