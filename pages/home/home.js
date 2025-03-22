// pages/home/home.js
const api = require('../../utils/api');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      height: 170,
      nickName: '用户',
      initialWeight: 70,
      targetWeight: 65,
      targetDate: api.getTodayDate(),
      goalType: 'reduce'
    },
    latestWeight: {
      weight: 0,
      date: api.getTodayDate(),
      bodyfat: 0
    },
    weightChange: 0,
    weightChangeType: 'decrease', // 'increase' 或 'decrease'
    bmi: '0.0',
    bmiStatus: {
      status: '数据加载中',
      color: '#808080'
    },
    records: [],
    loading: true,
    chartData: [
      { date: '加载中', weight: 0 }
    ],
    goalProgress: 0,
    isDefaultAvatar: true,
    hasNotification: false
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
    this.setData({ loading: true });

    return api.getUserInfo().then(userInfo => {
      this.setData({
        userInfo: userInfo,
        isDefaultAvatar: api.isDefaultAvatar(userInfo.avatarUrl)
      });
      return userInfo;
    }).catch(err => {
      console.error('获取用户信息失败:', err);
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      });
      return this.data.userInfo; // 返回默认值
    });
  },

  /**
   * 加载体重记录
   */
  loadWeightRecords() {
    this.setData({ loading: true });

    return api.getWeightRecords('week').then(records => {
      if (records && records.length > 0) {
        // 获取最新记录
        const latestRecord = records[0];
        
        // 计算变化（如果有上一条记录）
        let weightChange = 0;
        let weightChangeType = 'decrease';
        
        if (records.length > 1) {
          const prevRecord = records[1];
          weightChange = (latestRecord.weight - prevRecord.weight).toFixed(1);
          weightChangeType = weightChange > 0 ? 'increase' : (weightChange < 0 ? 'decrease' : '');
          weightChange = Math.abs(weightChange);
        }
        
        // 计算BMI（只有在用户信息加载完成后才计算）
        const bmi = api.calculateBMI(latestRecord.weight, this.data.userInfo?.height);
        const bmiStatus = api.getBMIStatus(bmi);
        
        // 为图表准备数据
        const chartData = this.prepareChartData(records);
        
        // 计算目标进度
        const goalProgress = this.calculateGoalProgress(latestRecord.weight);
        
        this.setData({
          records: records,
          latestWeight: latestRecord,
          weightChange: weightChange,
          weightChangeType: weightChangeType,
          bmi: bmi,
          bmiStatus: bmiStatus,
          chartData: chartData,
          goalProgress: goalProgress,
          loading: false
        });
      } else {
        // 没有记录时设置默认值
        const height = this.data.userInfo?.height || 170;
        const weight = this.data.userInfo?.initialWeight || 70;
        const bmi = api.calculateBMI(weight, height);
        const bmiStatus = api.getBMIStatus(bmi);
        
        this.setData({
          bmi: bmi,
          bmiStatus: bmiStatus,
          loading: false,
          chartData: [
            { date: '暂无数据', weight: 0 }
          ]
        });
      }
      
      return records;
    }).catch(err => {
      console.error('获取记录失败:', err);
      this.setData({
        loading: false
      });
      wx.showToast({
        title: '获取记录失败',
        icon: 'none'
      });
      return [];
    });
  },

  /**
   * 准备图表数据
   */
  prepareChartData(records) {
    if (!records || records.length === 0) {
      return [{ date: '暂无数据', weight: 0 }];
    }

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
    if (!userInfo || !currentWeight) return 0;
    
    const { initialWeight, targetWeight, goalType } = userInfo;
    
    // 对于维持目标，直接返回100%
    if (goalType === 'maintain') return 100;
    
    // 减重目标
    if (goalType === 'reduce') {
      if (currentWeight <= targetWeight) return 100;
      
      const totalReduction = initialWeight - targetWeight;
      if (totalReduction <= 0) return 0; // 避免除以0
      
      const currentReduction = initialWeight - currentWeight;
      
      return Math.min(100, Math.max(0, Math.round((currentReduction / totalReduction) * 100)));
    }
    
    // 增肌目标
    if (goalType === 'increase') {
      if (currentWeight >= targetWeight) return 100;
      
      const totalIncrease = targetWeight - initialWeight;
      if (totalIncrease <= 0) return 0; // 避免除以0
      
      const currentIncrease = currentWeight - initialWeight;
      
      return Math.min(100, Math.max(0, Math.round((currentIncrease / totalIncrease) * 100)));
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
    }).catch(() => {
      wx.stopPullDownRefresh();
    });
  }
});