import User from "../models/userModel";

type userDataType = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  dob: string;
  password: string;
  preferences: string[];
};

export const checkMailDuplicate = async ({ email }: { email: string }) => {
  try {
    const checkDuplicate = await User.findOne({ email: email });
    return checkDuplicate;
  } catch (error: any) {
    console.log(error.message, "Error on the checkMailDuplicate");
  }
};

export const insertUser = async ({
  first_name,
  last_name,
  email,
  phone_number,
  dob,
  password,
  preferences,
}: {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  dob: string;
  password: string;
  preferences: string;
}) => {
  try {
    const userData = await User.insertOne({
      first_name,
      last_name,
      email,
      phone_number,
      dob,
      password,
      preferences,
    });
    return userData;
  } catch (error: any) {
    console.log(error.message, "Error on the insertUser");
  }
};

export const findUser = async ({
  identifier,
}: {
  identifier: string | number;
}) => {
  try {
    const existingUser: userDataType | null | undefined = await User.findOne({
      $or: [{ email: identifier }, { phone_number: identifier }],
    }).lean();
    return existingUser;
  } catch (error: any) {
    console.log(error.message, "Error on the findUser");
  }
};
