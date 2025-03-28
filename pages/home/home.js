// pages/home/home.js
const api = require('../../utils/api');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    // 用户信息
    userInfo: {
      nickname: '加载中...',
      height: 170,
      initialWeight: 0,
      targetWeight: 0,
      targetDate: '',
      goalType: 'reduce'
    },
    // 最新体重记录
    latestWeight: {
      weight: 0,
      date: '',
      bodyFat: 0
    },
    // 体重变化
    weightChange: 0,
    weightChangeType: 'decrease',
    // BMI指数
    bmi: '0.0',
    bmiStatus: {
      status: '计算中',
      color: '',
    },
    // 图表数据
    chartData: [],
    // 图表周期
    period: 'week',
    // 目标进度
    goalProgress: 0,
    // 剩余天数
    daysRemaining: 0,
    records: [],
    isDefaultAvatar: true,
    hasNotification: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置引导页已完成，确保底部导航条显示
    wx.setStorageSync('hasCompletedOnboarding', true);
    
    this.loadUserInfo();
    this.loadWeightRecords();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0  // 首页是第一个 tab
      });
    }
    
    // 每次显示页面时刷新数据
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
        this.calculateGoalProgress();
        
        this.setData({
          records: records,
          latestWeight: latestRecord,
          weightChange: weightChange,
          weightChangeType: weightChangeType,
          bmi: bmi,
          bmiStatus: bmiStatus,
          chartData: chartData,
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
      return {
        message: '暂无体重记录数据',
        isEmpty: true
      };
    }

    const period = this.data.period;
    let chartRecords = [];
    
    // 根据不同周期处理数据
    if (period === 'week') {
      // 最多显示7天数据，按日期升序排列
      chartRecords = records.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);
      
      // 格式化日期为"月/日"
      return chartRecords.map(record => {
        const date = new Date(record.date);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return {
          date: `${month}/${day}`,
          weight: record.weight
        };
      });
    } else if (period === 'month') {
      // 选择具有代表性的数据点，最多12个
      chartRecords = this.selectRepresentativeRecords(records, 12);
      
      // 格式化日期为"月/日"
      return chartRecords.map(record => {
        const date = new Date(record.date);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return {
          date: `${month}/${day}`,
          weight: record.weight
        };
      });
    } else if (period === 'year') {
      // 选择具有代表性的数据点，最多12个（每月一个）
      chartRecords = this.selectRepresentativeRecords(records, 12);
      
      // 格式化日期为"月份"
      return chartRecords.map(record => {
        const date = new Date(record.date);
        const month = date.getMonth() + 1;
        return {
          date: `${month}月`,
          weight: record.weight
        };
      });
    } else {
      // 默认显示所有数据中的最多12个代表性数据点
      chartRecords = this.selectRepresentativeRecords(records, 12);
      
      // 格式化日期为"月/日"
      return chartRecords.map(record => {
        const date = new Date(record.date);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return {
          date: `${month}/${day}`,
          weight: record.weight
        };
      });
    }
  },
  
  /**
   * 从记录中选择具有代表性的数据点
   * @param {Array} records 记录数组
   * @param {Number} count 需要的数据点数量
   * @returns {Array} 选择后的记录数组
   */
  selectRepresentativeRecords(records, count) {
    if (records.length <= count) {
      return records.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    // 排序记录（按日期升序）
    const sortedRecords = records.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const step = Math.max(1, Math.floor(sortedRecords.length / count));
    const result = [];
    
    // 添加第一条记录
    result.push(sortedRecords[0]);
    
    // 等距离选择中间的记录
    for (let i = step; i < sortedRecords.length - step; i += step) {
      result.push(sortedRecords[i]);
    }
    
    // 确保添加最后一条记录
    if (result.length < count && sortedRecords.length > 1) {
      result.push(sortedRecords[sortedRecords.length - 1]);
    }
    
    // 如果还是不够数量，添加更多记录
    let i = step / 2;
    while (result.length < count && i < sortedRecords.length) {
      if (!result.includes(sortedRecords[i])) {
        result.push(sortedRecords[i]);
      }
      i += step;
    }
    
    // 按日期排序
    return result.sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  /**
   * 计算目标进度并设置到数据中
   */
  calculateGoalProgress() {
    const { userInfo, latestWeight } = this.data;
    
    if (!userInfo || !userInfo.initialWeight || !userInfo.targetWeight || !latestWeight) {
      this.setData({
        goalProgress: 0
      });
      return;
    }
    
    // 计算进度百分比
    const initialWeight = parseFloat(userInfo.initialWeight);
    const targetWeight = parseFloat(userInfo.targetWeight);
    const currentWeight = parseFloat(latestWeight.weight || initialWeight);
    
    // 如果初始体重和目标体重相同，则进度为100%
    if (initialWeight === targetWeight) {
      this.setData({
        goalProgress: 100
      });
      return;
    }
    
    // 计算已完成的减重/增重比例
    let progress = 0;
    if (userInfo.goalType === 'reduce') {
      // 减重目标：初始体重 > 目标体重
      if (initialWeight <= targetWeight) {
        progress = 0;
      } else {
        progress = Math.min(100, Math.max(0, 
          ((initialWeight - currentWeight) / (initialWeight - targetWeight)) * 100
        ));
      }
    } else if (userInfo.goalType === 'increase') {
      // 增肌目标：初始体重 < 目标体重
      if (initialWeight >= targetWeight) {
        progress = 0;
      } else {
        progress = Math.min(100, Math.max(0, 
          ((currentWeight - initialWeight) / (targetWeight - initialWeight)) * 100
        ));
      }
    } else {
      // 维持目标：计算与目标的接近程度
      const difference = Math.abs(currentWeight - targetWeight);
      const maxDifference = Math.abs(initialWeight - targetWeight);
      progress = Math.min(100, Math.max(0, 
        ((maxDifference - difference) / maxDifference) * 100
      ));
    }
    
    // 计算剩余天数
    let daysRemaining = 0;
    if (userInfo.targetDate) {
      const today = new Date();
      const targetDate = new Date(userInfo.targetDate);
      const timeDiff = targetDate.getTime() - today.getTime();
      daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    }
    
    this.setData({
      goalProgress: Math.round(progress),
      daysRemaining: daysRemaining
    });
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
   * 切换图表周期
   */
  changePeriod(e) {
    const period = e.currentTarget.dataset.period;
    if (period === this.data.period) return;
    
    this.setData({
      period: period,
      loading: true
    });
    
    // 重新加载对应周期的数据
    api.getWeightRecords(period).then(records => {
      // 为图表准备数据
      const chartData = this.prepareChartData(records);
      this.setData({
        records: records,
        chartData: chartData,
        loading: false
      });
    }).catch(err => {
      console.error('获取记录失败:', err);
      this.setData({
        loading: false,
        chartData: {
          message: '加载数据失败',
          isEmpty: true
        }
      });
      wx.showToast({
        title: '获取记录失败',
        icon: 'none'
      });
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