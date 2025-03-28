/**
 * 模拟数据服务
 * 包含所有模拟数据
 */

// 用户信息
const userInfo = {
  avatarUrl: '/assets/images/user.png',
  nickName: '张三',
  gender: 1, // 1: 男性, 2: 女性
  height: 175, // 单位：cm
  birthday: '1990-01-01',
  initialWeight: 75, // 单位：kg
  targetWeight: 68, // 单位：kg
  targetDate: '2024-06-01',
  goalType: 'reduce', // reduce: 减重, maintain: 维持, increase: 增肌
  bmr: 1700, // 基础代谢率
  age: 34
};

// 体重记录历史（按日期降序排列）
const weightHistory = [
  { date: '2024-03-18', weight: 72.2, bodyfat: 22.8, time: '07:45', note: '早餐前' },
  { date: '2024-03-17', weight: 72.4, bodyfat: 22.9, time: '08:30', note: '早餐前' },
  { date: '2024-03-16', weight: 72.5, bodyfat: 23.0, time: '09:00', note: '周末早餐前' },
  { date: '2024-03-14', weight: 72.9, bodyfat: 23.2, time: '08:05', note: '早餐前' },
  { date: '2024-03-12', weight: 73.3, bodyfat: 23.4, time: '07:40', note: '早餐前' },
  { date: '2024-03-10', weight: 73.5, bodyfat: 23.6, time: '08:10', note: '早餐前，有点脱水' },
  { date: '2024-03-08', weight: 73.8, bodyfat: 23.8, time: '08:00', note: '早餐前' },
  { date: '2024-03-06', weight: 74.1, bodyfat: 24.0, time: '07:50', note: '早餐前' },
  { date: '2024-03-05', weight: 74.3, bodyfat: 24.1, time: '08:15', note: '跑步后' },
  { date: '2024-03-03', weight: 74.7, bodyfat: 24.3, time: '07:45', note: '早餐前' },
  { date: '2024-03-02', weight: 74.8, bodyfat: 24.4, time: '07:30', note: '早餐前' },
  { date: '2024-03-01', weight: 75.0, bodyfat: 24.5, time: '08:00', note: '初始记录' }
];

// 健康建议
const healthAdvice = [
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
    title: '高效燃脂运动方案',
    subtitle: '每周3次，每次30分钟',
    content: '高强度间歇训练(HIIT)是最有效的燃脂方式之一。尝试30秒全力运动后休息30秒，重复8-10次为一组，每次训练做3-4组。力量训练也很重要，它可以提高基础代谢率，帮助你在休息时也能燃烧更多卡路里。',
    imageUrl: '/assets/images/exercise-tips.png',
    likes: 98,
    isLiked: true
  },
  {
    id: 3,
    type: 'rest',
    title: '睡眠对减重的重要性',
    subtitle: '如何通过优质睡眠促进减重',
    content: '充足的睡眠对维持健康体重至关重要。研究表明，睡眠不足会增加饥饿感和食欲，特别是对高热量、高碳水化合物的食物。尝试每晚保持7-8小时的睡眠，建立规律的睡眠时间表，避免睡前使用电子设备。',
    imageUrl: '/assets/images/sleep-tips.png',
    likes: 76,
    isLiked: false
  }
];

// 成就系统
const achievements = [
  {
    id: 1,
    name: '开始之旅',
    description: '完成首次体重记录',
    icon: 'flag',
    completed: true,
    progress: 100
  },
  {
    id: 2,
    name: '连续记录',
    description: '连续记录体重7天',
    icon: 'calendar',
    completed: true,
    progress: 100
  },
  {
    id: 3,
    name: '稳步前进',
    description: '减重1公斤',
    icon: 'chart-line',
    completed: true,
    progress: 100
  },
  {
    id: 4,
    name: '目标达成',
    description: '达到目标体重',
    icon: 'trophy',
    completed: false,
    progress: 42
  },
  {
    id: 5,
    name: '连续打卡',
    description: '连续使用30天',
    icon: 'calendar-check',
    completed: false,
    progress: 60
  }
];

// 导出所有模拟数据
module.exports = {
  userInfo,
  weightHistory,
  healthAdvice,
  achievements
}; 