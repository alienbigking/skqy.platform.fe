export type WallpaperType = 'image' | 'dynamic'

export interface IWallpaperRecord {
  id: string
  type: WallpaperType
  title: string
  category: string
  url?: string
  videoUrl?: string
  thumbnail: string
  author?: string
  source?: string
  tags?: string[]
  sortOrder: number
  isActive: boolean
  createDate: number
  updateDate: number
}

export interface IWallpaperListParams {
  page?: number
  pageSize?: number
  keyword?: string
  type?: WallpaperType | ''
  category?: string
  isActive?: string | boolean
}
