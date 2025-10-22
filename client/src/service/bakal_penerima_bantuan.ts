import api from './api_administrator';

export const get_filter_type = async () => {
  try {
    const response = await api.get('/bakal_penerima_bantuan/get_filter_type');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter type:', error);
    throw error;
  }
};

export const get_bakal_penerima_bantuan = async (param: any) => {
  try {
    const response = await api.post('/bakal_penerima_bantuan/list', param);
    return response.data;
  } catch (error) {
    console.error('Error fetching bakal penerima bantuan:', error);
    throw error;
  }
};

export const get_info_permohonan = async (id: number) => {
  try {
    const response = await api.post('/bakal_penerima_bantuan/get_info_permohonan', {
      id: id,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bakal penerima bantuan:', error);
    throw error;
  }
};

export const get_info_upload_berita_acara = async (id: number) => {
  try {
    const response = await api.post('/bakal_penerima_bantuan/get_info_upload_berita_acara', {
      id: id,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bakal penerima bantuan:', error);
    throw error;
  }
};

export const upload_berita_acara = async (param: any) => {
  try {
    const response = await api.post('/bakal_penerima_bantuan/upload_berita_acara', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error editing bakal penerima bantuan:', error);
    throw error;
  }
};

export const upload_realisasi_bantuan = async (param: any) => {
  try {
    const response = await api.post('/bakal_penerima_bantuan/realisasi_bantuan', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error editing bakal penerima bantuan:', error);
    throw error;
  }
};

export const get_list_belum_upload_berita_acara = async (param: any) => {
  try {
    const response = await api.post(
      '/bakal_penerima_bantuan/list_belum_upload_berita_acara',
      param,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching bakal penerima bantuan:', error);
    throw error;
  }
};

export const upload_massal_berita_acara = async (param: any) => {
  try {
    const response = await api.post('/bakal_penerima_bantuan/upload_berita_acara_massal', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error editing bakal penerima bantuan:', error);
    throw error;
  }
};

export const batal_bakal_penerima_bantuan = async (id: number) => {
  try {
    const response = await api.post('/bakal_penerima_bantuan/batal_realisasi', { id: id });
    return response.data;
  } catch (error) {
    console.error('Error batal bakal penerima bantuan:', error);
    throw error;
  }
};
