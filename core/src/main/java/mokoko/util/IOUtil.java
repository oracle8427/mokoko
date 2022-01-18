package mokoko.util;

import java.io.*;

public class IOUtil {

    public static BufferedInputStream newBufferedInputStream(InputStream in) {
        if (in instanceof BufferedInputStream) {
            return (BufferedInputStream) in;
        }
        return new BufferedInputStream(in);
    }

    public static BufferedOutputStream newBufferedOutputStream(OutputStream out) {
        if (out instanceof BufferedOutputStream) {
            return (BufferedOutputStream) out;
        }
        return new BufferedOutputStream(out);
    }

    public static long transfer(InputStream in, OutputStream out) throws IOException {
        long transferred = 0L;

        byte[] b = new byte[8192];
        for (int len = 0; (len = in.read(b)) != -1; ) {
            out.write(b, 0, len);
            transferred += len;
        }
        out.flush();

        return transferred;
    }

    public static void close(InputStream in) {
        try {
            if (in != null)
                in.close();
        } catch (IOException e) {
            // ignore
        }
    }

    public static void close(OutputStream out) {
        try {
            if (out != null)
                out.close();
        } catch (IOException e) {
            // ignore
        }
    }

}
