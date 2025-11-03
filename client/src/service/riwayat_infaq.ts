import api from '@/service/api_administrator';

export const get_member = async () => {
  try {
    const response = await api.get('/riwayat_infaq/list_member');
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil member:', error);
    throw error;
  }
};

export const get_riwayat_infaq = async (param: any) => {
  try {
    const response = await api.post('/riwayat_infaq/list', param);
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil riwayat infaq:', error);
    throw error;
  }
};

export const add_riwayat_infaq = async (param: any) => {
  try {
    const response = await api.post('/riwayat_infaq/add', param);
    return response.data;
  } catch (error) {
    console.error('Gagal menambahkan riwayat infaq:', error);
    throw error;
  }
};

export const setujui_pembayaran_infaq = async (id: number) => {
  try {
    const response = await api.post('/riwayat_infaq/approve_online', {
      id: id,
    });
    return response.data;
  } catch (error) {
    console.error('Gagal menyetujui pembayaran infaq:', error);
    throw error;
  }
};

export const tolak_pembayaran_infaq = async (data: { id: number; alasan: string }) => {
  try {
    const response = await api.post('/riwayat_infaq/reject_online', data);
    return response.data;
  } catch (error) {
    console.error('Gagal menolak pembayaran infaq:', error);
    throw error;
  }
};

export const upload_bukti_transfer = async (param: any) => {
  try {
    const response = await api.post('/riwayat_infaq/upload_bukti_transfer', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Gagal mengupload bukti transfer:', error);
    throw error;
  }
};

export const upload_bukti_setoran = async (param: any) => {
  try {
    const response = await api.post('/riwayat_infaq/upload_bukti_setoran', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Gagal mengupload bukti transfer:', error);
    throw error;
  }
};

export const delete_riwayat_infaq = async (id: number) => {
  try {
    const response = await api.post(`/riwayat_infaq/delete`, { id: id });
    return response.data;
  } catch (error) {
    console.error('Gagal menghapus riwayat infaq:', error);
    throw error;
  }
};
