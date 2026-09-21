const Vehiculo = require("../models/Vehiculo");

const {
  User,
  CentroFormacion,
  Carnet,
  SolicitudCarnet,
} = require("../models");

// =========================================================
// CREAR VEHÍCULO
// =========================================================

const createVehiculo = async (req, res) => {
  try {
    const {
      tipo,
      id_centro_de_formacion,
      marca,
    } = req.body;

    if (!tipo) {
      return res.status(400).json({
        message: "Tipo obligatorio",
      });
    }

    if (!id_centro_de_formacion) {
      return res.status(400).json({
        message: "Centro de formación obligatorio",
      });
    }

    if (!marca) {
      return res.status(400).json({
        message: "Marca obligatoria",
      });
    }

    const nuevo = await Vehiculo.create({
      ...req.body,
      userId: req.user.id,
    });

    return res.status(201).json({
      message: "Vehículo creado correctamente",
      data: nuevo,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error creando vehículo",
      error: error.message,
    });
  }
};


// =========================================================
// OBTENER TODOS LOS VEHÍCULOS
// =========================================================

const getVehiculos = async (req, res) => {
  try {

    const data = await Vehiculo.findAll({
      include: [
        {
          model: User,
          as: "User",
          attributes: [
            "id",
            "nombres",
            "apellidos",
            "ficha",
            "centroFormacionId",
          ],
          include: [
            {
              model: CentroFormacion,
              as: "centroFormacion",
              attributes: [
                "id",
                "nombre",
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      total: data.length,
      data,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Error obteniendo vehículos",
      error: error.message,
    });
  }
};


// =========================================================
// OBTENER VEHÍCULO POR ID
// =========================================================

const getVehiculoById = async (req, res) => {
  try {

    const vehiculo =
      await Vehiculo.findByPk(
        req.params.id
      );

    if (!vehiculo) {
      return res.status(404).json({
        message: "Vehículo no encontrado",
      });
    }

    return res.status(200).json({
      data: vehiculo,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message:
        "Error obteniendo vehículo",
      error: error.message,
    });
  }
};


// =========================================================
// ACTUALIZAR VEHÍCULO
// =========================================================

const updateVehiculo = async (req, res) => {
  try {

    const vehiculo =
      await Vehiculo.findByPk(
        req.params.id
      );

    if (!vehiculo) {
      return res.status(404).json({
        message:
          "Vehículo no encontrado",
      });
    }

    await vehiculo.update(
      req.body
    );

    return res.status(200).json({
      message:
        "Vehículo actualizado",
      data: vehiculo,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message:
        "Error actualizando vehículo",
      error: error.message,
    });
  }
};


// =========================================================
// ELIMINAR VEHÍCULO
// =========================================================

const deleteVehiculo = async (req, res) => {
  try {

    const vehiculo =
      await Vehiculo.findByPk(
        req.params.id
      );

    if (!vehiculo) {
      return res.status(404).json({
        message:
          "Vehículo no encontrado",
      });
    }

    await vehiculo.destroy();

    return res.status(200).json({
      message:
        "Vehículo eliminado",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message:
        "Error eliminando vehículo",
      error: error.message,
    });
  }
};


// =========================================================
// MIS VEHÍCULOS
//
// Devuelve:
// 1. Vehículos guardados en tabla vehiculos
// 2. Vehículos de TODOS los carnets generados
//
// NO modifica los carnets.
// =========================================================

const getMisVehiculos = async (req, res) => {

  try {

    if (!req.user?.id) {
      return res.status(401).json({
        message:
          "Usuario no autenticado",
      });
    }

    const userId = req.user.id;


    // =====================================================
    // VEHÍCULOS DE LA TABLA VEHICULOS
    // =====================================================

    const vehiculos =
      await Vehiculo.findAll({

        where: {
          userId,
        },

        order: [
          ["createdAt", "DESC"],
        ],

      });


    // =====================================================
    // TODAS LAS SOLICITUDES QUE GENERARON CARNET
    // =====================================================

    const carnets =
      await Carnet.findAll({

        where: {
          userId,
        },

        include: [
          {
            model: SolicitudCarnet,
            as: "solicitud",
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],

      });


    // =====================================================
    // CONVERTIR SOLICITUDES EN VEHÍCULOS
    // =====================================================

    const vehiculosDeCarnets =
      carnets
        .filter(
          (carnet) =>
            carnet.solicitud
        )
        .map((carnet) => {

          const solicitud =
            carnet.solicitud;

          return {

            id:
              `carnet-${carnet.id}`,

            userId,

            tipo:
              solicitud.tipoVehiculo,

            id_centro_de_formacion:
              null,

            marca:
              solicitud.marca,

            color:
              solicitud.color,

            serial:
              solicitud.tipoVehiculo ===
              "bicicleta"
                ? solicitud.serialPlaca
                : null,

            placa:
              solicitud.tipoVehiculo ===
              "moto"
                ? solicitud.serialPlaca
                : null,

            cilindraje:
              solicitud.cilindraje,

            modelo:
              solicitud.modelo,

            foto_principal:
              solicitud.fotoVehiculo,

            foto_secundaria:
              solicitud.fotoVehiculo,

            carnet: {

              id:
                carnet.id,

              solicitudId:
                carnet.solicitudId,

              codigoQr:
                carnet.codigoQr,

              estado:
                carnet.estado,

              fechaGeneracion:
                carnet.createdAt,

            },

          };

        });


    // =====================================================
    // EVITAR DUPLICAR VEHÍCULOS
    //
    // Los vehículos que vienen de carnet ya contienen
    // información histórica.
    // =====================================================

    const resultado = [

      ...vehiculosDeCarnets,

      ...vehiculos.map(
        (vehiculo) => {

          const objeto =
            vehiculo.toJSON();

          return {
            ...objeto,

            carnet:
              objeto.carnet ||
              null,
          };

        }
      ),

    ];


    // =====================================================
    // RESPUESTA
    // =====================================================

    return res.status(200).json(
      resultado
    );


  } catch (error) {

    console.error(
      "ERROR OBTENER MIS VEHÍCULOS:",
      error
    );

    return res.status(500).json({

      message:
        "Error obteniendo vehículos",

      error:
        error.message,

    });

  }
};


// =========================================================
// EXPORTAR
// =========================================================

module.exports = {

  createVehiculo,

  getVehiculos,

  getVehiculoById,

  updateVehiculo,

  deleteVehiculo,

  getMisVehiculos,

};