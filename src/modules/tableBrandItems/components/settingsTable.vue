<script setup lang="ts">
// Компонент настройки отображения столбцов webix datatable элемента, наименование которого пришло в props
// p.s. данный компонент, вне рамках задачи, может быть использован за пределами данного модуля
import {useStateTableStore} from "@/modules/tableBrandItems/stores/stateTableBrandItems";
import {onMounted, ref} from "vue";
import utils from "@/modules/tableBrandItems/helper/utils";

// store
const stateTable = useStateTableStore();

// props
const props = defineProps<{
	webixElName: string
}>();

// data

const op = ref();
const error = ref(false);

// methods
/**
 * Открывает/закрывает меню с настройками по отображению столбцов
 * @param node - представление
 */
function toggleMenuVisibleColumns(node): void {
	const menu = $$(props.webixElName).config.headermenu;
	if ($$(menu).isVisible()) {
		$$(menu).hide(node.target);
	} else {
		$$(menu).show(node.target);
	}
}

/**
 * Открывает/закрывает меню настроек таблицы
 * @param event
 */
const toggleMenuSettings = (event) => {
    op.value.toggle(event);
};
/**
 * Сбарсывает все настройка на дефлотные
 * дефолтные настройки берутся из store
 */
function resetSettings(): void {
	const state = stateTable.getState;
	if (state) {
		$$(props.webixElName).setState(state);
		$$(props.webixElName).refreshColumns();
	}
}

// hooks
onMounted(() => {
	webix.ready(function () {
		if(!utils.webixElementInApp(props.webixElName)) {
			error.value = true;
			console.log(`Ошибка! Корневой элемент ${props.webixElName} не найден.`);
		}
	});
});
</script>

<template>
	<template v-if="!error">
        <div class="webix_secondary">
            <button class="custom-btn webix_button" type="button" @click="toggleMenuSettings">Настройка таблицы</button>
            <OverlayPanelItem ref="op" :dismissable="false">
                <div class="group-button webix_secondary">
                    <button @click="toggleMenuVisibleColumns($event)" type="button" class="custom-btn webix_button">Отображение столбцов</button>
                    <button @click="resetSettings" type="button" class="custom-btn webix_button">Сбросить</button>
                </div>
            </OverlayPanelItem>
        </div>
	</template>
</template>

<style scoped>
.group-button button {
    display: block;
    width: 100%;
    margin-bottom: 10px;
}
.group-button button:last-child {
    margin-bottom: 0;
}
.custom-btn {
    height: 38px;
    border-width: 0;
    padding: 0 1rem;
}
</style>