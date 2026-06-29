const Soporte = require("../models/Soporte");
const User = require("../models/User");

exports.crearSoporte = async (req, res) => {
  try {

    const { asunto, descripcion } = req.body;

    const soporte = await Soporte.create({

      asunto,

      descripcion,

      userId: req.user.id

    });

    res.status(201).json(soporte);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.obtenerMisSoportes = async (req, res) => {

  try {

    const soportes = await Soporte.findAll({

      where: {

        userId: req.user.id

      },

      order: [["createdAt","DESC"]]

    });

    res.json(soportes);

  } catch (error) {

    res.status(500).json({
      message:error.message
    });

  }

};

exports.obtenerTodos = async (req,res)=>{

  try{

    const soportes = await Soporte.findAll({

      include:[

        {
          model:User,
          as:"user",
          attributes:[
            "id",
            "nombres",
            "apellidos",
            "email"
          ]
        }

      ],

      order:[
        ["createdAt","DESC"]
      ]

    });

    res.json(soportes);

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};

exports.responderSoporte = async(req,res)=>{

  try{

    const soporte = await Soporte.findByPk(req.params.id);

    if(!soporte){

      return res.status(404).json({
        message:"No existe"
      });

    }

    soporte.respuesta=req.body.respuesta;
    soporte.estado=req.body.estado;

    await soporte.save();

    res.json(soporte);

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};