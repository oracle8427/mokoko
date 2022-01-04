package mokoko.user;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

    User selectUser(String ID);

}
