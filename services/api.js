/**
 * API服务模块
 */
const mockData = require('./mock');

/**
 * 模拟API请求的延迟
 * @param {number} time 延迟时间，单位毫秒
 */
const delay = (time = 500) => {
  return new Promise(resolve => setTimeout(resolve, time));
};

/**
 * 用户相关接口
 */
const userApi = {
  /**
   * 获取用户信息
   */
  getUserInfo: async () => {
    await delay();
    return {
      ...mockData.userInfo
    };
  },

  /**
   * 更新用户信息
   * @param {Object} userInfo 用户信息
   */
  updateUserInfo: async (userInfo) => {
    await delay();
    // 实际项目中这里应该调用后端API更新用户信息
    return {
      success: true,
      data: {
        ...mockData.userInfo,
        ...userInfo
      }
    };
  },

  /**
   * 设置用户目标
   * @param {Object} goal 目标信息
   */
  setUserGoal: async (goal) => {
    await delay();
    return {
      success: true,
      data: {
        ...mockData.userInfo.goal,
        ...goal
      }
    };
  }
};

/**
 * 体重记录相关接口
 */
const weightApi = {
  /**
   * 获取体重记录历史
   * @param {Object} params 查询参数
   */
  getWeightHistory: async (params = {}) => {
    await delay();
    const { startDate, endDate } = params;
    let data = [...mockData.weightHistory];
    
    // 日期过滤
    if (startDate) {
      data = data.filter(item => item.date >= startDate);
    }
    if (endDate) {
      data = data.filter(item => item.date <= endDate);
    }
    
    return {
      success: true,
      data
    };
  },

  /**
   * 添加体重记录
   * @param {Object} record 体重记录
   */
  addWeightRecord: async (record) => {
    await delay();
    return {
      success: true,
      data: {
        id: new Date().getTime(), // 模拟ID
        ...record
      }
    };
  },

  /**
   * 删除体重记录
   * @param {string} id 记录ID
   */
  deleteWeightRecord: async (id) => {
    await delay();
    return {
      success: true
    };
  },

  /**
   * 获取体重统计数据
   */
  getWeightStats: async () => {
    await delay();
    // 计算一些统计值
    const records = mockData.weightHistory;
    const latest = records[0]?.weight || 0;
    const oldest = records[records.length - 1]?.weight || 0;
    const totalChange = +(latest - oldest).toFixed(1);
    const weeklyChange = +(records[0]?.weight - records[6]?.weight).toFixed(1);
    const averageWeight = +(records.reduce((sum, item) => sum + item.weight, 0) / records.length).toFixed(1);
    
    return {
      success: true,
      data: {
        latest,
        totalChange,
        weeklyChange,
        averageWeight,
        // 添加更多统计数据...
      }
    };
  }
};

/**
 * 建议相关接口
 */
const adviceApi = {
  /**
   * 获取健康建议列表
   * @param {string} type 建议类型
   */
  getHealthAdvice: async (type = '') => {
    await delay();
    let data = [...mockData.healthAdvice];
    
    // 类型过滤
    if (type) {
      data = data.filter(item => item.type === type);
    }
    
    return {
      success: true,
      data
    };
  },

  /**
   * 获取建议详情
   * @param {string} id 建议ID
   */
  getAdviceDetail: async (id) => {
    await delay();
    const advice = mockData.healthAdvice.find(item => item.id === id);
    
    return {
      success: true,
      data: advice
    };
  },

  /**
   * 点赞建议
   * @param {string} id 建议ID
   */
  likeAdvice: async (id) => {
    await delay();
    return {
      success: true
    };
  }
};

/**
 * 成就相关接口
 */
const achievementApi = {
  /**
   * 获取用户成就列表
   */
  getAchievements: async () => {
    await delay();
    return {
      success: true,
      data: mockData.achievements
    };
  }
};

// 导出所有API接口
module.exports = {
  user: userApi,
  weight: weightApi,
  advice: adviceApi,
  achievement: achievementApi
}; 