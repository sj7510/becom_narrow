// 引入API服务
const api = require('../../utils/api');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentStep: 1, // 当前步骤，1-基本信息，2-目标设定，3-完成
    totalSteps: 3,
    userInfo: {
      avatarUrl: '/assets/images/user.png',
      nickName: '用户',
      gender: 1, // 默认男性
      height: 170, // 默认身高 170cm
      birthday: '1990-01-01', // 默认生日
      initialWeight: 70, // 默认体重 70kg
      targetWeight: 65, // 默认目标体重 65kg
      targetDate: '', // 目标日期
      goalType: 'reduce' // 默认目标类型：减重
    },
    genderOptions: [
      { id: 1, name: '男' },
      { id: 2, name: '女' }
    ],
    goalOptions: [
      { id: 'reduce', name: '减重', icon: 'arrow-down', desc: '降低体重，改善身材' },
      { id: 'maintain', name: '维持', icon: 'minus', desc: '保持现有体重，改善身体成分' },
      { id: 'increase', name: '增肌', icon: 'arrow-up', desc: '增加肌肉量，提高力量' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 输出日志,检查页面字体加载情况
    console.log('正在加载 FontAwesome 图标字体...');
    
    // 默认设置目标日期为3个月后
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setMonth(today.getMonth() + 3);
    
    this.setData({
      'userInfo.targetDate': this.formatDate(targetDate)
    });
  },

  /**
   * 用户点击获取头像
   */
  onChooseAvatar(e) {
    // 如果avatarUrl存在，表示用户成功选择了头像
    if (e.detail && e.detail.avatarUrl) {
      const { avatarUrl } = e.detail;
      this.setData({
        'userInfo.avatarUrl': avatarUrl
      });
    }
    // 如果用户取消了选择，不做任何处理
  },

  /**
   * 用户输入昵称
   */
  onInputNickname(e) {
    this.setData({
      'userInfo.nickName': e.detail.value
    });
  },

  /**
   * 用户选择性别
   */
  onSelectGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({
      'userInfo.gender': gender
    });
  },

  /**
   * 用户输入身高
   */
  onInputHeight(e) {
    this.setData({
      'userInfo.height': e.detail.value
    });
  },

  /**
   * 用户选择生日
   */
  onBirthdayChange(e) {
    this.setData({
      'userInfo.birthday': e.detail.value
    });
  },

  /**
   * 用户输入初始体重
   */
  onInputInitialWeight(e) {
    this.setData({
      'userInfo.initialWeight': e.detail.value
    });
  },

  /**
   * 用户选择目标类型
   */
  onSelectGoal(e) {
    const goalType = e.currentTarget.dataset.goal;
    this.setData({
      'userInfo.goalType': goalType
    });
  },

  /**
   * 用户输入目标体重
   */
  onInputTargetWeight(e) {
    this.setData({
      'userInfo.targetWeight': e.detail.value
    });
  },

  /**
   * 用户选择目标日期
   */
  onTargetDateChange(e) {
    this.setData({
      'userInfo.targetDate': e.detail.value
    });
  },

  /**
   * 下一步
   */
  onNextStep() {
    const { currentStep, userInfo } = this.data;
    
    // 验证当前步骤的数据
    if (currentStep === 1) {
      if (!userInfo.nickName) {
        wx.showToast({
          title: '请输入您的昵称',
          icon: 'none'
        });
        return;
      }
    } else if (currentStep === 2) {
      if (userInfo.goalType === 'reduce' && parseFloat(userInfo.targetWeight) >= parseFloat(userInfo.initialWeight)) {
        wx.showToast({
          title: '减重目标应小于初始体重',
          icon: 'none'
        });
        return;
      } else if (userInfo.goalType === 'increase' && parseFloat(userInfo.targetWeight) <= parseFloat(userInfo.initialWeight)) {
        wx.showToast({
          title: '增肌目标应大于初始体重',
          icon: 'none'
        });
        return;
      }
    }
    
    if (currentStep < this.data.totalSteps) {
      this.setData({
        currentStep: currentStep + 1
      });
    } else {
      this.saveUserInfo();
    }
  },

  /**
   * 上一步
   */
  onPrevStep() {
    if (this.data.currentStep > 1) {
      this.setData({
        currentStep: this.data.currentStep - 1
      });
    }
  },

  /**
   * 保存用户信息并导航到首页
   */
  saveUserInfo() {
    const userInfo = this.data.userInfo;
    
    wx.showLoading({
      title: '保存中...',
    });
    
    api.updateUserInfo(userInfo).then(res => {
      wx.hideLoading();
      
      // 设置已完成引导
      wx.setStorageSync('hasCompletedOnboarding', true);
      
      // 跳转到首页
      wx.reLaunch({
        url: '/pages/home/home',
      });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      });
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
  }
}); 