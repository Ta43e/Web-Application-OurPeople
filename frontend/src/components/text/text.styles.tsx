import styled from "styled-components";
import { FontProps, theme } from "../../themes/theme";


export type TextProps = {
    font: FontProps;
    color?: string;
    padding?: number | [number?, number?, number?, number?];
    transform? : 'lowercase' | 'uppercase';
    align?: 'center' | 'right' | 'left';
};

export const StyledText = styled.div<TextProps>`
    margin: 0;
    width: auto;
    height: auto;
    text-align: ${props => props.align};
    padding: ${({ padding }) => {
    if (typeof padding === "number") {
      return `${padding}px`;
    }
    if (Array.isArray(padding)) {
      if (padding.length === 1) {
        return padding[0];
      }
      if (padding.length === 2) {
        return `${padding[0]}px ${padding[1]}px`;
      }
      if (padding.length === 4) {
        return `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`;
      }
    }
    return "0";
  }};
    font-family: ${props => props.font.family};
    font-size: ${props => props.font.desktopSize};
    font-weight: ${props => props.font.weight};
    color: ${props => props.color !== undefined ? props.color : 'black'};
    text-transform: ${props => props.transform !== undefined ? props.transform : 'none'};
    @media (max-width: ${theme.toMobileSize + "px"}){
       font-size: ${props => props.font.mobileSize};
    }
`;