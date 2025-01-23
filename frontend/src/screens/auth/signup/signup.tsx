import { FC, memo, useCallback } from 'react';
import { SignupProps } from './signup.props';
import { SignupView } from './signup.view';
import { signupAction, singupSlice } from '../../../store/reducers/auth/singup-slice';
import { useAppDispatch, useTypedSelector } from '../../../hooks/use-typed-selector';
import { useNavigate } from 'react-router-dom';

export const Signup: FC<SignupProps> = memo(() => {
  const signupState = useTypedSelector(state => state.singup);
  const {
    setEmail,
    setFirstName,
    setDescription,
    setSex,
    setPassword,
    setConfirmPassword,
    setAge,
    setPurpose,
    setMainPhoto,
    setPhotos,
    setLocation,
  } = singupSlice.actions;

  const dispatch = useAppDispatch();

  const nav = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onMainPage = () => {
    nav('/user')
  }
  
  const setEmailCallback = (email: string) => {
    dispatch(setEmail(email));
  };

  const setFirstNameCallback = (firstName: string) => {
    dispatch(setFirstName(firstName));
  }

  const setDescriptionCallback = (description: string) => {
    dispatch(setDescription(description));
  }

  const setSexCallback =  (sex: string) => {
    dispatch(setSex(sex));
  }

  const setPasswordCallback = (password: string) => {
    dispatch(setPassword(password));
  }

  const setConfirmPasswordCallback =(confirmPassword: string) => {
    dispatch(setConfirmPassword(confirmPassword));
  };

  const setAgeCallback = (age: number) => {
    dispatch(setAge(age));
  }

  const setPurposeCallback = (purpose: string[]) => {
    dispatch(setPurpose(purpose));
  }

  const setMainPhotoCallback = (mainPhoto: string) => {
    dispatch(setMainPhoto(mainPhoto));
  }

  const setPhotosCallback = (photos: string[]) => {
    dispatch(setPhotos(photos));
  }

  const setLocationCallback = (location: string) => {
    dispatch(setLocation(location));
  }

  const navLogin = () => {
    nav('/user')
  }

  const onSignup = useCallback(() => {
    if (!signupState.mainPhoto) {
      console.error('Главное фото обязательно');
      return;
    }
    
    dispatch(signupAction({
      email: signupState.email,
      firstName: signupState.firstName,
      description: signupState.description,
      sex: signupState.sex,
      passwordHash: signupState.password,
      age: signupState.age!,
      purpose: signupState.purpose,
      mainPhoto: signupState.mainPhoto,
      photos: signupState.photos,
      location: signupState.location
    }, onMainPage));
  }, [dispatch, signupState, onMainPage]);

  return (
    <SignupView
      setEmail={setEmailCallback}
      setFirstName={setFirstNameCallback}
      setDescription={setDescriptionCallback}
      setSex={setSexCallback}
      setPassword={setPasswordCallback}
      setConfirmPassword={setConfirmPasswordCallback}
      setAge={setAgeCallback}
      setPurpose={setPurposeCallback}
      setMainPhoto={setMainPhotoCallback}
      setPhotos={setPhotosCallback}
      setLocation={setLocationCallback}
      onSignup={onSignup}
      signupState={signupState}
      navLogin={navLogin}
    />
  );
});
