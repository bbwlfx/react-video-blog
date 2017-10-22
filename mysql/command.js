module.exports = {
  selectUserName: 'select username from Tuser;',
  selectUser: 'select * from Tuser',
  insertUser: 'insert into Tuser(username, password, nickname, avatar, email, sex, profile, age) values(?, ?, ?, ?, ?, ?, ?, ?);',
  selectUserByName: 'select * from Tuser where username=?',
  updateUserInfo: 'update Tuser set sex=?, email=?, profile=?, age=?, avatar=?, nickname=? where username=?',
  updateField: {
    profile: 'update Tuser set profile=? where username=?',
    sex: 'update Tuser set sex=? where username=?',
    email: 'update Tuser set email=? where username=?',
    age: 'update Tuser set age=? where username=?',
    avatar: 'update Tuser set avatar=? where username=?',
    nickname: 'update Tuser set nickname=? where username=?',
  },
  selectUid: 'select id from Tuser where username=?',
  saveVideo: 'insert into Tvideo(uid, title, av, img, time, view, favorite, danmaku, share, up, source) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  saveLocalVideo: 'insert into Tvideo(uid, img, src, source ,name) values(?, ?, ?, ?, ?)',
  selectVideoList: 'select * from Tvideo where uid=?'
};
