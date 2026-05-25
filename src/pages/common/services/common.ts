import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAliyunUploadParams,
  IConnectWorkbenchParams,
  IDoctorListParams,
  ILoginOutParams,
  ISetPublicFileParams,
  IUpdateEcgAnalysisStatusParams,
  IUpdatePasswordParams,
  IUploadsParams,
  IUploadUrlParams
} from '../types/common'

export default {
  // 文件上传至服务器
  upload(params: IUploadsParams) {
    return http(`${env.HOST_API_URL}file`, {
      method: 'POST',
      headers: {
        'Content-type': 'multipart/form-data'
      },
      data: params.file
    })
  },
  // 文件上传至阿里云服务
  aliyunUpload(params: IAliyunUploadParams) {
    return http(`${params.url}`, {
      method: 'PUT',
      headers: {
        'Content-type': '',
        isDisabledToken: true
      },
      data: params.file
    })
  },
  /*
   * @param 获取阿里云上传文件的链接
   * */
  getUploadUrl(params: IUploadUrlParams) {
    return http(`${env.HOST_API_URL}files/upload-url`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  // 获取阿里云文件下载链接
  getDownloadUrl(id: number) {
    return http(`${env.HOST_API_URL}files/${id}/download-url`).then(
      (response) => {
        return response
      }
    )
  },
  // 将文件设置公开的
  setPublicFile(params: ISetPublicFileParams) {
    return http(`${env.HOST_API_URL}files/${params.ossId}/public`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  download(url: string, isBlob = true) {
    return http(url, {
      responseType: isBlob ? 'blob' : 'arraybuffer' // blob arraybuffer
    }).then((response) => {
      return response
    })
  },
  getDoctorList(params?: IDoctorListParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/datas/assign-users`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getConnectWorkbench(params: IConnectWorkbenchParams) {
    return http(
      `${env.HOST_API_URL}yxpt/ecg/analysis/${params.id}/workbench`
    ).then((response) => {
      return response
    })
  },
  getAllPermission() {
    return Promise.resolve([])
  },
  getMenuBarList() {
    return http(`${env.HOST_API_URL}menu/bar`).then((response) => {
      return response
    })
  },
  getAllOrganizationsList() {
    return http(`${env.HOST_API_URL}yxpt/sys/organizations/list`).then(
      (response) => {
        return response
      }
    )
  },
  getUserInfo() {
    return http(`${env.HOST_API_URL}me`).then((response) => {
      return response
    })
  },
  // 此方法是获取mock文件中的数据
  getMockData() {
    return http('/api/v1/mockUserList').then((response) => {
      return response
    })
  },
  updatePassword(params: IUpdatePasswordParams) {
    return http(`${env.HOST_API_URL}yxpt/password/change`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  loginOut(params?: ILoginOutParams) {
    return Promise.resolve({ status: 0 })
  },
  updateEcgAnalysisStatus(params?: IUpdateEcgAnalysisStatusParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/analysis/${params?.id}/status`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  }
}
