import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface VersionUpdate {
  version: string
  title: string
  date: string
  features: string[]
  fixes?: string[]
  breaking?: string[]
}

interface VersionState {
  // 当前版本
  currentVersion: string
  // 最后查看的版本
  lastViewedVersion: string
  // 是否显示更新弹窗
  showUpdateModal: boolean
  // 更新历史
  updateHistory: VersionUpdate[]
}

interface VersionActions {
  // 设置当前版本
  setCurrentVersion: (version: string) => void
  // 标记版本已查看
  markVersionAsViewed: (version: string) => void
  // 显示/隐藏更新弹窗
  setShowUpdateModal: (show: boolean) => void
  // 检查是否有新版本
  hasNewVersion: () => boolean
  // 获取最新的更新信息
  getLatestUpdate: () => VersionUpdate | null
}

type VersionStore = VersionState & VersionActions

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('zh-CN', options)
}

// 版本更新历史
const VERSION_UPDATES: VersionUpdate[] = [
  {
    version: '1.2.0',
    title: '新增视频源管理功能',
    date: formatDate('2025-07-14'),
    features: [
      '新增系统视频源管理功能，支持添加、删除视频源',
      '新增添加自定义视频源功能，支持添加自定义视频源',
    ],
    fixes: ['优化了视频源管理功能', '优化视频搜索逻辑，增快搜索速度'],
    breaking: [
      '永久域名：https://tv-delta-eosin.vercel.app/',
    ],
  },
  {
    version: '1.1.2',
    title: '新增观看记录功能',
    date: formatDate('2025-07-06'),
    features: [
      '新增了观看记录功能，支持查看最近观看的视频',
      '自动记录播放进度，支持继续播放',
      '支持查看观看记录',
    ],
    fixes: ['优化搜索历史移动端显示问题'],
  },
  {
    version: '1.1.1',
    title: '视频播放界面路由优化',
    date: formatDate('2025-07-01'),
    features: ['优化了视频播放界面路由，采用新的路由方式，支持视频播放界面分享'],
    fixes: ['修复更新显示的本地存储问题'],
  },
  {
    version: '1.1.0',
    title: '视频源优化更新',
    date: formatDate('2025-07-01'),
    features: ['优化了视频播放源的选择逻辑', '改进了特殊源的处理逻辑，提高了视频加载成功率'],
    fixes: ['修复了某些视频源无法正常播放的问题', '优化了搜索结果的加载速度'],
    breaking: ['移除了部分不稳定的视频源（华为吧资源、豆瓣资源）'],
  },
  {
    version: '1.0.0',
    title: '初始版本',
    date: formatDate('2025-06-30'),
    features: ['初始版本'],
  },
]

// 获取最新版本号
const LATEST_VERSION = VERSION_UPDATES[0]?.version || '1.0.0'

export const useVersionStore = create<VersionStore>()(
  devtools(
    persist(
      immer<VersionStore>((set, get) => ({
        // 初始状态
        currentVersion: LATEST_VERSION,
        lastViewedVersion: '1.0.0',
        showUpdateModal: false,
        updateHistory: VERSION_UPDATES,

        // Actions
        setCurrentVersion: (version: string) => {
          set(state => {
            state.currentVersion = version
          })
        },

        markVersionAsViewed: (version: string) => {
          set(state => {
            state.lastViewedVersion = version
            state.showUpdateModal = false
          })
        },

        setShowUpdateModal: (show: boolean) => {
          set(state => {
            state.showUpdateModal = show
          })
        },

        hasNewVersion: () => {
          const state = get()
          return state.currentVersion !== state.lastViewedVersion
        },

        getLatestUpdate: () => {
          const state = get()
          // 找到当前版本对应的更新信息
          return state.updateHistory.find(update => update.version === state.currentVersion) || null
        },
      })),
      {
        name: 'ouonnki-tv-version-store',
        version: 1,
        partialize: state => ({
          lastViewedVersion: state.lastViewedVersion,
        }),
      },
    ),
    {
      name: 'VersionStore',
    },
  ),
)
