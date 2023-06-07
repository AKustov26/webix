<script setup lang="ts">
	import {ITableData} from "@/modules/tableBrandItems/type/moduleType";
	import {useStateTableStore} from "@/modules/tableBrandItems/stores/stateTableBrandItems";
	import {onMounted, defineProps, defineEmits, toRefs} from "vue";
	import * as webixRenderElement from "@/modules/tableBrandItems/helper/webixRenderElement";

	// store
	const stateTable = useStateTableStore();

	// emits
	const emits = defineEmits(["action"]);

	// props
	const props = defineProps<({
		webixTableData: ITableData[],
		webixElName: string
	})>();
	const {webixTableData, webixElName} = toRefs(props);

	// data
	const optionsTable = {
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
				// Добавляем новый ключ "value" в объект trend,
				// т.к. webix datatable Sparklines принимает в виде значение только ключ "value"
				obj.trend = obj.trend.map((item) => {
					item.value = item.orders;
					item.date = webix.i18n.dateFormatStr(new Date(item.date));
					return {
						...item
					};
				});
			}
		},
		id: webixElName.value,
		headermenu:true,
		columns: [
			{
				id: "loosesPercent",
				editor: "number",
				sort: "int",
				header: [
					{ text: "Упущен %", content: "excelFilter", mode: "text"}
				],
			},
			{
				id: "reviewsRating",
				editor: "number",
				sort: "int",
				header: [
					{ text: "Позиция %", content: "excelFilter", mode: "text"}
				],
			},
			{
				id: "image",
				editor: "string",
				header: "Фото",
				width: 70,
				template: webixRenderElement.productImage,
				tooltip: function (obj) {
					return `<div class='my_image_tooltip'><img src='${obj.image}' alt='${obj.name}' /></div>`;
				}
			},
			{
				id: "productWbId",
				editor: "string",
				sort: "string",
				header: [
					{ text: "Артикул", content: "excelFilter", mode: "text"}
				],
				width: 120,
				template: webixRenderElement.productWbId
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
			},
			{
				id: "supplier",
				editor: "string",
				sort: "string",
				header: [
					{ text: "Продавец", content: "excelFilter", mode: "text"}
				],
			},
			{
				id: "subject",
				editor: "string",
				sort: "string",
				header: [
					{ text: "Группа", content: "excelFilter", mode: "text"}
				],
			},
			{
				id: "lastRemains",
				editor: "number",
				sort: "int",
				header: [
					{ text: "Остаток", content: "excelFilter", mode: "number"}
				],
			},
			{
				id: "reviewsCount",
				editor: "number",
				sort: "int",
				header: [
					{ text: "Отзывы", content: "excelFilter", mode: "number"}
				],
			},
			{
				id: "positionRating",
				editor: "number",
				sort: "int",
				header: [
					{ text: "Рейтинг", content: "excelFilter", mode: "number"}
				],
			},
			{
				id: "lastPrice",
				editor: "number",
				sort: "int",
				header: [
					{ text: "Цена", content: "excelFilter", mode: "number"}
				],
			},
		],
		onClick: {
			"webix-favorite": function (ev, id) {
				emits("action", {action: "webix-favorite", ev, id});
			}
		},
	};

	// hook
	onMounted(() => {
		webix.ready(function(){
			/**
			 * Записываем состояние таблицы (кол-во отображаемых столбцов) на момент загрузки
			 */
			stateTable.putStateTable($$(webixElName.value).getState());
		});
	});
</script>

<template>
	<webix-ui :config='optionsTable' v-bind:modelValue='webixTableData'/>
</template>