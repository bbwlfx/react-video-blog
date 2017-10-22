const mysql = require('mysql');
const config = require('./mysql.config');

const connection = mysql.createConnection(config);

const createTuser = `CREATE TABLE Tuser(
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  username varchar(20) NOT NULL UNIQUE,
  nickname text,
  avatar text,
  email varchar(30),
  sex varchar(10),
  age int,
  profile varchar(30),
  password varchar(30)
);`
const createTvideo = `CREATE TABLE Tvideo(
  vid int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  uid int NOT NULL,
  title text,
  av varchar(10),
  img varchar(200),
  time int,
  view int,
  favorite int,
  danmaku int,
  share int,
  up varchar(200),
  source varchar(20),
  src text,
  name text,
  FOREIGN KEY(uid) REFERENCES Tuser(id)
);`;

[createTuser, createTvideo].forEach(item => {
  connection.query(item, (err) => {
    if(err) {
      console.log('[create database error!]:', err);
      return;
    }
    console.log('[create success!]');
  });
});

