Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#4b7ffb",
    list: [{
      pagePath: "/pages/home/home",
      text: "首页",
      iconClass: "home"
    }, {
      pagePath: "/pages/stats/stats",
      text: "统计",
      iconClass: "chart"
    }, {
      pagePath: "/pages/record/record",
      text: "记录",
      iconClass: "weight"
    }, {
      pagePath: "/pages/advice/advice",
      text: "建议",
      iconClass: "lightbulb"
    }, {
      pagePath: "/pages/profile/profile",
      text: "我的",
      iconClass: "user"
    }]
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.updateSelected();
    },
    ready: function() {
      // 在组件在视图层布局完成后执行
      this.updateSelected();
    }
  },

  pageLifetimes: {
    show: function() {
      // 页面被展示时更新选中状态
      this.updateSelected();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      
      wx.switchTab({
        url
      });
      
      this.setData({
        selected: data.index
      });
    },

    updateSelected: function() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const route = currentPage ? currentPage.route : null;
      
      if (route) {
        const index = this.data.list.findIndex(item => {
          return route.indexOf(item.pagePath.substring(1)) > -1;
        });
        
        if (index !== -1 && index !== this.data.selected) {
          this.setData({ selected: index });
        }
      }
    }
  }
}); 