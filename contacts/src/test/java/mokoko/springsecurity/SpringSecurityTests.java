package mokoko.springsecurity;

import mokoko.TestConfiguration;
import mokoko.user.User;
import mokoko.user.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;


@WebMvcTest
@ContextConfiguration(classes = {SecurityConfiguration.class})
public class SpringSecurityTests extends TestConfiguration {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Test
    public void passwordEncoderTest() {
        String rawPassword = "mokoko8427!@#";

        User user = userService.getUser("mailmaster@mokoko.shop");
        assert passwordEncoder.matches(rawPassword, user.getPassword());
    }

}
