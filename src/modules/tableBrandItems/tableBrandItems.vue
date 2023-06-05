<script setup lang="ts">
import table_data from "@/data/table_data.json";
import {ITableData} from "@/modules/tableBrandItems/type/tableType";
import {useFavoriteStore} from "@/stores/favoriteProducts";
import {useStateTableStore} from "@/stores/stateTableBrandItems";
import {onMounted, ref} from "vue";
import localstorage from "@/modules/tableBrandItems/helper/localstorage";
import SettingsTable from "@/modules/tableBrandItems/components/settingsTable.vue";
import useValidation from "@/modules/tableBrandItems/helper/customFilters"
const renderFavoriteButton = function (data): string {
	return `
		<span class="webix-favorite">
			<div>
				${data.isFavorite ? '<i class="bi bi-heart-fill"></i>' : '<i class="bi bi-heart"></i>'}
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
const renderPhoto = function (data, type, value): string {
	return `
		<a href="#" class="webix-image-link" target="_blank">
		    <img class="webix-product-photo" src="${value}" alt="${data.name}" data-image="${value}" />
	    </a>
	`;
}

const storeFavorite = useFavoriteStore();
const stateTable = useStateTableStore();
const tableData: ITableData[] = table_data;
const favoriteProducts: string[] = localstorage.getLocalStorage<string[]>("favoriteProducts");

// const { options } = useValidation();
// ToDo вынести в функцию store table - меняем состояние в таблице
const setFavoriteProductsTable = () => {
	for (let i = 0; i < favoriteProducts.length; i++) {
		let favoriteProduct = favoriteProducts[i];
		for (let q = 0; q < tableData.length; q++) {
			if (tableData[q].productWbId === favoriteProduct) {
				console.log(tableData[q]);
				tableData[q].isFavorite = true;
				break;
			}
		}
	}
}
setFavoriteProductsTable();

webix.i18n.setLocale("ru-RU");

// ToDo перенести options в отдельный файл
const options = {
	view: "datatable",
	tooltip: true,
	height: 700,
	fixedRowHeight: false,
	rowLineHeight:37,
	rowHeight:37,
	prerender: true,
	css: "webix_data_border webix_header_border",
	select: "row",
	dragColumn: true,
	resizeColumn: true,
	scheme:{
		$init:function(obj){
			obj.trend = obj.trend.map((item) => {
				item.value = item.orders
				item.date = webix.i18n.dateFormatStr(new Date(item.date))
				return {
					...item
				}
			});
		}
	},
	id:"dt2",
	headermenu:true,
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
			id: "image",
			editor: "string",
			header: "Фото",
			width: 70,
			template: renderPhoto,
			tooltip: function () {
				return "";
			}
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
			id:"trend", header:"График продаж",
			template:webix.Sparklines.getTemplate("bar"),
			tooltip:function(obj, common, value){
				if(!value)
					return "";
				return "<div class='my_title'>"+obj.name+",<br/>"+value.date+" : <b>"+value.value+" шт</b></div>";
			},
			width: 250
		},
		{
			id: "name",
			editor: "string",
			sort: "string",
			header: [
				{ text: "Товар", content: "excelFilter", mode: "text"}
			],
			// header: [
			// 	"Товар",
			// 	{
			// 		content:"customFilterName",
			// 		// compare: startCompare
			// 	}
			// ],
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
			// header: [
			// 	"Остаток",
			// 	{
			// 		content: "customFilterName2"
			// 	}
			// ],
			header: [
				{ text: "Остаток", content: "excelFilter", mode: "number"}
			],
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
		"webix-favorite": function (ev, id) {
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

// webix.ui.datafilter.customFilterName = {
// 	getInputNode:function(node){
// 		return node && node.querySelector("input") ? node.querySelector("input") : { value:"" };
// 		// return node ? node.querySelector("input") : { value:"" };
// 	},
// 	setValue:function(node, value){
// 		this.getInputNode(node).value = value.toString();
// 	},
// 	// returns filtering parameter
// 	getValue:function(node){
// 		console.log(this.getInputNode(node));
// 		console.log(this.getInputNode(node).value);
// 		// console.log(this.getInputNode(node))
// 		return this.getInputNode(node).value;
// 	},
// 	refresh: function(master, node, column){
// 		// declare a built-in datatable filter
// 		master.registerFilter(node, column, this);
//
// 		// column.compare = column.compare || function(value, filter){
// 		//   console.log(value);
// 		//   console.log(filter);
// 		// };
//     // event which will trigger filtering
// 		if (node.querySelector("input")) {
// 			node.querySelector("input").onkeyup = function(){
// 				master.filterByAll()
// 			}
// 		}
//
// 		// node.querySelector("button").onclick = function(){
// 		// 	master.filterByAll()
// 		// }
// 	},
// 	render:function(master, column){
// 		if (!column.popup) {
// 			const popup = this.createPopup(column);
//
// 			master.attachEvent('onScrollX', () => popup.hide());
// 			column.popup = popup.config.id;
//
// 			master._destroy_with_me.push(popup);
// 		}
// 		// const html = "<div><input type='text' style='width:100%' id='cb1'></div>";
// 		return `<span class="webix_excel_filter webix_icon wxi-filter">123</span>`;
// 		// return html;
// 	},
// 	createPopup(config) {
// 		const htmlString = `
//                     <div class="webix_popup_body">
//                         <div class="filter-input-group">
//                             <input placeholder="${config.placeholder || 'Поиск'}" type="text" class="filter-input">
//                             <span class="e-icon e-icon-search filter-input-submit"></span>
//                         </div>
//                     </div>
//                 `;
// 		const dom = new DOMParser().parseFromString(htmlString, 'text/html');
//
// 		return webix.ui({
// 			view: 'popup',
// 			css: 'webix_popup_eggheads',
// 			body: {
// 				content: dom.body.firstChild,
// 				type: 'clean',
// 				height: 48,
// 			},
// 		});
// 	},
// };
// webix.ui.datafilter.customFilterName2 = {
// 	// getInputNode:function(node){
// 	// 	return node ? node.querySelector("input") : { value:"" };
// 	// },
// 	setValue:function(node, value){
// 		const minNode = node.querySelector('#from1');
// 		const maxNode = node.querySelector('#to1');
// 		const [minNodeValue = '', maxNodeValue = ''] = value || [];
//
// 		minNode.value = minNodeValue;
// 		maxNode.value = maxNodeValue;
// 	},
// 	getValue:function(node){
// 		const min = node.querySelector('#from1');
// 		const max = node.querySelector('#to1');
// 		return min.value === '' && max.value === '' ? null : [min.value, max.value];
// 	},
// 	compare(cellValue, filterValue) {
// 		if (!Array.isArray(filterValue)) {
// 			return true;
// 		}
//
// 		const min = Number(filterValue[0]);
// 		const max = Number(filterValue[1]);
//
// 		return (
// 			(filterValue[0] === '' || min <= cellValue)
// 			&& (filterValue[1] === '' || cellValue <= max)
// 		);
// 	},
// 	refresh: function(master, node, column){
// 		master.registerFilter(node, column, this);
// 		column.compare = column.compare || this.compare;
//
// 		node.querySelector("button").onclick = function(){
// 			master.filterByAll()
// 		}
// 	},
// 	render:function(master, column){
// 		const html = `
// 			<div>
// 				<label for="from1">От</label>
// 				<input type='text' style='width:100%' id='from1'>
// 				<label for="to1">До</label>
// 				<input type='text' style='width:100%' id='to1'>
// 				<button>Применить</button>
// 			</div>
// `;
// 		return html;
// 	}
// };

onMounted(() => {
	webix.ready(function(){

		// ToDo описать
		stateTable.putStateTable($$("dt2").getState());

		// // ToDo фильтр по избранному
		$$("dt2").registerFilter(
			$$("searchGlobal"),
			// { columnId: "name" },
			{
				compare:function(cellValue, filterValue, obj){
					if (filterValue)
						return obj.name == filterValue
					return true;
				}
			},
			{
				getValue:function(view){
					return view.getValue();
				},
				setValue:function(view, value){
					view.setValue(value)
				}
			}
		);
		$$("dt2").registerFilter(
			$$("checkbox"),
			{
				compare:function(cellValue, filterValue, obj){
					if (filterValue)
						return obj.isFavorite == filterValue
					return true;
				}
			},
			{
				getValue:function(view){
					return view.getValue();
				},
				setValue:function(view, value){
					view.setValue(value)
				}
			}
		);

		// ToDo описать
		tippy('.webix-product-photo', {
			arrow: true,
			arrowType: 'round',
			animation: 'fade',
			placement: 'right',
			content(reference) {
				const pathImage = reference.getAttribute('data-image')
				const image = document.createElement('img')
				image.src = pathImage
				return image
			},
		})
	});
});

// ToDo в отдельный компонент фильтр по избранному
const optionsCheckbox = {
	view:"checkbox",
	id: "checkbox",
	labelRight:"Enable search",
	labelWidth:0,
	value:0,
	on: {
		onChange: function(value){
			$$("dt2").filterByAll()
		}
	}
}
const optionsSearchGlobal = {
	view:"text",
	id: "searchGlobal",
	placeholder:"Поиск",
	on: {
		onTimedKeyPress: function() {
			// var text = this.getValue().toLowerCase();
			// var table = $$("dt2");
			// var columns = table.config.columns;
			// table.filter(function(obj){
			// 	for (var i=0; i<columns.length; i++)
			// 		if (obj[columns[i].id].toString().toLowerCase().indexOf(text) !== -1) return true;
			// 	return false;
			// })
			$$("dt2").filterByAll();
		}
	}
}

</script>

<template>
	<div class="wrapper-wx-tb">
		<SettingsTable />
		<webix-ui :config='optionsSearchGlobal'/>
		<webix-ui :config='optionsCheckbox'/>
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
::v-deep(.webix-product-photo) {
	max-width: 100%;
	height: 100%;
	cursor: pointer;
	transition: .08s ease-in-out;
}
</style>