// app.js
App({
  onLaunch() {
    // 为了调试方便，直接设置已完成引导
    wx.setStorageSync('hasCompletedOnboarding', true);
    // 可以确保我们能看到底部导航栏
    
    // 检查是否已完成引导
    const hasCompletedOnboarding = wx.getStorageSync('hasCompletedOnboarding');
    
    if (hasCompletedOnboarding) {
      // 已完成引导，直接进入首页
      wx.switchTab({
        url: '/pages/home/home',
      });
    } else {
      // 未完成引导，显示引导页
      wx.reLaunch({
        url: '/pages/onboarding/onboarding',
      });
    }

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    systemInfo: null
  }
})
