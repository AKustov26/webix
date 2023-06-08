<script setup lang="ts">
// Компонент - поиск по webix datatable элементу, наименование которого пришло в props
// p.s. данный компонент, вне рамках задачи, может быть использован за пределами данного модуля
import {onMounted, ref, Ref} from "vue";
import type {ICustomFilterSearchProps} from "@/modules/tableBrandItems/type/moduleType";
import utils from "@/modules/tableBrandItems/helper/utils";

// props
const props = defineProps<ICustomFilterSearchProps>();

// data
const error: Ref<boolean> = ref(false);

// methods
/**
 * Обработчик события изменения состояния input по фильтру "поиск"
 */
const onChangeInput = () => {
    $$(props.webixElName).filterByAll();
};

// hooks
onMounted(() => {
	webix.ready(function () {
		if(utils.webixElementInApp(props.webixElName)) {
			$$(props.webixElName).registerFilter(
                document.getElementById("searchFilter"),
				{
					columnId: props.filterColumnId,
					compare: function (value, filter, obj) {
						const columns = props.filterColumnList;
						const text: string = filter.toLowerCase();
						if (filter) {
							let i;
							// Проверяем совпадения по всем столбцам, наименование которых пришли в компонент в качестве props
							for (i=0; i<columns.length; i++) {
								if (obj[columns[i]].toString().toLowerCase().indexOf(text) !== -1) return true;
							}
							return false;
						}
						return true;
					}
				},
				{
					getValue:function(node){
                        return node.value;
					},
					setValue:function(node, value){
                        node.value = value;
					}
				}
			);
		} else {
			error.value = true;
			console.log(`Ошибка! Корневой элемент ${props.webixElName} для филтрации не найден.`);
		}
	});
});

</script>

<template>
    <div v-if="!error" class='filter-search'>
        <input @input="onChangeInput" type='text' id='searchFilter' placeholder='Поиск'>
    </div>
</template>

<style scoped>
.filter-search input {
    padding: 5px 10px;
}
</style>