import type {ITableData} from "@/modules/tableBrandItems/type/moduleType";

/**
 * Возвращает HTML разметку (иконку избранного) для webix datatable
 * @param data - данные объекта по которому отрисовывается webix datatable
 */
export const productFavoriteIcon = function (data: ITableData): string {
    return `
		<span class="webix-favorite">
			<div>
				${data.isFavorite ? "<i class=\"bi bi-heart-fill\"></i>" : "<i class=\"bi bi-heart\"></i>"}
			</div>
		</span>
	`;
};
/**
 * Возвращает HTML разметку (Артикул + иконку избранного) для webix datatable
 * @param data - данные объекта по которому отрисовывается webix datatable
 * @param type - объект параметров для компонента
 * @param value - значение ячейки
 */
export const productWbId = function (data: ITableData, type: any, value: string): string {
    return `
		<div class="webix-cell-flex flex-sp-between">
			<div>
				<span>${value}</span>
			</div>
			${productFavoriteIcon(data)}
		</div>
	`;
};
/**
 * Возвращает HTML разметку (изображение) для webix datatable
 * @param data - данные объекта по которому отрисовывается webix datatable
 * @param type - объект параметров для компонента
 * @param value - значение ячейки
 */
export const productImage = function (data: ITableData, type: any, value: string): string {
    return `
		<a href="#" class="webix-image-link" target="_blank">
		    <img class="webix-product-image" src="${value}" alt="${data.name}" data-image="${value}" />
	    </a>
	`;
};
