package mokoko.contacts;

import mokoko.TestConfiguration;
import mokoko.util.jackson.JacksonJsonUtil;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebMvcTest
public class GroupControllerTests extends TestConfiguration {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    ApplicationContext ctx;

    @Test
    public void contextLoad() throws Exception {
        try {
            getGroups();
            updateSortOrder();
        } catch (Exception e) {
            log.error("Error at GroupControllerTests.contextLoad()", e);
            throw e;
        }
    }

    public void getGroups() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/groups"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    public void updateSortOrder() throws Exception {
        Map<String, Object> model = new HashMap<>();
        List<Integer> idList = Arrays.asList(13, 2, 1, 6, 4, 7, 8);
        model.put("idList", idList);
        mockMvc.perform(MockMvcRequestBuilders
                .post("/groups/order")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .param("_method", "PATCH")
                .param("model", JacksonJsonUtil.writeValueAsString(model))
        );


    }

}
