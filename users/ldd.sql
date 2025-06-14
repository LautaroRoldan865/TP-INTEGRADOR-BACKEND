-- SQLBook: Code
DROP DATABASE users;
CREATE DATABASE users;

\c users;

CREATE TABLE permissions(
    id SERIAL,
    nombre VARCHAR,
    descripcion VARCHAR,
    CONSTRAINT pk_Permiso PRIMARY KEY (idPermiso)
);

CREATE TABLE roles(
    idRol SERIAL,
    nombre VARCHAR,
    descripcion VARCHAR,
    CONSTRAINT pk_Rol PRIMARY KEY (idRol)
);

CREATE TABLE users(
    idUsuario SERIAL,
    email VARCHAR,
    userPassword VARCHAR,
    rol INT,
    CONSTRAINT pk_Usuario PRIMARY KEY (idUsuario),
    CONSTRAINT fk_rol FOREIGN KEY (rol) REFERENCES rol(idRol)

);

CREATE TABLE permisoPorRol(
    idPermisoPorRol SERIAL,
    rol INT,
    permiso INT,
    CONSTRAINT pk_permisoPorRol PRIMARY KEY (idPermisoPorRol),
    CONSTRAINT fk_rol FOREIGN KEY (rol) REFERENCES roles(idRol),
    CONSTRAINT fk_permiso FOREIGN KEY (permiso) REFERENCES permissions(idPermiso)
);







