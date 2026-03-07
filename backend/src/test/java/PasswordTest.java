import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class PasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin123";
        String encodedPassword = "$2a$10$EqKcp1WFKVQISheBxmXNGexPR.i7QYXOJC.OFfQDT8iSaHuuPdlrW";
        System.out.println("Raw password matches: " + encoder.matches(rawPassword, encodedPassword));
        System.out.println("New encoded: " + encoder.encode(rawPassword));
    }
}
