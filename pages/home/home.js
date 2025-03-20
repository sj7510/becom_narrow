// pages/home/home.js
const api = require('../../utils/api');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    latestWeight: null,
    weightChange: null,
    weightChangeType: '', // 'increase' 或 'decrease'
    bmi: null,
    bmiStatus: null,
    records: [],
    loading: true,
    chartData: [],
    goalProgress: 0,
    isDefaultAvatar: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 设置引导页已完成，确保底部导航条显示
    wx.setStorageSync('hasCompletedOnboarding', true);
    
    // 加载用户信息和体重记录
    this.loadUserInfo();
    this.loadWeightRecords();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }
    
    // 加载用户信息和体重记录
    this.loadUserInfo();
    this.loadWeightRecords();
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    wx.showLoading({
      title: '加载中',
    });

    api.getUserInfo().then(userInfo => {
      wx.hideLoading();
      this.setData({
        userInfo: userInfo,
        isDefaultAvatar: api.isDefaultAvatar(userInfo.avatarUrl)
      });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      });
    });
  },

  /**
   * 加载体重记录
   */
  loadWeightRecords() {
    wx.showLoading({
      title: '加载中',
    });

    api.getWeightRecords('week').then(records => {
      wx.hideLoading();

      if (records && records.length > 0) {
        // 排序记录（从新到旧）
        records.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 获取最新记录
        const latestRecord = records[0];
        
        // 计算变化（如果有上一条记录）
        let weightChange = null;
        let weightChangeType = '';
        
        if (records.length > 1) {
          const prevRecord = records[1];
          weightChange = (latestRecord.weight - prevRecord.weight).toFixed(1);
          weightChangeType = weightChange > 0 ? 'increase' : (weightChange < 0 ? 'decrease' : '');
        }
        
        // 计算BMI
        const bmi = api.calculateBMI(latestRecord.weight, this.data.userInfo?.height || 170);
        const bmiStatus = api.getBMIStatus(bmi);
        
        // 为图表准备数据
        const chartData = this.prepareChartData(records);
        
        // 计算目标进度
        const goalProgress = this.calculateGoalProgress(latestRecord.weight);
        
        this.setData({
          records: records,
          latestWeight: latestRecord,
          weightChange: Math.abs(weightChange),
          weightChangeType: weightChangeType,
          bmi: bmi,
          bmiStatus: bmiStatus,
          chartData: chartData,
          goalProgress: goalProgress,
          loading: false
        });
      } else {
        this.setData({
          loading: false
        });
      }
    }).catch(err => {
      wx.hideLoading();
      this.setData({
        loading: false
      });
      wx.showToast({
        title: '获取记录失败',
        icon: 'none'
      });
    });
  },

  /**
   * 准备图表数据
   */
  prepareChartData(records) {
    // 最多显示7天数据，需要倒序排列（从旧到新）
    const chartRecords = records.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);
    
    // 格式化日期为简短格式（月/日）
    return chartRecords.map(record => {
      const date = new Date(record.date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return {
        date: `${month}/${day}`,
        weight: record.weight
      };
    });
  },

  /**
   * 计算目标进度
   */
  calculateGoalProgress(currentWeight) {
    const { userInfo } = this.data;
    if (!userInfo) return 0;
    
    const { initialWeight, targetWeight, goalType } = userInfo;
    
    // 对于维持目标，直接返回100%
    if (goalType === 'maintain') return 100;
    
    // 减重目标
    if (goalType === 'reduce') {
      if (currentWeight <= targetWeight) return 100;
      
      const totalReduction = initialWeight - targetWeight;
      const currentReduction = initialWeight - currentWeight;
      
      return Math.min(100, Math.round((currentReduction / totalReduction) * 100));
    }
    
    // 增肌目标
    if (goalType === 'increase') {
      if (currentWeight >= targetWeight) return 100;
      
      const totalIncrease = targetWeight - initialWeight;
      const currentIncrease = currentWeight - initialWeight;
      
      return Math.min(100, Math.round((currentIncrease / totalIncrease) * 100));
    }
    
    return 0;
  },

  /**
   * 跳转到记录页面
   */
  goToRecord() {
    wx.switchTab({
      url: '/pages/record/record',
    });
  },

  /**
   * 跳转到统计页面
   */
  goToStats() {
    wx.switchTab({
      url: '/pages/stats/stats',
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    Promise.all([
      this.loadUserInfo(),
      this.loadWeightRecords()
    ]).then(() => {
      wx.stopPullDownRefresh();
    });
  }
});