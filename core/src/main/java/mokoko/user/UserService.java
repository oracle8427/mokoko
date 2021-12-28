package mokoko.user;

import org.springframework.stereotype.Service;

@Service
public class UserService {

	private final UserMapper mapper;

	public UserService(UserMapper userMapper) {
		this.mapper = userMapper;
	}

	public User getUser(String id) {
		return mapper.selectUser(id);
	}

}
