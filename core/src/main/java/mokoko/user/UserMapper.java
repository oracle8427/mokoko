package mokoko.user;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserMapper {

    User selectUser(String ID);

    List<Map<String, Object>> selectGroupAuthorities(String username);

}
