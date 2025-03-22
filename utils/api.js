/**
 * API 请求工具类
 * 包含所有接口请求和模拟数据
 */

// 导入模拟数据
const mockData = require('./mock');

/**
 * 获取用户信息
 * @returns {Promise<Object>} 返回用户信息对象
 */
function getUserInfo() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.userInfo);
    }, 300);
  });
}

/**
 * 更新用户信息
 * @param {Object} userInfo 用户信息
 * @returns {Promise<Object>} 返回更新后的用户信息
 */
function updateUserInfo(userInfo) {
  return new Promise((resolve) => {
    setTimeout(() => {
      Object.assign(mockData.userInfo, userInfo);
      resolve(mockData.userInfo);
    }, 300);
  });
}

/**
 * 获取体重记录
 * @param {string} period 时间段：week, month, all
 * @returns {Promise<Array>} 返回体重记录数组
 */
function getWeightRecords(period = 'all') {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredRecords = [...mockData.weightHistory];
      
      if (period === 'week') {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredRecords = mockData.weightHistory.filter(record => 
          new Date(record.date) >= oneWeekAgo
        );
      } else if (period === 'month') {
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        filteredRecords = mockData.weightHistory.filter(record => 
          new Date(record.date) >= oneMonthAgo
        );
      }
      
      resolve(filteredRecords);
    }, 300);
  });
}

/**
 * 添加体重记录
 * @param {Object} record 体重记录对象 {date, weight, bodyFat, time, note}
 * @returns {Promise<Object>} 返回添加的记录
 */
function addWeightRecord(record) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 添加记录到数组开头
      mockData.weightHistory.unshift(record);
      // 排序（按日期降序）
      mockData.weightHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
      resolve(record);
    }, 300);
  });
}

/**
 * 获取健康建议
 * @param {string} type 建议类型：all, diet, exercise, rest
 * @returns {Promise<Array>} 返回建议数组
 */
function getHealthAdvice(type = 'all') {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (type === 'all') {
        resolve(mockData.healthAdvice);
      } else {
        const filteredAdvice = mockData.healthAdvice.filter(advice => advice.type === type);
        resolve(filteredAdvice);
      }
    }, 300);
  });
}

/**
 * 获取用户成就
 * @returns {Promise<Array>} 返回成就数组
 */
function getAchievements() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.achievements);
    }, 300);
  });
}

/**
 * 计算BMI
 * @param {number} weight 体重(kg)
 * @param {number} height 身高(cm)
 * @returns {string} BMI值（保留一位小数）
 */
function calculateBMI(weight, height) {
  if (!weight || !height) return '0.0';
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
}

/**
 * 获取BMI状态
 * @param {number|string} bmi BMI值
 * @returns {Object} 包含状态和颜色的对象
 */
function getBMIStatus(bmi) {
  const bmiNum = parseFloat(bmi);
  if (isNaN(bmiNum)) return { status: '数据不足', color: '#808080' };
  if (bmiNum < 18.5) return { status: '偏瘦', color: '#FFC107' };
  if (bmiNum < 24) return { status: '健康', color: '#4CAF50' };
  if (bmiNum < 28) return { status: '超重', color: '#FF9800' };
  return { status: '肥胖', color: '#F44336' };
}

/**
 * 获取用户个人资料
 * @returns {Promise<Object>} 返回用户个人资料
 */
function getUserProfile() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.userInfo);
    }, 300);
  });
}

/**
 * 保存用户个人资料
 * @param {Object} profile 用户个人资料
 * @returns {Promise<Object>} 返回更新后的个人资料
 */
function saveUserProfile(profile) {
  return new Promise((resolve) => {
    setTimeout(() => {
      Object.assign(mockData.userInfo, profile);
      resolve(mockData.userInfo);
    }, 300);
  });
}

/**
 * 检查头像URL是否为默认头像
 * @param {string} url 头像URL
 * @returns {boolean} 是否为默认头像
 */
function isDefaultAvatar(url) {
  return !url || url.indexOf('/assets/') === 0;
}

/**
 * 获取今日日期（格式：YYYY-MM-DD）
 * @returns {string} 今日日期字符串
 */
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取当前时间（格式：HH:MM）
 * @returns {string} 当前时间字符串
 */
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

module.exports = {
  // 用户相关
  getUserInfo,
  updateUserInfo,
  getUserProfile,
  saveUserProfile,
  isDefaultAvatar,
  
  // 体重记录相关
  getWeightRecords,
  addWeightRecord,
  
  // 健康指标相关
  calculateBMI,
  getBMIStatus,
  
  // 建议与成就
  getHealthAdvice,
  getAchievements,
  
  // 工具函数
  getTodayDate,
  getCurrentTime
}; 