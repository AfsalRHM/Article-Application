export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  phone_number: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export default interface IUserService {
  blockArticleForUser: (params: {
    userId: string;
    articleId: string;
  }) => Promise<Record<string, any>>;

  getUserData: (userId: string) => Promise<Record<string, any>>;

  updateUserProfileData: (
    userId: string,
    data: UpdateProfileData
  ) => Promise<Record<string, any>>;

  updateUserPasswordData: (
    userId: string,
    data: UpdatePasswordData
  ) => Promise<Record<string, any>>;

  updateUserPreferenceData: (
    userId: string,
    selectedCategories: string[]
  ) => Promise<Record<string, any>>;
}
