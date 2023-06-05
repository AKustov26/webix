// import {useFavoriteStore} from "@/stores/favoriteProducts";
//
// const storeFavorite= useFavoriteStore();
// eslint-disable-next-line no-undef
console.log(webix);
export default function useValidation() {
    // @ts-ignore
    const renderFavoriteButton = function (data) {
        return `
		<span class="webix-favorite">
			<div>
				${data.isFavorite ? '<i class="bi bi-heart-fill"></i>' : '<i class="bi bi-heart"></i>'}
			</div>
		</span>
	`;
    }
    // @ts-ignore
    const renderProductWbId = function (data, type, value) {
        return `
		<div class="webix-cell-flex flex-sp-between">
			<div>
				<span>${value}</span>
			</div>
			${renderFavoriteButton(data)}
		</div>
	`;
    }
    // @ts-ignore
    const renderPhoto = function (data, type, value) {
        return `
		<a href="#" class="webix-image-link" target="_blank">
		    <img class="webix-product-photo" src="${value}" alt="${data.name}" data-image="${value}" />
	    </a>
	`;
    }

    // @ts-ignore
    // @ts-ignore
    const options2 = {
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
            // @ts-ignore
            $init:function(obj){
                // @ts-ignore
                obj.trend = obj.trend.map((item) => {
                    item.value = item.orders
                    // eslint-disable-next-line no-undef
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
                // eslint-disable-next-line no-undef
                template:webix.Sparklines.getTemplate("bar"),
                // @ts-ignore
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
                        // compare: startCompare
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
                header: [
                    "Остаток",
                    {
                        content: "customFilterName2"
                    }
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
            // @ts-ignore
            "webix-favorite": function (ev, id) {
                // @ts-ignore
                const item = this.getItem(id); // получаем объект данных с таблицы
                if (item.isFavorite) {
                    item.isFavorite = false
                    // storeFavorite.removeFavoriteItem(item.productWbId);
                } else {
                    item.isFavorite = true
                    // storeFavorite.addFavoriteItem(item.productWbId);
                }
                // @ts-ignore
                this.refresh(id.row);
            }
        },
    };

    return {
        options2
    }
}
