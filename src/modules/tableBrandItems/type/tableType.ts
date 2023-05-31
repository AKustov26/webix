interface IUnusedData {
    sellType?: string,
    url?: string,
    isNew?: boolean,
    sellDays?: number,
    lastDiscountPercent?: number,
    reviewsRating?: number,
    lastAvailableSizes?: number,
    lastTotalSizes?: number,
    lastOrders?: number,
    yesterdayOrdersSum?: number,
    creationDate?: string,
    avgSum?: number,
    loosesSum?: number,
    categoriesCount?: number,
    promotionsCount?: number,
    lastSells?: number,
    lastTotalEarning?: number,
    remainsBeginDay?: number,
    remainsCostBeginDay?: number,
    costBeginDay?: number,
    subjectId?: number,
    wbOrgNameId?: string,
    isClient?: boolean,
    userArticle?: string,
    lastPriceYesterday?: number,
    categoriesCountYesterday?: number,
    promotionsCountYesterday?: number,
    lastAvailableSizesYesterday?: number
}
export interface IFavoriteItem {
    productWbId: string, // артикул
    isFavorite: boolean, // избранное
}
interface IOrderFBO {
    ordersSum: number, // выручка FBO, руб
    orders: number // заказы FBO, шт
}
interface ITrendData extends IOrderFBO {
    date: string, // дата
}
export interface ITableData extends IOrderFBO, IUnusedData, IFavoriteItem {
    loosesPercent: number, // потери (упущенный %)
    reviewsRating: number, // ??????
    image?: string, // url изображения
    trend: ITrendData[], // график продаж
    name: string, // товар
    supplier: string, // продавец
    subject: string, // группа
    lastRemains: number, // остатки, шт
    reviewsCount: number, // отзывы
    positionRating: number, // позиция
    lastPrice: number, // цена
}