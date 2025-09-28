import api from '@/service/api_administrator';

export const get_target_pengumpulan = async (param: {
  search: string;
  perpage: number;
  pageNumber: number;
}) => {
  try {
    const response = await api.post('/target_pengumpulan/list', param);
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil target pengumpulan:', error);
    throw error;
  }
};

export const add_target_pengumpulan = async (param: any) => {
  try {
    const response = await api.post('/target_pengumpulan/add', param);
    return response.data;
  } catch (error) {
    console.error('Gagal menambahkan target pengumpulan:', error);
    throw error;
  }
};

export const get_info_edit = async (param: any) => {
  try {
    const response = await api.post('/target_pengumpulan/get_info_edit', param);
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil info target pengumpulan:', error);
    throw error;
  }
};

export const edit_target_pengumpulan = async (param: any) => {
  try {
    const response = await api.post('/target_pengumpulan/edit', param);
    return response.data;
  } catch (error) {
    console.error('Gagal mengupdate target pengumpulan:', error);
    throw error;
  }
};

export const delete_target_pengumpulan = async (param: any) => {
  try {
    const response = await api.post('/target_pengumpulan/delete', param);
    return response.data;
  } catch (error) {
    console.error('Gagal menghapus target pengumpulan:', error);
    throw error;
  }
};

export const get_tahun = async () => {
  try {
    const response = await api.get('/target_pengumpulan/tahun');
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil tahun', error);
    throw error;
  }
};
