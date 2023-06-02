<script setup lang="ts">
import {useStateTableStore} from "@/stores/stateTableBrandItems";

const stateTable = useStateTableStore();
	const optionsMenuButton = {
		view:"button", value:"Настройка таблицы", popup:"buttons", width: 170,
	}
	const optionsHeaderMenu = {
		id: "button2",
		view:"button",
		width:170,
		value:"Open header menu",
		click:function(){
			showMenu(this.$view);
		}
	}
	const optionsResetColumns = {
		id: "button1",
		view:"button",
		width:170,
		value:"reset",
		click:function(){
			reset_columns();
		}
	}
	const optionsMenu = {
		id:"buttons",
		view:"popup",
		width: 200,
		padding:0,
		point:true,
		body:{
			rows:[optionsResetColumns, optionsHeaderMenu]
		}
	}

	function showMenu(node){
		const menu = $$("dt2").config.headermenu;
		$$(menu).show(node);
	}
	function reset_columns(){
		const state = stateTable.getState;
		if (state) {
			$$("dt2").setState(state);
			$$("dt2").refreshColumns();
		}
	}
</script>

<template>
	<webix-ui :config='optionsMenuButton'/>
	<webix-ui :config='optionsMenu'/>
</template>

<style scoped>

</style>