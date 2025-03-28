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
    savedRecords: [],
    showKeyboard: false,
    currentInput: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 初始化日期为今天
    const today = new Date();
    const formattedDate = this.formatDate(today);
    const formattedTime = this.formatTime(today);
    
    this.setData({
      date: formattedDate,
      time: formattedTime,
      weight: '0.0' // 设置默认体重显示值
    });
    
    // 加载最近记录
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
      // 如果已经有小数点，则限制小数点后最多2位
      if (currentValue.includes('.') && currentValue.split('.')[1].length >= 2) {
        return;
      }
      
      // 限制整数部分最多3位数字（最大允许显示999.99）
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
   * 保存记录
   */
  saveRecord() {
    const { weight, bodyFat, date, time, note } = this.data;
    
    // 检查是否输入了体重
    if (!weight || weight === '0.0' || weight === '.') {
      wx.showToast({
        title: '请输入有效体重',
        icon: 'none'
      });
      return;
    }
    
    // 构建记录对象
    const record = {
      weight: parseFloat(weight),
      date: date,
      time: time,
      note: note,
    };
    
    // 如果有体脂率，添加到记录中
    if (bodyFat && bodyFat !== '0.0' && bodyFat !== '.') {
      record.bodyFat = parseFloat(bodyFat);
    }
    
    // 调用API保存记录
    api.addWeightRecord(record).then(() => {
      wx.showToast({
        title: '记录保存成功',
        icon: 'success'
      });
      
      // 重新加载记录
      this.loadRecentRecords();
      
      // 重置输入
      this.setData({
        weight: '0.0',
        bodyFat: '',
        note: ''
      });
    }).catch(err => {
      console.error('保存记录失败', err);
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      });
    });
  },
  
  /**
   * 格式化日期为YYYY-MM-DD格式
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  
  /**
   * 格式化时间为HH:MM格式
   */
  formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
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