/**
 * API 请求工具类
 * 包含所有接口请求和模拟数据
 */

// 模拟用户数据
const mockUser = {
  avatarUrl: '/assets/images/user.png',
  nickName: '张三',
  gender: 1, // 1: 男性, 2: 女性
  height: 175, // 单位：cm
  birthday: '1990-01-01',
  initialWeight: 75, // 单位：kg
  targetWeight: 68, // 单位：kg
  targetDate: '2024-06-01',
  goalType: 'reduce', // reduce: 减重, maintain: 维持, increase: 增肌
  bmr: 1700 // 基础代谢率
};

// 模拟体重记录数据
const mockWeightRecords = [
  { date: '2024-03-01', weight: 75.0, bodyFat: 24.5, note: '初始记录', time: '08:00' },
  { date: '2024-03-02', weight: 74.8, bodyFat: 24.4, note: '早餐前', time: '07:30' },
  { date: '2024-03-03', weight: 74.7, bodyFat: 24.3, note: '', time: '07:45' },
  { date: '2024-03-05', weight: 74.3, bodyFat: 24.1, note: '跑步后', time: '08:15' },
  { date: '2024-03-06', weight: 74.1, bodyFat: 24.0, note: '', time: '07:50' },
  { date: '2024-03-08', weight: 73.8, bodyFat: 23.8, note: '', time: '08:00' },
  { date: '2024-03-10', weight: 73.5, bodyFat: 23.6, note: '有点脱水', time: '08:10' },
  { date: '2024-03-12', weight: 73.3, bodyFat: 23.4, note: '', time: '07:40' },
  { date: '2024-03-14', weight: 72.9, bodyFat: 23.2, note: '', time: '08:05' },
  { date: '2024-03-16', weight: 72.5, bodyFat: 23.0, note: '周末', time: '09:00' },
  { date: '2024-03-17', weight: 72.4, bodyFat: 22.9, note: '', time: '08:30' },
  { date: '2024-03-18', weight: 72.2, bodyFat: 22.8, note: '', time: '07:45' }
];

// 模拟健康建议数据
const mockHealthAdvice = [
  {
    id: 1,
    type: 'diet',
    title: '减轻体重的饮食技巧',
    subtitle: '了解如何通过饮食控制热量摄入',
    content: '控制热量摄入是减轻体重的关键。尝试增加蛋白质摄入，减少精制碳水化合物和添加糖的摄入。每餐增加蔬菜的比例，可以增加饱腹感同时减少总热量。尝试间歇性禁食也是一种有效的减重方法。',
    imageUrl: '/assets/images/diet-tips.png',
    likes: 124,
    isLiked: false
  },
  {
    id: 2,
    type: 'exercise',
    title: '高效燃脂的运动方案',
    subtitle: '科学的有氧与力量训练结合',
    content: '结合有氧运动和力量训练可以最大化脂肪燃烧效果。建议每周进行3-4次30分钟以上的有氧训练，如快走、跑步或游泳。此外，每周进行2-3次全身力量训练，增加肌肉量可以提高基础代谢率，帮助长期保持体重。',
    imageUrl: '/assets/images/exercise-plan.png',
    likes: 98,
    isLiked: true
  },
  {
    id: 3,
    type: 'rest',
    title: '充足睡眠对体重管理的重要性',
    subtitle: '睡眠不足会影响荷尔蒙平衡',
    content: '研究表明，睡眠不足会扰乱调节饥饿感的荷尔蒙平衡，增加饥饿感并降低饱腹感。成年人应该每晚保证7-8小时的高质量睡眠。尝试建立规律的睡眠时间表，避免睡前使用电子设备，并创造一个舒适的睡眠环境。',
    imageUrl: '/assets/images/sleep-importance.png',
    likes: 75,
    isLiked: false
  }
];

// 模拟成就数据
const mockAchievements = [
  {
    id: 1,
    name: '记录先锋',
    description: '连续记录7天',
    icon: 'fire',
    achieved: true,
    date: '2024-03-08'
  },
  {
    id: 2,
    name: '稳步减重',
    description: '一周减重0.5kg',
    icon: 'chart-line',
    achieved: true,
    date: '2024-03-14'
  },
  {
    id: 3,
    name: '健康达人',
    description: 'BMI达到健康范围',
    icon: 'medal',
    achieved: false,
    progress: 80
  }
];

/**
 * 获取用户信息
 */
function getUserInfo() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUser);
    }, 500);
  });
}

/**
 * 更新用户信息
 * @param {Object} userInfo 用户信息
 */
function updateUserInfo(userInfo) {
  return new Promise((resolve) => {
    setTimeout(() => {
      Object.assign(mockUser, userInfo);
      resolve(mockUser);
    }, 500);
  });
}

/**
 * 获取体重记录
 * @param {string} period 时间段：week, month, all
 */
function getWeightRecords(period = 'all') {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredRecords = [...mockWeightRecords];
      
      if (period === 'week') {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredRecords = mockWeightRecords.filter(record => 
          new Date(record.date) >= oneWeekAgo
        );
      } else if (period === 'month') {
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        filteredRecords = mockWeightRecords.filter(record => 
          new Date(record.date) >= oneMonthAgo
        );
      }
      
      resolve(filteredRecords);
    }, 500);
  });
}

/**
 * 添加体重记录
 * @param {Object} record 体重记录
 */
function addWeightRecord(record) {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockWeightRecords.push(record);
      mockWeightRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
      resolve(record);
    }, 500);
  });
}

/**
 * 获取健康建议
 * @param {string} type 建议类型：all, diet, exercise, rest
 */
function getHealthAdvice(type = 'all') {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (type === 'all') {
        resolve(mockHealthAdvice);
      } else {
        const filteredAdvice = mockHealthAdvice.filter(advice => advice.type === type);
        resolve(filteredAdvice);
      }
    }, 500);
  });
}

/**
 * 获取用户成就
 */
function getAchievements() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAchievements);
    }, 500);
  });
}

/**
 * 计算BMI
 * @param {number} weight 体重(kg)
 * @param {number} height 身高(cm)
 */
function calculateBMI(weight, height) {
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
}

/**
 * 获取BMI状态
 * @param {number} bmi BMI值
 */
function getBMIStatus(bmi) {
  if (bmi < 18.5) return { status: '偏瘦', color: '#FFC107' };
  if (bmi < 24) return { status: '健康', color: '#4CAF50' };
  if (bmi < 28) return { status: '超重', color: '#FF9800' };
  return { status: '肥胖', color: '#F44336' };
}

/**
 * 获取用户个人资料
 */
function getUserProfile() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUser);
    }, 500);
  });
}

/**
 * 保存用户个人资料
 * @param {Object} profile 用户个人资料
 */
function saveUserProfile(profile) {
  return new Promise((resolve) => {
    setTimeout(() => {
      Object.assign(mockUser, profile);
      resolve(mockUser);
    }, 500);
  });
}

/**
 * 检查头像URL是否为默认头像
 * @param {string} url 头像URL
 */
function isDefaultAvatar(url) {
  return url && url.indexOf('/assets/') === 0;
}

module.exports = {
  getUserInfo,
  updateUserInfo,
  getWeightRecords,
  addWeightRecord,
  getHealthAdvice,
  getAchievements,
  calculateBMI,
  getBMIStatus,
  getUserProfile,
  saveUserProfile,
  isDefaultAvatar
}; 