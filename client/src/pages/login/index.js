import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import {
  FormGroup,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import AlertDialog from '../../components/modal';
import './login.css';

const Login = () => {
  const { register, handleSubmit, errors } = useForm();

  const [values, setValues] = React.useState({
    index: '',
    password: '',
    showPassword: false,
  });

  const [errorModal, setErrorModal] = React.useState('');

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    try {
      const token = await axios.post(
        'http://amalus.no-ip.org:3009/api/auth',
        data
      );
      localStorage.setItem('key-jwt-pwr-19', token.data);
      window.location.replace('/');
    } catch (err) {
      console.log(err);
      setErrorModal(err);
    }
  };

  const handleError = () => {
    setErrorModal(false);
  };

  return (
    <div className="logincontainer">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormControl margin="dense">
            <InputLabel htmlFor="my-input" error={!!errors.index}>
              Numer indeksu
            </InputLabel>
            <Input
              id="my-input"
              error={!!errors.index}
              name="index"
              aria-describedby="my-helper-text"
              value={values.index}
              onChange={handleChange('index')}
              inputRef={register({
                required: true,
              })}
            />
            {errors.index && errors.index.type === 'required' && (
              <FormHelperText error>Pole wymagane</FormHelperText>
            )}
          </FormControl>
          <FormControl margin="dense">
            <InputLabel
              htmlFor="standard-adornment-password"
              error={!!errors.password}
            >
              Hasło
            </InputLabel>
            <Input
              id="standard-adornment-password"
              name="password"
              error={!!errors.password}
              aria-describedby="my-helper-text"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              inputRef={register({ required: true })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.password && errors.password.type === 'required' && (
              <FormHelperText error size="small">
                Pole wymagane
              </FormHelperText>
            )}
          </FormControl>
          <FormControl margin="dense">
            <Button
              size="large"
              color="primary"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
            >
              Zaloguj
            </Button>
          </FormControl>
        </FormGroup>
      </form>
      {errorModal && (
        <AlertDialog
          openModal={true}
          title="Błąd logowania"
          body="Podano nieprawidłowy indeks lub hasło"
          closeModal={handleError}
        ></AlertDialog>
      )}
    </div>
  );
};

export default Login;
