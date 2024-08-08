
import ResStatus from "../Config/response/ResStatus";
import CommonFields from "../Config/response/CommonFields";
import ResponseClass from "./Response";
import AllCountriesData from "../Config/Search/Allcountries";
import { Languages } from "../Config/Search/Languages";
import SequenceFields from "../Config/response/Sequence";

class Validations {

  /**
   * Validate UID
   * @param uid
   */
  validateId(uid: string) {
    if (uid === "" || uid === undefined || uid === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Id);
    }
  }

  /**
   * Validate Name
   * @param name
   */
  validateName(name: string) {
    if (name === "" || name === undefined || name === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Name);
    }

    if (name.length > 50) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.NameLength);
    }

    if (name.length < 5) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.NameMinLength);
    }
  }

  /**
   * Validate Username
   * @param username
   */
  validateUsername(username: string) {
    if (username === "" || username === undefined || username === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Username);
    }
    if (username.length > 50) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        CommonFields.UsernameLength
      );
    }
    if (username.length < 5) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        CommonFields.UsernameMinLength
      );
    }
  }

  /**
   * Validate Email
   * @param email
   */
  validateEmail(email: string) {
    if (email === "" || email === undefined || email === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Email);
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.EmailInvalid);
    } else if (email.length > 50) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.EmailLength);
    } else if (email.length < 5) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        CommonFields.EmailMinLength
      );
    }
    return true;
  }

  /**
   * Validate Password
   * @param password
   */
  validatePassword(password: string) {
    if (password === "" || password === undefined || password === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Password);
    }
    if (password.length > 20) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        CommonFields.PasswordLength
      );
    }
    if (password.length < 10) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        CommonFields.PasswordMinLength
      );
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/g.test(password)) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        CommonFields.PasswordSpecialCharacter
      );
    }
    if (!/[A-Z]/.test(password)) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        CommonFields.PasswordUppercase
      );
    }
    if (!/[a-z]/.test(password)) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        CommonFields.PasswordLowercase
      );
    }
    if (!/[0-9]/.test(password)) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        CommonFields.PasswordNumber
      );
    }
    if (/\s/.test(password)) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.PasswordSpace);
    }
  }

  /**
   * Validate Admin
   * @param admin
   */
  validateAdmin(admin: string) {
    if (!admin) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Admin);
    }
  }

  /**
   * Validate Image
   * @param image
   */
  validateImage(image: string) {
    if (image === "" || image === undefined || image === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Image);
    }

    // image is a url validate
    if (!image.match(/\.(jpeg|jpg|gif|png)$/) && !image.startsWith("http")) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.ImageInvalid);
    }
  }

  /**
   * Validate Description
   * @param description
   */
  validateDescription(description: string) {
    if (
      description === "" ||
      description === undefined ||
      description === null
    ) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Description);
    }

    if (description.length < 10) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        CommonFields.DescriptionMinLength
      );
    }
  }

   /**
   * Validate Content Languages
   * @param country
   */
   validateContentLanguage(country: string) {
    if (country === "" || country === undefined || country === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.ContentLanguages);
    }

    country.split(",").forEach((country) => {
      let countryData = Languages.find(
        (countryData) => countryData.value === country
      );
      if (!countryData) {
        throw new ResponseClass(
          ResStatus.BadRequest,
          CommonFields.ContentLanguagesNotValid
        );
      }
    });
  }

     /**
   * Validate Country
   * @param country
   */
     validateCountry(country: string) {
      if (country === "" || country === undefined || country === null) {
        throw new ResponseClass(ResStatus.BadRequest, CommonFields.Country);
      }
  
      country.split(",").forEach((country) => {
        let countryData = AllCountriesData.find(
          (countryData) => countryData.code === country
        );
        if (!countryData) {
          throw new ResponseClass(
            ResStatus.BadRequest,
            CommonFields.CountryNotValid
          );
        }
      });
    }

  /**
   * Validate Phone
   * @param phone
   */
  validatePhone(phone: string) {
    if (phone === "" || phone === undefined || phone === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Phone);
    }

    if (phone.length > 20) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.PhoneLength);
    }

    if (!phone.match(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.PhoneInvalid);
    }
  }

  /**
   * Validate Phone Code
   * @param phoneCode
   */
  validatePhoneCode(phoneCode: string) {
    if (phoneCode === "" || phoneCode === undefined || phoneCode === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.PhoneCode);
    }

    if (!phoneCode.match(/^\+[0-9]{1,3}$/)) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.PhoneCodeInvalid);
    }
  }

  /**
   * Validate Type
   * @param type
   */
  validateType(type: string) {
    if (type === "" || type === undefined || type === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Type);
    }
  }



  /**
   * Validate State
   * @param state
   */
  validateState(state: string) {
    if (state === "" || state === undefined || state === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.State);
    }
  }

  /**
   * Validate Postal Code
   * @param postalCode
   */
  validatePostalCode(postalCode: string) {
    if (postalCode === "" || postalCode === undefined || postalCode === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.PostalCode);
    }

    // if (!postalCode.match(/^[0-9]{5}(?:-[0-9]{4})?$/)) {
    //   throw new ResponseClass(
    //     ResStatus.BadRequest,
    //     CommonFields.PostalCodeInvalid
    //   );
    // }
  }

  /**
   * Validate Street
   * @param street
   */
  validateStreet(street: string) {
    if (street === "" || street === undefined || street === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Street);
    }

    if (street.length > 50) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.StreetLength);
    }

    if (street.length < 5) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.StreetMinLength);
    }
  }

  /**
   * Validate District
   * @param district
   */
  validateDistrict(district: string) {
    if (district === "" || district === undefined || district === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.District);
    }

    if (district.length > 50) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.DistrictLength);
    }

    if (district.length < 5) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.DistrictMinLength);
    }
  }

  /**
   * Validate City
   * @param city
   */
  validateCity(city: string) {
    if (city === "" || city === undefined || city === null) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.City);
    }

    if (city.length > 50) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.CityLength);
    }

    if (city.length < 5) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.CityMinLength);
    }
  }

  
  /**
   * Validate Sequence For
   * @param SequenceFor
   */
  validateSequenceFor(SequenceFor: number) {
    if (
      SequenceFor === 0 ||
      SequenceFor === undefined ||
      SequenceFor === null
    ) {
      throw new ResponseClass(ResStatus.BadRequest, SequenceFields.SequenceFor);
    }
  }

  /**
   * Validate Current
   * @param current
   */
  validateCurrent(current: number) {
    if (current === undefined || current === null) {
      throw new ResponseClass(ResStatus.BadRequest, SequenceFields.Current);
    }
  }

  /**
   * Validate Increment
   * @param increment
   */
  validateIncrement(increment: number) {
    if (increment === undefined || increment === null) {
      throw new ResponseClass(ResStatus.BadRequest, SequenceFields.Increment);
    }
  }

  /**
   * Validate Max Digits
   * @param maxDigits
   */
  validateMaxDigits(maxDigits: number) {
    if (maxDigits === undefined || maxDigits === null) {
      throw new ResponseClass(ResStatus.BadRequest, SequenceFields.MaxDigits);
    }
  }

  /**
   * Validate Sequence Name
   * @param name
   */
  validateSequenceName(name: string) {
    if (name === "" || name === undefined || name === null) {
      throw new ResponseClass(ResStatus.BadRequest, SequenceFields.Name);
    }
  }

  /**
   * Validate Sequence Description
   * @param description
   */
  validateSequenceDescription(description: string) {
    if (
      description === "" ||
      description === undefined ||
      description === null
    ) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        SequenceFields.SequenceDescription
      );
    }
  }

  /**
   * Validate Sequence Prefix
   * @param prefix
   * @param suffix
   */
  validateSequencePrefix(prefix: string, suffix: string) {
    if (
      (prefix === "" || prefix === null || prefix === undefined) &&
      (suffix === "" || suffix === undefined || suffix === null)
    ) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        SequenceFields.PrefixOrSuffix
      );
    }
  }




}

export default Validations;
