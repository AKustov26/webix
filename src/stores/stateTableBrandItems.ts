import { defineStore } from 'pinia'

// для сохранения настроек состояния таблицы можно также использовать webix.storage,
// отказался от такой реализации в сторону pinia, чтобы в приложении не плодить разные способы хранения данных
export const useStateTableStore = defineStore({
    id: 'stateTable',
    state: () => ({
        settingsTable: null as object | null,
    }),
    getters: {
        getState(state) {
            return state.settingsTable
        },
    },
    actions: {
        putStateTable(state: object): void {
            this.settingsTable = state;
        },
    },
})
