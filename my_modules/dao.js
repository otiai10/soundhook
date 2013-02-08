/*
 * dao.js
*/

var conf = require('./conf.js').getConf();
var mysql = require('mysql').createClient({
  'host'     : conf.dbhost,
  //'port' : conf.port,
  'database' : conf.dbname,
  'user'     : conf.dbuser,
  'password' : conf.dbpass,
});

exports.dao = {

  // test : not used!!
  test : function(callback){
    mysql.query(create_user_table);
    mysql.query(
      'SELECT * FROM user_00',
      [],
      function(err,rows,fields){
        callback({'rows': rows});
      }
    );
  },

  // get user id by name
  getUserIdByName : function(name,callback){
    mysql.query(create_user_table);
    mysql.query(
      'SELECT * FROM user_00 WHERE name=(?) LIMIT 1',
      [name],
      function(err,rows,fields){
        callback({'rows':rows});
      }
    );
  },

  getUserInfoById : function(id,callback){
    mysql.query(
      'SELECT * FROM user_00 WHERE id=(?) LIMIT 1',
      [id],
      function(err,rows,fields){
        callback({'row':rows});
      }
    );
  },

  setUserProfile : function(params, id, callback){
    mysql.query(
      'UPDATE user_00 SET mix_level=(?), ng_word=(?) WHERE id=(?)',
      [params.mix_level, params.ng_word, id],
      function(err,rows,fields){
        callback(true);
      }
    );
  },

  // set new user
  setNewUser : function(name,callback){
    console.log(conf.now() + '====== set New User =====' + name);
    mysql.query(
      'INSERT INTO user_00 (name) VALUES ((?))',
      [name],
      function(err,rows,fields){
        console.log(conf.now() + err);
        callback(name);
      }
    );
  },

  // get musics from user's playlist
  getMyPlaylist : function(id, params, callback){
    mysql.query(create_musics_table);
    if(params.get_all === 'false'){
      mysql.query(
        // single playlist
        //'SELECT * FROM musics_00 WHERE owner_id=(?) AND playlist_num=(?) AND stashed=0',
        'SELECT * FROM musics_00 WHERE owner_id=(?) AND stashed=0',
        //[id, parseInt(params.playlist_num)],
        [id],
        function(err,rows,fields){
          for(var i in rows){
            rows[i].stat = 'mine';
          }
          callback({'rows':rows});
        }
      );
    }else{
      mysql.query(
        'SELECT * FROM musics_00 WHERE owner_id=(?) ORDER BY id DESC',
        [id],
        function(err,rows,fields){
          callback({'rows':rows});
        }
      );
    }
  },

  // get musics only from pushed_musics_00
  getForRandomStream : function(params,callback){
    mysql.query(
      'SELECT * FROM pushed_musics_00 WHERE deleted=0 ORDER BY RAND() LIMIT 60',
      [],
      function(err,rows,fields){
        callback({'rows':rows});
      }
    );
  },

  // set to my playlist
  setToMyPlaylist : function(music,callback){
    mysql.query(create_musics_table);
    mysql.query(
      'INSERT INTO musics_00 (hash,title,owner_id,pushed_by,playlist_num) VALUES ((?),(?),(?),(?),(?))',
      [music.hash, music.title, music.owner_id, music.pushed_by,music.playlist_num],
      function(err,rows,fields){
        callback(true);
      }
    );
  },

  // remove from my playlist
  removeFromMyPlaylist : function(id, owner_id, callback){
    mysql.query(create_musics_table);
    mysql.query(
      'UPDATE musics_00 SET stashed=1 WHERE id=(?)',
      [id],
      function(err,rows,fields){
        console.log(conf.now() + 'remove query ::::' + rows.message);
        callback(true);
      }
    );
  },

  // remove from pushed_music
  removeFromPushed : function(id, callback){
    mysql.query(
      'UPDATE pushed_musics_00 SET deleted=1 WHERE id=(?)',
      [id],
      function(err,rows,fields){
        console.log(conf.now() + 'remove from pushed :::' + rows.message);
        callback(true);
      }
    );
  },
      
  // restore from my playlist
  restoreFromMyPlaylist : function(id, owner_id, callback){
    mysql.query(create_musics_table);
    mysql.query(
      'UPDATE musics_00 SET stashed=0 WHERE id=(?)',
      [id],
      function(err,rows,fields){
        console.log(conf.now() + 'remove query ::::' + rows.message);
        callback(true);
      }
    );
  },

  // get one music from pushed_music
  getOneFromPushed : function(params,callback){
    mysql.query(create_pushed_music_table);
    mysql.query(
      'SELECT * FROM pushed_musics_00 WHERE deleted=0 AND pusher_id<>(?) ORDER BY RAND() LIMIT 1',
      [params.my_id],
      function(err,rows,fields){
        if(rows.length === 0){
          music = null;
          callback(null);
        }else{
          music = {
             hash     : rows[0].hash,
             title    : rows[0].title,
             owner_id : params.id,
             pushed_by: rows[0].pushed_by,
             stat     : 'mixed',
          };
          // do I need to delete poped music form pushed_musics_00??
          //mysql.query('DELETE FROM pushed_musics_00 ....');
          callback(music);
        }
      }
    );
  },

  getPushedMusics : function(params,callback){
    mysql.query(
      'SELECT * FROM pushed_musics_00 WHERE deleted=0 AND pusher_id<>(?) ORDER BY RAND() LIMIT ' + params.mix_level,
      [params.id],
      function(err,rows,fields){
        callback(rows);
      }
    );
  },

  setNewPushedFromInner : function(params,callback){
    mysql.query(create_pushed_music_table);
    mysql.query(
      'INSERT IGNORE INTO pushed_musics_00 (hash,title,pusher_id,pushed_by) VALUES ((?),(?),(?),(?))',
      [params.hash, params.title, params.pusher_id, params.pushed_by],
      function(err,rows,fields){
        callback(rows);
      }
    );
  },
  
  setNewPushedFromTwitterNowplaying : function(params,callback){
    mysql.query(create_pushed_music_table);
    mysql.query(
      'INSERT IGNORE INTO pushed_musics_00 (hash,title,pushed_by) VALUES ((?),(?),(?))',
      [params.hash, params.title, params.pushed_by],
      function(err,rows,fields){
        if(rows.affectedRows === 0){
          console.log('No Affected Rows');
          callback(false);
        }else{
          callback(true);
        }
      }
    );
  },

  _deleteUsersAllMusics : function(params,callback){
    mysql.query(
      'DELETE FROM musics_00 WHERE owner_id=(?)',
      [params.id],
      function(err,rows,fields){
        if (err === null){
          callback(true);
        }else{
          console.log(conf.now() + '!!>>!! DAO ERROR');
          console.log(err);
          callback(false);
        }
      }
    );
  },

};

var create_user_table =
  "CREATE TABLE IF NOT EXISTS user_00 (id INT UNSIGNED PRIMARY KEY, name VARCHAR(255) NOT NULL);";

var create_musics_table =
  "CREATE TABLE IF NOT EXISTS musics_00 (hash VARCHAR(255) NOT NULL, title VARCHAR(255) NOT NULL, owner_id INT UNSIGNED NOT NULL, pushed_by INT UNSIGNED, FOREIGN KEY(owner_id) REFERENCES user(id));";




var create_pushed_music_table =
  "CREATE TABLE IF NOT EXISTS pushed_musics_00 ("
  + "id int(10) unsigned NOT NULL AUTO_INCREMENT,"
  + "hash varchar(255) NOT NULL,"
  + "title varchar(255) NOT NULL,"
  + "pushed_by varchar(255) NOT NULL,"
  + "deleted tinyint(1) DEFAULT '0',"
  + "PRIMARY KEY (id)"
+ ") ENGINE=MyISAM DEFAULT CHARSET=utf8;";
