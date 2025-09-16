const { Desa, Kecamatan } = require("../models");

helper = {};

helper.get_info_lokasi = async (id) => {
  const desa = await Desa.findOne({
    attributes: ["id", "name", "kecamatan_id"],
    where: { id },
    include: [
      {
        model: Kecamatan,
        attributes: ["id", "name"],
      },
    ],
  });

  if (!desa) {
    return {};
  }

  return {
    id: desa.id,
    desa_name: desa.name,
    kecamatan_id: desa.kecamatan_id,
    kecamatan_name: desa.kecamatan.name,
  };
};
