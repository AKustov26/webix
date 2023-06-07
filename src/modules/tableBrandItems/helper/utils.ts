/**
 * Определяет инициализирован ли переданный webix element
 * p.s. в рамках этой задачи, метод размещен в модуле, но можно вынести его выше
 */
export default {
    webixElementInApp(webixElName: string): boolean {
        // @ts-ignore
        return !!$$(webixElName);
    },
};