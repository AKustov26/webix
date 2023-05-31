<script setup lang="ts">
import table_data from "@/data/table_data.json";
import {IFavoriteItem, ITableData} from "@/modules/tableBrandItems/type/tableType";
import {useFavoriteStore} from "@/stores/counter";
import {ref} from "vue";
import localstorage from "@/modules/tableBrandItems/helper/localstorage";
const storeFavorite = useFavoriteStore();

const renderFavoriteButton = function(data): string {
		return `
			<span class="favorite">
				<div>
					${data.isFavorite ? '<i class="bi bi-heart-fill"></i>' : '<i class="bi bi-heart"></i>' }
				</div>
			</span>
		`;
	}
	const renderProductWbId = function (data, type, value): string {
		return `
			<div class="webix-cell-flex flex-sp-between">
				<div>
					<span>${value}</span>
				</div>
				${renderFavoriteButton(data)}
			</div>
		`;
	}

	const tableData: ITableData[] = ref(table_data);
	const favoriteProducts: string[] = localstorage.getLocalStorage("favoriteProducts");

	// ToDo вынести в функцию
	for (let i = 0; i < favoriteProducts.length; i++) {
		let favoriteProduct = favoriteProducts[i];
		for (let q = 0; q < tableData.value.length; q++ ) {
			if (tableData.value[q].productWbId === favoriteProduct) {
				tableData.value[q].isFavorite = true;
				break;
			}
		}
	}

	const options = {
		view: "datatable",
		height: 700,
		css:"webix_data_border webix_header_border",
		select: "row",
		dragColumn:true,
		resizeColumn:true,
		columns: [
			{
				id: "loosesPercent",
				editor: "number",
				sort: "int",
				header: "Упущен %",
			},
			{
				id: "reviewsRating",
				editor: "number",
				sort: "int",
				header: "Позиция",
			},
			{
				id: "productWbId",
				editor: "string",
				sort: "string",
				header: "Артикул",
				width: 120,
				template: renderProductWbId
			},
			{
				id: "name",
				editor: "string",
				sort: "string",
				header: "Товар",
			},
			{
				id: "supplier",
				editor: "string",
				sort: "string",
				header: "Продавец",
			},
			{
				id: "subject",
				editor: "string",
				sort: "string",
				header: "Группа",
			},
			{
				id: "lastRemains",
				editor: "number",
				sort: "int",
				header: "Остаток",
			},
			{
				id: "reviewsCount",
				editor: "number",
				sort: "int",
				header: "Отзывы",
			},
			{
				id: "positionRating",
				editor: "number",
				sort: "int",
				header: "Рейтинг",
			},
			{
				id: "lastPrice",
				editor: "number",
				sort: "int",
				header: "Цена",
			},
		],
		onClick: {
			favorite: function(ev, id) {
				const item: ITableData = this.getItem(id); // получаем объект данных с таблицы
				if (item.isFavorite) {
					item.isFavorite = false
					storeFavorite.removeFavoriteItem(item.productWbId);
				} else {
					item.isFavorite = true
					storeFavorite.addFavoriteItem(item.productWbId);
				}
				this.refresh(id.row);
			}
		},
	};
	// const getFavoriteItem = (item: ITableData): IFavoriteItem => {
	// 	return {
	// 		productWbId: item.productWbId,
	// 		isFavorite: item.isFavorite
	// 	}
	// }
</script>

<template>
	<div class="wrapper-wx-tb">
		<webix-ui :config='options' v-bind:modelValue='tableData'/>
	</div>
</template>

<style scoped>
	::v-deep(.webix-cell-flex) {
		display: flex;
		align-content: center;
	}
	::v-deep(.flex-sp-between) {
		justify-content: space-between;
	}
	::v-deep(.favorite) {
		cursor: pointer;
	}
	::v-deep(.favorite i.bi-heart-fill) {
		color: #1CA1C1;
	}
</style>