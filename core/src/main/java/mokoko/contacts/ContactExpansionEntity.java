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
    private String sns;
    private String snsType;
    private String email;
    private int sortNumber;
    private String created;

    public ContactExpansionEntity() {

    }

    public ContactExpansionEntity(int id, int contactID, String phone, String phoneType, String messenger, String address,
                                  String addressType, String specialDay, String specialDayType, String sns,
                                  String snsType, String email, int sortNumber,
                                  String created) {
        this.id = id;
        this.contactID = contactID;
        this.phone = phone;
        this.phoneType = phoneType;
        this.messenger = messenger;
        this.address = address;
        this.addressType = addressType;
        this.sns = sns;
        this.snsType = snsType;
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

    public String getSns() {
        return sns;
    }

    public String getSnsType() {
        return snsType;
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
                ", sns='" + sns + '\'' +
                ", snsType='" + snsType + '\'' +
                ", email='" + email + '\'' +
                ", sortNumber=" + sortNumber +
                ", created='" + created + '\'' +
                '}';
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {

        private int id;
        private int contactID;
        private String phone;
        private String phoneType;
        private String messenger;
        private String address;
        private String addressType;
        private String specialDay;
        private String specialDayType;
        private String sns;
        private String snsType;
        private String email;
        private int sortNumber;
        private String created;

        public ContactExpansionEntity build() {
            return new ContactExpansionEntity(
                    id, contactID, phone, phoneType, messenger,
                    address, addressType, specialDay, specialDayType, sns,
                    snsType, email, sortNumber, created
            );
        }

        public Builder id(int id) {
            this.id = id;
            return this;
        }

        public Builder contactID(int contactID) {
            this.contactID = contactID;
            return this;
        }

        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder phoneType(String phoneType) {
            this.phoneType = phoneType;
            return this;
        }

        public Builder messenger(String messenger) {
            this.messenger = messenger;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        public Builder addressType(String addressType) {
            this.addressType = addressType;
            return this;
        }

        public Builder sns(String sns) {
            this.sns = sns;
            return this;
        }

        public Builder snsType(String snsType) {
            this.snsType = snsType;
            return this;
        }

        public Builder specialDay(String specialDay) {
            this.specialDay = specialDay;
            return this;
        }

        public Builder specialDayType(String specialDayType) {
            this.specialDayType = specialDayType;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder sortNumber(int sortNumber) {
            this.sortNumber = sortNumber;
            return this;
        }

        public Builder created(String created) {
            this.created = created;
            return this;
        }

    }
}
