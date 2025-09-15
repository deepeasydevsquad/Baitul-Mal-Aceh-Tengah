import api from '@/service/api_administrator'

export const logout_administrator = async (param: any) => {
  try {
    const response = await api.post('/auth/administrator/logout', param)
    return response.data
  } catch (error) {
    console.error('Gagal logout:', error)
    throw error
  }
}
