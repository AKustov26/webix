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
const error = ref(false);
const optionsSettingsButton = {
	view: "button", value: "Настройка таблицы", popup: "popupHeaderMenu", width: 170,
};
const optionsHeaderMenuSettings = {
	id: "buttonHeaderMenu",
	view: "button",
	width: 200,
	value: "Отображение столбцов",
	click: function () {
		toggleMenuSettings(this.$view);
	}
};
const optionsResetButton = {
	id: "buttonReset",
	view: "button",
	width: 200,
	value: "Сбросить",
	click: function () {
		resetSettings();
	}
};
const optionsPopup = {
	id: "popupHeaderMenu",
	view: "popup",
	width: 320,
	padding: 0,
	point: true,
	body: {
		rows: [optionsHeaderMenuSettings, optionsResetButton]
	}
};

// methods
/**
 * Открывает/закрывает меню с настройками по отображению столбцов
 * @param node - представление
 */
function toggleMenuSettings(node): void {
	const menu = $$(props.webixElName).config.headermenu;
	if ($$(menu).isVisible()) {
		$$(menu).hide(node);
	} else {
		$$(menu).show(node);
	}
}

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
		<webix-ui :config='optionsSettingsButton'/>
		<webix-ui :config='optionsPopup'/>
	</template>
</template>