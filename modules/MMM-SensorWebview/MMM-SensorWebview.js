Module.register("MMM-SensorWebview", {

    // Default module config.
    defaults: {
        url: "http://mm2.local:3000/d/ce9uqxn767jeoe/data?orgId=1&from=2025-01-13T06:23:59.954Z&to=2025-01-13T12:23:59.954Z&timezone=browser&kiosk",
        width: "100%",
        height: "100%",
        updateInterval: 30 * 1000 // 30 seconds
    },

    start: function() {
        var self = this;
        setInterval(function() {
            self.updateDom();
        }, this.config.updateInterval);
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        var iframe = document.createElement("iframe");
        iframe.style.border = "none";
        iframe.style.width = this.config.width;
        iframe.style.height = this.config.height;
        iframe.src = this.config.url;
        wrapper.appendChild(iframe);
        return wrapper;
    }
});
