import BaseDialog from "./dialog/BaseDialog";

export default {
  name: "Dialog",
  install(Vue) {
    Vue.prototype.$dialog = function (options) {
      var ComponentClass = Vue.extend(BaseDialog);
      var instance = new ComponentClass({
        propsData: {
          type: options.type,
          callback: options.callback || function() {},
          store: options.store
        }
      });

      instance.$on('destroy', function () {
        this.$el.parentNode.removeChild(instance.$el);
        instance.$destroy();
      });
      instance.$mount();
      this.$root.$el.appendChild(instance.$el);
    };
  }
};