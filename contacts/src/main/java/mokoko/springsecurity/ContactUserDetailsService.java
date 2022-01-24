package mokoko.springsecurity;

import mokoko.user.UserService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


public class ContactUserDetailsService implements UserDetailsService {

    private final UserService userService;

    public ContactUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        mokoko.user.User user = userService.getUser(username);
        if (user == null)
            throw new UsernameNotFoundException("Username Not Found: " + username);


        boolean enabled = true;
        boolean accountNonExpired = true;
        boolean credentialsNonExpired = true;
        boolean accountNonLocked = true;
        List<GrantedAuthority> authorities = loadGroupAuthorities(username);
        return new ContactUserDetails(
                user.getId(),
                user.getPassword(),
                enabled, accountNonExpired, credentialsNonExpired, accountNonLocked,
                authorities
        );
    }

    protected List<GrantedAuthority> loadGroupAuthorities(String username) {
        List<Map<String, Object>> authorities = userService.getGroupAuthorities(username);
        List<GrantedAuthority> list = new ArrayList<>(authorities.size());
        for (Map<String, Object> auth : authorities) {
            GrantedAuthority authority = new SimpleGrantedAuthority((String) auth.get("authority"));
            list.add(authority);
        }
        return list;
    }

}
