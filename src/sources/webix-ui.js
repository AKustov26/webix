function data_handler(value) {
	// eslint-disable-next-line no-undef
	const view = $$(this.webixId);

	if (typeof value === "object") {
		// eslint-disable-next-line no-undef
		if (this.copyData) value = webix.copy(value);

		if (view.setValues) view.setValues(value);
		else if (view.parse) {
			view.clearAll();
			view.parse(value);
		}
	} else if (view.setValue) view.setValue(value);

	const subs = view.queryView(sub => {
		return sub.hasEvent && sub.hasEvent("onValue");
	}, "all");

	if (subs.length) {
		subs.forEach(sub => {
			sub.callEvent("onValue", [value]);
		});
	}
}

export function registerWebixUIComponent(app) {
	app.component("webix-ui", {
		props: ["config", "modelValue", "copyData"],
		watch: {
			modelValue: {
				handler: data_handler,
			},
		},
		template: "<div></div>",
		mounted() {
			// eslint-disable-next-line no-undef
			const config = webix.copy(this.config);
			config.$scope = this;

			// eslint-disable-next-line no-undef
			this.webixId = webix.ui(config, this.$el);
			if (this.modelValue) data_handler.call(this, this.modelValue);
		},
		unmounted() {
			// eslint-disable-next-line no-undef
			webix.$$(this.webixId).destructor();
		},
	});
}