import api from '@/service/api_administrator'

export const daftar_rekap_perkecamatan = async (params?: { tahun?: string | number }) => {
  try {
    const response = await api.get("/rekap_perkecamatan/list", {
      params,
    })
    return response.data
  } catch (error) {
    console.error("Gagal mengambil rekap perkecamatan:", error)
    throw error
  }
}
