import api from "@/service/api_administrator"

// fungsi named export
export const list = async (param: any) => {
  try {
    const response = await api.post("/system_log_surveyor/list", {
      ...param,
    })
    return response.data
  } catch (error) {
    console.error("Gagal mengambil request keanggotaan:", error)
    throw error
  }
}

// export object sebagai default (ngumpulin semua fungsi)
const SystemLogSurveyor = {
  list,
}

export default SystemLogSurveyor