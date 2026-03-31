sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return {
        showBPToast: function (oEvent) {
            const aContexts = oEvent.getParameter("contexts");

            if (!aContexts || aContexts.length === 0) {
                MessageToast.show("No Business Partner selected");
                return;
            }

            const aNames = aContexts.map(ctx => ctx.getObject().address);

            MessageToast.show("Selected BP: " + aNames.join(", "));
        }
    };
});