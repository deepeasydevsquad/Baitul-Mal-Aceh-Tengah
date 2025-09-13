import api_administrator from './api_administrator'
export const getRunningText = async (param: any) => {
  try {
    const response = await api_administrator.post('/running_text/list', param)
    return response.data
  } catch (error) {
    console.error('Gagal mengambil Running Text', error)
    throw error
  }
}

export const getInfoAddRunningText = async () => {
  try {
    const response = await api_administrator.get('/running_text/get_info_add')
    return response.data
  } catch (error) {
    console.error('Gagal mengambil info add Running Text:', error)
    throw error
  }
}

export const addRunningText = async (param: any) => {
  try {
    const response = await api_administrator.post('/running_text/add', param)
    return response.data
  } catch (error) {
    console.error('Gagal MENAMBAH Running Text:', error)
    throw error
  }
}

export const getInfoEditRunningText = async (id: number) => {
  try {
    const response = await api_administrator.post('/running_text/get_info_edit', { id })
    return response.data
  } catch (error) {
    console.error(`Gagal mengambil info edit Running Text ID ${id}:`, error)
    throw error
  }
}

export const editRunningText = async (id: number, param: any) => {
  try {
    const response = await api_administrator.post('/running_text/edit', { id, ...param })
    return response.data
  } catch (error) {
    console.error(`Gagal MENGEDIT Running Text ID ${id}:`, error)
    throw error
  }
}

export const deleteRunningText = async (id: number) => {
  try {
    const response = await api_administrator.post('/running_text/delete', { id })
    return response.data
  } catch (error) {
    console.error(`Gagal MENGHAPUS Running Text ID ${id}:`, error)
    throw error
  }
}

export const toggleRunningTextStatus = async (id: number) => {
  try {
    const response = await api_administrator.post('/running_text/toggle', { id })
    return response.data
  } catch (error) {
    console.error(`Gagal mengubah status untuk ID ${id}`, error)
    throw error
  }
}

export const updateRunningTextOrder = async (order: number[]) => {
  try {
    const response = await api_administrator.post('/running_text/update-order', { order })
    return response.data
  } catch (error) {
    console.error('Gagal memperbarui urutan', error)
    throw error
  }
}
