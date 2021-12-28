package mokoko.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@WebMvcTest
public class UserControllerTests extends TestConfiguration {

	@Autowired
	protected MockMvc mockMvc;

	@Test
	public void getUserTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/user"))
				.andExpect(MockMvcResultMatchers.status().isOk());
	}

}
