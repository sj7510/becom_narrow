// pages/stats/stats.js
const api = require('../../utils/api');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    period: 'month', // 'week', 'month', 'all'
    records: [],
    chartData: [],
    loading: true,
    stats: {
      averageWeight: 0,
      lowestWeight: 0,
      highestWeight: 0,
      totalChange: 0
    },
    currentMonth: '',
    calendarData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 设置当前月份
    const now = new Date();
    const currentMonth = `${now.getFullYear()}年${now.getMonth() + 1}月`;
    this.setData({
      currentMonth: currentMonth
    });
    
    this.loadWeightRecords();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
    }
  },

  /**
   * 加载体重记录
   */
  loadWeightRecords() {
    const { period } = this.data;
    
    wx.showLoading({
      title: '加载中',
    });
    
    api.getWeightRecords(period).then(records => {
      wx.hideLoading();
      
      if (records && records.length > 0) {
        // 按日期排序（从旧到新）
        records.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // 计算统计数据
        const stats = this.calculateStats(records);
        
        // 为图表准备数据
        const chartData = this.prepareChartData(records);
        
        // 准备日历数据
        const calendarData = this.prepareCalendarData(records);
        
        this.setData({
          records: records,
          chartData: chartData,
          stats: stats,
          calendarData: calendarData,
          loading: false
        });
      } else {
        this.setData({
          records: [],
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
   * 计算统计数据
   */
  calculateStats(records) {
    // 提取体重值
    const weights = records.map(record => record.weight);
    
    // 计算平均值
    const sum = weights.reduce((acc, weight) => acc + weight, 0);
    const averageWeight = (sum / weights.length).toFixed(1);
    
    // 计算最低值和最高值
    const lowestWeight = Math.min(...weights).toFixed(1);
    const highestWeight = Math.max(...weights).toFixed(1);
    
    // 计算总变化
    const firstWeight = records[0].weight;
    const lastWeight = records[records.length - 1].weight;
    const totalChange = (lastWeight - firstWeight).toFixed(1);
    
    return {
      averageWeight,
      lowestWeight,
      highestWeight,
      totalChange
    };
  },

  /**
   * 准备图表数据
   */
  prepareChartData(records) {
    // 最多显示30个数据点
    let displayRecords = records;
    if (records.length > 30) {
      // 对于超过30个数据点的情况，按照时间间隔采样
      const step = Math.floor(records.length / 30);
      displayRecords = records.filter((_, index) => index % step === 0).slice(0, 30);
    }
    
    // 格式化数据
    return displayRecords.map(record => {
      const date = new Date(record.date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return {
        date: `${month}/${day}`,
        weight: record.weight,
        bodyFat: record.bodyFat
      };
    });
  },

  /**
   * 准备日历数据
   */
  prepareCalendarData(records) {
    // 获取当前月的日历数据
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // 当月第一天
    const firstDay = new Date(year, month, 1);
    // 当月最后一天
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取当月有多少天
    const daysInMonth = lastDay.getDate();
    
    // 第一天是星期几（0表示星期日）
    const firstDayOfWeek = firstDay.getDay();
    
    // 准备日历数据
    const calendarData = [];
    
    // 添加上个月的最后几天（填充第一周前几天）
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const day = prevMonthLastDay - firstDayOfWeek + i + 1;
      calendarData.push({
        day: day,
        fullDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        isCurrentMonth: false,
        hasRecord: false,
        weight: null
      });
    }
    
    // 添加当月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      // 查找当天是否有记录
      const record = records.find(r => r.date === fullDate);
      
      calendarData.push({
        day: i,
        fullDate: fullDate,
        isCurrentMonth: true,
        hasRecord: !!record,
        weight: record ? record.weight : null
      });
    }
    
    // 添加下个月的前几天（填充最后一周）
    const remainingCells = 42 - calendarData.length; // 6行7列共42个格子
    for (let i = 1; i <= remainingCells; i++) {
      calendarData.push({
        day: i,
        fullDate: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        isCurrentMonth: false,
        hasRecord: false,
        weight: null
      });
    }
    
    return calendarData;
  },

  /**
   * 切换周期
   */
  onPeriodChange(e) {
    const period = e.currentTarget.dataset.period;
    this.setData({
      period: period
    });
    
    this.loadWeightRecords();
  },

  /**
   * 上个月
   */
  onPrevMonth() {
    // 暂不实现翻页功能，保持当前月
    wx.showToast({
      title: '暂不支持查看历史月份',
      icon: 'none'
    });
  },

  /**
   * 下个月
   */
  onNextMonth() {
    // 暂不实现翻页功能，保持当前月
    wx.showToast({
      title: '暂不支持查看未来月份',
      icon: 'none'
    });
  },

  /**
   * 查看日期详情
   */
  onDayTap(e) {
    const index = e.currentTarget.dataset.index;
    const day = this.data.calendarData[index];
    
    // 只有当月的日期且有记录才显示详情
    if (day.isCurrentMonth && day.hasRecord) {
      // 查找当天的记录
      const record = this.data.records.find(r => r.date === day.fullDate);
      
      // 显示详情
      wx.showModal({
        title: day.fullDate,
        content: `体重: ${record.weight} kg${record.bodyFat ? '\n体脂率: ' + record.bodyFat + '%' : ''}${record.note ? '\n备注: ' + record.note : ''}`,
        showCancel: false
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadWeightRecords();
    wx.stopPullDownRefresh();
  }
});