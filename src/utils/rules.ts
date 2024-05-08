import * as yup from 'yup'

const handleSchema = (refString: string) => {
  return yup
    .string()
    .required('Nhap la mat khau la bat buoc')
    .max(160, 'Độ dài trong khoảng 6 - 160 ký tự')
    .min(6, 'Độ dài trong khoảng 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại mật khẩu không đúng')
}

export const schema = yup.object({
  username: yup
    .string()
    .required('Tên đăng nhập là bắt buộc')
    .max(160, 'Độ dài trong khoảng 6 - 160 ký tự')
    .min(5, 'Độ dài trong khoảng 6 - 160 ký tự'),
  password: yup
    .string()
    .required('password la bat buoc')
    .max(160, 'Độ dài trong khoảng 6 - 160 ký tự')
    .min(6, 'Độ dài trong khoảng 6 - 160 ký tự'),
  confirmPassword: handleSchema('password'),
  fullName: yup
    .string()
    .required('password la bat buoc')
    .max(160, 'Độ dài trong khoảng 6 - 160 ký tự')
    .min(6, 'Độ dài trong khoảng 6 - 160 ký tự'),
  email: yup
    .string()
    .required('Email la bat buoc')
    .email('Email khong dung dinh dang')
    .min(5, 'Email khong dung dinh dang'),
  searchString: yup.string().trim().required()
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  image: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Ngày sinh không phù hợp'),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleSchema('new_password')
})

export const loginScheam = schema.pick(['username', 'password'])

export type LoginSchema = yup.InferType<typeof loginScheam>

export const registerScheam = schema.pick(['username', 'password', 'confirmPassword', 'fullName', 'email'])

export type RegisterSchema = yup.InferType<typeof registerScheam>

export const searchSchema = schema.pick(['searchString'])

export type SearchSchema = yup.InferType<typeof searchSchema>

export type UserSchema = yup.InferType<typeof userSchema>
