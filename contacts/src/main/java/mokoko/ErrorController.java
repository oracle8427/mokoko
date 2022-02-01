package mokoko;

import mokoko.error.BadRequestException;
import mokoko.error.NotFoundException;
import mokoko.error.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ErrorController {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @ExceptionHandler
    public String handleException(Exception e, Model model) {
        log.error(e.getMessage(), e);

        Map<String, Object> responseMap = new HashMap<>();
        try {
            String message = e.getMessage();
            String stacktrace = getStackTrace(e);
            if (!log.isDebugEnabled() ||
                    (message != null && message.length() > 0 && message.contains("Error querying database"))) {
                message = "";
                stacktrace = "";
            }
            responseMap.put("message", message);
            responseMap.put("stacktrace", stacktrace);
        } catch (Exception localException) {
            log.error("Error at RestExceptionHandler.handleException", localException);
        }

        ResponseEntity<?> responseEntity;
        if (e instanceof BadRequestException) {
            responseEntity = new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
        } else if (e instanceof NotFoundException) {
            responseEntity = new ResponseEntity<>(responseMap, HttpStatus.NOT_FOUND);
        } else if (e instanceof UnauthorizedException) {
            responseEntity = new ResponseEntity<>(responseMap, HttpStatus.UNAUTHORIZED);
        } else {
            responseEntity = new ResponseEntity<>(responseMap, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        model.addAttribute("responseEntity", responseEntity);
        return "error";
    }

    private String getStackTrace(Throwable thrown) {
        StringWriter sw = new StringWriter();
        thrown.printStackTrace(new PrintWriter(sw));
        return sw.toString();
    }

}
