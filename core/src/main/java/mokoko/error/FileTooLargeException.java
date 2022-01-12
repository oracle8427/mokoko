package mokoko.error;

import java.io.IOException;

public class FileTooLargeException extends IOException {
    
    public FileTooLargeException() {
        super();
    }

    public FileTooLargeException(String s) {
        super(s);
    }

    private FileTooLargeException(String path, String reason) {
        super(path + ((reason == null)
                ? ""
                : " (" + reason + ")"));
    }

}
