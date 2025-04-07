import * as yup from "yup";

export const articleValidation = yup.object().shape({
  author: yup.string().required("Author ID is required"),
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  tags: yup.array().of(yup.string()).min(1, "At least one tag is required"),
  coverImage: yup.string().nullable().required("Cover image is required"),
});
