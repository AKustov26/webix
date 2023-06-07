<script setup lang='ts'>
// Компонент фильтр - показать только избранное по webix datatable элементу, наименование которого пришло в props
// p.s. данный компонент, вне рамках задачи, может быть использован за пределами данного модуля
import { onMounted, defineProps, ref } from "vue";
import type { ICustomFilterProps } from "@/modules/tableBrandItems/type/moduleType";
import utils from "@/modules/tableBrandItems/helper/utils";

// props
const props = defineProps<ICustomFilterProps>();

// data
const error = ref(false);
const optionsCheckbox = {
    view: "checkbox",
    id: "checkbox",
    labelRight: "Только избранное",
    width: 200,
    labelWidth: 0,
    value: 0,
    on: {
        onChange: function() {
            $$(props.webixElName).filterByAll();
        }
    }
};

// hooks
onMounted(() => {
    webix.ready(function() {
        if (utils.webixElementInApp(props.webixElName)) {
            $$(props.webixElName).registerFilter(
                $$("checkbox"),
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
                        return view.getValue();
                    },
                    setValue: function(view, value) {
                        view.setValue(value);
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
    <webix-ui v-if='!error' :config='optionsCheckbox' />
</template>

<style scoped>

</style>