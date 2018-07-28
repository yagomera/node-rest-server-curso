const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');




app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);



    Usuario.find({ role: 'USER_ROLE' }, 'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            Usuario.count({ role: 'USER_ROLE' }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad: conteo
                })

            });




        });




    //res.json('get usuario')
})



//INSERCCION
app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        //usuarioDB.password = null;



        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });


    /*
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            msg: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }
    */



})

//ACTUALIZACION
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }



        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });


    /*

    */
})


app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    //CAMBIO DE ESTADO DE BBDD
    let body = _.pick(req.body, ['role']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }



        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });



    //BORRADO DE ELEMENTO DE LA BBDD
    /*
        Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            };

            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encotrado'
                    }
                });
            }
            res.json({
                ok: true,
                usuario: usuarioBorrado

            });

        });

    */
    //res.json('delete usuario')
})


module.exports = app;