import type { WallpaperType } from '../types/wallpapers'

export const typeOptions = [
  { label: '全部类型', value: '' },
  { label: '精选图片', value: 'image' },
  { label: '动态壁纸', value: 'dynamic' }
]

export const imageCategoryOptions = ['动物', '植物', '动漫', '街头', '城市', '科技', '天空', '海洋', '自然', '其他'].map((item) => ({
  label: item,
  value: item
}))

export const dynamicCategoryOptions = imageCategoryOptions
export const categorySearchOptions = [{ label: '全部分类', value: '' }, ...imageCategoryOptions]

export const getCategoryOptions = (type?: WallpaperType) =>
  type === 'dynamic' ? dynamicCategoryOptions : imageCategoryOptions
