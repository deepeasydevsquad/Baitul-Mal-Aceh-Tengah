import api from '@/service/api_administrator';

export const get_filter_type = async () => {
  try {
    const response = await api.get('/monev/get_filter_type');
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil daftar monev:', error);
    throw error;
  }
}

export const monev_list = async (param: any) => {
  try {
    const response = await api.post('/monev/list', param);
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil daftar monev:', error);
    throw error;
  }
};

export const pertanyaan_evaluasi = async () => {
  try {
    const response = await api.get('/monev/pertanyaan_evaluasi');
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil daftar monev:', error);
    throw error;
  }
};

export const pertanyaan_monitoring = async () => {
  try {
    const response = await api.get('/monev/pertanyaan_monitoring');
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil daftar monev:', error);
    throw error;
  }
};

// Kirim Jawaban Evaluasi
export const kirim_jawaban_evaluasi = async (param: any) => {
  try {
    const response = await api.post('/monev/kirim_jawaban_evaluasi', param);
    return response.data;
  } catch (error) {
    console.error('Gagal mengirim jawaban evaluasi:', error);
    throw error;
  }
};

// Kirim Jawaban Monitoring
export const kirim_jawaban_monitoring = async (param: any) => {

  try {
    const response = await api.post('/monev/kirim_jawaban_monitoring', param);
    return response.data;
  } catch (error) {
    console.error('Gagal mengirim jawaban monitoring:', error);
    throw error;
  }
};

// Ambil Gabungan Status Monev (Monitoring + Evaluasi)
export const gabung_status_monev = async () => {
  try {
    const response = await api.get('/monev/gabung_status_monev');
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil status monev gabungan:', error);
    throw error;
  }
};
