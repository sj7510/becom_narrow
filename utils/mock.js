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
  },
  {
    id: 4,
    type: 'diet',
    title: '饮水对减重的重要性',
    subtitle: '合理饮水促进新陈代谢',
    content: '充足的水分摄入对于减重至关重要。研究表明，饮水可以暂时提高静息代谢率，帮助燃烧更多热量。此外，餐前饮水可以增加饱腹感，减少食物摄入。建议每天饮水量在2-3升左右，可以根据个人活动量适当调整。',
    imageUrl: '/assets/images/water-importance.png',
    likes: 88,
    isLiked: false
  },
  {
    id: 5,
    type: 'exercise',
    title: '力量训练的减脂效果',
    subtitle: '增肌让脂肪燃烧更持久',
    content: '很多人认为减肥只需要做有氧运动，但力量训练同样重要。肌肉组织比脂肪组织消耗更多热量，增加肌肉量可以提高基础代谢率。建议每周进行2-3次全身力量训练，每次30-45分钟，注重大肌群训练。',
    imageUrl: '/assets/images/strength-training.png',
    likes: 63,
    isLiked: false
  }
];

// 成就系统
const achievements = [
  {
    id: 1,
    name: '记录先锋',
    description: '连续记录7天体重',
    icon: 'fire',
    completed: true,
    date: '2024-03-08'
  },
  {
    id: 2,
    name: '稳步减重',
    description: '一周减重0.5kg',
    icon: 'chart-line',
    completed: true,
    date: '2024-03-14'
  },
  {
    id: 3,
    name: '健康领袖',
    description: 'BMI达到健康范围',
    icon: 'shield-alt',
    completed: false,
    progress: 80
  },
  {
    id: 4,
    name: '体重目标达成',
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

// 设备信息
const devices = [
  {
    id: 'scale001',
    name: '小米体脂秤2',
    type: 'scale',
    lastSync: '2024-03-18 07:45',
    connected: true
  }
];

// 导出所有模拟数据
module.exports = {
  userInfo,
  weightHistory,
  healthAdvice,
  achievements,
  devices
}; 