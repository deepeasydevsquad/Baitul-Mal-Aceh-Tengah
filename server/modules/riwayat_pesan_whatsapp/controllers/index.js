const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

controllers.list = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.list();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};

controllers.get_template_pesan_whatsapp = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_template_pesan_whatsapp();
    res.status(200).json({
      error: false,
      message: "Daftar template pesan whatsapp ditemukan.",
      data: feedBack,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.get_pesan_template_pesan_whatsapp = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_pesan_template_pesan_whatsapp();
    res.status(200).json({
      error: false,
      message: "Success.",
      data: feedBack,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.kirim_pesan = async (req, res) => {
  function parseNomorTujuan(str) {
    if (!str || typeof str !== "string") return [];

    const nomorRegex = /^0\d{9,14}$/; // contoh: mulai dengan 0 dan panjang 10–15 digit

    return str
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "" && nomorRegex.test(s));
  }

  function replaceTemplate(template, data) {
    return template.replace(/{{(.*?)}}/g, (match, key) => {
      return data[key.trim()] || match;
    });
  }

  if (!(await handleValidationErrors(req, res))) return;

  try {
    // get info
    const model_r = new Model_r(req);
    const model_cud = new Model_cud(req);
    const setting_info = await model_r.get_parameter_setting();

    const type = req.body.type;
    const template_id = req.body.template_id;
    let isi_pesan = req.body.isi_pesan;
    let sendingInfo = [];

    if (type == "pesan_biasa") {
      nomor_tujuan = parseNomorTujuan(req.body.nomor_tujuan);
      for (let x in nomor_tujuan) {
        sendingInfo.push({ destination: nomor_tujuan[x], message: isi_pesan });
      }
    } else {
      const template_info = await model_r.get_info_template();
      if (type == "surveyor") {
        // get info surveyor
        var info_surveyor = await model_r.get_info_surveyor();
        for (let x in info_surveyor) {
          const message = replaceTemplate(isi_pesan, info_surveyor[x]);
          sendingInfo.push({
            destination: info_surveyor[x].whatsapp_number,
            message: message,
          });
        }
      } else if (type == "munfiq") {
        // get nomor whatsapp munfiq
        var info_munfiq = await model_r.get_info_munfiq();
        for (let x in info_munfiq) {
          const message = replaceTemplate(isi_pesan, info_munfiq[x]);
          sendingInfo.push({
            destination: info_munfiq[x].whatsapp_number,
            message: message,
          });
        }
      } else if (type == "muzakki") {
        // get nomor whatsapp muzakki
        var info_muzakki = await model_r.get_info_muzakki();
        for (let x in info_muzakki) {
          const message = replaceTemplate(isi_pesan, info_muzakki[x]);
          sendingInfo.push({
            destination: info_muzakki[x].whatsapp_number,
            message: message,
          });
        }
      }
    }

    // kirim pesan
    // for (let y in sendingInfo) {
    //   await axios.post("https://wapisender.id/api/v5/message/text", {
    //     api_key: setting_info.api_key,
    //     device_key: setting_info.device_key,
    //     destination: sendingInfo[y].destination,
    //     message: sendingInfo[y].message,
    //   });
    // }

    // insert to database.
    await model_cud.insert_whatsapp_message(
      setting_info.whatsapp_number,
      sendingInfo
    );

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Pesan berhasil dikirim.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Pesan gagal dikirim.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.delete = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.delete();
    // response
    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Pesan whatsapp berhasil dihapus.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Pesan whatsapp gagal dihapus.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;
