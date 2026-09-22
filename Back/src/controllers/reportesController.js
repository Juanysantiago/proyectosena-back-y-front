const ReporteBloqueo = require("../models/ReporteBloqueo");
const User = require("../models/User");

// ==========================================
// EJECUTAR REPORTE / BLOQUEO / DESBLOQUEO
// ==========================================

const ejecutarAccion = async (req, res) => {
  try {
    const {
      userId,
      tipo,
      motivo,
    } = req.body;

    // ==========================================
    // VALIDAR USER ID
    // ==========================================

    if (!userId) {
      return res.status(400).json({
        message:
          "El usuario es obligatorio",
      });
    }

    // ==========================================
    // VALIDAR TIPO
    // ==========================================

    if (
      ![
        "reporte",
        "bloqueo",
        "desbloqueo",
      ].includes(tipo)
    ) {
      return res.status(400).json({
        message:
          "Tipo de acción no válido",
      });
    }

    // ==========================================
    // BUSCAR USUARIO
    // ==========================================

    const usuario =
      await User.findByPk(userId);

    if (!usuario) {
      return res.status(404).json({
        message:
          "El usuario no existe",
      });
    }

    // ==========================================
    // NO PERMITIR ACCIONES SOBRE ADMINISTRADORES
    // ==========================================

    if (
      usuario.rol ===
      "administrador"
    ) {
      return res.status(403).json({
        message:
          "No se pueden realizar acciones sobre un administrador",
      });
    }

    // ==========================================
    // REPORTE
    // ==========================================

    if (tipo === "reporte") {
      if (
        !motivo ||
        String(motivo).trim() === ""
      ) {
        return res.status(400).json({
          message:
            "Debe escribir el motivo del reporte",
        });
      }

      const reporte =
        await ReporteBloqueo.create({
          userId: usuario.id,

          tipo: "reporte",

          motivo:
            String(motivo).trim(),

          creadoPor:
            req.user?.id || null,
        });

      return res.status(201).json({
        message:
          "Reporte enviado correctamente",

        reporte,
      });
    }

    // ==========================================
    // BLOQUEAR
    // ==========================================

    if (tipo === "bloqueo") {
      usuario.estado =
        "bloqueado";

      await usuario.save();

      await ReporteBloqueo.create({
        userId: usuario.id,

        tipo: "bloqueo",

        motivo:
          motivo
            ? String(motivo).trim()
            : "Usuario bloqueado por el administrador",

        creadoPor:
          req.user?.id || null,
      });

      return res.status(200).json({
        message:
          "Usuario bloqueado correctamente",
      });
    }

    // ==========================================
    // DESBLOQUEAR
    // ==========================================

    if (tipo === "desbloqueo") {
      usuario.estado =
        "activo";

      await usuario.save();

      return res.status(200).json({
        message:
          "Usuario desbloqueado correctamente",
      });
    }

  } catch (error) {
    console.error(
      "ERROR ACCION USUARIO:",
      error
    );

    return res.status(500).json({
      message:
        "Error ejecutando la acción",
      error:
        error.message,
    });
  }
};

// ==========================================
// OBTENER REPORTES
// ==========================================

const obtenerReportes =
  async (req, res) => {
    try {
      const reportes =
        await ReporteBloqueo.findAll({
          include: [
            {
              model: User,
              as: "usuarioReportado",
              attributes: [
                "id",
                "nombres",
                "apellidos",
                "documento",
                "email",
                "rol",
                "estado",
              ],
              required: false,
            },
          ],

          order: [
            ["createdAt", "DESC"],
          ],
        });

      return res.status(200).json({
        success: true,
        data: reportes,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Error obteniendo reportes",
        error:
          error.message,
      });
    }
  };

module.exports = {
  ejecutarAccion,
  obtenerReportes,
};