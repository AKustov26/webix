<script setup lang='ts'>
// Компонент фильтр - показать только избранное по webix datatable элементу, наименование которого пришло в props
// p.s. данный компонент, вне рамках задачи, может быть использован за пределами данного модуля
import { onMounted, ref } from "vue";
import type { ICustomFilterProps } from "@/modules/tableBrandItems/type/moduleType";
import utils from "@/modules/tableBrandItems/helper/utils";

// props
const props = defineProps<ICustomFilterProps>();

// data
const error = ref(false);

// methods
/**
 * Обработчик события изменения состояния checkbox по фильтру "только избранное"
 */
const onChangeCheckbox = () => {
    $$(props.webixElName).filterByAll();
};
// hooks
onMounted(() => {
    webix.ready(function() {
        if (utils.webixElementInApp(props.webixElName)) {
            $$(props.webixElName).registerFilter(
                document.getElementById("favoriteFilter"),
                {
                    columnId: props.filterColumnId,
                    compare: function(value, filter, obj) {
                        if (filter) {
                            return obj.isFavorite == filter;
                        }
                        return true;
                    }
                },
                {
                    getValue: function(view) {
                        return view.checked;
                    },
                    setValue: function(view, value) {
                        view.checked = value;
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
    <div class="filter-favorite" v-if='!error'>
        <input
            type="checkbox"
            id="favoriteFilter"
            name="favorite"
            @change="onChangeCheckbox"
        />
        <label for="favoriteFilter">Только избранное</label>
    </div>
</template>

<style scoped>
.filter-favorite input,
.filter-favorite label {
    cursor: pointer;
}
.filter-favorite input {
    margin-right: 5px;
}
</style>