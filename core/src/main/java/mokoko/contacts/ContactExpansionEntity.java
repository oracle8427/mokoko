package mokoko.contacts;

public class ContactExpansionEntity {

    private int id;
    private int contactID;
    private String phone;
    private String phoneType;
    private String messenger;
    private String address;
    private String addressType;
    private String specialDay;
    private String specialDayType;
    private String email;
    private int sortNumber;
    private String created;

    public ContactExpansionEntity() {

    }

    public ContactExpansionEntity(int id, int contactID, String phone, String phoneType, String messenger, String address,
                                  String addressType, String specialDay, String specialDayType, String email, int sortNumber,
                                  String created) {
        this.id = id;
        this.contactID = contactID;
        this.phone = phone;
        this.phoneType = phoneType;
        this.messenger = messenger;
        this.address = address;
        this.addressType = addressType;
        this.specialDay = specialDay;
        this.specialDayType = specialDayType;
        this.email = email;
        this.sortNumber = sortNumber;
        this.created = created;
    }

    public int getId() {
        return id;
    }

    public int getContactID() {
        return contactID;
    }

    public String getPhone() {
        return phone;
    }

    public String getPhoneType() {
        return phoneType;
    }

    public String getMessenger() {
        return messenger;
    }

    public String getAddress() {
        return address;
    }

    public String getAddressType() {
        return addressType;
    }

    public String getSpecialDay() {
        return specialDay;
    }

    public String getSpecialDayType() {
        return specialDayType;
    }

    public String getEmail() {
        return email;
    }

    public int getSortNumber() {
        return sortNumber;
    }

    public String getCreated() {
        return created;
    }

    @Override
    public String toString() {
        return "ContactExpansionEntity{" +
                "id=" + id +
                ", contactID=" + contactID +
                ", phone='" + phone + '\'' +
                ", phoneType='" + phoneType + '\'' +
                ", messenger='" + messenger + '\'' +
                ", address='" + address + '\'' +
                ", addressType='" + addressType + '\'' +
                ", specialDay='" + specialDay + '\'' +
                ", specialDayType='" + specialDayType + '\'' +
                ", email='" + email + '\'' +
                ", sortNumber=" + sortNumber +
                ", created='" + created + '\'' +
                '}';
    }
}
