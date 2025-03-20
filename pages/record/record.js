// pages/record/record.js
const api = require('../../utils/api');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    weight: '',
    bodyFat: '',
    note: '',
    date: '',
    time: '',
    showKeyboard: false,
    currentInput: 'weight', // 'weight' 或 'bodyFat'
    device: {
      connected: false,
      name: '云康宝体脂秤',
      lastSync: '今天 08:15'
    },
    savedRecords: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 初始化日期为今天
    const now = new Date();
    const today = this.formatDate(now);
    const currentTime = this.formatTime(now);
    
    this.setData({
      date: today,
      time: currentTime
    });
    
    // 加载最近的记录
    this.loadRecentRecords();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
    // 加载最近的记录
    this.loadRecentRecords();
  },

  /**
   * 加载最近的记录
   */
  loadRecentRecords() {
    api.getWeightRecords('week').then(records => {
      // 只取最近5条记录
      const recentRecords = records.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
      this.setData({
        savedRecords: recentRecords
      });
    });
  },

  /**
   * 显示数字键盘
   */
  showNumKeyboard(e) {
    const inputType = e.currentTarget.dataset.type;
    this.setData({
      showKeyboard: true,
      currentInput: inputType
    });
  },

  /**
   * 隐藏数字键盘
   */
  hideNumKeyboard() {
    this.setData({
      showKeyboard: false
    });
  },

  /**
   * 数字键盘输入处理
   */
  onKeyTap(e) {
    const key = e.currentTarget.dataset.key;
    const { currentInput, weight, bodyFat } = this.data;
    
    // 获取当前输入值
    let currentValue = currentInput === 'weight' ? weight : bodyFat;
    
    // 处理不同按键
    if (key === 'delete') {
      // 删除最后一个字符
      currentValue = currentValue.slice(0, -1);
    } else if (key === 'done') {
      // 完成输入，关闭键盘
      this.hideNumKeyboard();
      return;
    } else if (key === '.') {
      // 添加小数点，如果没有
      if (!currentValue.includes('.')) {
        currentValue += '.';
      }
    } else {
      // 数字键
      // 如果已经有小数点，则限制小数点后最多1位
      if (currentValue.includes('.') && currentValue.split('.')[1].length >= 1) {
        return;
      }
      
      // 限制整数部分最多3位数字
      if (!currentValue.includes('.') && currentValue.length >= 3) {
        return;
      }
      
      currentValue += key;
    }
    
    // 更新相应的数据
    if (currentInput === 'weight') {
      this.setData({ weight: currentValue });
    } else {
      this.setData({ bodyFat: currentValue });
    }
  },

  /**
   * 日期选择器变化处理
   */
  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  /**
   * 时间选择器变化处理
   */
  onTimeChange(e) {
    this.setData({
      time: e.detail.value
    });
  },

  /**
   * 备注输入处理
   */
  onNoteInput(e) {
    this.setData({
      note: e.detail.value
    });
  },

  /**
   * 同步设备数据
   */
  syncDevice() {
    wx.showLoading({
      title: '同步中...',
    });
    
    // 模拟同步延迟
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟获取到的数据
      this.setData({
        weight: '68.2',
        bodyFat: '23.5',
        device: {
          connected: true,
          name: '云康宝体脂秤',
          lastSync: '刚刚'
        }
      });
      
      wx.showToast({
        title: '同步成功',
        icon: 'success'
      });
    }, 1500);
  },

  /**
   * 保存记录
   */
  saveRecord() {
    const { weight, bodyFat, date, time, note } = this.data;
    
    // 验证必填项
    if (!weight || weight === '0') {
      wx.showToast({
        title: '请输入有效体重',
        icon: 'none'
      });
      return;
    }
    
    // 创建记录对象
    const record = {
      date: date,
      time: time,
      weight: parseFloat(weight),
      bodyFat: bodyFat ? parseFloat(bodyFat) : null,
      note: note
    };
    
    wx.showLoading({
      title: '保存中...',
    });
    
    // 调用API保存记录
    api.addWeightRecord(record).then(res => {
      wx.hideLoading();
      
      wx.showToast({
        title: '记录成功',
        icon: 'success'
      });
      
      // 重置表单
      this.resetForm();
      
      // 刷新最近记录
      this.loadRecentRecords();
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    });
  },

  /**
   * 重置表单
   */
  resetForm() {
    const now = new Date();
    this.setData({
      weight: '',
      bodyFat: '',
      note: '',
      date: this.formatDate(now),
      time: this.formatTime(now),
      showKeyboard: false
    });
  },

  /**
   * 格式化日期为 YYYY-MM-DD
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * 格式化时间为 HH:MM
   */
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadRecentRecords();
    wx.stopPullDownRefresh();
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
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})