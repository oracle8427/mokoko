package mokoko.contacts;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface GroupMapper {

	List<Group> selectGroups();

	int insertGroup(Map<String, Object> parameter);

	int updateGroup(Map<String, Object> parameter);

	int deleteGroup(List<Integer> idList);

}
