/**
 * 模拟数据
 */

// 用户信息
const userInfo = {
  nickName: '张三',
  avatarUrl: '/assets/images/user.png',
  gender: 1, // 1 为男性，2 为女性
  height: 175, // 身高，单位cm
  weight: 70, // 当前体重，单位kg
  birthYear: 1990, // 出生年份
  goal: {
    type: 'lose', // 'lose'减重, 'gain'增肌, 'maintain'维持
    target: 65, // 目标体重
    period: 90 // 目标周期，单位天
  },
  bmr: 1650, // 基础代谢率
  dailyCalories: 1350 // 每日推荐摄入热量
};

// 体重记录历史
const weightHistory = [
  { date: '2024-03-17', weight: 70.0, bodyfat: 22.1, time: '08:30', note: '早餐前' },
  { date: '2024-03-16', weight: 70.3, bodyfat: 22.3, time: '08:15', note: '早餐前' },
  { date: '2024-03-15', weight: 70.5, bodyfat: 22.5, time: '08:30', note: '早餐前' },
  { date: '2024-03-14', weight: 70.8, bodyfat: 22.6, time: '08:20', note: '早餐前' },
  { date: '2024-03-13', weight: 71.0, bodyfat: 22.8, time: '08:45', note: '早餐前' },
  { date: '2024-03-12', weight: 71.3, bodyfat: 23.0, time: '08:30', note: '早餐前' },
  { date: '2024-03-11', weight: 71.5, bodyfat: 23.2, time: '08:15', note: '早餐前' },
  { date: '2024-03-10', weight: 71.8, bodyfat: 23.4, time: '09:00', note: '早餐后' },
  { date: '2024-03-09', weight: 71.6, bodyfat: 23.3, time: '08:30', note: '早餐前' },
  { date: '2024-03-08', weight: 71.9, bodyfat: 23.5, time: '08:45', note: '早餐前' },
  { date: '2024-03-07', weight: 72.1, bodyfat: 23.7, time: '08:30', note: '早餐前' },
  { date: '2024-03-06', weight: 72.4, bodyfat: 23.9, time: '08:35', note: '早餐前' },
  { date: '2024-03-05', weight: 72.6, bodyfat: 24.0, time: '08:30', note: '早餐前' },
  { date: '2024-03-04', weight: 72.8, bodyfat: 24.2, time: '08:15', note: '早餐前' },
];

// 健康建议
const healthAdvice = [
  {
    id: 1,
    type: 'diet',
    title: '控制晚餐摄入',
    subtitle: '基于您最近的体重波动',
    content: '您的体重近期在晚间测量时波动较大，建议晚餐减少碳水摄入，可以用蛋白质和蔬菜为主，避免19点后进食。研究表明，限制晚间进食可以有效减少热量摄入，促进脂肪燃烧。',
    image: '/assets/images/diet_control.jpg',
    likes: 128,
    createdAt: '2024-03-15'
  },
  {
    id: 2,
    type: 'exercise',
    title: '增加有氧运动',
    subtitle: '提升脂肪燃烧效率',
    content: '建议每周进行3-4次30分钟以上的中强度有氧运动，如快走、慢跑或骑行。有氧运动可以提高心肺功能，加速脂肪燃烧，同时改善胰岛素敏感性。',
    image: '/assets/images/cardio.jpg',
    likes: 95,
    createdAt: '2024-03-14'
  },
  {
    id: 3,
    type: 'sleep',
    title: '改善睡眠质量',
    subtitle: '睡眠与体重管理',
    content: '充足的睡眠对体重管理至关重要。睡眠不足会影响荷尔蒙平衡，增加饥饿感并减少饱腹感。建议每晚保持7-8小时的高质量睡眠，睡前一小时避免使用电子设备。',
    image: '/assets/images/sleep.jpg',
    likes: 76,
    createdAt: '2024-03-12'
  },
  {
    id: 4,
    type: 'diet',
    title: '增加蛋白质摄入',
    subtitle: '提高饱腹感',
    content: '适当增加优质蛋白质的摄入可以提高饱腹感，减少总热量摄入，并帮助保持肌肉质量。建议每餐都包含优质蛋白质，如鸡胸肉、鱼、豆腐或蛋类。',
    image: '/assets/images/protein.jpg',
    likes: 89,
    createdAt: '2024-03-10'
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
    date: '2024-03-10'
  },
  {
    id: 2,
    name: '数据侦探',
    description: '查看20次趋势图',
    icon: 'chart-line',
    completed: true,
    date: '2024-03-12'
  },
  {
    id: 3,
    name: '健康领袖',
    description: 'BMI维持正常范围30天',
    icon: 'shield-alt',
    completed: false,
    progress: 70
  },
  {
    id: 4,
    name: '体重目标达成',
    description: '达到目标体重',
    icon: 'trophy',
    completed: false,
    progress: 50
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