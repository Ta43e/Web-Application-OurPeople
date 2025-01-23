import { ChangeEvent, FC, HTMLAttributes, memo, useCallback, useState } from "react";
import { InputButton, InputContainer, InputStyled } from "./input.styles";
import { Text } from "../text";
import { theme } from "../../themes/theme";

export type InputProps = {
  themeColor?: string;
  textColor?: string;
  borderColor?: string;
  placeholder?: string;
  width?: number;
  value?: string | string[] | number;
  type?: "text" | "password";
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  disabled?: boolean;
  error?: null | string;
  setValue?: (value: string) => void;
} & HTMLAttributes<HTMLInputElement>;

export const Input: FC<InputProps> = memo(({borderColor, themeColor,textColor,error,  setValue, disabled, value, width, required, placeholder, type, minLength, maxLength,...rest }) => {

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (setValue !== undefined) {
      setValue(event.target.value);
    }
  };

  const [inputWathc, setWatch] = useState<Boolean>(false);

  const onClickWatch = useCallback(() => {
    setWatch(!inputWathc);
  }, [inputWathc]);

  return (
    <>
      <InputContainer width={width}>
        <InputStyled
          themeColor={themeColor}
          textColor={textColor}
          borderColor={borderColor}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder}
          disabled={disabled}
          required={true}
          onChange={handleInputChange}
          value={value}
          type={type === "text" || type === undefined ? "text" : inputWathc ? "text" : "password"}
          {...rest}
        >
        </InputStyled>
        {type === "password" &&
          <InputButton onClick={onClickWatch} src={inputWathc ? "https://sun9-27.userapi.com/impg/9etYg4sIVh7D-_7IWpIsuuFMkNyvNV_0Exb-UA/oxid5GfQgu0.jpg?size=512x512&quality=95&sign=72d9a93faba28c38aa42bd25f795d568&type=album" : "https://sun9-38.userapi.com/s/v1/ig2/Dw7dc9dnJV57EC15GjwGFF3TvLqfjFgoU7e4imppf0ueuZ94MkJkOpSZwqM4423lIPLVX5R7fl0qqX6rvnBYfeJY.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,512x512&from=bu&u=YDDMs-7Vxyfv3ECEw8oHNOMxRSUtMZVJyoCg9QwtECc&cs=512x512"}/>        }
      </InputContainer>
      {error && <Text align='center' style={{marginTop: 5, wordBreak: 'break-all'}} themeFont={theme.fonts.m1} themeColor={'red'}>
        {error}
      </Text>}
    </>
  );
});

