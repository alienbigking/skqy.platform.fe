const storage = {
  setSession: (key: string, value: any) => {
    const data = JSON.stringify(value)
    sessionStorage.setItem(key, data)
  },
  getSession: (key: string) => {
    const data = sessionStorage.getItem(key)
    if (data) {
      return JSON.parse(data)
    }
    return null
  },
  removeSession: (key: string) => {
    sessionStorage.removeItem(key)
  },
  clearSession: (key: string) => {
    sessionStorage.clear()
  }
}

export default storage
