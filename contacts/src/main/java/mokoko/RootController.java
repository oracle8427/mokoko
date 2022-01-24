package mokoko;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RootController {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @RequestMapping("")
    public String layout() {
        return "layout";
    }

    @RequestMapping("login")
    public String login() {
        return "login";
    }

}
