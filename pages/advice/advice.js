// pages/advice/advice.js
const api = require('../../utils/api');

Page({

  /**
   * Page initial data
   */
  data: {
    currentTab: 'all', // 'all', 'diet', 'exercise', 'rest'
    adviceList: [],
    loading: true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.loadAdvice();
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      });
    }
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {
    this.loadAdvice();
    wx.stopPullDownRefresh();
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {
    return {
      title: '变窄 - 健康减重小程序',
      path: '/pages/onboarding/onboarding'
    };
  },

  /**
   * 加载健康建议
   */
  loadAdvice() {
    wx.showLoading({
      title: '加载中',
    });
    
    const { currentTab } = this.data;
    
    api.getHealthAdvice(currentTab).then(adviceList => {
      wx.hideLoading();
      this.setData({
        adviceList: adviceList,
        loading: false
      });
    }).catch(err => {
      wx.hideLoading();
      this.setData({
        loading: false
      });
      wx.showToast({
        title: '获取建议失败',
        icon: 'none'
      });
    });
  },

  /**
   * 切换标签页
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab !== this.data.currentTab) {
      this.setData({
        currentTab: tab,
        loading: true
      });
      this.loadAdvice();
    }
  },

  /**
   * 点赞或取消点赞
   */
  toggleLike(e) {
    const index = e.currentTarget.dataset.index;
    const adviceList = this.data.adviceList;
    
    // 切换点赞状态
    adviceList[index].isLiked = !adviceList[index].isLiked;
    
    // 更新点赞数
    if (adviceList[index].isLiked) {
      adviceList[index].likes += 1;
    } else {
      adviceList[index].likes -= 1;
    }
    
    this.setData({
      adviceList: adviceList
    });
  },

  /**
   * 查看建议详情
   */
  viewAdviceDetail(e) {
    const index = e.currentTarget.dataset.index;
    const advice = this.data.adviceList[index];
    
    // 保存到全局数据
    getApp().globalData.currentAdvice = advice;
    
    // 跳转到详情页（假设有一个单独的详情页）
    // wx.navigateTo({
    //   url: '/pages/advice-detail/advice-detail',
    // });
    
    // 由于我们没有详情页，所以使用模态框展示详情
    wx.showModal({
      title: advice.title,
      content: advice.content,
      showCancel: false
    });
  },

  /**
   * 分享建议
   */
  shareAdvice(e) {
    const index = e.currentTarget.dataset.index;
    const advice = this.data.adviceList[index];
    
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  }
})