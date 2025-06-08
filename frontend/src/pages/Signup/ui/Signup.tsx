import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { authApi, type ISignUpData } from 'features/auth';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { ErrorMessage, LocalStorageKeys, setItem } from 'shared';

export const regex =
  // eslint-disable-next-line
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
export const message =
  'Must contain 8 characters, one uppercase, one lowercase, one number and one special case character';

const schema = yup
  .object({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Provide valid email')
      .required('Email is required'),
    password: yup
      .string()
      .required('Please enter your password')
      .matches(regex, message),
  })
  .required();

export const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [handleSignUp, { error }] = authApi.endpoints.signup.useMutation();

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<ISignUpData> = async (data) => {
    setLoading(true);
    const user = await handleSignUp(data);
    if (user && user.data) {
      setItem(LocalStorageKeys.USER_ID, user.data.id);
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">Signup</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-1 w-3/4 md:w-1/2 lg:w-1/3"
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col justify-center items-center">
              <TextField
                fullWidth
                type="text"
                label="Name"
                variant="standard"
                {...field}
              />
              <ErrorMessage>
                {formState.errors.name?.message || '\u00A0'}
              </ErrorMessage>
            </div>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col justify-center items-center">
              <TextField
                fullWidth
                type="email"
                label="Email"
                variant="standard"
                {...field}
              />
              <ErrorMessage>
                {formState.errors.email?.message || '\u00A0'}
              </ErrorMessage>
            </div>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col justify-center items-center">
              <TextField
                fullWidth
                type="password"
                label="Password"
                variant="standard"
                {...field}
              />
              <ErrorMessage>
                {formState.errors.password?.message || '\u00A0'}
              </ErrorMessage>
            </div>
          )}
        />

        <Button type="submit" loading={loading} variant="outlined">
          Signup
        </Button>
        <span className="text-sm">
          Already have an account?{' '}
          <Link className="text-blue-500" to={'/login'}>
            Login
          </Link>
        </span>
        {error && (
          <span className="text-red-700 mt-2">{JSON.stringify(error)}</span>
        )}
      </form>
    </div>
  );
};
