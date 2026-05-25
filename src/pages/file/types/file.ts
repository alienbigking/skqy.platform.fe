import { IPagination } from '@/pages/common/types/common'

interface IListParams extends IPagination {
  fileName?: string
  fileType?: string
}

interface IUpdateParams {
  id: string
  fileName: string
  originalname?: string
  filePath: string
  fileType?: string
  fileSize?: number
  describe?: string
}

export { IListParams, IUpdateParams }
