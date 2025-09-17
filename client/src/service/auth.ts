import api from '@/service/api_administrator'

export const get_info_edit_profile = async () => {
  try {
    const response = await api.get('/auth/administrator/get_info_edit_profile')
    return response.data
  } catch (error) {
    console.error('Gagal edit profile:', error)
    throw error
  }
}

export const edit_profile = async (param: any) => {
  try {
    const response = await api.post('/auth/administrator/edit_profile', param)
    return response.data
  } catch (error) {
    console.error('Gagal edit profile:', error)
    throw error
  }
}

export const logout_administrator = async (param: any) => {
  try {
    const response = await api.post('/auth/administrator/logout', param)
    return response.data
  } catch (error) {
    console.error('Gagal logout:', error)
    throw error
  }
}
