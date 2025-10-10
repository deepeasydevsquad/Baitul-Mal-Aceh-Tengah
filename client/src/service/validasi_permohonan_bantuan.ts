import api from './api_administrator';

export const get_filter_type = async () => {
  try {
    const response = await api.get('/validasi_permohonan_bantuan/get_filter_type');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter type:', error);
    throw error;
  }
};

export const get_validasi_permohonan_bantuan = async (param: any) => {
  try {
    const response = await api.post('/validasi_permohonan_bantuan/list', param);
    return response.data;
  } catch (error) {
    console.error('Error fetching permohonan bantuan:', error);
    throw error;
  }
};

export const get_view_validasi_permohonan_bantuan = async (id: number) => {
  try {
    const response = await api.post('/validasi_permohonan_bantuan/view', { id: id });
    return response.data;
  } catch (error) {
    console.error('Error fetching view validasi permohonan bantuan');
    throw error;
  }
};

export const get_info_edit_validasi_permohonan_bantuan = async (id: number) => {
  try {
    const response = await api.post(
      '/validasi_permohonan_bantuan/get_info_edit_validasi_permohonan_bantuan',
      {
        id: id,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching permohonan bantuan:', error);
    throw error;
  }
};

export const edit_validasi_permohonan_bantuan = async (param: any) => {
  try {
    const response = await api.post('/validasi_permohonan_bantuan/edit', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error editing permohonan bantuan:', error);
    throw error;
  }
};

export const edit_status_validasi_permohonan_bantuan = async (param: any) => {
  try {
    const response = await api.post('/validasi_permohonan_bantuan/edit_status', param);
    return response.data;
  } catch (error) {
    console.error('Error editing status permohonan bantuan:', error);
    throw error;
  }
};

export const get_info_persetujuan_validasi_permohonan_bantuan = async (id: number) => {
  try {
    const response = await api.post(
      '/validasi_permohonan_bantuan/get_info_persetujuan_validasi_permohonan_bantuan',
      {
        id: id,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching permohonan bantuan:', error);
    throw error;
  }
};

export const persetujuan_validasi_permohonan_bantuan = async (param: any) => {
  try {
    const response = await api.post(
      '/validasi_permohonan_bantuan/persetujuan_validasi_permohonan_bantuan',
      param,
    );
    return response.data;
  } catch (error) {
    console.error('Error editing persetujuan permohonan bantuan:', error);
    throw error;
  }
};
