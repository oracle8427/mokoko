package mokoko.contacts;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GroupService {

	private final GroupMapper groupMapper;

	public GroupService(GroupMapper groupMapper) {
		this.groupMapper = groupMapper;
	}

	public List<Group> getGroups() {
		return groupMapper.selectGroups();
	}

	public int createGroup(Map<String, Object> parameter) {
		return groupMapper.insertGroup(parameter);
	}

	public int updateGroup(Map<String, Object> parameter) {
		return groupMapper.updateGroup(parameter);
	}
	public int deleteGroup() {
		List<Integer> idList = new ArrayList<>();
		if (idList.size() > 0)
			return groupMapper.deleteGroup(idList);
		return 0;
	}

}
