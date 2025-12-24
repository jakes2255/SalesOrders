sap.ui.define(
    ["sap/fe/core/AppComponent"],
    function (AppComponent) {
        "use strict";

        return AppComponent.extend("project1.Component", {
            metadata: {
                manifest: "json"
            },

            init: function () {
            AppComponent.prototype.init.apply(this, arguments);

            // Example: App-level view model
            const oAppModel = new JSONModel({
                busy: false
            });
            this.setModel(oAppModel, "app");
            }
        });
    }
);