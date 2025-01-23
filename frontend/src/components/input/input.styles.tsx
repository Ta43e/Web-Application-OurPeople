import styled from "styled-components";
import { theme } from "../../themes/theme";

export const InputContainer = styled.div<{ width?: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: ${props => props.width? props.width + 'px' : '420px'};
  box-sizing: border-box;
  padding: 0px;
  @media (max-width: ${theme.toMobileSize+'px'}){
    width: 100%;
  }
`;

export const InputStyled = styled.input<{
  themeColor?: string;
  textColor?: string;
  borderColor?: string;
}>`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${({ borderColor }) => borderColor || "black"};
  padding: 12px 38px 12px 14px;
  display: flex;
  border-radius: 5px;
  background-color: ${({ themeColor }) => themeColor || "white"};
  color: ${({ textColor }) => textColor || "black"};
`;

export const InputButton = styled.img<{ src: string }>`
  position: absolute;
  width: 20px;
  height: 20px;
  right: 14px;
  border: 0px;
  cursor: pointer;
`;
