import { ChangeEvent, FC, memo, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { Column } from '../../../components/column';
import { Input } from '../../../components/input';
import { Spacing } from '../../../components/spacing';
import { Button } from '../../../components/button';
import { Text } from '../../../components/text';
import { theme } from '../../../themes/theme';
import { WrapperLoginAndSignup, WrapperThenLoginAndSignup } from '../login/login.styled';
import { SingupState } from '../../../store/reducers/auth/singup-slice';
import { userApi } from '../../../api/user/usersMethod';

export type SignupViewProps = {
  setEmail: (email: string) => void;
  setFirstName: (firstName: string) => void;
  setDescription: (description: string) => void;
  setSex: (sex: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setAge: (age: number) => void;
  setPurpose: (purpose: string[]) => void;
  setMainPhoto: (mainPhoto: string) => void;
  setPhotos: (photos: string[]) => void;
  setLocation: (location: string) => void;
  onSignup: () => void;
  navLogin: () => void;
  signupState: SingupState;
};

const sexOptions = [
  { value: 'мужчина', label: 'Мужчина' },
  { value: 'женщина', label: 'Женщина' },
];

const purposeOptions = [
  { value: 'networking', label: 'Networking' },
  { value: 'friendship', label: 'Friendship' },
  { value: 'dating', label: 'Dating' },
  { value: 'business', label: 'Business' },
];

const locationOptions = [
  { value: 'BY', label: 'BY' },
  { value: 'RU', label: 'RU' },
  { value: 'KZ', label: 'KZ' },
];

export const SignupView: FC<SignupViewProps> = memo(({
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
  onSignup,
  navLogin,
  signupState
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!signupState.email) newErrors.email = 'Email обязателен';
    if (!signupState.firstName) newErrors.firstName = 'Имя обязательно';
    if (!signupState.sex) newErrors.sex = 'Пол обязателен';
    if (!signupState.password) newErrors.password = 'Пароль обязателен';
    if (signupState.password !== signupState.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    if (!signupState.age || isNaN(signupState.age) || signupState.age <= 0) newErrors.age = 'Некорректный возраст';
    if (signupState.purpose.length === 0) newErrors.purpose = 'Цель обязателена';
    if (!signupState.mainPhoto) newErrors.mainPhoto = 'Главное фото обязательно';
    if (!signupState.location) newErrors.location = 'Локация обязательна';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (validate()) {
      onSignup();
    }
  };

  const handlePurposeChange = (selectedOptions: MultiValue<{ value: string; label: string }>) => {
    setPurpose(selectedOptions.map(option => option.value));
  };

  const handleLocationChange = (selectedOption: { value: string; label: string } | null) => {
    setLocation(selectedOption?.value || '');
  };

  const handleSexChange = (selectedOption: { value: string; label: string } | null) => {
    setSex(selectedOption?.value || '');
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl: string = await userApi.uploadFile(file); // Функция загрузки файла
        setMainPhoto(uploadedUrl); // Сохраняем URL в состоянии
      } catch (error) {
        console.error('Ошибка при загрузке файла', error);
      }
    }
  };

  const handlePhotosChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const uploadedUrls: string[] = [];
        for (const file of Array.from(files)) {
          const uploadedUrl = await userApi.uploadFile(file);
          uploadedUrls.push(uploadedUrl);
        }
        setPhotos(uploadedUrls)
      } catch (error) {
        console.error('Ошибка при загрузке фотографий', error);
      }
    }
  };

  return (
    <WrapperLoginAndSignup>
      <WrapperThenLoginAndSignup>
        <Column style={{ height: '100vh' }} verticalAlign='center' horizontalAlign='center'>

          <Input 
            placeholder='Email' 
            value={signupState.email} 
            setValue={setEmail} 
            error={errors.email} 
          />
          <Spacing variant='Column' themeSpace={10} />

          <Input 
            placeholder='First Name' 
            value={signupState.firstName} 
            setValue={setFirstName} 
            error={errors.firstName} 
          />
          <Spacing variant='Column' themeSpace={10} />

          <Input 
            placeholder='Description' 
            value={signupState.description} 
            setValue={setDescription} 
          />
          <Spacing variant='Column' themeSpace={10} />

          <Select
            placeholder='Sex'
            options={sexOptions}
            value={sexOptions.find(option => option.value === signupState.sex) || null}
            onChange={handleSexChange}
          />
          {errors.sex && <Text themeColor='red' themeFont={{
            family: '',
            desktopSize: '',
            mobileSize: '',
            weight: ''
          }}>{errors.sex}</Text>}
          <Spacing variant='Column' themeSpace={10} />

          <Input 
            placeholder='Password' 
            value={signupState.password} 
            setValue={setPassword} 
            type='password' 
            error={errors.password} 
          />
          <Spacing variant='Column' themeSpace={10} />

          <Input 
            placeholder='Confirm Password' 
            value={signupState.confirmPassword} 
            setValue={setConfirmPassword} 
            type='password' 
            error={errors.confirmPassword} 
          />
          <Spacing variant='Column' themeSpace={10} />

          <Input 
            placeholder='Age' 
            value={signupState.age?.toString()} 
            setValue={value => setAge(Number(value))} 
            type='text' 
            error={errors.age} 
          />
          <Spacing variant='Column' themeSpace={10} />

          <Select
            placeholder='Purpose'
            options={purposeOptions}
            value={purposeOptions.filter(option => signupState.purpose.includes(option.value))}
            onChange={handlePurposeChange}
            isMulti
          />
          {errors.purpose && <Text themeColor='red' themeFont={{
            family: '',
            desktopSize: '',
            mobileSize: '',
            weight: ''
          }}>{errors.purpose}</Text>}
          <Spacing variant='Column' themeSpace={10} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          <Spacing variant='Column' themeSpace={10} />

          <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotosChange}
          />
          <Spacing variant="Column" themeSpace={10} />

          <Select
            placeholder='Location'
            options={locationOptions}
            value={locationOptions.find(option => option.value === signupState.location) || null}
            onChange={handleLocationChange}
          />
          {errors.location && <Text themeColor='red' themeFont={{
            family: '',
            desktopSize: '',
            mobileSize: '',
            weight: ''
          }}>{errors.location}</Text>}
          <Spacing variant='Column' themeSpace={10} />

          <Button themeColor='red' borderColor='none' onClick={handleSignup} height={40} width={120}>
            <Text themeColor='white' themeFont={theme.fonts.m1}>Signup</Text>
          </Button>
          <Spacing variant="Column" themeSpace={10} />
          <Button themeColor='red' borderColor='none' onClick={navLogin} height={40} width={120}>
            <Text themeColor='white' themeFont={theme.fonts.m1}>Login</Text>
          </Button>
          <Spacing variant='Column' themeSpace={5} />
        </Column>
      </WrapperThenLoginAndSignup>
    </WrapperLoginAndSignup>
  );
});
