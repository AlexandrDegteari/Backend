var db = require('./database_init');

var query  = `
create table if not exists user (
  id BIGINT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY(id),
  name VARCHAR(32) unique,
  createdDate DATETIME,
  bannedDate DATETIME,
  email VARCHAR(255) unique
);

create table if not exists auth_base (
  id BIGINT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY(id),
  user_id BIGINT,
  FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE,
  password_hash VARCHAR(200),
  salt VARCHAR(200)
);

create table if not exists company (
  id BIGINT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY(id),
  name VARCHAR(32) unique,
  abbreviation VARCHAR(4) unique,
  owner BIGINT,
  FOREIGN KEY (owner) REFERENCES user(id)
    ON DELETE CASCADE,
  value BIGINT  
);

create table if not exists user_company (
  company_id BIGINT,
  user_id BIGINT,
  FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES company(id)
    ON DELETE CASCADE
);
`;

db.connection.query(query, function(err, result) {
    if (err) throw err;

    console.log('init done, starting the machine...');
});