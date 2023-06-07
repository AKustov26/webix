<script setup lang="ts">
import table_data from "@/modules/tableBrandItems/data/table_data.json";
import {ITableData} from "@/modules/tableBrandItems/type/moduleType";
import {useFavoriteStore} from "@/modules/tableBrandItems/stores/favoriteProducts";
import localstorage from "@/modules/tableBrandItems/helper/localstorage";
import SettingsTable from "@/modules/tableBrandItems/components/settingsTable.vue";
import FilterOnlyFavorite from "@/modules/tableBrandItems/components/filterOnlyFavorite.vue";
import FilterSearch from "@/modules/tableBrandItems/components/filterSearch.vue";
import TableProducts from "@/modules/tableBrandItems/components/tableProducts.vue";
import {onMounted, ref} from "vue";
import type { Ref } from "vue";

// store
const storeFavorite = useFavoriteStore();

// data
const tableData: Ref<ITableData[]> | [] = ref([]);
const storageFavoriteProducts: string[] = localstorage.getLocalStorage<string[]>("favoriteProducts");
const searchFilterColumnList = ["name", "productWbId", "supplier", "subject"]; // список наименований столбцов для фильтрации
const webixDataTableElementName = "tableProduct"; // наименование элемента webix datatable
const loading: Ref<boolean> = ref(true);
const error: Ref<boolean> = ref(false);

// settings
webix.i18n.setLocale("ru-RU");

// methods
/**
 * Обработчик действий вызванных с webix datatable
 * @param event - содержит параметры: action - наименование действия, ev - объект события мыши, id - идентификатор ячейки
 */
const handlerAction = (event) => {
	const { action, id } = event;
	let item: ITableData;
	switch (action) {
		// обработка добавления/удаления продукта в избранное
		case "webix-favorite":
			item = $$(webixDataTableElementName).getItem(id); // получаем объект данных с таблицы
			if (item.isFavorite) {
				item.isFavorite = false;
				storeFavorite.removeFavoriteItem(item.productWbId);
			} else {
				item.isFavorite = true;
				storeFavorite.addFavoriteItem(item.productWbId);
			}
			$$(webixDataTableElementName).refresh(id.row);
			break;
	}
};
/**
 * Возвращает массив данных для таблицы
 */
const getTableData = (): ITableData[] => {
	return table_data;
};
/**
 * Загружает данные по избранным продуктам, которые были получены с localStorage, в полученный массив данных для таблицы
 */
const loadFavoriteFromStorage = () => {
	for (let i = 0; i < storageFavoriteProducts.length; i++) {
		let favoriteProduct = storageFavoriteProducts[i];
		for (let q = 0; q < tableData.value.length; q++) {
			if (tableData.value[q].productWbId === favoriteProduct) {
				tableData.value[q].isFavorite = true;
				break;
			}
		}
	}
};

// hooks
onMounted(() => {
	try {
		tableData.value = getTableData();
		loadFavoriteFromStorage();
	} catch (e) {
		error.value = true;
		console.log(`Ошибка! Не удалось загрузить данные. ${e}`);
	} finally {
		loading.value = false;
	}
});
</script>

<template>
	<template v-if="loading">Загрузка ...</template>
	<template v-else>
		<div v-if="error">Нет данных</div>
		<div v-else class="wrapper-wx-tb">
			<div class="webix-header-tools">
				<div class="webix-header-filter">
					<FilterSearch :webix-el-name="webixDataTableElementName" :filter-column-id="`searchProduct`" :filter-column-list="searchFilterColumnList"/>
					<FilterOnlyFavorite :webix-el-name="webixDataTableElementName" :filter-column-id="`favoriteProduct`"/>
				</div>
				<div class="webix-header-settings">
					<SettingsTable :webix-el-name="webixDataTableElementName"/>
				</div>
			</div>
			<TableProducts @action="handlerAction" :webix-el-name="webixDataTableElementName" :webix-table-data="tableData"/>
		</div>
	</template>

</template>

<style scoped>
.webix-header-tools {
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: space-between;
	margin-bottom: 1rem;
}
.webix-header-filter {
	display: flex;
	align-items: center;
}
.webix-header-filter > div {
	margin-right: 1rem;
}

::v-deep(.webix-cell-flex) {
	display: flex;
	align-content: center;
}

::v-deep(.flex-sp-between) {
	justify-content: space-between;
}

::v-deep(.webix-favorite) {
	cursor: pointer;
}

::v-deep(.webix-favorite i.bi-heart-fill) {
	color: #1CA1C1;
}
::v-deep(.webix-image-link) {
	background-color: unset;
	display: flex;
	height: 90%;
	align-items: center;
	justify-content: center;
}
::v-deep(.webix-product-image) {
	max-width: 100%;
	max-height: 100%;
	cursor: pointer;
	transition: .08s ease-in-out;
}
</style>