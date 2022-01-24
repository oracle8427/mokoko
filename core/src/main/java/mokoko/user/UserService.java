package mokoko.user;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserMapper mapper;

    public UserService(UserMapper userMapper) {
        this.mapper = userMapper;
    }

    public User getUser(String id) {
        return mapper.selectUser(id);
    }

    public List<Map<String, Object>> getGroupAuthorities(String username) {
        return mapper.selectGroupAuthorities(username);
    }

}
