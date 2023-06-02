<script setup lang="ts">
import table_data from "@/data/table_data.json";
import {ITableData} from "@/modules/tableBrandItems/type/tableType";
import {useFavoriteStore} from "@/stores/favoriteProducts";
import {useStateTableStore} from "@/stores/stateTableBrandItems";
import {onMounted, ref} from "vue";
import localstorage from "@/modules/tableBrandItems/helper/localstorage";
import SettingsTable from "@/modules/tableBrandItems/components/settingsTable.vue";

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

// ToDo вынести в функцию store table - меняем состояние в таблице
const setFavoriteProductsTable = () => {
	for (let i = 0; i < favoriteProducts.length; i++) {
		let favoriteProduct = favoriteProducts[i];
		for (let q = 0; q < tableData.length; q++) {
			if (tableData[q].productWbId === favoriteProduct) {
				tableData[q].isFavorite = true;
				break;
			}
		}
	}
}
setFavoriteProductsTable();

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
				"Товар",
				{
					content:"customFilterName",
					compare: startCompare
				}
			],
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

function startCompare(value, filter){
	value = value.toString().toLowerCase();
	filter = filter.toString().toLowerCase();
	console.log(value);
	console.log(filter);
	return value.indexOf(filter) === 0;
}

// webix.ui.datafilter.customFilterName = {
// 	getInputNode:function(node){
// 		return node.firstChild ? node.firstChild : {
// 			indeterminate:true
// 		};
// 	},
// 	getValue:function(node){
// 		var value = this.getInputNode(node).checked;
// 		var three = this.getInputNode(node).indeterminate;
// 		// console.log(three);
// 		// console.log(value);
// 		// console.log(node);
// 		return three ? "thirdState" : value;
// 	},
// 	_stateSetter:function(e){
// 		if (this.readOnly)
// 			this.checked=this.readOnly=false;
// 		else if (!this.checked)
// 			this.readOnly=this.indeterminate=true;
// 	},
// 	refresh: function(master, node, columnObj){
// 		master.registerFilter(node, columnObj, this);
// 		var input = node.querySelector("input");
// 		input.onclick = this._stateSetter;
// 		input.indeterminate = true;
// 		input.onchange = function(){
// 			master.filterByAll()
// 		}
// 	},
// 	render:function(master, column){
// 		var html = "<input type='text' id='cb1'>";
// 		return html;
// 	}
// }

webix.ui.datafilter.customFilterName = {
	getInputNode:function(node){
		return node ? node.firstChild : { value:"" };
	},
	setValue:function(node, value){
		this.getInputNode(node).value = value.toString();
	},
	// returns filtering parameter
	getValue:function(node){
		console.log(this.getInputNode(node))
		return this.getInputNode(node).value;
	},
	refresh: function(master, node, columnObj){
		// declare a built-in datatable filter
		master.registerFilter(node, columnObj, this);
		// event which will trigger filtering
		// node.querySelector("input").onkeyup = function(){
		// 	master.filterByAll()
		// }
		node.querySelector("button").onclick = function(){
			master.filterByAll()
		}
	},
	render:function(master, column){
		var html =
			`
				<div>
					<input type='text' style='width:100%' id='cb1'>
					<button>Применить</button>
				</div>
			`;
		return html;
	}
};

onMounted(() => {
	webix.ready(function(){
		// ToDo описать
		stateTable.putStateTable($$("dt2").getState());

		// ToDo фильтр по избранному


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