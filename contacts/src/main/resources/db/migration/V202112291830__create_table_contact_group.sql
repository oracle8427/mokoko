CREATE TABLE contact_group (
    id         INT NOT NULL AUTO_INCREMENT,
    parent_id  INT NOT NULL DEFAULT 0,
    user_id    VARCHAR(200) DEFAULT NULL,
    name       VARCHAR(100) NOT NULL,
    trash      TINYINT NOT NULL DEFAULT 0,
    sort_no    INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY contact_group_ix_user_id (user_id),
    KEY contact_group_ix_sort_no (sort_no),
    KEY contact_group_ix_parent (parent_id)
) ENGINE=innodb AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;