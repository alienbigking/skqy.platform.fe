/**
 * 一些常量
 */
//+++++++++++++数据类型 start++++++++++++++++++++
class DataType {
  /**
   * 用户按键
   */
  static IMI_STREAM_BUTTON = '0000'
  /**
   * 时间戳
   */
  static IMI_STREAM_TIME = '1'
  static IMI_STREAM_RSV = '2'
  static IMI_STREAM_DBG = '3'
  static IMI_STREAM_HDR = '4'

  /**
   * 导联1
   */
  static IMI_STREAM_ECG1 = '1100' //I
  static IMI_STREAM_ECG2 = '12' //II
  static IMI_STREAM_ECG3 = '13' //III
  static IMI_STREAM_ECG4 = '14' //aVL
  static IMI_STREAM_ECG5 = '15' //aVR
  static IMI_STREAM_ECG6 = '16' //aVF
  static IMI_STREAM_ECG7 = '17' //V1
  static IMI_STREAM_ECG8 = '18' //V2
  static IMI_STREAM_ECG9 = '19' //V3
  static IMI_STREAM_ECG10 = '1a' //V4
  static IMI_STREAM_ECG11 = '1b' //V5
  /**
   * 导联12
   */
  static IMI_STREAM_ECG12 = '1c' //V6

  /**
   * 温度
   */
  static IMI_STREAM_TEMP = '3000'

  /**
   * IMU
   */
  static IMI_STREAM_IMU = '4000'

  /**
   * Raw IMU
   */
  static IMI_STREAM_IMU_RAW = '4100'
  /**
   * ack
   */
  static IMI_STREAM_CMD_ACK = '0101' //Command reply, not part of data stream

  static IMI_STREAM_UNKNOWN = '102'
  static IMI_STREAM_MAX = '103'
  /**
   * 文件头
   */
  static IMI_FILE_HEADER = '0500'
}

//命令类型
class CmdType {
  static IMI_CMD_UNKNOWN = '00'
  static IMI_CMD_SET_HEADER = '01'
  static IMI_CMD_GET_HEADER = '02'
  static IMI_CMD_SET_TIME = '0300' // 8 bytes parameter:  milli seconds from 00:00:00 1/1/1970
  static IMI_CMD_GET_TIME = '0400' // Ack with 8 bytes: seconds from 00:00:00 1/1/1970
  static IMI_CMD_START = '0500' // With a 4-byte parameter 0x01: file; 0x02: streaming; 0x03: both
  static IMI_CMD_STOP = '0600' // With a 4-byte parameter 0x01: file; 0x02: streaming; 0x03: both
  static IMI_CMD_SEND_FILE = '0700'
  static IMI_CMD_RESET_FILE = '0800'
  static IMI_CMD_STOP_FILE = '0900'
  static IMI_CMD_DEBUG = '0a00'
  static IMI_CMD_GET_STATES = '0b00' // Get current run states
  static IMI_CMD_GET_DEVINFO = '0c00' // Get device info

  // cmd start/stop 4 byte parameter bit fields
  static IMI_CMD_START_STOP_FILE = 0x01
  static IMI_CMD_START_STOP_BLE = 0x02

  static IMI_CMD_START_STOP_ECG = 0x01
  static IMI_CMD_START_STOP_TEMP = 0x02
  static IMI_CMD_START_STOP_IMU_RAW = 0x04
  static IMI_CMD_START_STOP_IMU = 0x08

  static IMI_CMD_SEND_FILE_COMP = 0x01 //压缩传文件
  static IMI_CMD_SEND_FILE_CONT = 0x02 //断点续传
  static IMI_CMD_SEND_FILE_CONT_ERR = 0x04 //丢包重传
}

export { DataType, CmdType }
