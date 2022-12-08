JFCustomWidgetUtils.domReady(function () {
  class ParameterFrame {
    params;
    iframe = document.querySelector("#view");
    srcFields;

    constructor() {
      this.params = JFCustomWidget.getWidgetSettings();
      this.srcFields = this.params.URL.match(/[^{\}]+(?=})/g);
      this.updateFrame();
      if (this.srcFields) {
        this.srcFields.forEach((n) => {
          JFCustomWidget.listenFromField(n, "change", (res) => {
            this.updateFrame();
          });
        });
      }
    }
    updateFrame = () => {
      if (this.srcFields) {
        let srcIDs = this.srcFields.map((n) => n.split("_")[1]);
        JFCustomWidget.getFieldsValueById(srcIDs, (res) => {
          let prefills = res.data.map((n) => n.value);
          let i = 0;
          let fullURL = this.params.URL;
          prefills.forEach((n) => {
            fullURL = fullURL.replace(`{${this.srcFields[i]}}`, n);
            i++;
          });
          this.iframe.setAttribute("src", fullURL);
        });
      } else {
        this.iframe.setAttribute("src", this.params.URL);
      }
    };
  }
  JFCustomWidget.subscribe("ready", function (data) {
    var widget = new ParameterFrame(data);
  });
});
