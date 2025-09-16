const { Op, Menu, Submenu, Grup } = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async list_menu_by_id() {
    const { id } = this.req.body;

    try {
      // cari grup by id
      const grup = await Grup.findByPk(id, {
        attributes: ["id", "name", "group_access"],
      });

      if (!grup) {
        throw new Error("Grup tidak ditemukan");
      }

      // parse group_access biar langsung bisa dipakai di frontend
      let parsedAccess = [];
      try {
        if (grup.group_access) {
          parsedAccess =
            typeof grup.group_access === "string"
              ? JSON.parse(grup.group_access)
              : grup.group_access;
        }
      } catch (err) {
        console.error("Invalid JSON in group_access:", err);
      }

      return {
        id: grup.id,
        name: grup.name,
        group_access: parsedAccess,
      };
    } catch (error) {
      console.error("Error fetching grup detail:", error);
      throw new Error("Failed to fetch grup detail");
    }
  }

  async list_menu() {
    try {
      const menu = await Menu.findAll({
        attributes: ["id", "name", "path", "icon", "tab"],
        order: [["id", "ASC"]],
        include: [
          {
            model: Submenu,
            attributes: ["id", "menu_id", "name", "path"],
          },
        ],
      });

      return menu;
    } catch (error) {
      console.error("Error fetching menu:", error);
      throw new Error("Failed to fetch menu");
    }
  }

  async list_grup() {
    const body = this.req.body;
    const limit = parseInt(body.perpage, 10) || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber, 10)
        : 1;

    let where = {};

    // filter search kalau dikirim
    if (body.search && body.search !== "") {
      where.name = { [Op.like]: `%${body.search}%` };
    }

    // exclude user dengan grup_id = 1
    where.id = { [Op.ne]: 1 };
    try {
      const result = await Grup.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        order: [["id", "ASC"]],
        attributes: ["id", "name", "group_access"],
        where,
      });

      return {
        data: result.rows.map((e) => {
          let parsedAccess = [];
          try {
            if (e.group_access) {
              parsedAccess =
                typeof e.group_access === "string"
                  ? JSON.parse(e.group_access)
                  : e.group_access;
            }
          } catch (err) {
            console.error("Invalid JSON in group_access:", err);
          }

          return {
            id: e.id,
            name: e.name,
            group_access: parsedAccess,
          };
        }),
        total: result.count,
      };
    } catch (error) {
      console.error("Error fetching grup data:", error);
      return { data: [], total: 0 };
    }
  }
}

module.exports = Model_r;
