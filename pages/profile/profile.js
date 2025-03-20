// pages/profile/profile.js
const api = require('../../utils/api');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
    targetWeight: 65,
    initialWeight: 70,
    gender: 'male', // 'male' 或 'female'
    height: 170,
    age: 25,
    activity: 'moderate', // 'low', 'moderate', 'high'
    bmi: 0,
    bmr: 0,
    recommendedCalories: 0,
    showBmiInfo: false,
    showCaloriesInfo: false,
    showSuccessToast: false,
    avatarUrl: '/assets/images/user.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadUserProfile();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      });
    }
    this.loadUserProfile();
  },

  /**
   * 加载用户个人资料
   */
  loadUserProfile: function () {
    api.getUserInfo().then(profile => {
      if (profile) {
        this.setData({
          userInfo: profile,
          hasUserInfo: true,
          targetWeight: profile.targetWeight || 0,
          initialWeight: profile.initialWeight || 0,
          gender: profile.gender || 'male',
          height: profile.height || 170,
          age: profile.age || 25,
          activity: profile.activity || 'moderate',
          avatarUrl: profile.avatarUrl || '/assets/images/user.png'
        });
        
        // 计算BMI和BMR
        this.calculateBMI();
        this.calculateBMR();
      }
    }).catch(err => {
      wx.showToast({
        title: '获取用户资料失败',
        icon: 'none'
      });
    });
  },

  /**
   * 获取微信用户信息
   */
  getUserProfile: function () {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        const userInfo = {
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        };
        
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true
        });
        
        // 保存用户信息
        api.saveUserProfile({
          ...this.data,
          userInfo: userInfo
        }).catch(err => {
          wx.showToast({
            title: '保存用户资料失败',
            icon: 'none'
          });
        });
      }
    });
  },

  /**
   * 输入身高
   */
  onHeightInput: function (e) {
    const height = parseFloat(e.detail.value);
    this.setData({
      height: height
    });
    this.calculateBMI();
    this.calculateBMR();
  },

  /**
   * 输入年龄
   */
  onAgeInput: function (e) {
    const age = parseInt(e.detail.value);
    this.setData({
      age: age
    });
    this.calculateBMR();
  },

  /**
   * 选择性别
   */
  onGenderChange: function (e) {
    const gender = e.detail.value;
    this.setData({
      gender: gender
    });
    this.calculateBMR();
  },

  /**
   * 选择活动水平
   */
  onActivityChange: function (e) {
    const activity = e.detail.value;
    this.setData({
      activity: activity
    });
    this.calculateBMR();
  },

  /**
   * 输入目标体重
   */
  onTargetWeightInput: function (e) {
    const targetWeight = parseFloat(e.detail.value);
    this.setData({
      targetWeight: targetWeight
    });
  },

  /**
   * 输入初始体重
   */
  onInitialWeightInput: function (e) {
    const initialWeight = parseFloat(e.detail.value);
    this.setData({
      initialWeight: initialWeight
    });
    this.calculateBMI();
  },

  /**
   * 计算BMI
   */
  calculateBMI: function () {
    const { height, initialWeight } = this.data;
    if (height > 0 && initialWeight > 0) {
      // BMI = 体重(kg) / 身高(m)²
      const heightInMeters = height / 100;
      const bmi = (initialWeight / (heightInMeters * heightInMeters)).toFixed(1);
      this.setData({
        bmi: bmi
      });
    } else {
      this.setData({
        bmi: 0
      });
    }
  },

  /**
   * 计算BMR和推荐卡路里
   */
  calculateBMR: function () {
    const { gender, height, initialWeight, age, activity } = this.data;
    
    if (height > 0 && initialWeight > 0 && age > 0) {
      let bmr = 0;
      
      // 使用Harris-Benedict公式计算BMR
      if (gender === 'male') {
        bmr = 13.397 * initialWeight + 4.799 * height - 5.677 * age + 88.362;
      } else {
        bmr = 9.247 * initialWeight + 3.098 * height - 4.330 * age + 447.593;
      }
      
      // 根据活动水平计算推荐卡路里
      let activityFactor = 1.2; // 低活动水平
      if (activity === 'moderate') {
        activityFactor = 1.55; // 中等活动水平
      } else if (activity === 'high') {
        activityFactor = 1.9; // 高活动水平
      }
      
      const recommendedCalories = Math.round(bmr * activityFactor);
      
      this.setData({
        bmr: Math.round(bmr),
        recommendedCalories: recommendedCalories
      });
    } else {
      this.setData({
        bmr: 0,
        recommendedCalories: 0
      });
    }
  },

  /**
   * 显示BMI信息
   */
  showBmiInfo: function () {
    this.setData({
      showBmiInfo: true
    });
  },

  /**
   * 关闭BMI信息
   */
  closeBmiInfo: function () {
    this.setData({
      showBmiInfo: false
    });
  },

  /**
   * 显示卡路里信息
   */
  showCaloriesInfo: function () {
    this.setData({
      showCaloriesInfo: true
    });
  },

  /**
   * 关闭卡路里信息
   */
  closeCaloriesInfo: function () {
    this.setData({
      showCaloriesInfo: false
    });
  },

  /**
   * 保存个人资料
   */
  saveProfile: function () {
    const { userInfo, targetWeight, initialWeight, gender, height, age, activity } = this.data;
    
    // 表单验证
    if (!initialWeight || initialWeight <= 0) {
      wx.showToast({
        title: '请输入有效的初始体重',
        icon: 'none'
      });
      return;
    }
    
    if (!height || height <= 0) {
      wx.showToast({
        title: '请输入有效的身高',
        icon: 'none'
      });
      return;
    }
    
    if (!age || age <= 0) {
      wx.showToast({
        title: '请输入有效的年龄',
        icon: 'none'
      });
      return;
    }
    
    // 保存个人资料
    const profile = {
      userInfo,
      targetWeight,
      initialWeight,
      gender,
      height,
      age,
      activity
    };
    
    api.saveUserProfile(profile).then(() => {
      this.setData({
        showSuccessToast: true
      });
      
      // 3秒后关闭成功提示
      setTimeout(() => {
        this.setData({
          showSuccessToast: false
        });
      }, 3000);
    }).catch(err => {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    });
  }
});