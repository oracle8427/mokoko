package mokoko.contacts;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface GroupMapper {

    List<Group> selectGroups(Map<String, Object> params);

    int insertGroup(Group group);

    int updateGroup(Map<String, Object> params);

    int deleteGroup(List<Integer> idList);

}
