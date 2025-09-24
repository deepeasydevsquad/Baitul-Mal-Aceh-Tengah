import api from '@/service/api_administrator'


export const list = async (param: any) => {
  try {
    const response = await api.post('/riwayat_zakat/list', param)
    return response.data
  } catch (error) {
    console.error('Gagal memperbarui riwayat zakat', error)
    throw error
  }
}


export const add_riwayat_zakat = async (param: any) => {
  try {
    const response = await api.post('/riwayat_zakat/add', param, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error('Gagal menambahkan riwayat:', error)
    throw error
  }
}

export const delete_riwayat_zakat = async (param: any) => {
  try {
    const response = await api.post('/riwayat_zakat/delete', param )
    return response.data
  } catch (error) {
    console.error('Gagal menambahkan riwayat zakat:', error)
    throw error
  }
}

export const tutup = async (param: any) => {
  try {
    const response = await api.post('/riwayat_zakat/tutup', param )
    return response.data
  } catch (error) {
    console.error('Gagal menambahkan riwayat:', error)
    throw error
  }
}

export const detail = async (param: any) => {
  try {
    const response = await api.post('/riwayat_zakat/detail', param)
    return response.data
  } catch (error) {
    console.error('Gagal membuat zakat:', error)
    throw error
  }
}



export const daftar_member = async () => {
  try {
    const response = await api.get('/riwayat_zakat/daftar_member')
    return response.data
  } catch (error) {
    console.error('Gagal membuat zakat:', error)
    throw error
  }
}
