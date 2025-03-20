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
    }
  }
}); 